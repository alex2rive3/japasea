import { RegisterForm } from '../features/auth'

/**
 * RegisterComponent - Compatibility wrapper
 * 
 * This component provides backward compatibility during the migration
 * to the new modular auth architecture.
 * 
 * @deprecated Use RegisterForm from features/auth instead
 */
export function RegisterComponent() {
  return <RegisterForm />
}
