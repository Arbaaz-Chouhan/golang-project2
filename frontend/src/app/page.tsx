'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

export default function Home() {
  const { products } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';

  // Extract unique categories from actual products list
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const handleCategorySelect = (category: string) => {
    // Update URL query parameters
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/?${params.toString()}#shop`);
  };

  const handleClearFilters = () => {
    router.push('/');
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.homePage}>
      {/* Hero Banner Section */}
      <section className={styles.heroSection}>
        <BannerSlider />
      </section>

      {/* Main shop section */}
      <section id="shop" className={`${styles.shopSection} container`}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleArea}>
            <h2 className={styles.sectionTitle}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Collections'}
            </h2>
            <p className={styles.sectionSubtitle}>
              Handpicked premium hardware designed for performance and aesthetics.
            </p>
          </div>

          {/* Category Tabs */}
          <div className={styles.categoriesRow}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.categoryTabActive : ''
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className={`${styles.noResults} glassmorphism`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            <h3>No Products Found</h3>
            <p>We couldn&apos;t find any items matching your current filters or search terms.</p>
            <button onClick={handleClearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <div key={product.id} className="animate-fade">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
