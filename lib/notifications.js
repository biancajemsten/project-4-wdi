const webpush  = require('web-push');
const { publicVapidKey, privateVapidKey } = require('../config/environment');

webpush.setVapidDetails('mailto:biancajemsten@gmail.com', publicVapidKey, privateVapidKey);

const subscriptions = {};

function subscribe(subscription, userId) {
  subscriptions[userId.toString()] = subscription;
  console.log(subscriptions);
}

function send(payload, userId) {
  const subscription = subscriptions[userId.toString()];

  webpush.sendNotification(subscription, JSON.stringify(payload));
}

module.exports = { subscribe, send };
