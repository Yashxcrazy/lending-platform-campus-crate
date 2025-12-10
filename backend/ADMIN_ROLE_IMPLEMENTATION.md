# Admin Role Implementation

## Overview

This implementation adds a comprehensive admin role system to the backend API, enabling proper role-based access control for administrative functions.

## Architecture

### Role System

- **Roles:** Two roles are supported: `'user'` (default) and `'admin'`
- **Storage:** Roles are stored in the User model in MongoDB
- **Transport:** Roles are included in JWT tokens and all auth responses
- **Enforcement:** Role checks are performed via middleware on protected routes

### Authentication Flow

1. User logs in or registers
2. Server generates JWT token including `userId` and `role`
3. Client stores token and includes it in `Authorization` header
4. Server validates token and extracts role on each request
5. Admin middleware checks if user has admin role

## Files Modified/Added

### 1. User Model (`backend/models/User.js`)

**Changes:**
- Added `role` field with enum `['user', 'admin']` and default `'user'`

```javascript
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
}
```

**Impact:**
- All new users automatically get 'user' role
- Existing users need migration to add role field

### 2. Auth Middleware (`backend/middleware/auth.js`)

**Changes:**
- Extracts role from JWT token
- Populates `req.user` with `{ id, role }`
- No database query on each request (performance optimization)

**Behavior:**
- Sets `req.user.id` and `req.user.role` from JWT
- Falls back to 'user' role if not present (for backward compatibility)
- Role changes require re-login to get new JWT

### 3. Admin Middleware (`backend/middleware/isAdmin.js`) - NEW

**Purpose:** Protect admin-only routes

**Logic:**
```javascript
if (!req.user) return 401 // Not authenticated
if (req.user.role !== 'admin') return 403 // Not admin
next() // Allow access
```

**Usage:**
```javascript
router.use(authenticateToken); // First authenticate
router.use(isAdmin);           // Then check admin
```

### 4. Auth Routes (`backend/routes/auth.js`)

**Changes:**

**Register endpoint:**
- JWT payload includes role: `{ userId, role }`
- Response includes role: `user.role`

**Login endpoint:**
- JWT payload includes role: `{ userId, role }`
- Response includes role: `user.role`

**GET /me endpoint:**
- No changes needed (automatically returns role via select('-password'))

### 5. Admin Routes (`backend/routes/admin.js`) - NEW

**Base Path:** `/api/admin`

**Middleware:** All routes require authentication + admin role

**Endpoints:**

#### GET /api/admin/users
- Returns array of all users
- Passwords excluded via `.select('-password')`
- No pagination (can be added if needed)

#### PUT /api/admin/users/:id/role
- Request body: `{ role: 'user' | 'admin' }`
- Validates role is either 'user' or 'admin'
- **Protection:** Prevents self-demotion
- **Protection:** Prevents removing last admin
- Returns updated user without password

**Safety Checks:**
```javascript
// Prevent self-demotion
if (id === req.user.id && role === 'user') {
  return 400 "Cannot demote yourself from admin"
}

// Prevent removing last admin
if (role === 'user') {
  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount <= 1) {
    return 400 "Cannot remove the last admin"
  }
}
```

### 6. Server (`backend/server.js`)

**Changes:**
- Import admin routes: `const adminRoutes = require('./routes/admin');`
- Mount admin routes: `app.use('/api/admin', adminRoutes);`

### 7. Migration Script (`backend/migrations/add-role-to-users.js`) - NEW

**Purpose:** Add role field to existing users

**Features:**
- Updates users without role to `role: 'user'`
- Optional: Promotes specified email to admin via `ADMIN_EMAIL` env var
- Safe to run multiple times (idempotent)
- Displays summary of changes

**Usage:**
```bash
MONGODB_URI=<uri> node add-role-to-users.js
MONGODB_URI=<uri> ADMIN_EMAIL=admin@example.com node add-role-to-users.js
```

**Safety:**
- Requires MONGODB_URI to be set
- Only updates users where `role: { $exists: false }`
- Warns if ADMIN_EMAIL not found
- Includes backup instructions in comments

## API Reference

### Auth Endpoints (Modified)

#### POST /api/auth/register
**Response includes role:**
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"  // ← Added
  }
}
```

#### POST /api/auth/login
**Response includes role:**
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"  // ← Added
  }
}
```

#### GET /api/auth/me
**Response includes role:**
```json
{
  "id": "...",
  "name": "...",
  "email": "...",
  "role": "user",  // ← Added
  ...
}
```

### Admin Endpoints (New)

#### GET /api/admin/users
**Requires:** Authentication + Admin role

**Response:**
```json
[
  {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "admin",
    ...
  }
]
```

#### PUT /api/admin/users/:id/role
**Requires:** Authentication + Admin role

