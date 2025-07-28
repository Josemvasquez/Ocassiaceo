# GoDaddy VPS Migration Guide for Ocassia.com

## Migration Order (Critical Steps)

### Phase 1: Prepare VPS First (Don't Touch Domain Yet)
**Do this BEFORE changing any domain settings:**

1. **Set Up VPS Environment**
   - Install Node.js 18+ on your VPS
   - Install npm and required dependencies
   - Configure SSL certificate for HTTPS
   - Set up PostgreSQL or connect to Neon database

2. **Deploy Ocassia Application**
   - Upload your application files to VPS
   - Install dependencies: `npm install`
   - Configure environment variables
   - Test application on VPS IP address directly
   - Ensure everything works on `http://YOUR-VPS-IP:3000`

3. **Configure Web Server (Nginx recommended)**
   - Set up reverse proxy to your Node.js application
   - Configure SSL certificate for ocassia.com
   - Test configuration

### Phase 2: Test Before Domain Switch
**Verify everything works:**
- Visit `http://YOUR-VPS-IP` - should show Ocassia landing page
- Test login flow: `http://YOUR-VPS-IP/api/login`
- Verify all pages load correctly
- Check database connection and functionality

### Phase 3: Domain Migration (Only After VPS is Ready)

**Step 1: Update DNS Records**
In GoDaddy Domain Management (NOT hosting):
- Change A record for `@` (root domain) to point to your VPS IP
- Change A record for `www` to point to your VPS IP
- Keep TTL low (300-600 seconds) for faster propagation

**Step 2: Update Environment Variables**
On your VPS, ensure these are set:
```env
NODE_ENV=production
DOMAIN_NAME=www.ocassia.com
REPLIT_DOMAINS=www.ocassia.com,ocassia.com
DATABASE_URL=your-database-connection-string
SESSION_SECRET=your-secure-secret
OPENAI_API_KEY=your-openai-key
```

**Step 3: WordPress Hosting Disconnect**
- After DNS propagates and VPS is working
- Cancel or modify your WordPress hosting plan
- WordPress files become irrelevant once DNS points to VPS

## VPS Setup Commands

### 1. Install Node.js
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install Nginx (Web Server)
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. Deploy Ocassia
```bash
# Create application directory
sudo mkdir -p /var/www/ocassia
cd /var/www/ocassia

# Upload your files (use SCP, SFTP, or Git)
# Then install dependencies
npm install

# Build production version
npm run build
```

### 4. Configure Nginx
Create `/etc/nginx/sites-available/ocassia`:
```nginx
server {
    listen 80;
    server_name ocassia.com www.ocassia.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ocassia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ocassia.com -d www.ocassia.com
```

### 6. Process Management (PM2)
```bash
npm install -g pm2
pm2 start npm --name "ocassia" -- start
pm2 startup
pm2 save
```

## Database Options

### Option A: Continue with Neon (Recommended)
- Keep your existing Neon database setup
- Just update environment variables on VPS
- No migration needed

### Option B: VPS PostgreSQL
- Install PostgreSQL on VPS
- Migrate data if you have existing data
- More control but requires management

## Testing Checklist

Before switching domain:
- [ ] VPS responds on IP address
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Database connections successful
- [ ] SSL certificate installed
- [ ] Environment variables configured

After DNS change:
- [ ] www.ocassia.com loads correctly
- [ ] ocassia.com redirects to www
- [ ] Login flow works end-to-end
- [ ] All features functional

## Rollback Plan

If issues occur:
1. **Immediate**: Change DNS back to WordPress hosting IP
2. **Troubleshoot**: Fix VPS issues while domain points to old hosting
3. **Retry**: Switch DNS back when VPS is fixed

## Timeline

- **VPS Setup**: 2-4 hours
- **Application Deployment**: 1-2 hours  
- **DNS Propagation**: 1-24 hours
- **Total**: Same day to complete

Your Ocassia application will have full Node.js hosting capabilities with complete control over the server environment!