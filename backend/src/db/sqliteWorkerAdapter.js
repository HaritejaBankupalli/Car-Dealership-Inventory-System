/**
 * sqliteWorkerAdapter.js
 * -----------------------
 * A synchronous better-sqlite3 API wrapper built on sql.js and worker_threads.
 * Allows running pure JS/WASM SQLite without native C++ compilation on Node 24.
 */

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');

if (!isMainThread) {
  const initSqlJs = require('sql.js');
  const { controlBuffer, dataBuffer, dbPath } = workerData;
  const control = new Int32Array(controlBuffer);
  const dataView = new Uint8Array(dataBuffer);

  let db = null;

  initSqlJs().then((SQL) => {
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }

    function saveDisk() {
      if (dbPath && dbPath !== ':memory:') {
        const exported = db.export();
        fs.writeFileSync(dbPath, Buffer.from(exported));
      }
    }

    function sendResponse(obj) {
      const jsonStr = JSON.stringify(obj);
      const buf = Buffer.from(jsonStr, 'utf8');
      dataView.fill(0);
      control[1] = buf.length;
      buf.copy(dataView);
      Atomics.store(control, 0, 1);
      Atomics.notify(control, 0);
    }

    // Signal initialization complete
    Atomics.store(control, 0, 1);
    Atomics.notify(control, 0);

    parentPort.on('message', (msg) => {
      try {
        const { action, sql, params } = msg;
        if (action === 'exec') {
          db.exec(sql);
          saveDisk();
          sendResponse({ success: true });
        } else if (action === 'pragma') {
          try {
            db.exec(`PRAGMA ${sql};`);
          } catch (e) {}
          sendResponse({ success: true });
        } else if (action === 'run') {
          const stmt = db.prepare(sql);
          if (params && params.length > 0) {
            stmt.bind(params);
          }
          stmt.step();
          stmt.free();

          const lastIdRes = db.exec('SELECT last_insert_rowid() AS id');
          const changesRes = db.exec('SELECT changes() AS c');
          const lastInsertRowid = lastIdRes[0]?.values[0][0] || 0;
          const changes = changesRes[0]?.values[0][0] || 0;

          saveDisk();
          sendResponse({ success: true, result: { lastInsertRowid, changes } });
        } else if (action === 'get') {
          const stmt = db.prepare(sql);
          if (params && params.length > 0) {
            stmt.bind(params);
          }
          let row = undefined;
          if (stmt.step()) {
            row = stmt.getAsObject();
          }
          stmt.free();
          sendResponse({ success: true, result: row });
        } else if (action === 'all') {
          const stmt = db.prepare(sql);
          if (params && params.length > 0) {
            stmt.bind(params);
          }
          const rows = [];
          while (stmt.step()) {
            rows.push(stmt.getAsObject());
          }
          stmt.free();
          sendResponse({ success: true, result: rows });
        } else if (action === 'close') {
          saveDisk();
          db.close();
          sendResponse({ success: true });
        }
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    });
  });
}

class DatabaseAdapter {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.controlBuffer = new SharedArrayBuffer(16);
    this.dataBuffer = new SharedArrayBuffer(1024 * 1024); // 1MB buffer
    this.control = new Int32Array(this.controlBuffer);
    this.dataView = new Uint8Array(this.dataBuffer);

    this.worker = new Worker(__filename, {
      workerData: {
        controlBuffer: this.controlBuffer,
        dataBuffer: this.dataBuffer,
        dbPath,
      },
    });

    // Wait for init
    this.waitForResponse();
  }

  waitForResponse() {
    Atomics.wait(this.control, 0, 0);
    const len = this.control[1];
    const jsonBytes = this.dataView.subarray(0, len);
    const jsonStr = Buffer.from(jsonBytes).toString('utf8');
    Atomics.store(this.control, 0, 0);
    if (!jsonStr) return {};
    const res = JSON.parse(jsonStr);
    if (!res.success) {
      throw new Error(res.error);
    }
    return res;
  }

  sendCommand(msg) {
    Atomics.store(this.control, 0, 0);
    this.worker.postMessage(msg);
    return this.waitForResponse();
  }

  pragma(str) {
    this.sendCommand({ action: 'pragma', sql: str });
  }

  exec(sql) {
    this.sendCommand({ action: 'exec', sql });
  }

  prepare(sql) {
    const adapter = this;
    return {
      run(...params) {
        const flattenParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const res = adapter.sendCommand({ action: 'run', sql, params: flattenParams });
        return res.result;
      },
      get(...params) {
        const flattenParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const res = adapter.sendCommand({ action: 'get', sql, params: flattenParams });
        return res.result;
      },
      all(...params) {
        const flattenParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const res = adapter.sendCommand({ action: 'all', sql, params: flattenParams });
        return res.result;
      },
    };
  }

  close() {
    this.sendCommand({ action: 'close' });
    this.worker.terminate();
  }
}

module.exports = DatabaseAdapter;
