# Circle of Fifths Music Learning Application

## Overview
This is a full-stack TypeScript application that teaches music theory through an interactive Circle of Fifths interface. Users can explore scales, intervals, chords, and geometric patterns while hearing the musical relationships through audio playback. The application combines visual learning with auditory feedback to make music theory more accessible.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks and context for local state
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for music pattern management
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL store
- **Error Handling**: Centralized middleware for consistent error responses

### Audio Engine
- **Library**: Tone.js for Web Audio API abstraction
- **Synthesis**: Polyphonic synthesizer with triangle wave oscillators
- **Features**: Volume control, tempo adjustment, note scheduling
- **Playback**: Support for scales, chords, intervals, and melodic sequences

## Key Components

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Music Patterns Table**: Stores user-created musical patterns with JSON data
- **Pattern Types**: Supports scales, intervals, chords, modes, and geometric shapes

### Audio System
- **AudioEngine Class**: Manages Tone.js initialization and synthesis
- **Music Theory Library**: Utilities for note conversion, scale generation, and interval calculation
- **Playback Controls**: Start/stop, volume, tempo, and direction controls

### Interactive Circle Interface
- **CircleOfFifths Component**: Visual representation with clickable note positions
- **GeometricShapeDrawer**: SVG-based shape rendering for musical relationships
- **Mode Switching**: Different interaction modes for various musical concepts

### Control Panel
- **Mode Selection**: Scales, intervals, chords, modes, random, cadences
- **Audio Controls**: Volume slider, tempo control, playback direction
- **Pattern Management**: Save, load, and delete musical patterns

## Data Flow

1. **User Interaction**: Click notes on the circle or use control panel
2. **State Updates**: React state manages selected notes and current mode
3. **Audio Processing**: Selected notes converted to frequencies via music theory utilities
4. **Sound Generation**: Tone.js synthesizer plays the corresponding audio
5. **Pattern Storage**: Musical patterns saved to PostgreSQL via REST API
6. **Visual Feedback**: SVG shapes and highlighted notes show relationships

## External Dependencies

### Core Libraries
- **Tone.js**: Web Audio API wrapper for sound synthesis
- **Radix UI**: Accessible component primitives
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL hosting
- **Zod**: Runtime type validation for API requests

### Development Tools
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Static type checking across full stack
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript/TypeScript bundling

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with Express API proxy
- **Hot Reload**: Both frontend and backend support live reloading
- **Database**: Neon serverless PostgreSQL with connection pooling

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets in production
- **Environment**: NODE_ENV controls development vs production behavior

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Connection**: Environment variable DATABASE_URL for database access
- **Session Store**: PostgreSQL-backed session storage for user authentication

The application uses a monorepo structure with shared TypeScript types between client and server, ensuring type safety across the full stack. The audio engine initializes on user interaction to comply with browser autoplay policies, and the interface provides both visual and auditory feedback for an engaging learning experience.