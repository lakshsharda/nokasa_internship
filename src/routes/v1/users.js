/**
 * V1 User Routes - Email-based user management
 * All user IDs in this version are email addresses
 */

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

// Middleware to add version context
router.use((req, res, next) => {
  req.version = 'v1';
  next();
});

/**
 * POST /v1/users
 * Create a new user with email as ID
 * Body: { id: "user@example.com", password: "password123" }
 */
router.post('/', (req, res) => {
  userController.createUser(req, res, 'v1');
});

/**
 * GET /v1/users/:id
 * Get user by email address
 * Params: id (email address)
 */
router.get('/:id', (req, res) => {
  userController.getUserById(req, res, 'v1');
});

/**
 * GET /v1/users
 * Get all users
 */
router.get('/', (req, res) => {
  userController.getAllUsers(req, res);
});

/**
 * DELETE /v1/users/:id
 * Delete user by email address
 * Params: id (email address)
 */
router.delete('/:id', (req, res) => {
  userController.deleteUser(req, res, 'v1');
});

module.exports = router;
