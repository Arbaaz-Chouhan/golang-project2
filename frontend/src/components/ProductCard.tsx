'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp, Product } from '../context/AppContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page when clicking button
    addToCart(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.productImage}
          priority={false}
        />
        <div className={styles.categoryBadge}>{product.category}</div>
      </div>

      <div className={styles.details}>
        <div className={styles.rating}>
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            ))}
          </div>
          <span className={styles.stockLabel}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.footerRow}>
          <span className={styles.price}>${product.price}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`${styles.addToCartBtn} btn`}
            aria-label="Add to cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
