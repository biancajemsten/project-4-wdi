/* global describe, it, api, expect, beforeEach */
const Event = require('../../../models/event');
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');

const userData = [
  {
    username: 'test',
    email: 'test@test.com',
    password: 'pass',
    passwordConfirmation: 'pass'
  },{
    username: 'richard',
    email: 'richard@test.com',
    password: 'pass',
    passwordConfirmation: 'pass'
  },{
    username: 'martin',
    email: 'martin@test.com',
    password: 'pass',
    passwordConfirmation: 'pass'
  }
];

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

let token;

describe('POST /events', ()=>{
  beforeEach(done => {
    Promise.all([
      User.remove({}),
      Event.remove({})
    ])
      .then(() => User.create(userData[0]))
      .then(user => {
        token = jwt.sign({ sub: user._id }, secret, { expiresIn: '6h' });
      })
      .then(done);
  });

  it('should return a 401 response without a token', done => {
    api.post('/api/events')
      .end((err, res) => {
        expect(res.status).to.eq(401);
        done();
      });
  });

  it('should return a 201 response', done => {
    api.post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send(eventData)
      .end((err, res) => {
        expect(res.status).to.eq(201);
        done();
      });
  });

  it('should return the created event', done => {
    api.post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send(eventData)
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
          'organizer',
          'attendees',
          'timeSlots'
        ]);
        done();
      });
  });

  it('should return the correct data', done => {
    api.post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send(eventData)
      .end((err, res) => {
        expect(res.body.name).to.eq(eventData.name);
        expect(res.body.description).to.eq(eventData.description);
        expect(res.body.length).to.eq(eventData.length);
        expect(res.body.address).to.eq(eventData.address);
        expect(res.body.location).to.deep.eq(eventData.location);
        expect(res.body.private).to.eq(eventData.private);
        expect(res.body.invitees).to.deep.eq(eventData.invitees);
        expect(res.body.image).to.eq(eventData.image);
        done();
      });
  });
});
