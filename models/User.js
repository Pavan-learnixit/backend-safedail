// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    spamCount: {
      type: Number,
      default: 0,
    },

    accountType: {
      type: String,
      enum: ['Admin', 'Customer'],
      default: 'Customer',
    },

    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdditionalDetails',
    },

    lastContactSync: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

module.exports = mongoose.model('User', userSchema);

