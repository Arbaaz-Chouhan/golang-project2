'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetail({ params }: PageProps) {
  // Resolve params in Client Component using React.use
  const { id } = React.use(params);
  const { products, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className={`${styles.notFound} container`}>
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link href="/" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  };

  const handleQtyChange = (val: number) => {
    if (val < 1 || val > product.stock) return;
    setQuantity(val);
  };

  // Find related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // If no related products in same category, get any other products
  const backupRelated = relatedProducts.length > 0
    ? relatedProducts
    : products.filter((p) => p.id !== product.id).slice(0, 3);

  // Specifications mock data based on item name
  const specs = [
    { label: 'Manufacturer Warranty', value: '2 Years Limited' },
    { label: 'Condition', value: 'Brand New (Sealed Box)' },
    { label: 'Package Contents', value: `${product.name}, User Manual, Connection Cables` },
    { label: 'Category', value: product.category },
  ];

  return (
    <div className={styles.detailPage}>
      <div className={`${styles.container} container`}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Shop</Link>
          <span className={styles.separator}>/</span>
          <Link href={`/?category=${product.category}#shop`}>{product.category}</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.activeLink}>{product.name}</span>
        </div>

        {/* Main Product Panel */}
        <div className={styles.productPanel}>
          {/* Left Column: Image */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.mainImage}
              />
            </div>
          </div>

          {/* Right Column: Information */}
          <div className={styles.infoCol}>
            <span className={styles.categoryLabel}>{product.category}</span>
            <h1 className={styles.productName}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <span className={styles.ratingText}>5.0 (42 customer reviews)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price}</span>
              {product.stock > 0 ? (
                <span className={`${styles.stockBadge} ${styles.inStock}`}>In Stock</span>
              ) : (
                <span className={`${styles.stockBadge} ${styles.outOfStock}`}>Out of Stock</span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {product.stock > 0 ? (
              <div className={styles.actionBlock}>
                <div className={styles.qtyBlock}>
                  <span className={styles.qtyLabel}>Quantity:</span>
                  <div className={styles.qtySelector}>
                    <button onClick={() => handleQtyChange(quantity - 1)} className={styles.qtyBtn}>
                      -
                    </button>
                    <span className={styles.qtyValue}>{quantity}</span>
                    <button onClick={() => handleQtyChange(quantity + 1)} className={styles.qtyBtn}>
                      +
                    </button>
                  </div>
                  <span className={styles.stockLimit}>({product.stock} available)</span>
                </div>

                <div className={styles.buttonsRow}>
                  <button onClick={handleAddToCart} className={`${styles.addBtn} btn btn-primary`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    Add to Cart
                  </button>
                </div>

                {addedNotification && (
                  <div className={styles.notification}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Added {quantity} unit{quantity > 1 ? 's' : ''} to cart!
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.outOfStockBlock}>
                <p>This item is currently out of stock. We expect restock soon.</p>
                <Link href="/" className="btn btn-secondary">
                  Continue Browsing
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Specifications Section */}
        <section className={styles.specsSection}>
          <h3 className={styles.sectionTitle}>Product Specifications</h3>
          <div className={styles.specsTable}>
            {specs.map((spec) => (
              <div key={spec.label} className={styles.specRow}>
                <span className={styles.specLabel}>{spec.label}</span>
                <span className={styles.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products Section */}
        <section className={styles.relatedSection}>
          <h3 className={styles.sectionTitle}>Recommended Hardware</h3>
          <div className={styles.relatedGrid}>
            {backupRelated.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
