import React, { useState, useEffect, useMemo, memo } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { ShoppingBag, Heart, Search, X, MapPin, Smartphone, User, Bell, ChevronRight, CheckCircle2, MessageCircle, Instagram, Facebook, ShieldCheck, ArrowRight, Star, Menu, ChevronDown, Trash2, Clock, Package, AlertCircle, History, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import pinData from './pincodes.json';
import { CloudService } from './CloudService.js';

// --- Professional Heritage Product Catalogue (15 ITEMS - SOURCE REMOVED) ---
const PRODUCTS = [
  {
    id: 1,
    name: "Karuppu Kavuni Rice",
    tamilName: "கருப்பு கவுனி அரிசி",
    price: 210,
    oldPrice: 250,
    category: "Heritage Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Mother Nature Karuppu Kavuni Rice is a healthy and traditional black rice with a rich, natural taste. It is naturally packed with antioxidants that help keep your heart strong and improve immunity. With high fiber content, it supports good digestion and keeps you full for a longer time. It also helps in maintaining healthy blood sugar levels, making it a smart choice for everyday meals. Choose Mother Nature for pure and natural rice that keeps your family healthy and happy.",
    weight: "500g",
    isBestSeller: true
  },
  {
    id: 2,
    name: "Bamboo Rice",
    tamilName: "மூங்கில் அரிசி",
    price: 420,
    oldPrice: 480,
    category: "Heritage Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Harvested from bamboo seeds once in 40 years. Exceptionally high in protein and calcium. Excellent for bone health and joint strength.",
    weight: "250g",
    isNewArrival: true
  },
  {
    id: 3,
    name: "Nava Rice",
    tamilName: "நவ அரிசி",
    price: 180,
    oldPrice: 220,
    category: "Heritage Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "A unique blend of nine traditional rice varieties. Provides comprehensive nutrition and sustained ancestral energy.",
    weight: "500g",
    isBestSeller: true
  },
  {
    id: 4,
    name: "Thinai",
    tamilName: "தினை",
    price: 115,
    oldPrice: 140,
    category: "Ancient Millets",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Foxtail Millet. Rich in Vitamin B12 and fiber. Excellent for nerve health and strengthening the metabolic system.",
    weight: "500g",
    isBestSeller: true
  },
  {
    id: 5,
    name: "Palm Candy",
    tamilName: "பனங்கற்கண்டு",
    price: 380,
    oldPrice: 450,
    category: "Native Sweeteners",
    image: "https://images.unsplash.com/photo-1596701062351-be5f6a455271?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Crystallized palm nectar. A natural remedy for cough and cold. Packed with iron and essential minerals.",
    weight: "200g"
  },
  {
    id: 6,
    name: "Palm Jaggery",
    tamilName: "பனைவெல்லம்",
    price: 340,
    oldPrice: 400,
    category: "Native Sweeteners",
    image: "https://images.unsplash.com/photo-1596701062351-be5f6a455271?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Pure Karupatti nectar. A mineral powerhouse and blood purifier. The ancestral choice for respiratory health.",
    weight: "500g",
    isBestSeller: true
  },
  {
    id: 7,
    name: "Natural Sugar",
    tamilName: "நாட்டு சர்க்கரை",
    price: 95,
    oldPrice: 120,
    category: "Native Sweeteners",
    image: "https://images.unsplash.com/photo-1596701062351-be5f6a455271?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Chemical-free cane sugar. Retains natural molasses for essential mineral intake and natural sweetness.",
    weight: "500g"
  },
  {
    id: 8,
    name: "Himalayan Rock Salt",
    tamilName: "இந்து கல் உப்பு",
    price: 85,
    oldPrice: 110,
    category: "Essential Minerals",
    image: "https://images.unsplash.com/photo-1610450531586-4ef35ef50ae3?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Harvested from ancient mineral deposits. Contains 84 trace minerals essential for the body's electrolyte balance.",
    weight: "500g",
    isNewArrival: true
  },
  {
    id: 9,
    name: "Kuthiraivali",
    tamilName: "குதிரைவாலி",
    price: 135,
    oldPrice: 160,
    category: "Ancient Millets",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Barnyard millet. Rich in fiber and low glycemic index. Excellent for weight management and sugar control.",
    weight: "500g"
  },
  {
    id: 10,
    name: "Samai",
    tamilName: "சாமை",
    price: 125,
    oldPrice: 150,
    category: "Ancient Millets",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Little millet. High in iron and antioxidant activity. Boosts immunity and provides sustained energy.",
    weight: "500g"
  },
  {
    id: 11,
    name: "Varagu",
    tamilName: "வரகு",
    price: 130,
    oldPrice: 160,
    category: "Ancient Millets",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Kodo millet. A powerhouse of polyphenols and fiber. Best for nerve health and chronic inflammation.",
    weight: "500g"
  },
  {
    id: 12,
    name: "Mappillai Samba Rice",
    tamilName: "மாப்பிள்ளை சம்பா",
    price: 195,
    oldPrice: 230,
    category: "Heritage Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "The 'Bridegroom Rice'. Traditionally used to increase physical strength and masculinity. Excellent for digestion.",
    weight: "500g",
    isNewArrival: true
  },
  {
    id: 13,
    name: "Kullakar Rice",
    tamilName: "குள்ளக்கார் அரிசி",
    price: 205,
    oldPrice: 240,
    category: "Heritage Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Ancient red rice variety. Fast-growing and highly nutritious. Rich in iron and minerals for balanced health.",
    weight: "500g"
  },
  {
    id: 14,
    name: "Pure Honey",
    tamilName: "தேன்",
    price: 450,
    oldPrice: 550,
    category: "Forest Harvest",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Wild forest honey. Sourced from tribal clusters. Unprocessed, unfiltered, and packed with enzymatic goodness.",
    weight: "500g"
  },
  {
    id: 15,
    name: "Heritage Rice Combo",
    tamilName: "பாரம்பரிய அரிசி காம்போ",
    price: 550,
    oldPrice: 650,
    category: "Heritage Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "An exclusive combo of Karuppu Kavuni, Mappillai Samba and Nava Rice.",
    weight: "1.5kg (3x500g)",
    isCombo: true
  },
  {
    id: 16,
    name: "Pure Sweetener Pack",
    tamilName: "இனிப்பு பேக்",
    price: 750,
    oldPrice: 850,
    category: "Native Sweeteners",
    image: "https://images.unsplash.com/photo-1596701062351-be5f6a455271?auto=format&fit=crop&q=80&w=600",
    rating: null,
    description: "Healthy alternative pack containing Palm Candy, Palm Jaggery and Brown Sugar.",
    weight: "1.2kg",
    isCombo: true
  }
];

const TAMILNADU_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode",
  "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet",
  "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
];

