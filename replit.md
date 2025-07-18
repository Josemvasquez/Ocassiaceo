# Ocassia - Personal Relationship Manager

## Overview

Ocassia is a full-stack web application designed to help users remember important dates and manage relationships with their loved ones. The application focuses on "Never forget a special occasion and gift effortlessly" with smart reminders for birthdays, anniversaries, and special occasions, along with AI-curated gift recommendations and wishlist management.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

- **Frontend**: React + TypeScript with Vite as the build tool
- **Backend**: Express.js with TypeScript for API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit's OpenID Connect (OIDC) authentication system
- **UI Framework**: shadcn/ui components with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **React Router**: Using Wouter for lightweight client-side routing
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom color scheme (coral, teal, warm-yellow theme)
- **Form Management**: React Hook Form with Zod validation
- **State Management**: TanStack Query for API state with optimistic updates

### Backend Architecture
- **API Structure**: RESTful endpoints organized by feature (contacts, dates, wishlist)
- **Authentication Middleware**: Replit Auth integration with session management
- **Database Layer**: Drizzle ORM with connection pooling via Neon serverless
- **Error Handling**: Centralized error middleware with structured responses

### Database Schema
The application uses six main entities:
- **Users**: Stores user profile information from Replit Auth
- **Contacts**: Personal contacts with relationship details and preferences
- **Special Dates**: Important dates linked to contacts with reminder settings
- **Wishlist Items**: Personal wishlist with categorization and priority levels
- **Friend Requests**: Manages friend requests between users with status tracking
- **Friendships**: Stores accepted friend relationships between users
- **Sessions**: Session storage for authentication (PostgreSQL-based sessions)

## Data Flow

1. **User Authentication**: Users authenticate via Replit's OIDC system
2. **Session Management**: Sessions stored in PostgreSQL with automatic cleanup
3. **API Requests**: Frontend makes authenticated requests to Express backend
4. **Database Operations**: Drizzle ORM handles type-safe database interactions
5. **Real-time Updates**: TanStack Query manages cache invalidation and updates

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **express**: Web application framework
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect client for Replit Auth

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **wouter**: Lightweight routing
- **date-fns**: Date manipulation utilities

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for managing component variants
- **lucide-react**: Icon library

## Deployment Strategy

### Production Website Deployment (GoDaddy)

**Current Status**: Ready for production deployment to existing GoDaddy domain

**Deployment Steps**:
1. **Domain Configuration**: Point existing GoDaddy domain to production server
2. **Production Build**: 
   - Frontend built with Vite to `dist/public`
   - Backend compiled with esbuild to `dist/index.js`
   - Single Node.js process serving both API and static files
3. **Database**: Neon PostgreSQL production instance with SSL
4. **SSL/HTTPS**: Configure SSL certificate for secure connections
5. **Environment Variables**: 
   - `DATABASE_URL`: Production PostgreSQL connection string
   - `SESSION_SECRET`: Production session encryption key
   - `OPENAI_API_KEY`: AI gift recommendations
   - `DOMAIN_NAME`: GoDaddy domain for OIDC callbacks

**Production Requirements**:
- Node.js 18+ hosting environment
- PostgreSQL database (Neon recommended)
- SSL certificate for HTTPS
- Environment variable configuration

### Mobile App Development Roadmap

**iOS App (React Native/Expo)**:
1. **Framework**: React Native with Expo for rapid development
2. **Code Sharing**: Reuse existing React components and business logic
3. **Authentication**: Native OAuth integration with existing backend
4. **Push Notifications**: For special date reminders and gift suggestions
5. **App Store Requirements**: Apple Developer Account ($99/year)

**Android App (React Native/Expo)**:
1. **Framework**: Same React Native codebase for cross-platform efficiency
2. **Google Play**: Google Play Developer Account ($25 one-time)
3. **Native Features**: Camera integration for wishlist photos, GPS for location-based recommendations

**Mobile-Specific Features**:
- Push notifications for upcoming special dates
- Native camera integration for wishlist items
- GPS location for restaurant recommendations
- Offline wishlist viewing
- Native sharing capabilities

**Development Timeline**:
- Week 1-2: Mobile app setup and authentication integration
- Week 3-4: Core features adaptation (contacts, dates, wishlist)
- Week 5-6: Mobile-specific features and testing
- Week 7-8: App store submission and approval process

