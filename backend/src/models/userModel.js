/**
 * userModel.js
 * ------------
 * Data-access layer for the `users` table. Keeping raw SQL isolated
 * here (rather than scattered through controllers) follows the
 * Single Responsibility Principle and makes the controllers easy
 * to unit test with a mocked model.
 */

const db = require('../db/database');

const UserModel = {
  create({ name, email, hashedPassword, role = 'customer' }) {
    const stmt = db.prepare(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`
    );
    const info = stmt.run(name, email, hashedPassword, role);
    return UserModel.findById(info.lastInsertRowid);
  },

  findByEmail(email) {
    return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  },

  findById(id) {
    return db
      .prepare(`SELECT id, name, email, role, created_at FROM users WHERE id = ?`)
      .get(id);
  },
};

module.exports = UserModel;
