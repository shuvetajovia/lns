import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  MapPin, 
  Menu, 
  X, 
  Crown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    totalCartCount, 
    cartSubtotal,
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen,
    deliveryPincode,
    pincodeDistrict,
    setIsPincodeModalOpen,
    setIsAuthModalOpen,
    user,
    products,
    searchQuery,
    setSearchQuery
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter products for search autocomplete
  const searchResults = searchQuery.trim().length >= 2 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tamilName && p.tamilName.includes(searchQuery)) ||
        (p.sanskritName && p.sanskritName.includes(searchQuery)) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectProduct = (id) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* 1. Announcement Bar — Slim Burgundy with Warm Ivory Text */}
      <div className="mn-announcement-bar">
        <div className="mn-announcement-content">
          <span>Rooted in Nature • Inspired by Ayurveda</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span className="mn-announcement-gold">Pure Ayurvedic Herbs & Heritage Grains</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <button 
            onClick={() => setIsPincodeModalOpen(true)}
            className="mn-announcement-btn"
          >
            <MapPin size={12} color="#c5a15b" />
            <span>Deliver to: <strong>{pincodeDistrict} ({deliveryPincode})</strong></span>
            <span style={{ textDecoration: 'underline', color: '#c5a15b', marginLeft: '3px' }}>Change</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Bar — Warm Ivory with Antique Gold Detailing */}
      <header className="mn-header">
        <div className="mn-container mn-nav-container">
          
          {/* Mobile Toggle */}
          <button 
            className="mn-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Navigation"
          >
            <Menu size={26} />
          </button>

          {/* Brand Logo & Botanical Emblem */}
          <Link to="/" className="mn-brand">
            <div className="mn-brand-emblem">
              <Crown size={22} color="#c5a15b" />
            </div>
            <div className="mn-brand-text">
              <h1>Mother Nature</h1>
              <div className="mn-brand-sub">Ayurveda Royalty • Since 2024</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="mn-nav-links">
            <li>
              <Link to="/" className={`mn-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className={`mn-nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>
                Shop All
              </Link>
            </li>
            <li>
              <Link to="/shop?cat=heritage-rice" className="mn-nav-link">
                Heritage Rice
              </Link>
            </li>
            <li>
              <Link to="/shop?cat=ancient-millets" className="mn-nav-link">
                Ancient Millets
              </Link>
            </li>
            <li>
              <Link to="/shop?cat=native-sweeteners" className="mn-nav-link">
                Native Sweeteners
              </Link>
            </li>
            <li>
              <Link to="/shop?cat=cold-pressed-oils" className="mn-nav-link">
                Cold Pressed Oils
              </Link>
            </li>
            <li>
              <a 
                href="/#story" 
                onClick={(e) => {
                  const el = document.getElementById('story');
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="mn-nav-link"
              >
                Our Story
              </a>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="mn-search-wrapper">
            <form onSubmit={handleSearchSubmit} className="mn-search-bar">
              <Search size={16} color="#722f37" />
              <input 
                type="text"
                placeholder="Search Karuppu Kavuni, Tailams, Honey..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                className="mn-search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery("")}
                  style={{ color: '#49352a', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Dropdown Live Results */}
            <AnimatePresence>
              {isSearchFocused && searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: '#ffffff',
                    border: '1.5px solid var(--color-gold)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    boxShadow: 'var(--shadow-card)',
                    zIndex: 150
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-burgundy)', fontWeight: 700, padding: '4px 8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Ayurvedic Formulations
                  </div>
                  {searchResults.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => handleSelectProduct(p.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-ivory)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <img src={p.image} alt={p.name} style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--color-gold)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-deep-brown)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-forest)', fontWeight: 500 }}>{p.tamilName} • {p.weight}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy)' }}>₹{p.price}</div>
                    </div>
                  ))}
                  <div 
                    onClick={() => {
                      setIsSearchFocused(false);
                      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                    }}
                    style={{ 
                      padding: '8px', 
                      textAlign: 'center', 
                      fontSize: '0.8rem', 
                      fontWeight: 600, 
                      color: 'var(--color-burgundy)', 
                      cursor: 'pointer',
                      borderTop: '1px dashed var(--border-gold)',
                      marginTop: '4px'
                    }}
                  >
                    View complete collection <ArrowRight size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Icons: Account, Wishlist, Cart */}
          <div className="mn-header-actions">
            
            <button 
              className="mn-action-icon-btn"
              onClick={() => setIsAuthModalOpen(true)}
              title="Royal Sanctuary Account"
            >
              <User size={19} />
            </button>

            <button 
              className="mn-action-icon-btn"
              onClick={() => setIsWishlistOpen(true)}
              title="Saved Ayurvedic Treasures"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="mn-badge-counter">{wishlist.length}</span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button 
              className="mn-cart-btn-royal"
              onClick={() => setIsCartOpen(true)}
              title="Shopping Cart"
            >
              <ShoppingBag size={18} color="#f5ebd7" />
              <span>₹{cartSubtotal}</span>
              {totalCartCount > 0 && (
                <span style={{ 
                  background: 'var(--color-gold)', 
                  color: 'var(--color-burgundy-dark)',
                  padding: '1px 6px', 
                  borderRadius: '10px', 
                  fontSize: '0.72rem',
                  fontWeight: 800 
                }}>
                  {totalCartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="mn-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '85%',
                maxWidth: '340px',
                background: 'var(--color-ivory-pure)',
                borderRight: '2px solid var(--color-gold)',
                zIndex: 250,
                boxShadow: '10px 0 30px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div className="mn-brand">
                  <div className="mn-brand-emblem" style={{ width: '40px', height: '40px' }}>
                    <Crown size={19} color="#c5a15b" />
                  </div>
                  <div>
                    <div className="mn-brand-text">
                      <h1 style={{ fontSize: '1.25rem' }}>Mother Nature</h1>
                      <div className="mn-brand-sub">Ayurveda Royalty</div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '6px' }}>
                  <X size={22} color="#722f37" />
                </button>
              </div>

              {/* Mobile Search */}
              <form 
                onSubmit={(e) => {
                  handleSearchSubmit(e);
                  setIsMobileMenuOpen(false);
                }} 
                style={{ marginBottom: '1.5rem' }}
                className="mn-search-bar"
              >
                <Search size={16} color="#722f37" />
                <input 
                  type="text" 
                  placeholder="Search remedies..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mn-search-input"
                />
              </form>

              {/* Mobile Navigation Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', flex: 1, overflowY: 'auto' }}>
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-burgundy)' }}
                >
                  Home
                </Link>
                <Link 
                  to="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-burgundy)' }}
                >
                  Shop All Collections
                </Link>
                <Link 
                  to="/shop?cat=heritage-rice" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontSize: '0.92rem', color: 'var(--color-deep-brown)', paddingLeft: '0.5rem' }}
                >
                  🌾 Heritage Rice
                </Link>
                <Link 
                  to="/shop?cat=ancient-millets" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontSize: '0.92rem', color: 'var(--color-deep-brown)', paddingLeft: '0.5rem' }}
                >
                  🌱 Ancient Millets
                </Link>
                <Link 
                  to="/shop?cat=native-sweeteners" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontSize: '0.92rem', color: 'var(--color-deep-brown)', paddingLeft: '0.5rem' }}
                >
                  🍯 Native Sweeteners
                </Link>
                <Link 
                  to="/shop?cat=essential-minerals" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontSize: '0.92rem', color: 'var(--color-deep-brown)', paddingLeft: '0.5rem' }}
                >
                  🧂 Essential Minerals
                </Link>
                <Link 
                  to="/shop?cat=forest-harvest" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontSize: '0.92rem', color: 'var(--color-deep-brown)', paddingLeft: '0.5rem' }}
                >
                  🌿 Forest Harvest
                </Link>
                <Link 
                  to="/shop?cat=cold-pressed-oils" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontSize: '0.92rem', color: 'var(--color-deep-brown)', paddingLeft: '0.5rem' }}
                >
                  💧 Cold Pressed Oils
                </Link>
                <a 
                  href="/#story" 
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('story');
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-burgundy)' }}
                >
                  Our Heritage Story
                </a>
                <a 
                  href="https://wa.me/919360013709?text=Hello%20Mother%20Nature%20Sanctuary"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-burgundy)' }}
                >
                  WhatsApp Consultation Desk
                </a>
              </div>

              {/* Delivery District Info */}
              <div style={{ paddingTop: '1.2rem', borderTop: '1px solid var(--border-gold)' }}>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsPincodeModalOpen(true);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-burgundy)', fontWeight: 600, marginBottom: '0.8rem' }}
                >
                  <MapPin size={16} color="#c5a15b" />
                  <span>Deliver to: {pincodeDistrict} ({deliveryPincode})</span>
                </button>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-brown-muted)' }}>
                  Handcrafted in Kanchipuram, Tamil Nadu
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
