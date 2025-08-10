import { Box, Paper } from '@mui/material'
import { EmailVerificationBanner } from '../../../components/EmailVerificationBanner'
import { useAuth } from '../../../hooks/useAuth'
import {
  TabPanel,
  ProfileTabs,
  PersonalInfoForm,
  PasswordChangeForm,
  PreferencesPanel,
  FavoritesList,
  ActivityHistory
} from '../components'
import { useProfileTabs } from '../hooks'

export function ProfilePage() {
  const { user } = useAuth()
  const { tabValue, handleTabChange } = useProfileTabs()

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      {user && !user.isEmailVerified && (
        <Box sx={{ mb: 2 }}>
          <EmailVerificationBanner />
        </Box>
      )}

      <Paper sx={{ p: 3 }}>
        <ProfileTabs value={tabValue} onChange={handleTabChange} />

        <TabPanel value={tabValue} index={0}>
          <PersonalInfoForm />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PasswordChangeForm />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <PreferencesPanel />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <FavoritesList />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <ActivityHistory />
        </TabPanel>
      </Paper>
    </Box>
  )
}
