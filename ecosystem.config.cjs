const path = require("path");

module.exports = {
  apps: [
    {
      name: "royalresults",
      script: "dist/index.js",
      interpreter: "node",
      // cwd locks the working directory so all relative paths resolve correctly
      // Set this to the absolute path of the project root on your server
      // e.g. /home/user/royal-results-pro  or  /var/www/royal-results-pro
      cwd: process.env.APP_DIR || path.resolve(__dirname),
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      // Restart on crash, but not too aggressively
      max_restarts: 10,
      min_uptime: "10s",
      // Log to files so you can inspect via Hostinger's file manager
      out_file: "logs/out.log",
      error_file: "logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
