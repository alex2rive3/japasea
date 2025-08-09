/**
 * Servicio de Email
 * En desarrollo, simula el envío de emails mostrándolos en consola
 * En producción, usar nodemailer o servicio similar
 */

const config = require('../config/config')

class EmailService {
  constructor() {
    this.isProduction = config.NODE_ENV === 'production'
    this.from = config.EMAIL_FROM || 'noreply@japasea.com'
  }

  /**
   * Simula el envío de email (en desarrollo lo muestra en consola)
   */
  async sendEmail(options) {
    const { to, subject, html, text } = options

    if (this.isProduction) {
      // En producción aquí iría la integración con nodemailer
      console.log('📧 Email enviado a:', to)
      console.log('📧 Asunto:', subject)
      return { success: true, messageId: 'simulated-' + Date.now() }
    }

    // En desarrollo, mostrar el email en consola
    console.log('\n' + '='.repeat(60))
    console.log('📧 EMAIL SIMULADO (Modo Desarrollo)')
    console.log('='.repeat(60))
    console.log('De:', this.from)
    console.log('Para:', to)
    console.log('Asunto:', subject)
    console.log('-'.repeat(60))
    console.log('Contenido:')
    console.log(text || this.htmlToText(html))
    console.log('='.repeat(60) + '\n')

    return { success: true, messageId: 'dev-' + Date.now() }
  }

  /**
   * Envía email de recuperación de contraseña
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${config.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2196F3;">Recuperación de Contraseña</h1>
        <p>Hola ${user.name},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña en Japasea.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #2196F3; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Restablecer Contraseña
          </a>
        </div>
        <p>O copia y pega este enlace en tu navegador:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>Este enlace expirará en 1 hora.</strong></p>
        <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Este es un email automático, por favor no respondas a este mensaje.
        </p>
      </div>
    `

    const text = `
Recuperación de Contraseña - Japasea

Hola ${user.name},

Recibimos una solicitud para restablecer tu contraseña en Japasea.

Copia y pega este enlace en tu navegador para crear una nueva contraseña:
${resetUrl}

Este enlace expirará en 1 hora.

Si no solicitaste este cambio, puedes ignorar este email.

Saludos,
El equipo de Japasea
    `

    return this.sendEmail({
      to: user.email,
      subject: 'Recuperación de Contraseña - Japasea',
      html,
      text
    })
  }

  /**
   * Envía email de verificación
   */
  async sendVerificationEmail(user, verificationToken) {
    const verifyUrl = `${config.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2196F3;">¡Bienvenido a Japasea!</h1>
        <p>Hola ${user.name},</p>
        <p>Gracias por registrarte en Japasea. Para completar tu registro, por favor verifica tu email.</p>
        <div style="margin: 30px 0;">
          <a href="${verifyUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verificar Email
          </a>
        </div>
        <p>O copia y pega este enlace en tu navegador:</p>
        <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Este es un email automático, por favor no respondas a este mensaje.
        </p>
      </div>
    `

    const text = `
¡Bienvenido a Japasea!

Hola ${user.name},

Gracias por registrarte en Japasea. Para completar tu registro, por favor verifica tu email.

Copia y pega este enlace en tu navegador:
${verifyUrl}

Saludos,
El equipo de Japasea
    `

    return this.sendEmail({
      to: user.email,
      subject: 'Verifica tu email - Japasea',
      html,
      text
    })
  }

  /**
   * Envía email de bienvenida
   */
  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2196F3;">¡Bienvenido a Japasea!</h1>
        <p>Hola ${user.name},</p>
        <p>Tu cuenta ha sido verificada exitosamente. Ahora puedes disfrutar de todas las funciones de Japasea:</p>
        <ul>
          <li>🗺️ Explora lugares increíbles en Encarnación</li>
          <li>🤖 Chatea con nuestro asistente IA para recomendaciones personalizadas</li>
          <li>❤️ Guarda tus lugares favoritos</li>
          <li>📱 Instala nuestra app para usarla sin conexión</li>
        </ul>
        <div style="margin: 30px 0;">
          <a href="${config.CLIENT_URL || 'http://localhost:5173'}" 
             style="background-color: #2196F3; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Comenzar a Explorar
          </a>
        </div>
        <p>¿Tienes preguntas? No dudes en contactarnos.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Síguenos en nuestras redes sociales para las últimas novedades.
        </p>
      </div>
    `

    return this.sendEmail({
      to: user.email,
      subject: '¡Bienvenido a Japasea!',
      html
    })
  }

  /**
   * Convierte HTML básico a texto plano
   */
  htmlToText(html) {
    if (!html) return ''
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
}

// Exportar instancia singleton
module.exports = new EmailService()