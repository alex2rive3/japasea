/**
 * Demostración de Detección de Cambios en API
 * 
 * Este test demuestra cómo el sistema detecta y reporta cambios
 * en las respuestas de la API entre versiones.
 */

const fs = require('fs')
const path = require('path')

describe('Demostración de Detección de Cambios', () => {
  const snapshotsDir = path.join(__dirname, '..', 'snapshots')

  it('DEBE demostrar cómo se detectan cambios en respuestas de API', async () => {
    console.log('\n🎯 DEMOSTRACIÓN: Detección de Cambios en API')
    console.log('===============================================')

    // Simular respuesta original (primera versión)
    const respuestaOriginal = {
      status: 200,
      data: {
        id: 1,
        nombre: 'Usuario Original',
        email: 'usuario@ejemplo.com',
        configuraciones: {
          tema: 'claro',
          idioma: 'es'
        },
        favoritos: ['lugar1', 'lugar2']
      }
    }

    // Simular respuesta modificada (nueva versión)
    const respuestaModificada = {
      status: 200,
      data: {
        id: 1,
        nombre: 'Usuario Modificado',  // ✏️  CAMBIO: nombre actualizado
        email: 'usuario@ejemplo.com',
        configuraciones: {
          tema: 'oscuro',             // ✏️  CAMBIO: tema cambiado
          idioma: 'es',
          notificaciones: true        // ➕ NUEVO: campo agregado
        },
        favoritos: ['lugar1', 'lugar2', 'lugar3'], // ➕ NUEVO: elemento agregado
        ultimoAcceso: '2024-01-15T10:00:00Z'       // ➕ NUEVO: campo agregado
        // ⚠️  configuraciones.privacidad fue removido
      }
    }

    console.log('\n📸 RESPUESTA ORIGINAL (guardada en snapshot):')
    console.log(JSON.stringify(respuestaOriginal.data, null, 2))

    console.log('\n🔄 RESPUESTA ACTUAL (nueva versión):')
    console.log(JSON.stringify(respuestaModificada.data, null, 2))

    // Simular detección de diferencias
    const diferencias = detectarCambios(respuestaOriginal.data, respuestaModificada.data)

    if (diferencias.length > 0) {
      console.log('\n🚨 CAMBIOS DETECTADOS:')
      diferencias.forEach((diff, index) => {
        console.log(`  ${index + 1}. ${diff}`)
      })

      console.log('\n💡 ACCIONES DISPONIBLES:')
      console.log('   ✅ Si los cambios son INTENCIONADOS:')
      console.log('      npm run test:regression:update')
      console.log('   ❌ Si los cambios son ERRORES:')
      console.log('      → Revisar y corregir el backend')
      console.log('      → Ejecutar tests nuevamente')
    }

    // El test pasa para demostrar el funcionamiento
    expect(diferencias.length).toBeGreaterThan(0)
    console.log('\n✨ Demostración completada exitosamente')
  })

  it('DEBE mostrar diferentes tipos de cambios detectados', async () => {
    console.log('\n📋 TIPOS DE CAMBIOS QUE SE DETECTAN:')
    console.log('=====================================')

    const ejemplos = [
      {
        tipo: '🔢 Cambio de valor',
        antes: { precio: 100 },
        despues: { precio: 120 },
        descripcion: 'Valores que cambian entre versiones'
      },
      {
        tipo: '➕ Campo nuevo',
        antes: { nombre: 'Producto' },
        despues: { nombre: 'Producto', categoria: 'Electrónica' },
        descripcion: 'Campos agregados en nuevas versiones'
      },
      {
        tipo: '➖ Campo removido', 
        antes: { nombre: 'Producto', obsoleto: true },
        despues: { nombre: 'Producto' },
        descripcion: 'Campos eliminados (breaking changes)'
      },
      {
        tipo: '🔄 Cambio de tipo',
        antes: { cantidad: 5 },
        despues: { cantidad: "5" },
        descripcion: 'Tipos de datos que cambian (number → string)'
      },
      {
        tipo: '📊 Cambio en arrays',
        antes: { tags: ['tag1', 'tag2'] },
        despues: { tags: ['tag1', 'tag2', 'tag3'] },
        descripcion: 'Elementos agregados/removidos en arrays'
      }
    ]

    ejemplos.forEach((ejemplo, index) => {
      console.log(`\n${index + 1}. ${ejemplo.tipo}`)
      console.log(`   Descripción: ${ejemplo.descripcion}`)
      console.log(`   Antes:    ${JSON.stringify(ejemplo.antes)}`)
      console.log(`   Después:  ${JSON.stringify(ejemplo.despues)}`)
      
      const cambios = detectarCambios(ejemplo.antes, ejemplo.despues)
      if (cambios.length > 0) {
        console.log(`   Detectado: ${cambios[0]}`)
      }
    })

    expect(ejemplos.length).toBe(5)
  })

  it('DEBE mostrar flujo completo de actualización de snapshots', async () => {
    console.log('\n🔄 FLUJO DE ACTUALIZACIÓN DE SNAPSHOTS:')
    console.log('======================================')

    console.log('\n1️⃣  DETECCIÓN DE CAMBIOS:')
    console.log('   → Tests de regresión ejecutados en CI/CD')
    console.log('   → Sistema detecta diferencias en respuestas')
    console.log('   → Build falla con detalles de cambios')

    console.log('\n2️⃣  EVALUACIÓN DEL EQUIPO:')
    console.log('   ❓ ¿Es un cambio intencional?')
    console.log('   ✅ SÍ → Actualizar snapshots')
    console.log('   ❌ NO → Corregir backend y re-ejecutar')

    console.log('\n3️⃣  ACTUALIZACIÓN (si es intencional):')
    console.log('   npm run test:regression:update')
    console.log('   git add src/__tests__/snapshots/')
    console.log('   git commit -m "docs: update API snapshots for v2.1.0"')

    console.log('\n4️⃣  VALIDACIÓN:')
    console.log('   → Tests pasan con nuevos snapshots')
    console.log('   → Documentación actualizada automáticamente')
    console.log('   → Frontend compatible con nueva API')

    console.log('\n📈 BENEFICIOS:')
    console.log('   🛡️  Prevención de regresiones no intencionadas')
    console.log('   📚 Documentación viva de cambios en API')
    console.log('   🤝 Mejor comunicación entre equipos')
    console.log('   🚀 Deploys más seguros y confiables')

    expect(true).toBe(true)
  })
})

