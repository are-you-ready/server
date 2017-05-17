const express = require('express');
const morgan = require('morgan');
const app = express();

const AYR_PORT = process.argv[2] || process.env.AYR_PORT || 3000;

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(AYR_PORT, () => {
  console.log(`Server started on port ${AYR_PORT}.`); // eslint-disable-line no-console
});
