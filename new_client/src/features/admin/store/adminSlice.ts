import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  AdminState,
  AdminStats,
  AdminActivity,
  UserManagement,
  PlaceManagement,
  ReviewManagement,
  GetUsersRequest,
  GetPlacesRequest,
  GetReviewsRequest,
  UpdateUserRequest,
  UpdatePlaceRequest,
  UpdateReviewRequest,
  CreatePlaceRequest
} from '../types';
import { adminService } from '../services/adminService';
import type { RootState } from '../../../app/store';

const initialState: AdminState = {
  stats: null,
  users: [],
  places: [],
  reviews: [],
  activities: [],
  loading: false,
  error: null,
  selectedUser: null,
  selectedPlace: null,
  selectedReview: null
};

// Dashboard & Statistics
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getDashboardStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }
);

export const getRecentActivity = createAsyncThunk(
  'admin/getRecentActivity',
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      return await adminService.getRecentActivity(limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener actividad reciente');
    }
  }
);

// User Management
export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (params: GetUsersRequest = {}, { rejectWithValue }) => {
    try {
      return await adminService.getUsers(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener usuarios');
    }
  }
);

export const getUser = createAsyncThunk(
  'admin/getUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await adminService.getUser(userId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener usuario');
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async (data: UpdateUserRequest, { rejectWithValue }) => {
    try {
      return await adminService.updateUser(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar usuario');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar usuario');
    }
  }
);

export const suspendUser = createAsyncThunk(
  'admin/suspendUser',
  async ({ userId, reason }: { userId: string; reason?: string }, { rejectWithValue }) => {
    try {
      return await adminService.suspendUser(userId, reason);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al suspender usuario');
    }
  }
);

export const unsuspendUser = createAsyncThunk(
  'admin/unsuspendUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await adminService.unsuspendUser(userId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al reactivar usuario');
    }
  }
);

