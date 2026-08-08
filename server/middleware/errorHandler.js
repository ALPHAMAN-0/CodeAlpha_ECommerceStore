// Centralized error handler — must be registered last, after all routes.
// Normalizes Mongoose ValidationError (400), CastError (400 — e.g. a
// malformed ObjectId in a route param), and duplicate-key errors (409 —
// e.g. registering with an email that's already taken) into consistent
// JSON error responses. Any other error falls back to the status code
// already set on the response (or 500).
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';
  let details;

  // Mongoose validation error (e.g. missing/invalid required field)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    details = Object.values(err.errors).map((val) => val.message);
    message = details.join(', ');
  }

  // Mongoose cast error (e.g. an invalid ObjectId passed as a route param)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field "${err.path}": ${err.value}`;
  }

  // MongoDB duplicate key error (e.g. re-registering an existing email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `${field.charAt(0).toUpperCase() + field.slice(1)} "${err.keyValue[field]}" is already in use`
      : 'Duplicate value violates a unique constraint';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

export default errorHandler;
