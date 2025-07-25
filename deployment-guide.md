# Ocassia Deployment Guide

## 🌐 Website Deployment to GoDaddy Domain

### Prerequisites
- Existing GoDaddy domain
- Node.js hosting environment (VPS or cloud hosting)
- SSL certificate for HTTPS

### Step 1: Prepare Production Build
```bash
# Build the application for production
npm run build

# This creates:
# - dist/public/ (frontend assets)
# - dist/index.js (backend server)
```

### Step 2: Environment Configuration
Create production `.env` file with:
```env
NODE_ENV=production
DATABASE_URL=your_production_postgresql_url
SESSION_SECRET=your_secure_session_secret
OPENAI_API_KEY=your_openai_api_key
DOMAIN_NAME=www.ocassia.com
REPLIT_DOMAINS=www.ocassia.com,ocassia.com
ISSUER_URL=https://replit.com/oidc
```

### Step 3: Database Setup
1. Create production PostgreSQL database (recommend Neon)
2. Run migrations: `npm run db:push`
3. Update DATABASE_URL in environment

### Step 4: Domain Configuration
1. Point your GoDaddy domain to hosting server IP
2. Configure DNS A records in GoDaddy:
   - `ocassia.com -> server_ip` 
   - `www.ocassia.com -> server_ip`
3. Setup SSL certificate (Let's Encrypt recommended)

### Step 5: Server Deployment
```bash
# Upload built files to server
# Install dependencies: npm install --production
# Start application: npm start
```

### Step 6: HTTPS & Security
- Configure SSL certificate
- Update OIDC callback URLs to use your domain
- Enable security headers and CORS for your domain

---

## 📱 Mobile App Development

### iOS App Development

#### Setup Requirements
- Apple Developer Account ($99/year)
- Xcode and macOS development environment
- React Native/Expo CLI

#### Development Steps
1. **Initialize React Native Project**
```bash
npx create-expo-app ocassia-mobile
cd ocassia-mobile
```

2. **Install Dependencies**
```bash
expo install @react-native-async-storage/async-storage
expo install expo-auth-session
expo install expo-camera
expo install expo-location
```

3. **Component Migration**
- Adapt existing React components for React Native
- Implement native navigation with React Navigation
- Integrate with existing API endpoints

4. **Authentication Integration**
```javascript
// Use existing /api/auth endpoints
// Implement OAuth flow with expo-auth-session
```

5. **App Store Submission**
- Build production app with Expo
- Submit to Apple App Store for review

### Android App Development

#### Setup Requirements
- Google Play Developer Account ($25 one-time)
- Android Studio for testing
- Same React Native codebase as iOS

#### Development Steps
1. **Use Same Codebase**
   - React Native allows code sharing between iOS and Android
   - Platform-specific adjustments as needed

2. **Android-Specific Features**
```javascript
// Push notifications
// Camera integration
// Location services
```

3. **Google Play Submission**
- Build Android APK/AAB
- Submit to Google Play Store

---

## 🔧 Technical Architecture for Mobile

### API Integration
- Mobile apps will use existing REST API endpoints
- Authentication via OAuth with session management
- Real-time updates for shared wishlists and dates

### Cross-Platform Features
- **Push Notifications**: Upcoming date reminders
- **Camera Integration**: Add photos to wishlist items
- **GPS Location**: Restaurant recommendations
- **Offline Support**: Cache recent data
- **Native Sharing**: Share wishlists and dates

### Data Synchronization
- Real-time sync with PostgreSQL database
- Conflict resolution for collaborative features
- Offline-first architecture for core features

---

## 🚀 Deployment Timeline

### Phase 1: Website Deployment (1-2 weeks)
- [ ] Production server setup
- [ ] Domain configuration
- [ ] SSL certificate installation
- [ ] Environment configuration
- [ ] Database migration
- [ ] Testing and launch

### Phase 2: Mobile App Development (6-8 weeks)
- [ ] React Native setup
- [ ] Component migration
- [ ] Native feature integration
- [ ] Testing on devices
- [ ] App store submission
- [ ] Approval and launch

### Phase 3: Post-Launch (Ongoing)
- [ ] User feedback integration
- [ ] Performance optimization
- [ ] Feature enhancements
- [ ] Marketing and user acquisition

---

## 💡 Recommended Hosting Solutions

### Website Hosting
1. **DigitalOcean Droplet** ($5-20/month)
2. **AWS EC2** (Pay as you use)
3. **Vercel** (Optimized for Node.js apps)
4. **Railway** (Simple deployment)

### Database
1. **Neon** (PostgreSQL, generous free tier)
2. **Supabase** (PostgreSQL with real-time features)
3. **AWS RDS** (Enterprise-grade)

### SSL Certificate
1. **Let's Encrypt** (Free, auto-renewal)
2. **Cloudflare** (Free tier includes SSL)
3. **GoDaddy SSL** (Paid option)