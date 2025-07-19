import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginComponent from './components/LoginComponent'
import { RegisterComponent } from './components/RegisterComponent'
import { ProfileComponent } from './components/ProfileComponent'
import { HomeComponent } from './components/HomeComponent'
import { Layout } from './components/Layout'
import { theme } from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />
            
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
                  <ProfileComponent />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
