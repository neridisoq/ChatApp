// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');

const app = express();

/* 
  1) CORS 설정 
     - 'Access-Control-Allow-Origin'에 클라이언트 도메인(https://chat.helgisnw.com) 명시
     - credentials 허용 -> 쿠키 전송 가능
     - OPTIONS(Preflight) 요청은 204로 응답
*/
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://chat.helgisnw.com');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

/* 
  2) 세션 설정
     - secure: true -> HTTPS 환경에서만 쿠키 전송
     - sameSite: 'none' -> cross-site 쿠키 허용(서브도메인간 전송)
     - httpOnly: true -> JS에서 쿠키 접근 불가(보안)
     - maxAge: 24시간
*/
app.use(
  session({
    secret: 'SUPER_SECRET_KEY', // 임의의 비밀키
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,    // HTTPS 전용
      sameSite: 'none',// 크로스도메인 쿠키 허용
      maxAge: 1000 * 60 * 60 * 24 // 24시간
    }
  })
);

// 바디파서
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// 라우팅
app.use('/auth', authRouter);
app.use('/chat', chatRouter);

// 정적 파일 (React build)
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// SPA 처리를 위해 리액트 단일 페이지로 fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// 포트 열기
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
