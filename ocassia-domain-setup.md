# Ocassia.com Domain Setup Guide

## DNS Configuration in GoDaddy

### 1. Login to GoDaddy DNS Management
1. Go to [godaddy.com](https://godaddy.com) and login
2. Navigate to "My Products" → "Domains"
3. Click "DNS" next to ocassia.com

### 2. Configure DNS Records
Set up these A records to point to your hosting server:

```
Type: A
Name: @
Value: YOUR_SERVER_IP_ADDRESS
TTL: 600

Type: A  
Name: www
Value: YOUR_SERVER_IP_ADDRESS
TTL: 600
```

This ensures both `ocassia.com` and `www.ocassia.com` work.

### 3. SSL Certificate Setup
- Enable SSL in your hosting control panel
- Or use Let's Encrypt for free SSL certificates
- Ensure HTTPS is working before testing authentication

### 4. Environment Variables for Production
Update your production environment with:

```env
REPLIT_DOMAINS=www.ocassia.com,ocassia.com
DOMAIN_NAME=www.ocassia.com
```

### 5. Authentication Callback URLs
The Replit Auth system will automatically use:
- Login redirect: `https://www.ocassia.com/api/callback`
- Logout redirect: `https://www.ocassia.com`

### 6. Testing Deployment
After deployment, test these URLs:
- `https://www.ocassia.com` - Landing page
- `https://www.ocassia.com/api/login` - Authentication flow
- `https://www.ocassia.com/ai-gift-ideas` - Public pages

### 7. Production Checklist
- [ ] DNS A records configured
- [ ] SSL certificate installed and working
- [ ] Environment variables set with ocassia.com domain
- [ ] Frontend and backend files uploaded
- [ ] Database connection tested
- [ ] Authentication flow tested

## Common Issues & Solutions

### Authentication Error: "Unknown authentication strategy"
**This is your current issue!** The authentication system requires a PostgreSQL database.

**Solution:**
1. Set up a PostgreSQL database (Neon recommended - free tier available)
2. Add the DATABASE_URL to your environment variables
3. Run database migrations to create required tables
4. Restart your application

**Quick Setup with Neon:**
1. Go to [neon.tech](https://neon.tech) and create free account
2. Create new project/database
3. Copy the connection string
4. Add to your environment: `DATABASE_URL=postgresql://...`
5. The app will automatically create the needed tables

### Authentication Not Working
- Verify `REPLIT_DOMAINS` includes both www.ocassia.com and ocassia.com
- Ensure SSL is working (HTTPS required for auth)
- Check that callback URLs match your domain
- **Most importantly: Database must be connected and running**

### Site Not Loading
- Verify DNS propagation (can take 24-48 hours)
- Test server IP directly to isolate DNS issues
- Check that .htaccess file is uploaded for React Router support

### Database Connection Issues
- Verify DATABASE_URL format: `postgresql://user:pass@host:port/db`
- Test database connectivity from server
- Ensure database allows connections from your server IP
- Check if database service is running