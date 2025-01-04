// server/models/User.js
const db = require('../db');

class User {
  static findByPhone(phone, callback) {
    const sql = `SELECT * FROM users WHERE phone = ?`;
    db.get(sql, [phone], (err, row) => {
      callback(err, row);
    });
  }

  static create({ phone, password, nickname }, callback) {
    const sql = `INSERT INTO users (phone, password, nickname) VALUES (?, ?, ?)`;
    db.run(sql, [phone, password, nickname], function (err) {
      callback(err, this);
    });
  }

  static updateNickname(phone, newNickname, callback) {
    const sql = `UPDATE users SET nickname = ? WHERE phone = ?`;
    db.run(sql, [newNickname, phone], function (err) {
      callback(err, this);
    });
  }
}

module.exports = User;
