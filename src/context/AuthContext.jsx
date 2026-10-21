import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext(null);

// Admin emails - users with these emails get admin role automatically
export const ADMIN_EMAILS = [
  'admin@mothernature.in',
  'saravanan@mothernature.in',
];

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const resolveRole = (supaUser) => {
    if (!supaUser) return false;
    const email = (supaUser.email || '').toLowerCase();
    const metaRole = supaUser.user_metadata?.role;
    return metaRole === 'admin' || ADMIN_EMAILS.includes(email);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      setIsAdmin(resolveRole(session?.user));
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      setIsAdmin(resolveRole(session?.user));
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Generic Sign In for both Admin and Customer
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const admin = resolveRole(data.user);
    setSession(data.session);
    setAuthUser(data.user);
    setIsAdmin(admin);
    return { user: data.user, session: data.session, isAdmin: admin };
  };

  const adminSignIn = async (email, password) => {
    const res = await signIn(email, password);
    if (!res.isAdmin) {
      await supabase.auth.signOut();
      throw new Error('Access denied. This account does not have admin privileges.');
    }
    return res;
  };

  const customerSignIn = async (email, password) => {
    return await signIn(email, password);
  };

  const customerSignUp = async (email, password, name, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone,
          role: 'customer'
        }
      }
    });
    if (error) throw error;
    return data;
  };

  const customerSignInWithOTP = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setAuthUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      session,
      authUser,
      isAdmin,
      authLoading,
      signIn,
      adminSignIn,
      customerSignIn,
      customerSignUp,
      customerSignInWithOTP,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
