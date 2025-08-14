import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { FavoritesState, Favorite, AddFavoriteRequest, RemoveFavoriteRequest, GetFavoritesRequest } from '../types';
import { favoritesService } from '../services/favoritesService';
import type { RootState } from '../../../app/store';

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
  totalCount: 0
};

export const fetchUserFavorites = createAsyncThunk(
  'favorites/fetchUserFavorites',
  async (params: GetFavoritesRequest = {}, { rejectWithValue }) => {
    try {
      return await favoritesService.getUserFavorites(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener favoritos');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (data: AddFavoriteRequest, { rejectWithValue }) => {
    try {
      return await favoritesService.addToFavorites(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al agregar a favoritos');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (data: RemoveFavoriteRequest, { rejectWithValue }) => {
    try {
      await favoritesService.removeFromFavorites(data);
      return data.favoriteId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al remover de favoritos');
    }
  }
);

export const checkIsFavorite = createAsyncThunk(
  'favorites/checkIsFavorite',
  async (placeId: string, { rejectWithValue }) => {
    try {
      const isFavorite = await favoritesService.checkIsFavorite(placeId);
      return { placeId, isFavorite };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al verificar favorito');
    }
  }
);

export const getFavoriteByPlaceId = createAsyncThunk(
  'favorites/getFavoriteByPlaceId',
  async (placeId: string, { rejectWithValue }) => {
    try {
      return await favoritesService.getFavoriteByPlaceId(placeId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener favorito');
    }
  }
);

export const clearAllFavorites = createAsyncThunk(
  'favorites/clearAllFavorites',
  async (_, { rejectWithValue }) => {
    try {
      await favoritesService.clearAllFavorites();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al limpiar favoritos');
    }
  }
);

export const getFavoritesCount = createAsyncThunk(
  'favorites/getFavoritesCount',
  async (_, { rejectWithValue }) => {
    try {
      return await favoritesService.getFavoritesCoun();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener conteo de favoritos');
    }
  }
);

export const exportFavorites = createAsyncThunk(
  'favorites/exportFavorites',
  async (_, { rejectWithValue }) => {
    try {
      return await favoritesService.exportFavorites();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al exportar favoritos');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavoritesError: (state) => {
      state.error = null;
    },
    resetFavoritesState: () => initialState,
    updateFavoriteOptimistic: (state, action: PayloadAction<Favorite>) => {
      const existingIndex = state.favorites.findIndex(f => f.id === action.payload.id);
      if (existingIndex >= 0) {
        state.favorites[existingIndex] = action.payload;
      } else {
        state.favorites.push(action.payload);
        state.totalCount += 1;
      }
    },
    removeFavoriteOptimistic: (state, action: PayloadAction<string>) => {
      const index = state.favorites.findIndex(f => f.id === action.payload);
      if (index >= 0) {
        state.favorites.splice(index, 1);
        state.totalCount -= 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Favorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload.favorites;
        state.totalCount = action.payload.total;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add to Favorites
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove from Favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        const favoriteId = action.payload;
        const index = state.favorites.findIndex(f => f.id === favoriteId);
        if (index >= 0) {
          state.favorites.splice(index, 1);
          state.totalCount -= 1;
        }
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Clear All Favorites
      .addCase(clearAllFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearAllFavorites.fulfilled, (state) => {
        state.loading = false;
        state.favorites = [];
        state.totalCount = 0;
      })
      .addCase(clearAllFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get Favorites Count
      .addCase(getFavoritesCount.fulfilled, (state, action) => {
        state.totalCount = action.payload;
      })
      
      // Export Favorites
      .addCase(exportFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportFavorites.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  clearFavoritesError, 
  resetFavoritesState, 
  updateFavoriteOptimistic, 
  removeFavoriteOptimistic 
} = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state: RootState) => state.favorites.favorites;
export const selectFavoritesLoading = (state: RootState) => state.favorites.loading;
export const selectFavoritesError = (state: RootState) => state.favorites.error;
export const selectFavoritesTotalCount = (state: RootState) => state.favorites.totalCount;
export const selectFavoritesState = (state: RootState) => state.favorites;

export const selectIsFavorite = (placeId: string) => (state: RootState) =>
  state.favorites.favorites.some(favorite => favorite.placeId === placeId);

export const selectFavoriteByPlaceId = (placeId: string) => (state: RootState) =>
  state.favorites.favorites.find(favorite => favorite.placeId === placeId);

export { favoritesSlice };
