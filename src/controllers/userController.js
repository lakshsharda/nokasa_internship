/**
 * User controller with CRUD operations
 * Handles business logic for user management
 */

const userStore = require('../store/userStore');
const { validateUserData, validateId } = require('../validation/userValidation');

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} version - API version ('v1' for email, 'v2' for phone)
 */
function createUser(req, res, version) {
  try {
    // Validate user data
    const validation = validateUserData(req.body, version);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Create user in store
    const user = userStore.createUser(validation.cleanData);
    
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });

  } catch (error) {
    if (error.message === 'DUPLICATE_USER') {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
        error: 'Duplicate user'
      });
    }

    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to create user'
    });
  }
}

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} version - API version ('v1' for email, 'v2' for phone)
 */
function getUserById(req, res, version) {
  try {
    const { id } = req.params;
    
    // Validate ID
    const validation = validateId(id, version);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        errors: validation.errors
      });
    }

    // Get user from store
    const user = userStore.getUserById(validation.cleanId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'User does not exist'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });

  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to retrieve user'
    });
  }
}

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getAllUsers(req, res) {
  try {
    const users = userStore.getAllUsers();
    
    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Error getting all users:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to retrieve users'
    });
  }
}

/**
 * Delete user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} version - API version ('v1' for email, 'v2' for phone)
 */
function deleteUser(req, res, version) {
  try {
    const { id } = req.params;
    
    // Validate ID
    const validation = validateId(id, version);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        errors: validation.errors
      });
    }

    // Check if user exists
    if (!userStore.userExists(validation.cleanId)) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'User does not exist'
      });
    }

    // Delete user from store
    const deleted = userStore.deleteUser(validation.cleanId);
    
    if (deleted) {
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: {
          id: validation.cleanId,
          deleted: true
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: 'User could not be deleted'
      });
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to delete user'
    });
  }
}

/**
 * Get API health status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getHealthStatus(req, res) {
  try {
    const userCount = userStore.getUserCount();
    
    return res.status(200).json({
      success: true,
      message: 'API is healthy',
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        userCount: userCount
      }
    });

  } catch (error) {
    console.error('Error getting health status:', error);
    return res.status(500).json({
      success: false,
      message: 'API health check failed',
      error: 'Internal server error'
    });
  }
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  deleteUser,
  getHealthStatus
};
