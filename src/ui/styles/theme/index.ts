import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
      light: '#2196F3',
      dark: '#0D47A1',
    },
    secondary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
        },
        contained: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#1976D2',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.05)',
    '0 8px 16px rgba(0,0,0,0.05)',
    '0 16px 32px rgba(0,0,0,0.05)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.08)',
    '0 8px 20px rgba(0,0,0,0.08)',
    '0 16px 36px rgba(0,0,0,0.08)',
    '0 2px 12px rgba(0,0,0,0.1)',
    '0 4px 16px rgba(0,0,0,0.1)',
    '0 8px 24px rgba(0,0,0,0.1)',
    '0 16px 40px rgba(0,0,0,0.1)',
    '0 2px 16px rgba(0,0,0,0.12)',
    '0 4px 20px rgba(0,0,0,0.12)',
    '0 8px 28px rgba(0,0,0,0.12)',
    '0 16px 44px rgba(0,0,0,0.12)',
    '0 4px 24px rgba(0,0,0,0.14)',
    '0 8px 32px rgba(0,0,0,0.14)',
    '0 16px 48px rgba(0,0,0,0.14)',
    '0 4px 28px rgba(0,0,0,0.16)',
    '0 8px 36px rgba(0,0,0,0.16)',
    '0 16px 52px rgba(0,0,0,0.16)',
    '0 8px 40px rgba(0,0,0,0.18)',
    '0 16px 56px rgba(0,0,0,0.18)',
  ] as const,
});

declare module '@mui/material/styles' {
  interface Theme {
  }
  interface ThemeOptions {
  }
} 