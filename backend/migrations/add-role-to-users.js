#!/usr/bin/env node
/**
 * Migration script:
 * - Sets role: 'user' where missing
 * - Optionally promotes ADMIN_EMAIL (env) to admin
 *
 * Usage:
 *   node backend/migrations/add-role-to-users.js
 *   or with environment variables:
 *   MONGODB_URI="..." DB_NAME="..." node backend/migrations/add-role-to-users.js
 *   or to promote an email:
 *   MONGODB_URI="..." DB_NAME="..." ADMIN_EMAIL="you@nitrr.ac.in" node backend/migrations/add-role-to-users.js
 *
 * IMPORTANT: backup users collection before running.
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const adminEmail = process.env.ADMIN_EMAIL;

if (!uri || !dbName) {
  console.error('Set MONGODB_URI and DB_NAME environment variables.');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  const users = db.collection('users');

  const missingCount = await users.countDocuments({ role: { $exists: false } });
  console.log('Users missing role field:', missingCount);

  if (missingCount > 0) {
    const res = await users.updateMany({ role: { $exists: false } }, { $set: { role: 'user' } });
    console.log('Updated documents:', res.modifiedCount);
  } else {
    console.log('No users missing role.');
  }

  if (adminEmail) {
    const promoteRes = await users.updateOne({ email: adminEmail }, { $set: { role: 'admin' } });
    console.log('Promote email:', adminEmail, 'matched:', promoteRes.matchedCount, 'modified:', promoteRes.modifiedCount);
    if (promoteRes.matchedCount === 0) {
      console.warn('Admin email not found. You may need to create the user or check the email.');
    }
  }

  await client.close();
  console.log('Migration complete.');
}

run().catch(err => { console.error(err); process.exit(1); });
