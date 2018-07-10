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
    passwordConfirmation: 'pass'
  }),
  new User({
    username: 'richard',
    email: 'richard@test.com',
    password: 'pass',
    passwordConfirmation: 'pass'
  }),
  new User({
    username: 'martin',
    email: 'martin@test.com',
    password: 'pass',
    passwordConfirmation: 'pass'
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
          date: '2018-07-25',
          startTime: '2018-07-25',
          votes: [users[1]]
        }, {
          date: '2018-07-26',
          startTime: '2018-07-26',
          votes: [users[0], users[2]]
        }],
        length: 120,
        address: '4 St Olaf\'s Road',
        location: { lat: 51.4798873, lng: -0.2107483 },
        private: true,
        attendees: [users[1], users[0], users[2]],
        invitees: [ 'biancajemsten@gmail.com' ],
        image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg',
        organizer: [users[1]._id]
      }, {
        name: 'Play D&D',
        description: 'Dungeons and dragons, oh my!',
        timeSlots: [{
          date: '2018-08-12',
          startTime: '2018-08-12',
          votes: [users[0], users[1]]
        }, {
          date: '2018-08-19',
          startTime: '2018-08-19',
          votes: [users[0], users[2], users[1]]
        }],
        length: 300,
        address: 'GA, Relay Building',
        location: { lat: 51.5153002, lng: -0.0746125 },
        private: false,
        attendees: [users[0], users[2]],
        invitees: [ 'herrkoop@gmail.com' ],
        image: 'https://geekandsundry.com/wp-content/uploads/2016/12/featured-dnd-holiday.png',
        organizer: [users[2]._id]
      }]);
    })
    .then(events => console.log(`${events.length} event(s) created`))
    .catch(err)
    .finally(() => mongoose.connection.close());
});
