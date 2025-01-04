// server/routes/chat.js// server/routes/chat.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// 채팅 목록 (안 읽은 메시지, nickname 포함)
router.get('/list/:myPhone', (req, res) => {
  const myPhone = req.params.myPhone;
  Message.findLatestChats(myPhone, (err, rows) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: '서버 에러', detail: err.message });
    }
    // rows: [{ otherParty, content, timestamp, nickname, unreadCount }, ...]
    res.json(rows);
  });
});

// 특정 상대와의 채팅 내역
router.get('/room', (req, res) => {
  const { myPhone, otherPhone } = req.query;
  Message.findByPair(myPhone, otherPhone, (err, messages) => {
    if (err) return res.status(500).json({ error: '서버 에러' });
    res.json(messages);
  });
});

// 메시지 전송(텍스트)
router.post('/send', (req, res) => {
  const { sender, receiver, content } = req.body;
  const safeContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  Message.create({ sender, receiver, content: safeContent, image: null }, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '서버 에러' });
    }
    res.json({ success: true });
  });
});

// 이미지 전송
router.post('/send-image', (req, res) => {
  const { sender, receiver, imageBase64 } = req.body;
  const buffer = Buffer.from(imageBase64, 'base64');
  Message.create({ sender, receiver, content: null, image: buffer }, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '서버 에러' });
    }
    res.json({ success: true });
  });
});

// 안 읽은 메시지 읽음 처리
router.post('/mark-read', (req, res) => {
  const { myPhone, otherPhone } = req.body;
  Message.markAsRead(myPhone, otherPhone, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '서버 에러' });
    }
    res.json({ success: true });
  });
});

// 닉네임 수정
router.post('/update-nickname', (req, res) => {
  const { phone, newNickname } = req.body;
  User.updateNickname(phone, newNickname, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '서버 에러' });
    }
    res.json({ success: true });
  });
});

// ★ 새로 추가: 특정 유저의 닉네임 조회
router.get('/nickname', (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.status(400).json({ error: 'phone 파라미터가 필요합니다.' });
  }
  User.findByPhone(phone, (err, user) => {
    if (err) return res.status(500).json({ error: '서버 에러' });
    if (!user) {
      // 유저가 없으면 nickname은 null
      return res.json({ phone, nickname: null });
    }
    res.json({ phone: user.phone, nickname: user.nickname });
  });
});

module.exports = router;

