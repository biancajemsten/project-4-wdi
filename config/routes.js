const router = require('express').Router();
const events = require('../controllers/events');
// const secureRoute = require('../lib/secureRoute');

router.route('/events')
  .get(events.index);

router.route('/events/:id')
  .get(events.show)
  .put(events.update)
  .delete(events.delete);

module.exports = router;
