const jwt = require("jsonwebtoken");
const { APIError, asyncHandler } = require("../utils/errorHandler");
const { STATUS_CODES, ERROR_MESSAGES } = require("../config/constants");

const auth = asyncHandler((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new APIError(
      ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
      STATUS_CODES.UNAUTHORIZED
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new APIError(
      ERROR_MESSAGES.INVALID_TOKEN,
      STATUS_CODES.UNAUTHORIZED
    );
  }
});

const authorize = (roles = []) => {
  return asyncHandler((req, res, next) => {
    if (!req.user) {
      throw new APIError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        STATUS_CODES.UNAUTHORIZED
      );
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new APIError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        STATUS_CODES.FORBIDDEN
      );
    }

    next();
  });
};

module.exports = { auth, authorize };
