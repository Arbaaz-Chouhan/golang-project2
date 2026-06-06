'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              AURA<span>MART</span>
            </Link>
            <p className={styles.description}>
              Elevate your workspace and lifestyle with our curated catalog of next-generation gadgets, custom mechanical hardware, and high-fidelity acoustics.
            </p>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Shop Categories</h4>
            <ul className={styles.linksList}>
              <li><Link href="/?category=Electronics#shop">Electronics</Link></li>
              <li><Link href="/?category=Home%20Living#shop">Home & Living</Link></li>
              <li><Link href="/?category=Apparel#shop">Wearables</Link></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Management</h4>
            <ul className={styles.linksList}>
              <li><Link href="/admin">Operator Panel</Link></li>
              <li><Link href="/admin?tab=products">Product Manager</Link></li>
              <li><Link href="/admin?tab=banners">Banner Settings</Link></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Security & Tech</h4>
            <p className={styles.techText}>
              Built using Next.js App Router for frontend reactivity. Ready for integration with custom Golang REST API backend.
            </p>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} AuraMart. All rights reserved. Created for Cybersecurity & Development.
          </p>
        </div>
      </div>
    </footer>
  );
}
