const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { registerValidator, loginValidator, validateRequest } = require('../middleware/validators/authValidators');
const { authRateLimit } = require('../middleware/rateLimiter');

router.post('/register', 
  authRateLimit,
  registerValidator,
  validateRequest,
  authController.register
);

router.post('/login',
  authRateLimit,
  loginValidator,
  validateRequest,
  authController.login
);

router.post('/refresh-token',
  authController.refreshToken
);

router.post('/logout',
  authenticateToken,
  authController.logout
);

router.get('/protected',
  authenticateToken,
  authController.protected
);

module.exports = router;