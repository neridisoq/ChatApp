// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 로그인 (전화번호+비밀번호 검사)
// - 성공 시: req.session.phone = user.phone
router.post('/login', (req, res) => {
  const { phone, password } = req.body;

  // 기본 전화번호 검증
  const phoneRegex = /^010\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: '전화번호가 유효하지 않습니다.' });
  }
  if (!password) {
    return res.status(400).json({ error: '비밀번호를 입력해주세요.' });
  }

  User.findByPhone(phone, (err, user) => {
    if (err) return res.status(500).json({ error: '서버 오류' });

    if (!user) {
      // 유저 없으면 => 자동 회원가입 후 세션 저장
      User.create({ phone, password, nickname: null }, (err2) => {
        if (err2) return res.status(500).json({ error: '회원가입 실패' });
        req.session.phone = phone; // 세션에 저장
        return res.json({
          message: '회원가입 성공. 로그인 처리되었습니다.',
          phone
        });
      });
    } else {
      // 유저 존재 => 비밀번호 확인
      if (user.password === password) {
        req.session.phone = user.phone; // 세션 저장
        return res.json({
          message: '로그인 성공',
          phone: user.phone,
          nickname: user.nickname
        });
      } else {
        return res.status(401).json({ error: '비밀번호가 틀립니다.' });
      }
    }
  });
});

// 로그아웃 (세션 파괴)
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 삭제 오류:', err);
      return res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
    }
    res.clearCookie('connect.sid'); // 세션 쿠키 삭제
    return res.json({ message: '로그아웃 되었습니다.' });
  });
});

// 로그인 상태 조회 (세션)
router.get('/me', (req, res) => {
  if (!req.session.phone) {
    return res.status(401).json({ error: '로그인하지 않은 상태입니다.' });
  }
  res.json({ phone: req.session.phone });
});

module.exports = router;
