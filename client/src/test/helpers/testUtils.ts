import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

// Componente wrapper que incluye providers necesarios para los tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

// Custom render que incluye todos los providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-exportar todo desde testing library
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Helpers para testing de APIs
export const mockAuthUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'user@test.com',
  role: 'user' as const,
  isEmailVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z'
}

export const mockAdminUser = {
  id: 'admin-123',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'admin' as const,
  isEmailVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z'
}

export const mockPlace = {
  _id: 'place-1',
  name: 'Machu Picchu',
  description: 'Antigua ciudadela inca en los Andes peruanos',
  location: { lat: -13.1631, lng: -72.5450, address: 'Aguas Calientes, Perú' },
  type: 'historical',
  address: 'Aguas Calientes, Perú',
  rating: { average: 4.8, count: 1250 },
  images: [{ url: 'machu-picchu.jpg', caption: 'Vista panorámica' }],
  status: 'active'
}

// Helper para simular tokens JWT
export const createMockToken = (payload: any) => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify({ ...payload, exp: Date.now() / 1000 + 3600 }))
  const signature = 'mock-signature'
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Helper para configurar localStorage con datos de auth
export const setAuthTokens = (accessToken?: string, refreshToken?: string) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken)
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

// Helper para limpiar localStorage
export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

// Helper para verificar estructura de respuesta de API
export const expectApiResponse = (response: any, expectedKeys: string[]) => {
  expect(typeof response).toBe('object')
  expectedKeys.forEach(key => {
    expect(response).toHaveProperty(key)
  })
}

// Helper para verificar estructura de usuario
export const expectUserStructure = (user: any) => {
  expectApiResponse(user, ['id', 'name', 'email', 'role', 'isEmailVerified', 'createdAt'])
  expect(typeof user.id).toBe('string')
  expect(typeof user.name).toBe('string')
  expect(typeof user.email).toBe('string')
  expect(['user', 'admin'].includes(user.role)).toBe(true)
  expect(typeof user.isEmailVerified).toBe('boolean')
  expect(typeof user.createdAt).toBe('string')
}

// Helper para verificar estructura de lugar
export const expectPlaceStructure = (place: any) => {
  expectApiResponse(place, ['_id', 'name', 'description', 'location', 'address'])
  expect(typeof place._id).toBe('string')
  expect(typeof place.name).toBe('string')
  expect(typeof place.description).toBe('string')
  expect(typeof place.location).toBe('object')
  expect(typeof place.location.lat).toBe('number')
  expect(typeof place.location.lng).toBe('number')
  expect(typeof place.address).toBe('string')
}

// Helper para simular delay en peticiones
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper para crear datos de formulario válidos
export const createValidRegisterData = () => ({
  name: 'Test User',
  email: 'newuser@test.com',
  password: 'password123',
  phone: '+1234567890'
})

export const createValidLoginData = () => ({
  email: 'user@test.com',
  password: 'password'
})

// Helper para errores de red
export const networkErrorResponse = {
  success: false,
  message: 'Error de red'
}

// Helper para respuestas de error comunes
export const unauthorizedResponse = {
  success: false,
  message: 'No autorizado'
}

export const forbiddenResponse = {
  success: false,
  message: 'Acceso denegado'
}

export const notFoundResponse = {
  success: false,
  message: 'Recurso no encontrado'
}

export const serverErrorResponse = {
  success: false,
  message: 'Error interno del servidor'
}
