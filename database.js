const path = require('path');

const isVercel = process.env.VERCEL || process.env.NOW_BUILD_TRIGGER;
let sqlite3 = null;
let useMockDb = false;

if (isVercel) {
  console.warn('Running in Vercel serverless environment. Skipping native SQLite load and using memory-mock.');
  useMockDb = true;
} else {
  try {
    sqlite3 = require('sqlite3').verbose();
  } catch (e) {
    console.warn('Could not load native sqlite3. Falling back to high-fidelity memory-mock database.', e.message);
    useMockDb = true;
  }
}

// Memory-mock database state fallback if SQLite native module fails to load on Vercel
const mockDbState = {
  users: [],
  tasks: [],
  schedule: [],
  pomodoro_logs: [],
  settings: [
    { key: 'user_name', value: 'Guest Scholar' },
    { key: 'user_tier', value: 'Free Tier' },
    { key: 'payment_status', value: 'Unpaid' }
  ]
};

let db = null;

if (!useMockDb) {
  try {
    const dbPath = path.join(__dirname, 'aetherstudy.db');
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Could not connect to SQLite database:', err.message);
        useMockDb = true;
      } else {
        console.log('Connected to SQLite persistent database at:', dbPath);
        initializeSchema();
      }
    });
  } catch (err) {
    console.warn('Failed to initialize SQLite connection. Switched to mock database.', err.message);
    useMockDb = true;
  }
}

// Initialize database schema tables
function initializeSchema() {
  if (useMockDb) return;
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

// Resilient promise wrapper that branches dynamically between real SQLite and in-memory mock simulator
const dbQuery = {
  all(sql, params = []) {
    if (useMockDb) {
      if (sql.includes('FROM tasks')) {
        const userId = params[0] || 1;
        const mapped = mockDbState.tasks
          .filter(t => t.user_id === userId)
          .map(t => ({ ...t, completed: !!t.completed }));
        return Promise.resolve(mapped);
      }
      if (sql.includes('FROM schedule')) {
        const userId = params[0] || 1;
        return Promise.resolve(mockDbState.schedule.filter(s => s.user_id === userId));
      }
      if (sql.includes('FROM settings')) {
        return Promise.resolve(mockDbState.settings);
      }
      return Promise.resolve([]);
    }
    
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  get(sql, params = []) {
    if (useMockDb) {
      if (sql.includes('FROM users WHERE token = ?')) {
        return Promise.resolve(mockDbState.users.find(u => u.token === params[0]) || null);
      }
      if (sql.includes('FROM users WHERE username = ?')) {
        return Promise.resolve(mockDbState.users.find(u => u.username === params[0]) || null);
      }
      if (sql.includes('FROM users WHERE username = ? AND password = ?')) {
        return Promise.resolve(mockDbState.users.find(u => u.username === params[0] && u.password === params[1]) || null);
      }
      if (sql.includes('FROM tasks WHERE id = ? AND user_id = ?')) {
        return Promise.resolve(mockDbState.tasks.find(t => t.id === params[0] && t.user_id === params[1]) || null);
      }
      if (sql.includes('FROM schedule WHERE id = ? AND user_id = ?')) {
        return Promise.resolve(mockDbState.schedule.find(s => s.id === params[0] && s.user_id === params[1]) || null);
      }
      if (sql.includes('FROM settings WHERE key = ?')) {
        return Promise.resolve(mockDbState.settings.find(s => s.key === params[0]) || null);
      }
      if (sql.includes('COUNT(*) as total FROM tasks WHERE user_id = ?')) {
        const userId = params[0] || 1;
        const userTasks = mockDbState.tasks.filter(t => t.user_id === userId);
        const done = userTasks.filter(t => t.completed).length;
        return Promise.resolve({ total: userTasks.length, done });
      }
      if (sql.includes('COUNT(*) as total FROM schedule WHERE user_id = ?')) {
        const userId = params[0] || 1;
        const total = mockDbState.schedule.filter(s => s.user_id === userId).length;
        return Promise.resolve({ total });
      }
      if (sql.includes('COUNT(*) as total FROM pomodoro_logs WHERE user_id = ?')) {
        const userId = params[0] || 1;
        const total = mockDbState.pomodoro_logs.filter(l => l.user_id === userId).length;
        return Promise.resolve({ total });
      }
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  run(sql, params = []) {
    if (useMockDb) {
      if (sql.includes('INSERT INTO users')) {
        const id = mockDbState.users.length + 1;
        mockDbState.users.push({ id, username: params[0], password: params[1], token: params[2], tier: 'Free Tier' });
        return Promise.resolve({ lastID: id, changes: 1 });
      }
      if (sql.includes('UPDATE users SET token = ?')) {
        const user = mockDbState.users.find(u => u.id === params[1]);
        if (user) user.token = params[0];
        return Promise.resolve({ lastID: params[1], changes: 1 });
      }
      if (sql.includes('UPDATE users SET tier = ?')) {
        const user = mockDbState.users.find(u => u.id === params[1]);
        if (user) user.tier = params[0];
        return Promise.resolve({ lastID: params[1], changes: 1 });
      }
      if (sql.includes('INSERT INTO tasks')) {
        const id = Date.now();
        mockDbState.tasks.push({ id, text: params[0], completed: 0, user_id: params[1] });
        return Promise.resolve({ lastID: id, changes: 1 });
      }
      if (sql.includes('UPDATE tasks SET completed = ?')) {
        const task = mockDbState.tasks.find(t => t.id === params[1] && t.user_id === params[2]);
        if (task) task.completed = params[0] ? 1 : 0;
        return Promise.resolve({ lastID: params[1], changes: 1 });
      }
      if (sql.includes('DELETE FROM tasks WHERE id = ?')) {
        mockDbState.tasks = mockDbState.tasks.filter(t => !(t.id === params[0] && t.user_id === params[1]));
        return Promise.resolve({ changes: 1 });
      }
      if (sql.includes('INSERT INTO schedule')) {
        const id = Date.now();
        mockDbState.schedule.push({ id, time: params[0], subject: params[1], method: params[2], status: params[3], user_id: params[4] });
        return Promise.resolve({ lastID: id, changes: 1 });
      }
      if (sql.includes('UPDATE schedule SET status = ?')) {
        const sess = mockDbState.schedule.find(s => s.id === params[1] && s.user_id === params[2]);
        if (sess) sess.status = params[0];
        return Promise.resolve({ lastID: params[1], changes: 1 });
      }
      if (sql.includes('DELETE FROM schedule WHERE user_id = ?')) {
        mockDbState.schedule = mockDbState.schedule.filter(s => s.user_id !== params[0]);
        return Promise.resolve({ changes: 1 });
      }
      if (sql.includes('DELETE FROM schedule WHERE id = ?')) {
        mockDbState.schedule = mockDbState.schedule.filter(s => !(s.id === params[0] && s.user_id === params[1]));
        return Promise.resolve({ changes: 1 });
      }
      if (sql.includes('INSERT OR REPLACE INTO settings')) {
        const existing = mockDbState.settings.find(s => s.key === params[0]);
        if (existing) existing.value = params[1];
        else mockDbState.settings.push({ key: params[0], value: params[1] });
        return Promise.resolve({ changes: 1 });
      }
      if (sql.includes('INSERT INTO pomodoro_logs')) {
        const id = Date.now();
        mockDbState.pomodoro_logs.push({ id, user_id: params[0], mode: params[1], duration_minutes: params[2] });
        return Promise.resolve({ lastID: id, changes: 1 });
      }
      return Promise.resolve({ changes: 0 });
    }

    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

module.exports = dbQuery;
