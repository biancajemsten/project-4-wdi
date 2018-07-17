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
          const body = `Hi ${person.label}! You have been invited to ${req.body.name} by ${req.body.organizer.username}. Visit ${req.headers.origin}/events/${event._id} to view the event and vote on which dates are best for you.`;
          sendSMS(body, person.tel);
          notifications.send({ title: `You've been invited to ${req.body.name}`, body: 'Go to:', url: `/events/${event._id}`}, person.value);
        });
      }
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
      // console.log('EVENT ATTENDEES: ', typeof event.attendees[0]);
      if(event.finalTimes.length > 0 && event.attendees.length > 0) {
        const times = event.finalTimes
          .map(time => moment(time).format('dddd MMMM Do [at] HH:mm'))
          .map(time => time).join(', ').replace(/(.*),(.*)$/, '$1 &$2');
        // console.log('EVENT INVITEES: ', typeof event.invitees[0]);
        event.invitees
          .filter(user => event.attendees.includes(user._id.toString()))
          .forEach(user => {
            console.log('USER', user);
            const body = `Hi ${user.username}! ${req.body.organizer.username} has set the final time(s) for the event ${req.body.name}. It will take place on ${times}. For more information, visit ${req.headers.origin}/events/${event._id}`;
            sendSMS(body, user.tel);
          });

      }

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

module.exports = {
  index: indexRoute,
  show: showRoute,
  create: createRoute,
  update: updateRoute,
  delete: deleteRoute,
  vote: voteRoute
};