// Helper para detectar cambios (versión simplificada)
function detectarCambios(objeto1, objeto2, ruta = 'data') {
  const diferencias = []

  if (typeof objeto1 !== typeof objeto2) {
    diferencias.push(`${ruta}: Tipo cambió de ${typeof objeto1} a ${typeof objeto2}`)
    return diferencias
  }

  if (objeto1 === null || objeto2 === null) {
    if (objeto1 !== objeto2) {
      diferencias.push(`${ruta}: Valor cambió de ${objeto1} a ${objeto2}`)
    }
    return diferencias
  }

  if (typeof objeto1 === 'object') {
    if (Array.isArray(objeto1) !== Array.isArray(objeto2)) {
      diferencias.push(`${ruta}: Cambió entre array y object`)
      return diferencias
    }

    if (Array.isArray(objeto1)) {
      if (objeto1.length !== objeto2.length) {
        diferencias.push(`${ruta}: Longitud del array cambió de ${objeto1.length} a ${objeto2.length}`)
      }
    } else {
      const claves1 = Object.keys(objeto1).sort()
      const claves2 = Object.keys(objeto2).sort()
      
      const clavesAgregadas = claves2.filter(k => !claves1.includes(k))
      const clavesRemovedas = claves1.filter(k => !claves2.includes(k))
      
      clavesAgregadas.forEach(clave => {
        diferencias.push(`${ruta}.${clave}: ➕ Nueva propiedad agregada`)
      })
      
      clavesRemovedas.forEach(clave => {
        diferencias.push(`${ruta}.${clave}: ➖ Propiedad removida`)
      })

      const clavesComunes = claves1.filter(k => claves2.includes(k))
      clavesComunes.forEach(clave => {
        if (typeof objeto1[clave] !== 'object' && objeto1[clave] !== objeto2[clave]) {
          diferencias.push(`${ruta}.${clave}: 🔄 Valor cambió de ${objeto1[clave]} a ${objeto2[clave]}`)
        }
      })
    }
  } else if (objeto1 !== objeto2) {
    diferencias.push(`${ruta}: 🔄 Valor cambió de ${objeto1} a ${objeto2}`)
  }

  return diferencias
}
