import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
export const WishlistDrawer = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist } = useShop();
  if (!isWishlistOpen) return null;
  const close = () => setIsWishlistOpen(false);
  return <div className="mn-drawer-overlay" onClick={close}><section className="mn-cart-drawer" role="dialog" aria-modal="true" aria-label="Saved products" onClick={e => e.stopPropagation()}>
    <div className="mn-drawer-header"><h2>Your wishlist</h2><button onClick={close} aria-label="Close wishlist"><X /></button></div>
    <div className="mn-drawer-items">{wishlist.length ? wishlist.map(item => <article className="mn-order-card" key={item.id}>
      <Link to={`/product/${item.id}`} onClick={close}>{item.name}</Link><button onClick={() => toggleWishlist(item)}>Remove</button>
    </article>) : <p>No saved products yet. Tap a product's heart to save it.</p>}</div>
  </section></div>;
};
