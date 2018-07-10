const express = require('express');
const app = express();
const port = 4000;

const router = require('./config/routes');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


app.use(express.static(`${__dirname}/public`));


app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.use('/api', router);

app.listen(port, () => console.log(`Express running on port ${port}`));

module.exports = app;
