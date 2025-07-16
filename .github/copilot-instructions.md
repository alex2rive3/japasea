<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions for Japasea Full-Stack Project

This is a full-stack tourism application for Encarnación, Paraguay, with React + Vite frontend and Node.js + Express backend. The application provides interactive maps, location search, and tourism information.

## ⚠️ CRITICAL DEVELOPMENT REQUIREMENTS

### Language & Code Standards
- **ALL DEVELOPMENT MUST BE IN ENGLISH**: Variable names, function names, comments, commit messages, documentation, and any text in the codebase
- **NO COMMENTS IN CODE**: Write self-documenting code with clear variable and function names instead of comments
- **AVOID SPANISH**: Do not use Spanish in any part of the code, including strings that are not user-facing

### Architecture Requirements
- **Frontend**: Strict componentization - break down UI into small, reusable components
- **Backend**: Well-defined MVC architecture with clear separation of concerns
- **TypeScript**: Use proper interfaces and types for all data structures
- **Error Handling**: Implement proper error handling and validation at all levels

Please follow these guidelines when providing code suggestions:

## Technologies Used

### Frontend Stack
- **React 18.3+** - Modern React with hooks and functional components
- **TypeScript** - Static typing for better code quality and IDE support
- **Vite** - Fast build tool and development server
- **Material-UI v7** - Component library for consistent UI/UX
  - `@mui/material` - Core components
  - `@mui/icons-material` - Material Design icons
  - `@emotion/react` & `@emotion/styled` - CSS-in-JS styling
- **React Leaflet 5.0** - Interactive maps integration
- **Leaflet 1.9** - Open-source mapping library

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express.js 4.18** - Web framework
- **MVC Architecture** - Model-View-Controller pattern
- **Security & Middleware**:
  - `helmet` - Security headers
  - `cors` - Cross-origin resource sharing
  - `morgan` - HTTP request logging
  - `dotenv` - Environment variable management
- **Google Generative AI** - AI integration for chat features
- **Development Tools**:
  - `nodemon` - Auto-restart development server
  - `jest` - Testing framework

### Data Management
- **JSON Files** - Local data storage for places/locations
- **TypeScript Interfaces** - Type-safe data structures
- **Service Layer** - API communication abstraction

## Code Style Guidelines

### General Standards
- **English Only**: All code must be written in English (variables, functions, types, etc.)
- **No Comments**: Write self-documenting code with descriptive names
- **TypeScript First**: Use TypeScript for all components and utilities
- **Consistent Naming**: Use camelCase for variables/functions, PascalCase for components/types
- **Modern Syntax**: Follow ES6+ patterns and modern JavaScript/TypeScript features

### Frontend Guidelines
- **Functional Components**: Use React functional components with hooks
- **Component Composition**: Break UI into small, reusable components
- **Named Exports**: Prefer named exports over default exports
- **Material-UI Integration**: Use MUI components with `sx` prop for styling
- **Type Safety**: Define proper TypeScript interfaces for all props and data
- **Hook Patterns**: Use custom hooks for complex state logic

### Backend Guidelines
- **MVC Architecture**: Strict separation of Models, Views (JSON responses), and Controllers
- **RESTful APIs**: Follow REST conventions for endpoint design
- **Error Handling**: Implement comprehensive error handling and validation
- **Middleware Pattern**: Use middleware for cross-cutting concerns
- **Security First**: Always implement security headers and input validation

## Project Structure

### Frontend (Client)
```
client/
├── src/
│   ├── components/           # React components (strict componentization)
│   │   ├── ChatComponent.tsx      # Chat interface with AI bot integration
│   │   ├── LugaresCards.tsx       # Tourism places card display
│   │   ├── MapComponent.tsx       # Interactive Leaflet map
│   │   └── Sidebar.tsx           # Collapsible navigation sidebar
│   ├── services/            # API communication layer
│   │   └── lugaresService.ts     # Places/locations service
│   ├── types/               # TypeScript type definitions
│   │   └── lugares.ts           # Places data interfaces
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── theme.ts             # Material-UI theme configuration
│   └── index.css            # Global styles
├── public/                  # Static public assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

### Backend (Server)
```
server/
├── src/
│   ├── controllers/         # MVC Controllers
│   │   └── apiController.js     # API endpoints controller
│   ├── models/              # Data models
│   │   └── serverModel.js       # Server data model
│   ├── routes/              # API routes
│   │   └── apiRoutes.js         # API endpoint routes
│   ├── middleware/          # Custom middleware
│   │   └── middleware.js        # Request logging and validation
│   ├── config/              # Configuration files
│   │   └── config.js            # Server configuration
│   └── app.js               # Main application file
├── lugares.json             # Tourism places data
├── package.json            # Server dependencies
└── .env                    # Environment variables
```

### Key Components Overview
- **MapComponent**: Interactive map using React Leaflet with place markers
- **ChatComponent**: AI-powered chat interface with Google Generative AI
- **LugaresCards**: Tourism places display with filtering and search
- **Sidebar**: Responsive navigation with collapsible design
- **lugaresService**: API service layer for places data management

## Development Commands

### Frontend
```bash
cd client
npm run dev          # Start development server (Vite)
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
cd server
npm run dev          # Start server with nodemon (development)
npm start            # Start server in production mode
npm test             # Run Jest tests
```

### Full-Stack Development
```bash
# Terminal 1: Start backend server
cd server && npm run dev

