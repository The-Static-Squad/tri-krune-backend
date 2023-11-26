function errorHandler(err, req, res, next) {
  // jwt authentication error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err.name + ': ' + err.message });
  }

  // validation error
  if(err.name === 'ValidationError') {
    return res.status(401).json({message: err})
  }

  // defaults to 500 server error
  res.status(500).json(err);
}

module.exports = errorHandler;
