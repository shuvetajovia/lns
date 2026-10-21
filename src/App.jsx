import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { PincodeModal } from './components/PincodeModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
const BusinessLayout = () => <ShopProvider>
  <div className="mn-store-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar /><CartDrawer /><PincodeModal /><AuthModal /><Toast />
    <main style={{ flex: 1 }}><Outlet /></main><Footer />
  </div>
</ShopProvider>;
export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<LoginPage />} />
    <Route path="/admin/login" element={<Navigate to="/login" replace />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<BusinessLayout />}>
        <Route element={<ProtectedRoute customerOnly />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
