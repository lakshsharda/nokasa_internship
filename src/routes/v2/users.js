/**
 * V2 User Routes - Phone-based user management
 * All user IDs in this version are phone numbers
 */

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

// Middleware to add version context
router.use((req, res, next) => {
  req.version = 'v2';
  next();
});

/**
 * POST /v2/users
 * Create a new user with phone number as ID
 * Body: { id: "+1234567890", password: "password123" }
 */
router.post('/', (req, res) => {
  userController.createUser(req, res, 'v2');
});

/**
 * GET /v2/users/:id
 * Get user by phone number
 * Params: id (phone number)
 */
router.get('/:id', (req, res) => {
  userController.getUserById(req, res, 'v2');
});

/**
 * GET /v2/users
 * Get all users
 */
router.get('/', (req, res) => {
  userController.getAllUsers(req, res);
});

/**
 * DELETE /v2/users/:id
 * Delete user by phone number
 * Params: id (phone number)
 */
router.delete('/:id', (req, res) => {
  userController.deleteUser(req, res, 'v2');
});

module.exports = router;
