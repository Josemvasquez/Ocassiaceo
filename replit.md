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
- **Modern UI Redesign** (July 02, 2025): Complete visual overhaul for modern, friendly user experience
  - Updated color palette with soft gradients and contemporary accent colors (coral, purple, teal)
  - Modern header with glass morphism effects, gradient logo, and pill-shaped navigation
  - Dashboard hero section with animated elements and engaging welcome message
  - Modernized mobile navigation with improved visual hierarchy and micro-interactions
  - Landing page redesign with larger typography and compelling visual elements
  - Enhanced card designs with hover effects and smooth animations
  - Consistent use of rounded corners, shadows, and modern spacing throughout

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
- July 02, 2025. Complete UI redesign with modern, friendly visual design

## User Preferences

Preferred communication style: Simple, everyday language.