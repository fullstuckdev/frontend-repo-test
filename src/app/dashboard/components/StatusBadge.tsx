import { Box } from '@mui/material';

interface StatusBadgeProps {
  isActive: boolean;
}

export const StatusBadge = ({ isActive }: StatusBadgeProps) => (
  <Box
    component="span"
    sx={{
      px: 2,
      py: 0.5,
      borderRadius: 2,
      fontSize: '0.875rem',
      fontWeight: 500,
      bgcolor: isActive ? 'success.soft' : 'error.soft',
      color: isActive ? 'success.main' : 'error.main',
    }}
  >
    {isActive ? 'Active' : 'Inactive'}
  </Box>
); 