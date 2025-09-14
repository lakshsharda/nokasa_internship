/**
 * Server entry point
 * Starts the Express server
 */

const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log('\n🚀 User API Server Started!');
  console.log('================================');
  console.log(`📍 Server running on: http://${HOST}:${PORT}`);
  console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
  console.log('\n📋 Available Endpoints:');
  console.log('V1 (Email-based):');
  console.log(`  POST   http://${HOST}:${PORT}/v1/users`);
  console.log(`  GET    http://${HOST}:${PORT}/v1/users`);
  console.log(`  GET    http://${HOST}:${PORT}/v1/users/:email`);
  console.log(`  DELETE http://${HOST}:${PORT}/v1/users/:email`);
  console.log('\nV2 (Phone-based):');
  console.log(`  POST   http://${HOST}:${PORT}/v2/users`);
  console.log(`  GET    http://${HOST}:${PORT}/v2/users`);
  console.log(`  GET    http://${HOST}:${PORT}/v2/users/:phone`);
  console.log(`  DELETE http://${HOST}:${PORT}/v2/users/:phone`);
  console.log('\n================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = server;
