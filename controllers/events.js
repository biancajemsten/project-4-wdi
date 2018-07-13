const Event = require('../models/event');
const { sendSMS } = require('../lib/twilio');

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
        req.body.selectedOptions.forEach(person =>{
          const body = `Hi ${person.label}! You have been invited to ${req.body.name} by ${req.body.organizer.username}. Visit http://localhost:8000/events/${event._id} to view the event and vote on which dates are best for you.`;
          const tel = person.tel;
          sendSMS(body, tel);
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
    .then(event => res.json(event))
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
