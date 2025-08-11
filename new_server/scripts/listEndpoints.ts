import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { VersioningType } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from '../src/app.module'

async function listRoutes() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false })

  app.setGlobalPrefix('api')
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })

  await app.init()

  const httpServer: any = app.getHttpServer()
  const router = httpServer._events?.request?._router || app.getHttpAdapter().getInstance()?._router

  if (!router || !router.stack) {
    console.log('No se encontraron rutas registradas')
    await app.close()
    process.exit(0)
    return
  }

  const routes: Array<{ method: string; path: string }> = []

  const collect = (stack: any[]) => {
    for (const layer of stack) {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods || {})
          .filter((m) => layer.route.methods[m])
          .map((m) => m.toUpperCase())
        methods.forEach((method) => routes.push({ method, path: layer.route.path }))
      } else if (layer.name === 'router' && layer.handle?.stack) {
        collect(layer.handle.stack)
      }
    }
  }

  collect(router.stack)

  const unique = Array.from(new Set(routes.map((r) => `${r.method} ${r.path}`)))
    .sort((a, b) => a.localeCompare(b))

  console.log('\n📚 Endpoints registrados:')
  unique.forEach((line) => console.log(line))

  await app.close()
  process.exit(0)
}

listRoutes().catch(async (err) => {
  console.error('Error listando endpoints:', err)
  process.exit(1)
})
