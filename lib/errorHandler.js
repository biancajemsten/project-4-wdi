function errorHandler(err, req, res, next){
  let message = 'Something went wrong!';
  let status = 500;

  if(err.name === 'ValidationError'){
    message = err.message;
    status = 422;
  }

  res.status(status).json({message});
  next(err);
}

module.exports = errorHandler; 
