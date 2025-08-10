// Temporary bridge component - ProfileComponent.tsx
// This file bridges the old component location with the new feature module
// TODO: Remove this file and update all imports to use features/profile/ProfilePage

import { ProfilePage } from '../features/profile'

export function ProfileComponent() {
  return <ProfilePage />
}

export default ProfileComponent
