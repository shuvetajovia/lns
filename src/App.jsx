import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { PincodeModal } from './components/PincodeModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';

// Essential Storefront Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <ShopProvider>
      <div className="mn-store-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Global Navigation */}
        <Navbar />

        {/* Global Modals & Drawers */}
        <CartDrawer />
        <PincodeModal />
        <AuthModal />
        <Toast />

        {/* Core Storefront Routes */}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />

            {/* Protected Admin route — admin-only access */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

      </div>
    </ShopProvider>
  );
}

export default App;

