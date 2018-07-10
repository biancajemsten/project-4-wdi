const router = require('express').Router();
const events = require('../controllers/events');
const auth = require('../controllers/auth');
// const secureRoute = require('../lib/secureRoute');

router.route('/events')
  .get(events.index);

router.route('/events/:id')
  .get(events.show)
  .put(events.update)
  .delete(events.delete);

router.post('/register', auth.register);
router.post('/login', auth.login);

module.exports = router;
