
// routes/Routes_Api.js
const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate Limiter Definition
const spamLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    message: "Too many requests. Please try again in 1 minute."
  },
  standardHeaders: true,
  legacyHeaders: false,
});


router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Successfully retrieved all Safe Dial entries.',
    data: [], 
  });
});


router.post('/', spamLimiter, (req, res) => {
  const { phoneNumber, name } = req.body;

  if (!phoneNumber || !name) {
    return res.status(400).json({ message: 'Phone number and name are required.' });
  }



  return res.status(201).json({
    message: 'Safe Dial entry created successfully.',
    newEntry: { phoneNumber, name },
  });
});


router.post('/api/send_message', spamLimiter, (req, res) => {
  
  res.status(200).json({
    message: 'Message sending initiated (Rate Limited).'
  });
});


router.post('/register', spamLimiter, (req, res) => {
  
  res.status(201).json({
    message: 'User registration successful (Rate Limited).'
  });
});


router.get('/api/protected/data', (req, res) => {
  
  res.status(200).json({
    message: 'Protected data accessed.'
  });
});

module.exports = router;
