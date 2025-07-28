# Phase 2: SSL Certificate Setup for Ocassia

## Prerequisites
- Phase 1 completed successfully
- Application running on VPS IP address
- Domain ocassia.com pointing to your VPS (we'll do this step)

## Step 1: Temporary Domain Pointing (For SSL)

**Important**: We need to temporarily point your domain to the VPS to get SSL certificates, but we'll test thoroughly before making it permanent.

### Update DNS Records in GoDaddy
1. **Log into GoDaddy Domain Management** (not hosting)
2. **Go to**: My Products → Domains → ocassia.com → DNS
3. **Edit A Records**:
   - Change `@` (root) A record to: `YOUR-VPS-IP`
   - Change `www` A record to: `YOUR-VPS-IP`
   - Set TTL to: `600` (10 minutes for faster changes)

### Wait for DNS Propagation
```bash
# Check if DNS has propagated (run from your computer)
nslookup ocassia.com
nslookup www.ocassia.com

# Should both return your VPS IP address
# May take 10 minutes to 2 hours
```

## Step 2: Install Certbot (Let's Encrypt)

```bash
# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Verify installation
certbot --version
```

## Step 3: Generate SSL Certificates

```bash
# Generate certificates for both domains
sudo certbot --nginx -d ocassia.com -d www.ocassia.com

# Follow the prompts:
# 1. Enter email address (for renewal notifications)
# 2. Agree to terms of service: Y
# 3. Share email with EFF: N (optional)
# 4. Choose redirect option: 2 (redirect HTTP to HTTPS)
```

**Expected output**: Success message with certificate locations

## Step 4: Verify SSL Installation

### Check Certificate Status
```bash
# Check certificate details
sudo certbot certificates

# Should show both domains with valid certificates
```

### Test HTTPS Access
1. **Visit**: `https://www.ocassia.com`
2. **Should show**: Ocassia landing page with SSL lock icon
3. **Test redirect**: `http://www.ocassia.com` should redirect to HTTPS

## Step 5: Update Nginx Configuration

Certbot automatically updates your Nginx config, but let's verify:

```bash
# Check the updated configuration
sudo cat /etc/nginx/sites-available/ocassia
```

**Should now include SSL settings like:**
```nginx
server {
    listen 443 ssl;
    server_name ocassia.com www.ocassia.com;
    
    ssl_certificate /etc/letsencrypt/live/ocassia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ocassia.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        # ... other proxy settings
    }
}

server {
    listen 80;
    server_name ocassia.com www.ocassia.com;
    return 301 https://$server_name$request_uri;
}
```

## Step 6: Test SSL Configuration

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx if test passes
sudo systemctl reload nginx
```

## Step 7: Update Environment Variables for HTTPS

```bash
# Edit environment file
nano /var/www/ocassia/.env.production
```

**Ensure these settings for HTTPS:**
```env
NODE_ENV=production
DOMAIN_NAME=www.ocassia.com
REPLIT_DOMAINS=www.ocassia.com,ocassia.com
# ... other variables remain the same
```

## Step 8: Restart Application

```bash
# Restart to pick up any environment changes
pm2 restart ocassia

# Check logs for any issues
pm2 logs ocassia --lines 50
```

## Step 9: Comprehensive Testing

### Test All HTTPS Functionality
1. **Landing Page**: `https://www.ocassia.com`
2. **HTTP Redirect**: `http://www.ocassia.com` → should redirect to HTTPS
3. **All Pages**:
   - `https://www.ocassia.com/ai-gift-ideas`
   - `https://www.ocassia.com/popular-gifts`
   - `https://www.ocassia.com/gift-guides`
   - `https://www.ocassia.com/find-list`

### Test Authentication Flow
1. **Visit**: `https://www.ocassia.com/api/login`
2. **Should**: Redirect to Replit login page
3. **After login**: Should redirect back to your site
4. **Test**: Full authentication flow works

### SSL Security Test
Visit: [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- Enter: `ocassia.com`
- Should get A or A+ rating

## Step 10: Set Up Auto-Renewal

```bash
# Test renewal process
sudo certbot renew --dry-run

# Should show "Congratulations, all renewals succeeded"

# Check automatic renewal cron job
sudo systemctl status certbot.timer

# Enable if not already enabled
sudo systemctl enable certbot.timer
```

## Troubleshooting Common Issues

### Issue: Certificate Generation Fails
**Possible causes:**
- DNS not propagated yet (wait longer)
- Nginx not serving on port 80
- Firewall blocking port 80/443

**Solutions:**
```bash
# Check nginx is running
sudo systemctl status nginx

# Check if ports are open
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443

# Check DNS propagation
dig ocassia.com
```

### Issue: SSL Not Working After Installation
```bash
# Check nginx configuration
sudo nginx -t

# Check certificate files exist
ls -la /etc/letsencrypt/live/ocassia.com/

# Restart nginx
sudo systemctl restart nginx
```

### Issue: Authentication Redirects Not Working
**Check environment variables:**
```bash
# Verify HTTPS in environment
cat /var/www/ocassia/.env.production

# Restart application
pm2 restart ocassia
```

## Phase 2 Complete Checklist

- [ ] DNS pointing to VPS (temporarily)
- [ ] Certbot installed
- [ ] SSL certificates generated for both domains
- [ ] Nginx configured for HTTPS
- [ ] HTTP to HTTPS redirect working
- [ ] All pages load over HTTPS
- [ ] Authentication flow works with HTTPS
- [ ] SSL rating A or higher
- [ ] Auto-renewal configured
- [ ] No SSL warnings in browser

**Once Phase 2 is complete and HTTPS works perfectly, your domain is already live! Phase 3 is just cleanup and final verification.**

**If anything doesn't work, you can quickly revert DNS back to WordPress hosting while you troubleshoot.**