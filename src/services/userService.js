const db = require('../config/database');
const { hashPassword, comparePasswords } = require('../utils/passwordUtils');
const { validateEmail, validatePassword } = require('../utils/validationUtils');
const { AuthError } = require('../utils/errorUtils');

class UserService {
  async createUser(email, password) {
    validateEmail(email);
    validatePassword(password);
    
    const hashedPassword = await hashPassword(password);
    
    try {
      const existingUser = await db.getAsync(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser) {
        throw new AuthError('Email already exists', 409);
      }

      const result = await db.runAsync(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
      return result.lastID;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Error creating user');
    }
  }

  async validateUser(email, password) {
    validateEmail(email);
    
    const user = await db.getAsync(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      throw new AuthError('Invalid credentials', 401);
    }

    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      throw new AuthError('Invalid credentials', 401);
    }

    return user;
  }

  async getUserById(userId) {
    const user = await db.getAsync(
      'SELECT id, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new AuthError('User not found', 404);
    }

    return user;
  }
}

module.exports = new UserService();