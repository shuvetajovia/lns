import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShopProvider } from '../context/ShopContext';
import { Toast } from './Toast';
import { StoreStatus } from './StoreStatus';

export function AdminLayout() {
  const { signOut } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const logout = async () => {
    setBusy(true); setError('');
    try { await signOut(); }
    catch (err) { setError(err.message); setBusy(false); }
  };
  return <ShopProvider><div className="mn-admin-shell">
    <header className="mn-admin-header">
      <NavLink className="mn-admin-brand" to="/admin">Mother Nature <span>Store administration</span></NavLink>
      <nav aria-label="Admin navigation">
        <NavLink to="/admin" end>Inventory, orders & districts</NavLink>
        <NavLink to="/admin/operations">Financials & feedback</NavLink>
      </nav>
      <button className="mn-btn" disabled={busy} onClick={logout}>{busy ? 'Signing out…' : 'Sign out'}</button>
    </header>
    {error && <p role="alert" className="auth-message auth-error">{error}</p>}
    <StoreStatus /><Toast /><main><Outlet /></main>
  </div></ShopProvider>;
}
