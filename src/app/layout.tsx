'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Providers } from './providers';
import { theme } from '@/theme';
import { Box } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
          <Providers>{children}</Providers>
        </Box>
      </body>
    </html>
  );
}
