'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setUser, setLoading, setError } from '@/store/slices/authSlice';
import { firebaseLogin } from '@/config/firebase';
import { userApi } from '@/apis/users';
import type { RootState } from '@/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      // Firebase Authentication
      const firebaseUser = await firebaseLogin(email, password);
      const token = await firebaseUser.getIdToken();
      
      // Fetch user data from your API
      const userData = await userApi.fetchUsersData(token);
      
      dispatch(setUser({ ...userData, token }));
      router.push('/dashboard');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Login failed'));
    } finally {
      dispatch(setLoading(false));
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
          p: isMobile ? 2 : 4
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: isMobile ? 2 : 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{ mb: 4 }}
            >
              Welcome Back
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
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                size="large"
                sx={{ 
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 