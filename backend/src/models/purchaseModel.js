/**
 * purchaseModel.js
 * ----------------
 * Data-access layer for the `purchases` table. Tracks vehicle transactions
 * for customers and provides complete sales metrics & ledger for admins.
 */

const db = require('../db/database');

const PurchaseModel = {
  create({ userId, vehicleId, quantity = 1, priceAtPurchase }) {
    const totalPrice = quantity * priceAtPurchase;
    const stmt = db.prepare(
      `INSERT INTO purchases (user_id, vehicle_id, quantity, price_at_purchase, total_price)
       VALUES (?, ?, ?, ?, ?)`
    );
    const info = stmt.run(userId, vehicleId, quantity, priceAtPurchase, totalPrice);
    return PurchaseModel.findById(info.lastInsertRowid);
  },

  findById(id) {
    return db
      .prepare(
        `SELECT p.*, v.make, v.model, v.category, v.year, v.image_url, u.name as user_name, u.email as user_email
         FROM purchases p
         JOIN vehicles v ON p.vehicle_id = v.id
         JOIN users u ON p.user_id = u.id
         WHERE p.id = ?`
      )
      .get(id);
  },

  findByUserId(userId) {
    return db
      .prepare(
        `SELECT p.*, v.make, v.model, v.category, v.year, v.image_url
         FROM purchases p
         JOIN vehicles v ON p.vehicle_id = v.id
         WHERE p.user_id = ?
         ORDER BY p.purchased_at DESC`
      )
      .all(userId);
  },

  findAll() {
    return db
      .prepare(
        `SELECT p.*, v.make, v.model, v.category, v.year, v.image_url, u.name as user_name, u.email as user_email
         FROM purchases p
         JOIN vehicles v ON p.vehicle_id = v.id
         JOIN users u ON p.user_id = u.id
         ORDER BY p.purchased_at DESC`
      )
      .all();
  },
};

module.exports = PurchaseModel;
