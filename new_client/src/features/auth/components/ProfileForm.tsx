import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { profileFormSchema, changePasswordSchema } from '../validation/schemas';
import { useAppTranslation } from '@/shared/hooks';
import type { UpdateProfileData, ChangePasswordData } from '../types';

interface ProfileFormData {
  name: string;
  phone: string;
}

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfileForm = () => {
  const { 
    user, 
    updateProfile, 
    changePassword, 
    loading, 
    error, 
    clearAuthError 
  } = useAuth();
  const { t } = useAppTranslation('auth');
  
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile form
  const {
    register,
    handleSubmit,
    formState: { errors: profileErrors, isDirty },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  // Change password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onChange',
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);

  // Clear messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      clearAuthError();
      
      const profileData: UpdateProfileData = {
        name: data.name,
        phone: data.phone || undefined,
      };

      const result = await updateProfile(profileData);
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSuccessMessage(t('profile.updateSuccess', 'Perfil actualizado exitosamente'));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const onSubmitPassword = async (data: ChangePasswordFormData) => {
    try {
      clearAuthError();
      
      const passwordData: ChangePasswordData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      const result = await changePassword(passwordData);
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSuccessMessage(t('profile.passwordChangeSuccess', 'Contraseña actualizada exitosamente'));
        setShowChangePassword(false);
        resetPassword();
      }
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setValue('name', user.name);
      setValue('phone', user.phone || '');
    }
    setIsEditing(false);
  };

  const handleCancelPasswordChange = () => {
    setShowChangePassword(false);
    resetPassword();
    clearAuthError();
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{ 
              width: 100, 
              height: 100, 
              mx: 'auto', 
              mb: 2,
              fontSize: '2rem',
              bgcolor: 'primary.main'
            }}
            src={user.profilePicture}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <IconButton
            sx={{ 
              position: 'relative', 
              mt: -6, 
              ml: 6,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <PhotoCameraIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600, mt: 2 }}>
            {t('profile.title', 'Mi Perfil')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Profile Information */}
        <Box component="form" onSubmit={handleSubmit(onSubmitProfile)} noValidate>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('profile.personalInfo', 'Información Personal')}
              </Typography>
              {!isEditing && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  variant="outlined"
                  size="small"
                >
                  {t('profile.edit', 'Editar')}
                </Button>
              )}
            </Box>

            <TextField
              {...register('name')}
              fullWidth
              label={t('profile.name', 'Nombre completo')}
              disabled={!isEditing}
              error={!!profileErrors.name}
              helperText={profileErrors.name?.message}
            />

            <TextField
              fullWidth
              label={t('profile.email', 'Correo electrónico')}
              value={user.email}
              disabled
              helperText={t('profile.emailHelper', 'El correo electrónico no se puede cambiar')}
            />

            <TextField
              {...register('phone')}
              fullWidth
              label={t('profile.phone', 'Teléfono')}
              disabled={!isEditing}
              error={!!profileErrors.phone}
              helperText={profileErrors.phone?.message}
            />

            {isEditing && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleCancelEdit}
                  variant="outlined"
                  startIcon={<CancelIcon />}
                >
                  {t('profile.cancel', 'Cancelar')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading || !isDirty}
                >
                  {loading ? t('profile.saving', 'Guardando...') : t('profile.save', 'Guardar')}
                </Button>
              </Box>
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Change Password Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('profile.security', 'Seguridad')}
            </Typography>
            {!showChangePassword && (
              <Button
                onClick={() => setShowChangePassword(true)}
                variant="outlined"
                size="small"
              >
                {t('profile.changePassword', 'Cambiar contraseña')}
              </Button>
            )}
          </Box>

          {showChangePassword && (
            <Box component="form" onSubmit={handlePasswordSubmit(onSubmitPassword)} noValidate>
              <Stack spacing={3}>
                <TextField
                  {...registerPassword('currentPassword')}
                  fullWidth
                  type="password"
                  label={t('profile.currentPassword', 'Contraseña actual')}
                  error={!!passwordErrors.currentPassword}
                  helperText={passwordErrors.currentPassword?.message}
                />

                <TextField
                  {...registerPassword('newPassword')}
                  fullWidth
                  type="password"
                  label={t('profile.newPassword', 'Nueva contraseña')}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword?.message}
                />

                <TextField
                  {...registerPassword('confirmPassword')}
                  fullWidth
                  type="password"
                  label={t('profile.confirmNewPassword', 'Confirmar nueva contraseña')}
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword?.message}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleCancelPasswordChange}
                    variant="outlined"
                    startIcon={<CancelIcon />}
                  >
                    {t('profile.cancel', 'Cancelar')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading || !isPasswordValid}
                  >
                    {loading ? t('profile.updating', 'Actualizando...') : t('profile.updatePassword', 'Actualizar contraseña')}
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Account Info */}
        <Divider sx={{ my: 4 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {t('profile.accountInfo', 'Información de la cuenta')}
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>{t('profile.memberSince', 'Miembro desde:')} </strong>
              {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t('profile.lastLogin', 'Último acceso:')} </strong>
              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : t('profile.never', 'Nunca')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t('profile.emailVerified', 'Email verificado:')} </strong>
              {user.isEmailVerified ? t('profile.yes', 'Sí') : t('profile.no', 'No')}
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
