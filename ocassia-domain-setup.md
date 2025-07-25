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

### Authentication Not Working
- Verify `REPLIT_DOMAINS` includes both www.ocassia.com and ocassia.com
- Ensure SSL is working (HTTPS required for auth)
- Check that callback URLs match your domain

### Site Not Loading
- Verify DNS propagation (can take 24-48 hours)
- Test server IP directly to isolate DNS issues
- Check that .htaccess file is uploaded for React Router support

### Database Connection Issues
- Verify DATABASE_URL format
- Test database connectivity from server
- Ensure database allows connections from your server IP