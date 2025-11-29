# Overview

This is a social media feed application built as a full-stack web application. Users can view posts, like them, and add comments. The application displays a Twitter/X-style feed with social interactions including like counts, comment counts, and real-time updates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing with a simple home page and 404 fallback.

**State Management**: TanStack Query (React Query) for server state management, data fetching, and caching. No global client state management library is used.

**UI Library**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling. Uses the "new-york" style variant with a neutral base color scheme.

**Design Rationale**: This combination provides a modern, type-safe development experience with excellent developer ergonomics. TanStack Query handles complex async state management automatically, while shadcn/ui provides accessible, customizable components without the overhead of a full component library.

## Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API endpoints for CRUD operations on posts, likes, and comments.

**Build Strategy**: The production build uses esbuild to bundle the server code with allowlisted dependencies to reduce cold start times by minimizing file system operations. The client is built separately using Vite.

**Development Mode**: Uses Vite's middleware mode for hot module replacement and includes Replit-specific development plugins (cartographer, dev-banner, runtime error modal).

**Rationale**: Express provides a lightweight, flexible foundation. The bundling strategy optimizes for serverless/container deployment scenarios where cold start time matters.

## Data Storage

**Database**: PostgreSQL (via Neon serverless driver).

**ORM**: Drizzle ORM with Zod schema validation for type-safe database operations and runtime validation.

**Schema Design**:
- **users**: Basic user authentication with username/password
- **posts**: Social media posts with author information (name, handle, avatar), content, optional images, and timestamps
- **likes**: Many-to-many relationship between users and posts with cascade deletion
- **comments**: Nested comments on posts with author metadata and cascade deletion

**Rationale**: Drizzle provides excellent TypeScript integration with minimal overhead. The Neon serverless driver enables connection pooling and works well in serverless environments. Schema validation with Zod ensures data integrity at the API boundary.

## Authentication and Authorization

**Current Implementation**: No authentication system is currently implemented. The application uses a hardcoded "anonymous-user" identifier for like tracking.

**User Schema**: A users table exists with username/password fields, suggesting planned authentication but not yet implemented.

**Rationale**: The application appears to be in development with authentication infrastructure prepared but not activated.

## External Dependencies

**Neon Database**: Serverless PostgreSQL database hosting via `@neondatabase/serverless` driver.

**Radix UI**: Headless UI component primitives for accessible React components (@radix-ui/* packages).

**Lucide Icons**: Icon library for UI elements.

**date-fns**: Date formatting and manipulation library.

**TanStack Query**: Async state management for React.

**Tailwind CSS**: Utility-first CSS framework with custom design tokens defined in the theme.

**Replit Plugins**: Development tools including vite-plugin-cartographer, vite-plugin-dev-banner, and vite-plugin-runtime-error-modal for enhanced Replit development experience.

**CORS**: Configured to allow all origins in development/production for API access.

**Session Management**: Dependencies for `express-session` and `connect-pg-simple` are present but not actively used in the current implementation.