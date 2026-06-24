const { validationResult } = require("express-validator");
const { STATUS_CODES } = require("../config/constants");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }

  next();
};

module.exports = validateRequest;
