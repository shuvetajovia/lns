import pincodes from './data/deliveryPincodes.json';
import { supabase, mapDbProductToApp, mapAppProductToDb, mapDbOrderToApp } from './supabase';

const result = ({ data, error }) => { if (error) throw error; return data; };
export const CloudService = {
  getProducts: async () => (result(await supabase.from('products').select('*').order('id')) || []).map(mapDbProductToApp),
  addProduct: async (product) => mapDbProductToApp(result(await supabase.from('products').insert(mapAppProductToDb(product)).select().single())),
  updateProduct: async (id, product) => mapDbProductToApp(result(await supabase.from('products').update(mapAppProductToDb(product)).eq('id', id).select().single())),
  deleteProduct: async (id) => { result(await supabase.from('products').delete().eq('id', id)); return true; },
  restockProduct: async (id, stock) => {
    stock = Number(stock);
    if (!Number.isInteger(stock) || stock < 0) throw new Error('Enter a valid non-negative stock quantity.');
    return mapDbProductToApp(result(await supabase.from('products').update({ stock, is_out_of_stock: stock === 0 }).eq('id', id).select().single()));
  },
  setOutOfStock: async (id) => CloudService.restockProduct(id, 0),
  getOrders: async () => (result(await supabase.from('orders').select('*').order('date', { ascending: false })) || []).map(mapDbOrderToApp),
  // Only a future verified server payment flow may create orders. No browser insert or offline queue.
  addOrder: async () => { throw new Error('Order submission is unavailable until payments are configured. Your cart is safe.'); },
  updateOrderStatus: async (id, status) => mapDbOrderToApp(result(await supabase.rpc('update_store_order_status', { order_id: id, new_status: status }))),
  requestCancellation: async (id, reason) => result(await supabase.rpc('request_order_cancellation', { order_id: id, reason })),
  getReviews: async () => result(await supabase.from('reviews').select('*').order('id')) || [],
  deleteReview: async (id) => { result(await supabase.from('reviews').delete().eq('id', id)); return true; },
  getAreas: async () => result(await supabase.from('areas').select('*').eq('is_active', true).order('district')) || [],
  addArea: async (district) => {
    const canonical = Object.values(pincodes).find(value => value.toLowerCase() === district.trim().toLowerCase());
    if (!canonical) throw new Error('Enter a Tamil Nadu district present in the delivery pincode list.');
    return result(await supabase.from('areas').upsert({ district: canonical.charAt(0).toUpperCase()+canonical.slice(1).toLowerCase(), is_active:true }, {onConflict:'district'}).select().single());
  },
  deleteArea: async (district) => { result(await supabase.from('areas').update({ is_active: false }).eq('district', district)); return true; },
  getProfile: async (id) => result(await supabase.from('profiles').select('*').eq('id', id).maybeSingle()),
  saveProfile: async (id, profile) => result(await supabase.from('profiles').update({ full_name: profile.name.trim(), phone: profile.phone.trim(), address: profile.address }).eq('id', id).select().single()),
  subscribe: async (email) => result(await supabase.rpc('subscribe_store_newsletter', { subscriber_email: email.trim().toLowerCase() })),
  unsubscribe: async () => result(await supabase.rpc('unsubscribe_store_newsletter')),
  getSubscriptions: async () => result(await supabase.from('newsletter_subscriptions').select('email,subscribed_at').eq('active', true).order('subscribed_at', { ascending: false })) || []
};
