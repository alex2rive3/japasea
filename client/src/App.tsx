import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginComponent from './components/LoginComponent'
import { RegisterComponent } from './components/RegisterComponent'
import { ProfileComponent } from './components/ProfileComponent'
import { HomeComponent } from './components/HomeComponent'
import { ForgotPasswordComponent } from './components/ForgotPasswordComponent'
import { ResetPasswordComponent } from './components/ResetPasswordComponent'
import { VerifyEmailComponent } from './components/VerifyEmailComponent'
import { ExploreComponent } from './components/ExploreComponent'
import { FavoritesComponent } from './components/FavoritesComponent'
import { TripsComponent } from './components/TripsComponent'
import { MessagesComponent } from './components/MessagesComponent'
import { Layout } from './components/Layout'

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
        path="/explore"
        element={
          <ProtectedRoute>
            <Layout>
              <ExploreComponent />
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
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <Layout>
              <TripsComponent />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Layout>
              <MessagesComponent />
            </Layout>
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
    <AuthProvider>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
