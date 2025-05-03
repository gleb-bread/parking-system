import time
import mysql.connector
import os
import logging
import json
from ultralytics import YOLO

# === ЛОГИ ===
LOG_DIR = 'logs'
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    filename=os.path.join(LOG_DIR, 'worker.log'),
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def log_info(msg):
    print(msg)
    logging.info(msg)

def log_error(msg):
    print(msg)
    logging.error(msg)

# === КОНФИГ БД ===
DB_CONFIG = {
    'host': 'localhost',
    'user': 'gleb',
    'port': 8889,
    'password': 'g0f9d8s7A',
    'database': 'parking',
    'autocommit': True
}

# === МОДЕЛЬ YOLO ===
# Используем обученную модель из runs/detect/parking_space_model11/weights/best.pt
model = YOLO('runs/detect/parking_space_model/weights/best.pt')

# Порог уверенности
CONFIDENCE_THRESHOLD = 0.3

# === ФУНКЦИИ ===

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

def fetch_next_task(cursor):
    cursor.execute("""
        SELECT * FROM ai_requests
        WHERE status = 'queued'
        ORDER BY created_at ASC
        LIMIT 1
    """)
    return cursor.fetchone()

def update_status(cursor, task_id, status):
    cursor.execute("UPDATE ai_requests SET status = %s WHERE id = %s", (status, task_id))

def update_response(cursor, task_id, response, accuracy, time_spent):
    cursor.execute("""
        UPDATE ai_requests
        SET status = 'success', response = %s, accuracy = %s, time = %s
        WHERE id = %s
    """, (response, accuracy, time_spent, task_id))

def update_error(cursor, task_id, error_msg, time_spent):
    cursor.execute("""
        UPDATE ai_requests
        SET status = 'error', response = %s, accuracy = NULL, time = %s
        WHERE id = %s
    """, (error_msg, time_spent, task_id))

def get_upload_path(cursor, upload_id):
    cursor.execute("SELECT path FROM user_uploads WHERE id = %s", (upload_id,))
    row = cursor.fetchone()
    return row['path'] if row else None

def process_task(cursor, task):
    task_id = task['id']
    upload_id = task['upload_id']

    update_status(cursor, task_id, 'processing')

    start_time = time.time()

    upload_path = get_upload_path(cursor, upload_id)
    if not upload_path:
        elapsed = time.time() - start_time
        update_error(cursor, task_id, f"File not found for upload_id {upload_id}", elapsed)
        log_error(f"[Task {task_id}] ❌ Файл не найден для upload_id={upload_id}")
        return

    file_path = os.path.join('storage/app/public', upload_path)

    try:
        # Предсказание с помощью модели
        results = model(file_path, imgsz=640)  # Можно увеличить imgsz для больших изображений
        boxes = results[0].boxes

        # Отфильтруем объекты типа "occupied" (class == 0) и "vacant" (class == 1)
        occupied_spots = [b for b in boxes if int(b.cls[0]) == 0]  # Класс 0 — это occupied
        vacant_spots = [b for b in boxes if int(b.cls[0]) == 1]    # Класс 1 — это vacant

        # Оставим только с нормальной уверенностью
        filtered_occupied = [b for b in occupied_spots if float(b.conf[0]) > CONFIDENCE_THRESHOLD]
        filtered_vacant = [b for b in vacant_spots if float(b.conf[0]) > CONFIDENCE_THRESHOLD]

        # Подсчитаем общее количество мест (occupied + vacant)
        total_spots = len(filtered_occupied) + len(filtered_vacant)

        # Проверка валидности изображения: если нет ни занятых, ни свободных мест
        if total_spots == 0:
            elapsed = time.time() - start_time
            update_error(cursor, task_id, "Изображение невалидно: не обнаружены парковочные места", elapsed)
            log_info(f"[Task {task_id}] ⚠️ Парковочные места не найдены (ни занятых, ни свободных)")
            return

        occupied_count = len(filtered_occupied)
        occupancy_rate = round((occupied_count / total_spots) * 100, 2) if total_spots > 0 else 0

        # Преобразуем bbox + confidence к сериализуемым типам
        occupied_data = [{
            "confidence": float(b.conf[0]),
            "box": list(map(float, b.xyxy[0]))
        } for b in filtered_occupied]

        vacant_data = [{
            "confidence": float(b.conf[0]),
            "box": list(map(float, b.xyxy[0]))
        } for b in filtered_vacant]

        # Формируем итоговый результат
        detection_summary = json.dumps({
            "occupied_count": occupied_count,
            "vacant_count": len(filtered_vacant),
            "total_spots": total_spots,
            "occupancy_rate": occupancy_rate,
            "occupied_spots": occupied_data,
            "vacant_spots": vacant_data
        })

        # Сохранение результата в файл для отладки
        with open(os.path.join(LOG_DIR, f"task_{task_id}_result.json"), "w") as f:
            json.dump(json.loads(detection_summary), f, indent=4)

        elapsed = time.time() - start_time
        update_response(cursor, task_id, detection_summary, occupancy_rate, elapsed)

        # Логирование в зависимости от ситуации
        if occupied_count == total_spots:
            log_info(f"[Task {task_id}] ✅ Успешно: Все {total_spots} мест заняты, 100% заполнено, за {elapsed:.2f}s")
        else:
            log_info(f"[Task {task_id}] ✅ Успешно: {occupied_count}/{total_spots} мест занято, {occupancy_rate}% заполнено, за {elapsed:.2f}s")

    except Exception as e:
        elapsed = time.time() - start_time
        update_error(cursor, task_id, str(e), elapsed)
        log_error(f"[Task {task_id}] ❌ Ошибка обработки: {e}")

def main():
    log_info("🚀 Воркер запущен")
    while True:
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            task = fetch_next_task(cursor)
            if task:
                log_info(f"📥 Найдена задача ID={task['id']}")
                process_task(cursor, task)
            else:
                time.sleep(2)

        except mysql.connector.Error as db_err:
            log_error(f"💥 Ошибка БД: {db_err}")
            time.sleep(5)
        except Exception as err:
            log_error(f"💥 Общая ошибка воркера: {err}")
            time.sleep(5)
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()

if __name__ == "__main__":
    main()