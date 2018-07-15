/* global describe, it, api, expect, beforeEach */
const Event = require('../../../models/event');
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');


const userData = [
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
  invitees: [userData[0], userData[2]],
  attendees: [ userData[1] ],
  image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg'
};

let token;

describe('POST /events', ()=>{
  beforeEach(done => {
    Promise.all([
      User.remove({}),
      Event.remove({})
    ])
      .then(() => User.create(userData))
      .then(user => {
        userData[0]._id = user[0]._id;
        userData[1]._id = user[1]._id;
        userData[2]._id = user[2]._id;
        token = jwt.sign({ sub: user[0]._id }, secret, { expiresIn: '6h' });
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
          'timeSlots',
          'length',
          'address',
          'location',
          'privacy',
          'invitees',
          'attendees',
          'image',
          'organizer'
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
        expect(res.body.privacy).to.eq(eventData.privacy);
        expect(res.body.image).to.eq(eventData.image);
        done();
      });
  });
});
