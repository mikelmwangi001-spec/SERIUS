const { STATUS_CODES, ERROR_MESSAGES } = require("../config/constants");

class APIError extends Error {
  constructor(message, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  err.message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;

  // Mongoose cast error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new APIError(message, STATUS_CODES.BAD_REQUEST);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    err = new APIError(message, STATUS_CODES.CONFLICT);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = ERROR_MESSAGES.INVALID_TOKEN;
    err = new APIError(message, STATUS_CODES.UNAUTHORIZED);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token has expired";
    err = new APIError(message, STATUS_CODES.UNAUTHORIZED);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    statusCode: err.statusCode,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  APIError,
  errorHandler,
  asyncHandler,
};
