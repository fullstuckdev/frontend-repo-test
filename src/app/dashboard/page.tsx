'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import {
  Box,
  Typography,
  Container,
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
  Alert,
  Snackbar,
  useTheme
} from '@mui/material';
import { Edit as EditIcon, Refresh as RefreshIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { userApi } from '@/apis/users';
import type { RootState } from '@/store';
import type { User } from '@/types';
import { handleApiError } from '@/utils/errorHandler';
import { setUser } from '@/store/slices/authSlice';
import { EditDialog } from './components/EditDialog';
import { StatusBadge } from './components/StatusBadge';

interface UserData extends User {
  createdAt: string;
  updatedAt: string;
}

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

  const theme = useTheme();

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
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #2196F3 0%, #4CAF50 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '140%',
            height: '140%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 3px)',
            backgroundSize: '50px 50px',
            animation: 'rotate 60s linear infinite',
            opacity: 0.5,
            zIndex: 0,
          },
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box py={4}>
            {/* Header Section */}
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
                    onClick={fetchUsers}
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
                  <Button
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      color: '#D32F2F',
                      border: '1px solid rgba(211, 47, 47, 0.5)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.15)',
                        border: '1px solid #D32F2F',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)',
                      },
                      '&:active': {
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Card>

            {/* Users Table */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: '#1976D2' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1976D2' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1976D2' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1976D2' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1976D2' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow 
                        key={user.id} 
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.05)',
                          },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar 
                              src={user.photoURL || undefined} 
                              alt={user.displayName || ''}
                              sx={{ 
                                width: 40, 
                                height: 40,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                            />
                            <Typography sx={{ fontWeight: 500 }}>
                              {user.displayName}
                            </Typography>
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
                          <Tooltip title="Edit User">
                            <IconButton
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenDialog(true);
                              }}
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
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert 
                severity={snackbar.severity} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                sx={{ 
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(20px)',
                  background: 'rgba(255,255,255,0.9)',
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Container>
      </Box>
      <style jsx global>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
} 