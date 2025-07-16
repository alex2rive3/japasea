<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions for Japasea Full-Stack Project

This is a full-stack application with React + Vite frontend and Node.js + Express backend. Please follow these guidelines when providing code suggestions:

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite (build tool)
- Material-UI (UI components and styling)
- React Leaflet (interactive maps)
- Leaflet (mapping library)

### Backend
- Node.js
- Express.js
- MVC Architecture
- CORS middleware
- Helmet (security)
- Morgan (logging)
- Dotenv (environment variables)

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Follow React functional component patterns with hooks
- Use proper TypeScript interfaces and types
- Prefer named exports over default exports
- Use Material-UI components and sx prop for styling
- Follow modern ES6+ syntax

## Project Structure

### Frontend (Client)
- `src/` - Source code directory
- `src/components/` - React components
  - `MapComponent.tsx` - Interactive map component using React Leaflet
  - `ChatComponent.tsx` - Chat interface component with simulated bot responses
  - `Sidebar.tsx` - Collapsible sidebar navigation with responsive design
- `src/assets/` - Static assets
- `src/theme.ts` - Material-UI theme configuration
- `src/App.tsx` - Main application component
- `src/main.tsx` - Application entry point

### Backend (Server)
- `server/src/` - Server source code directory
- `server/src/app.js` - Main application file
- `server/src/controllers/` - MVC Controllers
  - `apiController.js` - API endpoints controller
- `server/src/models/` - Data models
  - `serverModel.js` - Server data model
- `server/src/routes/` - API routes
  - `apiRoutes.js` - API endpoint routes
- `server/src/middleware/` - Custom middleware
  - `middleware.js` - Request logging and validation
- `server/src/config/` - Configuration files
  - `config.js` - Server configuration
- `server/.env` - Environment variables
- `server/package.json` - Server dependencies

## Development Commands

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `cd server && npm run dev` - Start server in development mode
- `cd server && npm start` - Start server in production mode
- `cd server && npm test` - Run server tests

## React Leaflet Guidelines
- Import Leaflet CSS in components that use maps
- Use proper TypeScript interfaces for map props
- Handle Leaflet icon issues with proper icon configuration
- Use Material-UI components for map styling
- Follow React Leaflet best practices for performance

## Chat Component Features
- Real-time message display with user and bot avatars
- Simulated bot responses with random delay
- Material-UI styling with consistent theme
- Responsive layout that works on desktop and mobile
- Keyboard support (Enter to send messages)

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
