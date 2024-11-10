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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const firebaseUser = await firebaseLogin(email, password);
      const token = await firebaseUser.getIdToken();
      
      const userData = await userApi.fetchUsersData(token);
      
      localStorage.setItem('token', token);
      dispatch(setUser({ ...userData, token }));
      router.push('/dashboard');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Login failed'));
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
          background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
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
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      >
        <Card 
          sx={{ 
            width: '100%', 
            maxWidth: 450,
            mx: 3,
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.9)',
            position: 'relative',
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-15px',
              left: '-15px',
              right: '-15px',
              bottom: '-15px',
              background: 'linear-gradient(135deg, rgba(255,107,107,0.5) 0%, rgba(78,205,196,0.5) 100%)',
              borderRadius: '32px',
              zIndex: -1,
              filter: 'blur(20px)',
            },
          }}
        >
          <CardContent sx={{ p: isMobile ? 4 : 6 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{ 
                mb: 5,
                fontWeight: 800,
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                letterSpacing: '-0.5px',
              }}
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
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.9)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    },
                  },
                }}
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
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.9)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    },
                  },
                }}
              />
              {error && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(255,107,107,0.1)',
                    border: '1px solid rgba(255,107,107,0.3)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography 
                    color="#FF6B6B"
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
                sx={{ 
                  mt: 4,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: '16px',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  boxShadow: '0 8px 20px rgba(255,107,107,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 25px rgba(255,107,107,0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span>Signing in</span>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <span className="dot" style={{ animation: 'bounce 1.4s infinite' }}>.</span>
                      <span className="dot" style={{ animation: 'bounce 1.4s infinite 0.2s' }}>.</span>
                      <span className="dot" style={{ animation: 'bounce 1.4s infinite 0.4s' }}>.</span>
                    </Box>
                  </Box>
                ) : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        .dot {
          display: inline-block;
        }
      `}</style>
    </Container>
  );
} 