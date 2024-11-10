import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { LoginCredentials } from '@/domain/usecases/auth/login';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const LoginForm = ({ onSubmit, loading, error }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
          <Typography color="#D32F2F" align="center" fontSize="0.9rem" fontWeight={500}>
            {error}
          </Typography>
        </Box>
      )}
      <Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={loading}
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
            <span>Signing in</span>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </Box>
          </Box>
        ) : 'Sign In'}
      </Button>
    </form>
  );
}; 