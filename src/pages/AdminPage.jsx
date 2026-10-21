import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Truck,
  IndianRupee,
  Layers,
  ArrowUpRight,
  X,
  Save,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CloudService } from '../CloudService';
import { useAuth } from '../context/AuthContext';

export const AdminPage = () => {
  const {
    products,
    categories,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    setOutOfStock,
    showToast
  } = useShop();

  const { authUser, signOut } = useAuth();
  const adminName = authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Admin';

  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'zones'
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in_stock', 'out_of_stock', 'low_stock'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [restockModalProduct, setRestockModalProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Delivery Zones State
  const [zones, setZones] = useState([]);
  const [newZoneName, setNewZoneName] = useState('');

  // Load orders & zones
  useEffect(() => {
    const loadExtraData = async () => {
      setIsLoadingOrders(true);
      try {
        const ords = await CloudService.getOrders();
        setOrders(ords || []);
        const zs = await CloudService.getAreas();
        setZones(zs || []);
      } catch (e) {
        console.warn("Could not load orders/zones:", e);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    loadExtraData();
  }, []);

  // Stats calculation
  const totalProducts = products.length;
  const outOfStockCount = products.filter(p => p.isOutOfStock || (p.stock !== undefined && p.stock <= 0)).length;
  const lowStockCount = products.filter(p => !p.isOutOfStock && p.stock > 0 && p.stock <= 10).length;
  const inStockCount = totalProducts - outOfStockCount;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0);

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tamilName && p.tamilName.includes(searchTerm)) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter || p.category === categoryFilter;

    const isOut = Boolean(p.isOutOfStock || (p.stock !== undefined && p.stock <= 0));
    const isLow = !isOut && p.stock > 0 && p.stock <= 10;

    let matchesStock = true;
    if (stockFilter === 'out_of_stock') matchesStock = isOut;
    else if (stockFilter === 'low_stock') matchesStock = isLow;
    else if (stockFilter === 'in_stock') matchesStock = !isOut;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Handle Quick Restock
  const handleConfirmRestock = async () => {
    if (!restockModalProduct) return;
    setIsSubmitting(true);
    try {
      await restockProduct(restockModalProduct.id, restockQty);
      setRestockModalProduct(null);
    } catch (err) {
      // toast shown in context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Mark Out of Stock
  const handleToggleOutOfStock = async (product) => {
    const isOut = Boolean(product.isOutOfStock || (product.stock !== undefined && product.stock <= 0));
    if (isOut) {
      // Prompt for restock quantity
      setRestockModalProduct(product);
      setRestockQty(25);
    } else {
      if (window.confirm(`Mark "${product.name}" as OUT OF STOCK? Customers won't be able to purchase it until restocked.`)) {
        await setOutOfStock(product.id);
      }
    }
  };

  // Handle Delete
  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to permanently delete "${productName}" from Supabase?`)) {
      await deleteProduct(productId);
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await CloudService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (e) {
      showToast(`Failed to update status: ${e.message}`, 'error');
    }
  };

  // Handle Add Zone
  const handleAddZone = async (e) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;
    try {
      const added = await CloudService.addArea(newZoneName.trim());
      setZones(prev => [...prev, added]);
      setNewZoneName('');
      showToast(`Delivery zone "${added.district}" added!`, 'success');
    } catch (e) {
      showToast(`Failed to add zone: ${e.message}`, 'error');
    }
  };

  // Handle Delete Zone
  const handleDeleteZone = async (district) => {
    if (window.confirm(`Remove "${district}" from delivery zones?`)) {
      try {
        await CloudService.deleteArea(district);
        setZones(prev => prev.filter(z => z.district !== district));
        showToast(`Zone "${district}" removed`, 'info');
      } catch (e) {
        showToast(`Failed to remove zone: ${e.message}`, 'error');
      }
    }
  };

  return (
    <div className="mn-admin-portal-wrapper" style={{
      minHeight: '100vh',
      background: '#fcfaf6',
      padding: '2rem 1rem 6rem 1rem'
    }}>
      <div className="mn-container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.2rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '2px solid var(--border-gold)'
        }}>
          <div>
            <div className="mn-admin-status" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: 'var(--color-burgundy)',
                color: 'var(--color-ivory-pure)',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '1px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                textTransform: 'uppercase'
              }}>
                Dynamic Cloud Admin
              </span>
              <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                Supabase Connected
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.2rem',
              color: 'var(--color-burgundy)',
              marginTop: '6px',
              marginBottom: '2px'
            }}>
              Mother Nature Admin
            </h1>
            <p style={{ color: 'var(--color-brown-muted)', fontSize: '0.9rem', margin: 0 }}>
              Live inventory management, restock controls, out-of-stock toggle, and orders tracking.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => refreshProducts()}
              className="mn-btn"
              style={{
                background: '#ffffff',
                border: '1.5px solid var(--border-gold)',
                color: 'var(--color-deep-brown)',
                padding: '0.6rem 1.1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={15} />
              <span>Sync Cloud</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mn-btn mn-btn-burgundy"
              style={{
                padding: '0.6rem 1.4rem',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Card 1: Total Catalog */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-brown-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Catalog
              </span>
              <Package size={18} color="#722f37" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-deep-brown)', marginTop: '4px' }}>
              {totalProducts}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600, marginTop: '2px' }}>
              {inStockCount} Active & In Stock
            </div>
          </div>

          {/* Card 2: Out of Stock Alert */}
          <div style={{
            background: outOfStockCount > 0 ? '#fff5f5' : '#ffffff',
            border: `1.5px solid ${outOfStockCount > 0 ? '#fca5a5' : 'var(--border-gold)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: outOfStockCount > 0 ? '#991b1b' : 'var(--color-brown-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Out of Stock
              </span>
              <XCircle size={18} color={outOfStockCount > 0 ? '#dc2626' : '#991b1b'} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: outOfStockCount > 0 ? '#b91c1c' : 'var(--color-deep-brown)', marginTop: '4px' }}>
              {outOfStockCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: outOfStockCount > 0 ? '#dc2626' : 'var(--color-brown-muted)', fontWeight: 600, marginTop: '2px' }}>
              {outOfStockCount > 0 ? 'Requires restocking' : 'All items available'}
            </div>
          </div>

          {/* Card 3: Low Stock Warning */}
          <div style={{
            background: lowStockCount > 0 ? '#fffbeb' : '#ffffff',
            border: `1.5px solid ${lowStockCount > 0 ? '#fde68a' : 'var(--border-gold)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: lowStockCount > 0 ? '#92400e' : 'var(--color-brown-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Low Stock (&le;10)
              </span>
              <AlertTriangle size={18} color={lowStockCount > 0 ? '#d97706' : '#722f37'} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: lowStockCount > 0 ? '#b45309' : 'var(--color-deep-brown)', marginTop: '4px' }}>
              {lowStockCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: lowStockCount > 0 ? '#d97706' : 'var(--color-brown-muted)', fontWeight: 600, marginTop: '2px' }}>
              Fast-moving items
            </div>
          </div>

          {/* Card 4: Orders & Revenue */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-brown-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Orders Logged
              </span>
              <IndianRupee size={18} color="#722f37" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-deep-brown)', marginTop: '4px' }}>
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-brown-muted)', fontWeight: 600, marginTop: '2px' }}>
              {totalOrdersCount} Customer orders
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mn-admin-tabs" style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '2px solid var(--border-gold)',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.8rem 1.6rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'products' ? '3px solid var(--color-burgundy)' : '3px solid transparent',
              color: activeTab === 'products' ? 'var(--color-burgundy)' : 'var(--color-brown-muted)',
              fontWeight: activeTab === 'products' ? 800 : 600,
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Package size={17} />
            <span>Heritage Inventory ({totalProducts})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.8rem 1.6rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '3px solid var(--color-burgundy)' : '3px solid transparent',
              color: activeTab === 'orders' ? 'var(--color-burgundy)' : 'var(--color-brown-muted)',
              fontWeight: activeTab === 'orders' ? 800 : 600,
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ShoppingBag size={17} />
            <span>Orders ({totalOrdersCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('zones')}
            style={{
              padding: '0.8rem 1.6rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'zones' ? '3px solid var(--color-burgundy)' : '3px solid transparent',
              color: activeTab === 'zones' ? 'var(--color-burgundy)' : 'var(--color-brown-muted)',
              fontWeight: activeTab === 'zones' ? 800 : 600,
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Truck size={17} />
            <span>Delivery Zones ({zones.length})</span>
          </button>
        </div>

        {/* TAB 1: HERITAGE INVENTORY */}
        {activeTab === 'products' && (
          <div>
            {/* Search and Filters Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-gold)',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              {/* Search input */}
              <div style={{
                position: 'relative',
                flex: '1 1 280px',
                minWidth: 'min(100%, 220px)'
              }}>
                <Search size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-brown-muted)'
                }} />
                <input
                  type="text"
                  placeholder="Search by product name, Tamil name, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1rem 0.6rem 2.4rem',
                    border: '1.5px solid var(--border-gold)',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.88rem',
                    background: '#faf7f2',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Stock Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Stock' },
                  { id: 'in_stock', label: `In Stock (${inStockCount})` },
                  { id: 'out_of_stock', label: `Out of Stock (${outOfStockCount})` },
                  { id: 'low_stock', label: `Low Stock (${lowStockCount})` }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setStockFilter(f.id)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.8rem',
                      fontWeight: stockFilter === f.id ? 800 : 600,
                      border: `1.5px solid ${stockFilter === f.id ? 'var(--color-burgundy)' : 'var(--border-gold)'}`,
                      background: stockFilter === f.id ? 'var(--color-burgundy)' : '#ffffff',
                      color: stockFilter === f.id ? '#ffffff' : 'var(--color-deep-brown)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid var(--border-gold)',
                    background: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--color-deep-brown)',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Count Indicator */}
            <div style={{ marginBottom: '1rem', fontSize: '0.84rem', color: 'var(--color-brown-muted)', fontWeight: 600 }}>
              Showing {filteredProducts.length} of {totalProducts} products
            </div>

            {/* Responsive Products Grid / Cards for Mobile & Desktop */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '1.2rem'
            }}>
              {filteredProducts.map(p => {
                const isOut = Boolean(p.isOutOfStock || (p.stock !== undefined && p.stock <= 0));
                const isLow = !isOut && p.stock > 0 && p.stock <= 10;

                return (
                  <div
                    key={p.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isOut ? '#fca5a5' : isLow ? '#fde68a' : 'var(--border-gold)'}`,
                      boxShadow: 'var(--shadow-subtle)',
                      padding: '1.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
                    {/* Header: Image, Title & Badges */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-gold)',
                        background: '#f8f5ee',
                        flexShrink: 0,
                        position: 'relative'
                      }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: isOut ? 'grayscale(60%)' : 'none'
                          }}
                        />
                        {isOut && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(185, 28, 28, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '0.6rem',
                            fontWeight: 900
                          }}>
                            OUT
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-pill)',
                            background: isOut ? '#ffebe9' : isLow ? '#fef3c7' : '#ecfdf5',
                            color: isOut ? '#b91c1c' : isLow ? '#b45309' : '#047857',
                            border: `1px solid ${isOut ? '#fecdd3' : isLow ? '#fde68a' : '#a7f3d0'}`
                          }}>
                            {isOut ? '● OUT OF STOCK' : isLow ? `● LOW: ${p.stock} LEFT` : `● IN STOCK: ${p.stock}`}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-brown-muted)', fontWeight: 600 }}>
                            {p.category}
                          </span>
                        </div>

                        <h3 style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.05rem',
                          color: 'var(--color-deep-brown)',
                          margin: '0 0 2px 0',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {p.name}
                        </h3>

                        {p.tamilName && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-burgundy)', fontWeight: 600 }}>
                            {p.tamilName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price, Weight, & Variants */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.8rem',
                      background: '#fbf9f4',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1rem',
                      border: '1px solid #f0e6d6'
                    }}>
                      <div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-burgundy)' }}>
                          ₹{p.price}
                        </span>
                        {p.oldPrice > p.price && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-brown-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                            ₹{p.oldPrice}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-brown-muted)', fontWeight: 600 }}>
                        Vol: {p.weight} {p.variants && p.variants.length > 0 && `(+${p.variants.length} vars)`}
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      marginTop: 'auto',
                      paddingTop: '0.5rem'
                    }}>
                      {/* Restock Button */}
                      <button
                        onClick={() => {
                          setRestockModalProduct(p);
                          setRestockQty(p.stock > 0 ? p.stock + 20 : 25);
                        }}
                        style={{
                          padding: '0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid #16a34a',
                          background: '#f0fdf4',
                          color: '#15803d',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                        title="Add units to product inventory"
                      >
                        <Plus size={14} />
                        <span>Restock</span>
                      </button>

                      {/* Out of Stock Toggle Button */}
                      <button
                        onClick={() => handleToggleOutOfStock(p)}
                        style={{
                          padding: '0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1.5px solid ${isOut ? '#15803d' : '#dc2626'}`,
                          background: isOut ? '#ecfdf5' : '#fef2f2',
                          color: isOut ? '#15803d' : '#b91c1c',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                        title={isOut ? "Item is out of stock - click to restock" : "Click to mark out of stock"}
                      >
                        {isOut ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        <span>{isOut ? 'Set In Stock' : 'Put Outstock'}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingProduct(p)}
                        style={{
                          padding: '0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--border-gold)',
                          background: '#ffffff',
                          color: 'var(--color-deep-brown)',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        style={{
                          padding: '0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid #fee2e2',
                          background: '#fff5f5',
                          color: '#b91c1c',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-gold)'
              }}>
                <Package size={42} color="var(--color-gold)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)' }}>
                  No Products Found
                </h3>
                <p style={{ color: 'var(--color-brown-muted)', fontSize: '0.9rem' }}>
                  No items match the current search or filters.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setStockFilter('all'); setCategoryFilter('all'); }}
                  className="mn-btn mn-btn-burgundy"
                  style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Clear Filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', margin: 0 }}>
                  Customer Orders
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-brown-muted)' }}>
                  Live orders recorded in Supabase cloud database
                </span>
              </div>
              <button
                onClick={async () => {
                  setIsLoadingOrders(true);
                  const ords = await CloudService.getOrders();
                  setOrders(ords || []);
                  setIsLoadingOrders(false);
                }}
                className="mn-btn"
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--border-gold)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} />
                <span>Refresh Orders</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-gold)'
              }}>
                <ShoppingBag size={42} color="var(--color-gold)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)' }}>
                  No Orders Yet
                </h3>
                <p style={{ color: 'var(--color-brown-muted)', fontSize: '0.9rem' }}>
                  Orders placed by customers through the storefront will appear here live.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                {orders.map(o => (
                  <div
                    key={o.id}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid var(--border-gold)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.2rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-deep-brown)' }}>
                          {o.id}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          background: o.status === 'Delivered' ? '#dcfce7' : o.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                          color: o.status === 'Delivered' ? '#15803d' : o.status === 'Cancelled' ? '#b91c1c' : '#b45309'
                        }}>
                          {o.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--color-deep-brown)', marginTop: '4px', fontWeight: 600 }}>
                        {o.customerName} • {o.customerPhone}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-brown-muted)', marginTop: '2px' }}>
                        {o.address?.district}, {o.address?.pincode} • {new Date(o.date).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-burgundy)' }}>
                          ₹{o.total}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-brown-muted)' }}>
                          {o.items?.length || 0} items
                        </div>
                      </div>

                      {/* Status selector */}
                      <select
                        value={o.status || 'Pending'}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        style={{
                          padding: '0.5rem 0.8rem',
                          borderRadius: 'var(--radius-pill)',
                          border: '1.5px solid var(--border-gold)',
                          background: '#fff',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DELIVERY ZONES */}
        {activeTab === 'zones' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', margin: 0 }}>
                  Heritage Delivery Zones
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-brown-muted)' }}>
                  Districts eligible for Tamil Nadu express dispatch
                </span>
              </div>

              {/* Add Zone Form */}
              <form onSubmit={handleAddZone} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter district name..."
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid var(--border-gold)',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="submit"
                  className="mn-btn mn-btn-burgundy"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  <Plus size={15} /> Add
                </button>
              </form>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem'
            }}>
              {zones.map((z, idx) => (
                <div
                  key={z.id || idx}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--color-deep-brown)' }}>{z.district}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                      Active Zone
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteZone(z.district)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b91c1c',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Remove delivery zone"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* QUICK RESTOCK MODAL */}
      {restockModalProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--border-gold)',
            padding: '2rem',
            maxWidth: '440px',
            width: '100%',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', margin: 0 }}>
                Restock Product
              </h3>
              <button
                onClick={() => setRestockModalProduct(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--color-deep-brown)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Restocking <strong>{restockModalProduct.name}</strong>. Enter new available stock units.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-deep-brown)', marginBottom: '6px' }}>
                Available Stock Units
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    flex: 1,
                    padding: '0.7rem 1rem',
                    border: '1.5px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}
                />
              </div>

              {/* Preset buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {[10, 25, 50, 100].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRestockQty(val)}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-gold)',
                      background: restockQty === val ? 'var(--color-burgundy)' : '#fbf9f4',
                      color: restockQty === val ? '#fff' : 'var(--color-deep-brown)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setRestockModalProduct(null)}
                className="mn-btn"
                style={{
                  flex: 1,
                  background: '#f3f0e8',
                  border: '1px solid #d4c8bd',
                  color: 'var(--color-deep-brown)',
                  fontSize: '0.88rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestock}
                disabled={isSubmitting}
                className="mn-btn mn-btn-burgundy"
                style={{
                  flex: 1,
                  fontSize: '0.88rem'
                }}
              >
                {isSubmitting ? 'Saving...' : 'Confirm Restock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddModalOpen || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={async (formData) => {
            if (editingProduct) {
              await updateProduct(editingProduct.id, formData);
            } else {
              await addProduct(formData);
            }
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

    </div>
  );
};

// Sub-component: Add / Edit Product Modal
const ProductFormModal = ({ product, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    tamilName: '',
    sanskritName: '',
    price: 199,
    oldPrice: 249,
    category: 'Heritage Rice',
    categoryId: 'heritage-rice',
    weight: '500g',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    shortDesc: '',
    description: '',
    isBestSeller: false,
    isNewArrival: false,
    badge: 'HERITAGE HARVEST',
    dosha: 'Tridoshic',
    variants: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Product name is required");
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (e) {
      // toast shown in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="mn-admin-product-modal" style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-gold)',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.2rem 1.6rem',
          borderBottom: '1.5px solid var(--border-gold)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fcfaf6'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', margin: 0, fontSize: '1.3rem' }}>
            {product ? 'Edit Heritage Product' : 'Add New Heritage Product'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form className="mn-admin-product-form" onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '1.6rem', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
            
            {/* English Name */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Product Name (English)*
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
                placeholder="e.g. Karuppu Kavuni Royal Black Rice"
              />
            </div>

            {/* Tamil Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Tamil Name (தமிழ்)
              </label>
              <input
                type="text"
                value={formData.tamilName}
                onChange={(e) => setFormData({ ...formData, tamilName: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
                placeholder="e.g. கருப்பு கவுனி அரிசி"
              />
            </div>

            {/* Sanskrit / Classical Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Sanskrit / Classical Name
              </label>
              <input
                type="text"
                value={formData.sanskritName}
                onChange={(e) => setFormData({ ...formData, sanskritName: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
                placeholder="e.g.  "
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Category*
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const sel = categories.find(c => c.name === e.target.value);
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    categoryId: sel ? sel.id : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  });
                }}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', background: '#fff' }}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Default Weight / Volume */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Volume / Weight*
              </label>
              <input
                type="text"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
                placeholder="e.g. 500g, 1kg, 500ml"
              />
            </div>

            {/* Price (Offer Price) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Selling Price (₹)*
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            {/* MRP / Old Price */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Original MRP (₹)*
              </label>
              <input
                type="number"
                min="0"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: Number(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            {/* Initial Stock */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Initial Stock Units*
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            {/* Badge */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Heritage Badge
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
                placeholder="e.g. ROYAL HARVEST"
              />
            </div>

            {/* Image URL */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Image URL*
              </label>
              <input
                type="text"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                Ayurvedic Benefits & Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}
                placeholder="Classical heritage description..."
              />
            </div>

            {/* Checkboxes: Best Seller & New Arrival */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                />
                Mark as Best Seller
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isNewArrival}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                />
                Mark as New Arrival
              </label>
            </div>

          </div>

          {/* Modal Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <button
              type="button"
              onClick={onClose}
              className="mn-btn"
              style={{ background: '#f5f5f5', border: '1px solid #ccc', color: '#555' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mn-btn mn-btn-burgundy"
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Syncing...' : 'Save to Supabase'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};