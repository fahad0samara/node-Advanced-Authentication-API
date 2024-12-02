const db = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { AuthError } = require('../utils/errorUtils');

class TokenService {
  async generateTokenPair(userId) {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    try {
      await db.runAsync(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, refreshToken, expiresAt.toISOString()]
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new AuthError('Error generating tokens');
    }
  }

  async removeRefreshToken(userId, refreshToken) {
    try {
      await db.runAsync(
        'DELETE FROM refresh_tokens WHERE user_id = ? AND token = ?',
        [userId, refreshToken]
      );
    } catch (error) {
      throw new AuthError('Error removing refresh token');
    }
  }

  async verifyRefreshToken(userId, refreshToken) {
    try {
      const token = await db.getAsync(
        'SELECT * FROM refresh_tokens WHERE user_id = ? AND token = ? AND expires_at > datetime("now")',
        [userId, refreshToken]
      );
      
      if (!token) {
        throw new AuthError('Invalid refresh token', 401);
      }

      return true;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Error verifying refresh token');
    }
  }

  async cleanupExpiredTokens() {
    try {
      await db.runAsync('DELETE FROM refresh_tokens WHERE expires_at <= datetime("now")');
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
    }
  }
}

module.exports = new TokenService();