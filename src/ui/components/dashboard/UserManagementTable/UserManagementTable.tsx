import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Refresh as RefreshIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import type { UserData } from '../types';

interface UserManagementTableProps {
  users: UserData[];
  loading: boolean;
  onRefresh: () => void;
  onEditUser: (user: UserData) => void;
  onDeleteUser: (user: UserData) => void;
}

export const UserManagementTable = ({
  users,
  loading,
  onRefresh,
  onEditUser,
  onDeleteUser,
}: UserManagementTableProps) => {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 3,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
          Users Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#1976D2',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
              },
              '&:active': {
                transform: 'translateY(-1px)',
              },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={user.photoURL}
                      alt={user.displayName}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography>{user.displayName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <StatusBadge isActive={user.isActive} />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Edit User">
                      <IconButton
                        onClick={() => onEditUser(user)}
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
                    <Tooltip title="Delete User">
                      <IconButton
                        onClick={() => onDeleteUser(user)}
                        sx={{
                          color: '#D32F2F',
                          '&:hover': {
                            backgroundColor: 'rgba(211,47,47,0.1)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}; 