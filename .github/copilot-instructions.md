<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 🚀 Copilot Development Instructions – Japasea Full-Stack Project

This is a comprehensive full-stack tourism application for Encarnación, Paraguay, featuring React + Vite frontend and Node.js + Express backend with MongoDB database. The application provides interactive maps, AI-powered chat assistance, user authentication, place reviews, travel planning, and multilingual support.

## ⚠️ Critical Development Standards

### Language & Code Standards
- Write all **code, variable names, function names, commit messages, and documentation in English**
- Write all **user-facing text strictly in Spanish** (UI, notifications, errors, bot responses)
- Prefer **self-documenting code** instead of comments (avoid inline comments)
- Keep a **clear separation**: backend logic in English, frontend/UI in Spanish
- **ALL DEVELOPMENT MUST BE IN ENGLISH**: Variable names, function names, comments, commit messages, documentation, and any text in the codebase
- **USER-FACING TEXT MUST BE IN SPANISH**: All messages, responses, and content displayed to users must be in Spanish
- **NO COMMENTS IN CODE**: Write self-documenting code with clear variable and function names instead of comments
- **CLEAR SEPARATION**: Code logic in English, user interface and messages in Spanish

### Architecture Requirements
- **Frontend**: Strict componentization - break down UI into small, reusable components
- **Backend**: Well-defined MVC architecture with clear separation of concerns
- **TypeScript**: Use proper interfaces and types for all data structures
- **Error Handling**: Implement proper error handling and validation at all levels

Please follow these guidelines when providing code suggestions:

## Technologies Used

### Frontend Stack
- **React 19.1** - Modern React with hooks and functional components
- **TypeScript 5.8** - Static typing for better code quality and IDE support
- **Vite 7.0** - Fast build tool and development server
- **Material-UI v7** - Component library for consistent UI/UX
  - `@mui/material` - Core components
  - `@mui/icons-material` - Material Design icons
  - `@emotion/react` & `@emotion/styled` - CSS-in-JS styling
- **React Leaflet 5.0** - Interactive maps integration
- **Leaflet 1.9** - Open-source mapping library
- **React Router Dom 7.7** - Client-side routing
- **React Hook Form 7.6** - Form management with validation
- **Yup 1.6** - Schema validation
- **React i18next 15.6** - Internationalization
- **Axios 1.10** - HTTP client
- **Recharts 3.1** - Data visualization charts

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express.js 4.18** - Web framework
- **MongoDB with Mongoose 8.16** - NoSQL database and ODM
- **MVC Architecture** - Model-View-Controller pattern
- **JWT Authentication** - JSON Web Tokens for security
- **Security & Middleware**:
  - `helmet` - Security headers
  - `cors` - Cross-origin resource sharing
  - `morgan` - HTTP request logging
  - `express-rate-limit` - Rate limiting
  - `express-validator` - Input validation
  - `bcryptjs` - Password hashing
  - `dotenv` - Environment variable management
- **Google Generative AI** - AI integration for chat features
- **Swagger** - API documentation
- **Development Tools**:
  - `nodemon` - Auto-restart development server
  - `jest` - Testing framework
  - `supertest` - HTTP testing

### Data Management
- **MongoDB** - Primary database for users, places, reviews, favorites
- **Mongoose ODM** - Object Document Mapping with schemas
- **JSON Files** - Legacy data migration support
- **TypeScript Interfaces** - Type-safe data structures
- **Service Layer** - API communication abstraction

## Code Style Guidelines

