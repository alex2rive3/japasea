// Auth feature barrel exports

// Types
export type * from './types';

// Store
export { authSlice, selectAuth, selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from './store/authSlice';
export {
  loginAsync,
  registerAsync,
  logoutAsync,
  updateProfileAsync,
  changePasswordAsync,
  forgotPasswordAsync,
  resetPasswordAsync,
  verifyEmailAsync,
  resendVerificationAsync,
  clearError,
  clearAuth,
  setUser,
  setToken,
} from './store/authSlice';

// Hooks
export { useAuth } from './hooks/useAuth';

// Components
export {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  EmailVerificationForm,
  ProfileForm,
} from './components';

// Services (internal use only)
export { authService } from './services/authService';
