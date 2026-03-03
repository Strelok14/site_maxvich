#!/bin/bash
# Setup script for Linux server deployment
# Запуск: bash setup-server.sh

echo "📁 Создание необходимых папок для загруженных файлов..."

# Создаём папки в public
mkdir -p public/uploads/services
mkdir -p public/uploads/projects
mkdir -p public/uploads/videos

# Создаём папки в data
mkdir -p data/uploads/services
mkdir -p data/uploads/projects
mkdir -p data/uploads/videos

# Устанавливаем права доступа (755 = чтение, запись, выполнение для владельца; чтение и выполнение для остальных)
chmod -R 755 public/uploads
chmod -R 755 data/uploads

echo "✅ Папки созданы успешно!"
echo ""
echo "📋 Структура папок:"
echo "  public/uploads/"
echo "  ├── services/  ← Добавьте сюда картинки услуг (JPG/PNG)"
echo "  ├── projects/  ← Проекты портфолио"
echo "  └── videos/    ← Видео проектов"
echo ""
echo "🚀 Теперь запустите проект:"
echo "  npm install"
echo "  npm run build"
echo "  npm start"
echo ""
echo "⚠️  ВАЖНО: Добавьте файлы картинок в public/uploads/services/"
echo "   - kapremont.jpg"
echo "   - kosmetik.jpg"
echo "   - novostroy.jpg"
echo "   - bathroom.jpg"
echo "   - kitchen.jpg"
echo "   - tile.jpg"
echo "   - electro.jpg"
echo "   - ceiling.jpg"
