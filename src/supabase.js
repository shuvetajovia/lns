import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://xdppczyeztarvralihtt.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_Axec3lVEux489FaEejCwMA_NXSCtlLH';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Helper: Map Supabase snake_case product row to Frontend camelCase product object
export const mapDbProductToApp = (row) => {
  if (!row) return null;
  const stock = typeof row.stock === 'number' ? row.stock : (parseInt(row.stock, 10) || 0);
  const isOutOfStock = Boolean(row.is_out_of_stock || stock <= 0);

  return {
    id: row.id,
    name: row.name,
    tamilName: row.tamil_name || '',
    sanskritName: row.sanskrit_name || '',
    slug: row.slug || '',
    price: Number(row.price) || 0,
    oldPrice: Number(row.old_price) || 0,
    category: row.category,
    categoryId: row.category_id || '',
    image: row.image,
    gallery: Array.isArray(row.gallery) ? row.gallery : (typeof row.gallery === 'string' ? JSON.parse(row.gallery || '[]') : []),
    rating: Number(row.rating) || 4.8,
    reviewsCount: Number(row.reviews_count) || 0,
    weight: row.weight || '500g',
    isBestSeller: Boolean(row.is_best_seller),
    isNewArrival: Boolean(row.is_new_arrival),
    badge: row.badge || '',
    dosha: row.dosha || '',
    shortDesc: row.short_desc || '',
    description: row.description || '',
    ayurvedicProperties: row.ayurvedic_properties || {},
    ingredients: row.ingredients || '',
    howToUse: row.how_to_use || '',
    sourcingInfo: row.sourcing_info || '',
    variants: Array.isArray(row.variants) ? row.variants : (typeof row.variants === 'string' ? JSON.parse(row.variants || '[]') : []),
    stock: stock,
    isOutOfStock: isOutOfStock,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

// Helper: Map Frontend camelCase product to Supabase snake_case row
export const mapAppProductToDb = (prod) => {
  const stock = typeof prod.stock === 'number' ? prod.stock : (parseInt(prod.stock, 10) || 0);
  const isOutOfStock = Boolean(prod.isOutOfStock || stock <= 0);

  return {
    name: prod.name,
    tamil_name: prod.tamilName || '',
    sanskrit_name: prod.sanskritName || '',
    slug: prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    price: Number(prod.price) || 0,
    old_price: Number(prod.oldPrice) || 0,
    category: prod.category || 'Heritage Rice',
    category_id: prod.categoryId || (prod.category ? prod.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'heritage-rice'),
    image: prod.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    gallery: Array.isArray(prod.gallery) ? prod.gallery : [prod.image],
    rating: Number(prod.rating) || 4.8,
    reviews_count: Number(prod.reviewsCount) || 0,
    weight: prod.weight || '500g',
    is_best_seller: Boolean(prod.isBestSeller),
    is_new_arrival: Boolean(prod.isNewArrival),
    badge: prod.badge || '',
    dosha: prod.dosha || '',
    short_desc: prod.shortDesc || prod.description || '',
    description: prod.description || '',
    ayurvedic_properties: prod.ayurvedicProperties || {},
    ingredients: prod.ingredients || '',
    how_to_use: prod.howToUse || '',
    sourcing_info: prod.sourcingInfo || '',
    variants: Array.isArray(prod.variants) ? prod.variants : [],
    stock: Math.max(0, stock),
    is_out_of_stock: isOutOfStock
  };
};

// Map Orders
export const mapDbOrderToApp = (row) => ({
  id: row.id,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  customerEmail: row.customer_email,
  address: {
    doorNo: row.door_no,
    buildingNo: row.building_no,
    streetName: row.street_name,
    landmark: row.landmark,
    district: row.district,
    pincode: row.pincode
  },
  items: Array.isArray(row.items) ? row.items : (typeof row.items === 'string' ? JSON.parse(row.items || '[]') : []),
  subtotal: Number(row.subtotal) || 0,
  deliveryFee: Number(row.delivery_fee) || 0,
  discount: Number(row.discount) || 0,
  total: Number(row.total) || 0,
  paymentMethod: row.payment_method,
  paymentId: row.payment_id,
  status: row.status || 'Pending',
  date: row.date
});

export const mapAppOrderToDb = (order) => ({
  id: order.id,
  customer_name: order.customerName || order.name || 'Valued Patron',
  customer_phone: order.customerPhone || order.phone || '',
  customer_email: order.customerEmail || order.email || '',
  door_no: order.address?.doorNo || '',
  building_no: order.address?.buildingNo || '',
  street_name: order.address?.streetName || order.address?.street || '',
  landmark: order.address?.landmark || '',
  district: order.address?.district || '',
  pincode: order.address?.pincode || '',
  items: Array.isArray(order.items) ? order.items : [],
  subtotal: Number(order.subtotal) || 0,
  delivery_fee: Number(order.deliveryFee) || 0,
  discount: Number(order.discount) || 0,
  total: Number(order.total) || 0,
  payment_method: order.paymentMethod || 'Online (Razorpay)',
  payment_id: order.paymentId || '',
  status: order.status || 'Pending',
  date: order.date || new Date().toISOString()
});
