import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Box, CircularProgress } from '@mui/material';

// Store
import { store, persistor } from './app/store';

// Layout and routing components
import { Layout } from './shared/components/layout/Layout';
import { ProtectedRoute, PublicOnlyRoute } from './shared/components/routing/ProtectedRoute';

// Pages
import { 
  HomePage, 
  LandingPage, 
  LoginPage, 
  RegisterPage, 
  AdminPage,
  PlacesPage 
} from './pages';

// Theme configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Loading component
const Loading = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/landing" element={<LandingPage />} />
              
              {/* Auth routes - only for unauthenticated users */}
              <Route path="/login" element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              } />
              <Route path="/register" element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              } />

              {/* Protected routes with layout */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/places" element={<PlacesPage />} />
                      <Route path="/admin" element={
                        <ProtectedRoute requireAdmin>
                          <AdminPage />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
