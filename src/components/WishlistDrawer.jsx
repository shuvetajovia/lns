import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
export const WishlistDrawer = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, products, addToCart, isLoadingProducts } = useShop();
  const drawer = useRef(null);
  useEffect(() => {
    if (!isWishlistOpen) return;
    const previous = document.activeElement;
    drawer.current?.querySelector('button')?.focus();
    const handleKey = e => {
      if (e.key === 'Escape') setIsWishlistOpen(false);
      if (e.key === 'Tab') {
        const items = [...drawer.current.querySelectorAll('button:not(:disabled), a[href]')];
        const first = items[0], last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [isWishlistOpen]);
  if (!isWishlistOpen) return null;
  const close = () => setIsWishlistOpen(false);
  return <div className="mn-drawer-overlay" onClick={close}><section ref={drawer} className="mn-cart-drawer" role="dialog" aria-modal="true" aria-label="Saved products" onClick={e => e.stopPropagation()}>
    <div className="mn-drawer-header"><h2>Your wishlist ({wishlist.length})</h2><button onClick={close} aria-label="Close wishlist"><X /></button></div>
    <div className="mn-drawer-items">{wishlist.length ? wishlist.map(saved => {
      const current = products.find(product => product.id === saved.id);
      const item = current || saved;
      return <article className="mn-wishlist-item" key={item.id}>
        <img src={item.image} alt="" />
        <div><Link to={`/product/${item.id}`} onClick={close}><strong>{item.name}</strong></Link>
          <p>{item.weight} {current && <> · ₹{item.price}</>}</p>
          <p>{isLoadingProducts ? 'Checking availability...' : !current ? 'No longer available' : current.isOutOfStock ? 'Out of stock' : 'In stock'}</p>
          <div className="mn-wishlist-actions">
            {current?.variants?.length ? <Link className="mn-btn mn-btn-forest" to={`/product/${item.id}`} onClick={close}>Choose size</Link> : <button className="mn-btn mn-btn-forest" disabled={isLoadingProducts || !current || current.isOutOfStock} onClick={() => addToCart(current)}>Add to cart</button>}
            <button aria-label={`Remove ${item.name} from wishlist`} onClick={() => toggleWishlist(saved)}>Remove</button>
          </div>
        </div>
      </article>;
    }) : <div><h3>Save your favourites here</h3><p>Tap a product's heart to keep it for later.</p><Link className="mn-btn mn-btn-forest" to="/shop" onClick={close}>Browse products</Link></div>}</div>
    <div className="mn-drawer-footer"><Link to="/shop" onClick={close}>Continue shopping</Link></div>
  </section></div>;
};
