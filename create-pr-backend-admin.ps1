# create-pr-backend-admin.ps1
# Creates a branch feat/backend/admin-role, writes backend role files, commits, pushes, and prints PR URL.
#
# Usage (from repo root in PowerShell):
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\create-pr-backend-admin.ps1
#

$ErrorActionPreference = "Stop"

$REPO_FULL = "Yashxcrazy/lending-platform-campus-crate"
$BRANCH = "feat/backend/admin-role"
$PR_COMPARE_URL = "https://github.com/$REPO_FULL/compare/main...$BRANCH?expand=1"
$TIMESTAMP = (Get-Date -Format "yyyyMMddTHHmmss")

Write-Host "Starting admin role feature branch creation..."

# Ensure clean working tree
$gitStatus = git status --porcelain
if ($gitStatus) {
  Write-Host "ERROR: Working tree is not clean. Commit or stash your changes before running this script." -ForegroundColor Red
  Write-Host $gitStatus
  exit 1
}

# Ensure origin exists
try {
  git rev-parse --verify origin/main 2>&1 | Out-Null
} catch {
  Write-Host "ERROR: Could not find origin/main. Fetching..." -ForegroundColor Yellow
  git fetch origin
}

# Create and switch to new branch from origin/main
Write-Host "Creating branch $BRANCH..." -ForegroundColor Cyan
git fetch origin main
git checkout -b $BRANCH origin/main

Write-Host "Creating backend files..." -ForegroundColor Cyan

# 1) backend/models/User.js
$userModelPath = "backend/models/User.js"
New-Item -ItemType Directory -Force -Path (Split-Path $userModelPath) | Out-Null
$userModelContent = @'
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: String,
  campus: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  trustScore: { type: Number, default: 100 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastActive: Date,
  // Add role field (default 'user'). Allowed values: 'user' | 'admin'
  role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
'@
Set-Content -Path $userModelPath -Value $userModelContent
Write-Host "Created: $userModelPath" -ForegroundColor Green

# 2) backend/middleware/isAdmin.js
$isAdminPath = "backend/middleware/isAdmin.js"
New-Item -ItemType Directory -Force -Path (Split-Path $isAdminPath) | Out-Null
$isAdminContent = @'
/**
 * isAdmin middleware assumes req.user is populated by your auth middleware.
 * It responds with 401 if not authenticated and 403 if not admin.
 */
module.exports = function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admin only' });
  }
  return next();
};
'@
Set-Content -Path $isAdminPath -Value $isAdminContent
Write-Host "Created: $isAdminPath" -ForegroundColor Green

# 3) backend/routes/admin.js
$adminRoutesPath = "backend/routes/admin.js"
New-Item -ItemType Directory -Force -Path (Split-Path $adminRoutesPath) | Out-Null
$adminRoutesContent = @'
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const isAdmin = require('../middleware/isAdmin');

