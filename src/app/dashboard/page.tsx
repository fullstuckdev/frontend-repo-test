'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Switch,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit as EditIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { userApi } from '@/apis/users';
import type { RootState } from '@/store';
import type { User } from '@/types';
import { handleApiError } from '@/utils/errorHandler';
import { setUser } from '@/store/slices/authSlice';

interface UserData extends User {
  createdAt: string;
  updatedAt: string;
}

interface EditDialogProps {
  open: boolean;
  user: UserData | null;
  onClose: () => void;
  onSave: (userData: Partial<UserData>) => Promise<void>;
}

const EditDialog = ({ open, user, onClose, onSave }: EditDialogProps) => {
  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: '',
    role: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: user.role,
        isActive: user.isActive
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Photo URL"
              value={formData.photoURL}
              onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
            />
            <TextField
              fullWidth
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            <Box display="flex" alignItems="center" gap={2}>
              <Typography>Active Status</Typography>
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export default function DashboardPage() {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else if (!currentUser) {
      const restoreUserSession = async () => {
        try {
          const userData = await userApi.fetchUsersData(token);
          dispatch(setUser({ ...userData, token }));
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
          router.push('/');
        }
      };
      
      restoreUserSession();
    }
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      dispatch(setUser(null));
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    
    setLoading(true);
    try {
      const response = await userApi.fetchUsersData(token);
      setUsers(response.data);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setSnackbar({
        open: true,
        message: `Failed to fetch users: ${errorMessage}`,
        severity: 'error' as const
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData: Partial<UserData>) => {
    if (!currentUser?.token || !selectedUser) {
      setSnackbar({
        open: true,
        message: 'Authentication token or user selection is missing',
        severity: 'error' as const
      });
      return;
    }

    try {
      // Validate required fields
      if (!userData.displayName || !userData.role) {
        throw new Error('Display name and role are required');
      }

      const updatedUserData = {
        displayName: userData.displayName,
        photoURL: userData.photoURL || '',
        role: userData.role,
        isActive: userData.isActive ?? true
      };

      const response = await userApi.updateUserData(
        selectedUser.id,
        updatedUserData,
        currentUser.token
      );

      if (response.success) {
        await fetchUsers();
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success' as const
        });
        setOpenDialog(false);
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setSnackbar({
        open: true,
        message: `Failed to update user: ${errorMessage}`,
        severity: 'error' as const
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser?.token]);

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">Users Management</Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Card>
          <TableContainer>
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
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={user.photoURL || undefined} alt={user.displayName || ''} />
                        <Typography>{user.displayName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: user.isActive ? 'success.light' : 'error.light',
                          color: user.isActive ? 'success.dark' : 'error.dark',
                        }}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit User">
                        <IconButton
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <EditDialog
          open={openDialog}
          user={selectedUser}
          onClose={() => {
            setOpenDialog(false);
            setSelectedUser(null);
          }}
          onSave={handleUpdateUser}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
} 