// Place Management
export const getPlaces = createAsyncThunk(
  'admin/getPlaces',
  async (params: GetPlacesRequest = {}, { rejectWithValue }) => {
    try {
      return await adminService.getPlaces(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener lugares');
    }
  }
);

export const getPlace = createAsyncThunk(
  'admin/getPlace',
  async (placeId: string, { rejectWithValue }) => {
    try {
      return await adminService.getPlace(placeId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener lugar');
    }
  }
);

export const createPlace = createAsyncThunk(
  'admin/createPlace',
  async (data: CreatePlaceRequest, { rejectWithValue }) => {
    try {
      return await adminService.createPlace(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear lugar');
    }
  }
);

export const updatePlace = createAsyncThunk(
  'admin/updatePlace',
  async (data: UpdatePlaceRequest, { rejectWithValue }) => {
    try {
      return await adminService.updatePlace(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar lugar');
    }
  }
);

export const deletePlace = createAsyncThunk(
  'admin/deletePlace',
  async (placeId: string, { rejectWithValue }) => {
    try {
      await adminService.deletePlace(placeId);
      return placeId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar lugar');
    }
  }
);

export const approvePlace = createAsyncThunk(
  'admin/approvePlace',
  async (placeId: string, { rejectWithValue }) => {
    try {
      return await adminService.approvePlace(placeId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar lugar');
    }
  }
);

export const rejectPlace = createAsyncThunk(
  'admin/rejectPlace',
  async ({ placeId, reason }: { placeId: string; reason?: string }, { rejectWithValue }) => {
    try {
      return await adminService.rejectPlace(placeId, reason);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al rechazar lugar');
    }
  }
);

// Review Management
export const getReviews = createAsyncThunk(
  'admin/getReviews',
  async (params: GetReviewsRequest = {}, { rejectWithValue }) => {
    try {
      return await adminService.getReviews(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener reseñas');
    }
  }
);

export const getReview = createAsyncThunk(
  'admin/getReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      return await adminService.getReview(reviewId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener reseña');
    }
  }
);

export const updateReview = createAsyncThunk(
  'admin/updateReview',
  async (data: UpdateReviewRequest, { rejectWithValue }) => {
    try {
      return await adminService.updateReview(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar reseña');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'admin/deleteReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await adminService.deleteReview(reviewId);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar reseña');
    }
  }
);

export const approveReview = createAsyncThunk(
  'admin/approveReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      return await adminService.approveReview(reviewId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar reseña');
    }
  }
);

export const rejectReview = createAsyncThunk(
  'admin/rejectReview',
  async ({ reviewId, reason }: { reviewId: string; reason?: string }, { rejectWithValue }) => {
    try {
      return await adminService.rejectReview(reviewId, reason);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al rechazar reseña');
    }
  }
);

export const bulkApproveReviews = createAsyncThunk(
  'admin/bulkApproveReviews',
  async (reviewIds: string[], { rejectWithValue }) => {
    try {
      return await adminService.bulkApproveReviews(reviewIds);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al aprobar reseñas');
    }
  }
);

export const bulkRejectReviews = createAsyncThunk(
  'admin/bulkRejectReviews',
  async ({ reviewIds, reason }: { reviewIds: string[]; reason?: string }, { rejectWithValue }) => {
    try {
      return await adminService.bulkRejectReviews(reviewIds, reason);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al rechazar reseñas');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    resetAdminState: () => initialState,
    setSelectedUser: (state, action: PayloadAction<UserManagement | null>) => {
      state.selectedUser = action.payload;
    },
    setSelectedPlace: (state, action: PayloadAction<PlaceManagement | null>) => {
      state.selectedPlace = action.payload;
    },
    setSelectedReview: (state, action: PayloadAction<ReviewManagement | null>) => {
      state.selectedReview = action.payload;
    },
    updateUserInList: (state, action: PayloadAction<UserManagement>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index >= 0) {
        state.users[index] = action.payload;
      }
    },
    updatePlaceInList: (state, action: PayloadAction<PlaceManagement>) => {
      const index = state.places.findIndex(place => place.id === action.payload.id);
      if (index >= 0) {
        state.places[index] = action.payload;
      }
    },
    updateReviewInList: (state, action: PayloadAction<ReviewManagement>) => {
      const index = state.reviews.findIndex(review => review.id === action.payload.id);
      if (index >= 0) {
        state.reviews[index] = action.payload;
      }
    },
    removeUserFromList: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    removePlaceFromList: (state, action: PayloadAction<string>) => {
      state.places = state.places.filter(place => place.id !== action.payload);
    },
    removeReviewFromList: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter(review => review.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Recent Activity
      .addCase(getRecentActivity.fulfilled, (state, action) => {
        state.activities = action.payload;
      })
      
      // Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(getUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index >= 0) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      
      .addCase(suspendUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index >= 0) {
          state.users[index] = action.payload;
        }
      })
      
      .addCase(unsuspendUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index >= 0) {
          state.users[index] = action.payload;
        }
      })
      
      // Places
      .addCase(getPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload.places;
      })
      .addCase(getPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(getPlace.fulfilled, (state, action) => {
        state.selectedPlace = action.payload;
      })
      
      .addCase(createPlace.fulfilled, (state, action) => {
        state.places.unshift(action.payload);
      })
      
      .addCase(updatePlace.fulfilled, (state, action) => {
        const index = state.places.findIndex(place => place.id === action.payload.id);
        if (index >= 0) {
          state.places[index] = action.payload;
        }
        if (state.selectedPlace?.id === action.payload.id) {
          state.selectedPlace = action.payload;
        }
      })
      
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.places = state.places.filter(place => place.id !== action.payload);
        if (state.selectedPlace?.id === action.payload) {
          state.selectedPlace = null;
        }
      })
      
      .addCase(approvePlace.fulfilled, (state, action) => {
        const index = state.places.findIndex(place => place.id === action.payload.id);
        if (index >= 0) {
          state.places[index] = action.payload;
        }
      })
      
      .addCase(rejectPlace.fulfilled, (state, action) => {
        const index = state.places.findIndex(place => place.id === action.payload.id);
        if (index >= 0) {
          state.places[index] = action.payload;
        }
      })
      
      // Reviews
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(getReview.fulfilled, (state, action) => {
        state.selectedReview = action.payload;
      })
      
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review.id === action.payload.id);
        if (index >= 0) {
          state.reviews[index] = action.payload;
        }
        if (state.selectedReview?.id === action.payload.id) {
          state.selectedReview = action.payload;
        }
      })
      
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
        if (state.selectedReview?.id === action.payload) {
          state.selectedReview = null;
        }
      })
      
      .addCase(approveReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review.id === action.payload.id);
        if (index >= 0) {
          state.reviews[index] = action.payload;
        }
      })
      
      .addCase(rejectReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review.id === action.payload.id);
        if (index >= 0) {
          state.reviews[index] = action.payload;
        }
      })
      
      .addCase(bulkApproveReviews.fulfilled, (state, action) => {
        action.payload.forEach(updatedReview => {
          const index = state.reviews.findIndex(review => review.id === updatedReview.id);
          if (index >= 0) {
            state.reviews[index] = updatedReview;
          }
        });
      })
      
      .addCase(bulkRejectReviews.fulfilled, (state, action) => {
        action.payload.forEach(updatedReview => {
          const index = state.reviews.findIndex(review => review.id === updatedReview.id);
          if (index >= 0) {
            state.reviews[index] = updatedReview;
          }
        });
      });
  }
});

export const {
  clearAdminError,
  resetAdminState,
  setSelectedUser,
  setSelectedPlace,
  setSelectedReview,
  updateUserInList,
  updatePlaceInList,
  updateReviewInList,
  removeUserFromList,
  removePlaceFromList,
  removeReviewFromList
} = adminSlice.actions;

// Selectors
export const selectAdminStats = (state: RootState) => state.admin.stats;
export const selectAdminUsers = (state: RootState) => state.admin.users;
export const selectAdminPlaces = (state: RootState) => state.admin.places;
export const selectAdminReviews = (state: RootState) => state.admin.reviews;
export const selectAdminActivities = (state: RootState) => state.admin.activities;
export const selectAdminLoading = (state: RootState) => state.admin.loading;
export const selectAdminError = (state: RootState) => state.admin.error;
export const selectSelectedUser = (state: RootState) => state.admin.selectedUser;
export const selectSelectedPlace = (state: RootState) => state.admin.selectedPlace;
export const selectSelectedReview = (state: RootState) => state.admin.selectedReview;
export const selectAdminState = (state: RootState) => state.admin;

export const selectUserById = (userId: string) => (state: RootState) =>
  state.admin.users.find(user => user.id === userId);

export const selectPlaceById = (placeId: string) => (state: RootState) =>
  state.admin.places.find(place => place.id === placeId);

export const selectReviewById = (reviewId: string) => (state: RootState) =>
  state.admin.reviews.find(review => review.id === reviewId);

export const selectPendingReviews = (state: RootState) =>
  state.admin.reviews.filter(review => review.status === 'pending');

export const selectPendingPlaces = (state: RootState) =>
  state.admin.places.filter(place => place.status === 'pending');

export { adminSlice };
