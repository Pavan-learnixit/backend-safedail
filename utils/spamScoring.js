function calculateSpamScore(spamReportsCount, totalLookups) {
  if (totalLookups === 0) return 0;

  const score = (spamReportsCount / totalLookups) * 100;
  return Math.min(100, Math.max(0, score)); // clamp between 0–100
}

function getSpamStatus(score) {
  if (score < 30) return "safe";
  if (score < 60) return "suspicious";
  return "spam";
}

module.exports = { calculateSpamScore, getSpamStatus };
