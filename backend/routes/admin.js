const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Stream = require('../models/Stream');
const Payment = require('../models/Payment');
const { auth, authorize } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../utils/errorHandler');
const { STATUS_CODES, USER_ROLES } = require('../config/constants');

// Get Dashboard Stats
router.get(
  '/dashboard',
  auth,
  authorize([USER_ROLES.ADMIN]),
  asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalStreams = await Stream.countDocuments();
    const totalPayments = await Payment.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      stats: {
        totalUsers,
        totalStreams,
        totalPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  })
);

// Get All Users
router.get(
  '/users',
  auth,
  authorize([USER_ROLES.ADMIN]),
  asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      users,
    });
  })
);

// Get All Payments
router.get(
  '/payments',
  auth,
  authorize([USER_ROLES.ADMIN]),
  asyncHandler(async (req, res) => {
    const payments = await Payment.find()
      .populate('user')
      .populate('stream')
      .sort({ createdAt: -1 });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      payments,
    });
  })
);

module.exports = router;