The application supports both development and production modes with appropriate middleware and error handling for each environment.

## Recent Changes
- **GoDaddy Deployment Ready** (July 18, 2025): Created complete production deployment system for GoDaddy hosting
  - Production build script that creates optimized frontend and backend bundles
  - Comprehensive deployment guide with step-by-step GoDaddy instructions
  - Environment variable templates and security configurations
  - .htaccess file for React Router support and security headers
  - Alternative Docker deployment option for VPS hosting
  - Database setup instructions for both Neon PostgreSQL and GoDaddy databases
  - Troubleshooting guide and performance optimization tips
  - Ready for immediate deployment to existing GoDaddy domain
- **Real Product Images from Affiliate Partners** (July 08, 2025): Replaced static Unsplash images with actual product photos from Amazon
  - Integrated affiliate search API to fetch real product data including images, prices, and descriptions
  - Enhanced AI gift recommendations with authentic Amazon product information
  - Clean white background product display for professional catalog appearance
  - Direct purchase links to specific products shown in recommendations
  - Authentic shopping experience with real product data instead of generic stock photos
- **Dashboard Cleanup for Better Focus** (July 08, 2025): Removed gift recommendations section from dashboard for cleaner, more efficient experience
  - Eliminated redundant recommendation cards that were duplicating functionality from dedicated recommendations page
  - Streamlined dashboard to focus on core features: upcoming dates, contacts, and personal wishlist
  - Kept "Get AI Suggestions" quick action button in dashboard for easy access to full recommendations page
  - Improved loading performance by removing unnecessary API calls for affiliate partner data on dashboard
  - Enhanced user experience with cleaner, more focused interface emphasizing personal relationship management
- **AI Gift Finder Integration** (July 08, 2025): Replaced generic product search with intelligent gift recommendation system
  - Created AI-powered gift finder that asks contextual questions about recipients (relationship, age, interests, occasion)
  - Integrated into wishlist dialog with tabs for AI recommendations vs manual entry
  - Generates personalized search queries based on recipient profile for much more relevant results
  - Simplified interface focusing on key factors: relationship, age, interests, and occasion
  - Direct "Add to Wishlist" functionality from AI recommendations with proper affiliate URL capture
- **Fixed AI Search Affiliate URLs in Wishlist** (July 08, 2025): Corrected URL mapping in Add to Wishlist dialog
  - Fixed addItemFromSearchResult function to properly capture affiliateUrl from search results
  - Updated both wishlist.tsx and wishlist-enhanced.tsx for consistent URL handling
  - AI search suggestions now correctly populate affiliate links when added to wishlist
  - Resolved issue where search results would show empty URLs in wishlist items
- **Dashboard AI Recommendations Preview** (July 03, 2025): Added curated recommendations section to dashboard for immediate value
  - Displays one featured recommendation from each of the 6 affiliate partners (Amazon, OpenTable, Expedia, Flowers.com, Best Buy, Target)
  - Grid layout with partner badges and themed icons for easy identification
  - Direct "View All Recommendations" button linking to full recommendations page
  - Positioned prominently between user data sections and quick actions for optimal engagement
- **Perfect 5-Product Consistency with Reliable Images** (July 03, 2025): All affiliate partners now display exactly 5 products with dependable Unsplash images
  - Applied same reliable Unsplash image system to flowers.com section for visual consistency
  - Updated all 6 affiliate partners (Amazon, Flowers.com, Best Buy, Target, OpenTable, Expedia) to show exactly 5 products each
  - Enhanced OpenTable with dedicated restaurant images for all 5 positions to prevent missing images
  - Added new products: Amazon (Kindle, Coffee Set), OpenTable (2 more restaurants), Expedia (2 more hotels)
  - Removed extra products from Best Buy and Target to maintain strict 5-product consistency
  - All recommendation sections now have identical horizontal scrolling experience with reliable image loading
- **Horizontal Scrolling Recommendations with Expanded Affiliate Network** (July 03, 2025): Complete redesign of recommendations page with new affiliate partners
  - Transformed recommendations from tab-based grid layout to horizontal scrolling sections for better mobile experience
  - Added Flowers.com affiliate integration for AI-curated flower recommendations with occasion-based filtering
  - Integrated Best Buy affiliate system for electronics and tech gift recommendations with category and price filtering
  - Added Target affiliate partnership for home goods and lifestyle products with department-based organization
  - Enhanced recommendation cards with partner-specific branding and color-coded action buttons
  - Implemented seamless horizontal scrolling with hidden scrollbars for smooth user experience
  - Each affiliate section displays partner badges and themed call-to-action buttons for brand recognition
