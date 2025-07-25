# Fix Authentication Error: Database Setup Required

## Your Current Issue
Error: `"Unknown authentication strategy replitauth:ocassia.com"`

**Cause:** Your Ocassia.com deployment is missing a PostgreSQL database connection, which is required for user authentication and session management.

## Quick Fix - Set Up Database

### Option 1: Neon PostgreSQL (Recommended - Free)

1. **Create Account**: Go to [neon.tech](https://neon.tech) and sign up (free tier available)

2. **Create Database**: 
   - Click "Create Project"
   - Choose a region close to your server
   - Note the connection details

3. **Get Connection String**: Copy the connection string that looks like:
   ```
   postgresql://username:password@hostname.neon.tech/database_name?sslmode=require
   ```

4. **Add to GoDaddy Environment**:
   - Log into your GoDaddy hosting control panel
   - Find your Node.js application settings
   - Add environment variable:
     ```
     DATABASE_URL=postgresql://username:password@hostname.neon.tech/database_name?sslmode=require
     ```

5. **Restart Your App**: Restart your Node.js application in GoDaddy control panel

### Option 2: GoDaddy Database (If Available)

1. **Enable PostgreSQL** in your GoDaddy hosting plan
2. **Create Database** through cPanel
3. **Set DATABASE_URL**:
   ```
   DATABASE_URL=postgresql://db_user:db_password@localhost:5432/db_name
   ```

## What Happens After Database is Connected

✅ Authentication will work immediately  
✅ Users can log in with Replit accounts  
✅ Sessions will be stored securely  
✅ App automatically creates required tables (users, sessions)  

## Test After Setup

1. Visit `https://www.ocassia.com/api/login`
2. Should redirect to Replit login instead of showing error
3. After login, should redirect back to your site with user authenticated

## Environment Variables Checklist

Make sure your production environment has:
```env
NODE_ENV=production
DATABASE_URL=postgresql://...  ← This was missing!
REPLIT_DOMAINS=www.ocassia.com,ocassia.com
DOMAIN_NAME=www.ocassia.com
SESSION_SECRET=your-secure-secret
```

The authentication system cannot initialize without a database connection - that's why you're seeing the "Unknown authentication strategy" error.