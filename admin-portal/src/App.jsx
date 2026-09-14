import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Package,
    Users,
    ShoppingBag,
    CheckCircle2,
    Clock,
    Truck,
    Search,
    ArrowLeft,
    X,
    MoreVertical,
    Calendar,
    IndianRupee,
    Menu,
    Plus,
    Save,
    Edit2,
    Trash2,
    ChevronRight,
    LayoutDashboard,
    MapPin,
    CreditCard,
    MessageSquare,
    Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudService } from './CloudService';

const ORDER_STATUS_COLORS = {
    'Pending': { bg: '#fff7e6', text: '#d46b08', border: '#ffd591' },
    'Processing': { bg: '#e6f7ff', text: '#096dd9', border: '#91d5ff' },
    'Shipped': { bg: '#f9f0ff', text: '#722ed1', border: '#d3adf7' },
    'Delivered': { bg: '#f6ffed', text: '#389e0d', border: '#b7eb8f' },
    'Cancelled': { bg: '#fff1f0', text: '#cf1322', border: '#ffa39e' }
};

const App = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [areas, setAreas] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchFilter, setSearchFilter] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [tempPath, setTempPath] = useState(CloudService.getDataPath());

    useEffect(() => {
        const loadInitialData = async () => {
            const p = await CloudService.getProducts();
            const o = await CloudService.getOrders();
            const a = await CloudService.getAreas();
            const r = await CloudService.getReviews();
            setProducts(p || []);
            setOrders(o || []);
            setAreas(a || []);
            setReviews(r || []);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    const handleSaveProduct = async (updatedProduct) => {
        let newProducts;
        if (updatedProduct.id) {
            newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        } else {
            const newProduct = { ...updatedProduct, id: Date.now(), rating: null };
            newProducts = [...products, newProduct];
        }
        setProducts(newProducts);
        await CloudService.saveProducts(newProducts);
        setEditingProduct(null);
        setIsAddProductModalOpen(false);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Remove this product from your heritage catalog?")) {
            const newProducts = products.filter(p => p.id !== productId);
            setProducts(newProducts);
            await CloudService.saveProducts(newProducts);
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        await CloudService.updateOrderStatus(orderId, status);
        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
        setOrders(updatedOrders);
    };

    const handleSaveArea = async (newAreaName) => {
        const updated = [...areas, { district: newAreaName }];
        setAreas(updated);
        await CloudService.saveAreas(updated);
    };

    const handleDeleteArea = async (areaName) => {
        if (window.confirm(`Stop delivery to ${areaName}?`)) {
            const updated = areas.filter(a => a.district !== areaName);
            setAreas(updated);
            await CloudService.saveAreas(updated);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Delete this customer feedback?")) {
            const updated = reviews.filter(r => r.id !== reviewId);
            setReviews(updated);
            await CloudService.saveReviews(updated);
        }
    };

    const handleBrowse = () => {
        const newPath = prompt("Enter full path to 'data' folder:", tempPath);
        if (newPath) {
            setTempPath(newPath);
        }
    };

    const handleConnect = () => {
        if (!tempPath) return alert("Please enter a path first.");
        CloudService.setDataPath(tempPath);
        // Force a clean reload
        window.location.href = window.location.origin + window.location.pathname;
    };

    if (isLoading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Heritage Dashboard...</div>;

    const stats = {
        totalRevenue: orders.filter(o => o.status !== 'Cancelled').reduce((acc, curr) => acc + curr.total, 0),
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length,
        deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
        totalCustomers: new Set(orders.map(o => o.customerPhone)).size
    };

    const renderDashboard = () => (
        <div className="admin-view">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e6f7ff', color: '#1890ff' }}><IndianRupee size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Revenue</span>
                        <h2 className="stat-value">₹{stats.totalRevenue.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f6ffed', color: '#52c41a' }}><ShoppingBag size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Orders</span>
                        <h2 className="stat-value">{stats.totalOrders}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fff7e6', color: '#fa8c16' }}><Clock size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Pending</span>
                        <h2 className="stat-value">{stats.pendingOrders}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f9f0ff', color: '#722ed1' }}><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Customers</span>
                        <h2 className="stat-value">{stats.totalCustomers}</h2>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="admin-table-container" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3>Recent Activity</h3>
                        <button onClick={() => setActiveTab('orders')} style={{ color: 'var(--brand-green)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>See All</button>
                    </div>
                    {orders.slice(0, 5).map(o => (
                        <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div><strong>{o.customerName}</strong><p style={{ fontSize: '0.75rem', color: '#888' }}>{o.id}</p></div>
                            <div style={{ textAlign: 'right' }}><strong>₹{o.total}</strong><p style={{ fontSize: '0.75rem', color: ORDER_STATUS_COLORS[o.status || 'Pending'].text }}>{o.status || 'Pending'}</p></div>
                        </div>
                    ))}
                    {orders.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>No orders in cloud database yet.</p>}
                </div>

                <div className="admin-table-container" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3>Live Inventory</h3>
                        <button onClick={() => setActiveTab('products')} style={{ color: 'var(--brand-green)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>Manage</button>
                    </div>
                    {products.slice(0, 5).map(p => (
                        <div key={p.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #f0f0f0' }}>
                            <img src={p.image} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}><strong>{p.name}</strong><p style={{ fontSize: '0.75rem', color: '#888' }}>{p.category}</p></div>
                            <strong>₹{p.price}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="admin-view">
            <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Customer Orders</h3>
                <div className="admin-search" style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                    <input type="text" placeholder="Search orders..." style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', border: '1px solid #eee', borderRadius: '50px', width: '300px' }} value={searchFilter} onChange={e => setSearchFilter(e.target.value)} />
                </div>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr><th>ID</th><th>Date</th><th>Customer</th><th>Status</th><th>Total</th><th>Manage</th></tr>
                    </thead>
                    <tbody>
                        {orders.filter(o => o.customerName?.toLowerCase().includes(searchFilter.toLowerCase())).map(o => (
                            <tr key={o.id}>
                                <td>{String(o.id).slice(-6)}</td>
                                <td>{new Date(o.date).toLocaleDateString()}</td>
                                <td><strong>{o.customerName}</strong><p style={{ fontSize: '0.75rem' }}>{o.customerPhone}</p></td>
                                <td><span className="status-pill" style={{ background: ORDER_STATUS_COLORS[o.status || 'Pending'].bg, color: ORDER_STATUS_COLORS[o.status || 'Pending'].text }}>{o.status || 'Pending'}</span></td>
                                <td>₹{o.total}</td>
                                <td><button onClick={() => setSelectedOrder(o)} className="icon-action-btn"><ChevronRight size={18} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderProducts = () => (
        <div className="admin-view">
            <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Heritage Inventory</h3>
                <button className="add-prod-btn" onClick={() => setIsAddProductModalOpen(true)}><Plus size={18} /> Launch New Product</button>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr><th>Product</th><th>Category</th><th>Weight</th><th>Stock</th><th>Price</th><th>Offer</th><th>Flags</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td><div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><img src={p.image} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /><strong>{p.name}</strong></div></td>
                                <td>{p.category}</td>
                                <td>{p.weight || 'N/A'}</td>
                                <td>
                                    <span style={{
                                        color: (p.stock < 10 ? '#cf1322' : '#333'),
                                        fontWeight: (p.stock < 10 ? 800 : 400)
                                    }}>
                                        {p.stock || 0}
                                    </span>
                                </td>
                                <td>₹{p.oldPrice || p.price}</td>
                                <td style={{ color: 'var(--brand-green)', fontWeight: 800 }}>₹{p.price}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        {p.isBestSeller && <span className="flag-dot best" style={{ background: '#fff1f0', color: '#cf1322', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>BEST</span>}
                                        {p.isNewArrival && <span className="flag-dot new" style={{ background: '#e6f7ff', color: '#096dd9', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>NEW</span>}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="icon-action-btn edit" onClick={() => setEditingProduct(p)}><Edit2 size={16} /></button>
                                        <button className="icon-action-btn delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAreas = () => (
        <div className="admin-view">
            <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Heritage Delivery Zones</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        id="new-area-input"
                        type="text"
                        placeholder="Add District Name..."
                        style={{ padding: '0.8rem 1rem', border: '1px solid #eee', borderRadius: '8px', width: '250px' }}
                    />
                    <button
                        className="add-prod-btn"
                        onClick={() => {
                            const val = document.getElementById('new-area-input').value;
                            if (val) {
                                handleSaveArea(val);
                                document.getElementById('new-area-input').value = '';
                            }
                        }}
                    >
                        <Plus size={18} /> Add Zone
                    </button>
                </div>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr><th>District Name</th><th>Current Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {areas.map((a, idx) => (
                            <tr key={idx}>
                                <td><strong>{a.district}</strong></td>
                                <td><span className="status-pill" style={{ background: '#f6ffed', color: '#389e0d' }}>ACTIVE DELIVERY</span></td>
                                <td>
                                    <button className="icon-action-btn delete" onClick={() => handleDeleteArea(a.district)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderReviews = () => (
        <div className="admin-view">
            <div className="admin-header-row" style={{ marginBottom: '2rem' }}>
                <h3>Customer Testimonials</h3>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Moderating feedback from your heritage community.</p>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr><th>Customer</th><th>Product</th><th>Rating</th><th>Feedback</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {reviews.map(r => (
                            <tr key={r.id}>
                                <td><strong>{r.user}</strong><p style={{ fontSize: '0.75rem', color: '#888' }}>{r.date}</p></td>
                                <td>{r.product}</td>
                                <td>
                                    <div style={{ display: 'flex', color: '#f4c430' }}>
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? '#f4c430' : 'none'} />)}
                                    </div>
                                </td>
                                <td style={{ maxWidth: '300px', fontSize: '0.85rem', color: '#555' }}>"{r.comment}"</td>
                                <td>
                                    <button className="icon-action-btn delete" onClick={() => handleDeleteReview(r.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reviews.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No reviews found in your heritage database.</div>}
            </div>
        </div>
    );

    return (
        <div className="admin-layout">
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="admin-overlay"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="admin-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: 'var(--brand-green)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>MN OWNER</h2>
                        <p style={{ fontSize: '0.6rem', color: '#888', fontWeight: 800, textTransform: 'uppercase' }}>Management</p>
                    </div>
                    <button className="lg-hidden" onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#999' }}>
                        <X size={20} />
                    </button>
                </div>
                <nav className="admin-nav">
                    <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={20} /> Overview</button>
                    <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}><ShoppingBag size={20} /> Orders</button>
                    <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}><Package size={20} /> Inventory</button>
                    <button className={`admin-nav-item ${activeTab === 'areas' ? 'active' : ''}`} onClick={() => setActiveTab('areas')}><MapPin size={20} /> Delivery Zones</button>
                    <button className={`admin-nav-item ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}><CreditCard size={20} /> Financials</button>
                    <button className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}><MessageSquare size={20} /> Feedback</button>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="lg-hidden-flex" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--brand-green)' }}><Menu size={24} /></button>
                        <div className="atb-left">
                            <h2 className="atb-title">Heritage Dashboard</h2>
                        </div>
                    </div>
                    <div className="atb-right-path">
                        <div className="path-connection-row">
                            <input
                                type="text"
                                className="path-input"
                                value={tempPath}
                                onChange={(e) => setTempPath(e.target.value)}
                                placeholder="Database Path..."
                            />
                            <button onClick={handleConnect} className="btn-connect">CONNECT</button>
                        </div>
                    </div>
                </header>
                <div className="admin-scroll-content">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'orders' && renderOrders()}
                    {activeTab === 'products' && renderProducts()}
                    {activeTab === 'areas' && renderAreas()}
                    {activeTab === 'reviews' && renderReviews()}
                </div>
            </main>

            <AnimatePresence>
                {(editingProduct || isAddProductModalOpen) && (
                    <ProductFormModal
                        product={editingProduct}
                        categories={[...new Set(products.map(p => p.category))]}
                        onClose={() => { setEditingProduct(null); setIsAddProductModalOpen(false); }}
                        onSave={handleSaveProduct}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedOrder && (
                    <OrderDetailDrawer
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                        onUpdateStatus={handleUpdateStatus}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const ProductFormModal = ({ product, categories, onClose, onSave }) => {
    const [formData, setFormData] = useState(product || {
        name: "",
        tamilName: "",
        price: 0,
        oldPrice: 0,
        category: "Heritage Rice",
        description: "",
        weight: "500g",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
        isBestSeller: false,
        isNewArrival: false,
        isCombo: false,
        stock: 100,
        variants: "" // JSON string of [{weight, price, oldPrice}]
    });

    const [isNewCategory, setIsNewCategory] = useState(false);
    const [variantsList, setVariantsList] = useState(() => {
        try {
            return formData.variants ? JSON.parse(formData.variants) : [];
        } catch (e) {
            return [];
        }
    });

    const handleAddVariant = () => {
        setVariantsList([...variantsList, { weight: "", price: 0, oldPrice: 0 }]);
    };

    const handleRemoveVariant = (index) => {
        setVariantsList(variantsList.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const newList = [...variantsList];
        newList[index] = { ...newList[index], [field]: value };
        setVariantsList(newList);
    };

    const handleFinalSave = () => {
        const updated = {
            ...formData,
            variants: variantsList.length > 0 ? JSON.stringify(variantsList) : ""
        };
        onSave(updated);
    };

    return (
        <div className="modal-mask" onClick={onClose}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content product-form-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{product ? "Update Heritage Item" : "New Ancient Nutri Launch"}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                </div>
                <div className="modal-body-form custom-scroll" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #eee', background: '#f5f5f5' }}>
                            <img src={formData.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                        </div>
                        <div style={{ flex: 1 }} className="form-group">
                            <label>Heritage Photo URL</label>
                            <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group"><label>English Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                        <div className="form-group"><label>Tamil Name</label><input type="text" value={formData.tamilName} onChange={e => setFormData({ ...formData, tamilName: e.target.value })} /></div>

                        <div className="form-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                Category
                                <span onClick={() => setIsNewCategory(!isNewCategory)} style={{ color: 'var(--brand-green)', cursor: 'pointer', fontSize: '0.65rem' }}>
                                    {isNewCategory ? "SELECT EXISTING" : "ADD NEW"}
                                </span>
                            </label>
                            {isNewCategory ? (
                                <input type="text" placeholder="Enter New Category" onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            ) : (
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            )}
                        </div>
                        <div className="form-group"><label>Default Weight</label><input type="text" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g. 500g, 1kg" /></div>

                        <div className="form-group"><label>Default Price (₹)</label><input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} /></div>
                        <div className="form-group"><label>Default Old Price (₹)</label><input type="number" value={formData.oldPrice} onChange={e => setFormData({ ...formData, oldPrice: parseInt(e.target.value) || 0 })} /></div>

                        <div className="form-group"><label>Available Stock (Units)</label><input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} /></div>
                        <div className="form-group"><label>Launch Type</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}><input type="checkbox" checked={formData.isCombo} onChange={e => setFormData({ ...formData, isCombo: e.target.checked })} /> Combo</label>
                            </div>
                        </div>
                    </div>

                    {/* Variant Section */}
                    <div className="variant-section" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0 }}>Add Multiple Quantities (Optional)</h4>
                            <button className="btn-save" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={handleAddVariant}><Plus size={14} /> Add New Quantity</button>
                        </div>
                        {variantsList.map((v, i) => (
                            <div key={i} className="variant-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 40px', gap: '1rem', marginBottom: '0.8rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.7rem' }}>Quantity (e.g. 1kg)</label><input type="text" value={v.weight} onChange={e => handleVariantChange(i, 'weight', e.target.value)} /></div>
                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.7rem' }}>Price (₹)</label><input type="number" value={v.price} onChange={e => handleVariantChange(i, 'price', parseInt(e.target.value) || 0)} /></div>
                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.7rem' }}>Old Price (₹)</label><input type="number" value={v.oldPrice} onChange={e => handleVariantChange(i, 'oldPrice', parseInt(e.target.value) || 0)} /></div>
                                <button className="icon-action-btn delete" style={{ alignSelf: 'center', marginTop: '1.2rem' }} onClick={() => handleRemoveVariant(i)}><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label>Ancestral Benefits & Description</label>
                        <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the health benefits..."></textarea>
                    </div>

                    <div className="flag-selector-row">
                        <label className="flag-check"><input type="checkbox" checked={formData.isBestSeller} onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })} /> Mark as BEST SELLER</label>
                        <label className="flag-check"><input type="checkbox" checked={formData.isNewArrival} onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })} /> Mark as NEW ARRIVAL</label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Discard</button>
                    <button className="btn-save" onClick={handleFinalSave}><Save size={18} /> Sync to Cloud</button>
                </div>
            </motion.div>
        </div>
    );
};


const OrderDetailDrawer = ({ order, onClose, onUpdateStatus }) => {
    // Parse items if they are stored as a JSON string in CSV
    let items = [];
    try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
    } catch (e) {
        console.error("Failed to parse items:", e);
    }

    return (
        <div className="modal-mask" onClick={onClose}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="order-detail-drawer" onClick={e => e.stopPropagation()}>
                <div className="odd-header">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 800 }}>ODR#{String(order.id).slice(-8)}</span>
                        <h3>Heritage Shipment</h3>
                    </div>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="odd-body">
                    <div className="odd-section">
                        <label>Shipment Status</label>
                        <div className="status-selector">
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                <button key={s} className={`status-btn ${order.status === s ? 'active' : ''}`} onClick={() => onUpdateStatus(order.id, s)} style={order.status === s ? { background: ORDER_STATUS_COLORS[s].bg, color: ORDER_STATUS_COLORS[s].text } : {}}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <div className="odd-section">
                        <label>Purchased Items</label>
                        <div className="order-items-list" style={{ display: 'grid', gap: '0.8rem', marginTop: '0.5rem' }}>
                            {items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f9f9f9', padding: '0.8rem', borderRadius: '8px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#eee', overflow: 'hidden' }}>
                                        <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>₹{item.price} × {item.qty}</div>
                                    </div>
                                    <div style={{ fontWeight: 800, color: 'var(--brand-green)' }}>₹{item.price * item.qty}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="odd-section">
                        <label>Delivery To</label>
                        <div className="address-box">
                            <strong style={{ fontSize: '1.1rem' }}>{order.customerName}</strong>
                            <p style={{ marginTop: '0.4rem' }}>{order.doorNo ? `Door ${order.doorNo}, ` : ''}{order.buildingNo ? `${order.buildingNo}, ` : ''}{order.streetName}</p>
                            <p>{order.landmark ? `(Near ${order.landmark})` : ''}</p>
                            <p>{order.district} - <strong>{order.pincode}</strong></p>
                            <div className="phone-high" style={{ marginTop: '0.8rem', background: '#e6f7ff', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                                PH: {order.customerPhone} {order.customerAltPhone ? `| Alt: ${order.customerAltPhone}` : ''}
                            </div>
                        </div>
                    </div>

                    <div className="odd-section" style={{ marginTop: 'auto', borderTop: '2px dashed #eee', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Product Subtotal</span><span>₹{order.subtotal}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Overall GST (18%)</span><span>₹{order.productGst}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><span>Delivery</span><span>{order.delivery === 0 ? 'FREE' : `₹${order.delivery}`}</span></div>

                        <div style={{ padding: '0.8rem', background: '#f5f5f5', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#666' }}>
                                <span>Transaction Charge (2%)</span>
                                <span>₹{order.transactionCharge}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                                <span>Transaction GST (18%)</span>
                                <span>₹{order.transactionGst}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-green)' }}>
                            <span>Final Total</span>
                            <span>₹{order.total}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default App;
