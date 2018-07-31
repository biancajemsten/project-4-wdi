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
  req.body.length = (req.body.hours * 60) + +req.body.minutes;
  Event
    .create(req.body)
    .then(event => {
      res.status(201).json(event);
      // TWILIO COMMENTED OUT BECAUSE API IS USING A TRIAL ACCOUNT AND WON'T WORK WITH NEW NUMBERS
      // if(req.body.selectedOptions) {
      //   req.body.selectedOptions.forEach(person => {
      //     const body = `Hi ${person.label}! You have been invited to ${req.body.name} by ${req.body.organizer.username}. Visit ${req.headers.origin}/events/${event._id} to view the event and vote on which dates are best for you.`;
      //     sendSMS(body, person.tel);
      //     notifications.send({ title: `You've been invited to ${req.body.name}`, body: `Hey ${person.label}. For more info, visit 'My events' on CheckIt`}, person.value);
      //   });
      // }
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .populate('organizer invitees')
    .then(event => event.set(req.body))
    .then(event => event.save())
    .then(event => {
      // TWILIO COMMENTED OUT BECAUSE API IS USING A TRIAL ACCOUNT AND WON'T WORK WITH NEW NUMBERS
      // if(event.finalTimes.length > 0 && event.attendees.length > 0) {
      //   const times = event.finalTimes
      //     .map(time => moment(time).format('dddd MMMM Do [at] HH:mm'))
      //     .map(time => time).join(', ').replace(/(.*),(.*)$/, '$1 &$2');
      //   event.invitees
      //     .filter(user => event.attendees.includes(user._id.toString()))
      //     .forEach(user => {
      //       const body = `Hi ${user.username}! ${req.body.organizer.username} has set the final time(s) for the event ${req.body.name}. It will take place on ${times}. For more information, visit ${req.headers.origin}/events/${event._id}`;
      //       sendSMS(body, user.tel);
      //     });
      // }
      return res.json(event);
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

// POST /events/:id/vote
function voteRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .populate('organizer invitees')
    .then(event => {
      event.timeSlots = event.timeSlots.map(timeSlot => {
        if(req.body.votes.includes(timeSlot._id.toString())) timeSlot.votes.push(req.currentUser._id);
        return timeSlot;
      });
      return event.save();
    })
    .then(event => res.json(event))
    .catch(next);
}

function requestRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .populate('organizer invitees')
    .then(event => {
      event.joinRequests.push(req.currentUser);
      return event.save();
    })
    //--> We can put this in but it breaks if not every organizer has an endpoint installed
    // .then(event => {
    //   notifications.send({ title: 'New request!', body: `Someone has requested to join ${event.name}`}, event.organizer._id);
    // })
    .then(event => res.json(event))
    .catch(next);
}

function acceptRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .populate('organizer invitees')
    .then(event => {
      event.joinRequests = event.joinRequests.filter(user => !user._id.equals(req.params.userId));
      event.invitees.push(req.params.userId);
      return event.save();
    })
    .then(event => res.json(event))
    .catch(next);
}

function declineRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .populate('organizer invitees')
    .then(event => {
      event.joinRequests = event.joinRequests.filter(user => !user._id.equals(req.params.userId));
      return event.save();
    })
    .then(event => res.json(event))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  show: showRoute,
  create: createRoute,
  update: updateRoute,
  delete: deleteRoute,
  vote: voteRoute,
  request: requestRoute,
  accept: acceptRoute,
  decline: declineRoute
};
