const express = require('express');
const app = express();
const port = 4000;
const errorHandler = require('./lib/errorHandler');


const router = require('./config/router');

app.use(express.static(`${__dirname}/public`));



app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.use(errorHandler);

app.use('/api', router);


app.listen(port, () => console.log(`Express running on port ${port}`));

module.exports = app;
