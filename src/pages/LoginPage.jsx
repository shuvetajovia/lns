import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Leaf, Mail, Lock, Eye, EyeOff, ArrowRight,
  ShieldCheck, User, Phone, Loader2, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const Spinner = () => (
  <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
);

/* ─── Input Field Component ─── */
const Field = ({ label, icon: Icon, type, value, onChange, placeholder, required, maxLength }) => {
  const [showPass, setShowPass] = useState(false);
  const isPass = type === 'password';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '13px', top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-gold-dark)', pointerEvents: 'none'
        }}>
          <Icon size={16} />
        </div>
        <input
          type={isPass ? (showPass ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.6rem',
            borderRadius: '12px',
            border: '1.5px solid rgba(197,161,91,0.35)',
            fontSize: '0.92rem',
            background: '#fff',
            outline: 'none',
            color: 'var(--color-deep-brown)',
            transition: 'all 0.2s'
          }}
          onFocus={e => {
            e.target.style.borderColor = '#c5a15b';
            e.target.style.boxShadow = '0 0 0 3px rgba(197,161,91,0.15)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(197,161,91,0.35)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {isPass && (
          <button type="button" onClick={() => setShowPass(v => !v)}
            style={{
              position: 'absolute', right: '13px', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-brown-muted)', background: 'none', border: 'none', cursor: 'pointer'
            }}>
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   LOGIN & REGISTRATION PORTAL
   - Sign In: Checks credentials -> Admin goes to /admin, Customer goes to Store
   - Customer Registration: Create customer account with email + password
══════════════════════════════════════════ */
export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, customerSignUp, authUser, isAdmin, authLoading } = useAuth();

  const from = location.state?.from?.pathname || '/';
  const requiredRole = location.state?.requiredRole;

  // 'login' | 'signup'
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If already authenticated, redirect automatically
  useEffect(() => {
    if (!authLoading && authUser) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        const dest = (from && from !== '/admin' && from !== '/admin/login' && from !== '/login') ? from : '/';
        navigate(dest, { replace: true });
      }
    }
  }, [authUser, isAdmin, authLoading]);

  const clearForm = () => {
    setEmail(''); setPassword(''); setName(''); setPhone('');
    setError(''); setSuccess('');
  };

  const handleMode = (m) => { setMode(m); clearForm(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    try {
      if (mode === 'signup') {
        await customerSignUp(email, password, name, phone);
        setSuccess('Customer account created! Please sign in with your email and password.');
        setMode('login');
        setPassword(''); setName(''); setPhone('');
      } else {
        // Sign In (Checks credentials: Admin vs Customer)
        const result = await signIn(email, password);
        
        if (result.isAdmin) {
          setSuccess('Admin credentials verified! Entering Admin Portal...');
          setTimeout(() => {
            navigate('/admin', { replace: true });
          }, 500);
        } else {
          setSuccess('Welcome back! Entering Store...');
          const target = (from && from !== '/admin' && from !== '/admin/login' && from !== '/login') ? from : '/';
          setTimeout(() => {
            navigate(target, { replace: true });
          }, 400);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5ebd7 0%, #fdfaf3 50%, #edf2eb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient background elements */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px',
        width: '420px', height: '420px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197,161,91,0.18) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '360px', height: '360px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,75,53,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          width: '100%',
          maxWidth: '450px',
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1.5px solid rgba(197,161,91,0.3)',
          boxShadow: '0 24px 60px rgba(73,53,42,0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Brand Header */}
        <div style={{
          background: 'linear-gradient(135deg, #243524 0%, #344b35 100%)',
          padding: '2.2rem 2rem 1.8rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c5a15b 0%, #e0c878 100%)',
            boxShadow: '0 4px 16px rgba(197,161,91,0.4)',
            marginBottom: '0.9rem'
          }}>
            <Leaf size={28} color="#243524" />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.65rem',
            color: '#fff',
            letterSpacing: '0.5px',
            marginBottom: '0.3rem'
          }}>
            Mother Nature
          </h1>
          <p style={{
            color: 'rgba(197,161,91,0.9)',
            fontSize: '0.82rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            Ayurvedic Sanctuary
          </p>

          {requiredRole === 'admin' && (
            <div style={{
              marginTop: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              background: 'rgba(197,161,91,0.2)',
              border: '1px solid rgba(197,161,91,0.5)',
              color: '#fdfaf3',
              fontSize: '0.78rem',
              fontWeight: 600
            }}>
              <ShieldCheck size={14} color="#e0c878" />
              Sign in with your Admin account
            </div>
          )}
        </div>

        {/* 2 Clean Tabs: Sign In & Register */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(197,161,91,0.2)',
          background: 'rgba(253,250,243,0.7)'
        }}>
          <button
            type="button"
            onClick={() => handleMode('login')}
            style={{
              flex: 1,
              padding: '1rem 0.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.92rem',
              fontWeight: mode === 'login' ? 700 : 500,
              color: mode === 'login' ? 'var(--color-forest)' : 'var(--color-brown-muted)',
              borderBottom: mode === 'login' ? '2.5px solid var(--color-forest)' : '2.5px solid transparent',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleMode('signup')}
            style={{
              flex: 1,
              padding: '1rem 0.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.92rem',
              fontWeight: mode === 'signup' ? 700 : 500,
              color: mode === 'signup' ? 'var(--color-forest)' : 'var(--color-brown-muted)',
              borderBottom: mode === 'signup' ? '2.5px solid var(--color-forest)' : '2.5px solid transparent',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
          >
            Customer Registration
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '2rem' }}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: '#fdf2f2',
                border: '1px solid #f87171',
                color: '#b91c1c',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: '#f0fdf4',
                border: '1px solid #4ade80',
                color: '#15803d',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Customer Registration fields */}
            {mode === 'signup' && (
              <>
                <Field
                  label="Full Name"
                  icon={User}
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
                <Field
                  label="Mobile Number"
                  icon={Phone}
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </>
            )}

            {/* Email Field */}
            <Field
              label="Email Address"
              icon={Mail}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />

            {/* Password Field */}
            <Field
              label="Password"
              icon={Lock}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Create a secure password' : 'Enter your password'}
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                padding: '0.85rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                background: loading ? '#888' : 'linear-gradient(135deg, #243524 0%, #344b35 100%)',
                color: '#fdfaf3',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(52,75,53,0.3)',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Register Account</span>
                  <Sparkles size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(197,161,91,0.2)',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--color-brown-muted)',
            lineHeight: 1.5
          }}>
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleMode('signup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-forest)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-forest)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Sign in here
                </button>
              </p>
            )}

            <div style={{ marginTop: '0.75rem' }}>
              <Link to="/" style={{ color: 'var(--color-deep-brown)', textDecoration: 'none', fontSize: '0.8rem' }}>
                ← Return to Storefront
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
