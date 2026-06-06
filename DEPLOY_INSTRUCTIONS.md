# Инструкция по развертыванию обновлений безопасности

## Что было сделано

✅ Устранены все 8 уязвимостей (0 vulnerabilities)
✅ Обновлен Next.js с 14.2.35 до 16.1.6
✅ Обновлен Swiper (критическая уязвимость)
✅ Обновлен Axios, ESLint, eslint-config-next
✅ Исправлены все breaking changes для Next.js 16
✅ Проверена сборка - успешная компиляция

## Шаг 1: Обновление Node.js на сервере

Next.js 16 требует Node.js >= 20.9.0

```bash
# Установка/обновление через nvm
nvm install 20
nvm use 20
nvm alias default 20

# Проверка версии
node --version  # должно быть >= 20.9.0
```

## Шаг 2: Развертывание кода на сервере

```bash
# Перейти в директорию проекта
cd /var/www/site_maxvich

# Остановить текущий процесс (если запущен через PM2)
pm2 stop all

# Получить обновления из репозитория
git fetch origin

# Переключиться на ветку с исправлениями
git checkout fix/security-updates-202603031720

# Или вариант 2: смержить с текущей веткой
# git checkout gleb
# git merge origin/fix/security-updates-202603031720

# Удалить старые зависимости
rm -rf node_modules package-lock.json

# Установить зависимости (ВАЖНО: используйте --legacy-peer-deps)
npm install --legacy-peer-deps

# Проверка безопасности
npm audit
# Должно быть: found 0 vulnerabilities

# Запустить сборку
npm run build
```

## Шаг 3: Запуск приложения

```bash
# Вариант 1: Через PM2 (рекомендуется)
pm2 start ecosystem.config.js --env production

# Проверить статус
pm2 status
pm2 logs

# Вариант 2: Напрямую (для тестирования)
npm start
```

## Шаг 4: Проверка работоспособности

1. Откройте сайт в браузере
2. Проверьте основные разделы:
   - Главная страница
   - Калькулятор
   - Портфолио
   - Услуги
   - Видео

3. Проверьте админку на `https://your-domain.com/adminmaxrem`:
   - Авторизация
   - Загрузка фото для услуг/проектов
   - Редактирование данных
   - Просмотр заявок

## Важные изменения

### Next.js 16
- Требует Node.js >= 20.9.0
- `jsx: "react-jsx"` в tsconfig.json (автоматически обновлено)
- Async params в API routes (уже исправлено во всех файлах)

### Обновленные зависимости
```json
{
  "next": "16.1.6",
  "swiper": "12.1.2",
  "axios": "1.7.10",
  "eslint": "9.18.0",
  "eslint-config-next": "16.1.6"
}
```

## Устранение проблем

### Ошибка: "eslint peer dependency"
```bash
npm install --legacy-peer-deps
```

### Ошибка: "Node.js version required"
```bash
# Обновите Node.js до версии >= 20.9.0
nvm install 20
nvm use 20
```

### Ошибка сборки: "Type error in route params"
✅ Уже исправлено в коде. Если видите эту ошибку - убедитесь, что вы на правильной ветке:
```bash
git branch  # должно быть: fix/security-updates-202603031720
```

## Откат (если что-то пошло не так)

```bash
# Вернуться на предыдущую версию
cd /var/www/site_maxvich
git checkout gleb  # или другая рабочая ветка
git pull origin gleb

# Переустановить старые зависимости
rm -rf node_modules package-lock.json
npm install
npm run build

# Перезапустить
pm2 restart all
```

## Контакты для поддержки

- Репозиторий: https://github.com/Blizzek/site_maxvich1
- Ветка с исправлениями: `fix/security-updates-202603031720`
- Pull Request: https://github.com/Blizzek/site_maxvich1/pull/new/fix/security-updates-202603031720

## Следующие шаги (опционально)

После успешного тестирования на сервере:

1. Создать Pull Request для слияния в основную ветку
2. Удалить старые ветки
3. Настроить автоматические обновления безопасности через Dependabot

---
**Дата создания:** 3 марта 2026  
**Версия Next.js:** 16.1.6  
**Статус безопасности:** 0 уязвимостей
