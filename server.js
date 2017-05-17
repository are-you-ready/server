const express = require('express');
const app = express();

const AYR_PORT = process.argv[2] || process.env.AYR_PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(AYR_PORT, () => {
  console.log(`Server started on port ${AYR_PORT}.`);
});
