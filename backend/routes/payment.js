const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Payment = require('../models/Payment');
const Stream = require('../models/Stream');
const { auth } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { asyncHandler, APIError } = require('../utils/errorHandler');
const { STATUS_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

// Create Payment Intent
router.post(
  '/create-intent',
  auth,
  [
    body('streamId').notEmpty(),
    body('amount').isNumeric(),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { streamId, amount } = req.body;

    const stream = await Stream.findById(streamId);
    if (!stream) {
      throw new APIError(ERROR_MESSAGES.STREAM_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const payment = new Payment({
      user: req.user.userId,
      stream: streamId,
      amount,
      paymentMethod: 'card',
      status: 'pending',
    });

    await payment.save();

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Payment intent created',
      payment,
    });
  })
);

// Get Payment History
router.get('/history', auth, asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user.userId })
    .populate('stream')
    .sort({ createdAt: -1 });

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    payments,
  });
}));

// Confirm Payment
router.patch(
  '/:paymentId/confirm',
  auth,
  asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      throw new APIError('Payment not found', STATUS_CODES.NOT_FOUND);
    }

    payment.status = 'completed';
    payment.transactionId = `TXN_${Date.now()}`;
    await payment.save();

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
      payment,
    });
  })
);

module.exports = router;