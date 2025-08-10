import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, createTheme } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext'
import { LocaleProvider } from './contexts/LocaleContext'
import './i18n' // Initialize i18n
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginComponent from './components/LoginComponent'
import { RegisterComponent } from './components/RegisterComponent'
import { ProfileComponent } from './components/ProfileComponent'
import { HomeComponent } from './components/HomeComponent'
import { ForgotPasswordComponent } from './components/ForgotPasswordComponent'
import { ResetPasswordComponent } from './components/ResetPasswordComponent'
import { VerifyEmailComponent } from './components/VerifyEmailComponent'
import { FavoritesComponent } from './components/FavoritesComponent'
import { Layout } from './components/Layout'
import AdminPlacesComponent from './components/AdminPlacesComponent'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminStats from './components/admin/AdminStats'
import AdminUsers from './components/admin/AdminUsers'
import AdminReviews from './components/admin/AdminReviews'
import AdminAudit from './components/admin/AdminAudit'
import AdminSettings from './components/admin/AdminSettings'
import LandingPage from './components/LandingPage'

// Base theme configuration
const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// Componente interno para manejar la navegación
function AppContent() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/register" element={<RegisterComponent />} />
      <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
      <Route path="/reset-password" element={<ResetPasswordComponent />} />
      <Route path="/verify-email" element={<VerifyEmailComponent />} />
      <Route path="/landing" element={<LandingPage />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <HomeComponent />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfileComponent />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Layout>
              <FavoritesComponent />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/places"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminPlacesComponent />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stats"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminStats />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminReviews />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminAudit />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <LocaleProvider baseTheme={baseTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LocaleProvider>
  )
}

export default App
