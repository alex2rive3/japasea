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
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useAppTranslation } from '@/shared/hooks';
import { registerSchema } from '../validation/schemas';

interface LocalRegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading, error, isAuthenticated, user, clearAuthError } = useAuth();
  const { t } = useAppTranslation('auth');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LocalRegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
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

  const onSubmit = async (data: LocalRegisterFormData) => {
    try {
      clearAuthError();
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      };
      
      const result = await register(registerData);
      
      // Navigation will be handled by the useEffect above
      if (result.meta.requestStatus === 'fulfilled') {
        // Optional: show success message
      }
    } catch (error) {
      // Error is handled by Redux state
      console.error('Register error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          maxWidth: 450,
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
            {t('register.title', 'Crear Cuenta')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('register.subtitle', 'Únete a la comunidad de Japasea')}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('register.name', 'Nombre completo')}
                error={!!errors.name}
                helperText={errors.name?.message}
                margin="normal"
                autoComplete="name"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('register.email', 'Correo electrónico')}
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                margin="normal"
                autoComplete="email"
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
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('register.phone', 'Teléfono (opcional)')}
                type="tel"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                margin="normal"
                autoComplete="tel"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
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
                label={t('register.password', 'Contraseña')}
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
                autoComplete="new-password"
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

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('register.confirmPassword', 'Confirmar contraseña')}
                type={showConfirmPassword ? 'text' : 'password'}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                margin="normal"
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                {t('register.creating', 'Creando cuenta...')}
              </Box>
            ) : (
              t('register.createAccount', 'Crear Cuenta')
            )}
          </Button>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('register.hasAccount', '¿Ya tienes cuenta?')}{' '}
              <Link
                to="/login"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {t('register.signIn', 'Inicia sesión')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
