# Развертывание на Nginx сервере

## 1. Подготовка файлов для сервера

Производительная сборка выполняется в режиме `output: 'standalone'`.
Готовый сервер находится в `.next/standalone/server.js`, статические файлы — в `.next/static/`.
Для деплоя не требуется полная папка `node_modules`, но для оптимизации изображений на сервере должен быть установлен пакет `sharp`.

### Файлы для загрузки на сервер:
```
dist/                         → папка для загрузки на сервер
    server.js                   → стартовый файл сервера (из .next/standalone)
    .next/static/               → статические ассеты Next.js
    public/                     → статичные файлы сайта
    data/uploads/{videos,projects}/ → хранилище загружаемых файлов (создается автоматически)
    package.json                → конфигурация проекта (для совместимости)
```

---

## 2. Установка на сервер

### Шаг 1: Загрузите файлы на сервер
```bash
# На сервере создайте папку проекта
sudo mkdir -p /var/www/maxvich-stroi
cd /var/www/maxvich-stroi

# Загрузите подготовленный бандл dist/ через SCP или FTP:
# scp -r dist/* user@server:/var/www/maxvich-stroi/
```

### Шаг 2: Установите Node.js (если еще не установлен)
```bash
# Проверьте версию Node
node --version
npm --version

# Если не установлен, установите (Node 18+):
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установите sharp (требуется для оптимизации изображений в standalone)
npm i sharp --omit=dev
```

### Шаг 3: Переходим в папку проекта
```bash
cd /var/www/maxvich-stroi
```

---

## 3. Запуск Next.js приложения (standalone)

Запуск производится из корня папки деплоя (`/var/www/maxvich-stroi`):

```bash
node server.js
```

После старта:
- Local:        http://localhost:3000
- Network:      http://0.0.0.0:3000

Если требуется автозапуск и рестарт, используйте pm2:

```bash
npm i -g pm2
pm2 start server.js --name maxvich-stroi
pm2 save
pm2 startup
```

### Вариант 1: С помощью PM2 (рекомендуется)
```bash
# Установите PM2 глобально
sudo npm install -g pm2

# Запустите приложение
pm2 start npm --name "maxvich-stroi" -- start

# Сохраните конфиг PM2
pm2 save

# Установите автозапуск при перезагрузке
pm2 startup
```

### Вариант 2: С помощью systemd (альтернатива)
Создайте файл `/etc/systemd/system/maxvich-stroi.service`:
```ini
[Unit]
Description=Maxvich Stroi Next.js Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/maxvich-stroi
ExecStart=/usr/bin/node /var/www/maxvich-stroi/node_modules/.bin/next start
Restart=always
RestartSec=5s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Затем:
```bash
sudo systemctl daemon-reload
sudo systemctl start maxvich-stroi
sudo systemctl enable maxvich-stroi
```

---

## 4. Конфигурация Nginx

### Создайте конфиг для вашего сайта:
Файл: `/etc/nginx/sites-available/maxvich-stroi`

```nginx
upstream nextjs_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name ваш_домен.ru www.ваш_домен.ru;

    # Редирект на HTTPS (опционально, если есть SSL)
    # return 301 https://$server_name$request_uri;

    root /var/www/maxvich-stroi/public;

    # Кэширование статичных файлов
    location /_next/static {
        expires 30d;
        add_header Cache-Control "public, immutable";
        proxy_pass http://nextjs_backend;
    }

    # Кэширование public папки
    location /static {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /uploads {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Все остальные запросы идут в Next.js
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        proxy_buffering off;
    }

    # Запрет на доступ к скрытым файлам
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### Включите конфиг:
```bash
# Создайте symlink
sudo ln -s /etc/nginx/sites-available/maxvich-stroi /etc/nginx/sites-enabled/

# Проверьте синтаксис
sudo nginx -t

# Перезагрузите Nginx
sudo systemctl reload nginx
```

---

## 5. SSL сертификат (Let's Encrypt)

```bash
# Установите certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Получите сертификат
sudo certbot certonly --nginx -d ваш_домен.ru -d www.ваш_домен.ru

# Обновите конфиг Nginx для HTTPS
```

Затем обновите конфиг Nginx:
```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ваш_домен.ru www.ваш_домен.ru;

    ssl_certificate /etc/letsencrypt/live/ваш_домен.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ваш_домен.ru/privkey.pem;

    # ... остальной конфиг ...
}

# Редирект с HTTP на HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ваш_домен.ru www.ваш_домен.ru;
    return 301 https://$server_name$request_uri;
}
```

---

## 6. Проверка статуса

```bash
# Проверьте, работает ли Next.js
curl http://localhost:3000

# Проверьте статус PM2 (если используете PM2)
pm2 status

# Проверьте логи
pm2 logs maxvich-stroi
# или
sudo journalctl -u maxvich-stroi -f

# Проверьте Nginx
sudo systemctl status nginx
```

---

## 7. Обновление кода

Когда нужно обновить код на сервере:

```bash
cd /var/www/maxvich-stroi

# Загрузите новые файлы (через SCP или Git)
# git pull origin main  (если используете Git)

# Пересоберите если нужно
npm run build

# Перезагрузите приложение
pm2 restart maxvich-stroi
# или
sudo systemctl restart maxvich-stroi
```

---

## Важные переменные окружения

Создайте файл `.env.local` на сервере:
```bash
cd /var/www/maxvich-stroi
nano .env.local
```

Содержимое (если требуется):
```
NODE_ENV=production
```

Перезагрузите приложение после изменений.

---

## Резервная копия

```bash
# Создайте архив проекта
tar -czf /home/user/maxvich-stroi-backup-$(date +%Y%m%d).tar.gz /var/www/maxvich-stroi

# Сохраняйте бэкапы регулярно
```

---

## Поддержка безопасности

```bash
# Установите fail2ban для защиты от bruteforce
sudo apt-get install -y fail2ban

# Скройте версию Nginx
sudo nano /etc/nginx/nginx.conf
# Добавьте в блок http:
# server_tokens off;
```

