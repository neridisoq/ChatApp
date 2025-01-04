const API_BASE = 'https://helgisnw.com';
// 로그인
export async function login(phone, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // 쿠키 전송
    body: JSON.stringify({ phone, password })
  });
  return res.json();
}

// 로그아웃
export async function logout() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include' // 세션 쿠키 포함
  });
  return res.json();
}

// 로그인 상태 확인
export async function getMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    credentials: 'include'
  });
  return res.json();
}

// 채팅 목록
export async function getChatList(myPhone) {
  const res = await fetch(`${API_BASE}/chat/list/${myPhone}`, {
    credentials: 'include'
  });
  return res.json();
}

// 특정 채팅방 내역
export async function getChatRoom(myPhone, otherPhone) {
  const url = `${API_BASE}/chat/room?myPhone=${myPhone}&otherPhone=${otherPhone}`;
  const res = await fetch(url);
  return res.json();
}

// 메시지 전송(텍스트)
export async function sendMessage(sender, receiver, content) {
  const res = await fetch(`${API_BASE}/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, receiver, content }),
  });
  return res.json();
}

// 메시지 전송(이미지)
export async function sendImage(sender, receiver, imageBase64) {
  const res = await fetch(`${API_BASE}/chat/send-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, receiver, imageBase64 }),
  });
  return res.json();
}

// 메시지 읽음 처리
export async function markAsRead(myPhone, otherPhone) {
  const res = await fetch(`${API_BASE}/chat/mark-read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ myPhone, otherPhone }),
  });
  return res.json();
}

// 닉네임 변경
export async function updateNickname(phone, newNickname) {
  const res = await fetch(`${API_BASE}/chat/update-nickname`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, newNickname }),
  });
  return res.json();
}

export async function getNickname(phone) {
  const res = await fetch(`${API_BASE}/chat/nickname?phone=${phone}`);
  return res.json();
}
