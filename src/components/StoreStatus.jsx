import React from 'react';
import { useShop } from '../context/ShopContext';
export const StoreStatus = () => {
  const { catalogError, zonesError, isLoadingProducts, refreshProducts, refreshAreas } = useShop();
  if (isLoadingProducts) return <p className="mn-service-message" role="status">Loading the latest catalog...</p>;
  if (!catalogError && !zonesError) return null;
  return <div className="mn-service-message" role="alert">
    <p>{catalogError ? 'The catalog could not be loaded. Products and availability will appear after reconnection.' : 'Delivery availability could not be loaded. Checkout is unavailable until it reconnects.'}</p>
    <button onClick={() => { refreshProducts(); refreshAreas().catch(() => {}); }}>Retry connection</button>
  </div>;
};
