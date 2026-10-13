import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Crown, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    deliveryPincode,
    pincodeDistrict,
    setIsPincodeModalOpen,
    setIsCartOpen
  } = useShop();

  const product = products.find(p => p.id === parseInt(id));

  // If not found
  if (!product) {
    return (
      <div style={{ padding: '8rem 1rem', textAlign: 'center', background: 'var(--color-ivory)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
          Formulation Not Found
        </h2>
        <p style={{ color: 'var(--color-brown-muted)', marginBottom: '1.5rem' }}>
          This specific harvest or botanical preparation is currently resting or not catalogued.
        </p>
        <button className="mn-btn mn-btn-burgundy" onClick={() => navigate('/shop')}>
          Return to Royal Apothecary
        </button>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedVariant, setSelectedVariant] = useState(product.variants ? product.variants[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'ingredients', 'howToUse', 'sourcing'

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOldPrice = selectedVariant ? selectedVariant.oldPrice : product.oldPrice;
  const currentWeight = selectedVariant ? selectedVariant.weight : product.weight;
  const isFavorite = isInWishlist(product.id);

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', background: 'var(--color-ivory)' }}>
      <div className="mn-container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-brown-muted)', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ color: 'var(--color-burgundy)', fontWeight: 600 }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'var(--color-burgundy)', fontWeight: 600 }}>Apothecary</Link>
          <span>/</span>
          <Link to={`/shop?cat=${product.categoryId}`} style={{ color: 'var(--color-burgundy)', fontWeight: 600 }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-deep-brown)', fontWeight: 700 }}>{product.name}</span>
        </div>

        {/* Product Main Showcase Grid */}
        <div className="mn-pdp-showcase">
          
          {/* Left Column: Image Gallery */}
          <div>
            <div className="mn-pdp-image-box">
              <img 
                src={selectedImage} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.badge && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="mn-badge mn-badge-burgundy">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.gallery && product.gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.gallery.map((imgUrl, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: `2px solid ${selectedImage === imgUrl ? 'var(--color-gold)' : 'var(--border-ivory)'}`,
                      padding: 0
                    }}
                  >
                    <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Purchase Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <div>
                <span className="mn-badge mn-badge-sage" style={{ marginBottom: '0.6rem' }}>
                  {product.category}
                </span>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-deep-brown)', lineHeight: 1.15 }}>
                  {product.name}
                </h1>
                {product.tamilName && (
                  <div style={{ fontSize: '1.05rem', color: 'var(--color-burgundy)', fontWeight: 600, marginTop: '4px' }}>
                    {product.tamilName}
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: isFavorite ? 'var(--color-ivory)' : '#ffffff',
                  border: '1.5px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isFavorite ? 'var(--color-burgundy)' : 'var(--color-deep-brown)',
                  transition: 'all 0.2s ease'
                }}
                title="Save to Royal Wishlist"
              >
                <Heart size={22} fill={isFavorite ? "var(--color-burgundy)" : "none"} />
              </button>
            </div>

            {/* Rating & Review */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.8rem 0 1.5rem 0' }}>
              <div style={{ display: 'flex', gap: '2px', color: 'var(--color-gold)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={17} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep-brown)' }}>
                {product.rating} / 5.0
              </span>
              <span style={{ fontSize: '0.84rem', color: 'var(--color-brown-muted)' }}>
                ({product.reviewsCount} verified royal patrons)
              </span>
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px dashed var(--border-gold)', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-burgundy)' }}>
                ₹{currentPrice}
              </span>
              {currentOldPrice > currentPrice && (
                <span style={{ fontSize: '1.15rem', color: 'var(--color-brown-muted)', textDecoration: 'line-through' }}>
                  ₹{currentOldPrice}
                </span>
              )}
              <span style={{ fontSize: '0.82rem', color: 'var(--color-forest-dark)', fontWeight: 700, background: 'var(--color-forest-soft)', padding: '2px 8px', borderRadius: '4px' }}>
                Save ₹{currentOldPrice - currentPrice} (Inclusive of all duties)
              </span>
            </div>

            {/* Short Ayurvedic Description */}
            <p style={{ fontSize: '0.98rem', color: 'var(--color-brown-muted)', lineHeight: 1.7, marginBottom: '1.8rem' }}>
              {product.description}
            </p>

            {/* Volume / Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-deep-brown)', letterSpacing: '1px', marginBottom: '8px' }}>
                  Select Traditional Packaging Size:
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.variants.map((v, idx) => {
                    const isSelected = selectedVariant && selectedVariant.weight === v.weight;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(v)}
                        style={{
                          padding: '0.6rem 1.4rem',
                          borderRadius: 'var(--radius-pill)',
                          border: `1.5px solid ${isSelected ? 'var(--color-gold)' : 'var(--border-ivory)'}`,
                          background: isSelected ? 'var(--color-burgundy)' : '#ffffff',
                          color: isSelected ? 'var(--color-ivory-pure)' : 'var(--color-deep-brown)',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {v.weight} — ₹{v.price}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Availability Pill */}
            {(() => {
              const isOutOfStock = Boolean(product.isOutOfStock || (product.stock !== undefined && product.stock <= 0));
              return (
                <div style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isOutOfStock ? (
                    <span style={{
                      padding: '4px 12px',
                      background: '#ffebe9',
                      color: '#b91c1c',
                      border: '1px solid #fecdd3',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      ● Currently Out of Stock — Restocking Soon
                    </span>
                  ) : (
                    <span style={{
                      padding: '4px 12px',
                      background: '#f0fdf4',
                      color: '#166534',
                      border: '1px solid #bbf7d0',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      ● In Stock ({product.stock} units available)
                    </span>
                  )}
                </div>
              );
            })()}

            {/* Quantity Selector & Action Buttons */}
            {(() => {
              const isOutOfStock = Boolean(product.isOutOfStock || (product.stock !== undefined && product.stock <= 0));
              return (
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  
                  {/* Qty Box */}
                  {!isOutOfStock && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#ffffff',
                      border: '1.5px solid var(--border-gold)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.4rem 0.8rem',
                      gap: '12px'
                    }}>
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{ color: 'var(--color-burgundy)', padding: '2px' }}
                      >
                        <Minus size={15} />
                      </button>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, minWidth: '22px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                        style={{ color: 'var(--color-burgundy)', padding: '2px' }}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  )}

                  {/* Add to Cart */}
                  {isOutOfStock ? (
                    <button 
                      className="mn-btn"
                      disabled
                      style={{
                        flex: 1,
                        minWidth: '220px',
                        background: '#e4ddd3',
                        color: '#82766d',
                        border: '1.5px solid #d2c5b7',
                        cursor: 'not-allowed',
                        boxShadow: 'none'
                      }}
                    >
                      <span>Item Out of Stock</span>
                    </button>
                  ) : (
                    <>
                      <button 
                        className="mn-btn mn-btn-burgundy"
                        style={{ flex: 1, minWidth: '180px' }}
                        onClick={handleAddToCart}
                      >
                        <ShoppingBag size={17} />
                        <span>Add to Royal Bag</span>
                      </button>

                      {/* Buy Now (Direct to Razorpay checkout) */}
                      <button 
                        className="mn-btn mn-btn-forest"
                        onClick={handleBuyNow}
                      >
                        <span>Instant Checkout</span>
                      </button>
                    </>
                  )}

                </div>
              );
            })()}

            {/* Delivery Verification Widget */}
            <div style={{
              background: 'var(--color-ivory)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={20} color="#722f37" />
                <div style={{ fontSize: '0.84rem', color: 'var(--color-deep-brown)' }}>
                  Dispatch to <strong>{pincodeDistrict} ({deliveryPincode})</strong> in 24-48 hrs.
                </div>
              </div>
              <button 
                onClick={() => setIsPincodeModalOpen(true)}
                style={{ fontSize: '0.78rem', color: 'var(--color-burgundy)', fontWeight: 700, textDecoration: 'underline' }}
              >
                Change
              </button>
            </div>

          </div>

        </div>

        {/* Tabbed In-Depth Sections (Overview, Ingredients, How to Use, Sourcing) */}
        <div style={{
          background: 'var(--color-ivory-pure)',
          border: '1.5px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-subtle)',
          overflow: 'hidden',
          marginBottom: '5rem'
        }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-gold)',
            background: 'var(--color-ivory)',
            overflowX: 'auto'
          }}>
            {[
              { id: 'overview', label: 'Classical Overview & Doshas' },
              { id: 'ingredients', label: 'Pure Ingredients' },
              { id: 'howToUse', label: 'Traditional Method of Use' },
              { id: 'sourcing', label: 'Sourcing & Integrity' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1.1rem 1.8rem',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: activeTab === tab.id ? 'var(--color-burgundy)' : 'var(--color-brown-muted)',
                  borderBottom: activeTab === tab.id ? '3px solid var(--color-burgundy)' : '3px solid transparent',
                  background: activeTab === tab.id ? 'var(--color-ivory-pure)' : 'transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div style={{ padding: '2.5rem' }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
                  Ayurvedic Energetics & Properties
                </h3>
                {product.ayurvedicProperties ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--color-ivory)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-gold)' }}>
                      <strong>Rasa (Taste):</strong>
                      <div>{product.ayurvedicProperties.rasa}</div>
                    </div>
                    <div style={{ background: 'var(--color-ivory)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-gold)' }}>
                      <strong>Virya (Potency):</strong>
                      <div>{product.ayurvedicProperties.virya}</div>
                    </div>
                    <div style={{ background: 'var(--color-ivory)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-gold)' }}>
                      <strong>Vipaka (Post-Digestive):</strong>
                      <div>{product.ayurvedicProperties.vipaka}</div>
                    </div>
                    <div style={{ background: 'var(--color-ivory)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-gold)' }}>
                      <strong>Dosha Influence:</strong>
                      <div>{product.ayurvedicProperties.doshaEffect}</div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-brown-muted)' }}>
                    Tridoshic balancing harvest, cultivated with natural traditional wisdom.
                  </p>
                )}
                <p style={{ fontSize: '0.94rem', color: 'var(--color-brown-muted)', lineHeight: 1.7 }}>
                  *Disclaimer: Classical Ayurvedic texts celebrate this preparation for ancestral vitality and holistic wellbeing. This formulation is crafted for daily nourishment and lifestyle harmony, not intended to diagnose or treat acute clinical ailments.
                </p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
                  Full Botanical Declaration
                </h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--color-deep-brown)', lineHeight: 1.8, marginBottom: '1.2rem' }}>
                  {product.ingredients || "100% Single-Origin Heirloom harvest without chemical preservatives or artificial binders."}
                </p>
                <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--color-forest-dark)', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Zero Synthetic Pesticides
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--color-forest-dark)', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Non-Irradiated Botanicals
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--color-forest-dark)', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> 100% Vegetarian & Plant Sourced
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'howToUse' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
                  Traditional Method of Preparation & Use
                </h3>
                <p style={{ fontSize: '1.02rem', color: 'var(--color-brown-muted)', lineHeight: 1.8 }}>
                  {product.howToUse || product.cookingInstructions || "Integrate into your daily ancestral diet following traditional recipes."}
                </p>
              </div>
            )}

            {activeTab === 'sourcing' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
                  Ethical Sourcing & Soil Stewardship
                </h3>
                <p style={{ fontSize: '1.02rem', color: 'var(--color-brown-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                  {product.sourcingInfo || "Directly farm-sourced from smallholder organic heritage growers in Kanchipuram and the fertile Cauvery basin."}
                </p>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-brown-muted)' }}>
                  Packaged in food-grade, moisture-barrier, recyclable pouches to shield volatile essential oils from sunlight and atmospheric oxidation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Formulations */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="mn-section-header">
              <span className="mn-section-subtitle">Complementary Harvests</span>
              <h2 className="mn-section-title">Related Ayurvedic Formulations</h2>
            </div>
            <div className="mn-products-grid">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