**Request:**
```json
{
  "role": "admin" // or "user"
}
```

**Response:**
```json
{
  "id": "...",
  "name": "...",
  "email": "...",
  "role": "admin",
  ...
}
```

**Error Responses:**
- `400` - Invalid role
- `400` - Cannot demote yourself
- `400` - Cannot remove last admin
- `403` - Admin access required
- `404` - User not found

## Security Considerations

### ✅ Implemented

1. **Password Exclusion:** All queries use `.select('-password')`
2. **Role Validation:** Only 'user' and 'admin' roles accepted
3. **Self-Demotion Prevention:** Admins cannot demote themselves
4. **Last Admin Protection:** Cannot remove the last admin
5. **JWT-Based Roles:** Role stored in JWT, validated on each request
6. **No Role Escalation:** Users cannot change their own role
7. **Admin-Only Access:** isAdmin middleware enforces admin requirement

### ⚠️ Known Limitations

1. **Race Condition:** Multiple simultaneous admin demotions could theoretically remove all admins (low risk in practice)
2. **Role Changes:** Require re-login to take effect (documented behavior)
3. **No Audit Log:** Role changes are not logged (could be added)
4. **No Permissions:** Only two roles (could be extended to permissions system)

### 🔒 Best Practices

1. **Backup First:** Always backup before running migrations
2. **Limit Admins:** Keep the number of admins to minimum necessary
3. **Monitor Changes:** Log admin actions in production
4. **Rotate Tokens:** Consider shorter JWT expiry for admins
5. **HTTPS Only:** Always use HTTPS in production

## Testing

See `ADMIN_ROLE_TESTING.md` for comprehensive testing guide.

**Quick verification checklist:**
- ✅ New users get 'user' role
- ✅ JWT includes role in payload
- ✅ Auth endpoints return role
- ✅ Non-admins get 403 on admin endpoints
- ✅ Admins can list and update users
- ✅ Self-demotion is prevented
- ✅ Last admin is protected
- ✅ Passwords never exposed

## Migration Guide

### For New Deployments

No migration needed - schema includes default role.

### For Existing Deployments

1. **Backup database:**
   ```bash
   mongoexport --uri="<URI>" --collection=users --out=users-backup.json
   ```

2. **Run migration:**
   ```bash
   cd backend/migrations
   MONGODB_URI=<uri> ADMIN_EMAIL=admin@example.com node add-role-to-users.js
   ```

3. **Verify:**
   ```bash
   # Check all users have role
   # Check admin user has 'admin' role
   # Check admin can access /api/admin/users
   ```

4. **Deploy new code:**
   ```bash
   # Deploy updated backend
   ```

5. **Users must re-login:**
   - Inform users they need to log out and log back in
   - Old tokens won't have role (fallback to 'user')
   - New tokens will include role

## Frontend Integration

### No Frontend Changes Required (This PR)

This is a backend-only implementation. Frontend changes are out of scope.

### Future Frontend Integration

When integrating with frontend:

1. **Store role from login/register response:**
   ```javascript
   const { token, user } = await login(email, password);
   localStorage.setItem('token', token);
   localStorage.setItem('userRole', user.role);
   ```

2. **Conditionally show admin UI:**
   ```javascript
   {user.role === 'admin' && <AdminPanel />}
   ```

3. **Handle 403 errors:**
   ```javascript
   if (response.status === 403) {
     // Redirect to non-admin page
   }
   ```

4. **Force re-login on role change:**
   ```javascript
   // When admin changes user's role
   // Force that user to log out and log back in
   ```

## Troubleshooting

### "Admin access required" even though user is admin

**Cause:** User token doesn't have updated role

**Solution:** User must log out and log back in to get new JWT with role

### Migration says "0 users updated"

**Cause:** All users already have role field

**Solution:** This is normal if migration already ran - it's idempotent

### Cannot promote user to admin in migration

**Cause:** ADMIN_EMAIL doesn't match any user's email

**Solution:** Check email is exactly correct (case-sensitive)

### All admins accidentally removed

**Cause:** Database manually edited or protection bypassed

**Solution:** 
1. Restore from backup
2. Or manually update DB: `db.users.updateOne({email: "..."}, {$set: {role: "admin"}})`

## Future Enhancements

Possible extensions (not in scope for this PR):

1. **More Roles:** Add 'moderator', 'superadmin', etc.
2. **Permissions System:** Fine-grained permissions instead of roles
3. **Audit Log:** Track who changed what and when
4. **Role History:** Track role changes over time
5. **Bulk Operations:** Update multiple users' roles at once
6. **Role Expiry:** Temporary admin access with expiry
7. **Database Query Optimization:** Real-time role updates from DB instead of JWT
8. **Transactions:** Atomic operations to prevent race conditions
