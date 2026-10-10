import React, { useState } from 'react';
import { X, User, Phone, Mail, Crown, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, setUser, showToast } = useShop();
  const [tab, setTab] = useState(user.loggedIn ? 'profile' : 'login');
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    email: user.email || ''
  });
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    const updatedUser = {
      ...user,
      loggedIn: true,
      name: formData.name || 'Royal Patron',
      phone: formData.phone,
      email: formData.email || `${formData.phone}@mothernature.in`
    };
    setUser(updatedUser);
    showToast(`Welcome to Mother Nature, ${updatedUser.name}! 👑`);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser({
      loggedIn: false,
      name: '',
      email: '',
      phone: '',
      address: { doorNo: '', street: '', landmark: '', pincode: '600001', district: 'Chennai' }
    });
    showToast('Signed out of Royal Sanctuary', 'info');
    setIsAuthModalOpen(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="mn-drawer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsAuthModalOpen(false)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--color-ivory-pure)',
            border: '2px solid var(--color-gold)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '440px',
            padding: '2.2rem',
            boxShadow: 'var(--shadow-royal)',
            position: 'relative'
          }}
        >
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-deep-brown)' }}
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-burgundy)',
              color: 'var(--color-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.8rem auto',
              border: '1px solid var(--color-gold)'
            }}>
              <Crown size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-burgundy)', fontWeight: 700 }}>
              {user.loggedIn ? "Royal Patron Sanctuary" : "Welcome to Ayurveda Royalty"}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-brown-muted)' }}>
              {user.loggedIn ? "Manage your heritage orders & delivery preferences" : "Log in to track orders, save favorites, and enjoy expedited checkout"}
            </p>
          </div>

          {user.loggedIn ? (
            /* Logged in view */
            <div>
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '1.2rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--color-forest-soft)',
                    color: 'var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-deep-brown)' }}>{user.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-forest)', fontWeight: 600 }}>Active Royal Member</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--color-brown-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Phone:</strong> {user.phone}</div>
                  {user.email && <div><strong>Email:</strong> {user.email}</div>}
                  <div><strong>Delivery Hub:</strong> {user.address?.district || 'Chennai'} ({user.address?.pincode || '600001'})</div>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="mn-btn mn-btn-gold-outline"
                style={{ width: '100%', padding: '0.7rem' }}
              >
                Sign Out of Sanctuary
              </button>
            </div>
          ) : (
            /* Form view */
            <form onSubmit={handleLogin}>
              {error && (
                <div style={{
                  background: 'rgba(114, 47, 55, 0.08)',
                  border: '1px solid var(--color-burgundy)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--color-burgundy)',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                    Full Name (Optional)
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Sowmya Narayanan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: 'var(--radius-pill)',
                      border: '1.5px solid var(--border-gold)',
                      fontSize: '0.9rem',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                    Mobile Number (10 Digits) *
                  </label>
                  <input 
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: 'var(--radius-pill)',
                      border: '1.5px solid var(--border-gold)',
                      fontSize: '0.9rem',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="mn-btn mn-btn-burgundy"
                style={{ width: '100%', padding: '0.8rem' }}
              >
                Access Sanctuary
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1.2rem', fontSize: '0.75rem', color: 'var(--color-brown-muted)' }}>
                <ShieldCheck size={14} color="#344b35" />
                <span>Zero spam • Encrypted local session</span>
              </div>
            </form>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