### General Standards
- **Code in English, UI in Spanish**: Follow strict separation between developer logic and user interface text
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
│   ├── components/              # React components (strict componentization)
│   │   ├── AdminPlacesComponent.tsx    # Admin interface for place management
│   │   ├── AppRoutes.tsx              # Application routing configuration
│   │   ├── AuthNavbar.tsx             # Authentication navigation
│   │   ├── ChatComponent.tsx          # Chat interface with AI bot integration
│   │   ├── EmailVerificationBanner.tsx # Email verification UI
│   │   ├── FavoriteButton.tsx         # Toggle favorite places
│   │   ├── FavoritesComponent.tsx     # User favorites management
│   │   ├── FeaturedPlaceCard.tsx      # Featured place showcase
│   │   ├── ForgotPasswordComponent.tsx # Password recovery
│   │   ├── HomeComponent.tsx          # Main application dashboard
│   │   ├── LandingPage.tsx            # Public landing page
│   │   ├── LanguageSwitcher.tsx       # Multilingual support
│   │   ├── Layout.tsx                 # Common layout wrapper
│   │   ├── LoginComponent.tsx         # User login interface
│   │   ├── MainContent.tsx            # Main content area
│   │   ├── MapComponent.tsx           # Interactive Leaflet map
│   │   ├── Navbar.tsx                 # Main navigation
│   │   ├── PlaceCards.tsx             # Tourism places card display
│   │   ├── PlaceDetailsModal.tsx      # Detailed place information
│   │   ├── ProfileComponent.tsx       # User profile management
│   │   ├── ProtectedRoute.tsx         # Route protection
│   │   ├── RegisterComponent.tsx      # User registration
│   │   ├── ResetPasswordComponent.tsx # Password reset
│   │   ├── ReviewForm.tsx             # Place review submission
│   │   ├── TravelPlanComponent.tsx    # Travel planning interface
│   │   ├── VerifyEmailComponent.tsx   # Email verification
│   │   └── admin/                     # Admin-specific components
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx           # Authentication state management
│   │   └── LocaleContext.tsx         # Language/locale context
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useFavorites.ts          # Favorites management hook
│   │   └── useForm.ts               # Form handling hook
│   ├── i18n/                    # Internationalization
│   │   └── index.ts                # i18next configuration
│   ├── locales/                 # Translation files
│   │   ├── en/                     # English translations
│   │   ├── es/                     # Spanish translations
│   │   └── pt/                     # Portuguese translations
│   ├── services/                # API communication layer
│   │   ├── adminService.ts         # Admin operations service
│   │   ├── apiConfig.ts            # API configuration
│   │   ├── authService.ts          # Authentication service
│   │   ├── favoritesService.ts     # Favorites management
│   │   ├── placesService.ts        # Places/locations service
│   │   └── reviewsService.ts       # Reviews management
│   ├── shared/                  # Shared utilities
│   │   ├── components/             # Reusable components
│   │   ├── hooks/                  # Shared hooks
│   │   ├── styles/                 # Shared styles
│   │   └── utils/                  # Utility functions
│   ├── styles/                  # Styling utilities
│   │   ├── commonStyles.ts         # Common MUI styles
│   │   ├── index.ts                # Style exports
│   │   └── utilities.ts            # Style utilities
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.ts                 # Authentication types
│   │   ├── lugares.ts              # Legacy places types
│   │   └── places.ts               # Places data interfaces
│   ├── utils/                   # Utility functions
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── public/                      # Static public assets
│   ├── logo.png                 # Application logo
│   └── vite.svg                 # Vite logo
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App-specific TypeScript config
├── tsconfig.node.json           # Node-specific TypeScript config
└── eslint.config.js             # ESLint configuration
```

### Backend (Server)
```
server/
├── src/
│   ├── controllers/             # MVC Controllers
│   │   ├── adminController.js      # Admin operations controller
│   │   ├── authController.js       # Authentication controller
│   │   ├── favoritesController.js  # Favorites management
│   │   ├── placesController.js     # Places/locations controller
│   │   └── reviewsController.js    # Reviews management
│   ├── models/                  # Mongoose models
│   │   ├── auditModel.js           # Audit trail model
│   │   ├── chatHistoryModel.js     # Chat history model
│   │   ├── placeModel.js           # Place/location model
│   │   ├── reviewModel.js          # Review model
│   │   ├── serverModel.js          # Server configuration model
│   │   ├── settingsModel.js        # Application settings
│   │   └── userModel.js            # User model
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js           # Legacy auth routes
│   │   ├── favoritesRoutes.js      # Legacy favorites routes
│   │   ├── apiRoutes.js            # Legacy API routes
│   │   └── v1/                     # API v1 routes
│   │       ├── index.js               # Route aggregation
│   │       ├── adminRoutes.js         # Admin API routes
│   │       ├── authRoutes.js          # Authentication routes
│   │       ├── chatRoutes.js          # Chat/AI routes
│   │       ├── favoritesRoutes.js     # Favorites routes
│   │       ├── placesRoutes.js        # Places routes
│   │       └── reviewsRoutes.js       # Reviews routes
│   ├── middleware/              # Custom middleware
│   │   └── middleware.js           # Authentication, validation, logging
│   ├── services/                # Business logic services
│   ├── utils/                   # Utility functions
│   ├── config/                  # Configuration files
│   │   ├── config.js               # Environment configuration
│   │   └── database.js             # MongoDB connection
│   └── app.js                   # Main application file
├── scripts/                     # Database and utility scripts
│   ├── migratePlacesToMongoDB.js   # Data migration script
│   ├── seedDatabase.js             # Database seeding
│   └── README.md                   # Scripts documentation
├── tests/                       # Test files
│   └── auth.test.js                # Authentication tests
├── docs/                        # Comprehensive documentation
│   ├── API_ENDPOINTS.md            # API documentation
│   ├── AUTH_API.md                 # Authentication API guide
│   ├── BUSINESS_OVERVIEW.md        # Business requirements
│   ├── FEATURES_SUMMARY.md         # Feature overview
│   ├── I18N_GUIDE.md               # Internationalization guide
│   ├── LAUNCH_CHECKLIST.md         # Pre-launch checklist
│   ├── TECHNICAL_IMPLEMENTATION_PLAN.md # Technical roadmap
│   └── TODO_BACKLOG.md             # Development backlog
├── places.json                  # Legacy places data
├── package.json                 # Server dependencies
└── .env                         # Environment variables
```

### Key Components Overview
- **MapComponent**: Interactive map using React Leaflet with place markers and clustering
- **ChatComponent**: AI-powered chat interface with Google Generative AI and travel planning
- **PlaceCards**: Tourism places display with filtering, search, and category management
- **AuthNavbar/Navbar**: Authentication-aware navigation with user management
- **TravelPlanComponent**: AI-assisted travel itinerary planning and management
- **FavoritesComponent**: User favorites management with persistence
- **ReviewForm/Components**: Place review and rating system
- **AdminPlacesComponent**: Administrative interface for place management
- **ProtectedRoute**: Route protection based on authentication and roles
- **Language components**: Multilingual support with i18next integration

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

### User Interface
```typescript
interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  profilePicture?: string
  isEmailVerified: boolean
  lastLogin?: string
  createdAt: string
  updatedAt?: string
}
```

### Places (Lugares) Interface
```typescript
interface Place {
  _id?: string           // MongoDB ID
  id?: string           // Alternative ID
  key?: string          // Unique identifier/name
  name?: string          // Alternative to key
  description: string   // Detailed description
  location: {
    lat: number         // Latitude coordinate
    lng: number         // Longitude coordinate
    address?: string    // Address within location
  }
  type?: string         // Category (Alojamiento, Gastronomía, etc.)
  address: string       // Physical address
  phone?: string        // Contact phone
  email?: string        // Contact email
  website?: string      // Website URL
  rating?: {
    average: number     // Average rating
    count: number       // Number of ratings
  }
  images?: Array<{      // Place images
    url: string
    caption?: string
  }>
  openingHours?: any    // Operating hours
  features?: string[]   // Place features/amenities
  tags?: string[]       // Search tags
  status?: string       // Active/inactive status
  city?: string         // City location
  priceRange?: number   // Price category (1-4)
}
```

### Travel Planning
```typescript
interface TravelPlan {
  id: string
  userId: string
  title: string
  description?: string
  startDate: string
  endDate: string
  days: TravelDay[]
  createdAt: string
  updatedAt: string
}

