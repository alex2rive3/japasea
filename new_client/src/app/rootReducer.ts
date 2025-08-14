import { combineReducers } from '@reduxjs/toolkit';

// Import feature slices (being created in current phases)
import { authSlice } from '../features/auth/store/authSlice';
import { placesSlice } from '../features/places/store/placesSlice';
import { chatSlice } from '../features/chat/store/chatSlice';
// Note: Other features temporarily disabled due to missing dependencies
// import { reviewsSlice } from '../features/reviews/store/reviewsSlice';
// import { favoritesSlice } from '../features/favorites/store/favoritesSlice';
// import { adminSlice } from '../features/admin/store/adminSlice';

export const rootReducer = combineReducers({
  // Feature slices
  auth: authSlice.reducer,
  places: placesSlice.reducer,
  chat: chatSlice.reducer,
  // Temporarily commented out until dependencies are resolved
  // reviews: reviewsSlice.reducer,
  // favorites: favoritesSlice.reducer,
  // admin: adminSlice.reducer,
  
  // Feature slices will be added here as they are implemented:
  // reviews: reviewsSlice.reducer,
  // favorites: favoritesSlice.reducer,
  // admin: adminSlice.reducer,
});