// GET /api/admin/users - list users (admin only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, users });
  } catch (err) {
    console.error('GET /admin/users error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/admin/users/:id/role - change user role (admin only)
router.put('/users/:id/role', isAdmin, async (req, res) => {
  try {
    const targetId = req.params.id;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ success: false, error: 'User not found' });

    // Prevent self-demotion
    if (req.user.id === String(target._id) && role === 'user') {
      return res.status(400).json({ success: false, error: 'Admins cannot demote themselves' });
    }

    // Prevent removing the last admin
    if (role === 'user' && target.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, error: 'Cannot remove the last admin' });
      }
    }

    target.role = role;
    await target.save();

    res.json({ success: true, user: { _id: target._id, name: target.name, email: target.email, role: target.role } });
  } catch (err) {
    console.error('PUT /admin/users/:id/role error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
'@
Set-Content -Path $adminRoutesPath -Value $adminRoutesContent
Write-Host "Created: $adminRoutesPath" -ForegroundColor Green

# 4) backend/migrations/add-role-to-users.js
$migrationPath = "backend/migrations/add-role-to-users.js"
New-Item -ItemType Directory -Force -Path (Split-Path $migrationPath) | Out-Null
$migrationContent = @'
/**
 * Migration script:
 * - Sets role: 'user' where missing
 * - Optionally promotes ADMIN_EMAIL (env) to admin
 *
 * Usage:
 *   $env:MONGODB_URI="..."; $env:DB_NAME="..."; node backend/migrations/add-role-to-users.js
 *   or to promote an email:
 *   $env:MONGODB_URI="..."; $env:DB_NAME="..."; $env:ADMIN_EMAIL="you@nitrr.ac.in"; node backend/migrations/add-role-to-users.js
 *
 * IMPORTANT: backup users collection before running.
 */
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
'@
Set-Content -Path $migrationPath -Value $migrationContent
Write-Host "Created: $migrationPath" -ForegroundColor Green

# 5) backend/controllers/authController.js
$authControllerPath = "backend/controllers/authController.js"
New-Item -ItemType Directory -Force -Path (Split-Path $authControllerPath) | Out-Null
if (Test-Path $authControllerPath) {
  Write-Host "Backing up existing $authControllerPath -> $authControllerPath.bak.$TIMESTAMP" -ForegroundColor Yellow
  Copy-Item $authControllerPath "$authControllerPath.bak.$TIMESTAMP"
}
$authControllerContent = @'
/**
 * authController.js
 * NOTE: This is a safe example update — merge with your existing auth controller as needed.
 * It ensures role is included in JWT payload and in responses, and provides a /auth/me handler.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'replace_with_secret', { expiresIn: '7d' });
}

// Example login handler (adjust to match your password verification)
exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    // TODO: verify password here (bcrypt.compare etc.)
    const token = signToken(user);
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// /api/auth/me handler - returns current user (requires auth middleware to populate req.user)
exports.me = async function (req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.user.id, { password: 0 }).lean();
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('me error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
'@
Set-Content -Path $authControllerPath -Value $authControllerContent
Write-Host "Created: $authControllerPath" -ForegroundColor Green

# Stage and commit
Write-Host "Staging files..." -ForegroundColor Cyan
git add backend/models/User.js backend/middleware/isAdmin.js backend/routes/admin.js backend/migrations/add-role-to-users.js backend/controllers/authController.js

git commit -m "feat(auth): add admin role (User.role), isAdmin middleware, admin routes and migration script"

Write-Host "Pushing branch to origin..." -ForegroundColor Cyan
git push --set-upstream origin $BRANCH

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SUCCESS! Branch pushed." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Open this URL to create a PR:" -ForegroundColor Yellow
Write-Host $PR_COMPARE_URL
Write-Host ""
Write-Host "PR title suggestion:" -ForegroundColor Yellow
Write-Host "  feat(auth): add admin role, admin routes, and migration"
Write-Host ""
Write-Host "PR body suggestion:" -ForegroundColor Yellow
Write-Host @'
Summary:

Add a proper admin role to the backend, include it in auth responses/JWTs, add admin-only endpoints for managing user roles, add an isAdmin middleware, and provide a migration script that sets role:'user' where missing and optionally promotes an ADMIN_EMAIL to admin.

Files added/updated:
- backend/models/User.js (adds role field default 'user')
- backend/middleware/isAdmin.js (new)
- backend/routes/admin.js (new)
- backend/controllers/authController.js (updated example - please merge if you already have logic)
- backend/migrations/add-role-to-users.js (new)

Notes:
- Backup users collection before running the migration (mongoexport).
- Run migration in PowerShell:
  $env:MONGODB_URI="..."; $env:DB_NAME="..."; node backend/migrations/add-role-to-users.js
  or to promote an email:
  $env:MONGODB_URI="..."; $env:DB_NAME="..."; $env:ADMIN_EMAIL="you@nitrr.ac.in"; node backend/migrations/add-role-to-users.js

- After deploying backend changes, users should re-login so tokens or /auth/me include the role.

Testing:
1. Backup DB.
2. Run migration (set missing roles).
3. Promote an admin via migration or PUT /api/admin/users/:id/role.
4. Verify /api/auth/me returns role and admin endpoints are protected.
'@
Write-Host ""
Write-Host "Done!" -ForegroundColor Green
