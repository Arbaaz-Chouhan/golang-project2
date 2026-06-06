import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AppProvider } from '@/context/AppContext';
import MainLayout from '@/components/MainLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'AuraMart - Modern Tech & Lifestyle Store',
  description: 'Premium tech gadgets, custom mechanical hardware, and high-fidelity acoustics with interactive admin control panels.',
  keywords: 'ecommerce, next.js, golang, technology, custom keyboards, headphones, smart devices',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0f19', color: '#94a3b8', fontFamily: 'sans-serif' }}>Loading AuraMart...</div>}>
          <AppProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
