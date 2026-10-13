import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  CheckCircle2, 
  Instagram, 
  Facebook, 
  Sparkles 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      showToast("Blessings! You have joined the Ayurveda Royal Circle. 🌿✨");
      setEmail("");
    } else {
      showToast("Please enter a valid email address.", "error");
    }
  };

  return (
    <footer className="mn-footer">
      <div className="mn-container">
        
        {/* Top 4 Columns */}
        <div className="mn-footer-top">
          
          {/* Column 1: Brand & Philosophy */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                background: 'rgba(197, 161, 91, 0.2)', 
                border: '1.5px solid var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold-light)'
              }}>
                <Crown size={20} />
              </div>
              <h3 className="mn-footer-brand-title">Mother Nature</h3>
            </div>
            
            <p className="mn-footer-desc">
              Rooted in the timeless wisdom of traditional Ayurveda and the temple heritage of Kanchipuram. We bring whole, chemical-free ancestral grains, pure cold-pressed tailams, and botanical wellness directly to your home.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(197, 161, 91, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold-light)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-gold)';
                  e.currentTarget.style.color = 'var(--color-burgundy)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'var(--color-gold-light)';
                }}
                title="Instagram"
              >
                <Instagram size={17} />
              </a>

              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(197, 161, 91, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold-light)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-gold)';
                  e.currentTarget.style.color = 'var(--color-burgundy)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'var(--color-gold-light)';
                }}
                title="Facebook"
              >
                <Facebook size={17} />
              </a>
            </div>
          </div>

          {/* Column 2: Exact Categories */}
          <div>
            <h4 className="mn-footer-col-title">Our Collections</h4>
            <ul className="mn-footer-links">
              <li>
                <Link to="/shop?cat=heritage-rice" className="mn-footer-link">
                  🌾 Heritage Rice
                </Link>
              </li>
              <li>
                <Link to="/shop?cat=ancient-millets" className="mn-footer-link">
                  🌱 Ancient Millets
                </Link>
              </li>
              <li>
                <Link to="/shop?cat=native-sweeteners" className="mn-footer-link">
                  🍯 Native Sweeteners
                </Link>
              </li>
              <li>
                <Link to="/shop?cat=essential-minerals" className="mn-footer-link">
                  🧂 Essential Minerals
                </Link>
              </li>
              <li>
                <Link to="/shop?cat=forest-harvest" className="mn-footer-link">
                  🌿 Forest Harvest
                </Link>
              </li>
              <li>
                <Link to="/shop?cat=cold-pressed-oils" className="mn-footer-link">
                  💧 Cold Pressed Oils
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sanctuary Support & Roots */}
          <div>
            <h4 className="mn-footer-col-title">Sanctuary Support</h4>
            <ul className="mn-footer-links">
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
                  className="mn-footer-link"
                >
                  Our Kanchipuram Roots
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/919360013709?text=Hello%20Mother%20Nature%20Sanctuary" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="mn-footer-link"
                >
                  WhatsApp Consultation Desk
                </a>
              </li>
              <li>
                <span className="mn-footer-link" style={{ cursor: 'default' }}>
                  Helpline: +91 93600 13709
                </span>
              </li>
              <li>
                <span className="mn-footer-link" style={{ cursor: 'default' }}>
                  Kanchipuram, Tamil Nadu - 631502
                </span>
              </li>
              <li>
                <span className="mn-footer-link" style={{ cursor: 'default' }}>
                  24-48 Hr District Delivery
                </span>
              </li>
              <li>
                <Link to="/admin" className="mn-footer-link" style={{ color: 'var(--color-gold-light)', fontWeight: 700 }}>
                  ⚙️ Admin Portal (Stock & Inventory)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Verified Assurance */}
          <div>
            <h4 className="mn-footer-col-title">The Royal Circle</h4>
            <div className="mn-footer-newsletter-box">
              <p style={{ fontSize: '0.86rem', color: 'var(--color-ivory-light)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Receive seasonal Ayurvedic harvest chronicles, traditional recipe scrolls, and an immediate 10% privilege on your first order.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(197, 161, 91, 0.45)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.55rem 0.95rem',
                    fontSize: '0.82rem',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit"
                  style={{
                    background: 'var(--color-gold)',
                    color: 'var(--color-burgundy-dark)',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.55rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Join
                </button>
              </form>
            </div>

            {/* Purity Assurance Badges */}
            <div style={{ marginTop: '1.4rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-gold-light)' }}>
                <CheckCircle2 size={16} />
                <span>100% Heirloom Non-Hybrid Crops</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-gold-light)' }}>
                <ShieldCheck size={16} />
                <span>Zero Sulphur • Non-Bleached Purity</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Verified Razorpay Payment Badges */}
        <div className="mn-footer-bottom">
          <div>
            © {new Date().getFullYear()} Mother Nature Store • Rooted in Ancient Ayurveda. All rights reserved.
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-gold-light)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={15} /> 100% Secure Checkout via <strong>Razorpay</strong>
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {["UPI", "Cards", "NetBanking", "COD"].map(tag => (
                <span key={tag} style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(197, 161, 91, 0.3)',
                  padding: '2px 8px', 
                  borderRadius: '4px', 
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--color-ivory-light)'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
