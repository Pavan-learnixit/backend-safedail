// safedial.routes.js
const express = require('express');
const router = express.Router(); 

// GET Request
router.get('/', (req, res) => {
    
    res.status(200).json({ 
        message: 'Successfully retrieved all entries.', 
        data: [] 
    });
});

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