import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
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
} from '../store/authSlice';
import type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
  ResendVerificationData,
} from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  // Selectors - using direct state access to avoid typing issues for now
  const auth = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

  // Actions
  const login = useCallback(
    (credentials: LoginCredentials) => {
      return dispatch(loginAsync(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData: RegisterData) => {
      return dispatch(registerAsync(userData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutAsync());
  }, [dispatch]);

  const updateProfile = useCallback(
    (profileData: UpdateProfileData) => {
      return dispatch(updateProfileAsync(profileData));
    },
    [dispatch]
  );

  const changePassword = useCallback(
    (passwordData: ChangePasswordData) => {
      return dispatch(changePasswordAsync(passwordData));
    },
    [dispatch]
  );

  const forgotPassword = useCallback(
    (emailData: ForgotPasswordData) => {
      return dispatch(forgotPasswordAsync(emailData));
    },
    [dispatch]
  );

  const resetPassword = useCallback(
    (resetData: ResetPasswordData) => {
      return dispatch(resetPasswordAsync(resetData));
    },
    [dispatch]
  );

  const verifyEmail = useCallback(
    (verifyData: VerifyEmailData) => {
      return dispatch(verifyEmailAsync(verifyData));
    },
    [dispatch]
  );

  const resendVerification = useCallback(
    (emailData: ResendVerificationData) => {
      return dispatch(resendVerificationAsync(emailData));
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Computed values
  const isEmailVerified = user?.isEmailVerified ?? false;
  const isAdmin = user?.role === 'admin';
  const userName = user?.name ?? '';
  const userEmail = user?.email ?? '';

  return {
    // State
    auth,
    user,
    isAuthenticated,
    loading,
    error,
    
    // Computed
    isEmailVerified,
    isAdmin,
    userName,
    userEmail,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    clearAuthError,
  };
};
