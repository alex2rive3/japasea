import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  BarChart as StatsIcon,
  History as HistoryIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'
import type { UpdateProfileData, ChangePasswordData } from '../types/auth'
import { profileStyles } from '../styles'
import { favoritesService } from '../services/favoritesService'
import { EmailVerificationBanner } from './EmailVerificationBanner'
import { useTranslation } from 'react-i18next'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export function ProfileComponent() {
  const { user, updateProfile, changePassword, logout, isLoading } = useAuth()
  const { favorites, favoriteCount, removeFavorite } = useFavorites()
  const { t, i18n } = useTranslation('profile')
  
  const [tabValue, setTabValue] = useState(0)
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: user?.name || '',
    phone: user?.phone || ''
  })
  
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: ''
  })
  
  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || 'light',
    language: user?.preferences?.language || i18n.language || 'es',
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      push: user?.preferences?.notifications?.push ?? true,
      newsletter: user?.preferences?.notifications?.newsletter ?? false,
    },
    searchHistory: user?.preferences?.searchHistory ?? true,
  })
  
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [favoriteStats, setFavoriteStats] = useState<any>(null)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone || ''
      })
      
      setPreferences({
        theme: user.preferences?.theme || 'light',
        language: user.preferences?.language || i18n.language || 'es',
        notifications: {
          email: user.preferences?.notifications?.email ?? true,
          push: user.preferences?.notifications?.push ?? true,
          newsletter: user.preferences?.notifications?.newsletter ?? false,
        },
        searchHistory: user.preferences?.searchHistory ?? true,
      })
    }
  }, [user, i18n.language])

  // Sincronizar el estado de idioma con i18n cuando cambie
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      language: i18n.language
    }))
  }, [i18n.language])

  useEffect(() => {
    // Cargar estadísticas de favoritos
    if (user) {
      favoritesService.getFavoriteStats()
        .then(response => {
          if (response.success) {
            setFavoriteStats(response.data)
          }
        })
        .catch(console.error)
    }
  }, [user])

  const handleProfileChange = (field: keyof UpdateProfileData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData(prev => ({
        ...prev,
        [field]: event.target.value
      }))
      if (message || error) {
        setMessage('')
        setError('')
      }
    }

  const handlePasswordChange = (field: keyof ChangePasswordData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData(prev => ({
        ...prev,
        [field]: event.target.value
      }))
    }

  const handleUpdateProfile = async () => {
    if (!profileData.name?.trim()) {
      setError(t('messages.nameRequired'))
      return
    }

    try {
      setIsUpdating(true)
      setError('')
      await updateProfile(profileData)
      setMessage(t('messages.profileUpdated'))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('messages.updateError')
      setError(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handlePreferenceChange = (pref: string) => (event: any) => {
    const value = event.target.checked ?? event.target.value
    
    // Si se cambia el idioma, también cambiarlo en i18n inmediatamente
    if (pref === 'language') {
      i18n.changeLanguage(value)
    }
    
    if (pref.includes('.')) {
      const [parent, child] = pref.split('.')
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setPreferences(prev => ({
        ...prev,
        [pref]: value
      }))
    }
  }

  const handleSavePreferences = async () => {
    try {
      setIsUpdating(true)
      // Aquí iría la llamada a la API para guardar preferencias
      await updateProfile({ preferences } as any)
      setMessage(t('messages.preferencesUpdated'))
    } catch (error) {
      setError(t('messages.preferencesError'))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteSearchHistory = async () => {
    try {
      // Aquí iría la llamada para eliminar el historial
      setMessage(t('messages.historyDeleted'))
    } catch (error) {
      setError(t('messages.historyError'))
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError(t('messages.passwordFieldsRequired'))
      return
    }

    if (passwordData.newPassword !== confirmPassword) {
      setError(t('messages.passwordMismatch'))
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError(t('messages.passwordMinLength'))
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    if (!passwordRegex.test(passwordData.newPassword)) {
      setError(t('messages.passwordComplexity'))
      return
    }

    try {
      setIsChangingPassword(true)
      setError('')
      await changePassword(passwordData)
      setMessage(t('messages.passwordChanged'))
      setPasswordData({ currentPassword: '', newPassword: '' })
      setConfirmPassword('')
      setShowPasswordDialog(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('messages.passwordError')
      setError(errorMessage)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error durante logout:', error)
    }
  }

  if (!user) {
    return (
      <Box sx={profileStyles.container}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={profileStyles.paper}>
      <Paper elevation={3} sx={profileStyles.card}>
        <Box sx={profileStyles.header}>
          <Typography variant="h4" component="h1" sx={profileStyles.title}>
            {t('title')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Chip
              label={user.role === 'admin' ? t('role.admin') : t('role.user')}
              color={user.role === 'admin' ? 'secondary' : 'primary'}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {t('memberSince', { date: new Date(user.createdAt).toLocaleDateString() })}
            </Typography>
          </Box>
        </Box>

        <EmailVerificationBanner />

        {(message || error) && (
          <Alert 
            severity={message ? 'success' : 'error'} 
            sx={{ mb: 3 }}
            onClose={() => {
              setMessage('')
              setError('')
            }}
          >
            {message || error}
          </Alert>
        )}

        {/* Tabs de navegación */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab icon={<PersonIcon />} label={t('tabs.information')} />
            <Tab icon={<FavoriteIcon />} label={t('tabs.favorites', { count: favoriteCount })} />
            <Tab icon={<SettingsIcon />} label={t('tabs.preferences')} />
            <Tab icon={<StatsIcon />} label={t('tabs.statistics')} />
          </Tabs>
        </Box>

        {/* Tab 1: Información Personal */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              {t('personalInfo.title')}
            </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label={t('personalInfo.nameLabel')}
              value={profileData.name}
              onChange={handleProfileChange('name')}
              disabled={isUpdating}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <TextField
              fullWidth
              label={t('personalInfo.emailLabel')}
              value={user.email}
              disabled
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText={t('personalInfo.emailHelper')}
            />

            <TextField
              fullWidth
              label={t('personalInfo.phoneLabel')}
              value={profileData.phone}
              onChange={handleProfileChange('phone')}
              disabled={isUpdating}
              placeholder={t('personalInfo.phonePlaceholder')}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={isUpdating || isLoading}
              startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {isUpdating ? t('personalInfo.saving') : t('personalInfo.saveChanges')}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Acciones de Seguridad */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon color="primary" />
                          {t('security.title')}
            </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowPasswordDialog(true)}
              startIcon={<LockIcon />}
            >
              {t('security.changePassword')}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              {t('security.logout')}
            </Button>
          </Box>
        </Box>
        </TabPanel>

        {/* Tab 2: Favoritos */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FavoriteIcon color="primary" />
              {t('favorites.title')}
            </Typography>
            
            {favorites.length === 0 ? (
              <Typography color="text.secondary">
                {t('favorites.empty')}
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {favorites.slice(0, 6).map((favorite) => (
                  <Grid item xs={12} sm={6} md={4} key={favorite._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {favorite.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {favorite.type} • {favorite.address}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {t('favorites.addedOn', { date: new Date(favorite.favoritedAt).toLocaleDateString() })}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => removeFavorite(favorite._id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {favorites.length > 6 && (
              <Button sx={{ mt: 2 }}>
                {t('favorites.viewAll', { count: favorites.length })}
              </Button>
            )}
          </Box>
        </TabPanel>

        {/* Tab 3: Preferencias */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon color="primary" />
              {t('preferences.title')}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('preferences.language')}</InputLabel>
                  <Select
                    value={preferences.language}
                    onChange={handlePreferenceChange('language')}
                    label={t('preferences.language')}
                    startAdornment={<LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="pt">Português</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('preferences.theme')}</InputLabel>
                  <Select
                    value={preferences.theme}
                    onChange={handlePreferenceChange('theme')}
                    label={t('preferences.theme')}
                    startAdornment={<PaletteIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="light">{t('preferences.themeOptions.light')}</MenuItem>
                    <MenuItem value="dark">{t('preferences.themeOptions.dark')}</MenuItem>
                    <MenuItem value="auto">{t('preferences.themeOptions.auto')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon />
                  {t('preferences.notifications.title')}
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={preferences.notifications.email}
                        onChange={handlePreferenceChange('notifications.email')}
                      />
                    }
                    label={t('preferences.notifications.email')}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={preferences.notifications.push}
                        onChange={handlePreferenceChange('notifications.push')}
                      />
                    }
                    label={t('preferences.notifications.push')}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={preferences.notifications.newsletter}
                        onChange={handlePreferenceChange('notifications.newsletter')}
                      />
                    }
                    label={t('preferences.notifications.newsletter')}
                  />
                </FormGroup>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon />
                  {t('preferences.privacy.title')}
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={preferences.searchHistory}
                        onChange={handlePreferenceChange('searchHistory')}
                      />
                    }
                    label={t('preferences.privacy.searchHistory')}
                  />
                </FormGroup>
                {preferences.searchHistory && user?.searchHistory?.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={handleDeleteSearchHistory}
                    startIcon={<DeleteIcon />}
                  >
                    {t('preferences.privacy.deleteHistory', { count: user.searchHistory.length })}
                  </Button>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSavePreferences}
                  disabled={isUpdating}
                  startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {isUpdating ? t('preferences.saving') : t('preferences.savePreferences')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Tab 4: Estadísticas */}
        <TabPanel value={tabValue} index={3}>
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <StatsIcon color="primary" />
              {t('statistics.title')}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {t('statistics.favoritePlaces')}
                    </Typography>
                    <Typography variant="h4">
                      <Badge badgeContent={favoriteCount} color="primary">
                        <FavoriteIcon />
                      </Badge>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {favoriteStats && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          {t('statistics.favoriteType')}
                        </Typography>
                        <Typography variant="h6">
                          {Object.entries(favoriteStats.byType)
                            .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          {t('statistics.searchesMade')}
                        </Typography>
                        <Typography variant="h4">
                          {user?.searchHistory?.length || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          {t('statistics.memberSince')}
                        </Typography>
                        <Typography variant="h6">
                          {t('statistics.memberDays', { days: Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) })}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              )}
              
              {user?.searchHistory && user.searchHistory.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Búsquedas Recientes
                  </Typography>
                  <List>
                    {user.searchHistory.slice(-5).reverse().map((search, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <SearchIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={search.query}
                          secondary={`${new Date(search.searchedAt).toLocaleDateString()} - ${search.resultsCount} resultados`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Dialog para cambiar contraseña */}
      <Dialog 
        open={showPasswordDialog} 
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Contraseña actual"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
              disabled={isChangingPassword}
            />

            <TextField
              fullWidth
              type="password"
              label="Nueva contraseña"
              value={passwordData.newPassword}
              onChange={handlePasswordChange('newPassword')}
              disabled={isChangingPassword}
              helperText="Mínimo 6 caracteres con mayúscula, minúscula y número"
            />

            <TextField
              fullWidth
              type="password"
              label="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isChangingPassword}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowPasswordDialog(false)}
            disabled={isChangingPassword}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained"
            disabled={isChangingPassword}
            startIcon={isChangingPassword ? <CircularProgress size={20} /> : undefined}
          >
            {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
