module.exports = {
  apps: [
    {
      name: "royalresults",
      script: "dist/index.js",
      interpreter: "node",
      interpreter_args: "--experimental-vm-modules",
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
