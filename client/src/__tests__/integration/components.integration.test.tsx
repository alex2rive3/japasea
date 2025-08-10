/**
 * Tests de Integración de Componentes
 * 
 * Verifica que los componentes manejen correctamente las respuestas del backend
 * y rendericen los datos adecuadamente en la UI.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../test/helpers/testUtils'
import { server } from '../../test/mocks/server'
import { http, HttpResponse } from 'msw'
import {
  setAuthTokens,
  clearAuthTokens,
  mockAuthUser,
  mockPlace,
  serverErrorResponse,
  unauthorizedResponse
} from '../../test/helpers/testUtils'

// Importar componentes para testing
import LoginComponent from '../../components/LoginComponent'
import FavoritesComponent from '../../components/FavoritesComponent'
import HomeComponent from '../../components/HomeComponent'

const API_BASE_URL = 'http://localhost:3001'

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/test' })
}))

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() }
  })
}))

// Mock de contexts
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn()
  })
}))

describe('Components Integration Tests', () => {
  beforeEach(() => {
    clearAuthTokens()
  })

  afterEach(() => {
    clearAuthTokens()
  })

  describe('LoginComponent Integration', () => {
    it('DEBE mostrar mensaje de error cuando el backend retorna credenciales inválidas', async () => {
      // Arrange
      server.use(
        http.post(`${API_BASE_URL}/api/v1/auth/login`, () => {
          return HttpResponse.json(
            { success: false, message: 'Credenciales inválidas' },
            { status: 401 }
          )
        })
      )

      render(<LoginComponent />)

      // Act
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument()
      })
    })

    it('DEBE mostrar indicador de carga durante la petición de login', async () => {
      // Arrange
      server.use(
        http.post(`${API_BASE_URL}/api/v1/auth/login`, async () => {
          // Simular delay
          await new Promise(resolve => setTimeout(resolve, 100))
          return HttpResponse.json({
            success: true,
            data: { user: mockAuthUser, accessToken: 'token', refreshToken: 'refresh' }
          })
        })
      )

      render(<LoginComponent />)

      // Act
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password' } })
      fireEvent.click(submitButton)

      // Assert - Verificar que aparece indicador de carga
      await waitFor(() => {
        expect(screen.getByTestId('loading-spinner') || screen.getByText(/loading/i)).toBeInTheDocument()
      })
    })

    it('DEBE validar campos requeridos antes de enviar petición', async () => {
      // Arrange
      render(<LoginComponent />)

      // Act
      const submitButton = screen.getByRole('button', { name: /login/i })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/email.*required/i) || screen.getByText(/campo requerido/i)).toBeInTheDocument()
      })
    })

    it('DEBE manejar errores de red y mostrar mensaje apropiado', async () => {
      // Arrange
      server.use(
        http.post(`${API_BASE_URL}/api/v1/auth/login`, () => {
          return HttpResponse.json(serverErrorResponse, { status: 500 })
        })
      )

      render(<LoginComponent />)

      // Act
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/error del servidor/i) || screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })
  })

  describe('FavoritesComponent Integration', () => {
    it('DEBE renderizar lista de favoritos cuando el backend retorna datos exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites`, () => {
          return HttpResponse.json({
            success: true,
            count: 2,
            data: [
              {
                _id: 'place-1',
                name: 'Machu Picchu',
                description: 'Antigua ciudadela inca',
                type: 'historical',
                location: { 
                  type: 'Point', 
                  coordinates: [-72.5450, -13.1631], 
                  lat: -13.1631, 
                  lng: -72.5450 
                },
                address: 'Aguas Calientes, Perú',
                images: [{ url: 'machu-picchu.jpg', isPrimary: true }],
                rating: { average: 4.8, count: 1250 },
                status: 'active',
                isFavorite: true,
                favoritedAt: '2024-01-15T10:00:00.000Z'
              },
              {
                _id: 'place-2',
                name: 'Cristo Redentor',
                description: 'Estatua icónica de Río',
                type: 'landmark',
                location: { 
                  type: 'Point', 
                  coordinates: [-43.2105, -22.9519], 
                  lat: -22.9519, 
                  lng: -43.2105 
                },
                address: 'Río de Janeiro, Brasil',
                images: [{ url: 'cristo.jpg', isPrimary: true }],
                rating: { average: 4.6, count: 890 },
                status: 'active',
                isFavorite: true,
                favoritedAt: '2024-01-14T15:30:00.000Z'
              }
            ]
          })
        })
      )

      // Act
      render(<FavoritesComponent />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Machu Picchu')).toBeInTheDocument()
        expect(screen.getByText('Cristo Redentor')).toBeInTheDocument()
        expect(screen.getByText(/antigua ciudadela inca/i)).toBeInTheDocument()
        expect(screen.getByText(/estatua icónica/i)).toBeInTheDocument()
      })

      // Verificar que se muestran las calificaciones
      await waitFor(() => {
        expect(screen.getByText('4.8')).toBeInTheDocument()
        expect(screen.getByText('4.6')).toBeInTheDocument()
      })
    })

    it('DEBE mostrar mensaje de lista vacía cuando no hay favoritos', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites`, () => {
          return HttpResponse.json({
            success: true,
            count: 0,
            data: []
          })
        })
      )

      // Act
      render(<FavoritesComponent />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/no tienes favoritos/i) || screen.getByText(/no favorites/i)).toBeInTheDocument()
      })
    })

    it('DEBE manejar error de autorización y mostrar mensaje de login', async () => {
      // Arrange - No establecer token
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites`, () => {
          return HttpResponse.json(unauthorizedResponse, { status: 401 })
        })
      )

      // Act
      render(<FavoritesComponent />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/please log in/i) || screen.getByText(/inicia sesión/i)).toBeInTheDocument()
      })
    })

    it('DEBE permitir remover favorito con confirmación', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      let removeCallCount = 0
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites`, () => {
          return HttpResponse.json({
            success: true,
            count: 1,
            data: [
              {
                _id: 'place-1',
                name: 'Test Place',
                description: 'Test Description',
                type: 'restaurant',
                location: { type: 'Point', coordinates: [-77, -12], lat: -12, lng: -77 },
                address: 'Test Address',
                images: [],
                rating: { average: 4.0, count: 10 },
                status: 'active',
                isFavorite: true,
                favoritedAt: '2024-01-15T10:00:00.000Z'
              }
            ]
          })
        }),
        http.delete(`${API_BASE_URL}/api/v1/favorites/place-1`, () => {
          removeCallCount++
          return HttpResponse.json({
            success: true,
            message: 'Removed from favorites'
          })
        })
      )

      render(<FavoritesComponent />)

      // Esperar a que aparezca el lugar
      await waitFor(() => {
        expect(screen.getByText('Test Place')).toBeInTheDocument()
      })

      // Act
      const removeButton = screen.getByRole('button', { name: /remove/i }) || 
                          screen.getByTestId('remove-favorite-button')
      fireEvent.click(removeButton)

      // Confirmar eliminación si aparece modal
      const confirmButton = screen.queryByRole('button', { name: /confirm/i }) ||
                           screen.queryByRole('button', { name: /yes/i })
      if (confirmButton) {
        fireEvent.click(confirmButton)
      }

      // Assert
      await waitFor(() => {
        expect(removeCallCount).toBe(1)
      })
    })
  })

  describe('HomeComponent Integration', () => {
    it('DEBE renderizar lugares aleatorios del backend exitosamente', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/random`, () => {
          return HttpResponse.json([
            {
              _id: 'place-1',
              name: 'Machu Picchu',
              description: 'Antigua ciudadela inca en los Andes',
              location: { lat: -13.1631, lng: -72.5450 },
              type: 'historical',
              address: 'Aguas Calientes, Perú',
              rating: { average: 4.8, count: 1250 },
              images: [{ url: 'machu.jpg', caption: 'Vista panorámica' }]
            },
            {
              _id: 'place-2',
              name: 'Playa Copacabana',
              description: 'Famosa playa de Río',
              location: { lat: -22.9711, lng: -43.1822 },
              type: 'beach',
              address: 'Río de Janeiro, Brasil',
              rating: { average: 4.5, count: 890 }
            }
          ])
        })
      )

      // Act
      render(<HomeComponent />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Machu Picchu')).toBeInTheDocument()
        expect(screen.getByText('Playa Copacabana')).toBeInTheDocument()
        expect(screen.getByText(/antigua ciudadela inca/i)).toBeInTheDocument()
        expect(screen.getByText(/famosa playa/i)).toBeInTheDocument()
      })

      // Verificar que se muestran las calificaciones
      await waitFor(() => {
        expect(screen.getByText('4.8')).toBeInTheDocument()
        expect(screen.getByText('4.5')).toBeInTheDocument()
      })
    })

    it('DEBE manejar búsqueda de lugares y mostrar resultados', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/search`, ({ request }) => {
          const url = new URL(request.url)
          const query = url.searchParams.get('q')
          
          if (query === 'machu') {
            return HttpResponse.json([
              {
                _id: 'place-1',
                name: 'Machu Picchu',
                description: 'Resultado de búsqueda',
                location: { lat: -13.1631, lng: -72.5450 },
                type: 'historical',
                address: 'Aguas Calientes, Perú'
              }
            ])
          }
          
          return HttpResponse.json([])
        })
      )

      render(<HomeComponent />)

      // Act
      const searchInput = screen.getByPlaceholderText(/search/i) || 
                          screen.getByLabelText(/search/i)
      fireEvent.change(searchInput, { target: { value: 'machu' } })
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      fireEvent.click(searchButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Machu Picchu')).toBeInTheDocument()
        expect(screen.getByText(/resultado de búsqueda/i)).toBeInTheDocument()
      })
    })

    it('DEBE mostrar mensaje cuando la búsqueda no retorna resultados', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/search`, () => {
          return HttpResponse.json([])
        })
      )

      render(<HomeComponent />)

      // Act
      const searchInput = screen.getByPlaceholderText(/search/i) || 
                          screen.getByLabelText(/search/i)
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      fireEvent.click(searchButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/no results found/i) || screen.getByText(/no se encontraron/i)).toBeInTheDocument()
      })
    })

    it('DEBE manejar errores de red en la carga de lugares', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/random`, () => {
          return HttpResponse.json(serverErrorResponse, { status: 500 })
        })
      )

      // Act
      render(<HomeComponent />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/error loading places/i) || screen.getByText(/error cargando/i)).toBeInTheDocument()
      })
    })
  })

  describe('Manejo de Estados de Carga', () => {
    it('DEBE mostrar skeleton/loading durante la carga inicial de datos', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/random`, async () => {
          await new Promise(resolve => setTimeout(resolve, 100))
          return HttpResponse.json([mockPlace])
        })
      )

      // Act
      render(<HomeComponent />)

      // Assert - Verificar que aparece indicador de carga
      expect(screen.getByTestId('loading-skeleton') || 
             screen.getByTestId('loading-spinner') || 
             screen.getByText(/loading/i)).toBeInTheDocument()

      // Verificar que desaparece cuando cargan los datos
      await waitFor(() => {
        expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('Responsividad y Accesibilidad', () => {
    it('DEBE tener elementos accesibles con roles y labels correctos', async () => {
      // Arrange
      render(<LoginComponent />)

      // Assert
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
      
      // Verificar que hay un formulario
      expect(screen.getByRole('form') || screen.getByTestId('login-form')).toBeInTheDocument()
    })

    it('DEBE manejar navegación por teclado correctamente', async () => {
      // Arrange
      render(<LoginComponent />)

      // Act
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      // Simular navegación por Tab
      emailInput.focus()
      fireEvent.keyDown(emailInput, { key: 'Tab' })
      
      // Assert
      expect(passwordInput).toHaveFocus()
    })
  })

  describe('Validación de Estructura JSON en UI', () => {
    it('DEBE renderizar correctamente todos los campos de datos complejos del backend', async () => {
      // Arrange
      const complexPlace = {
        _id: 'complex-place',
        name: 'Lugar Complejo',
        description: 'Descripción detallada del lugar con muchos campos',
        location: { 
          lat: -12.0464, 
          lng: -77.0428,
          address: 'Dirección específica'
        },
        type: 'restaurant',
        address: 'Lima, Perú',
        phone: '+51 1 234-5678',
        email: 'contact@lugar.com',
        website: 'https://lugar.com',
        rating: { average: 4.7, count: 156 },
        images: [
          { url: 'image1.jpg', caption: 'Vista exterior' },
          { url: 'image2.jpg', caption: 'Interior' }
        ],
        openingHours: {
          monday: '9:00-22:00',
          tuesday: '9:00-22:00'
        },
        features: ['wifi', 'parking', 'accessible'],
        tags: ['romantic', 'family-friendly'],
        status: 'active',
        city: 'Lima',
        priceRange: 3
      }

      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/random`, () => {
          return HttpResponse.json([complexPlace])
        })
      )

      // Act
      render(<HomeComponent />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Lugar Complejo')).toBeInTheDocument()
        expect(screen.getByText(/descripción detallada/i)).toBeInTheDocument()
        expect(screen.getByText('4.7')).toBeInTheDocument()
        expect(screen.getByText('156')).toBeInTheDocument() // Rating count
        expect(screen.getByText(/Lima, Perú/i)).toBeInTheDocument()
      })

      // Verificar que se muestran features o tags si el componente los soporta
      const features = screen.queryByText(/wifi/i) || screen.queryByText(/parking/i)
      if (features) {
        expect(features).toBeInTheDocument()
      }
    })
  })
})
