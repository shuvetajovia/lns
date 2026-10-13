// CloudService.js - Dynamic Supabase Engine for Admin Portal
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xdppczyeztarvralihtt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Axec3lVEux489FaEejCwMA_NXSCtlLH';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper mappers
const mapDbProductToApp = (row) => ({
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
  gallery: Array.isArray(row.gallery) ? row.gallery : [],
  rating: Number(row.rating) || 4.8,
  reviewsCount: Number(row.reviews_count) || 0,
  weight: row.weight || '500g',
  isBestSeller: Boolean(row.is_best_seller),
  isNewArrival: Boolean(row.is_new_arrival),
  badge: row.badge || '',
  dosha: row.dosha || '',
  shortDesc: row.short_desc || '',
  description: row.description || '',
  variants: Array.isArray(row.variants) ? row.variants : [],
  stock: typeof row.stock === 'number' ? row.stock : (parseInt(row.stock, 10) || 0),
  isOutOfStock: Boolean(row.is_out_of_stock || (row.stock !== undefined && row.stock <= 0))
});

const mapAppProductToDb = (p) => {
  const stock = typeof p.stock === 'number' ? p.stock : (parseInt(p.stock, 10) || 0);
  const isOut = Boolean(p.isOutOfStock || stock <= 0);
  return {
    name: p.name,
    tamil_name: p.tamilName || '',
    sanskrit_name: p.sanskritName || '',
    slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    price: Number(p.price) || 0,
    old_price: Number(p.oldPrice) || 0,
    category: p.category || 'Heritage Rice',
    category_id: p.categoryId || (p.category ? p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'heritage-rice'),
    image: p.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    gallery: Array.isArray(p.gallery) ? p.gallery : [p.image],
    rating: Number(p.rating) || 4.8,
    reviews_count: Number(p.reviewsCount) || 0,
    weight: p.weight || '500g',
    is_best_seller: Boolean(p.isBestSeller),
    is_new_arrival: Boolean(p.isNewArrival),
    badge: p.badge || '',
    dosha: p.dosha || '',
    short_desc: p.shortDesc || p.description || '',
    description: p.description || '',
    variants: Array.isArray(p.variants) ? p.variants : (typeof p.variants === 'string' ? JSON.parse(p.variants || '[]') : []),
    stock: Math.max(0, stock),
    is_out_of_stock: isOut
  };
};

export const CloudService = {
  // 1. Inventory Management
  getProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn("Products error:", error.message);
        return [];
      }
      return (data || []).map(mapDbProductToApp);
    } catch (err) {
      console.error("Error in getProducts:", err);
      return [];
    }
  },

  addProduct: async (prod) => {
    const dbPayload = mapAppProductToDb(prod);
    const { data, error } = await supabase
      .from('products')
      .insert([dbPayload])
      .select()
      .single();

    if (error) throw error;
    return mapDbProductToApp(data);
  },

  updateProduct: async (id, prod) => {
    const dbPayload = mapAppProductToDb(prod);
    const { data, error } = await supabase
      .from('products')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDbProductToApp(data);
  },

  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  restockProduct: async (id, newStock) => {
    const stockVal = Math.max(0, parseInt(newStock, 10) || 0);
    const { data, error } = await supabase
      .from('products')
      .update({
        stock: stockVal,
        is_out_of_stock: stockVal === 0
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDbProductToApp(data);
  },

  setOutOfStock: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .update({
        stock: 0,
        is_out_of_stock: true
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDbProductToApp(data);
  },

  // 2. Order Tracking
  getOrders: async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });

      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  updateOrderStatus: async (orderId, status) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 3. Reviews
  getReviews: async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('id', { ascending: true });

    if (error) return [];
    return data || [];
  },

  deleteReview: async (reviewId) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
    return true;
  },

  // 4. Delivery Areas
  getAreas: async () => {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .order('district', { ascending: true });

    if (error) return [];
    return data || [];
  },

  addArea: async (district) => {
    const { data, error } = await supabase
      .from('areas')
      .insert([{ district, is_active: true }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteArea: async (district) => {
    const { error } = await supabase
      .from('areas')
      .delete()
      .eq('district', district);

    if (error) throw error;
    return true;
  }
};
