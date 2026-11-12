import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, AUTH_REDIRECT_URL } from '../supabase';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState('');
  useEffect(() => {
    let active = true;
    let receivedEvent = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      receivedEvent = true;
      if (active) {
        setSession(next); setInitialized(true);
        if (_event === 'PASSWORD_RECOVERY') window.location.hash = '/reset-password';
      }
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || receivedEvent) return;
      setSession(data.session);
      if (error) setAuthError('Unable to restore your session. Please sign in again.');
      setInitialized(true);
    }).catch(() => {
      if (active && !receivedEvent) { setAuthError('Unable to connect. Please try again.'); setInitialized(true); }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    let active = true;
    setIsAdmin(false); setAuthError('');
    if (!session) { setVerifiedToken(null); return; }
    supabase.rpc('is_store_admin').then(({ data, error }) => {
      if (!active) return;
      setIsAdmin(!error && data === true);
      setAuthError(error ? 'Account access could not be verified. Please try again or contact the store owner.' : '');
      setVerifiedToken(session.access_token);
    }).catch(() => {
      if (active) {
        setIsAdmin(false);
        setAuthError('Unable to verify account access. Please try again.');
        setVerifiedToken(session.access_token);
      }
    });
    return () => { active = false; };
  }, [session]);
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) throw error;
    return data;
  };
  const customerSignUp = async (email, password, name, phone) => {
    if (!name.trim()) throw new Error('Please enter your full name.');
    if (password.length < 8) throw new Error('Use at least 8 characters for your password.');
    const { data, error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password,
      options: { emailRedirectTo: AUTH_REDIRECT_URL,
        data: { full_name: name.trim(), phone: phone.trim() } } });
    if (error) throw error;
    return data;
  };
  const sendPasswordReset = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: AUTH_REDIRECT_URL
    });
    if (error) throw error;
  };
  const resendConfirmation = async (email) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim().toLowerCase(),
      options: { emailRedirectTo: AUTH_REDIRECT_URL } });
    if (error) throw error;
  };
  const updatePassword = async (password) => {
    if (password.length < 8) throw new Error('Use at least 8 characters.');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null); setIsAdmin(false); setAuthError('');
  };
  const authLoading = !initialized || Boolean(session && verifiedToken !== session.access_token);
  return <AuthContext.Provider value={{ session, authUser: session?.user ?? null, isAdmin, authLoading,
    authError, signIn, customerSignUp, sendPasswordReset, resendConfirmation, updatePassword, signOut }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
