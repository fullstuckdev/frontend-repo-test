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
import { RegisterForm } from '../RegisterForm/RegisterForm';
import { setUser, setLoading, setError } from '@/dataStore/auth/slice';
import type { RootState } from '@/dataStore/store';
import { container } from '@/ioc/container';
import { TYPES } from '@/ioc/types';
import type { RegisterUseCase, RegisterCredentials } from '@/domain/usecases/auth/register';
import { ClientOnly } from '@/ui/components/common/ClientOnly/ClientOnly';

export function RegisterPage() {
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

  const handleRegister = async (credentials: RegisterCredentials) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const registerUseCase = container.get<RegisterUseCase>(TYPES.RegisterUseCase);
      const result = await registerUseCase.execute(credentials);
      
      dispatch(setUser(result));
      localStorage.setItem('token', result.token);
      router.push('/dashboard');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Registration failed'));
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
                Create Account
              </Typography>
              
              <RegisterForm
                onSubmit={handleRegister}
                loading={loading}
                error={error}
              />

              <Button
                fullWidth
                onClick={() => router.push('/login')}
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                Already have an account? Sign In
              </Button>
            </CardContent>
          </Card>
        </Box>
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
    </ClientOnly>
  );
} 