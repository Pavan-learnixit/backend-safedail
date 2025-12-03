// models/NumberReport.js
const mongoose = require('mongoose');

const numberReportSchema = new mongoose.Schema({
  numberEntry: { type: mongoose.Schema.Types.ObjectId, ref: 'NumberEntry', required: true, index: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // if no User model, store string id instead
  reason: { type: String, default: 'spam' },
  details: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now, index: true },
}, { timestamps: false });

// Prevent same user reporting the same number twice
numberReportSchema.index({ numberEntry: 1, reportedBy: 1 }, { unique: true });

module.exports = mongoose.model('NumberReport', numberReportSchema);
