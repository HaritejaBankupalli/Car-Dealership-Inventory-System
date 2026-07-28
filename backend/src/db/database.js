/**
 * database.js
 * ------------
 * Sets up the SQLite database connection using better-sqlite3 and
 * initializes the schema (users + vehicles tables) if it does not
 * already exist. A separate, isolated database file is used when
 * running under Jest (NODE_ENV === 'test') so that test runs never
 * touch or pollute the development/production data file.
 */

const path = require('path');
const Database = require('better-sqlite3');

const DB_FILENAME =
  process.env.NODE_ENV === 'test' ? 'test-database.sqlite' : 'dealership.sqlite';

const DB_PATH = path.join(__dirname, '..', '..', DB_FILENAME);

const db = new Database(DB_PATH);

// Enforce referential integrity and better concurrency behavior.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initializeSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      quantity INTEGER NOT NULL DEFAULT 0 CHECK(quantity >= 0),
      year INTEGER,
      image_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

initializeSchema();

module.exports = db;
