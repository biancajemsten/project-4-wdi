function errorHandler(err, req, res, next) {
  console.log(err);

  if(err.name === 'ValidationError') {
    err.status = 422;
    err.message = 'Blaaaaah Entity';
    const errors = {};
    for(const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
    err.errors = errors;
  }
  if(err.code === 11000) {
    err.status = 422;
    err.message = 'Username or password already exists';
    const errors = {};
    for(const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
    err.errors = errors;
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message, errors: err.errors });
  next(err);
}

module.exports = errorHandler;
