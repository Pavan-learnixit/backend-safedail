// routes/spam.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const spamController = require('../controllers/spamController');
const auth = require('../middleware/auth');

// Basic rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'rate_limited' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public lookup
router.get('/lookup/:phone', limiter, spamController.lookupNumber);

// Report requires some reporter id 
router.post('/report', limiter, auth.optional, spamController.reportNumber);

// Unreport
router.post('/unreport', limiter, auth.optional, spamController.unreportNumber);

router.get('/admin/summary', limiter, auth.adminOnly, spamController.adminSummary);

module.exports = router;

