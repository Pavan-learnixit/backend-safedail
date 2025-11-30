// safedial.routes.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); 

const spamLimiter = rateLimit({
    windowMs: 60 * 1000,      // 1 minute (in milliseconds)
    max: 5,                   // Limit each IP to 5 requests per windowMs
    message: {                // The response message sent when the limit is hit
        status: 429,
        message: "Try again in 1 minute."
    },
    standardHeaders: true,   
    legacyHeaders: false,     
});

// GET Request
router.get('/', (req, res) => {
    
    res.status(200).json({ 
        message: 'Successfully retrieved all entries.', 
        data: [] 
    });
});
router.post('/api/send_message', spamLimiter, (req, res) => { 

});


router.post('/register', spamLimiter, (req, res) => {
    
});

router.get('/api/protected/data', (req, res) => {
    // ...
});


module.exports = router;

//  POST Request
router.post('/', (req, res) => {
    const { phoneNumber, name } = req.body; 

    
    if (!phoneNumber || !name) {
        return res.status(400).json({ message: 'Phone number and name are required.' });
    }

    res.status(201).json({ 
        message: 'Safe Dial entry created successfully.',
        newEntry: { phoneNumber, name }
    });
});

module.exports = router;