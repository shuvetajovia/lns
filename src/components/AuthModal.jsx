import React, { useState } from 'react';
import { X, LogOut, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useShop();
  const { authUser, isAdmin, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!isAuthModalOpen) return null;
  const close = () => setIsAuthModalOpen(false);
  const logout = async () => {
    setBusy(true); setError('');
    try { await signOut(); close(); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <div className="mn-drawer-overlay" onClick={close} style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
    <section role="dialog" aria-modal="true" aria-labelledby="account-title" onClick={e => e.stopPropagation()}
      style={{ background: '#fcf9f2', borderRadius: 18, padding: 30, maxWidth: 420, width: '100%' }}>
      <button onClick={close} aria-label="Close account" style={{ float: 'right' }}><X /></button>
      <h2 id="account-title">Your account</h2>
      <p style={{ margin: '16px 0' }}>{authUser?.user_metadata?.full_name || authUser?.email}</p>
      <p style={{ marginBottom: 20 }}>{isAdmin ? 'Store admin' : 'Customer'} - {authUser?.email}</p>
      {isAdmin && <Link to="/admin" onClick={close}><ShieldCheck size={16} /> Open admin dashboard</Link>}
      {error && <p role="alert">{error}</p>}
      <button className="auth-submit" disabled={busy} onClick={logout}><LogOut size={17} /> {busy ? 'Signing out...' : 'Sign out'}</button>
    </section>
  </div>;
};
