import { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { ProfileCardProps } from '../types';
import { EditDialog } from '../EditDialog/EditDialog';

export const ProfileCard = ({ user, onUpdateUser }: ProfileCardProps) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 3,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography 
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#1976D2',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          My Account Information
        </Typography>
      </Box>

      <Box p={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              src={user.photoURL || undefined}
              alt={user.displayName}
              sx={{
                width: 80,
                height: 80,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Box>
              <Typography variant="h5" fontWeight={600} mb={1}>
                {user.displayName}
              </Typography>
              <Typography color="text.secondary" mb={0.5}>
                {user.email}
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <Typography
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: '16px',
                    display: 'inline-block',
                    background: 'linear-gradient(45deg, #2196F3 30%, #4CAF50 90%)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {user.role}
                </Typography>
                <Typography
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: '16px',
                    backgroundColor: user.isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                    color: user.isActive ? '#2E7D32' : '#757575',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    border: '1px solid',
                    borderColor: user.isActive ? 'rgba(76, 175, 80, 0.3)' : 'rgba(158, 158, 158, 0.3)',
                  }}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Tooltip title="Edit Profile">
            <IconButton
              onClick={() => setOpenEditDialog(true)}
              sx={{
                color: '#2196F3',
                '&:hover': {
                  backgroundColor: 'rgba(33,150,243,0.1)',
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <EditDialog
        open={openEditDialog}
        user={user}
        onClose={() => setOpenEditDialog(false)}
        onSave={onUpdateUser}
      />
    </Card>
  );
}; 