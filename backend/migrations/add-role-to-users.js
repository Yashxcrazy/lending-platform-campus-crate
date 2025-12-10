#!/usr/bin/env node

/**
 * Migration script to add role field to existing users
 * 
 * IMPORTANT: Backup your users collection before running this migration!
 * Run: mongoexport --uri="<MONGODB_URI>" --collection=users --out=users-backup.json
 * 
 * Usage:
 *   MONGODB_URI=<uri> node add-role-to-users.js
 *   MONGODB_URI=<uri> ADMIN_EMAIL=admin@example.com node add-role-to-users.js
 * 
 * Environment variables:
 *   MONGODB_URI - Required. MongoDB connection string
 *   DB_NAME - Optional. Database name (extracted from URI if not provided)
 *   ADMIN_EMAIL - Optional. Email of user to promote to admin
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI environment variable is required');
  console.error('Usage: MONGODB_URI=<uri> node add-role-to-users.js');
  process.exit(1);
}

// Define a minimal User schema for migration
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function runMigration() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update users without a role field
    console.log('\n📝 Updating users without role field...');
    const updateResult = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );
    
    console.log(`✅ Updated ${updateResult.modifiedCount} users with default role 'user'`);

    // Promote admin if ADMIN_EMAIL is provided
    if (ADMIN_EMAIL) {
      console.log(`\n👑 Promoting user with email ${ADMIN_EMAIL} to admin...`);
      const adminUser = await User.findOneAndUpdate(
        { email: ADMIN_EMAIL },
        { $set: { role: 'admin' } },
        { new: true }
      );

      if (adminUser) {
        console.log(`✅ Successfully promoted ${adminUser.email} (${adminUser.name}) to admin`);
      } else {
        console.warn(`⚠️  Warning: User with email ${ADMIN_EMAIL} not found`);
      }
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Regular users: ${userCount}`);

    console.log('\n✅ Migration completed successfully');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the migration
runMigration();
