# Secure Authentication API

A robust and secure Node.js/Express.js authentication system with JWT tokens, refresh token rotation, and comprehensive security features.

## Features

- 🔐 Secure user authentication
- 🎟️ JWT access and refresh tokens
- 🔄 Token rotation
- 🛡️ Advanced security measures
- 📝 Input validation
- ⚡ Rate limiting
- 🔍 Request logging
- 🚫 XSS protection
- 🔒 CORS protection

## Project Structure

```
src/
├── config/
│   ├── constants.js         # Application constants
│   └── database/
│       ├── index.js        # Database configuration
│       └── schema.js       # Database schema
├── controllers/
│   └── authController.js   # Authentication controllers
├── data/
│   └── auth.db            # SQLite database
├── logs/
│   ├── combined.log       # Combined logs
│   └── error.log         # Error logs
├── middleware/
│   ├── auth.js           # Token authentication
│   ├── errorMiddleware.js # Error handling
│   ├── rateLimiter.js    # Rate limiting
│   ├── requestLogger.js  # Request logging
│   ├── security/
│   │   ├── corsConfig.js  # CORS configuration
│   │   ├── helmetConfig.js# Helmet security config
│   │   └── index.js      # Security middleware
│   └── validators/
│       └── authValidators.js # Input validation
├── routes/
│   └── authRoutes.js     # Authentication routes
├── services/
│   ├── authService.js    # Authentication logic
│   ├── tokenService.js   # Token management
│   └── userService.js    # User management
├── utils/
│   ├── asyncHandler.js   # Async error handling
│   ├── errorUtils.js     # Error utilities
│   ├── logger.js        # Logging configuration
│   ├── passwordUtils.js  # Password hashing
│   ├── responseUtils.js  # Response formatting
│   ├── sanitizer.js     # Input sanitization
│   ├── tokenUtils.js    # Token utilities
│   └── validationUtils.js# Validation helpers
└── server.js            # Application entry point
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Refresh token rotation
- Rate limiting for API endpoints
- XSS protection
- SQL injection prevention
- CORS configuration
- Request size limiting
- Security headers with Helmet
- Input validation and sanitization
- Secure cookie handling

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user
  - Body: `{ "email": "user@example.com", "password": "SecurePass123" }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "SecurePass123" }`

- `POST /api/auth/refresh-token` - Refresh access token
  - Requires refresh token cookie

- `POST /api/auth/logout` - Logout user
  - Requires authentication

- `GET /api/auth/protected` - Protected route example
  - Requires authentication

## Environment Variables

```env
PORT=3000
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
COOKIE_SECRET=your_cookie_secret_here
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
MAX_REQUEST_SIZE=10kb
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run audit` - Run security audit

## Security Best Practices

1. **Token Management**
   - Access tokens expire after 15 minutes
   - Refresh tokens expire after 7 days
   - Refresh tokens are rotated on use

2. **Password Security**
   - Minimum 8 characters
   - Requires uppercase, lowercase, and numbers
   - Hashed using bcrypt with salt rounds of 12

3. **Rate Limiting**
   - Global rate limit: 100 requests per 15 minutes
   - Auth endpoints: 5 requests per 15 minutes

4. **Input Validation**
   - Email format validation
   - Password strength requirements
   - Input sanitization
   - XSS protection

## Error Handling

The API uses a centralized error handling system with custom error classes:
- `AuthError` - Authentication related errors
- `ValidationError` - Input validation errors

All errors are logged and sanitized before being sent to the client.

## Logging

- Request logging with Winston
- Separate error and combined logs
- Structured logging in JSON format
- Production-safe logging configuration

