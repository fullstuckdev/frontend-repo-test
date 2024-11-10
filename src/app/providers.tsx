'use client';

import { useEffect } from 'react';
import '../lib/reflect';
import { Provider } from 'react-redux';
import { store } from '@/dataStore/store';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/ui/styles/theme';
import { ClientOnly } from '@/ui/components/common/ClientOnly/ClientOnly';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    require('reflect-metadata');
  }, []);

  return (
    <ClientOnly>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          {children}
        </Provider>
      </ThemeProvider>
    </ClientOnly>
  );
} 