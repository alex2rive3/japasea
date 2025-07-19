import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { 
  authStyles, 
  profileStyles, 
  fieldVariants, 
  buttonVariants, 
  cardVariants,
  quickStyles,
  layoutStyles,
  contentStyles,
  formStyles
} from '../styles';

/**
 * Componente de ejemplo que demuestra el uso del sistema de estilos centralizados
 */
export function StylesExampleComponent() {
  return (
    <Box sx={layoutStyles.maxWidthContainer}>
      {/* Header de ejemplo con estilos centralizados */}
      <Box sx={contentStyles.spacingLarge}>
        <Typography 
          variant="h4" 
          sx={{ 
            ...profileStyles.title, 
            ...quickStyles.textCenter 
          }}
        >
          Ejemplo de Estilos Centralizados
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            ...quickStyles.textCenter, 
            ...contentStyles.spacingMedium 
          }}
        >
          Demonstración del sistema de estilos de Japasea
        </Typography>
      </Box>

      {/* Card con estilos de autenticación */}
      <Box sx={quickStyles.mb4}>
        <Card sx={cardVariants.elevatedCard}>
          <CardContent>
            <Typography variant="h6" sx={contentStyles.spacingSmall}>
              Formulario de Autenticación
            </Typography>
            
            <Box sx={authStyles.form}>
              <TextField
                fullWidth
                label="Email"
                placeholder="tu@email.com"
                sx={fieldVariants.elevatedInput}
                InputProps={{
                  startAdornment: <EmailIcon sx={quickStyles.mr1} />
                }}
              />
              
              <TextField
                fullWidth
                label="Nombre"
                placeholder="Tu nombre completo"
                sx={fieldVariants.roundedInput}
                InputProps={{
                  startAdornment: <PersonIcon sx={quickStyles.mr1} />
                }}
              />
              
              <Button 
                fullWidth 
                variant="contained"
                sx={buttonVariants.gradientButton}
              >
                Registrarse
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Card con estilos de perfil */}
      <Box sx={quickStyles.mb4}>
        <Card sx={cardVariants.glassCard}>
          <CardContent>
            <Box sx={profileStyles.header}>
              <Typography variant="h6" sx={profileStyles.title}>
                Información de Usuario
              </Typography>
              <Box sx={profileStyles.userInfo}>
                <Chip label="Usuario Premium" color="primary" size="small" />
                <Chip label="Verificado" color="success" size="small" />
              </Box>
            </Box>

            <Box sx={profileStyles.section}>
              <Typography variant="subtitle2" sx={profileStyles.sectionTitle}>
                <PersonIcon sx={quickStyles.mr1} />
                Datos Personales
              </Typography>
              
              <Box sx={contentStyles.flexColumn}>
                <Box sx={quickStyles.flexRow}>
                  <EmailIcon sx={profileStyles.inputIcon} />
                  <Typography variant="body2">usuario@japasea.com</Typography>
                </Box>
                
                <Box sx={quickStyles.flexRow}>
                  <PhoneIcon sx={profileStyles.inputIcon} />
                  <Typography variant="body2">+34 123 456 789</Typography>
                </Box>
              </Box>

              <Button 
                variant="outlined"
                size="small"
                sx={buttonVariants.outlinedGradient}
                startIcon={<EditIcon />}
              >
                Editar Perfil
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Sección con diferentes variantes de botones */}
      <Box sx={quickStyles.mb4}>
        <Paper sx={{ 
          ...layoutStyles.paperContainer, 
          ...contentStyles.spacingLarge 
        }}>
          <Typography variant="h6" sx={contentStyles.spacingMedium}>
            Variantes de Botones
          </Typography>
          
          <Box sx={{ 
            ...quickStyles.flexRow, 
            flexWrap: 'wrap', 
            gap: 2 
          }}>
            <Button sx={buttonVariants.gradientButton}>
              Gradiente
            </Button>
            
            <Button sx={buttonVariants.outlinedGradient}>
              Outline Gradiente
            </Button>
            
            <Button sx={authStyles.button}>
              Botón Auth
            </Button>
            
            <Button sx={formStyles.primaryButton} variant="contained">
              Botón Primario
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Sección con diferentes variantes de campos */}
      <Box sx={quickStyles.mb4}>
        <Paper sx={layoutStyles.paperContainer}>
          <Typography variant="h6" sx={contentStyles.spacingMedium}>
            Variantes de Campos
          </Typography>
          
          <Box sx={{ 
            ...formStyles.formContainer, 
            maxWidth: 400 
          }}>
            <TextField
              fullWidth
              label="Campo Elevado"
              placeholder="Estilo con sombra"
              sx={fieldVariants.elevatedInput}
            />
            
            <TextField
              fullWidth
              label="Campo Cristal"
              placeholder="Estilo glassmorphism"
              sx={fieldVariants.glassInput}
            />
            
            <TextField
              fullWidth
              label="Campo Redondeado"
              placeholder="Bordes redondeados"
              sx={fieldVariants.roundedInput}
            />
          </Box>
        </Paper>
      </Box>

      {/* Sección con utilidades de layout */}
      <Box sx={quickStyles.mb4}>
        <Paper sx={layoutStyles.paperContainer}>
          <Typography variant="h6" sx={contentStyles.spacingMedium}>
            Utilidades de Layout
          </Typography>
          
          {/* Flex Row */}
          <Box sx={{ 
            ...contentStyles.flexRow, 
            ...contentStyles.spacingSmall 
          }}>
            <Typography variant="body2">Flex Row:</Typography>
            <Chip label="Elemento 1" size="small" />
            <Chip label="Elemento 2" size="small" />
            <Chip label="Elemento 3" size="small" />
          </Box>
          
          {/* Flex Column */}
          <Box sx={{ 
            ...contentStyles.flexColumn, 
            maxWidth: 200 
          }}>
            <Typography variant="body2" sx={quickStyles.fontBold}>
              Flex Column:
            </Typography>
            <Button size="small" variant="outlined">Botón 1</Button>
            <Button size="small" variant="outlined">Botón 2</Button>
            <Button size="small" variant="outlined">Botón 3</Button>
          </Box>
        </Paper>
      </Box>

      {/* Floating Action Button de ejemplo */}
      <IconButton sx={buttonVariants.floatingButton} color="primary">
        <FavoriteIcon />
      </IconButton>
    </Box>
  );
}

export default StylesExampleComponent;
