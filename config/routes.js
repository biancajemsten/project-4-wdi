const router = require('express').Router();
const events = require('../controllers/events');

router.route('/events')
  .get(events.index);

router.route('/events/:id')
  .get(events.show);

module.exports = router;
