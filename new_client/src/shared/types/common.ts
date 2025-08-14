// Shared types used across the application

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
    value?: string;
  }>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface SearchFilters {
  query?: string;
  type?: string;
  city?: string;
  tags?: string[];
  priceRange?: [number, number];
  rating?: number;
}

export interface FileUpload {
  url: string;
  name: string;
  size: number;
  type: string;
  caption?: string;
}

export interface Rating {
  average: number;
  count: number;
  breakdown?: {
    [key: number]: number; // 1-5 stars count
  };
}

// Language and internationalization
export type Language = 'es' | 'en';

export interface LocalizedContent {
  es: string;
  en?: string;
}

// Theme and UI
export type ThemeMode = 'light' | 'dark' | 'system';

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
