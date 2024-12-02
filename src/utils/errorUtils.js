class AuthError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AuthError || err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }

  res.status(500).json({ error: 'Internal server error' });
};

module.exports = {
  AuthError,
  ValidationError,
  errorHandler
};