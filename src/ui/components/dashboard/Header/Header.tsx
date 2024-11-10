import { Box, Button, Typography } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        p: 2,
        borderRadius: 3,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(45deg, #1976D2 30%, #388E3C 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
        }}
      >
        Dashboard
      </Typography>
      <Button
        variant="contained"
        startIcon={<LogoutIcon />}
        onClick={onLogout}
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          color: '#D32F2F',
          border: '1px solid rgba(211, 47, 47, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(211, 47, 47, 0.15)',
            border: '1px solid #D32F2F',
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}; 