// controllers/spamController.js
const NumberEntry = require('../models/NumberEntry');
const NumberReport = require('../models/NumberReport');

// Normalizes phone numbers: remove spaces, parentheses, dashes. Keep plus and digits.
function normalizeNumber(num) {
  if (!num) return null;
  return String(num).replace(/[^0-9+]/g, '');
}

// Simple spam scoring function - tune weights as you like
function computeSpamScore(entry) {
  // base: each unique reporter adds 20 points, capped at 100
  const unique = entry.uniqueReporters || 0;
  const score = Math.min(100, unique * 20);
  return score;
}

module.exports = {

  // GET /api/spam/lookup/:phone
  async lookupNumber(req, res) {
    try {
      const raw = req.params.phone;
      const phone = normalizeNumber(raw);
      if (!phone) return res.status(400).json({ error: 'invalid_phone' });

      const entry = await NumberEntry.findOne({ phoneNumber: phone }).lean();
      if (!entry) {
        return res.status(200).json({
          phoneNumber: phone,
          known: false,
          isSpam: false,
          spamScore: 0,
        });
      }

      return res.status(200).json({
        phoneNumber: entry.phoneNumber,
        known: !!entry.displayName,
        displayName: entry.displayName,
        isSpam: entry.isSpam,
        spamScore: entry.spamScore,
        spamReportsCount: entry.spamReportsCount,
        uniqueReporters: entry.uniqueReporters,
        lastReportedAt: entry.lastReportedAt,
      });
    } catch (err) {
      console.error('lookupNumber error', err);
      return res.status(500).json({ error: 'lookup_failed' });
    }
  },

  // POST /api/spam/report
  // body: { phoneNumber, reason, details } and either req.user._id or body.reportedBy
  async reportNumber(req, res) {
    try {
      const body = req.body || {};
      const phone = normalizeNumber(body.phoneNumber || body.phone);
      if (!phone) return res.status(400).json({ error: 'invalid_phone' });

      // Identify reporter
      const reporterId = (req.user && req.user._id) || body.reportedBy;
      if (!reporterId) {
        return res.status(400).json({ error: 'reporter_required' });
      }

      // Upsert entry
      let entry = await NumberEntry.findOneAndUpdate(
        { phoneNumber: phone },
        { $setOnInsert: { phoneNumber: phone, firstReportedAt: new Date() } },
        { upsert: true, new: true }
      );

      // Create unique report
      try {
        await NumberReport.create({
          numberEntry: entry._id,
          reportedBy: reporterId,
          reason: body.reason || 'spam',
          details: body.details || ''
        });
      } catch (e) {
        // duplicate => user already reported
        if (e.code === 11000) {
          return res.status(409).json({ error: 'already_reported' });
        }
        throw e;
      }

      // Recalculate aggregated stats
      const reportsCount = await NumberReport.countDocuments({ numberEntry: entry._id });
      const uniqueReporters = (await NumberReport.distinct('reportedBy', { numberEntry: entry._id })).length;

      entry.spamReportsCount = reportsCount;
      entry.uniqueReporters = uniqueReporters;
      entry.lastReportedAt = new Date();
      entry.spamScore = computeSpamScore(entry);
      entry.isSpam = entry.spamScore >= 60; // threshold adjustable
      await entry.save();

      return res.status(201).json({ message: 'reported', spamScore: entry.spamScore, isSpam: entry.isSpam });
    } catch (err) {
      console.error('reportNumber error', err);
      return res.status(500).json({ error: 'report_failed' });
    }
  },

  // POST /api/spam/unreport
  // body: { phoneNumber } and reporter info same as report
  async unreportNumber(req, res) {
    try {
      const body = req.body || {};
      const phone = normalizeNumber(body.phoneNumber || body.phone);
      const reporterId = (req.user && req.user._id) || body.reportedBy;
      if (!phone || !reporterId) return res.status(400).json({ error: 'invalid_input' });

      const entry = await NumberEntry.findOne({ phoneNumber: phone });
      if (!entry) return res.status(404).json({ error: 'not_found' });

      await NumberReport.deleteOne({ numberEntry: entry._id, reportedBy: reporterId });

      const reportsCount = await NumberReport.countDocuments({ numberEntry: entry._id });
      const uniqueReporters = (await NumberReport.distinct('reportedBy', { numberEntry: entry._id })).length;

      entry.spamReportsCount = reportsCount;
      entry.uniqueReporters = uniqueReporters;
      entry.spamScore = computeSpamScore(entry);
      entry.isSpam = entry.spamScore >= 60;
      await entry.save();

      return res.status(200).json({ message: 'unreported', spamScore: entry.spamScore, isSpam: entry.isSpam });
    } catch (err) {
      console.error('unreportNumber error', err);
      return res.status(500).json({ error: 'unreport_failed' });
    }
  },

  // GET /api/spam/admin/summary
  async adminSummary(req, res) {
    try {
      const top = await NumberEntry.find().sort({ spamScore: -1 }).limit(50).lean();
      return res.status(200).json({ top });
    } catch (err) {
      console.error('adminSummary error', err);
      return res.status(500).json({ error: 'admin_failed' });
    }
  }
};
