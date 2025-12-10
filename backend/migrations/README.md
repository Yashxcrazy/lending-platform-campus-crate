# Database Migrations

## add-role-to-users.js

This migration adds the `role` field to existing users in the database.

### Prerequisites

1. **Backup your database before running any migration!**

```bash
# Backup users collection
mongoexport --uri="your_mongodb_uri" --collection=users --out=users-backup.json
```

### Usage

#### Basic migration (sets all users without role to 'user'):

```bash
cd backend/migrations
MONGODB_URI="your_mongodb_uri" node add-role-to-users.js
```

#### Promote a specific user to admin:

```bash
cd backend/migrations
MONGODB_URI="your_mongodb_uri" ADMIN_EMAIL="admin@example.com" node add-role-to-users.js
```

### What it does

1. Connects to your MongoDB database
2. Updates all users that don't have a `role` field, setting it to `'user'`
3. If `ADMIN_EMAIL` is provided, promotes that user to `'admin'`
4. Displays a summary of the migration results

### Output example

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📝 Updating users without role field...
✅ Updated 5 users with default role 'user'

👑 Promoting user with email admin@example.com to admin...
✅ Successfully promoted admin@example.com (Admin User) to admin

📊 Migration Summary:
   Total users: 5
   Admins: 1
   Regular users: 4

✅ Migration completed successfully

🔌 Disconnected from MongoDB
```

### Safety Features

- Only updates users that don't have a role field (prevents overwriting existing roles)
- Warns if the specified admin email is not found
- Provides detailed summary of changes
- Safe to run multiple times (idempotent for users without role)

### Restore from backup (if needed)

If something goes wrong, you can restore from the backup:

```bash
mongoimport --uri="your_mongodb_uri" --collection=users --file=users-backup.json --drop
```
