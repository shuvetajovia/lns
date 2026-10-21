import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Wheat, 
  Droplets, 
  Heart, 
  Star, 
  MapPin, 
  CheckCircle2, 
  Package, 
  Lock, 
  HeartHandshake 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { AYURVEDA_STORY, AYURVEDA_REVIEWS, INGREDIENT_SPOTLIGHT } from '../data/products';
import { motion } from 'framer-motion';

export const HomePage = () => {
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    deliveryPincode, 
    pincodeDistrict, 
    setIsPincodeModalOpen,
    checkPincode 
  } = useShop();

  const bestsellers = products.filter(p => p.isBestSeller).slice(0, 6);

  return (
    <div className="mn-homepage">

      {/* ===================================================================
          1. HERO SECTION (SPLIT LAYOUT WITH BOTANICAL ROYALTY AESTHETIC)
          =================================================================== */}
      <section className="mn-hero">
        <div className="mn-container">
          <div className="mn-hero-grid">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mn-hero-tag">
                <Crown size={14} color="#c5a15b" />
                <span>The Royal Ayurvedic Apothecary</span>
              </div>

              <h1 className="mn-hero-headline">
                Nature's Wisdom. <br />
                <em>India's Timeless Tradition.</em>
              </h1>

              <p className="mn-hero-subtext">
                Discover thoughtfully sourced natural essentials inspired by the ancient wisdom of Ayurveda. Sourced directly from heirloom seed conservators and traditional wooden mills in Tamil Nadu.
              </p>

              {/* CTAs */}
              <div className="mn-hero-cta-group">
                <button 
                  className="mn-btn mn-btn-burgundy"
                  onClick={() => navigate('/shop')}
                >
                  <span>Shop the Collection</span>
                  <ArrowRight size={16} />
                </button>

                <button 
                  className="mn-btn mn-btn-gold-outline"
                  onClick={() => {
                    const el = document.getElementById('story');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Discover Our Story</span>
                </button>
              </div>

              {/* Trust Pillars Underneath */}
              <div className="mn-hero-pillars">
                <div className="mn-pillar-item">
                  <div className="mn-pillar-icon">
                    <Leaf size={16} />
                  </div>
                  <div className="mn-pillar-text">
                    100% Traditional<br />Native Grains
                  </div>
                </div>

                <div className="mn-pillar-item">
                  <div className="mn-pillar-icon">
                    <Droplets size={16} />
                  </div>
                  <div className="mn-pillar-text">
                    Wood-Pressed<br />Pure Tailams
                  </div>
                </div>

                <div className="mn-pillar-item">
                  <div className="mn-pillar-icon">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="mn-pillar-text">
                    Zero Sulphur<br />Unpolished Bran
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual: Premium Still Life of Ayurvedic Herbs & Vessels */}
            <motion.div
              className="mn-hero-visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="mn-hero-frame">
                <img 
                  src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000" 
                  alt="Ayurvedic herbs, brass bowl, turmeric and natural apothecary ingredients"
                />

                {/* Floating Heritage Badge */}
                <div className="mn-hero-floating-card">
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--color-burgundy)',
                    color: 'var(--color-gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--color-gold)'
                  }}>
                    <Crown size={19} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-deep-brown)' }}>
                      Kanchipuram Heritage
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                      Handcrafted in Small Batches
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===================================================================
          2. SHOP BY CATEGORY (REFINED CARDS WITH THIN GOLD BORDERS)
          =================================================================== */}
      <section className="mn-categories-section">
        <div className="mn-container">
          
          <div className="mn-section-header">
            <div className="mn-section-ornament">
              <span className="mn-ornament-line" />
              <Crown size={16} color="#c5a15b" />
              <span className="mn-ornament-line" />
            </div>
            <span className="mn-section-subtitle">Classical Classifications</span>
            <h2 className="mn-section-title">Shop by Ayurvedic Category</h2>
            <p className="mn-section-desc">
              Curated according to traditional Ayurvedic rasas, doshic balance, and ancestral nourishment rituals.
            </p>
          </div>

          <div className="mn-category-grid">
            {categories.filter(c => c.id !== 'all').map(cat => (
              <div 
                key={cat.id}
                className="mn-category-card"
                onClick={() => navigate(`/shop?cat=${cat.id}`)}
              >
                <div className="mn-cat-circle">
                  <img src={cat.image} alt={cat.name} />
                </div>
                <h3 className="mn-cat-title">{cat.name}</h3>
                <div className="mn-cat-subtitle">{cat.subtitle}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===================================================================
          3. BESTSELLERS PRODUCT GRID
          =================================================================== */}
      <section className="mn-products-section">
        <div className="mn-container">
          
          <div className="mn-section-header">
            <div className="mn-section-ornament">
              <span className="mn-ornament-line" />
              <Sparkles size={16} color="#c5a15b" />
              <span className="mn-ornament-line" />
            </div>
            <span className="mn-section-subtitle">Revered Harvests</span>
            <h2 className="mn-section-title">Our Royal Bestsellers</h2>
            <p className="mn-section-desc">
              Beloved by thousands of wellness seekers for authentic purity, time-tested preparation, and visible vitality.
            </p>
          </div>

          <div className="mn-products-grid">
            {bestsellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button 
              className="mn-btn mn-btn-burgundy"
              onClick={() => navigate('/shop')}
            >
              <span>Explore All {products.length} Ayurvedic Formulations</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* ===================================================================
          4. BRAND STORY SECTION (FOREST GREEN WITH GOLD BOTANICAL ACCENTS)
          =================================================================== */}
      <section id="story" className="mn-brand-story-section">
        <div className="mn-container">
          <div className="mn-brand-story-grid">
            
            <div className="mn-brand-story-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                <Crown size={18} color="#dfc58a" />
                <span className="mn-section-subtitle" style={{ color: '#dfc58a' }}>The Sanctuary Scroll</span>
              </div>
              
              <h2>{AYURVEDA_STORY.title}</h2>

              {AYURVEDA_STORY.paragraphs.map((p, idx) => (
                <p key={idx} className="mn-brand-story-text">
                  {p}
                </p>
              ))}

              <div className="mn-brand-story-stats">
                {AYURVEDA_STORY.stats.map((st, i) => (
                  <div key={i} className="mn-stat-box">
                    <div className="mn-stat-val">{st.value}</div>
                    <div className="mn-stat-lbl">{st.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <button 
                  className="mn-btn mn-btn-gold-outline"
                  style={{ borderColor: 'var(--color-gold)', color: '#ffffff' }}
                  onClick={() => navigate('/about')}
                >
                  <span>Read the Full Heritage Chronicle</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Visual Frame */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '24px',
                border: '2px solid var(--color-gold)',
                padding: '10px',
                background: 'rgba(255,255,255,0.06)',
                boxShadow: 'var(--shadow-royal)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=900" 
                  alt="Traditional Indian Ayurvedic apothecary"
                  style={{ borderRadius: '16px', height: '440px', width: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================
          5. INGREDIENT SPOTLIGHT (NEEM, TULSI, TURMERIC, AMLA, ASHWAGANDHA)
          =================================================================== */}
      <section className="mn-ingredients-section">
        <div className="mn-container">
          
          <div className="mn-section-header">
            <div className="mn-section-ornament">
              <span className="mn-ornament-line" />
              <Leaf size={16} color="#c5a15b" />
              <span className="mn-ornament-line" />
            </div>
            <span className="mn-section-subtitle">Sacred Botanicals</span>
            <h2 className="mn-section-title">Ayurvedic Ingredient Spotlight</h2>
            <p className="mn-section-desc">
              Understand the ancient energetic profiles and therapeutic virtues of classical medicinal plants.
            </p>
          </div>

          <div className="mn-ingredients-grid">
            {INGREDIENT_SPOTLIGHT.map(ing => (
              <div key={ing.id} className="mn-ingredient-card">
                <img src={ing.image} alt={ing.name} className="mn-ing-image" />
                <div className="mn-ing-body">
                  <h3 className="mn-ing-title">{ing.name}</h3>
                  <div className="mn-ing-sanskrit">{ing.sanskrit}</div>
                  <p className="mn-ing-desc">{ing.description}</p>
                  
                  <ul className="mn-ing-benefits-list">
                    {ing.benefits.map((b, bi) => (
                      <li key={bi} className="mn-ing-benefit-item">
                        <CheckCircle2 size={13} color="#344b35" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => navigate('/shop')}
                    style={{ 
                      marginTop: '1.2rem', 
                      fontSize: '0.78rem', 
                      fontWeight: 700, 
                      color: 'var(--color-burgundy)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px' 
                    }}
                  >
                    <span>View Formulations</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===================================================================
          6. PINCODE VERIFICATION HUB (TAMIL NADU DELIVERY EXPRESS)
          =================================================================== */}
      <section style={{ padding: '3.5rem 0', background: 'var(--color-ivory)' }}>
        <div className="mn-container">
          <div style={{
            background: 'var(--color-ivory-pure)',
            border: '1.5px solid var(--color-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem 3rem',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--color-burgundy)',
                color: 'var(--color-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-gold)',
                flexShrink: 0
              }}>
                <MapPin size={26} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-deep-brown)', marginBottom: '0.2rem' }}>
                  Verify Tamil Nadu Direct Harvest Delivery
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-brown-muted)' }}>
                  Fresh farm dispatch from Kanchipuram to all 38 districts with 24-48 hr expedited couriers.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                Current Route: <strong>{pincodeDistrict} ({deliveryPincode})</strong>
              </span>
              <button 
                className="mn-btn mn-btn-burgundy mn-btn-sm"
                onClick={() => setIsPincodeModalOpen(true)}
              >
                Change Pincode
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. CUSTOMER REVIEWS (AUTHENTIC PATRONAGE)
          =================================================================== */}
      <section style={{ padding: '5.5rem 0', background: 'var(--color-ivory-pure)', borderBottom: '1px solid var(--border-gold)' }}>
        <div className="mn-container">
          
          <div className="mn-section-header">
            <div className="mn-section-ornament">
              <span className="mn-ornament-line" />
              <Star size={16} color="#c5a15b" fill="#c5a15b" />
              <span className="mn-ornament-line" />
            </div>
            <span className="mn-section-subtitle">Honored Patronage</span>
            <h2 className="mn-section-title">Words from Our Royal Patrons</h2>
            <p className="mn-section-desc">
              Families and traditional practitioners across South India sharing their personal wellness transformations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem' }}>
            {AYURVEDA_REVIEWS.map(rev => (
              <div 
                key={rev.id}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--border-gold)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.2rem',
                  boxShadow: 'var(--shadow-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '3px', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-deep-brown)', marginBottom: '0.6rem' }}>
                    "{rev.title}"
                  </h4>

                  <p style={{ fontSize: '0.92rem', color: 'var(--color-brown-muted)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', borderTop: '1px dashed var(--border-gold)', paddingTop: '1.1rem' }}>
                  <img src={rev.avatar} alt={rev.name} style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-gold)' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--color-deep-brown)' }}>
                      {rev.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-forest)', fontWeight: 500 }}>
                      {rev.location} • <span style={{ color: 'var(--color-gold-dark)' }}>Verified Buyer</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===================================================================
          8. TRUST & SUSTAINABILITY SECTION
          =================================================================== */}
      <section className="mn-trust-section">
        <div className="mn-container">
          
          <div className="mn-trust-grid">
            <div className="mn-trust-card">
              <div className="mn-trust-card-icon">
                <Wheat size={26} />
              </div>
              <h4 className="mn-trust-card-title">Verified Organic Sourcing</h4>
              <p className="mn-trust-card-desc">
                Organically cultivated with traditional bio-compost and zero synthetic pesticides on certified heirloom farmland.
              </p>
            </div>

            <div className="mn-trust-card">
              <div className="mn-trust-card-icon">
                <Leaf size={26} />
              </div>
              <h4 className="mn-trust-card-title">Full Ingredient Transparency</h4>
              <p className="mn-trust-card-desc">
                100% of botanical ingredients and wood-pressed tailams are declared clearly without undisclosed excipients.
              </p>
            </div>

            <div className="mn-trust-card">
              <div className="mn-trust-card-icon">
                <Package size={26} />
              </div>
              <h4 className="mn-trust-card-title">Responsible Glass Packaging</h4>
              <p className="mn-trust-card-desc">
                Food-grade, recyclable, and moisture-barrier packaging that honors mother nature without plastic leeching.
              </p>
            </div>

            <div className="mn-trust-card">
              <div className="mn-trust-card-icon">
                <Lock size={26} />
              </div>
              <h4 className="mn-trust-card-title">Secure Razorpay Payments</h4>
              <p className="mn-trust-card-desc">
                Bank-grade 256-bit SSL encrypted checkout accepting UPI, Credit/Debit cards, and NetBanking.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
