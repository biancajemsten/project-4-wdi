const router = require('express').Router();
const auth = require('../controllers/auth');
const events = require('../controllers/events');
// const secureRoute = require('../lib/secureRoute');

router.route('/events')
  .get(events.index)
  .post(events.create);

router.route('/events/:id')
  .get(events.show)
  .put(events.update)
  .delete(events.delete);

router.put('events/:id/vote', events.update); //needs to be tested in insomnia

router.post('/register', auth.register);
router.post('/login', auth.login);
module.exports = router;
