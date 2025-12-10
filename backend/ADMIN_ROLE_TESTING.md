# Admin Role Feature - Testing Guide

This guide provides step-by-step instructions for testing the admin role functionality added to the backend API.

## Prerequisites

- MongoDB instance running and accessible
- Backend server configured with `MONGODB_URI` and `JWT_SECRET` environment variables
- API testing tool (curl, Postman, or similar)

## Testing Steps

### 1. Database Preparation

#### Backup existing data
```bash
mongoexport --uri="<MONGODB_URI>" --collection=users --out=users-backup.json
```

#### Run the migration
```bash
cd backend/migrations
MONGODB_URI="<your_uri>" ADMIN_EMAIL="admin@example.com" node add-role-to-users.js
```

Expected output:
```
✅ Connected to MongoDB
✅ Updated X users with default role 'user'
✅ Successfully promoted admin@example.com to admin
📊 Migration Summary:
   Total users: X
   Admins: 1
   Regular users: X-1
✅ Migration completed successfully
```

### 2. Start the Server

```bash
cd backend
npm start
```

Verify server starts without errors and logs:
```
✅ MongoDB connected successfully
🚀 Server running on port 3001
```

### 3. Test User Registration (New Users Get 'user' Role)

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123",
    "university": "Test University"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "university": "Test University",
    "isVerified": false,
    "role": "user"  // ← Should be 'user'
  }
}
```

**Verify:** Response includes `role: "user"` field.

### 4. Test Login (Returns Role in Response)

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "user"  // ← Should include role
  }
}
```

**Save the token** from response for next steps.

### 5. Test JWT Contains Role

Decode the JWT token (use https://jwt.io or similar):

**Expected JWT Payload:**
```json
{
  "userId": "...",
  "role": "user",  // ← Should be present
  "iat": 1234567890,
  "exp": 1234567890
}
```

### 6. Test /api/auth/me Returns Role

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <your_token>"
```

**Expected Response:**
```json
{
  "id": "...",
  "name": "Test User",
  "email": "testuser@example.com",
  "role": "user",  // ← Should include role
  ...
}
```

### 7. Test Non-Admin Cannot Access Admin Endpoints

Using the regular user token from step 4:

```bash
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer <regular_user_token>"
```

**Expected Response (403 Forbidden):**
```json
{
  "message": "Admin access required"
}
```

### 8. Test Admin Can Access Admin Endpoints

Login as admin (using the email from migration):

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin_password"
  }'
```

Save the admin token, then test admin endpoints:

#### Get all users
```bash
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer <admin_token>"
```

**Expected Response:**
```json
[
  {
    "id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    ...
    // Note: password field should NOT be present
  },
  {
    "id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "user",
    ...
  }
]
```

**Verify:** 
- Array of all users returned
- No `password` field in any user object
- Each user has a `role` field

### 9. Test Admin Can Update User Roles

Get a regular user's ID from the previous response, then:

```bash
curl -X PUT http://localhost:3001/api/admin/users/<user_id>/role \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

**Expected Response:**
```json
{
  "id": "<user_id>",
  "name": "Test User",
  "email": "testuser@example.com",
  "role": "admin",  // ← Updated to admin
  ...
  // Note: password field should NOT be present
}
```

### 10. Test Self-Demotion Protection

Try to demote yourself:

```bash
curl -X PUT http://localhost:3001/api/admin/users/<your_admin_id>/role \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "user"}'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Cannot demote yourself from admin"
}
```

### 11. Test Last Admin Protection

If you only have one admin, try to demote them:

```bash
curl -X PUT http://localhost:3001/api/admin/users/<only_admin_id>/role \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "user"}'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Cannot remove the last admin"
}
```

### 12. Test Invalid Role Validation

```bash
curl -X PUT http://localhost:3001/api/admin/users/<user_id>/role \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "superadmin"}'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Invalid role. Must be \"user\" or \"admin\""
}
```

### 13. Test Role Changes Require Re-login

1. Login as a regular user and save token
2. Have an admin promote that user to admin
3. Try to access admin endpoint with old token
4. **Expected:** Should still get 403 (old token has old role)
5. Login again as the same user
6. **Expected:** New token should have `role: "admin"` and admin endpoints should work

## Security Verification

✅ **Passwords excluded:** Verify that no API response includes password fields
✅ **Role in JWT:** All JWTs include role in payload
✅ **Auth required:** Admin endpoints return 401 without auth token
✅ **Admin required:** Admin endpoints return 403 for non-admin users
✅ **Self-demotion blocked:** Cannot demote yourself from admin
✅ **Last admin protected:** Cannot remove the last admin
✅ **Role validation:** Only 'user' and 'admin' roles accepted
✅ **Re-login required:** Role changes only take effect after re-login

## Cleanup

If you need to restore the database:

```bash
mongoimport --uri="<MONGODB_URI>" --collection=users --file=users-backup.json --drop
```

## Summary

All tests should pass with the expected responses. The admin role feature is working correctly if:

1. New users get 'user' role by default
2. Migration successfully promotes specified email to admin
3. JWT tokens include role in payload
4. All auth endpoints return role in user object
5. Non-admins cannot access admin endpoints (403)
6. Admins can list users and update roles
7. Self-demotion and last-admin-removal are prevented
8. No passwords appear in any API response
9. Role changes require re-login to take effect
