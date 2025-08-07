import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { AuthNavbar } from './AuthNavbar'
import LoginComponent from './LoginComponent'
import { RegisterComponent } from './RegisterComponent'
import { ProfileComponent } from './ProfileComponent'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
// import { MainContent } from './MainContent'
import AdminPlacesComponent from './AdminPlacesComponent'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminStats from './admin/AdminStats'
// import { useAuth } from '../hooks/useAuth'
import { HomeRedirect } from './HomeRedirect'

interface AppRoutesProps {
  onSearch?: (query: string) => void
}

export function AppRoutes({ onSearch }: AppRoutesProps) {
  return (
    <>
      <AuthNavbar onSearch={onSearch} />
      
      {/* Espaciado para la navbar fija */}
      <Box sx={{ height: '64px' }} />
      
      <Routes>
        {/* Rutas públicas (solo accesibles si NO está autenticado) */}
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginComponent />
          </PublicOnlyRoute>
        } />
        
        <Route path="/register" element={
          <PublicOnlyRoute>
            <RegisterComponent />
          </PublicOnlyRoute>
        } />

        {/* Rutas protegidas (requieren autenticación) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileComponent />
          </ProtectedRoute>
        } />

        {/* Ruta principal */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomeRedirect />
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/places" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminPlacesComponent />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/stats" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminStats />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Ruta de fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
