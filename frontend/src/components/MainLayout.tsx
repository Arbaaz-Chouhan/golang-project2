'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const searchParams = useSearchParams();
  const [prevParams, setPrevParams] = useState(searchParams.toString());

  if (prevParams !== searchParams.toString()) {
    setPrevParams(searchParams.toString());
    setIsCartOpen(false);
  }

  return (
    <>
      <Header onToggleCart={() => setIsCartOpen((prev) => !prev)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
