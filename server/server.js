// Must be the first import: ES module imports are hoisted and evaluated
// top-to-bottom before any other code runs, so loading dotenv's side-effect
// entrypoint here (rather than calling dotenv.config() as a later statement)
// guarantees process.env is populated before app.js reads CLIENT_URL, etc.
// at module-evaluation time.
import 'dotenv/config';

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5001;

const start = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
