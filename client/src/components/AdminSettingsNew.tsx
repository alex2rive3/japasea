import { AdminSettings } from '../features/admin-settings'
import type { AdminSettingsProps } from '../features/admin-settings'

/**
 * Componente de compatibilidad para AdminSettings
 * 
 * Este es un wrapper que mantiene la misma API que el componente original
 * AdminSettings.tsx, proporcionando una migración transparente hacia el
 * nuevo sistema modular.
 * 
 * @deprecated Usa AdminSettings de features/admin-settings directamente
 */
const AdminSettingsNew = (props: AdminSettingsProps) => {
  return <AdminSettings {...props} />
}

export default AdminSettingsNew
