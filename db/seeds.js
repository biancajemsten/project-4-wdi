const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const Event = require('../models/event');
const User = require('../models/user');
const { dbURI } = require('../config/environment');

const users = [
  new User({
    username: 'bianca',
    email: 'bianca@test.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    tel: '+46702549294'
  }),
  new User({
    username: 'richard',
    email: 'richard@test.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    tel: '+447762948257'
  }),
  new User({
    username: 'martin',
    email: 'martin@test.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    tel: '+447377103864'
  })
];

mongoose.connect(dbURI, (err, db) => {
  const promises = users.map(user => user.save());
  db.dropDatabase()
    .then(() => Promise.all(promises))
    .then(users => {
      console.log(`${users.length} user(s) created`);
      return Event.create([{
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
        private: true,
        invitees: [users[0], users[2]],
        attendees: [ users[1] ],
        image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg',
        organizer: [users[1]._id]
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
        private: false,
        invitees: [users[0], users[1]],
        attendees: [ users[2] ],
        image: 'https://geekandsundry.com/wp-content/uploads/2016/12/featured-dnd-holiday.png',
        organizer: [users[2]._id]
      }]);
    })
    .then(events => console.log(`${events.length} event(s) created`))
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());
});