interface TravelDay {
  dayNumber: number
  date: string
  activities: TravelActivity[]
}

interface TravelActivity {
  id: string
  placeId?: string
  name: string
  description?: string
  startTime?: string
  endTime?: string
  estimatedDuration?: number
  notes?: string
}
```

### API Response Structure
```typescript
interface PlacesResponse {
  places: Place[]
  message: string
}

interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
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

### placesService Methods
```typescript
export const placesService = {
  // Get all places with optional filtering
  getPlaces(type?: string): Promise<Place[]>
  
  // Search places by query
  searchPlaces(query: string): Promise<Place[]>
  
  // Get random places for discovery
  getRandomPlaces(count?: number): Promise<Place[]>
  
  // Get place details by ID
  getPlaceById(id: string): Promise<Place | null>
  
  // Get nearby places
  getNearbyPlaces(lat: number, lng: number, radius?: number): Promise<Place[]>
  
  // Get trending places
  getTrendingPlaces(): Promise<Place[]>
  
  // Ensure place exists (create if needed)
  ensurePlace(placeData: Partial<Place>): Promise<Place>
}
```

### authService Methods
```typescript
class AuthService {
  // Authentication
  login(credentials: LoginCredentials): Promise<AuthResponse>
  register(userData: RegisterData): Promise<AuthResponse>
  logout(): Promise<void>
  
  // Profile management
  getProfile(): Promise<User>
  updateProfile(data: UpdateProfileData): Promise<User>
  changePassword(data: ChangePasswordData): Promise<void>
  
  // Email verification
  sendVerificationEmail(): Promise<void>
  verifyEmail(token: string): Promise<void>
  
  // Password recovery
  forgotPassword(email: string): Promise<void>
  resetPassword(token: string, password: string): Promise<void>
  
  // Token management
  refreshToken(): Promise<TokenResponse>
  validateToken(): Promise<boolean>
}
```

