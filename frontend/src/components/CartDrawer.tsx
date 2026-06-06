'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import styles from './CartDrawer.module.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, cartTotal, updateCartQuantity, removeFromCart, checkout } = useApp();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a random visual order reference for the success screen
    const currentOrderId = `ord-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Perform checkout action in context
    const success = checkout();
    if (success) {
      setOrderId(currentOrderId);
      setCheckoutSuccess(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Failed to process checkout. Your cart might be empty.');
    }
  };

  const handleSuccessClose = () => {
    setCheckoutSuccess(false);
    setOrderId('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.drawer} glassmorphism`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Shopping Cart</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {checkoutSuccess ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent-neon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3>Checkout Successful!</h3>
            <p>Thank you for your order. Your purchase has been processed.</p>
            <div className={styles.orderBadge}>Reference: {orderId}</div>
            <button onClick={handleSuccessClose} className={`${styles.successBtn} btn btn-primary`}>
              Continue Shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className={styles.emptyState}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <p>Your shopping cart is empty.</p>
            <button onClick={onClose} className="btn btn-secondary">Go Back to Store</button>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cart.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className={styles.image}
                    />
                  </div>
                  <div className={item.product.name}>
                    <div className={styles.itemHeader}>
                      <h4 className={styles.itemName}>{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className={styles.removeBtn}
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                    <span className={styles.itemPrice}>${item.product.price}</span>
                    <div className={styles.quantityRow}>
                      <span className={styles.qtyLabel}>Quantity:</span>
                      <div className={styles.quantitySelector}>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className={styles.qtyBtn}
                        >
                          -
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className={styles.qtyBtn}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>Total Amount</span>
                <span className={styles.totalPrice}>${cartTotal}</span>
              </div>

              <form onSubmit={handleCheckoutSubmit} className={styles.checkoutForm}>
                {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

                <button type="submit" className={`${styles.checkoutBtn} btn btn-primary`}>
                  Complete Purchase (${cartTotal})
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
