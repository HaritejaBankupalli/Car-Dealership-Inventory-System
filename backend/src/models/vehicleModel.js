/**
 * vehicleModel.js
 * ----------------
 * Data-access layer for the `vehicles` table: create, read, update,
 * delete, plus a flexible search that filters by make/model/category
 * and an optional price range.
 */

const db = require('../db/database');

const VehicleModel = {
  create({ make, model, category, price, quantity, year, image_url }) {
    const stmt = db.prepare(
      `INSERT INTO vehicles (make, model, category, price, quantity, year, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const info = stmt.run(
      make,
      model,
      category,
      price,
      quantity,
      year || null,
      image_url || null
    );
    return VehicleModel.findById(info.lastInsertRowid);
  },

  findAll() {
    return db.prepare(`SELECT * FROM vehicles ORDER BY created_at DESC`).all();
  },

  findById(id) {
    return db.prepare(`SELECT * FROM vehicles WHERE id = ?`).get(id);
  },

  search({ make, model, category, minPrice, maxPrice }) {
    let query = `SELECT * FROM vehicles WHERE 1 = 1`;
    const params = [];

    if (make) {
      query += ` AND LOWER(make) LIKE ?`;
      params.push(`%${make.toLowerCase()}%`);
    }
    if (model) {
      query += ` AND LOWER(model) LIKE ?`;
      params.push(`%${model.toLowerCase()}%`);
    }
    if (category) {
      query += ` AND LOWER(category) LIKE ?`;
      params.push(`%${category.toLowerCase()}%`);
    }
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      query += ` AND price >= ?`;
      params.push(Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      query += ` AND price <= ?`;
      params.push(Number(maxPrice));
    }

    query += ` ORDER BY created_at DESC`;
    return db.prepare(query).all(...params);
  },

  update(id, fields) {
    const existing = VehicleModel.findById(id);
    if (!existing) return null;

    const allowed = ['make', 'model', 'category', 'price', 'quantity', 'year', 'image_url'];
    const updates = [];
    const params = [];

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = datetime('now')`);
    params.push(id);

    db.prepare(`UPDATE vehicles SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    return VehicleModel.findById(id);
  },

  delete(id) {
    const info = db.prepare(`DELETE FROM vehicles WHERE id = ?`).run(id);
    return info.changes > 0;
  },

  decreaseQuantity(id, amount = 1) {
    const vehicle = VehicleModel.findById(id);
    if (!vehicle) return { error: 'NOT_FOUND' };
    if (vehicle.quantity < amount) return { error: 'INSUFFICIENT_STOCK' };

    db.prepare(
      `UPDATE vehicles SET quantity = quantity - ?, updated_at = datetime('now') WHERE id = ?`
    ).run(amount, id);
    return { vehicle: VehicleModel.findById(id) };
  },

  increaseQuantity(id, amount = 1) {
    const vehicle = VehicleModel.findById(id);
    if (!vehicle) return { error: 'NOT_FOUND' };

    db.prepare(
      `UPDATE vehicles SET quantity = quantity + ?, updated_at = datetime('now') WHERE id = ?`
    ).run(amount, id);
    return { vehicle: VehicleModel.findById(id) };
  },
};

module.exports = VehicleModel;