- **Complete Bright Blue Theme Implementation** (July 03, 2025): Applied comprehensive blue gradient design across entire application
  - Implemented consistent bright blue/cyan gradient backgrounds on all authenticated pages (Dashboard, Contacts, Friends, Wishlist, Collaborative, Recommendations)
  - Updated all loading states with blue gradient backgrounds and white spinner borders for visual consistency
  - Maintained glass effect styling with backdrop blur and white transparency on all cards and sections
  - Enhanced all interactive elements with blue-themed gradients while preserving existing functionality
  - Achieved complete visual cohesion across the application matching the bright blue landing page aesthetic
- **Brand Refresh to Ocassia with Bright Blue Landing Page** (July 03, 2025): Complete app rebranding from RemindMe to Ocassia
  - Redesigned landing page with bright/neon blue color scheme focusing on "Never forget a special occasion and gift effortlessly"
  - Modern gradient backgrounds with floating animations and backdrop blur effects
  - Updated messaging to emphasize AI-curated recommendations and location-based services
  - Enhanced hero section with bold typography and clear value propositions
  - Added user dropdown menu to header with logout functionality for better UX
- **Social Sharing and Collaborative Features Complete** (July 02, 2025): Implemented comprehensive sharing system and collaborative wishlists
  - ShareDialog component for sharing wishlist items with friends with edit/view permissions
  - CreateCollaborativeWishlistDialog for group wishlist creation with member invitations
  - Enhanced collaborative wishlist page with blue theme and improved functionality
  - All sharing API endpoints integrated for wishlist items and special dates
  - Updated header logo to be clickable and navigate to home page
- **Complete Affiliate Marketing System** (July 02, 2025): Enhanced affiliate integrations with real API connections and dedicated recommendations page
  - Updated all affiliate API endpoints to use real Amazon, OpenTable, and Expedia data sources
  - Created comprehensive recommendations page with search functionality for gifts, restaurants, and travel
  - Enhanced recommendation cards with affiliate partner badges, tracking, and optimized CTAs
  - Added affiliate link tracking with analytics integration for monetization insights
  - Updated navigation to include dedicated recommendations/shopping section
  - Added proper affiliate disclosure and transparent partner identification
  - Real-time product search with customizable parameters for each affiliate partner
  - **Fixed OpenTable Location Targeting** (July 03, 2025): Improved geographic restaurant recommendations
    - Enhanced coordinate-based location detection for major US cities
    - Added location-specific restaurant data for Florida, New York, California, Chicago, and other regions
    - Default Florida coordinates for better demo experience with coastal restaurant themes
    - Proper GPS coordinate parsing and city/region mapping functionality
  - **Enhanced Smart Recommendations with Auto-Location** (July 03, 2025): Automatic location detection for restaurants
    - Restaurant tab now automatically detects user's GPS location for nearby restaurant suggestions
    - Added location status indicators showing current detected location (e.g., "Saint Cloud, Florida")
    - Fixed query parameter handling in TanStack Query for restaurant and travel search requests
    - Automatic refetching of restaurant recommendations when location is detected
    - Pre-populated location fields in restaurant search with detected coordinates
  - **Improved Location Accuracy for Restaurant Recommendations** (July 03, 2025): Enhanced 10-mile radius precision
    - Implemented precise city mapping system with major US cities database including coordinates
    - Added accurate distance calculations between user location and restaurants within 10-mile radius
    - Enhanced restaurant database with specific coordinates for Orlando, Miami, Saint Cloud, NYC, LA, Chicago areas
    - Real distance measurements displayed for each restaurant recommendation
    - Location-specific restaurant suggestions based on precise geographic coordinates
  - **Fixed OpenTable Reservation Location Accuracy** (July 03, 2025): Accurate reservation links
    - Updated OpenTable affiliate link generation to pass precise location coordinates
    - Fixed "Find & Reserve" button to direct to correct geographic area on OpenTable
    - Enhanced URL parameters to include latitude/longitude for location-specific search results
    - Restaurant reservations now open to the exact user location instead of default areas
  - **Global Header Navigation** (July 03, 2025): Universal header component for seamless navigation
    - Added persistent header component to all authenticated pages for consistent navigation
    - Clickable RemindMe logo for easy return to home page from any location
    - Unified navigation menu accessible from every page in the application
    - Removed duplicate header components from individual pages to avoid conflicts

