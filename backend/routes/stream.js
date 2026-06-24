const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Stream = require('../models/Stream');
const { auth, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { asyncHandler, APIError } = require('../utils/errorHandler');
const { STATUS_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES, STREAM_STATUS, USER_ROLES } = require('../config/constants');

// Create Stream
router.post(
  '/',
  auth,
  authorize([USER_ROLES.STREAMER]),
  [
    body('title').trim().notEmpty(),
    body('description').optional().trim(),
    body('category').isIn(['Gaming', 'Music', 'Art', 'Sports', 'Education', 'Other']),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { title, description, category, isMonetized, entryFee } = req.body;

    const stream = new Stream({
      title,
      description,
      category,
      streamer: req.user.userId,
      isMonetized,
      entryFee,
      status: STREAM_STATUS.SCHEDULED,
    });

    await stream.save();

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Stream created successfully',
      stream,
    });
  })
);

// Get All Streams
router.get('/', asyncHandler(async (req, res) => {
  const { status, category, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const streams = await Stream.find(filter)
    .populate('streamer')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Stream.countDocuments(filter);

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    streams,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
}));

// Get Stream By ID
router.get('/:id', asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.params.id).populate('streamer').populate('viewers');
  if (!stream) {
    throw new APIError(ERROR_MESSAGES.STREAM_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    stream,
  });
}));

// Start Stream
router.patch(
  '/:id/start',
  auth,
  authorize([USER_ROLES.STREAMER]),
  asyncHandler(async (req, res) => {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      throw new APIError(ERROR_MESSAGES.STREAM_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (stream.streamer.toString() !== req.user.userId) {
      throw new APIError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS, STATUS_CODES.FORBIDDEN);
    }

    stream.status = STREAM_STATUS.ACTIVE;
    stream.startTime = new Date();
    await stream.save();

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: SUCCESS_MESSAGES.STREAM_STARTED,
      stream,
    });
  })
);

// End Stream
router.patch(
  '/:id/end',
  auth,
  authorize([USER_ROLES.STREAMER]),
  asyncHandler(async (req, res) => {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      throw new APIError(ERROR_MESSAGES.STREAM_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (stream.streamer.toString() !== req.user.userId) {
      throw new APIError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS, STATUS_CODES.FORBIDDEN);
    }

    stream.status = STREAM_STATUS.ENDED;
    stream.endTime = new Date();
    await stream.save();

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: SUCCESS_MESSAGES.STREAM_ENDED,
      stream,
    });
  })
);

module.exports = router;