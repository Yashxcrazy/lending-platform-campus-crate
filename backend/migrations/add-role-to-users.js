#!/usr/bin/env node
/**
 * Migration script: add-role-to-users.js
 * 
 * Purpose:
 * - Sets role: 'user' for all users where the role field is missing
 * - Optionally promotes a specific email address to admin role
 * 
 * Usage:
 *   # Dry run (shows what would be changed without making changes)
 *   node backend/migrations/add-role-to-users.js --dry-run
 *   
 *   # Run with confirmation prompt
 *   node backend/migrations/add-role-to-users.js
 *   
 *   # Run without confirmation (auto-confirm)
 *   node backend/migrations/add-role-to-users.js --yes
 *   
 *   # Promote a specific email to admin via command line
 *   node backend/migrations/add-role-to-users.js --promote user@example.com --yes
 *   
 *   # Or via environment variable
 *   ADMIN_EMAIL="user@example.com" node backend/migrations/add-role-to-users.js --yes
 * 
 * Environment Variables:
 *   MONGODB_URI - MongoDB connection string (required)
 *   DB_NAME - Database name (required if not in URI)
 *   ADMIN_EMAIL - Email address to promote to admin (optional)
 * 
 * IMPORTANT: Always backup your users collection before running this migration!
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const autoConfirm = args.includes('--yes');
const promoteIndex = args.indexOf('--promote');
const promoteEmailArg = promoteIndex !== -1 ? args[promoteIndex + 1] : null;

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const adminEmail = promoteEmailArg || process.env.ADMIN_EMAIL;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is required.');
  process.exit(1);
}

// Extract DB name from URI if not provided
let finalDbName = dbName;
if (!finalDbName && uri) {
  const match = uri.match(/\/([^/?]+)(\?|$)/);
  if (match) {
    finalDbName = match[1];
  }
}

if (!finalDbName) {
  console.error('Error: DB_NAME environment variable is required or must be in MONGODB_URI.');
  process.exit(1);
}

async function confirm(question) {
  if (autoConfirm) {
    return true;
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question + ' (y/n): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function run() {
  console.log('========================================');
  console.log('Migration: add-role-to-users.js');
  console.log('========================================');
  console.log('Mode:', isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE');
  console.log('Database:', finalDbName);
  if (adminEmail) {
    console.log('Promote to admin:', adminEmail);
  }
  console.log('========================================\n');

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(finalDbName);
  const users = db.collection('users');

  // Check users missing role field
  const missingCount = await users.countDocuments({ role: { $exists: false } });
  console.log('Users missing role field:', missingCount);

  if (missingCount > 0) {
    const sampleUsers = await users.find({ role: { $exists: false } }).limit(5).project({ email: 1, name: 1 }).toArray();
    console.log('Sample users that will be updated:');
    sampleUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });
    if (missingCount > 5) {
      console.log(`  ... and ${missingCount - 5} more`);
    }
    console.log();
  }

  // Check user to promote
  let userToPromote = null;
  if (adminEmail) {
    userToPromote = await users.findOne({ email: adminEmail });
    if (userToPromote) {
      console.log(`User to promote to admin: ${userToPromote.name} (${userToPromote.email})`);
      console.log(`Current role: ${userToPromote.role || 'not set'}`);
      console.log();
    } else {
      console.warn(`Warning: Email '${adminEmail}' not found in database.`);
      console.log();
    }
  }

  // Confirm before proceeding
  if (!isDryRun) {
    console.log('This will modify the database.');
    const shouldProceed = await confirm('Do you want to proceed?');
    
    if (!shouldProceed) {
      console.log('Migration cancelled.');
      await client.close();
      process.exit(0);
    }
    console.log();
  }

  // Perform updates
  if (!isDryRun) {
    if (missingCount > 0) {
      const res = await users.updateMany({ role: { $exists: false } }, { $set: { role: 'user' } });
      console.log(`✓ Updated ${res.modifiedCount} users with role: 'user'`);
    } else {
      console.log('✓ No users missing role field.');
    }

    if (adminEmail) {
      const promoteRes = await users.updateOne({ email: adminEmail }, { $set: { role: 'admin' } });
      if (promoteRes.matchedCount > 0) {
        console.log(`✓ Promoted '${adminEmail}' to admin role`);
      } else {
        console.log(`✗ Could not find user with email '${adminEmail}'`);
      }
    }
  } else {
    console.log('[DRY RUN] No changes were made.');
    if (missingCount > 0) {
      console.log(`[DRY RUN] Would update ${missingCount} users with role: 'user'`);
    }
    if (adminEmail && userToPromote) {
      console.log(`[DRY RUN] Would promote '${adminEmail}' to admin role`);
    }
  }

  await client.close();
  console.log('\n========================================');
  console.log('Migration complete!');
  console.log('========================================');
}

run().catch(err => { 
  console.error('Migration failed:', err);
  process.exit(1);
});
