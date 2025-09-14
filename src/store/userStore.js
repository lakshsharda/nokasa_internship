/**
 * In-memory user store using Map for efficient lookups
 * Supports both email (v1) and phone (v2) as user identifiers
 */

class UserStore {
  constructor() {
    // Map to store users by their ID (email or phone)
    this.users = new Map();
    // Counter for generating unique IDs
    this.idCounter = 1;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data containing id and password
   * @returns {Object} Created user object
   */
  createUser(userData) {
    const { id, password } = userData;
    
    // Check if user already exists
    if (this.users.has(id)) {
      throw new Error('DUPLICATE_USER');
    }

    // Create user object with internal ID
    const user = {
      internalId: this.idCounter++,
      id: id,
      password: password,
      createdAt: new Date().toISOString()
    };

    // Store user
    this.users.set(id, user);
    
    return {
      internalId: user.internalId,
      id: user.id,
      createdAt: user.createdAt
    };
  }

  /**
   * Get user by ID (email or phone)
   * @param {string} id - User ID (email or phone)
   * @returns {Object|null} User object or null if not found
   */
  getUserById(id) {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    return {
      internalId: user.internalId,
      id: user.id,
      createdAt: user.createdAt
    };
  }

  /**
   * Get all users
   * @returns {Array} Array of all users
   */
  getAllUsers() {
    return Array.from(this.users.values()).map(user => ({
      internalId: user.internalId,
      id: user.id,
      createdAt: user.createdAt
    }));
  }

  /**
   * Delete user by ID
   * @param {string} id - User ID (email or phone)
   * @returns {boolean} True if user was deleted, false if not found
   */
  deleteUser(id) {
    return this.users.delete(id);
  }

  /**
   * Check if user exists
   * @param {string} id - User ID (email or phone)
   * @returns {boolean} True if user exists
   */
  userExists(id) {
    return this.users.has(id);
  }

  /**
   * Get total number of users
   * @returns {number} Number of users in store
   */
  getUserCount() {
    return this.users.size;
  }
}

// Export singleton instance
module.exports = new UserStore();
