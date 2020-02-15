const express = require('express');

const fritzbox = require('./fritzbox');
const help = require('./help');

const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', (req, res) => {
  res.send('API');
});
router.get('/help', (req, res) => {
  const json = help();
  res.json(json);
});

router.all('/fritzbox', fritzbox);

module.exports = router;
