// Barrel export for all shared types
export * from './common';

// Re-export commonly used types from features for convenience
// Auth types
export type { User, AuthState, LoginCredentials, RegisterData } from '../../features/auth/types';

// These will be uncommented as features are migrated
// export type { Place, PlaceType } from '../../features/places/types';
// export type { Review } from '../../features/reviews/types';
// export type { Favorite } from '../../features/favorites/types';
