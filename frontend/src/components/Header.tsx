'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../context/AppContext';
import styles from './Header.module.css';

interface HeaderProps {
  onToggleCart: () => void;
}

export default function Header({ onToggleCart }: HeaderProps) {
  const { cartCount } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/?search=${encodeURIComponent(searchVal.trim())}#shop`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className={`${styles.header} glassmorphism`}>
      <div className={`${styles.headerContainer} container`}>
        <div className={styles.logoArea}>
          <Link href="/" className={styles.logo}>
            AURA<span>MART</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Shop</Link>
          <Link href="/admin" className={styles.navLink}>Admin Dashboard</Link>
        </nav>

        <div className={styles.actions}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>

          <button onClick={onToggleCart} className={styles.cartButton} aria-label="Open Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {cartCount > 0 && (
              <span className={styles.cartCountBadge}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
