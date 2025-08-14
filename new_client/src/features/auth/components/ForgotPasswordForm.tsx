import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useAppTranslation } from '@/shared/hooks';
import { forgotPasswordSchema } from '../validation/schemas';

interface ForgotPasswordFormData {
  email: string;
}

export const ForgotPasswordForm = () => {
  const { forgotPassword, loading, error, clearAuthError } = useAuth();
  const { t } = useAppTranslation('auth');
  
  const [success, setSuccess] = useState(false);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      clearAuthError();
      setSuccess(false);
      
      const result = await forgotPassword({ email: data.email });
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSuccess(true);
      }
    } catch (error) {
      // Error is handled by Redux state
      console.error('Forgot password error:', error);
    }
  };

  if (success) {
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
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'success.main',
              mb: 2,
            }}
          >
            {t('forgotPassword.emailSent', '¡Correo enviado!')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('forgotPassword.checkEmail', 'Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.')}
          </Typography>

          <Button
            component={Link}
            to="/login"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            fullWidth
          >
            {t('forgotPassword.backToLogin', 'Volver al inicio de sesión')}
          </Button>
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
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
            }}
          >
            {t('forgotPassword.title', 'Recuperar Contraseña')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('forgotPassword.subtitle', 'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña')}
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
                label={t('forgotPassword.email', 'Correo electrónico')}
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
                {t('forgotPassword.sending', 'Enviando...')}
              </Box>
            ) : (
              t('forgotPassword.sendEmail', 'Enviar Correo')
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="text"
              startIcon={<ArrowBackIcon />}
            >
              {t('forgotPassword.backToLogin', 'Volver al inicio de sesión')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
