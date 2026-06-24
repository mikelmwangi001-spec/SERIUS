// API Response Status Codes
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
  UNAUTHORIZED_ACCESS: "Unauthorized access",
  INVALID_TOKEN: "Invalid or expired token",
  STREAM_NOT_FOUND: "Stream not found",
  PAYMENT_FAILED: "Payment processing failed",
  INTERNAL_ERROR: "Internal server error",
};

// Success Messages
const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  SIGNUP_SUCCESS: "Account created successfully",
  STREAM_STARTED: "Stream started successfully",
  STREAM_ENDED: "Stream ended successfully",
  PAYMENT_SUCCESS: "Payment processed successfully",
};

// Stream Status
const STREAM_STATUS = {
  ACTIVE: "active",
  ENDED: "ended",
  SCHEDULED: "scheduled",
};

// User Roles
const USER_ROLES = {
  USER: "user",
  STREAMER: "streamer",
  ADMIN: "admin",
};

module.exports = {
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STREAM_STATUS,
  USER_ROLES,
};
