// CloudService.js - CSV File System Engine for Electron
// This service reads and writes directly to local CSV files in the 'data' folder.

import Papa from 'papaparse';

// In Electron with nodeIntegration: true, we can use window.require('fs')
const fs = window.require ? window.require('fs') : null;
const path = window.require ? window.require('path') : null;

// Default data path points to the 'public/data' folder of the main shop for instant website reflection.
let DATA_PATH = localStorage.getItem('mn_data_folder_path') || '../../data';

export const CloudService = {
    setDataPath: (newPath) => {
        DATA_PATH = newPath;
        localStorage.setItem('mn_data_folder_path', newPath);
    },

    getDataPath: () => DATA_PATH,

    // Helper: Read CSV and return JSON
    readCsv: (fileName) => {
        return new Promise((resolve, reject) => {
            if (!fs) {
                console.error("FS not available. Are you running in a browser?");
                resolve([]);
                return;
            }
            const filePath = path.join(DATA_PATH, fileName);
            if (!fs.existsSync(filePath)) {
                console.warn(`File not found: ${filePath}`);
                resolve([]);
                return;
            }

            const content = fs.readFileSync(filePath, 'utf8');
            Papa.parse(content, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    resolve(results.data.filter(row => Object.keys(row).length > 1));
                },
                error: (err) => reject(err)
            });
        });
    },

    // Helper: Write JSON to CSV
    writeCsv: (fileName, data) => {
        return new Promise((resolve, reject) => {
            if (!fs) {
                console.error("FS not available.");
                resolve(false);
                return;
            }
            const filePath = path.join(DATA_PATH, fileName);
            const csvContent = Papa.unparse(data);
            try {
                fs.writeFileSync(filePath, csvContent, 'utf8');
                resolve(true);
            } catch (err) {
                console.error("Error writing CSV:", err);
                reject(err);
            }
        });
    },

    // 1. Inventory Management
    getProducts: async () => {
        return await CloudService.readCsv('products.csv');
    },

    saveProducts: async (products) => {
        return await CloudService.writeCsv('products.csv', products);
    },

    // 2. Order Tracking
    getOrders: async () => {
        return await CloudService.readCsv('orders.csv');
    },

    addOrder: async (order) => {
        const existing = await CloudService.getOrders();
        // Flattening order for CSV while preserving items as JSON string
        const flatOrder = {
            ...order,
            doorNo: order.address?.doorNo || "",
            buildingNo: order.address?.buildingNo || "",
            streetName: order.address?.streetName || "",
            landmark: order.address?.landmark || "",
            district: order.address?.district || "",
            pincode: order.address?.pincode || "",
            items: JSON.stringify(order.items || []) // Preserve items as JSON string!
        };
        delete flatOrder.address;

        const updated = [flatOrder, ...existing];
        return await CloudService.writeCsv('orders.csv', updated);
    },

    updateOrderStatus: async (orderId, status) => {
        const existing = await CloudService.getOrders();
        const updated = existing.map(o => o.id === orderId ? { ...o, status } : o);
        return await CloudService.writeCsv('orders.csv', updated);
    },

    // 3. Reviews
    getReviews: async () => {
        return await CloudService.readCsv('reviews.csv');
    },

    saveReviews: async (reviews) => {
        return await CloudService.writeCsv('reviews.csv', reviews);
    },

    // 4. Delivery Areas
    getAreas: async () => {
        return await CloudService.readCsv('areas.csv');
    },

    saveAreas: async (areas) => {
        return await CloudService.writeCsv('areas.csv', areas);
    }
};
