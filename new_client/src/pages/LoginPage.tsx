import { LoginForm } from '../features/auth/components/LoginForm';
import { Container, Box } from '@mui/material';

export function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <LoginForm />
      </Box>
    </Container>
  );
}
