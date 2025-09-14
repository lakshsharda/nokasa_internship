# User API Express Server

A Node.js Express API server that implements two versions of user management with in-memory data storage.

## Features

- **Two API versions**: V1 (email-based) and V2 (phone-based)
- **In-memory data store**: No database required
- **Comprehensive validation**: Email and phone number validation
- **Proper HTTP status codes**: 200, 201, 400, 404, 409, 500
- **Structured JSON responses**: Consistent response format
- **Error handling**: Comprehensive error management
- **CORS support**: Cross-origin resource sharing enabled

## Project Structure

```
nokasa/
├── src/
│   ├── controllers/
│   │   └── userController.js    # Business logic for user operations
│   ├── routes/
│   │   ├── v1/
│   │   │   └── users.js         # V1 routes (email-based)
│   │   └── v2/
│   │       └── users.js         # V2 routes (phone-based)
│   ├── store/
│   │   └── userStore.js         # In-memory data store
│   ├── validation/
│   │   └── userValidation.js    # Input validation logic
│   └── app.js                   # Express app configuration
├── package.json                 # Dependencies and scripts
├── server.js                    # Server entry point
└── README.md                    # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **For development (with auto-restart):**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Version 1 (Email-based User Management)

#### Create User
- **POST** `/v1/users`
- **Body:**
  ```json
  {
    "id": "user@example.com",
    "password": "password123"
  }
  ```

#### Get All Users
- **GET** `/v1/users`

#### Get User by Email
- **GET** `/v1/users/:email`
- **Example:** `GET /v1/users/user@example.com`

#### Delete User by Email
- **DELETE** `/v1/users/:email`
- **Example:** `DELETE /v1/users/user@example.com`

### Version 2 (Phone-based User Management)

#### Create User
- **POST** `/v2/users`
- **Body:**
  ```json
  {
    "id": "+1234567890",
    "password": "password123"
  }
  ```

#### Get All Users
- **GET** `/v2/users`

#### Get User by Phone
- **GET** `/v2/users/:phone`
- **Example:** `GET /v2/users/+1234567890`

#### Delete User by Phone
- **DELETE** `/v2/users/:phone`
- **Example:** `DELETE /v2/users/+1234567890`

### Additional Endpoints

#### Health Check
- **GET** `/health`

#### API Information
- **GET** `/`

## Response Format

All API responses follow this structure:

```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": {...},          // Present on success
  "errors": [...],        // Present on validation errors
  "error": "..."          // Present on other errors
}
```

## HTTP Status Codes

- **200** - Success (GET, DELETE)
- **201** - Created (POST)
- **400** - Bad Request (validation errors, missing fields)
- **404** - Not Found (user doesn't exist)
- **409** - Conflict (duplicate user)
- **500** - Internal Server Error

## Testing with Postman

### 1. Import Collection
Create a new Postman collection with these requests:

### 2. Environment Variables
Create a Postman environment with:
- `baseUrl`: `http://localhost:3000`

### 3. Test Cases

#### V1 (Email) Tests

**Create User (Success):**
```
POST {{baseUrl}}/v1/users
Content-Type: application/json

{
  "id": "john@example.com",
  "password": "password123"
}
```

**Create User (Duplicate):**
```
POST {{baseUrl}}/v1/users
Content-Type: application/json

{
  "id": "john@example.com",
  "password": "password456"
}
```

**Create User (Invalid Email):**
```
POST {{baseUrl}}/v1/users
Content-Type: application/json

{
  "id": "invalid-email",
  "password": "password123"
}
```

**Create User (Missing Fields):**
```
POST {{baseUrl}}/v1/users
Content-Type: application/json

{
  "id": "john@example.com"
}
```

**Get All Users:**
```
GET {{baseUrl}}/v1/users
```

**Get User by Email:**
```
GET {{baseUrl}}/v1/users/john@example.com
```

**Get User (Not Found):**
```
GET {{baseUrl}}/v1/users/nonexistent@example.com
```

**Delete User:**
```
DELETE {{baseUrl}}/v1/users/john@example.com
```

#### V2 (Phone) Tests

**Create User (Success):**
```
POST {{baseUrl}}/v2/users
Content-Type: application/json

{
  "id": "+1234567890",
  "password": "password123"
}
```

**Create User (Invalid Phone):**
```
POST {{baseUrl}}/v2/users
Content-Type: application/json

{
  "id": "invalid-phone",
  "password": "password123"
}
```

**Get All Users:**
```
GET {{baseUrl}}/v2/users
```

**Get User by Phone:**
```
GET {{baseUrl}}/v2/users/+1234567890
```

**Delete User:**
```
DELETE {{baseUrl}}/v2/users/+1234567890
```

### 4. Expected Results

#### Success Responses
- **201** for user creation
- **200** for successful GET/DELETE operations

#### Error Responses
- **400** for validation errors (invalid email/phone, missing fields)
- **404** for user not found
- **409** for duplicate users
- **500** for server errors

## Validation Rules

### Email (V1)
- Must be valid email format
- Case insensitive (stored in lowercase)

### Phone (V2)
- Must be 10-16 digits
- Can start with + (international format)
- Special characters are stripped

### Password
- Required field
- Minimum 6 characters
- Must be a string

## Development

### File Structure Explanation

- **`src/store/userStore.js`**: In-memory data store using Map for efficient lookups
- **`src/validation/userValidation.js`**: Input validation for emails, phones, and passwords
- **`src/controllers/userController.js`**: Business logic and response handling
- **`src/routes/v1/users.js`**: V1 API routes (email-based)
- **`src/routes/v2/users.js`**: V2 API routes (phone-based)
- **`src/app.js`**: Express app configuration and middleware
- **`server.js`**: Server startup and graceful shutdown

### Adding New Features

1. Add validation rules in `userValidation.js`
2. Update business logic in `userController.js`
3. Add routes in respective version files
4. Update this README

## Troubleshooting

### Common Issues

1. **Port already in use**: Change PORT in `server.js` or kill existing process
2. **Invalid JSON**: Ensure request body is valid JSON
3. **CORS errors**: CORS is enabled for all origins in development

### Debug Mode

Set `NODE_ENV=development` for detailed error logging:
```bash
NODE_ENV=development npm start
```

## License

ISC
