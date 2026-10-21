import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

// https://vite.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        react(),
        {
            name: 'heritage-data-bridge',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    // 1. Serve data files from root 'data' folder instead of 'public/data'
                    if (req.url.startsWith('/data/')) {
                        const fileName = req.url.split('/').pop().split('?')[0];
                        const filePath = path.resolve(__dirname, 'data', fileName);
                        if (fs.existsSync(filePath)) {
                            // Set proper content type for CSVs
                            if (fileName.endsWith('.csv')) res.setHeader('Content-Type', 'text/csv');
                            res.end(fs.readFileSync(filePath));
                            return;
                        }
                    }

                    // 2. Handle Order Submissions to root 'data' folder
                    if (req.url === '/api/add-order' && req.method === 'POST') {
                        let body = '';
                        req.on('data', chunk => { body += chunk.toString(); });
                        req.on('end', () => {
                            try {
                                const order = JSON.parse(body);
                                const filePath = path.resolve(__dirname, 'data/orders.csv');

                                // Read existing from root data
                                const existingContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
                                let existingOrders = [];

                                if (existingContent) {
                                    const parsed = Papa.parse(existingContent, { header: true });
                                    existingOrders = parsed.data.filter(r => Object.keys(r).length > 1);
                                }

                                // Flatten order for CSV while preserving items as JSON string
                                const flatOrder = {
                                    id: order.id,
                                    date: order.date,
                                    customerName: order.customerName,
                                    customerPhone: order.customerPhone,
                                    customerAltPhone: order.customerAltPhone || "",
                                    subtotal: order.subtotal,
                                    productGst: order.productGst,
                                    delivery: order.delivery,
                                    transactionCharge: order.transactionCharge,
                                    transactionGst: order.transactionGst,
                                    total: order.total,
                                    status: order.status,
                                    doorNo: order.address?.doorNo || "",
                                    buildingNo: order.address?.buildingNo || "",
                                    streetName: order.address?.streetName || "",
                                    landmark: order.address?.landmark || "",
                                    district: order.address?.district || "",
                                    pincode: order.address?.pincode || "",
                                    items: JSON.stringify(order.items || []),
                                    paymentId: order.paymentId || ""
                                };

                                const updated = [flatOrder, ...existingOrders];
                                fs.writeFileSync(filePath, Papa.unparse(updated), 'utf8');

                                res.statusCode = 200;
                                res.end(JSON.stringify({ success: true }));
                            } catch (err) {
                                console.error("Order Save Error:", err);
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: err.message }));
                            }
                        });
                        return;
                    }
                    // 3. Handle Order Cancellation
                    if (req.url === '/api/cancel-order' && req.method === 'POST') {
                        let body = '';
                        req.on('data', chunk => { body += chunk.toString(); });
                        req.on('end', () => {
                            try {
                                const { orderId } = JSON.parse(body);
                                const filePath = path.resolve(__dirname, 'data/orders.csv');
                                if (!fs.existsSync(filePath)) {
                                    res.statusCode = 404;
                                    return res.end(JSON.stringify({ error: "No orders found" }));
                                }

                                const content = fs.readFileSync(filePath, 'utf8');
                                const parsed = Papa.parse(content, { header: true });
                                let orders = parsed.data.filter(r => Object.keys(r).length > 1);

                                const orderIndex = orders.findIndex(o => String(o.id) === String(orderId));
                                if (orderIndex === -1) {
                                    res.statusCode = 404;
                                    return res.end(JSON.stringify({ error: "Order not found" }));
                                }

                                // Check if cancelable
                                const order = orders[orderIndex];
                                if (order.status === 'Shipped' || order.status === 'Delivered') {
                                    res.statusCode = 400;
                                    return res.end(JSON.stringify({ error: "Order cannot be cancelled once shipped" }));
                                }

                                orders[orderIndex].status = 'Cancelled';
                                fs.writeFileSync(filePath, Papa.unparse(orders), 'utf8');

                                res.statusCode = 200;
                                res.end(JSON.stringify({ success: true }));
                            } catch (err) {
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: err.message }));
                            }
                        });
                        return;
                    }
                    next();
                });
            }
        }
    ],
})
