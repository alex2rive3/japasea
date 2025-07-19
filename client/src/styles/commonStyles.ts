// Layout and Container Styles
export const layoutStyles = {
  // Main containers
  fullContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh'
  },

  flexContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },

  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  },

  centeredContent: {
    display: 'flex',
    justifyContent: 'center',
    p: 4
  },

  maxWidthContainer: {
    maxWidth: 600,
    mx: 'auto',
    p: 3
  },

  // Card containers
  paperContainer: {
    p: 4,
    borderRadius: 2
  },

  authContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    px: 3,
    py: 4
  }
};

// Form Styles
export const formStyles = {
  // Form layouts
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },

  formContainerLarge: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3.5
  },

  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },

  formSectionLarge: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    pt: 2
  },

  // Input field styles
  inputField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      }
    }
  },

  // Button styles
  primaryButton: {
    py: 1.5,
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: 2,
    textTransform: 'none'
  },

  authButton: {
    py: 2,
    fontSize: '1.1rem',
    fontWeight: 600,
    borderRadius: 3,
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-1px)'
    }
  }
};

// Header and Navigation Styles
export const navigationStyles = {
  // Headers and titles
  sectionHeader: {
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },

  centeredHeader: {
    textAlign: 'center',
    mb: 4
  },

  titleBold: {
    fontWeight: 'bold',
    mb: 1
  },

  // Navigation elements
  navList: {
    px: 1
  },

  navItem: {
    borderRadius: 2,
    mb: 0.5,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },

  activeNavItem: {
    borderRadius: 2,
    mb: 0.5,
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.2)'
    }
  },

  navIcon: {
    minWidth: 36,
    color: 'text.secondary'
  },

  // Toolbar and appbar
  toolbar: {
    px: { xs: 2, sm: 3 }
  }
};

// Content Display Styles
export const contentStyles = {
  // Spacing utilities
  spacingSmall: {
    mb: 2
  },

  spacingMedium: {
    mb: 3
  },

  spacingLarge: {
    mb: 4
  },

  spacingXLarge: {
    my: 4
  },

  // Flex utilities
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },

  flexRowSpaced: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1
  },

  flexRowEnd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 1
  },

  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },

  flexColumnLarge: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },

  // Text alignment
  textCenter: {
    textAlign: 'center'
  },

  textCenterSpaced: {
    textAlign: 'center',
    mt: 3
  }
};

// Interactive Element Styles
export const interactiveStyles = {
  // Icons with spacing
  iconLeft: {
    mr: 1,
    color: 'text.secondary'
  },

  iconRight: {
    ml: 1
  },

  // Loading indicators
  loadingIcon: {
    mr: 1
  },

  // Interactive elements
  clickableIcon: {
    p: 0.5,
    ml: 1
  },

  // Responsive elements
  responsiveHidden: {
    display: { xs: 'none', md: 'block' }
  },

  responsiveVisible: {
    display: { xs: 'block', md: 'none' }
  }
};

// Search Component Styles
export const searchStyles = {
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    px: 2,
    py: 0.5,
    minWidth: { xs: 200, sm: 300 },
    maxWidth: 400
  },

  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'inherit',
    fontSize: '0.95rem',
    width: '100%',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.7)',
      opacity: 1
    }
  }
};

// Drawer and Sidebar Styles
export const drawerStyles = {
  drawer: {
    width: 280,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 280,
      boxSizing: 'border-box'
    }
  },

  temporaryDrawer: {
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: 280
    }
  },

  permanentDrawer: {
    display: { xs: 'none', md: 'block' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: 280
    }
  },

  drawerContent: {
    flexGrow: 1,
    py: 1
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    p: 2,
    minHeight: 64
  },

  drawerFooter: {
    p: 2
  }
};

// Logo and Branding Styles
export const brandingStyles = {
  logo: {
    height: 32,
    width: 'auto',
    borderRadius: 1
  },

  logoLarge: {
    width: 80,
    height: 80,
    borderRadius: 2,
    mb: 2
  },

  brandText: {
    fontWeight: 700,
    fontSize: '1.5rem',
    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
  }
};

// Animation and Transition Styles
export const animationStyles = {
  fadeIn: {
    animation: 'fadeIn 0.5s ease-in'
  },

  slideUp: {
    animation: 'slideUp 0.3s ease-out'
  },

  hoverScale: {
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  }
};

// Combined utility styles for common patterns
export const commonPatterns = {
  authCard: {
    ...layoutStyles.maxWidthContainer,
    ...layoutStyles.paperContainer
  },

  formWithHeader: {
    ...contentStyles.textCenter,
    ...contentStyles.spacingLarge
  },

  sectionWithIcon: {
    ...navigationStyles.sectionHeader
  },

  centeredForm: {
    ...formStyles.formContainer,
    ...contentStyles.textCenter
  }
};
