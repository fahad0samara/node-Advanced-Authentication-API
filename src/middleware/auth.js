const { verifyAccessToken } = require('../utils/tokenUtils');
const { AuthError } = require('../utils/errorUtils');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new AuthError('Access token required', 401);
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    throw new AuthError('Invalid or expired token', 403);
  }
};

module.exports = { authenticateToken };