import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductList } from './components/ProductList';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

const StoreContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] selection:bg-[#8B5A2B] selection:text-white">
      <Header />

      {activeView === 'store' ? (
        <main className="flex-1">
          <Hero />
          <ProductList />
          <CartDrawer />
          <ProductDetailModal />
          <CheckoutModal />
          <OrderSuccessModal />
        </main>
      ) : (
        <main className="flex-1">
          <AdminPortal />
        </main>
      )}

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
