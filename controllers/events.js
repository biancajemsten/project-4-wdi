const Event = require('../models/event');
const { sendSMS } = require('../lib/twilio');
const moment = require('moment');
const notifications = require('../lib/notifications');

function indexRoute(req, res, next) {
  Event
    .find()
    .populate('organizer')
    .then(events => res.json(events))
    .catch(next);
}

function showRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .populate('invitees organizer joinRequests')
    .then(event => res.json(event))
    .catch(next);
}

function createRoute(req, res, next){
  req.body.organizer = req.currentUser;
  Event
    .create(req.body)
    .then(event => {
      res.status(201).json(event);
      if(req.body.selectedOptions) {
        req.body.selectedOptions.forEach(person => {
          const body = `Hi ${person.label}! You have been invited to ${req.body.name} by ${req.body.organizer.username}. Visit http://localhost:8000/events/${event._id} to view the event and vote on which dates are best for you.`;
          sendSMS(body, person.tel);
          notifications.send({ title: 'You\'ve been invited to an event!', body }, person.value);
        });
      }
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .then(event => event.set(req.body))
    .then(event => event.save())
    .then(event => {
      res.json(event);
      if(req.body.finalTimes.length > 0 && req.body.invitees.length > 0) {
        req.body.invitees.forEach(person => {
          const formattedTimes = req.body.finalTimes.map(time => {
            return moment(time).format('dddd MMMM Do [at] HH:mm');
          });
          const times = formattedTimes.map(time => time).join(', ').replace(/(.*),(.*)$/, '$1 &$2');
          const body = `Hi ${person.username}! ${req.body.organizer.username} has set the final time(s) for the event ${req.body.name}. It will take place on ${times}. For more information, visit http://localhost:8000/events/${event._id}`;
          const tel = person.tel;
          sendSMS(body, tel);
        });
      }
    })
    .catch(next);
}

function deleteRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .then(event => event.remove())
    .then(() => res.sendStatus(204))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  show: showRoute,
  create: createRoute,
  update: updateRoute,
  delete: deleteRoute
};
