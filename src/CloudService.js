// CloudService.js - Dynamic Supabase Engine for Mother Nature
// Provides live cloud sync for products, inventory stock, orders, reviews, and delivery zones.

import { supabase, mapDbProductToApp, mapAppProductToDb, mapDbOrderToApp, mapAppOrderToDb } from './supabase';

export const CloudService = {
  // ==========================================
  // 1. PRODUCTS & INVENTORY
  // ==========================================

  getProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn("Supabase Products notice (using local catalog if table unseeded):", error.message);
        return null;
      }

      if (data && data.length > 0) {
        return data.map(mapDbProductToApp);
      }
      return null;
    } catch (err) {
      console.error("CloudService.getProducts error:", err);
      return null;
    }
  },

  addProduct: async (productData) => {
    try {
      const dbPayload = mapAppProductToDb(productData);
      const { data, error } = await supabase
        .from('products')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      return mapDbProductToApp(data);
    } catch (err) {
      console.error("CloudService.addProduct error:", err);
      throw err;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const dbPayload = mapAppProductToDb(productData);
      const { data, error } = await supabase
        .from('products')
        .update(dbPayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapDbProductToApp(data);
    } catch (err) {
      console.error("CloudService.updateProduct error:", err);
      throw err;
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("CloudService.deleteProduct error:", err);
      throw err;
    }
  },

  // Restock product with new stock number
  restockProduct: async (id, newStock) => {
    try {
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
    } catch (err) {
      console.error("CloudService.restockProduct error:", err);
      throw err;
    }
  },

  // Mark product as Out of Stock
  setOutOfStock: async (id) => {
    try {
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
    } catch (err) {
      console.error("CloudService.setOutOfStock error:", err);
      throw err;
    }
  },

  // ==========================================
  // 2. ORDERS MANAGEMENT
  // ==========================================

  getOrders: async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.warn("Supabase Orders notice:", error.message);
        return [];
      }
      return (data || []).map(mapDbOrderToApp);
    } catch (err) {
      console.error("CloudService.getOrders error:", err);
      return [];
    }
  },

  addOrder: async (order) => {
    try {
      const dbPayload = mapAppOrderToDb(order);
      const { data, error } = await supabase
        .from('orders')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;

      // Inventory is reserved atomically by the order insert database trigger.
      return mapDbOrderToApp(data);
    } catch (err) {
      console.error("CloudService.addOrder error:", err);
      // Fallback to local storage if network is offline
      try {
        const existing = JSON.parse(localStorage.getItem('mn_orders_pending_sync') || '[]');
        localStorage.setItem('mn_orders_pending_sync', JSON.stringify([order, ...existing]));
      } catch (e) {
        // ignore
      }
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return mapDbOrderToApp(data);
    } catch (err) {
      console.error("CloudService.updateOrderStatus error:", err);
      throw err;
    }
  },

  // ==========================================
  // 3. REVIEWS & RATINGS
  // ==========================================

  getReviews: async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn("Supabase Reviews notice:", error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("CloudService.getReviews error:", err);
      return [];
    }
  },

  addReview: async (review) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("CloudService.addReview error:", err);
      throw err;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("CloudService.deleteReview error:", err);
      throw err;
    }
  },

  // ==========================================
  // 4. DELIVERY ZONES & DISTRICTS
  // ==========================================

  getAreas: async () => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('is_active', true)
        .order('district', { ascending: true });

      if (error) {
        console.warn("Supabase Areas notice:", error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("CloudService.getAreas error:", err);
      return [];
    }
  },

  addArea: async (district) => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .insert([{ district, is_active: true }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("CloudService.addArea error:", err);
      throw err;
    }
  },

  deleteArea: async (district) => {
    try {
      const { error } = await supabase
        .from('areas')
        .delete()
        .eq('district', district);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("CloudService.deleteArea error:", err);
      throw err;
    }
  }
};
