# GoDaddy VHM Setup Guide for Ocassia VPS

## What is VHM?
VHM (Virtual Host Manager) is GoDaddy's web-based console for managing your VPS. It gives you browser-based access to your server without needing SSH from your computer.

## Step-by-Step VPS Setup Through VHM

### Step 1: Access Your Server Console
**You're here now - VHM is launched**

1. **In VHM interface**, look for:
   - **"Console"** tab or button
   - **"Terminal"** or **"Command Line"** option
   - **"SSH Access"** or similar

2. **Click to open terminal/console** - this gives you command line access to your AlmaLinux server

### Step 2: Initial Login
When the console opens:
```
AlmaLinux 9 login: ocassiaceo
Password: Ocassia2017!
```

### Step 3: Update System
Once logged in, run these commands one by one:

```bash
# Update the system
sudo dnf update -y

# Install essential tools
sudo dnf install -y curl wget git nano htop firewalld

# Check system info
hostnamectl
free -h
df -h
```

### Step 4: Install Node.js 18
```bash
# Download and install Node.js repository
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -

# Install Node.js
sudo dnf install -y nodejs

# Verify installation
node --version
npm --version

# Should show Node v18.x.x and npm version
```

### Step 5: Install PM2 Process Manager
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify PM2 installation
pm2 --version
```

### Step 6: Install and Configure Nginx
```bash
# Install Nginx web server
sudo dnf install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx
```

### Step 7: Configure Firewall
```bash
# Start firewall service
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Open required ports
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp

# Apply firewall changes
sudo firewall-cmd --reload

# Check firewall status
sudo firewall-cmd --list-all
```

### Step 8: Test Basic Setup
**Open a new browser tab** and visit: `http://216.70.75.204`

**Expected result**: You should see the Nginx welcome page saying "Welcome to nginx!"

### Step 9: Create Application Directory
```bash
# Create directory for Ocassia application
sudo mkdir -p /var/www/ocassia

# Change ownership to your user
sudo chown -R ocassiaceo:ocassiaceo /var/www/ocassia

# Navigate to application directory
cd /var/www/ocassia

# Verify you're in the right place
pwd
# Should show: /var/www/ocassia
```

### Step 10: Upload Ocassia Application Files

**Option A: Direct File Upload via GoDaddy**
1. In VHM, look for **"File Manager"** or **"Files"** section
2. Navigate to `/var/www/ocassia` directory
3. Upload your Ocassia project files (all files from your local project)

**Option B: Git Clone (if code is in repository)**
```bash
# If your code is on GitHub
git clone YOUR-GITHUB-REPO-URL .

# Or create files manually if needed
```

**Option C: Manual File Creation**
We can recreate the essential files directly on the server.

### Step 11: Install Dependencies and Build
```bash
# Navigate to application directory
cd /var/www/ocassia

# Install all Node.js dependencies
npm install

# Build the production application
npm run build

# Check if build was successful
ls -la
# Should see dist/ directory and other files
```

### Step 12: Configure Environment Variables
```bash
# Create production environment file
nano .env.production
```

**Add these environment variables:**
```env
NODE_ENV=production
PORT=3000
DOMAIN_NAME=www.ocassia.com
REPLIT_DOMAINS=www.ocassia.com,ocassia.com
SESSION_SECRET=your-very-secure-random-string-change-this
OPENAI_API_KEY=your-openai-api-key-if-you-have-one
DATABASE_URL=postgresql://username:password@hostname.neon.tech/database?sslmode=require
ISSUER_URL=https://replit.com/oidc
```

**Important**: 
- Replace `SESSION_SECRET` with a random 32+ character string
- Add your actual `OPENAI_API_KEY` if you have one
- We'll set up the database connection later

### Step 13: Configure Nginx Reverse Proxy
```bash
# Create Nginx configuration for Ocassia
sudo nano /etc/nginx/conf.d/ocassia.conf
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

### Step 14: Test and Start Application
```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx with new configuration
sudo systemctl reload nginx

# Start your Ocassia application with PM2
cd /var/www/ocassia
pm2 start npm --name "ocassia" -- start

# Check application status
pm2 status
pm2 logs ocassia

# Save PM2 configuration
pm2 save

# Set PM2 to start on server boot
pm2 startup
# Follow the command it provides (copy and run the sudo command it shows)
```

### Step 15: Test Your Application
**Visit**: `http://216.70.75.204`

**Expected results**:
- Should show your Ocassia landing page
- All pages should load (AI gift ideas, Popular gifts, etc.)
- Authentication may show errors (normal - needs database setup)

## Troubleshooting VHM

### If Console/Terminal Won't Open:
1. **Refresh VHM page**
2. **Look for different tabs**: "Console", "Terminal", "SSH", "Command Line"
3. **Check browser popup blockers**
4. **Try different browser** (Chrome, Firefox)

### If Commands Don't Work:
1. **Make sure you're logged in** as `ocassiaceo`
2. **Add `sudo`** before commands if permission denied
3. **Wait for each command** to complete before running next one

### If Nginx Test Fails:
```bash
# Check what's using port 80
sudo netstat -tulpn | grep :80

# Restart nginx
sudo systemctl restart nginx
```

## Next Steps After VPS Setup

1. **Set up Neon PostgreSQL database**
2. **Configure SSL certificates** 
3. **Point domain to VPS**
4. **Final testing and optimization**

## Current Status Checkpoint

After completing these steps, you should have:
- ✅ AlmaLinux 9 VPS running
- ✅ Node.js 18+ installed
- ✅ Nginx web server configured  
- ✅ Ocassia application uploaded and running
- ✅ Basic firewall security
- ✅ Application accessible at http://216.70.75.204

**Where are you currently in this process?** Let me know which step you're on and I'll provide specific guidance for that step.