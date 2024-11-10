'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { container } from '@/ioc/container';
import { TYPES } from '@/ioc/types';
import type { DashboardViewModel } from '@/ui/viewmodels/DashboardViewModel';
import type { RootState } from '@/dataStore/store';
import type { User } from '@/domain/models/user';
import { setUser } from '@/dataStore/auth/slice';
import Head from 'next/head';
import {
  Box,
  Container,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import { 
  ProfileCard, 
  EditDialog, 
  UserManagementTable, 
  DeleteConfirmDialog,
  Header
} from '@/ui/components/dashboard';
import { auth } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { UserData, SnackbarState, UIUser } from '@/ui/components/dashboard/types';
import { GetUsersUseCase } from '@/domain/usecases/user/getUsers';
import { logger } from '@/core/logger';

export default function DashboardPage() {
  const viewModel = container.get<DashboardViewModel>(TYPES.DashboardViewModel);
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

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    if (!currentUser) {
      const restoreUserSession = async () => {
        try {
          await new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
              unsubscribe();
              resolve(user);
            });
          });

          const currentAuthUser = auth.currentUser;
          if (!currentAuthUser?.uid) {
            throw new Error('No authenticated user found');
          }

          const userDoc = await getDoc(doc(db, 'users', currentAuthUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'id' | 'token'>;
            
            const newToken = await currentAuthUser.getIdToken(true);
            localStorage.setItem('token', newToken);

            dispatch(setUser({ 
              ...userData, 
              id: userDoc.id,
              token: newToken,
              isActive: userData.isActive ?? true,
              role: userData.role || 'user',
              displayName: userData.displayName || '',
              photoURL: userData.photoURL || '',
              email: userData.email || '',
            }));
          } else {
            throw new Error('User data not found');
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
          router.push('/');
        }
      };
      
      restoreUserSession();
    }
  }, [currentUser, dispatch, router]);

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
    try {
      const getUsersUseCase = container.get<GetUsersUseCase>(TYPES.GetUsersUseCase);
      const fetchedUsers = await getUsersUseCase.execute();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdateUser = async (userData: Partial<UserData>) => {
    if (!selectedUser?.id) {
      setSnackbar({
        open: true,
        message: 'User ID is missing',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await viewModel.updateUser(selectedUser.id, userData);
      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
      await fetchUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update user',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setOpenDialog(false);
      setSelectedUser(null);
    }
  };

  const handleCurrentUserUpdate = async (userData: Partial<UserData>) => {
    if (!currentUser?.id) {
      logger.error('User ID missing during profile update', { userData });
      setSnackbar({
        open: true,
        message: 'User ID is missing',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await viewModel.updateUser(currentUser.id, userData);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      
      if (currentUser) {
        dispatch(setUser({
          ...currentUser,
          ...userData
        }));
      }
    } catch (error) {
      logger.error('Failed to update user profile', { userId: currentUser.id, userData, error });
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    setLoading(true);
    try {
      await viewModel.deleteUser(user.id);
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      await fetchUsers();
    } catch (error) {
      logger.error('Failed to delete user', { userId: user.id, error });
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  useEffect(() => {
    if (currentUser?.token) {
      fetchUsers();
    }
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
            <Header onLogout={handleLogout} />

            {/* Profile Card Section */}
            {currentUser && (
              <ProfileCard
                user={currentUser as UIUser}
                onUpdateUser={handleCurrentUserUpdate}
              />
            )}

            {/* User Management Table */}
            <UserManagementTable
              users={users}
              loading={loading}
              onRefresh={fetchUsers}
              onEditUser={(user) => {
                setSelectedUser(user);
                setOpenDialog(true);
              }}
              onDeleteUser={(user) => {
                setUserToDelete(user);
                setDeleteConfirmOpen(true);
              }}
            />

            {/* Dialogs and Snackbar remain the same */}
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

            <DeleteConfirmDialog
              open={deleteConfirmOpen}
              user={userToDelete}
              loading={loading}
              onClose={() => {
                setDeleteConfirmOpen(false);
                setUserToDelete(null);
              }}
              onConfirm={handleDeleteUser}
            />
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