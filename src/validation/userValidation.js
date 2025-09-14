/**
 * Validation logic for user schema
 * Handles validation for both email (v1) and phone (v2) identifiers
 */

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation regex pattern
 * Supports various phone formats: +1234567890, 1234567890, (123) 456-7890, etc.
 */
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

/**
 * Password validation requirements
 */
const PASSWORD_MIN_LENGTH = 6;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
function isValidPhone(phone) {
  if (typeof phone !== 'string') {
    return false;
  }
  
  // Remove all non-digit characters except + at the beginning
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if it starts with + and has 10-16 digits, or just has 10-16 digits
  return PHONE_REGEX.test(cleanPhone);
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
function validatePassword(password) {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required'
    };
  }

  if (typeof password !== 'string') {
    return {
      isValid: false,
      message: 'Password must be a string'
    };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`
    };
  }

  return {
    isValid: true,
    message: 'Password is valid'
  };
}

/**
 * Validate user data for creation
 * @param {Object} userData - User data to validate
 * @param {string} version - API version ('v1' for email, 'v2' for phone)
 * @returns {Object} Validation result with isValid, errors array, and cleanData
 */
function validateUserData(userData, version) {
  const errors = [];
  let cleanData = {};

  // Check if userData exists and is an object
  if (!userData || typeof userData !== 'object') {
    errors.push('User data must be an object');
    return {
      isValid: false,
      errors,
      cleanData: null
    };
  }

  const { id, password } = userData;

  // Validate ID field based on version
  if (!id) {
    errors.push('ID is required');
  } else {
    if (version === 'v1') {
      if (!isValidEmail(id)) {
        errors.push('ID must be a valid email address');
      } else {
        cleanData.id = id.trim().toLowerCase();
      }
    } else if (version === 'v2') {
      if (!isValidPhone(id)) {
        errors.push('ID must be a valid phone number');
      } else {
        // Clean and format phone number
        const cleanPhone = id.replace(/[^\d+]/g, '');
        cleanData.id = cleanPhone;
      }
    } else {
      errors.push('Invalid API version');
    }
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.message);
  } else {
    cleanData.password = password;
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanData: errors.length === 0 ? cleanData : null
  };
}

/**
 * Validate ID parameter for GET/DELETE operations
 * @param {string} id - ID to validate
 * @param {string} version - API version ('v1' for email, 'v2' for phone)
 * @returns {Object} Validation result with isValid, errors array, and cleanId
 */
function validateId(id, version) {
  const errors = [];
  let cleanId = null;

  if (!id) {
    errors.push('ID is required');
    return {
      isValid: false,
      errors,
      cleanId: null
    };
  }

  if (version === 'v1') {
    if (!isValidEmail(id)) {
      errors.push('ID must be a valid email address');
    } else {
      cleanId = id.trim().toLowerCase();
    }
  } else if (version === 'v2') {
    if (!isValidPhone(id)) {
      errors.push('ID must be a valid phone number');
    } else {
      const cleanPhone = id.replace(/[^\d+]/g, '');
      cleanId = cleanPhone;
    }
  } else {
    errors.push('Invalid API version');
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanId: cleanId
  };
}

module.exports = {
  isValidEmail,
  isValidPhone,
  validatePassword,
  validateUserData,
  validateId
};
