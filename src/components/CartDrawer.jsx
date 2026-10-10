import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Sparkles,
  Crown
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQty,
    cartSubtotal,
    discountAmount,
    deliveryFee,
    cartTotal,
    amountNeededForFreeDelivery,
    freeDeliveryThreshold,
    appliedCoupon,
    couponCode,
    setCouponCode,
    applyCoupon,
    removeCoupon
  } = useShop();

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const percentToFreeDelivery = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            className="mn-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Box */}
          <motion.div 
            className="mn-cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="mn-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={20} color="#c5a15b" />
                <h2 className="mn-drawer-title">Royal Bag ({cart.length})</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                style={{ padding: '6px', color: 'var(--color-deep-brown)' }}
                aria-label="Close Cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Free Delivery Bar */}
            <div className="mn-free-delivery-banner">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>
                  {amountNeededForFreeDelivery === 0 ? (
                    <span style={{ color: 'var(--color-forest-dark)', fontWeight: 700 }}>
                      🎉 Congratulations! You have unlocked Free Royal Delivery!
                    </span>
                  ) : (
                    <span>Add <strong>₹{amountNeededForFreeDelivery}</strong> more for Free Royal Delivery</span>
                  )}
                </span>
                <span>{percentToFreeDelivery}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#d6ded0', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${percentToFreeDelivery}%`, 
                    background: 'var(--color-forest)', 
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>
            </div>

            {/* Items List */}
            <div className="mn-drawer-items">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: 'var(--color-ivory)', 
                    border: '1.5px solid var(--color-gold)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 1.5rem auto',
                    color: 'var(--color-burgundy)'
                  }}>
                    <ShoppingBag size={28} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-deep-brown)', marginBottom: '0.5rem' }}>
                    Your Royal Bag is Empty
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-brown-muted)', marginBottom: '1.5rem' }}>
                    Explore our botanical remedies, unpolished heritage grains, and wood-pressed tailams.
                  </p>
                  <button 
                    className="mn-btn mn-btn-burgundy"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/shop');
                    }}
                  >
                    Explore Ayurvedic Apothecary
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartId} className="mn-cart-item">
                    <img src={item.image} alt={item.name} className="mn-cart-thumb" />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 className="mn-cart-item-name">{item.name}</h4>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                            {item.variantWeight || item.weight} {item.tamilName && `• ${item.tamilName}`}
                          </span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          style={{ color: '#888', padding: '2px' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-burgundy)' }}>
                            ₹{item.price * item.qty}
                          </span>
                          {item.oldPrice && (
                            <span style={{ fontSize: '0.78rem', color: '#999', textDecoration: 'line-through' }}>
                              ₹{item.oldPrice * item.qty}
                            </span>
                          )}
                        </div>

                        {/* Qty Counter */}
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
                            onClick={() => updateCartQty(item.cartId, item.qty - 1)}
                            style={{ color: 'var(--color-burgundy)', padding: '2px' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                            {item.qty}
                          </span>
                          <button 
                            onClick={() => updateCartQty(item.cartId, item.qty + 1)}
                            style={{ color: 'var(--color-burgundy)', padding: '2px' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="mn-drawer-footer">
                
                {/* Coupon Code Strip */}
                <div style={{ marginBottom: '1rem' }}>
                  {appliedCoupon.isApplied ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      background: 'var(--color-forest-soft)', 
                      border: '1px solid var(--color-sage)',
                      padding: '0.5rem 0.8rem', 
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-forest-dark)', fontWeight: 600 }}>
                        <Tag size={14} />
                        <span>Code <strong>{appliedCoupon.code}</strong> Applied (-{appliedCoupon.discountPercent}%)</span>
                      </div>
                      <button 
                        onClick={removeCoupon}
                        style={{ color: 'var(--color-burgundy)', fontSize: '0.76rem', textDecoration: 'underline', fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input 
                        type="text"
                        placeholder="Coupon code (Try: NATURE10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.45rem 0.8rem',
                          borderRadius: 'var(--radius-pill)',
                          border: '1px solid var(--border-gold)',
                          fontSize: '0.82rem',
                          background: '#ffffff',
                          outline: 'none'
                        }}
                      />
                      <button 
                        onClick={() => applyCoupon(couponCode || "NATURE10")}
                        style={{
                          background: 'var(--color-forest)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 'var(--radius-pill)',
                          padding: '0.45rem 1rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', color: 'var(--color-brown-muted)', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Heritage Subtotal</span>
                    <span>₹{cartSubtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-forest-dark)', fontWeight: 600 }}>
                      <span>Royal Privilege Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Safe Packaging & Delivery</span>
                    <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--color-forest)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontFamily: 'var(--font-serif)', 
                    fontSize: '1.35rem', 
                    fontWeight: 700, 
                    color: 'var(--color-burgundy)', 
                    borderTop: '1px dashed var(--border-gold)', 
                    paddingTop: '0.6rem', 
                    marginTop: '0.4rem' 
                  }}>
                    <span>Total Payable</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>

                {/* Primary Button: Proceed to Checkout with Razorpay */}
                <button 
                  className="mn-btn mn-btn-burgundy"
                  style={{ width: '100%', padding: '0.85rem' }}
                  onClick={handleProceedToCheckout}
                >
                  <span>Proceed to Royal Checkout</span>
                  <ArrowRight size={16} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '0.8rem', fontSize: '0.74rem', color: 'var(--color-brown-muted)' }}>
                  <ShieldCheck size={14} color="#344b35" />
                  <span>Verified 100% Secure via <strong>Razorpay</strong> Gateway</span>
                </div>

              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
