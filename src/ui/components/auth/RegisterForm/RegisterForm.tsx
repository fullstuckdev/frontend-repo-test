import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import type { RegisterCredentials } from '@/domain/usecases/auth/register';

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const RegisterForm = ({ onSubmit, loading, error }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      </Box>

      <TextField
        fullWidth
        label="Full Name"
        value={formData.displayName}
        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        margin="normal"
        required
        sx={{ mb: 3 }}
      />
      
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        margin="normal"
        required
        sx={{ mb: 3 }}
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
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
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
        startIcon={<PersonAdd />}
        sx={{ mt: 4, py: 2 }}
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
    </form>
  );
}; 