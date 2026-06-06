'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import styles from './BannerSlider.module.css';

export default function BannerSlider() {
  const { banners } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIdx((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentIdx((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Autoplay effect
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, banners.length]);

  if (banners.length === 0) {
    return (
      <div className={styles.sliderEmpty}>
        <p>No banners configured. Add homepage banners in the Admin Panel.</p>
      </div>
    );
  }
  return (
    <div
      className={styles.sliderContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Deck */}
      <div className={styles.sliderTrack}>
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`${styles.slide} ${idx === currentIdx ? styles.slideActive : ''}`}
          >
            {/* Background image */}
            <div className={styles.imageOverlay}>
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className={styles.slideImage}
              />
            </div>

            {/* Content card */}
            <div className={`${styles.contentWrapper} container`}>
              <div className={`${styles.contentCard} glassmorphism animate-fade`}>
                <h1 className={styles.title}>{banner.title}</h1>
                <p className={styles.subtitle}>{banner.subtitle}</p>
                <a href={banner.link} className={`${styles.ctaBtn} btn btn-primary`}>
                  {banner.cta}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={prevSlide} className={`${styles.navBtn} ${styles.prev}`} aria-label="Previous slide">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button onClick={nextSlide} className={`${styles.navBtn} ${styles.next}`} aria-label="Next slide">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className={styles.indicators}>
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`${styles.indicatorDot} ${idx === currentIdx ? styles.indicatorActive : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
