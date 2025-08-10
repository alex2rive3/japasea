import { AppLayout } from '../shared/components'
import type { LayoutProps } from '../shared/types/layout.types'

/**
 * Componente de compatibilidad para Layout
 * 
 * Este es un wrapper que mantiene la misma API que el componente original
 * Layout.tsx, proporcionando una migración transparente hacia el
 * nuevo sistema modular de shared/components/layout.
 * 
 * @deprecated Usa AppLayout de shared/components directamente
 */
const LayoutNew = (props: LayoutProps) => {
  return <AppLayout {...props} />
}

// Mantener la exportación nombrada para compatibilidad
export { LayoutNew as Layout }
export default LayoutNew
