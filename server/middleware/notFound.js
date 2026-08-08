// Catches any request that didn't match a route and forwards a 404 error
// to the centralized errorHandler.
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default notFound;
