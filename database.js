const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const isVercel = process.env.VERCEL || process.env.NOW_BUILD_TRIGGER;
const dbPath = isVercel ? path.join('/tmp', 'aetherstudy.db') : path.join(__dirname, 'aetherstudy.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite persistent database at:', dbPath);
    initializeSchema();
  }
});

// Initialize database schema tables
function initializeSchema() {
  db.serialize(() => {
    // Create Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        tier TEXT DEFAULT 'Free Tier',
        token TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err.message);
    });

    // Create Pomodoro Logs Table
    db.run(`
      CREATE TABLE IF NOT EXISTS pomodoro_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        mode TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating pomodoro_logs table:', err.message);
    });

    // Create Tasks Table
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 1,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      )
    `, (err) => {
      if (err) console.error('Error creating tasks table:', err.message);
    });

    // Create Schedule Table
    db.run(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 1,
        time TEXT NOT NULL,
        subject TEXT NOT NULL,
        method TEXT NOT NULL,
        status TEXT DEFAULT 'Pending'
      )
    `, (err) => {
      if (err) console.error('Error creating schedule table:', err.message);
    });

    // Create Settings Table
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error creating settings table:', err.message);
      } else {
        // Seed default profile values if empty
        db.run("INSERT OR IGNORE INTO settings (key, value) VALUES ('user_name', 'Aether Scholar')");
        db.run("INSERT OR IGNORE INTO settings (key, value) VALUES ('user_tier', 'Free Tier')");
        db.run("INSERT OR IGNORE INTO settings (key, value) VALUES ('payment_status', 'Unpaid')");
      }
    });

    // Safe Alterations for existing schema migrations
    db.run(`ALTER TABLE tasks ADD COLUMN user_id INTEGER DEFAULT 1`, (err) => {
      // Ignore if column already exists
    });
    db.run(`ALTER TABLE schedule ADD COLUMN user_id INTEGER DEFAULT 1`, (err) => {
      // Ignore if column already exists
    });
  });
}

// Helper utility to execute SQL commands in a promise wrapper (Async/Await compliant)
const dbQuery = {
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

module.exports = dbQuery;
