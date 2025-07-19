// Responsive breakpoint utilities
export const breakpointStyles = {
  hideOnMobile: {
    display: { xs: 'none', md: 'flex' }
  },

  hideOnDesktop: {
    display: { xs: 'flex', md: 'none' }
  },

  showOnMobile: {
    display: { xs: 'block', md: 'none' }
  },

  showOnDesktop: {
    display: { xs: 'none', md: 'block' }
  },

  // Responsive padding
  responsivePadding: {
    px: { xs: 2, sm: 3, md: 4 }
  },

  responsiveMargin: {
    mx: { xs: 1, sm: 2, md: 3 }
  }
};

// Color and theme utilities
export const colorStyles = {
  primaryGradient: {
    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
  },

  secondaryGradient: {
    background: 'linear-gradient(135deg, #dc004e 0%, #f48fb1 100%)'
  },

  successGradient: {
    background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)'
  },

  glassmorphism: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },

  cardShadow: {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)'
    }
  }
};

// Animation keyframes and effects
export const animationEffects = {
  pulseAnimation: {
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': {
        opacity: 1
      },
      '50%': {
        opacity: 0.5
      },
      '100%': {
        opacity: 1
      }
    }
  },

  bounceIn: {
    animation: 'bounceIn 0.5s ease-out',
    '@keyframes bounceIn': {
      '0%': {
        transform: 'scale(0.3)',
        opacity: 0
      },
      '50%': {
        transform: 'scale(1.05)'
      },
      '70%': {
        transform: 'scale(0.9)'
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 1
      }
    }
  },

  slideInUp: {
    animation: 'slideInUp 0.3s ease-out',
    '@keyframes slideInUp': {
      '0%': {
        transform: 'translateY(20px)',
        opacity: 0
      },
      '100%': {
        transform: 'translateY(0)',
        opacity: 1
      }
    }
  }
};

// Form field variants
export const fieldVariants = {
  roundedInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      '& fieldset': {
        borderWidth: 2
      }
    }
  },

  glassInput: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.4)'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main'
      }
    }
  },

  elevatedInput: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'background.paper',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
      '& fieldset': {
        border: 'none'
      },
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }
    }
  },

  authInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'white',
      '& input': {
        backgroundColor: 'white !important',
        color: 'black !important',
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 1000px white inset !important',
          WebkitTextFillColor: 'black !important',
          backgroundColor: 'white !important'
        },
        '&:-webkit-autofill:hover': {
          WebkitBoxShadow: '0 0 0 1000px white inset !important',
          WebkitTextFillColor: 'black !important',
          backgroundColor: 'white !important'
        },
        '&:-webkit-autofill:focus': {
          WebkitBoxShadow: '0 0 0 1000px white inset !important',
          WebkitTextFillColor: 'black !important',
          backgroundColor: 'white !important'
        },
        '&:-webkit-autofill:active': {
          WebkitBoxShadow: '0 0 0 1000px white inset !important',
          WebkitTextFillColor: 'black !important',
          backgroundColor: 'white !important'
        }
      }
    }
  }
};

// Button variants
export const buttonVariants = {
  gradientButton: {
    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    color: 'white',
    fontWeight: 600,
    borderRadius: 2,
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
      transform: 'translateY(-1px)'
    }
  },

  outlinedGradient: {
    background: 'transparent',
    border: '2px solid transparent',
    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1976d2, #42a5f5)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    color: 'primary.main',
    fontWeight: 600,
    borderRadius: 2,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)'
    }
  },

  floatingButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 1000,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
  }
};

// Card and container variants
export const cardVariants = {
  elevatedCard: {
    backgroundColor: 'background.paper',
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-2px)'
    },
    transition: 'all 0.3s ease'
  },

  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: 3,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  },

  gradientCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    borderRadius: 3,
    border: '1px solid rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)'
  }
};

// Layout utilities for complex patterns
export const layoutPatterns = {
  stickyHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'background.paper',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },

  fullViewport: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden'
  },

  scrollableContainer: {
    height: '100%',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 6
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 3
    }
  },

  gridAutoFit: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 3
  }
};

// Loading and state utilities
export const stateStyles = {
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },

  errorState: {
    color: 'error.main',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    border: '1px solid rgba(211, 47, 47, 0.3)',
    borderRadius: 2,
    p: 2
  },

  successState: {
    color: 'success.main',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    border: '1px solid rgba(46, 125, 50, 0.3)',
    borderRadius: 2,
    p: 2
  },

  warningState: {
    color: 'warning.main',
    backgroundColor: 'rgba(237, 108, 2, 0.1)',
    border: '1px solid rgba(237, 108, 2, 0.3)',
    borderRadius: 2,
    p: 2
  }
};