const ProductDetailView = ({ products, addToBag, toggleWishlist, wishlist, detailQty, setDetailQty, setIsCartOpen, navigate, handleProductClick, buyNow }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const [activeAccordion, setActiveAccordion] = useState('desc');
  const [isTamil, setIsTamil] = useState(false);

  // Multi-Quantity Support
  const variants = useMemo(() => {
    if (!product || !product.variants) return [];
    try {
      return typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants;
    } catch (e) {
      console.error("Variant Parse Error:", e);
      return [];
    }
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState(null);

  // Set default price and info
  const displayPrice = selectedVariant ? selectedVariant.price : (product ? product.price : 0);
  const displayOldPrice = selectedVariant ? selectedVariant.oldPrice : (product ? product.oldPrice : 0);
  const displayWeight = selectedVariant ? selectedVariant.weight : (product ? product.weight : "");

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      price: displayPrice,
      oldPrice: displayOldPrice,
      weight: displayWeight,
      variantId: selectedVariant ? `${product.id}-${selectedVariant.weight}` : product.id
    };
    addToBag(itemToAdd, detailQty);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    const itemToBuy = {
      ...product,
      price: displayPrice,
      oldPrice: displayOldPrice,
      weight: displayWeight,
      variantId: selectedVariant ? `${product.id}-${selectedVariant.weight}` : product.id
    };
    buyNow(itemToBuy, detailQty);
  };

  if (!product) return <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}><h2>Product Not Found</h2><button className="btn-sm btn-green" onClick={() => navigate('/')}>BACK TO SHOP</button></div>;

  const AccordionItem = ({ id, title, content }) => (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === id ? null : id)}>
        {title}
        <ChevronDown size={18} style={{ transform: activeAccordion === id ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
      </button>
      <AnimatePresence>
        {activeAccordion === id && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="accordion-content">
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="product-detail-page-wrapper">
      <div className="container" style={{ padding: '0 2rem' }}>
        <div className="breadcrumb-nav" style={{ paddingTop: '2rem' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
          <span>{product.category}</span>
          <span style={{ color: '#333' }}>{product.name}</span>
        </div>

        <div className="sanctuary-grid">
          {/* Left: Gallery */}
          <div className="sanctuary-gallery">
            <div className="sanctuary-image-main">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.image}
                alt={product.name}
              />
            </div>
          </div>

          {/* Right: Info */}
          <div className="sanctuary-info">
            <header className="sanctuary-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 className="sanctuary-title">{product.name}</h1>
                  <span className="sanctuary-tamil">{product.tamilName}</span>
                </div>
                <button
                  className={`wish-action ${wishlist.some(i => i.id === product.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  style={{ position: 'relative', top: 0, right: 0, width: '50px', height: '50px', background: '#f8faf9', flexShrink: 0 }}
                >
                  <Heart size={24} fill={wishlist.some(i => i.id === product.id) ? '#ef4444' : 'none'} color={wishlist.some(i => i.id === product.id) ? '#ef4444' : '#666'} />
                </button>
              </div>

              <div className="sanctuary-rating-row">
                <div style={{ display: 'flex', gap: '3px', color: 'var(--brand-gold)' }}>
                  <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 600 }}>({product.id * 7 + 12} Reviews)</span>
              </div>

              <div className="sanctuary-price-row" style={{ alignItems: 'baseline', gap: '1rem' }}>
                <span className="price-main">₹{displayPrice}</span>
                {displayOldPrice > displayPrice && <span className="price-strike">₹{displayOldPrice}</span>}
                <span className="sanctuary-weight-badge">{displayWeight}</span>
              </div>

              {/* Variant Selector */}
              {variants.length > 0 && (
                <div className="variant-selector-wrap" style={{ marginTop: '2rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Quantity</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setSelectedVariant(null)}
                      style={{
                        padding: '0.8rem 1.5rem',
                        border: '2px solid',
                        borderColor: selectedVariant === null ? 'var(--brand-green)' : '#eee',
                        background: selectedVariant === null ? '#f0fdf4' : 'white',
                        color: selectedVariant === null ? 'var(--brand-green)' : '#333',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 800,
                        transition: '0.3s'
                      }}
                    >
                      {product.weight} - ₹{product.price}
                    </button>
                    {variants.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(v)}
                        style={{
                          padding: '0.8rem 1.5rem',
                          border: '2px solid',
                          borderColor: selectedVariant === v ? 'var(--brand-green)' : '#eee',
                          background: selectedVariant === v ? '#f0fdf4' : 'white',
                          color: selectedVariant === v ? 'var(--brand-green)' : '#333',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontWeight: 800,
                          transition: '0.3s'
                        }}
                      >
                        {v.weight} - ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.stock > 0 && product.stock <= 5 && (
                <div style={{ background: '#fff1f0', color: '#cf1322', padding: '0.8rem 1.2rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #ffa39e', marginBottom: '2rem', marginTop: '2rem' }}>
                  ⚠️ Only {product.stock} items left in stock!
                </div>
              )}
            </header>

            <div className="sanctuary-actions">
              <div className="qty-pill">
                <button onClick={() => setDetailQty(Math.max(1, detailQty - 1))}>-</button>
                <span>{detailQty}</span>
                <button onClick={() => setDetailQty(Math.min(product.stock, detailQty + 1))}>+</button>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
              </button>
            </div>

            <button
              className="buy-now-btn-full"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              BUY NOW
            </button>

            <div className="heritage-accordion">
              <AccordionItem
                id="desc"
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>Description</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsTamil(!isTamil); }}
                      style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', color: 'var(--brand-green)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}
                    >
                      <Languages size={14} />
                      {isTamil ? "READ IN ENGLISH" : "தமிழ் விளக்கத்தைப் படிக்க"}
                    </button>
                  </div>
                }
                content={isTamil ? (product.tamilDescription || product.description) : (product.description || "Pristine and natural product harvested with care.")}
              />
              <AccordionItem
                id="ingredients"
                title="Ingredients"
                content="100% Pure & Organic. No synthetic additives."
              />
              <AccordionItem
                id="howtouse"
                title="How To Use"
                content="Incorporate into your daily wellness ritual for best results."
              />
            </div>
          </div>
        </div>

        {/* Recommendations Rail */}
        <section className="recommendations-rail">
          <header className="rail-header">
            <h2 className="rail-title">Recommended Products</h2>
            <p className="rail-subtitle">Cultivate a healthy lifestyle with these pairings:</p>
          </header>
          <div className="rail-grid">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(p => (
                <div key={p.id} className="mini-card" onClick={() => handleProductClick(p)}>
                  <div className="mini-img"><img src={p.image} alt="" /></div>
                  <h4 style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: 800 }}>{p.name}</h4>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--brand-green)', display: 'block', marginTop: '0.5rem' }}>₹{p.price}</span>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};


const ProductCard = memo(({ p, addToBag, handleProductClick, setDetailQty, setIsCartOpen, wishlist, toggleWishlist }) => {
  const isWishlisted = wishlist.some(i => i.id === p.id);
  const hasVariants = useMemo(() => {
    if (!p.variants) return false;
    try {
      const parsed = typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants;
      return parsed && parsed.length > 0;
    } catch (e) {
      return false;
    }
  }, [p.variants]);

  return (
    <motion.div className="product-card" onClick={() => { handleProductClick(p); setDetailQty(1); }}>
      <div className="square-img-wrap">
        <div className="weight-badge-floating">{p.weight}</div>
        <img src={p.image} alt="" />
        <button
          className={`wish-action ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
          style={{ color: isWishlisted ? '#ef4444' : '#666' }}
        >
          <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>
      </div>
      <div className="product-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="cat-tag">{p.category}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {hasVariants && <span style={{ background: '#e6f7ff', color: '#1890ff', fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>MORE OPTIONS</span>}
            {p.stock === 0 && <span style={{ background: '#fff1f0', color: '#cf1322', fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>SOLD OUT</span>}
            {(p.stock > 0 && p.stock <= 5) && <span style={{ background: '#fff1f0', color: '#cf1322', fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>ONLY {p.stock} LEFT</span>}
          </div>
        </div>
        <h3 className="prod-name">{p.name}</h3>
        <span className="tamil-text-big">{p.tamilName}</span>
        <div className="heritage-price-stack">
          <div className="price-row">
            <span className="p-now">{hasVariants ? 'From ' : ''}₹{p.price}</span>
            {p.oldPrice > p.price && <span className="p-was">₹{p.oldPrice}</span>}
          </div>
          <div className="weight-row">
            <span className="weight-label">Net Vol:</span>
            <span className="weight-val">{p.weight}</span>
          </div>
        </div>

        <button
          className={`btn-sm ${p.stock === 0 ? 'btn-disabled' : 'btn-green'} w-full mt-4`}
          style={{ width: '100%', marginTop: '1rem', ...(p.stock === 0 ? { cursor: 'not-allowed', background: '#eee', color: '#aaa', borderColor: '#eee' } : {}) }}
          disabled={p.stock === 0}
          onClick={(e) => { e.stopPropagation(); addToBag(p, 1); setIsCartOpen(true); }}
        >
          {p.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
        </button>
      </div>
    </motion.div>
  );
});

const App = () => {
  const navigate = useNavigate();
  // --- Persistent State ---
  const [products, setProducts] = useState(PRODUCTS);
  const [districts, setDistricts] = useState(TAMILNADU_DISTRICTS);

  useEffect(() => {
    const syncWithCloud = async () => {
      const cloudProds = await CloudService.getProducts();
      if (cloudProds && cloudProds.length > 0) setProducts(cloudProds);

      const cloudAreas = await CloudService.getAreas();
      if (cloudAreas && cloudAreas.length > 0) {
        setDistricts(cloudAreas.map(a => a.district));
      }
    };
    syncWithCloud();
  }, []);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('mn_cart_v10') || '[]'));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('mn_wish_v10') || '[]'));
  const [user, setUser] = useState(() => {
    const defaultUser = { loggedIn: false, name: "", email: "", phone: "", altPhone: "", loc: "Chennai", doorNo: "", buildingNo: "", streetName: "", landmark: "", pincode: "" };
    try {
      const stored = localStorage.getItem('mn_user_v10');
      if (!stored) return defaultUser;
      return { ...defaultUser, ...JSON.parse(stored) };
    } catch (e) {
      return defaultUser;
    }
  });

  // --- UI State ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [catFilter, setCatFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null); // 'location', 'auth', 'checkout'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [detailQty, setDetailQty] = useState(1);
  const [pincodeError, setPincodeError] = useState("");
  const [checkoutAwaitingAuth, setCheckoutAwaitingAuth] = useState(false);

  // --- Checkout Flow ---
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Address, 2: Bill Summary, 3: Payment

  // --- Auth Specific State ---
  const [authTab, setAuthTab] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '' });
  const [authError, setAuthError] = useState("");

  // --- Order History State ---
  const [userOrders, setUserOrders] = useState([]);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);

  const fetchUserOrders = async () => {
    if (!user.loggedIn || !user.phone) return;
    setIsRefreshingOrders(true);
    const allOrders = await CloudService.getOrders();
    if (allOrders) {
      // Filter by phone (some might be strings, handle carefully)
      const filtered = allOrders.filter(o => String(o.customerPhone) === String(user.phone));
      setUserOrders(filtered);
    }
    setIsRefreshingOrders(false);
  };

  useEffect(() => {
    if (activeModal === 'auth' && user.loggedIn) {
      setAuthTab('orders');
      fetchUserOrders();
    }
  }, [activeModal, user.loggedIn]);

  useEffect(() => {
    localStorage.setItem('mn_products_v10', JSON.stringify(products));
    localStorage.setItem('mn_cart_v10', JSON.stringify(cart));
    localStorage.setItem('mn_wish_v10', JSON.stringify(wishlist));
    localStorage.setItem('mn_user_v10', JSON.stringify(user));
  }, [products, cart, wishlist, user]);

  const handlePincodeChange = (val) => {
    const code = val.replace(/\D/g, '').slice(0, 6);
    setUser(p => ({ ...p, pincode: code }));
    setPincodeError("");

    if (code.length === 6) {
      const district = pinData[code];
      if (district) {
        // District in JSON might be ALL CAPS, let's normalize to Title Case to match TAMILNADU_DISTRICTS
        const formattedDist = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
        setUser(p => ({ ...p, loc: formattedDist }));
      } else {
        setPincodeError("Delivery only available over the Tamilnadu.");
      }
    }
  };

  const handleAuth = () => {
    setAuthError("");

    if (authTab === 'signup' && (!authForm.name || !authForm.phone)) {
      return setAuthError("Please fill both Name and Phone");
    }
    if (authTab === 'login' && !authForm.phone) {
      return setAuthError("Please enter your Phone number");
    }

    // Profile Building and immediate Login
    if (authTab === 'signup') {
      setUser(prev => ({ ...prev, loggedIn: true, name: authForm.name, phone: authForm.phone, email: authForm.email }));
    } else {
      setUser(prev => ({ ...prev, loggedIn: true, name: user.name || "Heritage User", phone: authForm.phone }));
    }

    // Cleanup and Redirect
    setActiveModal(null);
    setAuthForm({ name: '', email: '', phone: '' });

    if (checkoutAwaitingAuth) {
      setCheckoutAwaitingAuth(false);
      setCheckoutStep(1);
      setActiveModal('checkout');
    }
  };

  const addToBag = (p, qty = 1, e) => {
    if (e) e.stopPropagation();
    const cleanQty = Math.max(1, parseInt(qty) || 1);
    const identifier = p.variantId || p.id;
    setCart(prev => {
      const exists = prev.find(i => (i.variantId || i.id) === identifier);
      if (exists) return prev.map(i => (i.variantId || i.id) === identifier ? { ...i, qty: i.qty + cleanQty } : i);
      return [...prev, { ...p, qty: cleanQty }];
    });
  };


  const buyNow = (p, qty = 1) => {
    const cleanQty = Math.max(1, parseInt(qty) || 1);
    setCart([{ ...p, qty: cleanQty }]); // Buy now replaces cart for immediate focus

    if (!user.loggedIn) {
      setCheckoutAwaitingAuth(true);
      setAuthTab('login');
      setActiveModal('auth');
    } else {
      setCheckoutStep(1);
      setActiveModal('checkout');
    }
    setSelectedProduct(null);
  };

  const removeFromCart = (identifier) => setCart(prev => prev.filter(i => (i.variantId || i.id) !== identifier));

  const toggleWishlist = (p) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === p.id);
      if (exists) return prev.filter(i => i.id !== p.id);
      return [...prev, { ...p, wishQty: 1 }];
    });
  };

  const updateWishQty = (id, delta) => {
    setWishlist(prev => prev.map(i => i.id === id ? { ...i, wishQty: Math.max(1, (i.wishQty || 1) + delta) } : i));
  };

  const handleProductClick = (p) => {
    navigate(`/product/${p.id}`);
    window.scrollTo(0, 0);
  };

  const handleLocationSet = (loc) => {
    setUser(prev => ({ ...prev, loc }));
    setActiveModal(null);
  };

  const subtotal = cart.reduce((a, b) => a + (b.price * b.qty), 0);
  const productGst = Math.round(subtotal * 0.18);
  const delivery = subtotal > 999 ? 0 : 50;
  const baseAmount = subtotal + productGst + delivery;
  const transactionCharge = Math.round(baseAmount * 0.02);
  const transactionGst = Math.round(transactionCharge * 0.18);
  const total = baseAmount + transactionCharge + transactionGst;

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const recommendedItems = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.tamilName.toLowerCase().includes(q)).slice(0, 15);
  }, [searchQuery, products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesCat = catFilter === "All" || p.category === catFilter;
      if (!searchQuery.trim()) return matchesCat;
      const q = searchQuery.toLowerCase();
      return matchesCat && (p.name.toLowerCase().includes(q) || p.tamilName.toLowerCase().includes(q));
    });

    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Newest") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, catFilter, searchQuery, sortBy]);

  const isSearching = searchQuery.trim().length > 0;
  const isSorting = sortBy !== "Recommended";
  const showFlatList = catFilter !== "All" || isSearching || isSorting;

  return (
    <div className="mother-nature-v6">
      <header className="site-header">
        {!user.loggedIn && (
          <div className="login-nudge-bar" style={{ background: '#f0fdf4', padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #dcfce7', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-green)' }}>🛒 Log in to save your cart and enjoy faster checkout.</span>
            <button className="btn-sm btn-green" style={{ padding: '0.4rem 1rem', fontSize: '0.65rem' }} onClick={() => setActiveModal('auth')}>LOGIN NOW</button>
          </div>
        )}
        <div className="announcement-bar">
          PURE AND NATURAL. • FREE DELIVERY ABOVE ₹999
        </div>

        <nav className="nav">
          <div className="container nav-content">
            <button className="menu-toggle-btn" onClick={() => setIsMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="logo-center" onClick={() => { setSearchQuery(""); setCatFilter("All"); navigate('/'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
              <div className="logo-title" style={{ cursor: 'pointer' }}>MOTHER NATURE</div>
              <div className="logo-sub">Pure and Natural Wellness</div>
            </div>

            <div className="search-container">
              <Search className="search-icon-abs" size={18} strokeWidth={2.5} />
              <input type="text" className="search-input" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <AnimatePresence>
                {recommendedItems.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="search-results-dropdown">
                    {recommendedItems.map(p => (
                      <div key={p.id} className="search-rec-item" onClick={() => { setSearchQuery(p.name); }}>
                        <img src={p.image} className="search-rec-img" alt="" />
                        <div className="search-rec-info">
                          <h4>{p.name}</h4>
                          <span className="tamil-small">{p.tamilName}</span>
                          <div className="price-tag">₹{p.price}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="nav-actions">
              <button className="nav-action-btn" onClick={() => setActiveModal('location')}>
                <MapPin size={22} strokeWidth={1.5} />
                <span className="nav-action-label">{user.loc}</span>
              </button>
              <button className="nav-action-btn" onClick={() => setActiveModal('auth')}>
                <User size={22} strokeWidth={1.5} />
                <span className="nav-action-label">{user.loggedIn ? user.name.split(' ')[0].toUpperCase() : "LOGIN"}</span>
              </button>
              <button className="nav-action-btn" onClick={() => setIsWishlistOpen(true)}>
                <div className="icon-wrapper-rel">
                  <Heart size={22} strokeWidth={1.5} />
                  {wishlist.length > 0 && <span className="badge-count" style={{ background: '#ef4444' }}>{wishlist.length}</span>}
                </div>
                <span className="nav-action-label">WISH</span>
              </button>
              <button className="nav-action-btn" onClick={() => setIsCartOpen(true)}>
                <div className="icon-wrapper-rel">
                  <ShoppingBag size={22} strokeWidth={1.5} />
                  {cart.length > 0 && <span className="badge-count">{cart.length}</span>}
                </div>
                <span className="nav-action-label">CART</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={
          <>
            <section className={`hero-section ${isSearching ? 'hidden' : ''}`}>
              <div className="container">
                <div className="hero-banner-horiz">
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" alt="Banner" />
                  <div className="hero-overlay-text">
                    <span className="premium-label">Nature's Integrity</span>
                    <h1>Pure and Natural. <br />Purity Preserved.</h1>
                    <p>Directly from the fields of Tamil Nadu to your home.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="shop-section">
              <div className="container">
                <div className="controls-row-heritage">
                  <div className="cat-selector-container">
                    <button className={`cat-selector-btn ${isCatMenuOpen ? 'active' : ''}`} onClick={() => { setIsCatMenuOpen(!isCatMenuOpen); setIsSortMenuOpen(false); }}>
                      <div className="cat-btn-content">
                        <span className="cat-btn-label">Explore Categories</span>
                        <span className="cat-btn-active-val">{catFilter}</span>
                      </div>
                      <ChevronDown size={20} className={`chevron-icon ${isCatMenuOpen ? 'rotate' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isCatMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="cat-dropdown-panel">
                          {categories.map(c => (
                            <button key={c} className={`cat-menu-item ${catFilter === c ? 'active' : ''}`} onClick={() => { setCatFilter(c); setIsCatMenuOpen(false); }}>
                              <span className="cat-item-name">{c}</span>
                              {catFilter === c && <CheckCircle2 size={16} />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="sort-selector-container">
                    <button className={`cat-selector-btn ${isSortMenuOpen ? 'active' : ''}`} onClick={() => { setIsSortMenuOpen(!isSortMenuOpen); setIsCatMenuOpen(false); }}>
                      <div className="cat-btn-content">
                        <span className="cat-btn-label">Sort By</span>
                        <span className="cat-btn-active-val" style={{ fontSize: '0.9rem' }}>{sortBy}</span>
                      </div>
                      <ChevronDown size={20} className={`chevron-icon ${isSortMenuOpen ? 'rotate' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isSortMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="cat-dropdown-panel small-sort-panel">
                          {["Recommended", "Price: Low to High", "Price: High to Low", "Newest"].map(s => (
                            <button key={s} className={`cat-menu-item ${sortBy === s ? 'active' : ''}`} onClick={() => { setSortBy(s); setIsSortMenuOpen(false); }}>
                              <span className="cat-item-name">{s}</span>
                              {sortBy === s && <CheckCircle2 size={16} />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="product-sections">
                  {!showFlatList ? (
                    <>
                      <section className="product-section-group">
                        <h2 className="section-title">Best Sellers</h2>
                        <div className="product-grid">
                          {products.filter(p => p.isBestSeller).map(p => (
                            <ProductCard key={p.id} p={p} addToBag={addToBag} handleProductClick={handleProductClick} setDetailQty={setDetailQty} setIsCartOpen={setIsCartOpen} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                          ))}
                        </div>
                      </section>

                      {/* Dynamic Category Sections */}
                      {categories.filter(c => c !== "All").map(catName => (
                        <section key={catName} className="product-section-group">
                          <h2 className="section-title">{catName}</h2>
                          <div className="product-grid">
                            {products.filter(p => p.category === catName).map(p => (
                              <ProductCard key={p.id} p={p} addToBag={addToBag} handleProductClick={handleProductClick} setDetailQty={setDetailQty} setIsCartOpen={setIsCartOpen} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                            ))}
                          </div>
                        </section>
                      ))}
                    </>
                  ) : (
                    <div className="product-section-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Showing {filteredAndSortedProducts.length} Results</h2>
                      </div>
                      <div className="product-grid">
                        {filteredAndSortedProducts.map(p => (
                          <ProductCard key={p.id} p={p} addToBag={addToBag} handleProductClick={handleProductClick} setDetailQty={setDetailQty} setIsCartOpen={setIsCartOpen} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
            <section className="bulk-enquiry-banner">
              <div className="container bulk-enquiry-inner">
                <MessageCircle size={48} className="bulk-icon" />
                <h2 className="bulk-title">Bulk Harvest Enquiry</h2>
                <p className="bulk-desc">Are you looking for pure and natural products in large quantities for your business or events? Connect with us for exclusive bulk pricing.</p>
                <div className="bulk-actions">
                  <a href="https://wa.me/919360013709?text=I'm%20interested%20in%20bulk%20enquiry%20for%20Mother%20Nature%20products" target="_blank" className="btn-sm btn-green bulk-btn">
                    <Smartphone size={20} /> WHATSAPP ENQUIRY
                  </a>
                  <button onClick={() => alert("Our bulk desk will contact you soon!")} className="btn-sm bulk-btn secondary">REACH OUT VIA CALL</button>
                </div>
              </div>
            </section>
          </>
        } />
        <Route path="/product/:id" element={<ProductDetailView products={products} addToBag={addToBag} toggleWishlist={toggleWishlist} wishlist={wishlist} detailQty={detailQty} setDetailQty={setDetailQty} setIsCartOpen={setIsCartOpen} navigate={navigate} handleProductClick={handleProductClick} buyNow={buyNow} />} />
      </Routes>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div className="menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} />
            <motion.div className="side-menu" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
              <div className="side-menu-header">
                <div className="logo-title">MOTHER NATURE</div>
                <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
              </div>
              <div className="side-menu-content">
                <nav className="side-nav">
                  <button onClick={() => { setCatFilter("All"); window.scrollTo({ top: 1000, behavior: 'smooth' }); setIsMenuOpen(false); }}>
                    <span>Products</span>
                    <ChevronRight size={18} />
                  </button>
                  <button onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); setIsMenuOpen(false); }}>
                    <span>About Us</span>
                    <ChevronRight size={18} />
                  </button>
                  <button onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); setIsMenuOpen(false); }}>
                    <span>Contact Us</span>
                    <ChevronRight size={18} />
                  </button>
                </nav>
                <div className="side-menu-footer">
                  <p>Authentic and natural wellness from the fields of Tamil Nadu.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <div className="modal-mask" onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="modal-content-full" onClick={e => e.stopPropagation()}>
              <button className="modal-close-btn" style={{ top: '2rem', right: '2rem' }} onClick={() => setSelectedProduct(null)}><X size={32} /></button>

              <div className="product-detail-layout">
                <div className="detail-image-wrap">
                  <motion.img initial={{ scale: 0.95 }} animate={{ scale: 1 }} src={selectedProduct.image} alt="" />
                </div>

                <div className="detail-scroll-content custom-scroll">
                  <div className="detail-header-group">
                    <span className="cat-tag-pill">{selectedProduct.category} • {selectedProduct.weight}</span>
                    <h2 className="detail-modal-title">{selectedProduct.name}</h2>
                    <span className="detail-tamil-label">{selectedProduct.tamilName}</span>
                  </div>

                  <div className="detail-price-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem', borderTop: '1px solid #f0f0f0', paddingTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="detail-price-now" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-green)' }}>₹{selectedProduct.price}</span>
                      <span className="p-was" style={{ textDecoration: 'line-through', color: '#aaa', fontSize: '1.2rem', marginLeft: '15px' }}>₹{selectedProduct.oldPrice}</span>
                    </div>
                    <button
                      className={`wish-action ${wishlist.some(i => i.id === selectedProduct.id) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(selectedProduct)}
                      style={{ position: 'relative', top: 0, right: 0, width: '50px', height: '50px', background: '#f8faf9' }}
                    >
                      <Heart size={24} fill={wishlist.some(i => i.id === selectedProduct.id) ? '#ef4444' : 'none'} color={wishlist.some(i => i.id === selectedProduct.id) ? '#ef4444' : '#666'} />
                    </button>
                  </div>

                  <p className="detail-desc" style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8, marginTop: '1rem' }}>{selectedProduct.description}</p>

                  <div className="detail-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                    <div className="meta-item">
                      <span className="meta-label" style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>Ancient Rating</span>
                      <div style={{ display: 'flex', gap: '4px', color: 'var(--brand-gold)' }}>
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                      </div>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label" style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>Availability</span>
                      <span className="meta-value" style={{ fontWeight: 900, fontSize: '1.1rem', color: selectedProduct.stock < 10 ? '#cf1322' : 'var(--brand-green)' }}>{selectedProduct.stock > 0 ? `${selectedProduct.stock} Units in Reserve` : "Exhausted"}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '3rem' }}>
                    <div className="qty-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #eee', padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#f8faf9' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px' }}>UNITS:</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedProduct.stock}
                        value={detailQty}
                        onChange={(e) => setDetailQty(Math.min(selectedProduct.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                        style={{ width: '60px', border: 'none', background: 'none', fontWeight: 900, textAlign: 'center', fontSize: '1.2rem', color: 'var(--brand-green)' }}
                      />
                    </div>
                    <button
                      className={`btn-sm ${selectedProduct.stock === 0 ? 'btn-disabled' : 'btn-green'}`}
                      disabled={selectedProduct.stock === 0}
                      style={{ flex: 1, padding: '1.2rem', borderRadius: '12px' }}
                      onClick={() => { addToBag(selectedProduct, detailQty); setSelectedProduct(null); setIsCartOpen(true); }}
                    >
                      {selectedProduct.stock === 0 ? 'NOT AVAILABLE' : 'ADD TO HARVEST BAG'}
                    </button>
                    <button
                      className={`btn-sm ${selectedProduct.stock === 0 ? 'btn-disabled' : 'btn-green'}`}
                      disabled={selectedProduct.stock === 0}
                      style={{ flex: 1, padding: '1.2rem', borderRadius: '12px', border: '2px solid var(--brand-green)', background: 'white', color: 'var(--brand-green)' }}
                      onClick={() => buyNow(selectedProduct, detailQty)}
                    >
                      BUY NOW
                    </button>
                  </div>

                  <div className="recommendations-rail">
                    <h3 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display' }}>Ancient Wisdom Companions</h3>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.5rem' }}>Customers also enriched their health with these:</p>
                    <div className="rail-grid">
                      {products
                        .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
                        .slice(0, 4)
                        .map(p => (
                          <div key={p.id} className="mini-card" onClick={() => { setSelectedProduct(p); setDetailQty(1); document.querySelector('.detail-scroll-content').scrollTo({ top: 0, behavior: 'smooth' }); }}>
                            <div className="mini-img"><img src={p.image} alt="" /></div>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--brand-green)', marginBottom: '0.3rem' }}>{p.name}</h4>
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--brand-accent)' }}>₹{p.price}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>

        {isCartOpen && (
          <div className="modal-mask" onClick={() => setIsCartOpen(false)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="cart-drawer-professional" onClick={e => e.stopPropagation()} style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px', background: '#fff', padding: '3rem', zIndex: 3000, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}><h3>Your Harvest Bag</h3><button onClick={() => setIsCartOpen(false)}><X /></button></div>
              <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scroll">
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '6rem', padding: '0 2rem' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f8faf9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <ShoppingBag size={32} color="#ccc" />
                    </div>
                    <h4 style={{ color: 'var(--brand-green)', marginBottom: '0.5rem' }}>Your Bag is Empty</h4>
                    <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6' }}>Ancient nutrition awaits your harvest. Explore our collection to find the pure goodness you seek.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {cart.map(i => (
                      <div key={i.variantId || i.id} className="premium-cart-item">
                        <div className="cart-item-img-wrap">
                          <img src={i.image} alt={i.name} />
                        </div>
                        <div className="cart-item-details">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 className="cart-item-name">{i.name}</h4>
                            <button
                              className="cart-remove-action"
                              onClick={() => removeFromCart(i.variantId || i.id)}
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <span className="cart-item-meta">{i.weight} • ₹{i.price} / unit</span>
                          <div className="cart-item-footer">
                            <div className="cart-qty-display">
                              <span className="qty-label">Quantity:</span>
                              <span className="qty-value">{i.qty}</span>
                            </div>
                            <span className="cart-item-total">₹{i.price * i.qty}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '2px solid var(--brand-green)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <button className="btn-sm btn-green w-full" style={{ width: '100%', padding: '1.2rem' }} onClick={() => {
                    if (!user.loggedIn) {
                      setCheckoutAwaitingAuth(true);
                      setAuthTab('login');
                      setActiveModal('auth');
                      setIsCartOpen(false);
                    } else {
                      setCheckoutStep(1);
                      setActiveModal('checkout');
                      setIsCartOpen(false);
                    }
                  }}>PROCEED TO CHECKOUT</button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {isWishlistOpen && (
          <div className="modal-mask" onClick={() => setIsWishlistOpen(false)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="cart-drawer-professional" onClick={e => e.stopPropagation()} style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 'min(450px, 90vw)', background: '#fff', padding: '0', zIndex: 3000, display: 'flex', flexDirection: 'column', boxShadow: '-24px 0 80px rgba(0,0,0,0.15)' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ background: 'var(--brand-green)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={16} fill="white" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Playfair Display' }}>Heritage Favorites</h3>
                </div>
                <button onClick={() => setIsWishlistOpen(false)} style={{ color: '#888', hover: { color: 'var(--brand-green)' }, transition: '0.2s' }}><X size={20} /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }} className="custom-scroll">
                {wishlist.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '6rem', padding: '0 2rem' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f8faf9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <Heart size={32} color="#ccc" />
                    </div>
                    <h4 style={{ color: 'var(--brand-green)', marginBottom: '0.5rem' }}>Your Sanctuary is Empty</h4>
                    <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6' }}>Save the ancient nutrients you love. They will wait for you here until you're ready for the harvest.</p>
                    <button
                      className="btn-sm btn-green"
                      style={{ marginTop: '2rem', padding: '0.8rem 2rem' }}
                      onClick={() => { setIsWishlistOpen(false); window.scrollTo({ top: 1000, behavior: 'smooth' }); }}
                    >
                      EXPLORE COLLECTION
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <AnimatePresence>
                      {wishlist.map(i => (
                        <motion.div
                          key={i.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          style={{ display: 'flex', gap: '1.2rem', background: '#fff', border: '1px solid #f0f0f0', padding: '1rem', borderRadius: '12px', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
                        >
                          <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={i.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={i.name} />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--brand-green)', fontWeight: 700 }}>{i.name}</h4>
                              <button onClick={() => toggleWishlist(i)} style={{ color: '#ccc', padding: '2px' }}><X size={14} /></button>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#999', marginTop: '2px' }}>{i.category} • {i.weight}</span>
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-accent)' }}>₹{i.price}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8faf9', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #eee' }}>
                                  <button onClick={() => updateWishQty(i.id, -1)} style={{ fontSize: '1rem', color: 'var(--brand-green)', fontWeight: 800 }}>-</button>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>{i.wishQty || 1}</span>
                                  <button onClick={() => updateWishQty(i.id, 1)} style={{ fontSize: '1rem', color: 'var(--brand-green)', fontWeight: 800 }}>+</button>
                                </div>
                              </div>
                              <button
                                className="btn-sm btn-green"
                                style={{ fontSize: '0.65rem', padding: '0.6rem 0.8rem', borderRadius: '6px' }}
                                onClick={() => { addToBag(i, i.wishQty || 1); toggleWishlist(i); setIsCartOpen(true); setIsWishlistOpen(false); }}
                              >
                                ADD {i.wishQty > 1 ? `(${i.wishQty})` : ''} TO BAG
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {wishlist.length > 0 && (
                <div style={{ padding: '2rem', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '1.5rem' }}>Your favorites are preserved across all your sessions.</p>
                  <button
                    style={{ background: 'none', border: 'none', color: '#888', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => { if (confirm("Clear your entire wishlist?")) setWishlist([]); }}
                  >
                    CLEAR ENTIRE WISHLIST
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <>

          {activeModal === 'location' && (
            <div className="modal-mask" onClick={() => setActiveModal(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}><MapPin size={40} color="var(--brand-green)" /><h3>Set Delivery District</h3></div>
                <div className="district-scroll-area" style={{ maxHeight: '400px' }}>
                  <div className="location-grid">
                    {districts.map(loc => (
                      <button key={loc} className={`loc-pill ${user.loc === loc ? 'active' : ''}`} onClick={() => handleLocationSet(loc)}>{loc}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'auth' && (
            <div className="modal-mask" onClick={() => setActiveModal(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="auth-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
                  {!user.loggedIn ? (
                    <>
                      <button className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`} style={{ flex: 1, padding: '1rem' }} onClick={() => setAuthTab('login')}>LOGIN</button>
                      <button className={`auth-tab-btn ${authTab === 'signup' ? 'active' : ''}`} style={{ flex: 1, padding: '1rem' }} onClick={() => setAuthTab('signup')}>JOIN US</button>
                    </>
                  ) : (
                    <>
                      <button className={`auth-tab-btn ${authTab === 'orders' ? 'active' : ''}`} style={{ flex: 1, padding: '1rem' }} onClick={() => setAuthTab('orders')}>MY ORDERS</button>
                      <button className={`auth-tab-btn ${authTab === 'profile' ? 'active' : ''}`} style={{ flex: 1, padding: '1rem' }} onClick={() => setAuthTab('profile')}>PROFILE</button>
                    </>
                  )}
                </div>

                <div className="auth-body">
                  {!user.loggedIn ? (
                    <>
                      {authTab === 'login' ? (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                          <input type="text" className="premium-input" placeholder="Phone Number" value={authForm.phone} onChange={e => setAuthForm(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                          <input type="text" className="premium-input" placeholder="Full Name" value={authForm.name} onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))} />
                          <input type="text" className="premium-input" placeholder="Phone Number" value={authForm.phone} onChange={e => setAuthForm(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                      )}

                      {authError && <div style={{ color: '#cf1322', fontSize: '0.75rem', fontWeight: 700, marginTop: '1rem', textAlign: 'center' }}>{authError}</div>}

                      <button
                        className="btn-sm btn-green w-full mt-4"
                        style={{ width: '100%', padding: '1.1rem', marginTop: '1.5rem' }}
                        onClick={handleAuth}
                      >
                        {authTab === 'signup' ? 'CREATE PROFILE' : 'LOGIN'}
                      </button>
                    </>
                  ) : (
                    <>
                      {authTab === 'orders' && (
                        <div className="orders-history">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: 0 }}>My Harvest History</h4>
                            <button onClick={fetchUserOrders} style={{ background: 'none', border: 'none', color: 'var(--brand-green)', cursor: 'pointer' }} disabled={isRefreshingOrders}>
                              <History size={18} className={isRefreshingOrders ? 'spin' : ''} />
                            </button>
                          </div>

                          {userOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#ccc' }}>
                              <Package size={48} style={{ marginBottom: '1rem' }} />
                              <p>No orders found yet.<br />Start your healthy journey today!</p>
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                              {userOrders.map(o => {
                                const isCancelable = o.status === 'Pending' || o.status === 'Processing';
                                return (
                                  <div key={o.id} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.2rem', background: '#fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                      <div>
                                        <span style={{ fontSize: '0.65rem', color: '#999', fontWeight: 800 }}>ORDER #{String(o.id).slice(-6)}</span>
                                        <p style={{ fontSize: '0.75rem', margin: '2px 0', color: '#666' }}>{new Date(o.date).toLocaleDateString()}</p>
                                      </div>
                                      <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                          fontSize: '0.65rem',
                                          fontWeight: 900,
                                          padding: '0.3rem 0.6rem',
                                          borderRadius: '4px',
                                          textTransform: 'uppercase',
                                          background: o.status === 'Cancelled' ? '#fff1f0' : (o.status === 'Shipped' || o.status === 'Delivered' ? '#f6ffed' : '#fff7e6'),
                                          color: o.status === 'Cancelled' ? '#cf1322' : (o.status === 'Shipped' || o.status === 'Delivered' ? '#389e0d' : '#d46b08')
                                        }}>
                                          {o.status || 'Pending'}
                                        </span>
                                      </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                      {JSON.parse(o.items || '[]').map((item, idx) => (
                                        <div key={idx} style={{ fontSize: '0.8rem', color: '#444', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                          <span>{item.qty} × {item.name} ({item.weight})</span>
                                          <span>₹{item.price * item.qty}</span>
                                        </div>
                                      ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f5f5f5' }}>
                                      <span style={{ fontWeight: 800, color: 'var(--brand-green)' }}>Total: ₹{o.total}</span>
                                      {isCancelable && (
                                        <button
                                          onClick={async () => {
                                            if (confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
                                              const ok = await CloudService.cancelOrder(o.id);
                                              if (ok) fetchUserOrders();
                                            }
                                          }}
                                          style={{ background: '#fff1f0', border: '1px solid #ffa39e', color: '#cf1322', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                          CANCEL ORDER
                                        </button>
                                      )}
                                      {!isCancelable && o.status !== 'Cancelled' && (
                                        <span style={{ fontSize: '0.7rem', color: '#999', fontStyle: 'italic' }}>Shipped - Cannot Cancel</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {authTab === 'profile' && (
                        <div className="profile-details" style={{ textAlign: 'center' }}>
                          <div style={{ width: '80px', height: '80px', background: 'var(--brand-green)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <h3 style={{ margin: 0 }}>{user.name}</h3>
                          <p style={{ color: '#888', marginBottom: '2rem' }}>{user.phone}</p>

                          <div style={{ display: 'grid', gap: '0.8rem' }}>
                            <button className="btn-sm btn-green w-full" onClick={() => { setUser(p => ({ ...p, loggedIn: false })); setActiveModal(null); }}>LOGOUT FROM ACCOUNT</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeModal === 'checkout' && (
            <div className="modal-mask" onClick={() => setActiveModal(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  {[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: '4px', background: s <= checkoutStep ? 'var(--brand-green)' : '#eee' }}></div>)}
                </div>

                {checkoutStep === 1 && (
                  <div className="step-address">
                    <h3>Delivery Address Details</h3>
                    <div className="address-form-wrap" style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                      <input type="text" className="premium-input" placeholder="Full Name" value={user.name} onChange={e => setUser(p => ({ ...p, name: e.target.value }))} />

                      <div className="form-grid-2col">
                        <input type="text" className="premium-input" placeholder="Phone Number" value={user.phone} onChange={e => setUser(p => ({ ...p, phone: e.target.value }))} />
                        <input type="text" className="premium-input" placeholder="Alternative Phone" value={user.altPhone} onChange={e => setUser(p => ({ ...p, altPhone: e.target.value }))} />
                      </div>

                      <div className="form-grid-2col">
                        <input type="text" className="premium-input" placeholder="Building / Door No" value={user.buildingNo} onChange={e => setUser(p => ({ ...p, buildingNo: e.target.value }))} />
                        <input type="text" className="premium-input" placeholder="Street Name" value={user.streetName} onChange={e => setUser(p => ({ ...p, streetName: e.target.value }))} />
                      </div>

                      <input type="text" className="premium-input" placeholder="Landmark / Nearby (Optional)" value={user.landmark} onChange={e => setUser(p => ({ ...p, landmark: e.target.value }))} />

                      <div className="form-grid-2col">
                        <input
                          type="text"
                          className={`premium-input ${pincodeError ? 'error-border' : ''}`}
                          placeholder="Pincode"
                          value={user.pincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                        />
                        <select
                          className="premium-input"
                          value={user.loc}
                          onChange={(e) => {
                            setUser(p => ({ ...p, loc: e.target.value }));
                            setPincodeError("");
                          }}
                        >
                          {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>

                      {pincodeError && <div style={{ background: '#fff1f0', border: '1px solid #ffa39e', padding: '10px', borderRadius: '4px', color: '#cf1322', fontSize: '0.85rem', fontWeight: 600 }}>{pincodeError}</div>}

                      <button
                        className="btn-sm btn-green w-full"
                        style={{ width: '100%', padding: '1.2rem', marginTop: '1rem' }}
                        onClick={() => {
                          if (!user.name || !user.phone || !user.buildingNo || !user.streetName || !user.pincode) {
                            return setPincodeError("Please fill all mandatory address fields");
                          }

                          const expectedDistrict = pinData[user.pincode];
                          if (!expectedDistrict) {
                            return setPincodeError("Invalid Pincode. Delivery only available in Tamil Nadu.");
                          }

                          const normalizedExpected = expectedDistrict.toUpperCase();
                          const normalizedSelected = user.loc.toUpperCase();

                          if (normalizedExpected !== normalizedSelected) {
                            return setPincodeError(`Pincode mismatch: ${user.pincode} resides in ${expectedDistrict}. Please select the correct district.`);
                          }

                          setPincodeError("");
                          setCheckoutStep(2);
                        }}
                      >
                        NEXT: BILL SUMMARY
                      </button>
                    </div>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="step-bill">
                    <h3>Heritage Bill Summary</h3>
                    <div style={{ margin: '2rem 0', background: 'var(--bg-soft)', padding: '2rem', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><span>Products Total</span><span>₹{subtotal}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><span>Overall GST (18%)</span><span>₹{productGst}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: delivery === 0 ? 'var(--brand-green)' : 'inherit' }}><span>Delivery Charge</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>

                      <div style={{ borderTop: '1px dashed #ccc', margin: '1rem 0', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem', color: '#666' }}>
                          <span>Transaction Charge (2%)</span>
                          <span>₹{transactionCharge}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: '#666' }}>
                          <span>Transaction GST (18%)</span>
                          <span>₹{transactionGst}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 900, borderTop: '1px solid #ddd', paddingTop: '1rem', color: 'var(--brand-green)' }}>
                        <span>Final Payable</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                    <button className="btn-sm btn-green w-full" style={{ width: '100%', padding: '1.2rem' }} onClick={() => setCheckoutStep(3)}>PROCEED TO SECURE PAYMENT</button>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="step-payment" style={{ textAlign: 'center' }}>
                    <ShieldCheck size={50} color="var(--brand-green)" style={{ marginBottom: '1rem' }} />
                    <h3>Secure Payment Gateway</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>Secure payment for your heritage collection: ₹{total}</p>
                    <div style={{ display: 'grid', gap: '1rem', margin: '2rem 0' }}>
                      <button className="btn-sm btn-green w-full" style={{ width: '100%', padding: '1.2rem' }} onClick={() => {
                        const options = {
                          key: "rzp_test_YourKeyHere", // TODO: Replace with your actual Razorpay Key ID
                          amount: total * 100, // Amount in paise
                          currency: "INR",
                          name: "MOTHER NATURE",
                          description: "Ancient Wisdom Purity Preserved",
                          image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100",
                          handler: async function (response) {
                            // Payment Successful!
                            const newOrder = {
                              id: 'ODR' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                              date: new Date().toISOString(),
                              customerName: user.name,
                              customerPhone: user.phone,
                              customerAltPhone: user.altPhone,
                              address: {
                                doorNo: user.doorNo,
                                buildingNo: user.buildingNo,
                                streetName: user.streetName,
                                landmark: user.landmark,
                                pincode: user.pincode,
                                district: user.loc
                              },
                              items: cart,
                              subtotal,
                              productGst,
                              delivery,
                              transactionCharge,
                              transactionGst,
                              total,
                              status: 'Pending',
                              paymentId: response.razorpay_payment_id
                            };

                            const success = await CloudService.addOrder(newOrder);
                            if (success) {
                              alert("Ancient Nutri Order Placed! Payment ID: " + response.razorpay_payment_id);
                              setCart([]);
                              localStorage.removeItem('mn_cart_v10');
                              setActiveModal(null);
                            } else {
                              alert("Order saved locally. Please contact support with payment ID: " + response.razorpay_payment_id);
                            }
                          },
                          prefill: {
                            name: user.name,
                            email: user.phone + "@mothernature.com",
                            contact: user.phone
                          },
                          theme: {
                            color: "#166534" // var(--brand-green)
                          }
                        };
                        const rzp = new window.Razorpay(options);
                        rzp.open();
                      }}>PAY ₹{total} VIA SECURE GATEWAY</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      </AnimatePresence>
      <footer style={{ padding: '4rem 0', background: 'var(--brand-green)', color: 'white', marginTop: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p>© 2024 Mother Nature. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
