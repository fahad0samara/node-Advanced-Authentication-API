const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const helmetConfig = require('./helmetConfig');

const securityHeaders = helmet(helmetConfig);

const xssMiddleware = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
};

const requestSizeLimiter = express.json({ 
  limit: process.env.MAX_REQUEST_SIZE || '10kb' 
});

module.exports = {
  securityHeaders,
  xssMiddleware,
  requestSizeLimiter,
  mongoSanitize: mongoSanitize()
};