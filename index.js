const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const errorHandler = require('./lib/errorHandler');

const router = require('./config/routes');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const { dbURI, port } = require('./config/environment');
mongoose.connect(dbURI);
// 
// app.use(express.static(`${__dirname}/public`));
// app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);

app.listen(port, () => console.log(`Express running on port ${port}`));

module.exports = app;
