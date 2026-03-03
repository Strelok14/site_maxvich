
# Быстрый деплой Next.js сайта на VPS Reg.ru с HTTPS, nginx и PM2

Инструкция для VPS Reg.ru с уже установленным Node.js (рекомендовано 20+), когда задача — только развернуть проект, привязать домен, настроить nginx-прокси и HTTPS.

## Предпосылки
- SSH-доступ к серверу (root или sudo)
- Node.js уже установлен и работает (`node --version`)
- Домен (например, `rem-maxvich-stroi-demo.ru`) куплен и доступен для управления DNS
- Открыты порты 80 и 443

## 1. Настройка DNS в Reg.ru
- В панели управления доменом:
    - A-запись для @ (корня) — на IPv4 вашего VPS
    - CNAME для www — на ваш домен (или A-запись на тот же IP)
    - Удалите AAAA-записи, если нет IPv6
- Дождитесь обновления DNS (5–30 минут)

## 2. Загрузка проекта на сервер
- Подключитесь по SSH к серверу
- Создайте папку для проекта:
    ```bash
    mkdir -p /var/www/site_maxvich1
    cd /var/www/site_maxvich1
    ```
- Загрузите файлы проекта (scp, SFTP, WinSCP, FileZilla и т.п.):
    - package.json, package-lock.json
    - next.config.mjs, tsconfig.json, next-env.d.ts
    - public/, src/, data/
    - .next/ (если собирали локально)
- Если .next/ не загружали — потребуется сборка на сервере

## 3. Установка зависимостей и сборка
- Перейдите в папку проекта:
    ```bash
    cd /var/www/site_maxvich1
    ```
- Установите зависимости:
    ```bash
    npm install --production
    ```
- Если нужно — соберите проект:
    ```bash
    npm run build
    ```

## 4. Запуск приложения через PM2
- Установите PM2 (если не установлен):
    ```bash
    npm install -g pm2
    ```
- Запустите приложение:
    ```bash
    pm2 start npm --name "rem-maxvich" -- start
    pm2 save
    pm2 startup  # выполните команду, которую покажет PM2
    ```
- Проверьте, что приложение слушает порт 3000:
    ```bash
    curl http://localhost:3000
    ```

## 5. Установка и выпуск SSL (Let’s Encrypt)
- Установите certbot и модуль для nginx:
    ```bash
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
    ```
- Выпустите сертификат:
    ```bash
    sudo certbot --nginx -d rem-maxvich-stroi-demo.ru -d www.rem-maxvich-stroi-demo.ru
    ```

## 6. Настройка nginx (reverse proxy)
- Создайте файл `/etc/nginx/sites-available/site_maxvich` с содержимым:
  ```nginx
  # HTTP -> HTTPS (канонично без www)
  server {
      listen 80;
      server_name rem-maxvich-stroi-demo.ru;
      return 301 https://rem-maxvich-stroi-demo.ru$request_uri;
  }

  # HTTP www -> без www
  server {
      listen 80;
      server_name www.rem-maxvich-stroi-demo.ru;
      return 301 https://rem-maxvich-stroi-demo.ru$request_uri;
  }

  # HTTPS канонический хост
  server {
      listen 443 ssl http2;
      server_name rem-maxvich-stroi-demo.ru;

      ssl_certificate     /etc/letsencrypt/live/rem-maxvich-stroi-demo.ru/fullchain.pem;
      ssl_certificate_key /etc/letsencrypt/live/rem-maxvich-stroi-demo.ru/privkey.pem;

      ssl_protocols TLSv1.2 TLSv1.3;
      ssl_ciphers HIGH:!aNULL:!MD5;
      ssl_prefer_server_ciphers on;

      client_max_body_size 50M;

      location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto https;
          proxy_cache_bypass $http_upgrade;
      }
  }

  # HTTPS www -> без www
  server {
      listen 443 ssl http2;
      server_name www.rem-maxvich-stroi-demo.ru;

      ssl_certificate     /etc/letsencrypt/live/rem-maxvich-stroi-demo.ru/fullchain.pem;
      ssl_certificate_key /etc/letsencrypt/live/rem-maxvich-stroi-demo.ru/privkey.pem;

      return 301 https://rem-maxvich-stroi-demo.ru$request_uri;
  }
  ```
- Активируйте конфиг:
  ```bash
  sudo ln -sf /etc/nginx/sites-available/site_maxvich /etc/nginx/sites-enabled/site_maxvich
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t
  sudo systemctl reload nginx
  ```

## 7. Проверка работы
- Проверьте редиректы и HTTPS:
    ```bash
    curl -I http://rem-maxvich-stroi-demo.ru
    curl -I http://www.rem-maxvich-stroi-demo.ru
    curl -I https://rem-maxvich-stroi-demo.ru
    curl -I https://www.rem-maxvich-stroi-demo.ru
    ```
- Откройте сайт в браузере: https://rem-maxvich-stroi-demo.ru

## 8. Автоматизация
- Включите автопродление SSL:
    ```bash
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer
    sudo certbot renew --dry-run
    ```
- Убедитесь, что PM2 автозапускается:
    ```bash
    pm2 save
    pm2 startup  # выполните команду, которую покажет PM2
    ```

## 9. Траблшутинг
- Старый Node.js (ошибки синтаксиса): обновите Node ≥ 18 (через nvm).
- OOM при `next build`: `NODE_OPTIONS="--max-old-space-size=512" npm run build` или соберите локально и загрузите `.next/`.
- `EADDRINUSE: 3000`: остановите лишние процессы (`pm2 delete all`), запустите один.
- `server directive is not allowed here`: уберите `server {}` из `/etc/nginx/nginx.conf`, держите их только в `sites-available`.
- Чужой сертификат (*.hosting.reg.ru): исправьте DNS A/AAAA на IP вашего VPS; удалите AAAA, если нет IPv6.
- Redirect loop: держите один редирект 80→443 и корректный `proxy_pass`.
- Очистка локального DNS‑кэша:
  - Windows: `ipconfig /flushdns`
  - macOS: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
  - Linux: `sudo resolvectl flush-caches`

## 10. Быстрый чек‑лист
- [ ] A → IPv4 VPS, CNAME/`www` → apex, AAAA — удалены
- [ ] Приложение слушает 3000 (PM2 `rem-maxvich` online)
- [ ] Выдан LE сертификат на apex+www
- [ ] nginx активен, сайт в `sites-enabled`, нет `default`
- [ ] http→https редиректы, www→без www
- [ ] `curl -I https://rem-maxvich-stroi-demo.ru` → 200, SAN верный
- [ ] PM2 `save` + `startup`, certbot `timer` включен

Готово — сайт в продакшне с корректным HTTPS, редиректами и автоподдержкой.
