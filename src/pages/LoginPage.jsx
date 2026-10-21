import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Leaf, ShieldCheck, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
export const LoginPage = () => {
  const { authUser, isAdmin, authLoading, authError, signIn, customerSignUp, signOut } = useAuth();
  const location = useLocation();
  const registering = location.pathname === '/register';
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const from = location.state?.from;
  const validFrom = from && (['/', '/shop', '/checkout'].includes(from.pathname) || from.pathname?.startsWith('/product/'));
  const destination = validFrom ? `${from.pathname}${from.search || ''}${from.hash || ''}` : '/';
  if (authLoading) return <div className="auth-loading" role="status"><Loader2 className="auth-spinner" /> Checking your account...</div>;
  if (authUser && !authError) return <Navigate to={isAdmin ? '/admin' : destination} replace />;
  const submit = async e => {
    e.preventDefault();
    if (busy) return;
    setError(''); setNotice(''); setBusy(true);
    try {
      if (registering) {
        if (form.password !== form.confirm) throw new Error('Your passwords do not match.');
        const data = await customerSignUp(form.email, form.password, form.name, form.phone);
        if (!data.session) {
          setNotice('Check your email to confirm your account, then sign in. If you already have an account, use Sign in.');
          setForm(prev => ({ ...prev, password: '', confirm: '' }));
        }
      } else await signIn(form.email, form.password);
    } catch (err) { setError(err.message || 'Unable to sign in. Please try again.'); }
    finally { setBusy(false); }
  };
  const reset = () => { setError(''); setNotice(''); setForm(prev => ({ ...prev, password: '', confirm: '' })); };
  return <div className="auth-page">
    <aside className="auth-story">
      <div className="auth-brand"><Leaf size={32} /><span>Mother Nature<small>THE FIRST STEP IN HEALTH</small></span></div>
      <div className="auth-story-copy"><span className="auth-eyebrow">ROOTED IN TRADITION</span>
        <h1>A little closer<br />to nature.</h1>
        <p>Native grains, pure ingredients, and everyday nourishment. Welcome to the Mother Nature family.</p>
        <div className="auth-story-rule" /><span>From our roots in Kanchipuram, to your home.</span>
      </div>
      <div className="auth-story-footer"><Leaf size={18} /> Thoughtfully sourced. Naturally yours.</div>
    </aside>
    <section className="auth-form-panel">
      <div className="auth-card">
        <div className="auth-mobile-brand"><Leaf /> Mother Nature</div>
        <span className="auth-eyebrow">YOUR MOTHER NATURE ACCOUNT</span>
        <h2>{registering ? 'Join our family.' : 'Welcome back.'}</h2>
        <p className="auth-intro">{registering ? 'Create your customer account to start shopping.' : 'Sign in to continue to your account.'}</p>
        <nav className="auth-tabs" aria-label="Account access">
          <Link to="/login" state={location.state} onClick={reset} aria-current={!registering ? 'page' : undefined}>Sign in</Link>
          <Link to="/register" state={location.state} onClick={reset} aria-current={registering ? 'page' : undefined}>Customer registration</Link>
        </nav>
        {(error || authError) && <div className="auth-message auth-error" role="alert">{error || authError}</div>}
        {notice && <div className="auth-message auth-notice" role="status">{notice}</div>}
        {authUser && authError ? <div className="auth-retry">
          <button onClick={() => window.location.reload()}>Try again</button>
          <button onClick={() => signOut().catch(err => setError(err.message))}>Sign out</button>
        </div> : <form onSubmit={submit}>
          <fieldset disabled={busy}>
            {registering && <>
              <label htmlFor="auth-name">Full name</label>
              <input id="auth-name" name="name" autoComplete="name" required maxLength={100} value={form.name} onChange={change} placeholder="Your full name" />
              <label htmlFor="auth-phone">Mobile number <span>(optional)</span></label>
              <input id="auth-phone" name="phone" type="tel" autoComplete="tel" maxLength={20} value={form.phone} onChange={change} placeholder="Your mobile number" />
            </>}
            <label htmlFor="auth-email">Email address</label>
            <input id="auth-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={change} placeholder="you@example.com" />
            <label htmlFor="auth-password">Password</label>
            <div className="auth-password">
              <input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 8 : undefined} required value={form.password} onChange={change} placeholder={registering ? 'At least 8 characters' : 'Enter your password'} />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
            </div>
            {registering && <><label htmlFor="auth-confirm">Confirm password</label>
              <input id="auth-confirm" name="confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={form.confirm} onChange={change} placeholder="Re-enter your password" /></>}
            <button className="auth-submit" type="submit">{busy ? <><Loader2 className="auth-spinner" size={19} /> Please wait...</> : <>{registering ? 'Create customer account' : 'Sign in'}<ArrowRight size={19} /></>}</button>
          </fieldset>
        </form>}
        <p className="auth-access-note"><ShieldCheck size={18} />{registering ? 'Registration is for customers only.' : 'One secure login for customers and the store admin. Your account opens the right space automatically.'}</p>
        <p className="auth-footnote">{registering ? 'Already a customer? ' : 'New to Mother Nature? '}<Link to={registering ? '/login' : '/register'} state={location.state} onClick={reset}>{registering ? 'Sign in' : 'Create an account'}</Link></p>
      </div>
      <footer className="auth-form-footer">Mother Nature - Native foods. Timeless goodness.</footer>
    </section>
  </div>;
};
