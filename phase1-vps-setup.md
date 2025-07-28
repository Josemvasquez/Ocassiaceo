# Phase 1: VPS Setup Guide for Ocassia

## Before Starting
- **Keep WordPress hosting active** - don't change anything with your domain yet
- Have your VPS IP address ready from GoDaddy
- Have SSH access credentials for your VPS

## Step 1: Connect to Your VPS

### Access VPS via SSH
```bash
# From your computer's terminal
ssh root@216.70.75.204
# Enter password when prompted
```

### Update System (AlmaLinux uses dnf, not apt)
```bash
dnf update -y
dnf install -y curl wget git nano htop firewalld
```

## Step 2: Install Node.js 18+

```bash
# Install Node.js 18 on AlmaLinux
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
dnf install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show npm version
```

## Step 3: Install Nginx Web Server

```bash
# Install Nginx on AlmaLinux
dnf install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Configure firewall
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload

# Check status
systemctl status nginx

# Test: Visit http://216.70.75.204 in browser
# Should show "Welcome to nginx" page
```

## Step 4: Install PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

## Step 5: Create Application Directory

```bash
# Create directory for Ocassia
mkdir -p /var/www/ocassia
chown -R root:root /var/www/ocassia
cd /var/www/ocassia
```

## Step 6: Upload Your Ocassia Code

### Option A: Using Git (Recommended)
```bash
# If you have your code in GitHub
git clone https://github.com/YOUR-USERNAME/ocassia.git .

# Or if code is in a different location, upload files using:
# - SCP from your computer
# - FTP/SFTP client
# - Direct file upload through GoDaddy control panel
```

### Option B: Manual Upload
1. Compress your entire project folder on your computer
2. Upload via GoDaddy file manager or SCP
3. Extract in `/var/www/ocassia`

## Step 7: Install Dependencies and Build

```bash
cd /var/www/ocassia

# Install all dependencies
npm install

# Build production version
npm run build

# Test application locally
npm start
```

**Test**: Open another terminal and run:
```bash
curl http://localhost:3000
# Should return HTML of your landing page
```

## Step 8: Configure Nginx Reverse Proxy

### Create Nginx Configuration
```bash
nano /etc/nginx/conf.d/ocassia.conf
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name ocassia.com www.ocassia.com 216.70.75.204;
    
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

### Enable the Site
```bash
# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

## Step 9: Set Up Environment Variables

```bash
# Create environment file
nano /var/www/ocassia/.env.production
```

**Add these variables:**
```env
NODE_ENV=production
PORT=3000
DOMAIN_NAME=www.ocassia.com
REPLIT_DOMAINS=www.ocassia.com,ocassia.com
SESSION_SECRET=your-very-secure-random-string-here
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://username:password@hostname.neon.tech/database?sslmode=require
ISSUER_URL=https://replit.com/oidc
```

**Important**: Replace the placeholder values with your actual:
- SESSION_SECRET: Generate a secure random string
- OPENAI_API_KEY: Your OpenAI API key
- DATABASE_URL: Your Neon PostgreSQL connection string

## Step 10: Start Application with PM2

```bash
cd /var/www/ocassia

# Start application with PM2
pm2 start npm --name "ocassia" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the command it gives you (usually starts with sudo env PATH=...)

# Check application status
pm2 status
pm2 logs ocassia
```

## Step 11: Test Everything

### Test on VPS IP Address
1. **Visit**: `http://216.70.75.204`
2. **Should show**: Ocassia landing page
3. **Test pages**: 
   - `http://216.70.75.204/ai-gift-ideas`
   - `http://216.70.75.204/popular-gifts`
   - `http://216.70.75.204/gift-guides`

### Test Authentication (Will fail without database)
1. **Visit**: `http://216.70.75.204/api/login`
2. **Expected**: Error about database (this is normal for now)

## Step 12: Set Up Database Connection

### Option A: Use Neon PostgreSQL (Recommended)
1. Go to [neon.tech](https://neon.tech) and create account
2. Create new project: "ocassia-production"
3. Copy connection string
4. Update `.env.production` file with the DATABASE_URL

### Option B: Install PostgreSQL on VPS
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE ocassia_db;
CREATE USER ocassia_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ocassia_db TO ocassia_user;
\q

# Update .env.production with local database URL
# DATABASE_URL=postgresql://ocassia_user:secure_password@localhost:5432/ocassia_db
```

## Step 13: Restart with Database

```bash
# Restart application to pick up environment changes
pm2 restart ocassia

# Check logs
pm2 logs ocassia
```

## Step 14: Final Testing

### Test All Functionality
- **Landing page**: `http://YOUR-VPS-IP`
- **Authentication**: `http://YOUR-VPS-IP/api/login` (should redirect to Replit)
- **All pages load correctly**
- **No errors in PM2 logs**

## Phase 1 Complete Checklist

- [ ] VPS accessible via SSH
- [ ] Node.js 18+ installed
- [ ] Nginx installed and running
- [ ] Ocassia code uploaded and built
- [ ] PM2 process manager configured
- [ ] Nginx reverse proxy configured
- [ ] Environment variables set
- [ ] Database connected (Neon or local)
- [ ] Application starts without errors
- [ ] All pages accessible on VPS IP
- [ ] PM2 logs show no critical errors

**Once Phase 1 is complete and everything works on your VPS IP address, you're ready for Phase 2 (SSL certificates) and Phase 3 (domain migration).**

**Do not proceed to domain changes until everything works perfectly on the VPS IP address!**