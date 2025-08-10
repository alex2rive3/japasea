import { Tabs, Tab } from '@mui/material'
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
  BarChart as StatsIcon,
} from '@mui/icons-material'
import type { ProfileTabsProps } from '../types'

export function ProfileTabs({ value, onChange }: ProfileTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab
        icon={<PersonIcon />}
        label="Información Personal"
        id="profile-tab-0"
        aria-controls="profile-tabpanel-0"
      />
      <Tab
        icon={<LockIcon />}
        label="Cambiar Contraseña"
        id="profile-tab-1"
        aria-controls="profile-tabpanel-1"
      />
      <Tab
        icon={<SettingsIcon />}
        label="Preferencias"
        id="profile-tab-2"
        aria-controls="profile-tabpanel-2"
      />
      <Tab
        icon={<FavoriteIcon />}
        label="Favoritos"
        id="profile-tab-3"
        aria-controls="profile-tabpanel-3"
      />
      <Tab
        icon={<StatsIcon />}
        label="Estadísticas"
        id="profile-tab-4"
        aria-controls="profile-tabpanel-4"
      />
    </Tabs>
  )
}
