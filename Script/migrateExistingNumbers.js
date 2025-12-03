// scripts/migrateExistingNumbers.js
// Usage: node scripts/migrateExistingNumbers.js
const mongoose = require('mongoose');
const NumberEntry = require('../models/NumberEntry');

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('Set MONGO_URI environment variable');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  
  const existing = [
    { phone: '+911234567890', name: 'Example Inc', reports: 3 },
  ];

  for (const e of existing) {
    const phone = String(e.phone).replace(/[^0-9+]/g, '');
    const spamScore = Math.min(100, (e.reports || 0) * 20);
    await NumberEntry.updateOne(
      { phoneNumber: phone },
      { $set: { displayName: e.name || null, spamReportsCount: e.reports || 0, uniqueReporters: e.reports || 0, spamScore, isSpam: spamScore >= 60 } },
      { upsert: true }
    );
    console.log('migrated', phone);
  }

  console.log('migration done');
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });

