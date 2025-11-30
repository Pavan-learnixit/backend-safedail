const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        
        trim: true
    },
    
    
    phoneNumber: {
        type: String, 
        required: true, 
        unique: true,   
        trim: true
    },
    
    
    spamCount: {
        type: Number,
        default: 0, 
    },
    
    password: {
        type: String,
        
    },
    accountType: {
        type: String,
        
        default: 'Customer',
        enum: ["Admin", "Customer"]
    },
    
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdditionalDetails",
    },
    lastContactSync: {
        type: Date,
        default: null,
    },
    
    
});

module.exports = mongoose.model('User', userSchema);
