import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { PincodeModal } from './components/PincodeModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';

// Essential Storefront Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';

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
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
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
