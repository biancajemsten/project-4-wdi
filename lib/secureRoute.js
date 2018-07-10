const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Promise = require('bluebird');
const {secret} = require('../config/environment');

function secureRoute(req, res, next){
  if(!req.headers.authorization) return res.status(401).json({ message: 'No token sent!'});

  const token = req.headers.authorization.replace('Bearer ', '');

  new Promise((resolve, reject)=>{
    jwt.verify(token, secret, (err, payload)=> {
      if(err) reject(err);
      resolve(payload);
    });
  })
    .then(payload => User.findById(payload.sub))
    .then(user => {
      if(!user) return res.status(401).json({ message: 'User not found'});
      req.currentUser = user;
      next();
    })
    .catch(() => res.status(401).json({ message: 'Token invalid'}));
}

module.exports = secureRoute; 
