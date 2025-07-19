// Main styles export
export {
  layoutStyles,
  formStyles,
  navigationStyles,
  contentStyles,
  interactiveStyles,
  searchStyles,
  drawerStyles,
  brandingStyles,
  animationStyles,
  commonPatterns
} from './commonStyles';

// Utility styles export
export {
  breakpointStyles,
  colorStyles,
  animationEffects,
  fieldVariants,
  buttonVariants,
  cardVariants,
  layoutPatterns,
  stateStyles
} from './utilities';

// Combined style objects for common use cases
export const authStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    px: 3,
    py: 4
  },
  paper: {
    maxWidth: 600,
    mx: 'auto',
    p: 3
  },
  card: {
    p: 4,
    borderRadius: 2
  },
  header: {
    textAlign: 'center',
    mb: 4
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3.5
  },
  button: {
    py: 2,
    fontSize: '1.1rem',
    fontWeight: 600,
    borderRadius: 3,
    textTransform: 'none' as const,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-1px)'
    }
  },
  link: {
    textAlign: 'center',
    mt: 3
  }
};

export const sidebarStyles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    p: 2,
    minHeight: 64
  },
  content: {
    flexGrow: 1,
    py: 1
  },
  list: {
    px: 1
  },
  item: {
    borderRadius: 2,
    mb: 0.5,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },
  activeItem: {
    borderRadius: 2,
    mb: 0.5,
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.2)'
    }
  },
  icon: {
    minWidth: 36,
    color: 'text.secondary'
  },
  footer: {
    p: 2
  }
};

export const profileStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    p: 4
  },
  paper: {
    maxWidth: 600,
    mx: 'auto',
    p: 3
  },
  card: {
    p: 4,
    borderRadius: 2
  },
  header: {
    textAlign: 'center',
    mb: 4
  },
  title: {
    fontWeight: 'bold',
    mb: 1
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    mb: 2
  },
  section: {
    mb: 4
  },
  sectionTitle: {
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },
  inputIcon: {
    mr: 1,
    color: 'text.secondary'
  },
  divider: {
    my: 4
  }
};

// Quick access to commonly used patterns
export const quickStyles = {
  // Flex utilities
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  
  // Spacing utilities
  mb2: { mb: 2 },
  mb3: { mb: 3 },
  mb4: { mb: 4 },
  mt3: { mt: 3 },
  my4: { my: 4 },
  p2: { p: 2 },
  p3: { p: 3 },
  p4: { p: 4 },
  px2: { px: 2 },
  py1: { py: 1 },
  mr1: { mr: 1 },
  ml1: { ml: 1 },
  
  // Text utilities
  textCenter: { textAlign: 'center' },
  fontBold: { fontWeight: 'bold' },
  
  // Common responsive patterns
  hideOnMobile: { display: { xs: 'none', md: 'block' } },
  hideOnDesktop: { display: { xs: 'block', md: 'none' } },
  
  // Loading and interactive states
  loadingIcon: { mr: 1 },
  clickableIcon: { p: 0.5, ml: 1 }
};
