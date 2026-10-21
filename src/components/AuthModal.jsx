import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Crown, ShieldCheck, CheckCircle2, LogOut, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Spinner = () => (
  <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
);

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, showToast } = useShop();
  const { authUser, isAdmin, signIn, customerSignUp, signOut } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isAuthModalOpen) return null;

  const clearForm = () => {
    setEmail(''); setPassword(''); setName(''); setPhone('');
    setError(''); setSuccess(''); setShowPass(false);
  };

  const handleMode = (m) => { setMode(m); clearForm(); };

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out successfully', 'info');
    setIsAuthModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'signup') {
        await customerSignUp(email, password, name, phone);
        setSuccess('Customer account created! Please sign in with your password.');
        setMode('login');
        setPassword('');
      } else {
        const res = await signIn(email, password);
        if (res.isAdmin) {
          showToast(`Welcome Admin! 🛡️`);
        } else {
          showToast(`Welcome back to Mother Nature! 👑`);
        }
        setIsAuthModalOpen(false);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const displayName = authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Royal Patron';

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
            maxWidth: '430px',
            padding: '2rem 2.2rem',
            boxShadow: 'var(--shadow-royal)',
            position: 'relative'
          }}
        >
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-deep-brown)' }}
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
            <div style={{
              width: '48px', height: '48px',
              borderRadius: '50%',
              background: 'var(--color-burgundy)',
              color: 'var(--color-gold-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 0.8rem',
              border: '1px solid var(--color-gold)'
            }}>
              <Crown size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-burgundy)', fontWeight: 700 }}>
              {authUser ? 'Royal Patron Sanctuary' : 'Welcome to Mother Nature'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-brown-muted)', marginTop: '4px' }}>
              {authUser ? 'Your account & order preferences' : 'Sign in or create your account'}
            </p>
          </div>

          {/* ─── Logged In View ─── */}
          {authUser ? (
            <div>
              <div style={{
                background: '#fff',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '1.1rem',
                marginBottom: '1.2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.7rem' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    background: 'var(--color-forest-soft)',
                    color: 'var(--color-forest)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-serif)'
                  }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--color-deep-brown)' }}>
                      {displayName}
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: isAdmin ? '#722f37' : 'var(--color-forest)', fontWeight: 600 }}>
                      {isAdmin ? '🛡️ Admin' : '🌿 Active Member'}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-brown-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div><strong>Email:</strong> {authUser.email}</div>
                  {authUser.user_metadata?.phone && <div><strong>Phone:</strong> {authUser.user_metadata.phone}</div>}
                </div>
              </div>

              {/* Admin Portal shortcut if admin */}
              {isAdmin && (
                <a
                  href="#/admin"
                  onClick={() => setIsAuthModalOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-burgundy)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    marginBottom: '0.75rem',
                    boxShadow: '0 4px 12px rgba(114,47,55,0.25)'
                  }}
                >
                  <ShieldCheck size={16} color="#e0c878" />
                  Enter Admin Portal
                </a>
              )}

              <button
                onClick={handleSignOut}
                style={{
                  width: '100%', padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-gold)',
                  background: 'transparent',
                  color: 'var(--color-deep-brown)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            /* ─── Auth Forms ─── */
            <div>
              {/* Mode tabs: Sign In & Register */}
              <div style={{
                display: 'flex',
                background: 'rgba(197,161,91,0.1)',
                borderRadius: '10px',
                padding: '4px',
                marginBottom: '1.2rem',
                gap: '2px'
              }}>
                {[
                  { id: 'login', label: 'Sign In' },
                  { id: 'signup', label: 'Register' }
                ].map(tab => (
                  <button key={tab.id} type="button" onClick={() => handleMode(tab.id)}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: mode === tab.id ? '#fff' : 'transparent',
                      color: mode === tab.id ? 'var(--color-burgundy)' : 'var(--color-brown-muted)',
                      fontWeight: mode === tab.id ? 600 : 400,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      boxShadow: mode === tab.id ? '0 2px 6px rgba(114,47,55,0.1)' : 'none',
                      transition: 'all 0.2s'
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Alert */}
              <AnimatePresence>
                {(error || success) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      background: error ? 'rgba(231,76,60,0.07)' : 'rgba(52,75,53,0.07)',
                      border: `1px solid ${error ? 'rgba(231,76,60,0.3)' : 'rgba(52,75,53,0.3)'}`,
                      borderRadius: '8px',
                      padding: '0.6rem 0.8rem',
                      marginBottom: '0.9rem',
                      fontSize: '0.78rem',
                      color: error ? '#c0392b' : '#2d6a2f',
                      display: 'flex', alignItems: 'flex-start', gap: '7px'
                    }}>
                    {error ? <AlertCircle size={13} style={{ flexShrink: 0, marginTop: '1px' }} />
                           : <CheckCircle2 size={13} style={{ flexShrink: 0, marginTop: '1px' }} />}
                    {error || success}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {mode === 'signup' && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                          <User size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold-dark)' }} />
                          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sowmya Narayanan" required
                            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.2rem', borderRadius: '10px', border: '1.5px solid var(--border-gold)', fontSize: '0.87rem', background: '#fff', outline: 'none' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>Phone (Optional)</label>
                        <div style={{ position: 'relative' }}>
                          <Phone size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold-dark)' }} />
                          <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number"
                            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.2rem', borderRadius: '10px', border: '1.5px solid var(--border-gold)', fontSize: '0.87rem', background: '#fff', outline: 'none' }} />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold-dark)' }} />
                      <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="you@example.com" required
                        style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.2rem', borderRadius: '10px', border: '1.5px solid var(--border-gold)', fontSize: '0.87rem', background: '#fff', outline: 'none' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                      {mode === 'signup' ? 'Create Password' : 'Password'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold-dark)' }} />
                      <input type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'} required
                        style={{ width: '100%', padding: '0.65rem 2.4rem 0.65rem 2.2rem', borderRadius: '10px', border: '1.5px solid var(--border-gold)', fontSize: '0.87rem', background: '#fff', outline: 'none' }} />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-brown-muted)', background: 'none', border: 'none' }}>
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      marginTop: '0.2rem',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: loading ? 'rgba(114,47,55,0.5)' : 'var(--color-burgundy)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {loading ? <><Spinner /> Please wait...</> :
                     mode === 'signup' ? 'Create Account' : 'Sign In'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--color-brown-muted)' }}>
                    <ShieldCheck size={12} color="#344b35" />
                    Secured by Supabase • Zero spam
                  </div>
                </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
