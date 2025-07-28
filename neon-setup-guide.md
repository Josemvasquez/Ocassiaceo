# Neon PostgreSQL Setup for Ocassia.com

## Step 1: Create Neon Account and Database

### Sign Up for Neon
1. Go to [neon.tech](https://neon.tech)
2. Click "Sign up" (GitHub login recommended for easy access)
3. Choose the **Free Plan** (perfect for starting out)

### Create Your Database Project
1. Click "Create Project" or "New Project"
2. **Project Name**: `ocassia-production`
3. **Database Name**: `ocassia_db` 
4. **Region**: Choose closest to your GoDaddy server location
   - If unsure, select **US East (Ohio)** for best GoDaddy compatibility
5. Click "Create Project"

## Step 2: Get Your Connection String

After creating the project, Neon will show you connection details:

### Copy the Connection String
Look for something like:
```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/ocassia_db?sslmode=require
```

**Important**: Copy this entire string - you'll need it for your GoDaddy environment variables.

## Step 3: Add to GoDaddy Environment Variables

### Access GoDaddy Control Panel
1. Log into your GoDaddy hosting account
2. Go to "Web Applications" → "Node.js"
3. Find your Ocassia application
4. Click "Environment Variables" or "Settings"

### Add Database Connection
Add this environment variable:
```
Variable Name: DATABASE_URL
Variable Value: postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/ocassia_db?sslmode=require
```

**Replace with your actual connection string from Neon!**

### Complete Environment Variables List
Your GoDaddy environment should have:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/ocassia_db?sslmode=require
SESSION_SECRET=your-secure-random-string
OPENAI_API_KEY=your-openai-key
REPLIT_DOMAINS=www.ocassia.com,ocassia.com
DOMAIN_NAME=www.ocassia.com
ISSUER_URL=https://replit.com/oidc
```

## Step 4: Restart Your Application

1. In GoDaddy control panel, find your Node.js application
2. Click "Restart" or "Stop" then "Start"
3. Wait for the application to fully restart

## Step 5: Test the Connection

### Test Authentication
1. Visit `https://www.ocassia.com/api/login`
2. Should redirect to Replit login (not show error)
3. Log in with your Replit account
4. Should redirect back to your site with successful login

### Verify Database Tables
Your app will automatically create these tables:
- `users` - User profiles
- `sessions` - Authentication sessions
- `contacts` - User contacts
- `special_dates` - Important dates
- `wishlist_items` - Wishlist items
- And other tables for friends, collaborations, etc.

## Troubleshooting

### If Authentication Still Fails:
1. **Check Environment Variables**: Ensure DATABASE_URL is set correctly
2. **Verify Connection String**: Make sure you copied the full string including `?sslmode=require`
3. **Restart Application**: Sometimes takes a few minutes to take effect
4. **Check Logs**: Look for database connection errors in GoDaddy logs

### Connection String Format:
Must include:
- Username and password
- Host ending in `.neon.tech`
- Database name
- `?sslmode=require` at the end

### If You Get "Connection Refused":
- Double-check the connection string
- Ensure your server can access external databases
- Try without `?sslmode=require` if SSL issues persist

## What Happens After Setup

✅ **Authentication works**: Users can log in with Replit accounts  
✅ **Data persistence**: All user data, contacts, dates stored securely  
✅ **Session management**: Login sessions maintained properly  
✅ **Scalability**: Database grows with your user base  
✅ **Backups**: Neon automatically backs up your data  

## Neon Dashboard Features

After setup, you can:
- View database tables and data
- Monitor usage and performance
- Set up additional databases
- Configure backups and branching
- Scale up when needed

Your Ocassia app is now ready for production with full database functionality!