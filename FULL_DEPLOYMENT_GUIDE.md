# 🚀 Полное руководство по развертыванию сайта на сервере

Эта инструкция описывает все шаги от момента, когда файлы уже добавлены на сервер, до полностью рабочего сайта с HTTPS.

---

## 📋 Оглавление

1. [Проверка Node.js](#-проверка-nodejs)
2. [Установка зависимостей](#-установка-зависимостей)
3. [Сборка проекта](#-сборка-проекта)
4. [Настройка Nginx](#-настройка-nginx)
5. [Получение SSL сертификата](#-получение-ssl-сертификата-через-certbot)
6. [Запуск с PM2](#-запуск-приложения-через-pm2)
7. [Проверка и мониторинг](#-проверка-и-мониторинг)
8. [Устранение проблем](#-устранение-проблем)

---

## ✅ Проверка Node.js

```bash
# Проверить текущую версию
node --version
npm --version

# Требуемые версии для Next.js 16:
# Node.js >= 20.9.0
# npm >= 9.0.0
```

**Если версия Node.js меньше 20.9.0:**

```bash
# Обновить через nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Перезагрузить shell
source ~/.bashrc
# или для zsh:
source ~/.zshrc

# Установить Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Проверить версию
node --version  # должно быть v20.x.x
npm --version   # должно быть >= 9
```

---

## 📦 Установка зависимостей

```bash
# Перейти в директорию проекта
cd /var/www/site_maxvich

# Проверить наличие файлов
ls -la package.json  # должен существовать

# Если папка node_modules существует, удалить её
rm -rf node_modules package-lock.json

# Установить зависимости
# ВАЖНО: используйте флаг --legacy-peer-deps для ESLint 9
npm install --legacy-peer-deps

# Проверить наличие уязвимостей
npm audit
# Результат должен быть: found 0 vulnerabilities
```

**Если ошибка с ERESOLVE:**

```bash
# Используйте флаг --force (последняя попытка)
npm install --legacy-peer-deps --force
```

---

## 🏗️ Сборка проекта

```bash
# Проверить наличие tsconfig.json
cat tsconfig.json | grep -A 2 '"jsx"'
# Должно быть: "jsx": "react-jsx"

# Запустить сборку
npm run build

# Ожидаемый результат:
# ✓ Compiled successfully
# ✓ TypeScript validation passed
```

**Если ошибки при сборке:**

```bash
# Проверить все ошибки
npm run build 2>&1 | tee build.log

# Если нужно почистить кеш
rm -rf .next
npm run build
```

---

## 🌐 Настройка Nginx

### Шаг 1: Установить Nginx (если не установлен)

```bash
# Debian/Ubuntu
sudo apt update
sudo apt install nginx -y

# CentOS/RedHat
sudo yum install nginx -y
```

### Шаг 2: Создать конфиг для сайта

```bash
# Создать файл конфига
sudo nano /etc/nginx/sites-available/maxvich.conf
```

Вставить конфиг (замените `your-domain.com` на ваш домен):

```nginx
upstream nextjs_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS (после получения сертификата)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL сертификаты будут добавлены автоматически Certbot'ом
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Безопасность SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip сжатие
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;
    gzip_min_length 1000;

    # Размер клиента
    client_max_body_size 50M;

    # Логи
    access_log /var/log/nginx/maxvich-access.log;
    error_log /var/log/nginx/maxvich-error.log;

    # Проксирование к Next.js приложению
    location / {
        proxy_pass http://nextjs_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Статические файлы (кешируются)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://nextjs_app;
        proxy_cache_valid 30d;
        proxy_cache_bypass $http_pragma $http_authorization;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

### Шаг 3: Активировать конфиг

```bash
# Включить сайт
sudo ln -s /etc/nginx/sites-available/maxvich.conf /etc/nginx/sites-enabled/maxvich.conf

# Проверить корректность конфига
sudo nginx -t
# Должно быть: nginx: configuration file test is successful

# Перезагрузить Nginx
sudo systemctl reload nginx
```

---

## 🔒 Получение SSL сертификата через Certbot

### Шаг 1: Установить Certbot

```bash
# Debian/Ubuntu
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RedHat
sudo yum install certbot python3-certbot-nginx -y
```

### Шаг 2: Получить сертификат

```bash
# Замените your-domain.com на ваш домен
# Certbot автоматически обновит конфиг Nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Ответьте на вопросы:
# 1. Введите email для уведомлений о возобновлении
# 2. Согласитесь с условиями (yes)
# 3. Согласитесь делиться email (ваш выбор)
# 4. Выберите опцию: "2: Redirect" (автоматический редирект на HTTPS)
```

### Шаг 3: Проверить сертификат

```bash
# Проверить наличие сертификата
ls -la /etc/letsencrypt/live/your-domain.com/

# Проверить статус сертификата
sudo certbot certificates

# Тест обновления (без фактического обновления)
sudo certbot renew --dry-run
```

### Шаг 4: Автоматическое обновление

```bash
# Включить автоматическое обновление сертификата
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Проверить статус
sudo systemctl status certbot.timer
```

---

## 📊 Запуск приложения через PM2

### Шаг 1: Установить PM2 глобально

```bash
sudo npm install -g pm2
```

### Шаг 2: Запустить приложение

```bash
# Перейти в директорию проекта
cd /var/www/site_maxvich

# Вариант 1: Запустить через конфиг
pm2 start ecosystem.config.js --env production

# Вариант 2: Запустить напрямую
pm2 start npm --name "maxvich-site" -- start

# Вариант 3: С дополнительными настройками
pm2 start ecosystem.config.js --env production --watch --merge-logs
```

### Шаг 3: Сделать PM2 автозагружаемым

```bash
# Сгенерировать startup скрипт
sudo pm2 startup

# Сохранить текущий список процессов PM2
pm2 save

# Проверить
sudo systemctl status pm2-root
```

### Шаг 4: Проверить статус

```bash
# Показать все процессы
pm2 status

# Показать логи
pm2 logs maxvich-site
# или
pm2 logs

# Показать экспорт моніторинга
pm2 monit
```

---

## ✔️ Проверка и мониторинг

### 1️⃣ Проверить, что сайт работает

```bash
# Проверить локально на сервере
curl http://localhost:3000
curl https://localhost:3000

# Или проверить через домен
curl -I https://your-domain.com
# Ожидаемый результат: HTTP/2 200 или 301 redirect
```

### 2️⃣ Проверить статус Nginx

```bash
# Статус Nginx
sudo systemctl status nginx

# Перезагрузить Nginx (если нужно)
sudo systemctl reload nginx
sudo systemctl restart nginx

# Проверить логи
sudo tail -50 /var/log/nginx/maxvich-error.log
sudo tail -50 /var/log/nginx/maxvich-access.log
```

### 3️⃣ Проверить PM2

```bash
# Статус процессов
pm2 status

# Логи (последние 50 строк)
pm2 logs --lines 50

# Рестарт процесса (если зависло)
pm2 restart maxvich-site
```

### 4️⃣ Проверить сертификат HTTPS

```bash
# Открыть в браузере
https://your-domain.com

# Или проверить через openssl
openssl s_client -connect your-domain.com:443 < /dev/null | grep -E "subject=|issuer="

# Проверить дату истечения
openssl s_client -connect your-domain.com:443 < /dev/null | grep "notAfter"
```

### 5️⃣ Функциональная проверка

Откройте сайт в браузере и проверьте:

- ✅ Главная страница загружается
- ✅ HTTPS работает (зеленый замок)
- ✅ Калькулятор работает
- ✅ Загрузка файлов в админке работает
- ✅ Заявки с контактной формы сохраняются
- ✅ Портфолио/услуги загружаются
- ✅ Мобильная версия адаптивна

---

## 🔧 Устранение проблем

### Ошибка 1: "Connection refused" (порт 3000)

```bash
# Проверить, запущено ли приложение
pm2 status

# Если не запущено:
pm2 start ecosystem.config.js --env production

# Проверить логи
pm2 logs --lines 100
```

### Ошибка 2: "502 Bad Gateway"

```bash
# Проверить статус Next.js приложения
curl http://localhost:3000

# Если не работает, проверить логи
pm2 logs

# Рестартовать приложение
pm2 restart maxvich-site

# Или пересобрать проект
cd /var/www/site_maxvich
npm run build
pm2 kill
pm2 start ecosystem.config.js --env production
```

### Ошибка 3: "Certbot не находит домен"

```bash
# Проверить DNS
nslookup your-domain.com
dig your-domain.com @8.8.8.8

# Убедиться, что Nginx слушает на 80 порту
sudo ss -tlnp | grep :80

# Если нет конфликтов, повторить:
sudo certbot --nginx -d your-domain.com
```

### Ошибка 4: "EADDRINUSE: address already in use"

```bash
# Найти процесс на порту 3000
sudo lsof -i :3000

# Убить процесс (не рекомендуется)
kill -9 <PID>

# Лучше: очистить PM2
pm2 kill
pm2 start ecosystem.config.js --env production
```

### Ошибка 5: Медленная загрузка файлов

```bash
# Проверить размер файла, который нужно загрузить
# В конфиге Nginx установлено: client_max_body_size 50M

# Если нужно увеличить:
sudo nano /etc/nginx/sites-available/maxvich.conf
# Найти строку: client_max_body_size 50M
# Изменить на нужное значение (например 100M)
sudo nginx -t
sudo systemctl reload nginx
```

### Ошибка 6: HTTPS перенаправляет бесконечно

```bash
# Проверить конфиг Nginx
sudo cat /etc/nginx/sites-available/maxvich.conf | grep -A 5 "ssl_certificate"

# Если сертификат не найден:
sudo certbot --nginx -d your-domain.com

# Проверить рабочие сертификаты:
ls -la /etc/letsencrypt/live/
```

---

## 📅 Обслуживание

### Еженедельная проверка

```bash
# Проверить статус приложения
pm2 status

# Проверить дисковое пространство
df -h

# Проверить статус файла
pm2 restart maxvich-site
```

### Месячная проверка

```bash
# Проверить статус сертификата
sudo certbot certificates

# Проверить логи ошибок
sudo tail -100 /var/log/nginx/maxvich-error.log

# Очистить кеш (если нужно)
cd /var/www/site_maxvich
rm -rf .next
npm run build
pm2 restart maxvich-site
```

### Половина года - обновление зависимостей

```bash
# Проверить уязвимости
npm audit

# Обновить если нужно
npm audit fix
npm update --legacy-peer-deps

# Пересобрать и рестартовать
npm run build
pm2 restart maxvich-site
```

---

## 📞 Команды для быстрого доступа

```bash
# Быстрый перезапуск
pm2 restart maxvich-site

# Просмотр логов в реальном времени
pm2 logs maxvich-site --lines 50 --follow

# Остановить приложение
pm2 stop maxvich-site

# Снова запустить
pm2 start maxvich-site

# Удалить из PM2
pm2 delete maxvich-site

# Полный рестарт
pm2 kill && pm2 start ecosystem.config.js --env production

# Проверка SSL сертификата
openssl s_client -connect your-domain.com:443 -showcerts < /dev/null | grep -E "CN=|issuer=" | head -5

# Косячка с Nginx - проверить конфиг перед перезагрузкой
sudo nginx -t
```

---

## 🎉 Готово!

После выполнения всех шагов ваш сайт должен быть полностью рабочим:

✅ Next.js 16.1.6 на Node.js 20+  
✅ HTTPS с валидным сертификатом Let's Encrypt  
✅ Nginx reverse proxy  
✅ PM2 автозагрузка и мониторинг  
✅ 0 уязвимостей безопасности  
✅ Автоматическое обновление сертификата  

---

## 📋 Быстрая справка по файлам

| Файл | Описание |
|------|---------|
| `/var/www/site_maxvich/` | Директория проекта |
| `/etc/nginx/sites-available/maxvich.conf` | Конфиг Nginx |
| `/etc/letsencrypt/live/your-domain.com/` | SSL сертификаты |
| `ecosystem.config.js` | Конфиг PM2 |
| `.env.local` | Переменные окружения (если нужны) |

---

**Дата создания:** 3 марта 2026  
**Версия Next.js:** 16.1.6  
**Node.js требуемая версия:** >= 20.9.0  
**Статус безопасности:** 0 уязвимостей
