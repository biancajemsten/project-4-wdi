/* global describe, it, api, expect, beforeEach */
const Event = require('../../../models/event');
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');

const userData =
  {
    username: 'test',
    email: 'test@test.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    tel: '+447377103864'
  };

const eventData = {
  name: 'Movie Night',
  description: 'Watching films',
  timeSlots: [{
    date: '2018-07-11T12:30:00',
    votes: []
  }, {
    date: '2018-07-13T15:15:00',
    votes: []
  }],
  length: 120,
  address: '4 St Olaf\'s Road',
  location: { lat: 51.4798873, lng: -0.2107483 },
  privacy: 'Private',
  invitees: [userData[0], userData[2]],
  attendees: [ userData[1] ],
  image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg'
};

let eventId;
let token;

describe('DELETE /events/:id', () => {
  beforeEach(done => {
    Event
      .remove({})
      .then(() => User.remove({}))
      .then(() => Event.create(eventData))
      .then((event) => {
        eventId = event._id;
      })
      .then(() => User.create(userData))
      .then( user => {
        token = jwt.sign({sub: user._id}, secret , {expiresIn: '6h'});
        done();
      });
  });

  it('should return a 401 response without a token', done => {
    api.delete(`/api/events/${eventId}`)
      .end((err, res) =>{
        expect(res.status).to.eq(401);
        done();
      });
  });

  it('should return a 204 response', done => {
    api.delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) =>{
        expect(res.status).to.eq(204);
        done();
      });
  });

  it('should return no data', done => {
    api
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.be.empty;
        done();
      });
  });










});
