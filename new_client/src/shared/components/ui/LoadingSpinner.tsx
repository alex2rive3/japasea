import { CircularProgress, Box, Typography } from '@mui/material';
import type { CircularProgressProps } from '@mui/material';

interface LoadingSpinnerProps extends Omit<CircularProgressProps, 'variant'> {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ 
  message, 
  fullScreen = false,
  ...props 
}: LoadingSpinnerProps) => {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <CircularProgress {...props} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="rgba(255, 255, 255, 0.8)"
        zIndex={9999}
      >
        {content}
      </Box>
    );
  }

  return content;
};
