import React, { useEffect, useState } from 'react';
import { CloudService } from '../CloudService';
export const AdminOperations = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = async () => {
    setBusy(true); setError('');
    try {
      const [nextOrders,nextReviews,nextSubscriptions] = await Promise.all([CloudService.getOrders(),CloudService.getReviews(),CloudService.getSubscriptions()]);
      setOrders(nextOrders); setReviews(nextReviews); setSubscriptions(nextSubscriptions);
    } catch(err) { setError(err.message); } finally { setBusy(false); }
  };
  useEffect(() => { load(); }, []);
  const paid = orders.filter(order => order.paymentStatus === 'paid' && order.refundStatus !== 'refunded');
  return <div className="mn-container mn-account-page"><h1>Financials and feedback</h1>
    <p>Only orders marked paid by a verified server process count as collected revenue. Payment processing and refunds are awaiting gateway setup.</p>
    <button disabled={busy} onClick={load}>Refresh reports</button>
    {error && <p role="alert" className="auth-message auth-error">{error}</p>}
    {busy ? <p role="status">Loading reports...</p> : <div className="mn-account-grid">
      <section className="mn-account-card"><h2>Financials</h2><p>Verified collected revenue: ₹{paid.reduce((sum,order) => sum+order.total,0).toFixed(2)}</p>
        <p>{orders.filter(order => order.paymentStatus === 'unverified').length} historical orders need payment reconciliation.</p>
        <h3>Cancellation requests</h3>{orders.filter(order => order.cancellationRequestedAt).map(order => <p key={order.id}>{order.id}: {order.cancellationReason} ({order.status}, refund: {order.refundStatus})</p>)}
      </section>
      <section className="mn-account-card"><h2>Feedback</h2>{!reviews.length && <p>No reviews yet.</p>}{reviews.map(review => <article className="mn-order-card" key={review.id}><h3>{review.title || review.name}</h3><p>{review.rating}/5 · {review.comment}</p><button disabled={busy} onClick={async () => {
        if (!window.confirm('Delete this review?')) return;
        setBusy(true);
        try { await CloudService.deleteReview(review.id); await load(); } catch(err) { setError(err.message); } finally { setBusy(false); }
      }}>Delete review</button></article>)}</section>
      <section className="mn-account-card"><h2>Newsletter preferences</h2><p>{subscriptions.length} subscribed accounts. Email campaigns require an email provider.</p>
        <textarea aria-label="Subscribed emails" readOnly value={subscriptions.map(item => item.email).join('\n')} rows={8} style={{ width:'100%' }} />
      </section>
    </div>}
  </div>;
};
