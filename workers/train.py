from ultralytics import YOLO

# Загружаем модель
model = YOLO('runs/detect/parking_space_model11/weights/best.pt')  # Путь к твоей предобученной модели

# Запускаем обучение
model.train(
    data='/Users/glebivanov/parking-system/datasets/parking_space/data.yaml',
    epochs=50,               # можно начать с 30
    imgsz=640,               # меньше — быстрее
    batch=32,                # протестируй, сколько влезает
    name='parking_space_model',
    patience=5,              # ранняя остановка
    augment=False,           # отключить аугментации
    workers=8                # ускорить загрузку данных
)