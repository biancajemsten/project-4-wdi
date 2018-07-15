/* global describe, it, api, expect, beforeEach */
const Event = require('../../../models/event');
const User = require('../../../models/user');

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
  image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg',
  organizer: [userData[1]._id]
};

let eventId;

describe('GET /events/:id', ()=>{
  beforeEach(done => {
    Event
      .remove({})
      .then(() => User.remove({}))
      .then(() => User.create(userData))
      .then((user) => {
        user.forEach((item, index) => {
          userData[index]._id = item._id;
        });
      })
      .then(() => {
        eventData.organizer = userData[1]._id;
      })
      .then(() => Event.create(eventData))
      .then((item) => {
        eventId = item._id;
        done();
      });
  });

  it('should return a 200 response', done => {
    api.get(`/api/events/${eventId}`)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('should return an object', done => {
    api.get(`/api/events/${eventId}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });


  it('should return the correct data', done => {
    api.get(`/api/events/${eventId}`)
      .end((err, res) => {
        expect(res.body.name).to.eq(eventData.name);
        expect(res.body.description).to.eq(eventData.description);
        expect(res.body.length).to.eq(eventData.length);
        expect(res.body.address).to.eq(eventData.address);
        expect(res.body.location).to.deep.eq(eventData.location);
        expect(res.body.privacy).to.eq(eventData.privacy);
        expect(res.body.image).to.deep.eq(eventData.image);
        done();
      });
  });
});
