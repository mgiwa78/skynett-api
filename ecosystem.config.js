// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "app-dev",
      script: "./dist/app.js", // Path to your compiled JavaScript file
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      env_staging: {
        NODE_ENV: "staging",
      },
    },
  ],
};
