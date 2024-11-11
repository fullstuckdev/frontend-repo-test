'use client';

import Head from 'next/head';
import { ClientOnly } from '@/ui/components/common/ClientOnly/ClientOnly';
import LoginPage from '@/app/login/page';

export default function Home() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <ClientOnly>
        <LoginPage />
      </ClientOnly>
    </>
  );
}