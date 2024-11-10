'use client';

import Head from 'next/head';
import ClientWrapper from '@/components/ClientWrapper';
import LoginPage from '@/app/login/page';

export default function Home() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <ClientWrapper>
        <LoginPage />
      </ClientWrapper>
    </>
  );
}
