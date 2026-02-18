const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite database
const dbPath = path.join(__dirname, 'chatbot.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database at:', dbPath);
    }
});

// Create tables
db.serialize(() => {
    // Chat Sessions Table
    db.run(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT UNIQUE NOT NULL,
      user_ip TEXT,
      user_agent TEXT,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      total_messages INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) console.error('Error creating chat_sessions table:', err);
        else console.log('✅ Table: chat_sessions created/verified');
    });

    // Chat Messages Table
    db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      message_id TEXT UNIQUE NOT NULL,
      sender TEXT NOT NULL,
      message_text TEXT NOT NULL,
      message_type TEXT,
      intent_detected TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
    )
  `, (err) => {
        if (err) console.error('Error creating chat_messages table:', err);
        else console.log('✅ Table: chat_messages created/verified');
    });

    // Product Inquiries Table
    db.run(`
    CREATE TABLE IF NOT EXISTS product_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_id TEXT,
      product_company TEXT,
      inquiry_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
    )
  `, (err) => {
        if (err) console.error('Error creating product_inquiries table:', err);
        else console.log('✅ Table: product_inquiries created/verified');
    });

    // User Conditions Table
    db.run(`
    CREATE TABLE IF NOT EXISTS user_conditions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      condition_type TEXT NOT NULL,
      products_recommended TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
    )
  `, (err) => {
        if (err) console.error('Error creating user_conditions table:', err);
        else console.log('✅ Table: user_conditions created/verified');
    });

    // Orders Table
    db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT UNIQUE NOT NULL,
      session_id TEXT NOT NULL,
      customer_name TEXT,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      delivery_address TEXT NOT NULL,
      delivery_city TEXT,
      delivery_area TEXT,
      order_items TEXT NOT NULL,
      total_items INTEGER NOT NULL,
      total_amount DECIMAL(10,2) DEFAULT 0,
      order_notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      confirmed_at DATETIME,
      completed_at DATETIME,
      FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
    )
  `, (err) => {
        if (err) console.error('Error creating orders table:', err);
        else console.log('✅ Table: orders created/verified');
    });

    // Order Items Table (detailed breakdown)
    db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_id TEXT,
      product_company TEXT,
      pack_size TEXT,
      quantity INTEGER NOT NULL,
      unit_price DECIMAL(10,2) DEFAULT 0,
      subtotal DECIMAL(10,2) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
    )
  `, (err) => {
        if (err) console.error('Error creating order_items table:', err);
        else console.log('✅ Table: order_items created/verified');
    });

    // Analytics Table
    db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL UNIQUE,
      total_sessions INTEGER DEFAULT 0,
      total_messages INTEGER DEFAULT 0,
      total_product_searches INTEGER DEFAULT 0,
      total_condition_queries INTEGER DEFAULT 0,
      total_emergencies INTEGER DEFAULT 0,
      total_complaints INTEGER DEFAULT 0,
      total_orders INTEGER DEFAULT 0,
      total_order_items INTEGER DEFAULT 0,
      most_searched_product TEXT,
      most_common_condition TEXT
    )
  `, (err) => {
        if (err) console.error('Error creating analytics table:', err);
        else console.log('✅ Table: analytics created/verified');
    });

    // Product Inventory Table (for stock tracking)
    db.run(`
    CREATE TABLE IF NOT EXISTS product_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT UNIQUE NOT NULL,
      product_name TEXT NOT NULL,
      product_company TEXT,
      pack_size TEXT,
      quantity_in_stock INTEGER DEFAULT 100,
      reorder_level INTEGER DEFAULT 10,
      status TEXT DEFAULT 'in_stock',
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    )
  `, (err) => {
        if (err) console.error('Error creating product_inventory table:', err);
        else {
            console.log('✅ Table: product_inventory created/verified');

            // Initialize inventory for common products
            db.run(`
                INSERT OR IGNORE INTO product_inventory 
                (product_id, product_name, quantity_in_stock, status)
                VALUES 
                ('DEFAULT', 'ALL_PRODUCTS', 100, 'in_stock')
            `);
        }
    });

    // User Carts Table (for session persistence)
    db.run(`
    CREATE TABLE IF NOT EXISTS user_carts (
      session_id TEXT PRIMARY KEY,
      cart_data TEXT NOT NULL,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) console.error('Error creating user_carts table:', err);
        else console.log('✅ Table: user_carts created/verified');
    });

    // Create indexes for better performance
    db.run('CREATE INDEX IF NOT EXISTS idx_session_id ON chat_messages(session_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_created_at ON chat_messages(created_at)');
    db.run('CREATE INDEX IF NOT EXISTS idx_intent ON chat_messages(intent_detected)');
    db.run('CREATE INDEX IF NOT EXISTS idx_product_name ON product_inquiries(product_name)');
    db.run('CREATE INDEX IF NOT EXISTS idx_condition ON user_conditions(condition_type)');
    db.run('CREATE INDEX IF NOT EXISTS idx_order_id ON orders(order_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_order_session ON orders(session_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_order_status ON orders(status)');
    db.run('CREATE INDEX IF NOT EXISTS idx_product_id ON product_inventory(product_id)');

    console.log('✅ All indexes created/verified');
});

// Ensure analytics table has expected columns (migration helper)
; (async () => {
    try {
        const expected = {
            total_orders: 'INTEGER DEFAULT 0',
            total_order_items: 'INTEGER DEFAULT 0'
        };

        db.all("PRAGMA table_info('analytics')", [], (err, rows) => {
            if (err || !rows) return;
            const existing = new Set(rows.map(r => r.name));
            for (const col of Object.keys(expected)) {
                if (!existing.has(col)) {
                    const sql = `ALTER TABLE analytics ADD COLUMN ${col} ${expected[col]}`;
                    db.run(sql, (e) => {
                        if (e) console.warn('Could not add analytics column', col, e.message || e);
                        else console.log('✅ Added analytics column:', col);
                    });
                }
            }
        });
    } catch (e) {
        console.warn('Analytics migration failed:', e.message || e);
    }
})();

// Helper functions
const dbHelpers = {
    // Create new session
    createSession: (sessionId, userIp, userAgent) => {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO chat_sessions (session_id, user_ip, user_agent) VALUES (?, ?, ?)',
                [sessionId, userIp, userAgent],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },

    // Save message
    saveMessage: (sessionId, messageId, sender, messageText, messageType, intent) => {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO chat_messages 
         (session_id, message_id, sender, message_text, message_type, intent_detected) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [sessionId, messageId, sender, messageText, messageType, intent],
                function (err) {
                    if (err) reject(err);
                    else {
                        // Update session message count
                        db.run(
                            'UPDATE chat_sessions SET total_messages = total_messages + 1, last_activity = CURRENT_TIMESTAMP WHERE session_id = ?',
                            [sessionId]
                        );
                        resolve(this.lastID);
                    }
                }
            );
        });
    },

    // Save product inquiry
    saveProductInquiry: (sessionId, messageId, productName, productId, productCompany, inquiryType) => {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO product_inquiries 
         (session_id, message_id, product_name, product_id, product_company, inquiry_type) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [sessionId, messageId, productName, productId, productCompany, inquiryType],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },

    // Save user condition
    saveUserCondition: (sessionId, conditionType, productsRecommended) => {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO user_conditions (session_id, condition_type, products_recommended) VALUES (?, ?, ?)',
                [sessionId, conditionType, JSON.stringify(productsRecommended)],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },

    // Update analytics
    updateAnalytics: (type, data) => {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0];

            // Insert or update today's analytics
            db.run(
                `INSERT INTO analytics (date, ${type}) VALUES (?, 1)
         ON CONFLICT(date) DO UPDATE SET ${type} = ${type} + 1`,
                [today],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    },

    // Get chat history
    getChatHistory: (sessionId) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC',
                [sessionId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    // End session
    endSession: (sessionId) => {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE chat_sessions SET ended_at = CURRENT_TIMESTAMP, status = ? WHERE session_id = ?',
                ['ended', sessionId],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    },

    // Get analytics
    getAnalytics: (days = 30) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM analytics ORDER BY date DESC LIMIT ?',
                [days],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    // Get most searched products
    getMostSearchedProducts: (limit = 10) => {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT product_name, COUNT(*) as search_count 
         FROM product_inquiries 
         GROUP BY product_name 
         ORDER BY search_count DESC 
         LIMIT ?`,
                [limit],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    // Get most common conditions
    getMostCommonConditions: (limit = 10) => {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT condition_type, COUNT(*) as condition_count 
         FROM user_conditions 
         GROUP BY condition_type 
         ORDER BY condition_count DESC 
         LIMIT ?`,
                [limit],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    // ==================== ORDER MANAGEMENT ====================

    // Create new order
    createOrder: (orderData) => {
        return new Promise((resolve, reject) => {
            const {
                orderId,
                sessionId,
                customerName,
                customerPhone,
                customerEmail,
                deliveryAddress,
                deliveryCity,
                deliveryArea,
                orderItems,
                totalItems,
                totalAmount,
                orderNotes
            } = orderData;

            db.run(
                `INSERT INTO orders 
                (order_id, session_id, customer_name, customer_phone, customer_email, 
                 delivery_address, delivery_city, delivery_area, order_items, 
                 total_items, total_amount, order_notes, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    orderId, sessionId, customerName, customerPhone, customerEmail,
                    deliveryAddress, deliveryCity, deliveryArea, JSON.stringify(orderItems),
                    totalItems, totalAmount, orderNotes, 'pending'
                ],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, orderId });
                }
            );
        });
    },

    // Add order item
    addOrderItem: (orderItemData) => {
        return new Promise((resolve, reject) => {
            const {
                orderId,
                productName,
                productId,
                productCompany,
                packSize,
                quantity,
                unitPrice,
                subtotal
            } = orderItemData;

            db.run(
                `INSERT INTO order_items 
                (order_id, product_name, product_id, product_company, pack_size, 
                 quantity, unit_price, subtotal) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [orderId, productName, productId, productCompany, packSize, quantity, unitPrice, subtotal],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },

    // Get order by ID
    getOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM orders WHERE order_id = ?',
                [orderId],
                (err, row) => {
                    if (err) reject(err);
                    else if (!row) reject(new Error('Order not found'));
                    else {
                        // Parse order_items JSON
                        if (row.order_items) {
                            row.order_items = JSON.parse(row.order_items);
                        }
                        resolve(row);
                    }
                }
            );
        });
    },

    // Get order items
    getOrderItems: (orderId) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC',
                [orderId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    // Update order status
    updateOrderStatus: (orderId, status) => {
        return new Promise((resolve, reject) => {
            const updateField = status === 'confirmed' ? 'confirmed_at' :
                status === 'completed' ? 'completed_at' : null;

            let query = 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP';
            const params = [status];

            if (updateField) {
                query += `, ${updateField} = CURRENT_TIMESTAMP`;
            }

            query += ' WHERE order_id = ?';
            params.push(orderId);

            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    // Get orders by session
    getSessionOrders: (sessionId) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM orders WHERE session_id = ? ORDER BY created_at DESC',
                [sessionId],
                (err, rows) => {
                    if (err) reject(err);
                    else {
                        rows.forEach(row => {
                            if (row.order_items) {
                                row.order_items = JSON.parse(row.order_items);
                            }
                        });
                        resolve(rows);
                    }
                }
            );
        });
    },

    // Get all orders with filters
    getAllOrders: (filters = {}) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM orders WHERE 1=1';
            const params = [];

            if (filters.status) {
                query += ' AND status = ?';
                params.push(filters.status);
            }

            if (filters.startDate) {
                query += ' AND created_at >= ?';
                params.push(filters.startDate);
            }

            if (filters.endDate) {
                query += ' AND created_at <= ?';
                params.push(filters.endDate);
            }

            query += ' ORDER BY created_at DESC';

            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(filters.limit);
            }

            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else {
                    rows.forEach(row => {
                        if (row.order_items) {
                            row.order_items = JSON.parse(row.order_items);
                        }
                    });
                    resolve(rows);
                }
            });
        });
    },

    // ==================== INVENTORY MANAGEMENT ====================

    // Check product stock availability
    checkProductStock: (productId) => {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM product_inventory WHERE product_id = ?',
                [productId],
                (err, row) => {
                    if (err) reject(err);
                    else if (!row) {
                        // Default: assume in stock if not tracked
                        resolve({
                            product_id: productId,
                            quantity_in_stock: 100,
                            status: 'in_stock',
                            available: true
                        });
                    } else {
                        resolve({
                            ...row,
                            available: row.status === 'in_stock' && row.quantity_in_stock > 0
                        });
                    }
                }
            );
        });
    },

    // Update product stock
    updateProductStock: (productId, quantity, operation = 'subtract') => {
        return new Promise((resolve, reject) => {
            const modifier = operation === 'add' ? '+' : '-';

            db.run(
                `UPDATE product_inventory 
                 SET quantity_in_stock = quantity_in_stock ${modifier} ?,
                     last_updated = CURRENT_TIMESTAMP,
                     status = CASE 
                         WHEN (quantity_in_stock ${modifier} ?) <= 0 THEN 'out_of_stock'
                         WHEN (quantity_in_stock ${modifier} ?) <= reorder_level THEN 'low_stock'
                         ELSE 'in_stock'
                     END
                 WHERE product_id = ?`,
                [quantity, quantity, quantity, productId],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    },

    // ==================== CART PERSISTENCE ====================

    // Save cart state
    saveCart: (sessionId, contextData) => {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO user_carts (session_id, cart_data, last_updated) 
                 VALUES (?, ?, CURRENT_TIMESTAMP)
                 ON CONFLICT(session_id) DO UPDATE SET 
                 cart_data = excluded.cart_data,
                 last_updated = CURRENT_TIMESTAMP`,
                [sessionId, JSON.stringify(contextData)],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    },

    // Legacy support / Alias
    saveContext: (sessionId, context) => dbHelpers.saveCart(sessionId, context),

    // Get cart state
    getCart: (sessionId) => {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT cart_data FROM user_carts WHERE session_id = ?',
                [sessionId],
                (err, row) => {
                    if (err) reject(err);
                    else if (!row) resolve([]);
                    else {
                        try {
                            const data = JSON.parse(row.cart_data);
                            // If it's the old format (just an array), wrap it
                            if (Array.isArray(data)) {
                                resolve({ cart: data });
                            } else {
                                resolve(data);
                            }
                        } catch (e) {
                            resolve({ cart: [] });
                        }
                    }
                }
            );
        });
    },

    // Clear cart (usually after order)
    deleteCart: (sessionId) => {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM user_carts WHERE session_id = ?',
                [sessionId],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }
};

module.exports = { db, dbHelpers };
