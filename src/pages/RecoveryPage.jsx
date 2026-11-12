import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
export const RecoveryPage = () => {
  const { authUser, authLoading, sendPasswordReset, resendConfirmation, updatePassword, signOut } = useAuth();
  const reset = useLocation().pathname === '/reset-password';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const [action, setAction] = useState('reset');
  if (authLoading) return <div className="auth-loading" role="status">Checking your account...</div>;
  if (reset && !authUser && !finished) return <Navigate to="/forgot-password" replace />;
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      if (reset) {
        if (password !== confirm) throw new Error('Your passwords do not match.');
        await updatePassword(password); setFinished(true); await signOut();
        setMessage('Password updated. Please sign in again.');
      } else {
        await (action === 'reset' ? sendPasswordReset(email) : resendConfirmation(email));
        setMessage('If your email is eligible, a link has been sent. Check your inbox and spam folder.');
      }
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <div className="auth-form-panel" style={{ minHeight: '100dvh' }}><div className="auth-card">
    <h1>{reset ? 'Set your password' : 'Account help'}</h1>
    <p>{reset ? 'Use at least 8 characters.' : 'Reset your password or resend your confirmation email.'}</p>
    {error && <p className="auth-message auth-error" role="alert">{error}</p>}
    {message && <p className="auth-message auth-notice" role="status">{message}</p>}
    {!message && <form onSubmit={submit}><fieldset disabled={busy}>
      {reset ? <><label htmlFor="new-password">New password</label><input id="new-password" type="password" minLength={8} autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} />
        <label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} /></> : <>
        <label htmlFor="help-email">Email address</label><input id="help-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="help-action">I need to</label><select id="help-action" value={action} onChange={e => setAction(e.target.value)}><option value="reset">Reset my password</option><option value="confirm">Confirm my email</option></select></>}
      <button className="auth-submit" disabled={busy}>{busy ? 'Please wait...' : reset ? 'Update password' : 'Send email'}</button>
    </fieldset></form>}
    <p className="auth-footnote"><Link to="/login">Back to sign in</Link></p>
  </div></div>;
};
