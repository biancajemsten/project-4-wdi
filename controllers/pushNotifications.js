const webpush  = require('web-push');
const { publicVapidKey, privateVapidKey } = require('../config/environment');

webpush.setVapidDetails('mailto:biancajemsten@gmail.com', publicVapidKey, privateVapidKey);

//Subscribe route
function subscriptionRoute(req, res){
  //Get push subscription object from client
  const subscription = req.body;

  //send 201 -resource created
  res.status(201).json({});

  //create getPayload
  const payload = JSON.stringify({title: 'Push test'});

  //pass object into sendNotification
  webpush.sendNotification(subscription, payload).catch(err => console.error(err));
}

module.exports = {subscribe: subscriptionRoute};
