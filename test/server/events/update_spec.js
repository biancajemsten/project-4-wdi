/* global describe, it, api, expect, beforeEach */
const Event = require('../../../models/event');
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');

const userData =[
  {
    username: 'bianca',
    email: 'bianca@test.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    tel: '+46702549294'
  },{
    username: 'richard',
    email: 'richard@test.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    tel: '+447762948257'
  },{
    username: 'martin',
    email: 'martin@test.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    tel: '+447377103864'
  }
];

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
  image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg'
};
const updatedEventData = {
  name: 'Play D&D',
  description: 'Dungeons and dragons, oh my!',
  timeSlots: [{
    date: '2018-07-21T08:30:00',
    votes: []
  }, {
    date: '2018-08-13T13:30:00',
    votes: []
  }],
  length: 300,
  address: 'GA, Relay Building',
  location: { lat: 51.5153002, lng: -0.0746125 },
  privacy: 'Public',
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
        userData[0]._id = user[0]._id;
        userData[1]._id = user[1]._id;
        userData[2]._id = user[2]._id;
        token = jwt.sign({ sub: user[0]._id }, secret, { expiresIn: '6h' });
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
          'timeSlots',
          'length',
          'address',
          'location',
          'privacy',
          'image'
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
        expect(res.body.privacy).to.eq(updatedEventData.privacy);
        expect(res.body.image).to.eq(updatedEventData.image);
        done();
      });
  });

});
