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
    passwordConfirmation: 'pass'
  };

const eventData = {
  name: 'Movie Night',
  description: 'Watching films',
  length: 120,
  address: '4 St Olaf\'s Road',
  location: { lat: 51.4798873, lng: -0.2107483 },
  private: true,
  invitees: [ 'biancajemsten@gmail.com' ],
  image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg'
};
const updatedEventData = {
  name: 'Play D&D',
  description: 'Dungeons and dragons, oh my!',
  length: 300,
  address: 'GA, Relay Building',
  location: { lat: 51.5153002, lng: -0.0746125 },
  private: false,
  invitees: [ 'herrkoop@gmail.com' ],
  image: 'https://geekandsundry.com/wp-content/uploads/2016/12/featured-dnd-holiday.png'
};

let eventId;
let token;

describe('PUT /events/:id', () => {
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
    api.put(`/api/events/${eventId}`)
      .end((err, res) => {
        expect(res.status).to.eq(401);
        done();
      });
  });

  it('should return a 200 response with a token', done => {
    api.put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('should return the created event', done => {
    api.put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedEventData)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys([
          '_id',
          'name',
          'description',
          'length',
          'address',
          'location',
          'private',
          'invitees',
          'image',
          'pendingAttendees',
          'attendees',
          'timeSlots'
        ]);
        done();
      });
  });

  it('should return the correct data', done => {
    api.put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedEventData)
      .end((err, res) => {
        expect(res.body.name).to.eq(updatedEventData.name);
        expect(res.body.description).to.eq(updatedEventData.description);
        expect(res.body.length).to.eq(updatedEventData.length);
        expect(res.body.address).to.eq(updatedEventData.address);
        expect(res.body.location).to.deep.eq(updatedEventData.location);
        expect(res.body.private).to.eq(updatedEventData.private);
        expect(res.body.invitees).to.deep.eq(updatedEventData.invitees);
        expect(res.body.image).to.eq(updatedEventData.image);
        done();
      });
  });

});
