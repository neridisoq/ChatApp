// server/models/Message.js
const db = require('../db');

class Message {
  // 새 메시지 저장
  static create({ sender, receiver, content, image }, callback) {
    const sql = `
      INSERT INTO messages (sender, receiver, content, image) 
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [sender, receiver, content, image], function (err) {
      callback(err, this);
    });
  }

  // 특정 상대와의 채팅 내역
  static findByPair(myPhone, otherPhone, callback) {
    const sql = `
      SELECT * 
      FROM messages
      WHERE (sender = ? AND receiver = ?)
         OR (sender = ? AND receiver = ?)
      ORDER BY id ASC
    `;
    db.all(sql, [myPhone, otherPhone, otherPhone, myPhone], (err, rows) => {
      callback(err, rows);
    });
  }

  // 채팅 목록 (상대방별 마지막 메시지 + 안 읽은 메시지 수 + 닉네임)
  static findLatestChats(myPhone, callback) {
    // nickname도 가져오기 위해 users 테이블을 서브쿼리로 조회
    // CASE WHEN t.sender=? THEN t.receiver ELSE t.sender END -> otherParty
    const sql = `
      SELECT 
        CASE WHEN t.sender = ? THEN t.receiver ELSE t.sender END AS otherParty,
        t.content,
        t.timestamp,
        (
          SELECT nickname 
          FROM users 
          WHERE phone = (CASE WHEN t.sender = ? THEN t.receiver ELSE t.sender END)
        ) AS nickname,
        (
          SELECT COUNT(*) 
          FROM messages 
          WHERE receiver = ?
            AND sender = (CASE WHEN t.sender = ? THEN t.receiver ELSE t.sender END)
            AND isRead = 0
        ) AS unreadCount
      FROM messages t
      WHERE t.sender = ? OR t.receiver = ?
      GROUP BY otherParty
      ORDER BY MAX(t.id) DESC
    `;

    // 매개변수 순서가 중요: sender=?. . .
    // myPhone 6회 (CASE WHEN t.sender=? ...), 총 7개 아닌지? 자세히 보면 1) + 1) + 2) + 2) + 1) + 1) => 6개
    // 여기서 (CASE WHEN t.sender=? THEN t.receiver ELSE t.sender END) 내부도 각각 따로 ?를 전달해줍니다.
    // 구체적으로: 
    //  1) t.sender=? -> (myPhone)
    //  2) t.sender=? -> (myPhone)
    //  3) receiver=? -> (myPhone)
    //  4) sender=? -> (myPhone)
    //  5) t.sender=? -> (myPhone)
    //  6) t.receiver=? -> (myPhone)
    db.all(
      sql,
      [myPhone, myPhone, myPhone, myPhone, myPhone, myPhone],
      (err, rows) => {
        callback(err, rows);
      }
    );
  }

  // 안 읽은 메시지 읽음 처리
  static markAsRead(myPhone, otherPhone, callback) {
    const sql = `
      UPDATE messages
      SET isRead = 1
      WHERE receiver = ?
        AND sender = ?
        AND isRead = 0
    `;
    db.run(sql, [myPhone, otherPhone], function (err) {
      callback(err, this);
    });
  }
}

module.exports = Message;
