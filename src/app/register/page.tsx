'use client';

import { useState } from 'react';
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
  useMediaQuery,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import { setUser, setLoading, setError } from '@/store/slices/authSlice';
import { firebaseRegister } from '@/config/firebase';
import type { RootState } from '@/store';
import { db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const firebaseUser = await firebaseRegister(
        formData.email, 
        formData.password, 
        formData.displayName
      );
      
      const token = await firebaseUser.getIdToken();
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName!,
        photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avatars/svg?seed=${firebaseUser.email}`,
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      dispatch(setUser({
        ...userData,
        token,
      }));

      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      dispatch(setError(err instanceof Error ? err.message : 'Registration failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          },
        }}
      >
        <Card 
          sx={{ 
            width: '100%', 
            maxWidth: 450,
            mx: 3,
            borderRadius: '24px',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <CardContent sx={{ p: isMobile ? 4 : 6 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'transparent',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                src={formData.email ? `https://api.dicebear.com/7.x/avatars/svg?seed=${formData.email}` : undefined}
              />
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #1976D2 30%, #388E3C 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                }}
              >
                Create Account
              </Typography>
            </Box>
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                margin="normal"
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                  },
                }}
              />
              {error && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    border: '1px solid rgba(211, 47, 47, 0.3)',
                  }}
                >
                  <Typography 
                    color="#D32F2F"
                    sx={{ 
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </Typography>
                </Box>
              )}
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                size="large"
                startIcon={<PersonAdd />}
                sx={{ 
                  mt: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
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
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span>Creating Account</span>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                    </Box>
                  </Box>
                ) : 'Create Account'}
              </Button>
              <Button
                fullWidth
                onClick={() => router.push('/')}
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  color: '#1976D2',
                  border: '1px solid rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.15)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                  },
                }}
              >
                Already have an account? Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
      <style jsx global>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dot {
          display: inline-block;
          animation: bounce 1.4s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </Container>
  );
} 