### favoritesService Methods
```typescript
class FavoritesService {
  // Get user favorites
  getFavorites(): Promise<Place[]>
  
  // Add to favorites
  addFavorite(placeId: string): Promise<void>
  
  // Remove from favorites
  removeFavorite(placeId: string): Promise<void>
  
  // Check if place is favorite
  isFavorite(placeId: string): Promise<boolean>
  
  // Toggle favorite status
  toggleFavorite(placeId: string): Promise<boolean>
}
```

### reviewsService Methods
```typescript
class ReviewsService {
  // Get place reviews
  getPlaceReviews(placeId: string): Promise<Review[]>
  
  // Get user reviews
  getUserReviews(): Promise<Review[]>
  
  // Create new review
  createReview(reviewData: CreateReviewData): Promise<Review>
  
  // Update review
  updateReview(reviewId: string, reviewData: UpdateReviewData): Promise<Review>
  
  // Delete review
  deleteReview(reviewId: string): Promise<void>
  
  // Vote on review (helpful/not helpful)
  voteReview(reviewId: string, voteType: 'helpful' | 'not_helpful'): Promise<void>
}
```

### API Base Configuration
- **Base URL**: `http://localhost:3001`
- **API Version**: `/api/v1`
- **Authentication**: JWT Bearer tokens
- **Response Format**: JSON with proper error handling
- **Rate Limiting**: Applied to prevent abuse

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
- Integration with PlaceCards for location selection

### PlaceCards Features
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
- Travel planning assistance

### AuthNavbar/Navbar Features
- Authentication-aware navigation
- User profile menu with avatar
- Responsive design for mobile and desktop
- Role-based access control (admin/user)
- Language switching integration
- Logout functionality

### TravelPlanComponent Features
- AI-assisted travel itinerary creation
- Day-by-day activity planning
- Place recommendations based on preferences
- Duration and timing suggestions
- Export and sharing capabilities
- Integration with places database

### FavoritesComponent Features
- User favorites management
- Persistent storage with backend sync
- Quick add/remove functionality
- Integration with place cards and details
- Responsive grid layout

### ReviewForm/Components Features
- Star rating system
- Text review submission
- Image upload support
- Review editing and deletion
- User review history
- Vote on review helpfulness

### AdminPlacesComponent Features
- Administrative interface for place management
- CRUD operations for places
- Bulk operations support
- Data validation and error handling
- Image management
- Status and approval workflows

