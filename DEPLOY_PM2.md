**PM2 Deployment — Инструкция**

- Кратко: используем PM2 для запуска Next.js в production (в background, с автоперезапуском).

**Требования на сервере**
- Node.js 18+ и npm
- Git (если будете клонировать репозиторию на сервер)

**Подготовка (на сервере)**
```bash
# переключиться в директорию сайта
sudo mkdir -p /var/www/site_maxvich1
sudo chown $USER:$USER /var/www/site_maxvich1
cd /var/www/site_maxvich1

# клонировать или скопировать код
git clone <repo-url> .

# установить pm2 глобально (один раз)
npm install -g pm2

# установить зависимости и собрать
npm ci
npm run build
```

**Создать папки для загружаемых файлов (важно)**
```bash
mkdir -p public/uploads/services
mkdir -p public/uploads/projects
mkdir -p public/uploads/videos
mkdir -p data/uploads/services
mkdir -p data/uploads/projects
mkdir -p data/uploads/videos
chmod -R 755 public/uploads data/uploads
```

Если вы будете загружать фото через админку — backend сохраняет файлы в `data/uploads/...` и отдаёт их через маршруты `/api/files/...`. Также проект использует перезапись путей — публичные URL `/uploads/services/<file>` проксируются на `/api/files/services/<file>`.

**Запуск приложения с PM2**
```bash
# из корня проекта
pm2 start ecosystem.config.js --env production
pm2 save
# настроить автозапуск при перезагрузке (systemd example)
pm2 startup systemd
# команда выведет строку, которую нужно выполнить от root (copy/paste)
```

**Логи и управление**
- Просмотр логов: `pm2 logs site_maxvich`
- Перезапуск: `pm2 restart site_maxvich`
- Остановить: `pm2 stop site_maxvich`
- Удалить процесс из pm2: `pm2 delete site_maxvich`

**Nginx (рекомендуется, пример)**
- На production обычно ставят Nginx как reverse proxy на 80/443 и проксируют запросы на `http://127.0.0.1:3000`.

Пример конфига `/etc/nginx/sites-available/site_maxvich`:
```nginx
server {
  listen 80;
  server_name example.com;

  location /_next/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Connection '';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

После добавления конфига:
```bash
sudo ln -s /etc/nginx/sites-available/site_maxvich /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**Примечания и рекомендации**
- PM2 полезен для автоперезапуска, логов и кластерного запуска (instances: max). Если у вас хостинг с управлением процессами (systemd, Docker, платформа PaaS), PM2 не обязателен.
- Убедитесь, что папки `data/uploads/*` и `public/uploads/*` существуют и имеют правильные права.

Если хочешь — могу:
- сгенерировать `systemd` unit файл вместо PM2;
- настроить `ecosystem.config.js` с конкретными `repo`, `host`, `user` для автоматического deploy через `pm2 deploy`.