- **Phone Contacts Integration** (July 02, 2025): Added native phone contacts access for easy contact management
  - New ContactsImport component with browser Contacts API integration
  - One-click import from phone contacts with permission handling
  - Contact selection interface with bulk import functionality
  - Import buttons added to both dashboard and contacts page
  - Seamless integration with existing contact management system
- **Napper-Inspired Design** (July 02, 2025): Complete redesign to match Napper app's clean, soft aesthetic
  - Soft color palette with blue primary color and minimal pastels for a calming feel
  - Clean, minimalist header with simple rounded icons and subtle spacing
  - Removed gradients and flashy animations for a more professional, clean look
  - Simple typography with medium font weights and generous white space
  - Soft rounded corners and subtle backgrounds instead of bold shadows
  - Clean mobile navigation with simple state changes and soft colors
  - Landing page redesigned with centered content and clean messaging
  - Overall aesthetic focuses on usability and gentle visual hierarchy

- **Sharing and Collaborative Features** (July 02, 2025): Added comprehensive sharing system and collaborative wishlists
  - New database tables: shared_special_dates, shared_wishlist_items, collaborative_wishlists, collaborative_wishlist_members, collaborative_wishlist_items
  - API endpoints for sharing special dates and wishlist items with friends
  - Collaborative wishlist creation and management with role-based permissions
  - New collaborative wishlist page with tabs for group wishlists and shared items
  - Item claiming system for collaborative wishlists
  - Integration with friend system for seamless sharing

- **Friend System Implementation** (July 02, 2025): Added comprehensive friend request and friendship management system
  - New database tables: friend_requests and friendships
  - API endpoints for sending, accepting, declining friend requests
  - Friends page with tabbed interface for managing connections
  - Email-based friend discovery system
  - Integration with existing navigation and mobile menu

## Changelog
- July 02, 2025. Initial setup
- July 02, 2025. Added friend request system with email-based discovery
- July 02, 2025. Added sharing features and collaborative wishlists with role-based permissions
- July 02, 2025. Complete UI redesign inspired by Napper app's clean, soft aesthetic
- July 02, 2025. Added phone contacts integration with browser Contacts API

## Development & Maintenance Strategy

### Future Updates Workflow
- **Development Environment**: Continue using Replit for quick changes and prototyping
- **Version Control**: GitHub repository for production code management
- **Deployment Pipeline**: Automated deployment from GitHub to production server
- **Mobile Updates**: Over-the-air updates for React Native app features
- **Database Changes**: Schema migrations through Drizzle ORM
- **Monitoring**: Production monitoring with uptime tracking and error reporting

### Long-term Development Plan
- **Phase 1**: Website deployment and initial mobile app launch
- **Phase 2**: User feedback integration and performance optimization
- **Phase 3**: Advanced AI features and premium subscription model
- **Phase 4**: API development for third-party integrations

### Affiliate API Integration Roadmap
- **Current Status**: Mock affiliate data implemented, ready for real API integration
- **Priority Partners**: Amazon Associates, Commission Junction (Best Buy/Target), ShareASale (Flowers.com)
- **Integration Framework**: Complete API integration templates prepared for immediate deployment
- **Revenue Optimization**: Conversion tracking and performance monitoring ready
- **Compliance**: FTC disclosure and GDPR compliance implemented

### Premium Tier Features (Future Enhancement)
- **Luxury Affiliate Network**: High-end brands with premium commission rates (Tiffany & Co, Louis Vuitton, Nordstrom, Saks Fifth Avenue)
- **Digital Event Coordination**: Create group events (dinner at Eddie V's, birthday parties, etc.) with custom digital invitations
- **Smart RSVP Management**: Easy response tracking with dietary preferences and guest count management
- **Shared Event Wishlists**: Group gift coordination where attendees can contribute to shared wishlists for the guest of honor
- **Custom Digital Invitations**: Beautiful, personalized invitation designs with brand integration and event theming
- **Group Communication**: Event-specific chat and updates for seamless coordination
- **Revenue Model**: $19.99/month premium subscription targeting 10-15% conversion from free users

## User Preferences

Preferred communication style: Simple, everyday language.