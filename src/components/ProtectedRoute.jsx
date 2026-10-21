import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const ProtectedRoute = ({ children, adminOnly = false, customerOnly = false }) => {
  const { authUser, isAdmin, authLoading, authError } = useAuth();
  const location = useLocation();
  if (authLoading) return <div className="auth-loading" role="status">Checking your account...</div>;
  if (!authUser || authError) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  if (customerOnly && isAdmin) return <Navigate to="/admin" replace />;
  return children || <Outlet />;
};
