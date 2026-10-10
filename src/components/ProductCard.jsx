import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Plus, Minus, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { 
    addToCart, 
    cart, 
    updateCartQty, 
    toggleWishlist, 
    isInWishlist 
  } = useShop();

  const isFavorite = isInWishlist(product.id);
  const cartItem = cart.find(item => item.id === product.id && (!item.variantWeight || item.variantWeight === product.weight));

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <motion.div 
      className="mn-product-card"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      {/* Product Image & Badges */}
      <div className="mn-prod-image-wrap" onClick={handleCardClick}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="mn-prod-image"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="mn-prod-badges-top">
          {product.badge && (
            <span className="mn-badge mn-badge-burgundy">
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="mn-badge mn-badge-gold">
              {product.discount}
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button 
          className={`mn-prod-wishlist-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isFavorite ? "Remove from Saved" : "Save to Favorites"}
          aria-label="Save to Wishlist"
        >
          <Heart 
            size={18} 
            fill={isFavorite ? "var(--color-burgundy)" : "none"} 
            color={isFavorite ? "var(--color-burgundy)" : "#6b5548"} 
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="mn-prod-body">
        
        {/* Rating & Dosha Pill */}
        <div className="mn-prod-rating-row">
          <div className="mn-rating-pill">
            <Star size={13} fill="#c5a15b" color="#c5a15b" />
            <span>{product.rating}</span>
            <span style={{ color: 'var(--color-brown-muted)', fontWeight: 400 }}>({product.reviewsCount})</span>
          </div>
          {product.dosha && (
            <span className="mn-prod-dosha">{product.dosha}</span>
          )}
        </div>

        {/* Product Names (English & Authentic Tamil/Sanskrit) */}
        <h3 className="mn-prod-title" onClick={handleCardClick}>
          {product.name}
        </h3>
        <div className="mn-prod-subtitle">
          {product.tamilName} {product.sanskritName && `• ${product.sanskritName}`}
        </div>

        {/* Short Ayurvedic Description */}
        <p className="mn-prod-desc-short">
          {product.shortDesc || product.description}
        </p>

        {/* Price & Primary Purchase Action */}
        <div className="mn-prod-bottom-row">
          <div>
            <div className="mn-prod-price-box">
              <span className="mn-price-now">₹{product.price}</span>
              {product.oldPrice > product.price && (
                <span className="mn-price-was">₹{product.oldPrice}</span>
              )}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-brown-muted)', fontWeight: 600 }}>
              Vol: {product.weight}
            </span>
          </div>

          {/* Add to Cart or Quantity Controls */}
          {cartItem ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-ivory)',
              border: '1px solid var(--color-gold)',
              borderRadius: 'var(--radius-pill)',
              padding: '2px 8px'
            }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQty(cartItem.cartId, cartItem.qty - 1);
                }}
                style={{ color: 'var(--color-burgundy)', padding: '2px 4px' }}
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-deep-brown)' }}>
                {cartItem.qty}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQty(cartItem.cartId, cartItem.qty + 1);
                }}
                style={{ color: 'var(--color-burgundy)', padding: '2px 4px' }}
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button 
              className="mn-btn-add-cart-card"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={14} color="#f5ebd7" />
              <span>Add to Cart</span>
            </button>
          )}

        </div>

      </div>
    </motion.div>
  );
};
