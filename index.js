const express = require('express');
const app = express();
const port = 4000;

app.use(express.static(`${__dirname}/public`));



app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => console.log(`Express running on port ${port}`));

module.exports = app;
