import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  AuthState, 
  User, 
  LoginCredentials, 
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
  ResendVerificationData,
  AuthData
} from '../types';
import { authService } from '../services/authService';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  lastLoginAttempt: null,
};

// Helper function to extract error message
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
};

// Async thunks
export const loginAsync = createAsyncThunk<AuthData, LoginCredentials>(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      console.log('Login response in thunk:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      // Handle both possible response structures:
      // 1. Full AuthResponse with data property: { success, message, data: { user, accessToken, refreshToken } }
      // 2. Direct data: { user, accessToken, refreshToken }
      
      let authData: AuthData;
      
      if (response && 'data' in response && response.data && typeof response.data === 'object') {
        // Full AuthResponse structure
        authData = response.data;
        console.log('Using response.data structure');
      } else if (response && 'user' in response && 'accessToken' in response) {
        // Direct data structure - type assertion needed here
        authData = response as AuthData;
        console.log('Using direct response structure');
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('No se recibieron datos válidos del servidor');
      }
      
      if (!authData.user || !authData.accessToken) {
        console.error('Missing required fields in auth data:', authData);
        throw new Error('Datos de autenticación incompletos');
      }
      
      return authData;
    } catch (error: unknown) {
      console.error('Login error in thunk:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error en el inicio de sesión';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerAsync = createAsyncThunk<AuthData, RegisterData>(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Error en el registro'));
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Error al cerrar sesión'));
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (!state.auth.refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await authService.refreshToken(state.auth.refreshToken);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Error al renovar el token'));
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: UpdateProfileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response.data.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Error al actualizar el perfil'));
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: ChangePasswordData, { rejectWithValue }) => {
    try {
      await authService.changePassword(passwordData);
      return 'Contraseña actualizada exitosamente';
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Error al cambiar la contraseña'));
    }
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (emailData: ForgotPasswordData, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(emailData.email);
      return response.message;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Error al enviar email de recuperación'));
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (resetData: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(resetData.token, resetData.newPassword);
      return response.message;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Error al restablecer la contraseña'));
    }
  }
);

export const verifyEmailAsync = createAsyncThunk(
  'auth/verifyEmail',
  async (verifyData: VerifyEmailData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(verifyData.token);
      return response.data.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Error al verificar el email'));
    }
  }
);

export const resendVerificationAsync = createAsyncThunk(
  'auth/resendVerification',
  async (emailData: ResendVerificationData, { rejectWithValue }) => {
    try {
      const response = await authService.resendVerificationEmail(emailData.email);
      return response.message;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Error al reenviar verificación'));
    }
  }
);

// Auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<{ token: string; refreshToken?: string }>) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastLoginAttempt = Date.now();
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        // The payload is now properly typed as AuthData
        const authData = action.payload;
        state.user = authData.user;
        state.token = authData.accessToken;
        state.refreshToken = authData.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });

    // Refresh Token
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // Update Profile
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Change Password
    builder
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Verify Email
    builder
      .addCase(verifyEmailAsync.fulfilled, (state, action) => {
        if (state.user) {
          state.user = action.payload;
        }
      });
  },
});

// Actions
export const { clearError, clearAuth, setUser, setToken } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
