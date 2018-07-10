const Event = require('../models/event');

function indexRoute(req, res, next) {
  Event
    .find()
    .then(events => res.json(events))
    .catch(next);
}



function createRoute(req, res, next){
  
}

module.exports = {
  index: indexRoute
};
