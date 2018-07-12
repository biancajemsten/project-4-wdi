const Event = require('../models/event');
const {sendSMS} = require('../config/environment');

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
  console.log(req.body); 
  req.body.organizer = req.currentUser;
  Event
    .create(req.body)
    .then(event => res.status(201).json(event))
    .catch(next);
}

function updateRoute(req, res, next) {
  // if req.body.finaldates.length 0 do twilio
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