# Terminal 2: Start frontend development server
cd client && npm run dev
```

## Data Structure & Types

### Places (Lugares) Interface
```typescript
interface Lugar {
  key: string           // Unique identifier/name
  description: string   // Detailed description
  location: {
    lat: number         // Latitude coordinate
    lng: number         // Longitude coordinate
  }
  type: string         // Category (Alojamiento, Gastronomía, etc.)
  address: string      // Physical address
}
```

### API Response Structure
```typescript
interface LugaresResponse {
  lugares: Lugar[]
  message: string
}
```

### Place Categories
- **Alojamiento** - Accommodation (hotels, hostels)
- **Gastronomía** - Food & dining (restaurants, cafes)
- **Desayunos y meriendas** - Breakfast & snacks
- **Entretenimiento** - Entertainment venues
- **Comercios** - Shopping & retail
- **Servicios** - Services & utilities

## API Service Layer

### lugaresService Methods
```typescript
export const lugaresService = {
  // Get places by category
  getLugaresPorTipo(tipo?: string): Promise<Lugar[]>
  
  // Search places by query
  buscarLugares(query: string): Promise<Lugar[]>
  
  // Get all places
  getAllLugares(): Promise<Lugar[]>
  
  // Get place details by key
  getLugarByKey(key: string): Promise<Lugar | null>
}
```

### API Base Configuration
- **Base URL**: `http://localhost:3001`
- **Endpoints**: `/api/lugares`, `/api/lugares/buscar`
- **Response Format**: JSON with proper error handling

## React Leaflet Guidelines
- Import Leaflet CSS in components that use maps
- Use proper TypeScript interfaces for map props
- Handle Leaflet icon issues with proper icon configuration
- Use Material-UI components for map styling
- Follow React Leaflet best practices for performance

## Component Architecture

### MapComponent Features
- Interactive map with zoom controls
- Place markers with custom icons
- Popup windows with place information
- Responsive design for mobile and desktop
- Integration with LugaresCards for location selection

### LugaresCards Features
- Grid layout with Material-UI cards
- Category-based filtering and color coding
- Search functionality with real-time results
- Phone number extraction from descriptions
- Click handlers for map integration
- Responsive card design

### ChatComponent Features
- Real-time message display with user and bot avatars
- Google Generative AI integration
- Material-UI styling with consistent theme
- Responsive layout that works on desktop and mobile
- Keyboard support (Enter to send messages)
- Message history and scrolling

### Sidebar Features
- Collapsible navigation with Material-UI drawer
- Responsive design for mobile and desktop
- Icon-based navigation items
- Theme-consistent styling
- Touch-friendly mobile interface

## Backend API Endpoints

### Available Endpoints
- `GET /` - Server information and welcome message
- `GET /api/` - API welcome message with available endpoints
- `GET /api/health` - Health check endpoint
- `GET /api/status` - Detailed server status and system information
- `GET /api/test` - Simple test endpoint (GET)
- `POST /api/test` - Test endpoint for POST requests

### Example API Usage
```bash
# Health check
curl http://localhost:3001/api/health

# Server status
curl http://localhost:3001/api/status

# Test POST endpoint
curl -X POST http://localhost:3001/api/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello World"}'
```

## MVC Architecture Guidelines
- **Models**: Handle data logic and business rules
- **Views**: JSON responses (REST API)
- **Controllers**: Process requests and coordinate between models and views
- Use middleware for cross-cutting concerns (logging, validation, security)
- Follow RESTful conventions for API endpoints

## Security Features
- Helmet.js for security headers
- CORS configuration
- Input validation middleware
- Error handling middleware
- Environment variable protection
