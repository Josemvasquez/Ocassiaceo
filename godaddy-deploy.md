# GoDaddy Deployment Guide for Ocassia

## Quick Start Commands

```bash
# 1. Build for production
node build-production.js

# 2. Upload files to GoDaddy (see upload instructions below)

# 3. Configure environment variables in GoDaddy control panel
```

## Step-by-Step GoDaddy Deployment

### 1. Prepare Your Build

Run the production build script:
```bash
node build-production.js
```

This creates a `dist/` folder with:
- `dist/public/` - Frontend files (upload to web root)
- `dist/server.js` - Backend server (upload to Node.js app)
- `dist/package.json` - Production dependencies
- `.env.template` - Environment variables template

### 2. GoDaddy Control Panel Setup

**Enable Node.js:**
1. Log into your GoDaddy hosting account
2. Go to "Web Applications" → "Node.js"
3. Click "Create Application" 
4. Choose Node.js version 18+
5. Set startup file to `server.js`

### 3. Upload Files

**Frontend Files (to website root):**
- Upload everything from `dist/public/` to your domain's root directory
- Include the `.htaccess` file for React Router support

**Backend Files (to Node.js app directory):**
- Upload `dist/server.js` to your Node.js application folder
- Upload `dist/package.json` to the same folder

### 4. Set Environment Variables

In your GoDaddy Node.js app settings, add these variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-super-secure-random-string-here
OPENAI_API_KEY=your-openai-api-key
REPLIT_DOMAINS=www.ocassia.com,ocassia.com
DOMAIN_NAME=www.ocassia.com
ISSUER_URL=https://replit.com/oidc
```

### 5. Database Setup Options (REQUIRED FOR AUTHENTICATION)

**The authentication error you're seeing happens because no database is connected.**

**Option A: Neon PostgreSQL (Recommended - Free Tier)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new database project
3. Copy the connection string (looks like: `postgresql://username:password@host/database`)
4. Set as `DATABASE_URL` in your GoDaddy environment variables
5. Restart your application - tables will be created automatically

**Option B: GoDaddy PostgreSQL**
1. Enable PostgreSQL in your hosting plan
2. Create database and user in cPanel
3. Use connection details for `DATABASE_URL`
4. Format: `postgresql://username:password@localhost:5432/database_name`

**After Adding Database:**
- Your login should work immediately
- User sessions will be stored in the database
- The app creates required tables automatically (users, sessions)

### 6. Domain Configuration

1. **SSL Certificate**: Enable SSL/HTTPS in GoDaddy
2. **DNS Settings**: Point your domain to the hosting account
3. **Subdomain Setup**: Configure www redirect if needed

### 7. Final Steps

1. **Install Dependencies**: GoDaddy will automatically run `npm install`
2. **Start Application**: Your Node.js app should start automatically
3. **Test Deployment**: Visit your domain to verify everything works

### 8. Verification Checklist

- [ ] Website loads at your domain
- [ ] SSL certificate is active (HTTPS)
- [ ] Login functionality works
- [ ] API endpoints respond correctly
- [ ] Database connections are successful
- [ ] Static files (CSS, JS, images) load properly

## Troubleshooting

**Website not loading:**
- Check that all files from `dist/public/` are in the root directory
- Verify `.htaccess` file is uploaded and readable

**API errors:**
- Confirm environment variables are set correctly
- Check Node.js application logs in GoDaddy control panel
- Verify database connection string

**Login issues:**
- Ensure `REPLIT_DOMAINS` matches your actual domain
- Check that `SESSION_SECRET` is set and secure

**Database connection failed:**
- Test database connection string separately
- Ensure database server allows connections from GoDaddy IPs
- Check firewall settings on database host

## File Structure After Upload

```
yourdomain.com/
├── index.html                 # React app entry point
├── assets/                    # CSS, JS, images
├── .htaccess                 # Apache configuration
└── node_app/
    ├── server.js             # Express server
    ├── package.json          # Dependencies
    └── node_modules/         # Auto-installed
```

## Performance Tips

1. **Enable Gzip**: GoDaddy usually has this enabled by default
2. **Use CDN**: Consider Cloudflare for better global performance
3. **Optimize Images**: Compress images in your assets folder
4. **Database Indexing**: Add indexes for frequently queried fields

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique `SESSION_SECRET` (32+ characters)
- Keep OpenAI API keys secure and monitor usage
- Regularly update dependencies for security patches

## Support

If you need help:
1. Check GoDaddy's Node.js documentation
2. Review error logs in the hosting control panel
3. Test individual components (frontend, API, database) separately
4. Contact GoDaddy support for hosting-specific issues

Your Ocassia app should now be live and accessible to users worldwide!