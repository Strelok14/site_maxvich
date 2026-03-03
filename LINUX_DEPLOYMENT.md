# Инструкции развёртывания на Linux сервере

## Подготовка проекта

### 1. Клонируем проект
```bash
git clone https://github.com/Blizzek/site_maxvich1.git
cd site_maxvich1
git checkout gleb
```

### 2. Создаём необходимые папки для загруженных файлов
```bash
# Создаём папку для картинок услуг
mkdir -p public/uploads/services
mkdir -p data/uploads/services
mkdir -p data/uploads/projects
mkdir -p data/uploads/videos

# Устанавливаем права доступа (если нужны)
chmod 755 public/uploads
chmod 755 data/uploads
```

### 3. Загружаем картинки услуг

**ВАЖНО:** В папку `public/uploads/services/` нужно добавить следующие изображения:
- `kapremont.jpg` - Капитальный ремонт квартиры
- `kosmetik.jpg` - Косметический ремонт
- `novostroy.jpg` - Отделка новостройки
- `bathroom.jpg` - Ремонт ванной под ключ
- `kitchen.jpg` - Ремонт кухни
- `tile.jpg` - Плиточные работы
- `electro.jpg` - Электромонтаж
- `ceiling.jpg` - Натяжные потолки

**Путь:** `/var/www/site_maxvich1/public/uploads/services/`

### 4. Установка зависимостей и запуск
```bash
npm install

# Для development
npm run dev

# Для production
npm run build
npm start
```

## Структура папок для загрузки файлов

```
site_maxvich1/
├── public/
│   └── uploads/
│       ├── services/          ← Картинки услуг (JPG/PNG)
│       ├── projects/          ← Проекты портфолио
│       └── videos/            ← Видео проектов
├── data/
│   ├── uploads/
│   │   ├── services/
│   │   ├── projects/
│   │   └── videos/
│   └── *.json                 ← JSON файлы с данными
└── src/
```

## Примечание

На Linux сервере изображения будут загружаться через API эндпоинт:
`/api/files/services/{filename}`

Картинки из папки `public/uploads/services/` автоматически будут отображаться в разделе "Услуги".

## Настройка переменных окружения

Создайте файл `.env.local` если требуется:
```bash
# Можно настроить базовый URL сервера
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## Проверка работы

1. Убедитесь, что сервер запущен: `http://localhost:3000`
2. Перейдите на главную страницу
3. Прокрутите до раздела "Услуги" - должны отобразиться картинки
4. Проверьте консоль браузера на ошибки загрузки файлов
