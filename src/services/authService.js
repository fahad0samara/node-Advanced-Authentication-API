const userService = require('./userService');
const tokenService = require('./tokenService');
const { verifyRefreshToken } = require('../utils/tokenUtils');

class AuthService {
  async registerUser(email, password) {
    const userId = await userService.createUser(email, password);
    return tokenService.generateTokenPair(userId);
  }

  async loginUser(email, password) {
    const user = await userService.validateUser(email, password);
    return tokenService.generateTokenPair(user.id);
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const isValid = await tokenService.verifyRefreshToken(decoded.userId, refreshToken);
      
      if (!isValid) {
        throw new Error('Invalid refresh token');
      }

      return tokenService.generateTokenPair(decoded.userId);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId, refreshToken) {
    await tokenService.removeRefreshToken(userId, refreshToken);
  }
}

module.exports = new AuthService();