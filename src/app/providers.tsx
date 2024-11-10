'use client';

import { useEffect } from 'react';
import '../lib/reflect'; // Import reflect-metadata first
import { Provider } from 'react-redux';
import { store } from '@/store';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure reflect-metadata is loaded in the client
    require('reflect-metadata');
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
} 