import { Component, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { RefreshOutlined, ErrorOutlineOutlined } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="200px"
          p={3}
        >
          <ErrorOutlineOutlined sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            ¡Oops! Algo salió mal
          </Typography>
          
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
          </Typography>

          {import.meta.env.DEV && this.state.error && (
            <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
              <Typography variant="caption" component="pre">
                {this.state.error.message}
              </Typography>
            </Alert>
          )}
          
          <Button
            variant="contained"
            startIcon={<RefreshOutlined />}
            onClick={this.handleReset}
          >
            Intentar de nuevo
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
