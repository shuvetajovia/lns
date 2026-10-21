import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
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
      if (active) { setSession(next); setInitialized(true); }
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
    const email = (session.user?.email || '').toLowerCase();
    const isDirectAdmin = email === 'admin@mothernature.in' || session.user?.user_metadata?.role === 'admin';
    supabase.rpc('is_store_admin').then(({ data, error }) => {
      if (!active) return;
      setIsAdmin(isDirectAdmin || (!error && data === true));
      setVerifiedToken(session.access_token);
    }).catch(() => {
      if (active) {
        setIsAdmin(isDirectAdmin);
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
      options: { emailRedirectTo: window.location.origin + window.location.pathname,
        data: { full_name: name.trim(), phone: phone.trim() } } });
    if (error) throw error;
    return data;
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null); setIsAdmin(false); setAuthError('');
  };
  const authLoading = !initialized || Boolean(session && verifiedToken !== session.access_token);
  return <AuthContext.Provider value={{ session, authUser: session?.user ?? null, isAdmin, authLoading,
    authError, signIn, customerSignUp, signOut }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
