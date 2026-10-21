import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * adminOnly: if true, only admin users may access; others get redirected to /login or home.
 */
export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { authUser, isAdmin, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        background: 'var(--color-ivory)'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          border: '3px solid var(--border-gold)',
          borderTop: '3px solid var(--color-gold)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--color-brown-muted)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
          Verifying privileges...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in -> go to generic login
  if (!authUser) {
    return <Navigate to="/login" state={{ from: location, requiredRole: adminOnly ? 'admin' : 'any' }} replace />;
  }

  // Logged in but not admin on admin-only route
  if (adminOnly && !isAdmin) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '480px',
          background: '#fff',
          padding: '2.5rem',
          borderRadius: '20px',
          border: '1.5px solid rgba(197,161,91,0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', marginBottom: '0.75rem' }}>
            Admin Access Required
          </h2>
          <p style={{ color: 'var(--color-deep-brown)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            You are currently signed in as <strong>{authUser.email}</strong>, which does not have administrative privileges.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <a
              href="/"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                background: 'var(--color-forest)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              Return to Store
            </a>
            <a
              href="/login"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: '1.5px solid var(--border-gold)',
                background: '#fff',
                color: 'var(--color-burgundy)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              Switch Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
