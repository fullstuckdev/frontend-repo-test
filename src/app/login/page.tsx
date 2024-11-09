'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { setUser, setLoading, setError } from '@/store/slices/authSlice';
import { authApi } from '@/apis/auth';
import { RootState } from '@/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
        const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    
    try {
      const response = await authApi.login(email, password);
      dispatch(setUser(response.user));
      router.push('/dashboard');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Login failed'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom align="center">
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 