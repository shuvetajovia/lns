// CloudService.js - CSV Fetch Engine for E-commerce Shop
// This service fetches live data from the centralized CSV files in the 'data' folder.

import Papa from 'papaparse';

const DATA_BASE_URL = '/data'; // Assumes the 'data' folder is served at the root or in public

export const CloudService = {
    // Helper: Fetch and Parse CSV
    fetchCsv: async (fileName) => {
        try {
            const response = await fetch(`${DATA_BASE_URL}/${fileName}?t=${Date.now()}`); // Cache busting
            if (!response.ok) throw new Error(`Could not fetch ${fileName}`);
            const csvText = await response.text();

            return new Promise((resolve) => {
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        resolve(results.data);
                    }
                });
            });
        } catch (err) {
            console.error("CloudSync Error:", err);
            return null;
        }
    },

    // 1. Heritage Inventory (Products)
    getProducts: async () => {
        return await CloudService.fetchCsv('products.csv');
    },

    // 2. Customer Orders
    getOrders: async () => {
        return await CloudService.fetchCsv('orders.csv');
    },

    addOrder: async (order) => {
        try {
            const response = await fetch('/api/add-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            if (!response.ok) throw new Error("Failed to sync order to cloud");
            const result = await response.json();
            return result.success;
        } catch (err) {
            console.error("Order Sync Failed:", err);
            // Fallback to local storage if API is down
            const existing = JSON.parse(localStorage.getItem('mn_orders_pending_sync') || '[]');
            localStorage.setItem('mn_orders_pending_sync', JSON.stringify([order, ...existing]));
            return false;
        }
    },

    cancelOrder: async (orderId) => {
        try {
            const response = await fetch('/api/cancel-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to cancel order");
            }
            const result = await response.json();
            return result.success;
        } catch (err) {
            console.error("Order Cancel Failed:", err);
            alert(err.message);
            return false;
        }
    },

    // 3. User Feedback & Reviews
    getReviews: async () => {
        return await CloudService.fetchCsv('reviews.csv');
    },

    // 4. Delivery Areas
    getAreas: async () => {
        return await CloudService.fetchCsv('areas.csv');
    }
};
