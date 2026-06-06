'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApp, Product, Banner } from '@/context/AppContext';
import styles from './page.module.css';

type TabType = 'overview' | 'products' | 'banners';

export default function AdminDashboard() {
  const {
    products,
    banners,
    updateProduct,
    deleteProduct,
    addBanner,
    updateBanner,
    deleteBanner,
  } = useApp();

  const searchParams = useSearchParams();
  const router = useRouter();

  // Derive active tab from URL query params (defaults to 'overview')
  const tabParam = searchParams.get('tab') as TabType;
  const activeTab = (tabParam && ['overview', 'products', 'banners'].includes(tabParam)) ? tabParam : 'overview';

  const handleTabChange = (tab: TabType) => {
    router.push(`/admin?tab=${tab}`);
  };

  // --- Product Modal State & Form ---
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    stock: 0,
  });

  const openEditProdModal = (product: Product) => {
    setEditingProduct(product);
    setProdForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    });
    setIsProdModalOpen(true);
  };

  const handleProdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, prodForm);
    }
    setIsProdModalOpen(false);
  };

  // --- Banner Modal State & Form ---
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    cta: '',
    link: '',
  });

  const openAddBannerModal = () => {
    setEditingBanner(null);
    setBannerForm({
      title: '',
      subtitle: '',
      image: '/banner_tech.png',
      cta: 'Explore More',
      link: '#shop',
    });
    setIsBannerModalOpen(true);
  };

  const openEditBannerModal = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      cta: banner.cta,
      link: banner.link,
    });
    setIsBannerModalOpen(true);
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner(editingBanner.id, bannerForm);
    } else {
      addBanner(bannerForm);
    }
    setIsBannerModalOpen(false);
  };

  // Calculate stats
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).length;

  return (
    <div className={styles.adminPage}>
      <div className={`${styles.container} container`}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Admin Panel</h1>
            <p className={styles.subtitle}>Manage catalog and banner designs.</p>
          </div>
        </div>

        {/* Sidebar + Workspace layout */}
        <div className={styles.dashboardLayout}>
          {/* Sidebar Tabs */}
          <aside className={`${styles.sidebar} glassmorphism`}>
            <button
              onClick={() => handleTabChange('overview')}
              className={`${styles.sidebarTab} ${activeTab === 'overview' ? styles.sidebarTabActive : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
              Overview
            </button>
            <button
              onClick={() => handleTabChange('products')}
              className={`${styles.sidebarTab} ${activeTab === 'products' ? styles.sidebarTabActive : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              Products ({products.length})
            </button>
            <button
              onClick={() => handleTabChange('banners')}
              className={`${styles.sidebarTab} ${activeTab === 'banners' ? styles.sidebarTabActive : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              Banners ({banners.length})
            </button>
          </aside>

          {/* Workspace area */}
          <div className={styles.workspace}>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className={`${styles.tabContent} animate-fade`}>
                <div className={styles.statsGrid}>
                  <div className={`${styles.statCard} glassmorphism`}>
                    <span className={styles.statLabel}>Catalog Size</span>
                    <span className={styles.statValue}>{products.length} Items</span>
                  </div>
                  <div className={`${styles.statCard} glassmorphism`}>
                    <span className={styles.statLabel}>Active Banners</span>
                    <span className={styles.statValue}>{banners.length} Slides</span>
                  </div>
                  <div className={`${styles.statCard} glassmorphism`}>
                    <span className={styles.statLabel}>Categories</span>
                    <span className={styles.statValue}>{uniqueCategories} Groups</span>
                  </div>
                </div>

                <div className={`${styles.recentLogs} glassmorphism`}>
                  <h3>System Status</h3>
                  <div className={styles.logList}>
                    <div className={styles.logItem}>
                      <span className={styles.logDot}></span>
                      <span className={styles.logText}>Next.js frontend initialized.</span>
                    </div>
                    <div className={styles.logItem}>
                      <span className={styles.logDot}></span>
                      <span className={styles.logText}>Local persistence: active.</span>
                    </div>
                    <div className={styles.logItem}>
                      <span className={styles.logDot}></span>
                      <span className={styles.logText}>Ready for Golang API connection.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className={`${styles.tabContent} animate-fade`}>
                <div className={styles.actionBar}>
                  <h3>Products Catalog</h3>
                </div>

                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Details</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id}>
                          <td>
                            <div className={styles.tableImgWrapper}>
                              <Image
                                src={prod.image}
                                alt={prod.name}
                                fill
                                sizes="50px"
                                className={styles.tableImg}
                              />
                            </div>
                          </td>
                          <td>
                            <div className={styles.tableNameCol}>
                              <span className={styles.tableName}>{prod.name}</span>
                              <span className={styles.tableId}>{prod.id}</span>
                            </div>
                          </td>
                          <td>{prod.category}</td>
                          <td className={styles.tablePrice}>${prod.price}</td>
                          <td>
                            <span className={prod.stock > 0 ? styles.inStockText : styles.outStockText}>
                              {prod.stock} units
                            </span>
                          </td>
                          <td>
                            <div className={styles.tableActions}>
                              <button onClick={() => openEditProdModal(prod)} className={styles.editBtn}>
                                Edit
                              </button>
                              <button onClick={() => deleteProduct(prod.id)} className={styles.deleteBtn}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BANNERS TAB */}
            {activeTab === 'banners' && (
              <div className={`${styles.tabContent} animate-fade`}>
                <div className={styles.actionBar}>
                  <h3>Promotion Banners</h3>
                  <button onClick={openAddBannerModal} className="btn btn-primary">
                    Add New Banner
                  </button>
                </div>

                <div className={styles.bannersListGrid}>
                  {banners.map((banner) => (
                    <div key={banner.id} className={`${styles.bannerCard} glassmorphism`}>
                      <div className={styles.bannerCardImageWrapper}>
                        <Image
                          src={banner.image}
                          alt={banner.title}
                          fill
                          sizes="150px"
                          className={styles.bannerCardImage}
                        />
                      </div>
                      <div className={styles.bannerCardInfo}>
                        <h4>{banner.title}</h4>
                        <p>{banner.subtitle}</p>
                        <div className={styles.bannerMeta}>
                          <span>CTA: <strong>{banner.cta}</strong></span>
                          <span>Link: <strong>{banner.link}</strong></span>
                        </div>
                        <div className={styles.bannerCardActions}>
                          <button onClick={() => openEditBannerModal(banner)} className={styles.editBtn}>
                            Edit Banner
                          </button>
                          <button onClick={() => deleteBanner(banner.id)} className={styles.deleteBtn}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PRODUCT EDIT MODAL --- */}
      {isProdModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsProdModalOpen(false)}>
          <div className={`${styles.modal} glassmorphism`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Edit Product</h3>
              <button onClick={() => setIsProdModalOpen(false)} className={styles.modalCloseBtn}>
                &times;
              </button>
            </div>
            <form onSubmit={handleProdSubmit} className={styles.modalForm}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="form-control"
                  rows={3}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Level</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="form-control"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Home Living">Home Living</option>
                    <option value="Apparel">Apparel</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Product Image Path</label>
                  <select
                    value={prodForm.image}
                    onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                    className="form-control"
                  >
                    <option value="/product_headphones.png">Headphones Image</option>
                    <option value="/product_keyboard.png">Keyboard Image</option>
                    <option value="/product_lamp.png">Smart Lamp Image</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsProdModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- BANNER EDIT/ADD MODAL --- */}
      {isBannerModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsBannerModalOpen(false)}>
          <div className={`${styles.modal} glassmorphism`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingBanner ? 'Edit Slider Banner' : 'Add Promo Banner'}</h3>
              <button onClick={() => setIsBannerModalOpen(false)} className={styles.modalCloseBtn}>
                &times;
              </button>
            </div>
            <form onSubmit={handleBannerSubmit} className={styles.modalForm}>
              <div className="form-group">
                <label>Banner Title</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subtitle / Description</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label>CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.cta}
                    onChange={(e) => setBannerForm({ ...bannerForm, cta: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CTA Link Anchor</label>
                  <input
                    type="text"
                    value={bannerForm.link}
                    onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Slide Image Theme</label>
                <select
                  value={bannerForm.image}
                  onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                  className="form-control"
                >
                  <option value="/banner_tech.png">Tech Gadgets Theme</option>
                  <option value="/banner_fashion.png">Fashion Streetwear Theme</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsBannerModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBanner ? 'Save Changes' : 'Add Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// 