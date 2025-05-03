from ultralytics import YOLO

# Загружаем модель
model = YOLO('runs/detect/parking_space_model13/weights/best.pt')  # Путь к твоей предобученной модели

# Запускаем обучение
model.train(
    data='/Users/glebivanov/parking-system/datasets/parking_space/data.yaml',  # Путь к data.yaml
    epochs=50,  # Количество эпох (можно уменьшить для теста)
    imgsz=640,  # Размер изображения
    batch=16,  # Размер батча (настрой под свою видеокарту)
    name='parking_space_model'  # Имя эксперимента
)