// Wraps an async route/controller handler so rejected promises are forwarded
// to Express's error-handling middleware instead of needing a try/catch in
// every controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
