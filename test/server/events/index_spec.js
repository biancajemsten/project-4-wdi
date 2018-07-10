/* global describe, it, api, expect, beforeEach */
const Event = require('../../../models/event');
const User = require('../../../models/user');

const userData = [
  {
    username: 'bianca',
    email: 'bianca@test.com',
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

const eventData = [{
  name: 'Movie Night',
  description: 'Watching films',
  timeSlots: [{
    date: '2018-07-25',
    startTime: '2018-07-25',
    votes: [userData[1]]
  }, {
    date: '2018-07-26',
    startTime: '2018-07-26',
    votes: [userData[0], userData[2]]
  }],
  length: 120,
  address: '4 St Olaf\'s Road',
  location: { lat: 51.4798873, lng: -0.2107483 },
  private: true,
  attendees: [userData[1], userData[0], userData[2]],
  invitees: [ 'biancajemsten@gmail.com' ],
  image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg'
}, {
  name: 'Play D&D',
  description: 'Dungeons and dragons, oh my!',
  timeSlots: [{
    date: '2018-08-12',
    startTime: '2018-08-12',
    votes: [userData[0], userData[1]]
  }, {
    date: '2018-08-19',
    startTime: '2018-08-19',
    votes: [userData[0], userData[2], userData[1]]
  }],
  length: 300,
  address: 'GA, Relay Building',
  location: { lat: 51.5153002, lng: -0.0746125 },
  private: false,
  attendees: [userData[0], userData[2]],
  invitees: [ 'herrkoop@gmail.com' ],
  image: 'https://geekandsundry.com/wp-content/uploads/2016/12/featured-dnd-holiday.png'
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
          expect(event.private).to.eq(eventData[index].private);
          expect(event.invitees).to.deep.eq(eventData[index].invitees);
          expect(event.image).to.eq(eventData[index].image);
        });
        done();
      });
  });
});
