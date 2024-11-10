'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { LoginForm } from '../LoginForm/LoginForm';
import { setUser, setLoading, setError } from '@/dataStore/auth/slice';
import type { RootState } from '@/dataStore/store';
import { container } from '@/ioc/container';
import { TYPES } from '@/ioc/types';
import type { LoginUseCase } from '@/domain/usecases/auth/login';
import { ClientOnly } from '@/ui/components/common/ClientOnly/ClientOnly';

export function LoginPage() {
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

  const handleLogin = async (credentials: { email: string; password: string }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const loginUseCase = container.get<LoginUseCase>(TYPES.LoginUseCase);
      const result = await loginUseCase.execute(credentials);
      
      dispatch(setUser(result));
      localStorage.setItem('token', result.token);
      router.push('/dashboard');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <ClientOnly>
      <Box 
        component="main"
        sx={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
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
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{ 
                  mb: 5,
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #1976D2 30%, #388E3C 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                }}
              >
                Welcome Back
              </Typography>
              
              <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                error={error}
              />

              <Button
                fullWidth
                onClick={() => router.push('/register')}
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
                Don't have an account? Register now
              </Button>
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
      </Box>
    </ClientOnly>
  );
} 