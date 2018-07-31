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
    tel: '+447762948257'
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
  }),new User({
    username: 'gerry',
    email: 'gerry@test.com',
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
        },{
          date: '2018-07-11T15:30:00',
          votes: []
        }, {
          date: '2018-07-13T09:00:00',
          votes: []
        }, {
          date: '2018-07-13T11:00:00',
          votes: []
        }, {
          date: '2018-07-13T15:00:00',
          votes: []
        },{
          date: '2018-08-01T15:15:00',
          votes: []
        },{
          date: '2018-08-01T18:15:00',
          votes: []
        }],
        length: 120,
        address: '4 St Olaf\'s Road',
        location: { lat: 51.4798873, lng: -0.2107483 },
        privacy: 'Private',
        invitees: [users[0], users[2]],
        attendees: [],
        image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg',
        organizer: [users[1]._id]
      }, {
        name: 'Play D&D',
        description: 'Dungeons and dragons, oh my!',
        timeSlots: [{
          date: '2018-07-21T08:30:00',
          votes: []
        },{
          date: '2018-07-21T10:30:00',
          votes: []
        }, {
          date: '2018-08-13T13:30:00',
          votes: []
        }, {
          date: '2018-08-13T15:30:00',
          votes: []
        }, {
          date: '2018-08-13T17:30:00',
          votes: []
        },{
          date: '2018-08-23T09:00:00',
          votes: []
        }],
        length: 300,
        address: 'GA, Relay Building',
        location: { lat: 51.5153002, lng: -0.0746125 },
        privacy: 'Public',
        invitees: [ users[1]],
        attendees: [],
        image: 'https://geekandsundry.com/wp-content/uploads/2016/12/featured-dnd-holiday.png',
        organizer: [users[2]._id]
      },{
        name: 'Kräftskiva',
        description: 'Let\'s put funny triangle formed hats on and sing a song every time we take a snaps.',
        timeSlots: [{
          date: '2018-08-08T17:30:00',
          votes: []
        },{
          date: '2018-08-08T19:00:00',
          votes: []
        }, {
          date: '2018-08-10T18:00:00',
          votes: []
        }, {
          date: '2018-08-10T20:00:00',
          votes: []
        }, {
          date: '2018-08-15T17:45:00',
          votes: []
        },{
          date: '2018-08-15T19:00:00',
          votes: []
        }],
        length: 120,
        address: 'Helsingborg, Sverige',
        location: { lat: 56.0452094, lng: 12.691276 },
        privacy: 'Public',
        invitees: [ users[2]],
        attendees: [],
        image: 'https://eu-central-1.tchyn.io/unitedbloggers-production/uploads/sites/406/2016/08/Isabella-Lo%CC%88wengrip-kra%CC%88ftskiva-i-tra%CC%88dga%CC%8Arden.jpg?quality=90',
        organizer: [users[0]._id]
      },{
        name: 'Record Exchange Meetup',
        description: 'Meeting for record enthusiasts!',
        timeSlots: [{
          date: '2018-07-08T15:30:00',
          votes: []
        },{
          date: '2018-07-08T11:00:00',
          votes: []
        }, {
          date: '2018-07-31T18:00:00',
          votes: []
        }, {
          date: '2018-07-31T20:00:00',
          votes: []
        }, {
          date: '2018-08-05T09:45:00',
          votes: []
        },{
          date: '2018-08-05T11:00:00',
          votes: []
        },{
          date: '2018-08-15T11:00:00',
          votes: []
        },{
          date: '2018-08-15T13:00:00',
          votes: []
        },{
          date: '2018-08-15T15:00:00',
          votes: []
        }],
        length: 150,
        address: 'Boxpark Shoreditch, Bethnal Green Road, London',
        location: { lat: 51.5235113, lng: -0.0786413 },
        privacy: 'Private',
        invitees: [ users[2]],
        attendees: [],
        image: 'https://upload.wikimedia.org/wikipedia/en/9/93/Low_%28album%29.jpg',
        organizer: [users[1]._id]
      },{
        name: 'We go to Juju\'s now',
        description: 'Mais oui. Self explanatory.',
        timeSlots: [{
          date: '2018-07-18T16:30:00',
          votes: []
        },{
          date: '2018-07-18T17:30:00',
          votes: []
        }, {
          date: '2018-07-18T18:00:00',
          votes: []
        }, {
          date: '2018-07-18T20:00:00',
          votes: []
        }, {
          date: '2018-07-18T23:45:00',
          votes: []
        },{
          date: '2018-07-19T01:00:00',
          votes: []
        },{
          date: '2018-07-19T02:00:00',
          votes: []
        },{
          date: '2018-07-19T02:30:00',
          votes: []
        },{
          date: '2018-07-19T04:00:00',
          votes: []
        }],
        length: 400,
        address: 'Juju\'s Bar and Stage, Hanbury Street, London',
        location: { lat: 51.5207038, lng: -0.0759221 },
        privacy: 'Public',
        invitees: [ users[2], users[0]],
        attendees: [],
        image: 'https://www.abouttimemagazine.co.uk/wp-content/uploads/2017/05/IMG_22701.jpg',
        organizer: [users[3]._id]
      }]);
    })
    .then(events => console.log(`${events.length} event(s) created`))
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());
});
