import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CloudService } from '../CloudService';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
export const AccountPage = () => {
  const { user, setUser, profileError, refreshProfile } = useShop();
  const { signOut } = useAuth();
  const [form, setForm] = useState(user);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setForm(user); }, [user.name, user.phone, JSON.stringify(user.address)]);
  const load = async () => {
    setLoading(true); setError('');
    try { setOrders(await CloudService.getOrders()); } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const save = async e => {
    e.preventDefault(); setBusy(true); setError(''); setNotice('');
    try { await setUser(form); setNotice('Profile and address saved.'); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  const cancel = async order => {
    const reason = window.prompt('Why would you like to cancel?');
    if (!reason) return;
    setBusy(true); setError('');
    try { await CloudService.requestCancellation(order.id, reason); await load(); setNotice('Cancellation requested. The store will review it. Any refund requires confirmation from the payment provider.'); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const address = e => setForm(prev => ({ ...prev, address: { ...prev.address, [e.target.name]: e.target.value } }));
  return <div className="mn-container mn-account-page">
    <h1>Your account</h1><p>{user.email}</p>
    {(error || profileError) && <p className="auth-message auth-error" role="alert">{error || profileError}</p>}
    {profileError && <button onClick={refreshProfile}>Retry profile</button>}
    {notice && <p className="auth-message auth-notice" role="status">{notice}</p>}
    <div className="mn-account-grid"><section className="mn-account-card"><h2>Profile and delivery address</h2>
      <form onSubmit={save}><fieldset disabled={busy}>
        <label>Full name<input name="name" required maxLength={100} value={form.name} onChange={change} autoComplete="name" /></label>
        <label>Mobile number<input name="phone" type="tel" maxLength={20} value={form.phone} onChange={change} autoComplete="tel" /></label>
        {[['doorNo','Door / Flat number'],['street','Street'],['landmark','Landmark'],['pincode','Pincode'],['district','District']].map(([name,label]) => <label key={name}>{label}<input name={name} value={form.address?.[name] || ''} onChange={address} maxLength={name === 'pincode' ? 6 : 150} /></label>)}
        <button className="mn-btn mn-btn-forest" disabled={busy}>Save details</button>
      </fieldset></form>
      <Link to="/forgot-password">Reset password / email help</Link>
      <button onClick={async () => { try { await CloudService.unsubscribe(); setNotice('You are unsubscribed from the newsletter.'); } catch(err) { setError(err.message); } }}>Unsubscribe from newsletter</button>
      <button onClick={() => signOut().catch(err => setError(err.message))}>Sign out</button>
    </section><section className="mn-account-card"><h2>Your orders</h2><button disabled={loading} onClick={load}>Refresh orders</button>
      {loading ? <p role="status">Loading orders...</p> : !error && !orders.length ? <p>You have no orders yet. <Link to="/shop">Browse the shop</Link></p> : orders.map(order => <article className="mn-order-card" key={order.id}>
        <h3>{order.id}</h3><p>{new Date(order.date).toLocaleString('en-IN')} · ₹{order.total}</p>
        <p>Status: <strong>{order.status}</strong> · Payment: {order.paymentStatus}</p>
        <p>Refund: {order.refundStatus}</p>
        {order.status !== 'Cancelled' && <ol aria-label="Order progress">{['Pending','Processing','Shipped','Delivered'].map(status => <li key={status} aria-current={order.status === status ? 'step' : undefined}>{status}{status === order.status ? ' (current)' : ''}</li>)}</ol>}
        <ul>{order.items.map((item,index) => <li key={index}>{item.name} × {item.qty}</li>)}</ul>
        <p>{[order.address.doorNo,order.address.streetName,order.address.district,order.address.pincode].filter(Boolean).join(', ')}</p>
        {order.cancellationRequestedAt ? <p>Cancellation requested: {order.cancellationReason}</p> : ['Pending','Processing'].includes(order.status) && <button disabled={busy} onClick={() => cancel(order)}>Request cancellation / refund review</button>}
      </article>)}
    </section></div>
  </div>;
};
