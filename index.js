const express = require('express');

const api = require('./src/api');
const { updateAll } = require('./src/cloudflare');

const packageInfo = require('./package.json');
const config = require('./config.json');

const app = express();
const port = process.env.PORT || 3000;
const seperator = '--------------------------------------------------------';

console.log(seperator);
console.log(`${packageInfo.name} ${packageInfo.version} by ${packageInfo.author}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(seperator);

app.use('/api', api);

const server = app.listen(port, () => {
  const host = server.address().address;
  console.log(`Server listening at http://${host}:${port}!`);
});

server.on('listening', () => {
  if (config.frequency === 0) {
    console.log('Execute once...\n');
    updateAll();
  } else {
    console.log('Scheduler started...\n');
    setInterval(updateAll, config.frequency * 1000);
  }
});

const stopServer = () => {
  server.close(() => {
    console.log('\nProcess terminated');
  });
};
process.on('SIGTERM', () => stopServer());
process.on('SIGINT', () => stopServer());
