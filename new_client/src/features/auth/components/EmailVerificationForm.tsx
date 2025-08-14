import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useAppTranslation } from '@/shared/hooks';

export const EmailVerificationForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerification, loading, error, clearAuthError } = useAuth();
  const { t } = useAppTranslation('auth');
  
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleVerification = useCallback(async () => {
    if (!token) return;

    try {
      clearAuthError();
      const result = await verifyEmail({ token });
      
      if (result.meta.requestStatus === 'fulfilled') {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      setVerificationStatus('error');
      console.error('Email verification error:', error);
    }
  }, [token, verifyEmail, clearAuthError]);

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setVerificationStatus('error');
    }
  }, [token, handleVerification]);

  const handleResendVerification = async () => {
    if (!email) {
      // If no email in URL, redirect to login
      navigate('/login');
      return;
    }

    try {
      setIsResending(true);
      clearAuthError();
      
      const result = await resendVerification({ email });
      
      if (result.meta.requestStatus === 'fulfilled') {
        // Show success message
      }
    } catch (error) {
      console.error('Resend verification error:', error);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    if (verificationStatus === 'pending' || loading) {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {t('emailVerification.verifying', 'Verificando tu correo...')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('emailVerification.pleaseWait', 'Por favor espera mientras verificamos tu cuenta.')}
          </Typography>
        </Box>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main', mb: 2 }}>
            {t('emailVerification.success', '¡Correo verificado!')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('emailVerification.successMessage', 'Tu cuenta ha sido verificada exitosamente. Serás redirigido en unos segundos.')}
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
          >
            {t('emailVerification.goToHome', 'Ir al inicio')}
          </Button>
        </Box>
      );
    }

    // Error state
    return (
      <Box sx={{ textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main', mb: 2 }}>
          {t('emailVerification.error', 'Error de verificación')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {error || t('emailVerification.errorMessage', 'El enlace de verificación es inválido o ha expirado.')}
        </Typography>
        
        {email && (
          <Box sx={{ mb: 3 }}>
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              variant="outlined"
              startIcon={isResending ? <CircularProgress size={20} /> : <EmailIcon />}
              sx={{ mb: 2 }}
            >
              {isResending 
                ? t('emailVerification.resending', 'Reenviando...') 
                : t('emailVerification.resendEmail', 'Reenviar correo de verificación')
              }
            </Button>
          </Box>
        )}
        
        <Button
          component={Link}
          to="/login"
          variant="text"
        >
          {t('emailVerification.backToLogin', 'Volver al inicio de sesión')}
        </Button>
      </Box>
    );
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
          maxWidth: 500,
          p: 4,
          borderRadius: 2,
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
};
