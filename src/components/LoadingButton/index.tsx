'use client';

import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton = ({ loading, children, ...props }: LoadingButtonProps) => (
  <Button disabled={loading} {...props}>
    {loading ? <CircularProgress size={24} /> : children}
  </Button>
);

export default LoadingButton; 