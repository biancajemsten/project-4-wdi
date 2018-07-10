const router = require('express').Router();
const auth = require('../controllers/auth');
const events = require('../controllers/events');
<<<<<<< HEAD
const secureRoute = require('../lib/secureRoute');
=======
// const secureRoute = require('../lib/secureRoute');
>>>>>>> 0391b7562add12dbe29596805e5b8ddf609a7a24

router.route('/events')
  .get(events.index);

router.route('/events/:id')
  .get(events.show)
  .put(events.update)
  .delete(events.delete);

router.post('/register', auth.register);
router.post('/login', auth.login);
module.exports = router;
