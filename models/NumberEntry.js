// models/NumberEntry.js
const mongoose = require('mongoose');

const numberEntrySchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true, index: true },
  displayName: { type: String, default: null },
  spamScore: { type: Number, default: 0 }, // 0..100
  spamReportsCount: { type: Number, default: 0 },
  uniqueReporters: { type: Number, default: 0 },
  isSpam: { type: Boolean, default: false },
  lastReportedAt: { type: Date, default: null },
  firstReportedAt: { type: Date, default: null },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('NumberEntry', numberEntrySchema);
