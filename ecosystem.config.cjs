module.exports = {
  apps: [
    {
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      max_memory_restart: '1G',
      name: 'skillpedia',
      script: 'node_modules/.bin/next',
      args: 'start -H 0.0.0.0 -p 3000',
      watch: false,
    },
  ],
};
