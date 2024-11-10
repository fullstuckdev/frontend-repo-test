import { Box } from '@mui/material';

interface StatusBadgeProps {
  isActive: boolean;
}

export const StatusBadge = ({ isActive }: StatusBadgeProps) => (
  <Box
    component="span"
    sx={{
      px: 2.5,
      py: 0.75,
      borderRadius: '12px',
      fontSize: '0.875rem',
      fontWeight: 500,
      backdropFilter: 'blur(10px)',
      backgroundColor: isActive 
        ? 'rgba(76, 175, 80, 0.1)'
        : 'rgba(25, 118, 210, 0.1)',
      color: isActive ? '#2E7D32' : '#1976D2',
      border: '1px solid',
      borderColor: isActive 
        ? 'rgba(76, 175, 80, 0.3)'
        : 'rgba(25, 118, 210, 0.3)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: isActive 
          ? 'rgba(76, 175, 80, 0.15)'
          : 'rgba(25, 118, 210, 0.15)',
        transform: 'translateY(-1px)',
      },
    }}
  >
    {isActive ? 'Active' : 'Inactive'}
  </Box>
); 