### ProtectedRoute Features
- Authentication-based route protection
- Role-based access control
- Automatic redirects for unauthorized access
- Loading states during authentication checks
- Public-only routes for login/register

## Backend API Endpoints

### Authentication & User Management
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/forgot-password` - Password recovery
- `POST /api/v1/auth/reset-password` - Password reset
- `POST /api/v1/auth/verify-email` - Email verification
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Places Management
- `GET /api/v1/places` - Get all places (with filtering)
- `GET /api/v1/places/search` - Search places by query
- `GET /api/v1/places/random` - Get random places
- `GET /api/v1/places/nearby` - Get nearby places
- `GET /api/v1/places/trending` - Get trending places
- `GET /api/v1/places/:id` - Get place by ID
- `POST /api/v1/places/ensure` - Ensure place exists

### Reviews Management
- `GET /api/v1/reviews/place/:placeId` - Get place reviews
- `GET /api/v1/reviews/user` - Get user reviews
- `POST /api/v1/reviews` - Create review
- `PUT /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review
- `POST /api/v1/reviews/:id/vote` - Vote on review

### Favorites Management
- `GET /api/v1/favorites` - Get user favorites
- `POST /api/v1/favorites/:placeId` - Add to favorites
- `DELETE /api/v1/favorites/:placeId` - Remove from favorites

### Chat & AI
- `POST /api/v1/chat` - Send message to AI assistant
- `GET /api/v1/chat/history` - Get chat history

### Admin Operations
- `GET /api/v1/admin/places` - Admin places management
- `POST /api/v1/admin/places` - Create place (admin)
- `PUT /api/v1/admin/places/:id` - Update place (admin)
- `DELETE /api/v1/admin/places/:id` - Delete place (admin)
- `GET /api/v1/admin/users` - Get all users (admin)
- `PUT /api/v1/admin/users/:id` - Update user (admin)

### Server Information
- `GET /` - Server information and welcome message
- `GET /api/` - API welcome message with available endpoints
- `GET /api/health` - Health check endpoint
- `GET /api/status` - Detailed server status and system information

## MVC Architecture Guidelines
- **Models**: Handle data logic and business rules with Mongoose schemas
- **Views**: JSON responses (REST API)
- **Controllers**: Process requests and coordinate between models and views
- Use middleware for cross-cutting concerns (logging, validation, security)
- Follow RESTful conventions for API endpoints

## Security Features
- Helmet.js for security headers
- CORS configuration
- Input validation middleware with express-validator
- JWT authentication and authorization
- Password hashing with bcryptjs
- Rate limiting protection
- Error handling middleware
- Environment variable protection

## Database Architecture
- **MongoDB Atlas**: Cloud-hosted MongoDB database
- **Mongoose ODM**: Object Document Mapping with schemas
- **Collections**: Users, Places, Reviews, Favorites, ChatHistory, Audit
- **Indexing**: Proper indexing for search and location queries
- **Validation**: Schema-level validation with Mongoose
- **Migration Scripts**: Database seeding and migration utilities

## Language Separation Guidelines

### Code Layer (English Only)
- Variable names: `selectedPlaces`, `searchType`, `placesController`
- Function names: `getPlaces()`, `searchPlaces()`, `processChat()`
- File names: `placesController.js`, `placesService.ts`, `places.json`
- Database field names: `key`, `type`, `description`, `address`, `location`
- API endpoint names: `/api/places`, `/api/places/search`
- Log messages for developers: `console.log('Using database places:', places.length)`

### User Interface Layer (Spanish Only)
- Error messages: `"Error al obtener lugares"`, `"El mensaje es requerido"`
- API response messages: `"Bienvenido a la API de Japasea"`
- User notifications: `"Servidor Japasea funcionando correctamente"`
- Bot responses: All AI responses must be in Spanish for user interaction
- Frontend display text: All text shown to users in the UI

### Data Layer (Mixed - Context Dependent)
- User descriptions: Keep original Spanish descriptions for places
- Place names: Keep original names (e.g., "Costanera de Encarnación")
- Categories: Use English for database consistency but Spanish for display
- Addresses: Keep original Spanish format
