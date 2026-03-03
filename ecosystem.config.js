/**
 * PM2 ecosystem file for site_maxvich
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: 'site_maxvich',
      script: 'npm',
      args: 'start',
      // Run in project root (start PM2 from repo directory), use cluster mode for multi-core
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
  deploy: {
    production: {
      user: 'deploy',
      host: 'your.server.ip',
      ref: 'origin/main',
      repo: 'https://github.com/YourUser/site_maxvich1.git',
      path: '/var/www/site_maxvich1',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
