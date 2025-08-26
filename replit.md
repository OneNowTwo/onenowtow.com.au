# Overview

One Now Two is a cinematic wedding videography website featuring a minimalist, monochrome design aesthetic. The application serves as a portfolio showcase for a wedding filmmaker transitioning from commercial work to wedding cinematography. Built with a modern full-stack architecture using React/TypeScript frontend and Express backend, the site emphasizes visual storytelling through carefully curated work samples and an elegant, understated design language.

# User Preferences

Preferred communication style: Simple, everyday language.

## Recent Issues Resolved
- **Video Deployment Issue**: Hero banner video worked in Replit preview but disappeared after deployment. Root cause: video files in `src/assets` get processed by bundler and paths change. **Solution**: Moved video to `client/public/media/hero/hero-1080.mp4` which gets served at site root `/media/hero/hero-1080.mp4` consistently in both development and production.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, customizable UI components
- **Design System**: Monochrome color scheme (black/white/soft grey) with custom CSS variables for One Now Two branding
- **Typography**: Cormorant Garamond serif font for headings, Inter sans-serif for body text
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and data fetching
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Pattern**: RESTful API design with `/api` prefix for all endpoints
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with tsx for TypeScript execution

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development/testing

## Authentication and Authorization
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **User Schema**: Basic user table with username/password fields and UUID primary keys
- **Validation**: Zod schema validation integrated with Drizzle for runtime type checking

## External Dependencies
- **Database Hosting**: Neon Database for serverless PostgreSQL hosting
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Video Hosting**: External platforms (Vimeo/YouTube) for portfolio video content
- **Image Hosting**: Unsplash for placeholder imagery and potentially future image assets
- **Fonts**: Google Fonts for typography (Cormorant Garamond, Inter)
- **Development Tools**: Replit integration for cloud-based development environment

## Design Patterns
- **Component Architecture**: Modular component design with shadcn/ui for consistent styling
- **Type Safety**: Full TypeScript implementation across frontend, backend, and shared schemas
- **Shared Types**: Common schema definitions in `/shared` directory for type consistency
- **Custom Hooks**: React hooks for mobile detection and toast notifications
- **CSS Architecture**: CSS custom properties for theming with Tailwind utility classes
- **Responsive Design**: Mobile-first approach with breakpoint-aware components