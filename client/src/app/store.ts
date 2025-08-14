import { configureStore } from '@reduxjs/toolkit'
import { placesReducer } from '../features/places/store/placesSlice'
import reviewsReducer from '../features/reviews/store/reviewsSlice'

export const store = configureStore({
  reducer: {
    places: placesReducer,
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
