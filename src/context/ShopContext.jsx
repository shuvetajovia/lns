import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AYURVEDA_PRODUCTS, AYURVEDA_CATEGORIES } from '../data/products';
import pinData from '../pincodes.json';
import { CloudService } from '../CloudService';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Products
  const [products, setProducts] = useState(AYURVEDA_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Sync with Cloud Supabase
  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const cloudProds = await CloudService.getProducts();
      if (cloudProds && Array.isArray(cloudProds) && cloudProds.length > 0) {
        setProducts(cloudProds);
      } else {
        setProducts(AYURVEDA_PRODUCTS);
      }
    } catch (e) {
      console.log("Cloud sync note: using built-in catalog", e);
      setProducts(AYURVEDA_PRODUCTS);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Dynamic Product Management (Admin Actions)
  const addProduct = async (productData) => {
    try {
      const created = await CloudService.addProduct(productData);
      setProducts(prev => [...prev, created]);
      showToast(`Added ${created.name} to catalog!`, "success");
      return created;
    } catch (err) {
      showToast(`Failed to add product: ${err.message}`, "error");
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updated = await CloudService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      showToast(`Updated ${updated.name}!`, "success");
      return updated;
    } catch (err) {
      showToast(`Failed to update: ${err.message}`, "error");
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await CloudService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Product removed from catalog", "info");
      return true;
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`, "error");
      throw err;
    }
  };

  const restockProduct = async (id, newStock) => {
    try {
      const updated = await CloudService.restockProduct(id, newStock);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      showToast(`Restocked ${updated.name} to ${updated.stock} units!`, "success");
      return updated;
    } catch (err) {
      showToast(`Restock failed: ${err.message}`, "error");
      throw err;
    }
  };

  const setOutOfStock = async (id) => {
    try {
      const updated = await CloudService.setOutOfStock(id);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      showToast(`Marked ${updated.name} as Out of Stock`, "info");
      return updated;
    } catch (err) {
      showToast(`Action failed: ${err.message}`, "error");
      throw err;
    }
  };


  // Cart State (stored in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mn_cart_v11');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('mn_wish_v11');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User & Address State
  const [user, setUser] = useState(() => {
    const defaultUser = {
      loggedIn: false,
      name: "",
      email: "",
      phone: "",
      address: {
        doorNo: "",
        street: "",
        landmark: "",
        pincode: "600001",
        district: "Chennai"
      }
    };
    try {
      const saved = localStorage.getItem('mn_user_v11');
      return saved ? { ...defaultUser, ...JSON.parse(saved) } : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  // Pincode Verification State
  const [deliveryPincode, setDeliveryPincode] = useState(() => {
    return localStorage.getItem('mn_pincode_v11') || "600001";
  });
  const [pincodeDistrict, setPincodeDistrict] = useState("Chennai");
  const [isPincodeValid, setIsPincodeValid] = useState(true);

  // Validate initial pincode
  useEffect(() => {
    if (deliveryPincode && deliveryPincode.length === 6) {
      const dist = pinData[deliveryPincode];
      if (dist) {
        const formatted = dist.charAt(0).toUpperCase() + dist.slice(1).toLowerCase();
        setPincodeDistrict(formatted);
        setIsPincodeValid(true);
      } else {
        setIsPincodeValid(false);
      }
    }
  }, [deliveryPincode]);

  const checkPincode = (code) => {
    const clean = String(code).replace(/\D/g, '').slice(0, 6);
    if (clean.length === 6) {
      const dist = pinData[clean];
      if (dist) {
        const formatted = dist.charAt(0).toUpperCase() + dist.slice(1).toLowerCase();
        setDeliveryPincode(clean);
        setPincodeDistrict(formatted);
        setIsPincodeValid(true);
        localStorage.setItem('mn_pincode_v11', clean);
        return { valid: true, district: formatted, message: `Delivery available to ${formatted} in 24-48 hours!` };
      } else {
        setIsPincodeValid(false);
        return { valid: false, message: "We currently deliver exclusively across Tamil Nadu. Please check your pincode." };
      }
    }
    return { valid: false, message: "Please enter a valid 6-digit pincode." };
  };

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState({ code: "NATURE10", discountPercent: 10, isApplied: false });

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Toast Notification System
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3200);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('mn_cart_v11', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mn_wish_v11', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('mn_user_v11', JSON.stringify(user));
  }, [user]);

  // Cart operations
  const addToCart = (product, quantity = 1, variant = null) => {
    if (product.isOutOfStock || (product.stock !== undefined && product.stock <= 0)) {
      showToast(`${product.name} is currently out of stock. 🌿`, "error");
      return;
    }
    const qty = Math.max(1, parseInt(quantity) || 1);
    const itemWeight = variant ? variant.weight : product.weight;
    const itemPrice = variant ? variant.price : product.price;
    const itemOldPrice = variant ? variant.oldPrice : product.oldPrice;
    const cartId = variant ? `${product.id}-${variant.weight}` : `${product.id}`;

    setCart(prev => {
      const exists = prev.find(item => item.cartId === cartId);
      const currentQty = exists ? exists.qty : 0;
      if (product.stock !== undefined && (currentQty + qty) > product.stock) {
        showToast(`Only ${product.stock} units available in stock.`, "info");
        const cappedQty = Math.max(currentQty, product.stock);
        if (exists) {
          return prev.map(item => item.cartId === cartId ? { ...item, qty: cappedQty } : item);
        }
        return [...prev, {
          ...product,
          cartId,
          variantWeight: itemWeight,
          price: itemPrice,
          oldPrice: itemOldPrice,
          qty: cappedQty
        }];
      }
      if (exists) {
        return prev.map(item =>
          item.cartId === cartId
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, {
        ...product,
        cartId,
        variantWeight: itemWeight,
        price: itemPrice,
        oldPrice: itemOldPrice,
        qty
      }];
    });

    showToast(`Added ${product.name} (${itemWeight}) to Cart! 🌿`);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
    showToast("Item removed from your cart", "info");
  };

  const updateCartQty = (cartId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        if (item.stock !== undefined && newQty > item.stock) {
          showToast(`Maximum available stock reached (${item.stock})`, "info");
          return { ...item, qty: item.stock };
        }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`, "info");
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`Saved ${product.name} to Wishlist! ❤️`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.some(i => i.id === productId);

  // Apply Coupon
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === "NATURE10") {
      setAppliedCoupon({ code: "NATURE10", discountPercent: 10, isApplied: true });
      showToast("Coupon NATURE10 applied! 10% instant discount saved. 🎉");
      return { success: true, message: "10% discount applied!" };
    } else if (clean === "FIRSTHARVEST") {
      setAppliedCoupon({ code: "FIRSTHARVEST", discountPercent: 15, isApplied: true });
      showToast("Coupon FIRSTHARVEST applied! 15% discount saved. 🎉");
      return { success: true, message: "15% discount applied!" };
    } else {
      showToast("Invalid coupon code. Try NATURE10", "error");
      return { success: false, message: "Invalid coupon. Use NATURE10" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon({ code: "", discountPercent: 0, isApplied: false });
    showToast("Coupon removed", "info");
  };

  // Cart Totals Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (appliedCoupon.isApplied && appliedCoupon.discountPercent > 0) {
      return Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    }
    return 0;
  }, [cartSubtotal, appliedCoupon]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= 999 ? 0 : 50;
  }, [cartSubtotal, cart.length]);

  const freeDeliveryThreshold = 999;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  const cartTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.max(0, cartSubtotal - discountAmount + deliveryFee);
  }, [cartSubtotal, discountAmount, deliveryFee, cart.length]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  return (
    <ShopContext.Provider
      value={{
        products,
        categories: AYURVEDA_CATEGORIES,
        isLoadingProducts,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        setOutOfStock,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartSubtotal,
        discountAmount,
        deliveryFee,
        cartTotal,
        totalCartCount,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        appliedCoupon,
        couponCode,
        setCouponCode,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        setUser,
        deliveryPincode,
        pincodeDistrict,
        isPincodeValid,
        checkPincode,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isPincodeModalOpen,
        setIsPincodeModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toast,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
