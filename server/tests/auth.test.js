const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/userModel')

describe('Authentication API', () => {
  beforeAll(async () => {
    // Conectar a una base de datos de prueba
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/japasea_test_db'
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    // Limpiar la base de datos y cerrar la conexión
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    // Limpiar usuarios antes de cada test
    await User.deleteMany({})
  })

  describe('POST /api/auth/register', () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123',
      phone: '+595987654321'
    }

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(validUser.email)
      expect(response.body.data.user.name).toBe(validUser.name)
      expect(response.body.data.accessToken).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
    })

    it('should not register user with invalid email', async () => {
      const invalidUser = { ...validUser, email: 'invalid-email' }
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should not register user with weak password', async () => {
      const weakPasswordUser = { ...validUser, password: '123' }
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(weakPasswordUser)
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should not register duplicate user', async () => {
      // Registrar usuario primero
      await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201)

      // Intentar registrar el mismo usuario otra vez
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('ya existe')
    })
  })

  describe('POST /api/auth/login', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123'
    }

    beforeEach(async () => {
      // Crear usuario para las pruebas de login
      await request(app)
        .post('/api/auth/register')
        .send(userData)
    })

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.accessToken).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
    })

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: userData.password
        })
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/auth/profile', () => {
    let authToken

    beforeEach(async () => {
      // Registrar y hacer login para obtener token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPass123'
        })

      authToken = registerResponse.body.data.accessToken
    })

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe('test@example.com')
    })

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})
