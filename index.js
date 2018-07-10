const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const routes = require('./config/routes');
const { dbURI, port }= require('./config/environment');
const mongoose = require('mongoose');

app.use(express.static(`${__dirname}/public`));

mongoose.connect(dbURI);

app.use(bodyParser.json());
app.use('/api', routes);

app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => console.log(`Express running on port ${port}`));

module.exports = app;
