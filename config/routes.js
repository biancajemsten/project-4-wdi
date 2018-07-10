const router = require('express').Router();
const events = require('../controllers/events');
const secureRoute = require('../lib/secureRoute'); 

router.route('/events')
  .get(events.index);

module.exports = router;
