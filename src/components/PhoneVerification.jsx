import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { normalizeMobile } from '../lib/mobile';

export const PhoneVerification = ({ phone }) => {
  const { authUser } = useAuth();
  const [sentTo, setSentTo] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  let normalized = '';
  try { normalized = normalizeMobile(phone); } catch { /* Invalid numbers stay unverified. */ }
  const verified = Boolean(normalized && verifiedPhone === normalized);
  const [retryAt, setRetryAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const enabled = import.meta.env.VITE_PHONE_VERIFICATION_ENABLED === 'true';
  useEffect(() => {
    let active = true;
    setVerifiedPhone(''); setSentTo(''); setCode(''); setMessage('');
    if (enabled) supabase.rpc('is_my_phone_verified', { candidate: phone }).then(({ data, error }) => {
      if (active && !error) setVerifiedPhone(data === true ? normalizeMobile(phone) : '');
    });
    return () => { active = false; };
  }, [phone]);
  useEffect(() => {
    if (!retryAt) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [retryAt]);
  const send = async () => {
    setBusy(true); setMessage('');
    try {
      const number = normalizeMobile(phone);
      const { error } = await supabase.auth.updateUser({ phone: number });
      if (error) throw error;
      setSentTo(number); setCode(''); setRetryAt(Date.now() + 60000); setNow(Date.now());
      setMessage('SMS code sent. Enter it below to verify this number.');
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  };
  const verify = async () => {
    setBusy(true); setMessage('');
    try {
      const expectedId = authUser.id;
      const { data, error } = await supabase.auth.verifyOtp({ phone: sentTo, token: code.trim(), type: 'phone_change' });
      if (error) throw error;
      if (data.user?.id !== expectedId) {
        await supabase.auth.signOut();
        throw new Error('Verification did not match your account. Please sign in again and contact support.');
      }
      const result = await supabase.rpc('is_my_phone_verified', { candidate: sentTo });
      if (result.error) throw result.error;
      if (result.data !== true) throw new Error('The number is not verified yet. Request a new code.');
      setVerifiedPhone(sentTo); setSentTo(''); setCode(''); setMessage('Mobile number verified. Save details if you changed your profile number.');
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  };
  return <section className="mn-phone-verification" aria-label="Mobile verification">
    <h3>Mobile verification</h3>
    <p>{verified ? 'Verified mobile number' : 'Mobile number not verified'}</p>
    {!enabled ? <p>SMS verification is not available yet. Contact the store if you need help with your mobile number.</p> : !verified && <>
      <button type="button" disabled={busy || now < retryAt} onClick={send}>{now < retryAt ? `Resend in ${Math.ceil((retryAt - now) / 1000)}s` : sentTo ? 'Resend SMS code' : 'Send SMS code'}</button>
      {sentTo && <><label>SMS verification code<input inputMode="numeric" autoComplete="one-time-code" maxLength={10} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} /></label><button type="button" disabled={busy || code.length < 6} onClick={verify}>Verify mobile number</button></>}
    </>}
    {message && <p role="status">{message}</p>}
  </section>;
};
