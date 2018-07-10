const router = require('express').Router();
const events = require('../controllers/events');
const auth = require('../controllers/auth');
const users = require('../controllers/users');
const secureRoute = require('../lib/secureRoute');

router.route('/events')
  .get(events.index)
  .post(secureRoute, events.create);

router.route('/events/:id')
  .get(events.show)
  .put(secureRoute, events.update)
  .delete(secureRoute, events.delete);

router.put('/events/:id/vote', secureRoute, events.update); //needs to be tested in insomnia

router.post('/register', auth.register);
router.post('/login', auth.login);

router.get('/users', users.index);

module.exports = router;
