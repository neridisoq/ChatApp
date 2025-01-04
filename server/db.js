// server/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chat.db');
const db = new sqlite3.Database(dbPath);

// 테이블 준비
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      phone TEXT PRIMARY KEY,
      password TEXT NOT NULL,
      nickname TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      receiver TEXT NOT NULL,
      content TEXT,
      image BLOB,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      isRead INTEGER DEFAULT 0
    )
  `);
});

module.exports = db;
