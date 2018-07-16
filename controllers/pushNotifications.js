const notifications = require('../lib/notifications');

//Subscribe route
function subscriptionRoute(req, res){
  console.log('SUBSCRIBING TO PUSH NOTIFICATIONS...');
  //Get push subscription object from client
  notifications.subscribe(req.body, req.currentUser._id);

  //send 201 -resource created
  res.sendStatus(201);
}

module.exports = {subscribe: subscriptionRoute};
