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

const eventData = [{
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
}, {
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
  invitees: [userData[0], userData[1]],
  attendees: [ userData[2] ],
  image: 'https://geekandsundry.com/wp-content/uploads/2016/12/featured-dnd-holiday.png',
  organizer: [userData[2]._id]
}];


describe('GET /events', ()=>{
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
      .then( () => {
        eventData[0].organizer = userData[1]._id;
        eventData[1].organizer = userData[2]._id;
        Event.create(eventData);
      })
      .then( () => {
        done();
      });
  });

  it('should return a 200 response', done => {
    api.get('/api/events')
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('should return an array', done => {
    api.get('/api/events')
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return an array of objects', done => {
    api.get('/api/events')
      .end((err, res) => {
        res.body.forEach(event => expect(event).to.be.an('object'));
        done();
      });
  });

  it('should return the correct data', done => {
    api.get('/api/events/')
      .end((err, res) => {
        res.body.forEach((event, index) => {
          expect(event.name).to.eq(eventData[index].name);
          expect(event.description).to.eq(eventData[index].description);
          expect(event.length).to.eq(eventData[index].length);
          expect(event.address).to.eq(eventData[index].address);
          expect(event.location).to.deep.eq(eventData[index].location);
          expect(event.privacy).to.eq(eventData[index].privacy);
          expect(event.image).to.deep.eq(eventData[index].image);
        });
        done();
      });
  });
});
