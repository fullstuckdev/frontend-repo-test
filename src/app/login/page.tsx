import dynamic from 'next/dynamic';

const LoginPage = dynamic(
  () => import('@/ui/components/auth/LoginPage/LoginPage').then(mod => mod.LoginPage),
  { ssr: false }
);

export default function Page() {
  return <LoginPage />;
} 