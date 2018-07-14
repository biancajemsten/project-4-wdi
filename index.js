const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webpush  = require('web-push');
const path = require('path');
const { dbURI, port, publicVapidKey, privateVapidKey } = require('./config/environment');


//Set static path
app.use(express.static(path.join(__dirname, 'client')));


webpush.setVapidDetails('mailto:biancajemsten@gmail.com', publicVapidKey, privateVapidKey);

//Subscribe route
app.post('/api/subscribe', (req, res)=>{
  //Get push subscription object from client
  const subscription = req.body;
  // console.log('request', req);

  //send 201 -resource created
  res.status(201).json({});

  //create getPayload
  const payload = JSON.stringify({title: 'Push test'});

  //pass object into sendNotification
  webpush.sendNotification(subscription, payload).catch(err => console.error(err));
});

const errorHandler = require('./lib/errorHandler');

const router = require('./config/routes');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(dbURI);
//
// app.use(express.static(`${__dirname}/public`));
// app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);

app.listen(port, () => console.log(`Express running on port ${port}`));

module.exports = app;
