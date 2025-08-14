import { AdminPlacesComponent } from '../features/admin/components/AdminPlacesComponent';
import { Container, Box, Typography } from '@mui/material';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useAdmin } from '../features/admin/hooks/useAdmin';

export function AdminPage() {
  const { user } = useAuth();
  const { loading } = useAdmin();

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Cargando...</Typography>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Acceso denegado. Solo administradores pueden acceder a esta página.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panel de Administración
        </Typography>
        <AdminPlacesComponent />
      </Box>
    </Container>
  );
}
