const { body } = require('express-validator');
const { ValidationError } = require('../../utils/errorUtils');
const { validateEmail, validatePassword } = require('../../utils/validationUtils');

const registerValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .custom(validateEmail),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .custom(validatePassword)
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .custom(validateEmail),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }
  next();
};

module.exports = {
  registerValidator,
  loginValidator,
  validateRequest
};