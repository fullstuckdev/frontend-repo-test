
import type { Metadata } from 'next';
import { Providers } from './providers';
import '@/ui/styles/globals.css';

export const metadata: Metadata = {
  title: 'My App - Home',
  description: 'Welcome to My App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
