'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Container } from '@mui/material';
import { LoadingButton } from '@/components/LoadingButton';
import { authApi } from '@/apis/auth';
import { setUser, setError } from '@/store/slices/authSlice';
import type { RootState } from '@/store';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const handleRefreshUserInfo = async () => {
    try {
      const userData = await authApi.getUserInfo(user?.id || '');
      dispatch(setUser(userData));
    } catch (error) {
      dispatch(setError('Failed to fetch user info'));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <LoadingButton 
          variant="contained" 
          loading={loading}
          onClick={handleRefreshUserInfo}
        >
          Refresh User Info
        </LoadingButton>
      </Box>
    </Container>
  );
} 