import { RegisterForm } from '../features/auth/components/RegisterForm';
import { Container, Box } from '@mui/material';

export function RegisterPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <RegisterForm />
      </Box>
    </Container>
  );
}
