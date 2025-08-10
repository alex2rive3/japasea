// Mock del localStorage para las pruebas
const mockLocalStorage = (() => {
  let store = {}

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Mock de variables de entorno
process.env.VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:3001'
process.env.VITE_API_VERSION = process.env.VITE_API_VERSION || 'v1'
process.env.USE_REAL_BACKEND = process.env.USE_REAL_BACKEND || 'false'

// Limpiar después de cada test
afterEach(() => {
  localStorage.clear()
})

// Suprimir warnings específicos de testing
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: React.createFactory() is deprecated'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
