'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  products: Product[];
  banners: Banner[];
  cart: CartItem[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, updated: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => boolean;
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aether Noise-Canceling Headphones',
    description: 'Experience pure sonic bliss with hybrid active noise cancellation, 40-hour battery life, and high-fidelity 40mm drivers tuned for rich acoustic response.',
    price: 299,
    category: 'Electronics',
    image: '/product_headphones.png',
    stock: 25,
  },
  {
    id: 'prod-2',
    name: 'Tactile Custom Mechanical Keyboard',
    description: 'Sleek custom hot-swappable mechanical keyboard featuring tactile brown switches, premium custom grey-orange keycaps, and custom ambient RGB backlighting.',
    price: 149,
    category: 'Electronics',
    image: '/product_keyboard.png',
    stock: 12,
  },
  {
    id: 'prod-3',
    name: 'Aura Ambient Smart Desk Lamp',
    description: 'Transform your room atmosphere with a warm ambient smart desk lamp made of premium black steel and walnut wood. Integrates with smart home assistants.',
    price: 79,
    category: 'Home Living',
    image: '/product_lamp.png',
    stock: 30,
  },
];

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'The Next Generation of Smart Tech',
    subtitle: 'Explore our curated selection of high-fidelity audio and futuristic workspace gear.',
    image: '/banner_tech.png',
    cta: 'Shop Tech Gear',
    link: '#shop',
  },
  {
    id: 'ban-2',
    title: 'Minimalist Techwear Drop',
    subtitle: 'High-performance materials meeting clean streetwear styling. Elevate your wardrobe.',
    image: '/banner_fashion.png',
    cta: 'Explore Apparel',
    link: '#shop',
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client-side mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProducts = localStorage.getItem('auramart_products');
      const storedBanners = localStorage.getItem('auramart_banners');
      const storedCart = localStorage.getItem('auramart_cart');

      setProducts(storedProducts ? JSON.parse(storedProducts) : DEFAULT_PRODUCTS);
      setBanners(storedBanners ? JSON.parse(storedBanners) : DEFAULT_BANNERS);
      setCart(storedCart ? JSON.parse(storedCart) : []);
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('auramart_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('auramart_banners', JSON.stringify(banners));
    }
  }, [banners, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('auramart_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Product actions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    // Also update instances in the cart
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? { ...item, product: { ...item.product, ...updated } }
          : item
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    // Remove from cart if it's there
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  // Banner actions
  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      ...banner,
      id: `ban-${Date.now()}`,
    };
    setBanners((prev) => [...prev, newBanner]);
  };

  const updateBanner = (id: string, updated: Partial<Banner>) => {
    setBanners((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((item) => item.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout action (simplified - no orders stored)
  const checkout = (): boolean => {
    if (cart.length === 0) return false;

    // Deduct stock for products
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((item) => item.product.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
      }
      return prod;
    });

    setProducts(updatedProducts);
    clearCart();
    return true;
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        products,
        banners,
        cart,
        addProduct,
        updateProduct,
        deleteProduct,
        addBanner,
        updateBanner,
        deleteBanner,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkout,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
