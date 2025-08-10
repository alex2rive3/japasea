import { LoginForm } from '../features/auth'

/**
 * LoginComponent - Compatibility wrapper
 * 
 * This component provides backward compatibility during the migration
 * to the new modular auth architecture.
 * 
 * @deprecated Use LoginForm from features/auth instead
 */
export function LoginComponent() {
  return <LoginForm />
}
