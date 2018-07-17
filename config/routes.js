const router = require('express').Router();
const events = require('../controllers/events');
const auth = require('../controllers/auth');
const users = require('../controllers/users');
const secureRoute = require('../lib/secureRoute');
const push = require('../controllers/pushNotifications');

router.route('/events')
  .get(events.index)
  .post(secureRoute, events.create);

router.route('/events/:id')
  .get(events.show)
  .put(secureRoute, events.update)
  .delete(secureRoute, events.delete);

router.post('/events/:id/vote', secureRoute, events.vote);

router.post('/register', auth.register);
router.post('/login', auth.login);

router.get('/users', users.index);

router.route('/users/:id')
  .get(users.show)
  .put(secureRoute, users.update);


router.post('/subscribe', secureRoute, push.subscribe);

module.exports = router;
