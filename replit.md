# RemindMe - Personal Relationship Manager

## Overview

RemindMe is a full-stack web application designed to help users remember important dates and manage relationships with their loved ones. The application provides smart reminders for birthdays, anniversaries, and special occasions, along with AI-curated gift recommendations and wishlist management.

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

The application is configured for deployment on Replit with the following build process:

1. **Development**: Vite dev server with Express backend running concurrently
2. **Build Process**: 
   - Frontend built with Vite to `dist/public`
   - Backend compiled with esbuild to `dist/index.js`
3. **Production**: Single Node.js process serving both API and static files
4. **Database**: Uses Neon PostgreSQL with connection string from environment
5. **Environment Variables**: 
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Session encryption key
   - `REPL_ID`: Replit application identifier
   - `ISSUER_URL`: OIDC issuer URL for authentication

The application supports both development and production modes with appropriate middleware and error handling for each environment.

## Recent Changes
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

## User Preferences

Preferred communication style: Simple, everyday language.