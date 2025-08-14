import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { resetPasswordSchema } from '../validation/schemas';
import { useAppTranslation } from '@/shared/hooks';
import type { ResetPasswordData } from '../types';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading, error, clearAuthError } = useAuth();
  const { t } = useAppTranslation('auth');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/forgot-password', { replace: true });
    }
  }, [token, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    try {
      clearAuthError();
      
      const resetData: ResetPasswordData = {
        token,
        newPassword: data.newPassword,
      };

      const result = await resetPassword(resetData);
      
      if (result.meta.requestStatus === 'fulfilled') {
        setIsSuccess(true);
        reset();
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: t('resetPassword.successRedirect', 'Contraseña restablecida. Ya puedes iniciar sesión.') 
            } 
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isSuccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main', mb: 2 }}>
            {t('resetPassword.success', '¡Contraseña restablecida!')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('resetPassword.successMessage', 'Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión.')}
          </Typography>
          <CircularProgress size={24} />
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('resetPassword.title', 'Nueva Contraseña')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {email 
              ? t('resetPassword.subtitleWithEmail', `Ingresa tu nueva contraseña para ${email}`)
              : t('resetPassword.subtitle', 'Ingresa tu nueva contraseña')
            }
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('newPassword')}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label={t('resetPassword.newPassword', 'Nueva contraseña')}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            {...register('confirmPassword')}
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            label={t('resetPassword.confirmPassword', 'Confirmar contraseña')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !isValid}
            sx={{
              mb: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('resetPassword.submit', 'Restablecer contraseña')
            )}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={Link}
              to="/login"
              variant="text"
              sx={{ textDecoration: 'none' }}
            >
              {t('resetPassword.backToLogin', 'Volver al inicio de sesión')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
