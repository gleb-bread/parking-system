import time
import mysql.connector
import os
import logging
import json
from datetime import datetime
import requests
from ultralytics import YOLO

# === ЛОГИ ===
LOG_DIR = 'logs'
os.makedirs(LOG_DIR, exist_ok=True)

RESULT_DIR = 'public/storage/result'
os.makedirs(RESULT_DIR, exist_ok=True)

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

# === URL Laravel-эндпоинта ===
LARAVEL_ENDPOINT = 'http://localhost:8000/api/ai-request'

# === МОДЕЛЬ YOLO ===
model = YOLO('runs/detect/parking_space_model/weights/best.pt')
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

def update_response(cursor, task_id, response, accuracy, time_spent, result_img_path):
    cursor.execute("""
        UPDATE ai_requests
        SET status = 'success', response = %s, accuracy = %s, time = %s, result_img = %s
        WHERE id = %s
    """, (response, accuracy, time_spent, result_img_path, task_id))

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

def notify_laravel(task_id, conn):
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM ai_requests WHERE id = %s", (task_id,))
        data = cur.fetchone()
        if not data:
            log_error(f"[Task {task_id}] ❗ Не удалось получить данные для отправки")
            return

        def convert_datetime(obj):
            if isinstance(obj, datetime):
                return obj.strftime('%Y-%m-%d %H:%M:%S')
            raise TypeError("Type not serializable")

        try:
            data = json.loads(json.dumps(data, default=convert_datetime))
        except TypeError as e:
            log_error(f"[Task {task_id}] ❗ Ошибка сериализации данных: {e}")
            return

        response = requests.patch(LARAVEL_ENDPOINT, json=data)
        if response.status_code == 200:
            log_info(f"[Task {task_id}] 🔔 Laravel уведомлен об обновлении")
        else:
            log_error(f"[Task {task_id}] ⚠️ Ошибка при POST в Laravel: {response.status_code}, {response.text}")
    except Exception as e:
        log_error(f"[Task {task_id}] 💥 Ошибка при отправке запроса в Laravel: {e}")

def process_task(conn, cursor, task):
    task_id = task['id']
    upload_id = task['upload_id']
    update_status(cursor, task_id, 'processing')
    start_time = time.time()

    upload_path = get_upload_path(cursor, upload_id)
    if not upload_path:
        elapsed = time.time() - start_time
        update_error(cursor, task_id, f"File not found for upload_id {upload_id}", elapsed)
        log_error(f"[Task {task_id}] ❌ Файл не найден для upload_id={upload_id}")
        notify_laravel(task_id, conn)
        return

    file_path = os.path.join('storage/app/public', upload_path)

    try:
        results = model(file_path, imgsz=640)
        boxes = results[0].boxes

        occupied_spots = [b for b in boxes if int(b.cls[0]) == 0]
        vacant_spots = [b for b in boxes if int(b.cls[0]) == 1]

        filtered_occupied = [b for b in occupied_spots if float(b.conf[0]) > CONFIDENCE_THRESHOLD]
        filtered_vacant = [b for b in vacant_spots if float(b.conf[0]) > CONFIDENCE_THRESHOLD]

        total_spots = len(filtered_occupied) + len(filtered_vacant)

        if total_spots == 0:
            elapsed = time.time() - start_time
            update_error(cursor, task_id, "Изображение невалидно: не обнаружены парковочные места", elapsed)
            log_info(f"[Task {task_id}] ⚠️ Парковочные места не найдены")
            notify_laravel(task_id, conn)
            return

        occupied_count = len(filtered_occupied)
        occupancy_rate = round((occupied_count / total_spots) * 100, 2)

        occupied_data = [{"confidence": float(b.conf[0]), "box": list(map(float, b.xyxy[0]))} for b in filtered_occupied]
        vacant_data = [{"confidence": float(b.conf[0]), "box": list(map(float, b.xyxy[0]))} for b in filtered_vacant]

        detection_summary = json.dumps({
            "occupied_count": occupied_count,
            "vacant_count": len(filtered_vacant),
            "total_spots": total_spots,
            "occupancy_rate": occupancy_rate,
            "occupied_spots": occupied_data,
            "vacant_spots": vacant_data
        })

        # Сохраняем изображение с аннотациями
        result_image_path = os.path.join(RESULT_DIR, f"task_{task_id}_result.jpg")
        results[0].save(filename=result_image_path)

        # Путь для БД без public/storage
        relative_result_path = result_image_path.replace('public/storage/', '')

        with open(os.path.join(LOG_DIR, f"task_{task_id}_result.json"), "w") as f:
            json.dump(json.loads(detection_summary), f, indent=4)

        elapsed = time.time() - start_time
        update_response(cursor, task_id, detection_summary, occupancy_rate, elapsed, relative_result_path)

        log_info(f"[Task {task_id}] ✅ Обработано: {occupied_count}/{total_spots} занято, {occupancy_rate}%")

        notify_laravel(task_id, conn)

    except Exception as e:
        elapsed = time.time() - start_time
        update_error(cursor, task_id, str(e), elapsed)
        log_error(f"[Task {task_id}] ❌ Ошибка: {e}")
        notify_laravel(task_id, conn)

def main():
    log_info("🚀 Воркер запущен")
    while True:
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            task = fetch_next_task(cursor)
            if task:
                log_info(f"📥 Задача найдена: ID={task['id']}")
                process_task(conn, cursor, task)
            else:
                time.sleep(2)

        except mysql.connector.Error as db_err:
            log_error(f"💥 Ошибка БД: {db_err}")
            time.sleep(5)
        except Exception as err:
            log_error(f"💥 Общая ошибка: {err}")
            time.sleep(5)
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()

if __name__ == "__main__":
    main()
