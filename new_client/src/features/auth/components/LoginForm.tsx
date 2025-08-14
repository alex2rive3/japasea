import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useAppTranslation } from '@/shared/hooks';
import { loginSchema } from '../validation/schemas';
import type { LoginFormData } from '../types';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, user, clearAuthError } = useAuth();
  const { t } = useAppTranslation('auth');
  
  const [showPassword, setShowPassword] = useState(false);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearAuthError();
      const result = await login({
        email: data.email,
        password: data.password,
      });
      
      // Navigation will be handled by the useEffect above
      if (result.meta.requestStatus === 'fulfilled') {
        // Optional: show success message or handle success state
      }
    } catch (error) {
      // Error is handled by Redux state
      console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
            }}
          >
            {t('login.title', 'Iniciar Sesión')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('login.subtitle', 'Accede a tu cuenta de Japasea')}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('login.email', 'Correo electrónico')}
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                margin="normal"
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('login.password', 'Contraseña')}
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || isSubmitting}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {loading || isSubmitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                {t('login.signingIn', 'Iniciando sesión...')}
              </Box>
            ) : (
              t('login.signIn', 'Iniciar Sesión')
            )}
          </Button>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('login.forgotPassword', '¿Olvidaste tu contraseña?')}{' '}
              <Link
                to="/forgot-password"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {t('login.resetHere', 'Recupérala aquí')}
              </Link>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t('login.noAccount', '¿No tienes cuenta?')}{' '}
              <Link
                to="/register"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {t('login.signUp', 'Regístrate')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
