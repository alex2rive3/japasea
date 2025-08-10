/**
 * Test simple para verificar configuración básica
 */

describe('Simple Configuration Test', () => {
  it('DEBE ejecutar un test básico', () => {
    expect(1 + 1).toBe(2)
  })

  it('DEBE tener localStorage mockeado', () => {
    localStorage.setItem('test', 'value')
    expect(localStorage.getItem('test')).toBe('value')
  })

  it('DEBE tener variables de entorno configuradas', () => {
    expect(process.env.VITE_API_URL).toBeDefined()
    expect(process.env.USE_REAL_BACKEND).toBeDefined()
  })
})
