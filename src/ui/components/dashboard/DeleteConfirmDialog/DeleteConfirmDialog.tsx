import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import type { DeleteConfirmDialogProps } from '../types';

export const DeleteConfirmDialog = ({
  open,
  user,
  loading,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  const handleConfirm = async () => {
    if (user) {
      await onConfirm(user);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        fontWeight: 600,
      }}>
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete user "{user?.displayName}"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            color: '#1976D2',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
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
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 