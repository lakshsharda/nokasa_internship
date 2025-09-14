/**
 * Express application setup
 * Main application configuration and middleware
 */

const express = require('express');
const userController = require('./controllers/userController');

// Import route modules
const v1UsersRoutes = require('./routes/v1/users');
const v2UsersRoutes = require('./routes/v2/users');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware (basic setup)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User API Server',
    version: '1.0.0',
    endpoints: {
      v1: {
        base: '/v1/users',
        description: 'Email-based user management',
        methods: ['GET', 'POST', 'DELETE']
      },
      v2: {
        base: '/v2/users',
        description: 'Phone-based user management',
        methods: ['GET', 'POST', 'DELETE']
      },
      health: '/health'
    }
  });
});

// Health check endpoint
app.get('/health', userController.getHealthStatus);

// API Routes
app.use('/v1/users', v1UsersRoutes);
app.use('/v2/users', v2UsersRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /v1/users',
      'GET /v1/users',
      'GET /v1/users/:email',
      'DELETE /v1/users/:email',
      'POST /v2/users',
      'GET /v2/users',
      'GET /v2/users/:phone',
      'DELETE /v2/users/:phone'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      error: 'Bad request'
    });
  }
  
  // Handle other errors
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: 'Something went wrong'
  });
});

module.exports = app;
