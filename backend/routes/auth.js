const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const { auth } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { APIError, asyncHandler } = require('../utils/errorHandler');
const { STATUS_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES, USER_ROLES } = require('../config/constants');

// Register
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 30 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      throw new APIError(ERROR_MESSAGES.USER_EXISTS, STATUS_CODES.CONFLICT);
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.SIGNUP_SUCCESS,
      token,
      user: user.toJSON(),
    });
  })
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new APIError(ERROR_MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new APIError(ERROR_MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      token,
      user: user.toJSON(),
    });
  })
);

// Get Profile
router.get('/profile', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).populate('followers').populate('following');
  if (!user) {
    throw new APIError(ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    user,
  });
}));

module.exports = router;