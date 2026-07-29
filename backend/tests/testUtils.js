/**
 * testUtils.js
 * ------------
 * Shared helpers for the Jest test suite: wipes the test database
 * tables between test files/blocks so tests remain independent and
 * order-agnostic.
 */

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const db = require('../src/db/database');

function resetDatabase() {
  db.exec('DELETE FROM purchases;');
  db.exec('DELETE FROM vehicles;');
  db.exec('DELETE FROM users;');
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('purchases', 'vehicles', 'users');");
}

module.exports = { resetDatabase, db };
