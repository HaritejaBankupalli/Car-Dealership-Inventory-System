/**
 * database.js
 * ------------
 * Sets up the SQLite database connection using a pure JS/WASM adapter (sqliteWorkerAdapter)
 * and initializes the schema (users, vehicles, and purchases tables) if it does not
 * already exist. A separate, isolated database file is used when
 * running under Jest (NODE_ENV === 'test') so that test runs never
 * touch or pollute the development/production data file.
 */

const path = require('path');
const Database = require('./sqliteWorkerAdapter');

const DB_FILENAME =
  process.env.NODE_ENV === 'test' ? 'test-database.sqlite' : 'dealership.sqlite';

const DB_PATH = path.join(__dirname, '..', '..', DB_FILENAME);

const db = new Database(DB_PATH);

// Enforce referential integrity and better concurrency behavior.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const SEED_VEHICLES = [
  {
    make: 'Tesla',
    model: 'Model S Plaid',
    category: 'Electric',
    price: 89990,
    quantity: 4,
    year: 2024,
    image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop',
  },
  {
    make: 'Porsche',
    model: '911 GT3 RS',
    category: 'Coupe',
    price: 241300,
    quantity: 2,
    year: 2024,
    image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop',
  },
  {
    make: 'BMW',
    model: 'M4 Competition',
    category: 'Coupe',
    price: 79100,
    quantity: 5,
    year: 2023,
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
  },
  {
    make: 'Mercedes-Benz',
    model: 'AMG G 63',
    category: 'SUV',
    price: 179000,
    quantity: 3,
    year: 2024,
    image_url: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?w=800&auto=format&fit=crop',
  },
  {
    make: 'Audi',
    model: 'RS e-tron GT',
    category: 'Electric',
    price: 106500,
    quantity: 6,
    year: 2024,
    image_url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop',
  },
  {
    make: 'Ford',
    model: 'F-150 Lightning',
    category: 'Truck',
    price: 54995,
    quantity: 8,
    year: 2023,
    image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop',
  },
  {
    make: 'Toyota',
    model: 'Camry XSE',
    category: 'Sedan',
    price: 31400,
    quantity: 12,
    year: 2024,
    image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop',
  },
  {
    make: 'Land Rover',
    model: 'Range Rover Sport',
    category: 'SUV',
    price: 83600,
    quantity: 4,
    year: 2024,
    image_url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop',
  },
];

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

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      vehicle_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
      price_at_purchase REAL NOT NULL CHECK(price_at_purchase >= 0),
      total_price REAL NOT NULL CHECK(total_price >= 0),
      purchased_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
    );
  `);

  if (process.env.NODE_ENV !== 'test') {
    const row = db.prepare('SELECT COUNT(*) AS count FROM vehicles').get();
    if (!row || row.count === 0) {
      const insertStmt = db.prepare(
        `INSERT INTO vehicles (make, model, category, price, quantity, year, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      for (const vehicle of SEED_VEHICLES) {
        insertStmt.run(
          vehicle.make,
          vehicle.model,
          vehicle.category,
          vehicle.price,
          vehicle.quantity,
          vehicle.year,
          vehicle.image_url
        );
      }
    }
  }
}

initializeSchema();

module.exports = db;
