const { asyncHandler } = require('../utils/asyncHandler');
const authService = require('../services/authService');
const { createSuccessResponse } = require('../utils/responseUtils');
const { COOKIE_OPTIONS } = require('../config/constants');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.registerUser(email, password);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(201).json(createSuccessResponse({
      accessToken
    }, 'User registered successfully'));
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(email, password);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.json(createSuccessResponse({
      accessToken
    }, 'Login successful'));
  });

  refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const tokens = await authService.refreshToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    res.json(createSuccessResponse({
      accessToken: tokens.accessToken
    }));
  });

  logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.logout(req.user.userId, refreshToken);
    }
    
    res.clearCookie('refreshToken');
    res.json(createSuccessResponse(null, 'Logged out successfully'));
  });

  protected = asyncHandler(async (req, res) => {
    res.json(createSuccessResponse({
      userId: req.user.userId
    }, 'Protected route accessed successfully'));
  });
}

module.exports = new AuthController();