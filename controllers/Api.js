// controllers/API.js

const User = require('../models/User'); 

/**

 */
exports.getUserByNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.query;

        // Input Validation
        if (!phoneNumber) {
            // 400 Bad Request
            return res.status(400).json({ 
                message: 'Phone number is required.' 
            });
        }

        // Find the user/number in the database
        const user = await User.findOne({ phoneNumber });

        // Handle 'Not Found' Case
        if (!user) {
            // 404 Not Found
            return res.status(404).json({ 
                message: 'User not found.' 
            });
        }

        // Successful Response (200 OK)
        return res.status(200).json({
            name: user.name || 'Unknown Caller',
            phoneNumber: user.phoneNumber,
            spamCount: user.spamCount || 0,
        });

    } catch (err) {
        console.error('Error fetching user:', err);
        // Handle Internal Server Errors
        return res.status(500).json({ 
            message: 'Internal Server Error' 
        });
    }
};

/**
 */
exports.reportNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Input Validation
        if (!phoneNumber) {
            // 400 Bad Request
            return res.status(400).json({ 
                message: 'Phone number is required in the request body.' 
            });
        }

        // Find and Update the user/number:
        // $inc: atomically increments spamCount by 1
        
        const updatedUser = await User.findOneAndUpdate(
            { phoneNumber },
            { $inc: { spamCount: 1 } }, 
            { new: true, upsert: true } 
        );
        
        // Successful Response (200 OK)
        return res.status(200).json({
            message: 'Number successfully reported as spam.',
            phoneNumber: updatedUser.phoneNumber,
            newSpamCount: updatedUser.spamCount
        });

    } catch (err) {
        console.error('Error reporting number as spam:', err);
        // Handle Internal Server Errors
        return res.status(500).json({ 
            message: 'Internal Server Error' 
        });
    }
};
