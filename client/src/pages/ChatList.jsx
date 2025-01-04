// client/src/pages/ChatList.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import { getChatList, logout } from '../utils/api'; // logout 추가

function ChatList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [myPhone, setMyPhone] = useState('');
  const [chats, setChats] = useState([]);

  // 로그인 화면에서 넘겨준 phone
  useEffect(() => {
    if (location.state && location.state.myPhone) {
      setMyPhone(location.state.myPhone);
    } else {
      // 직접 URL 입력 등 잘못 접근 시 로그인으로
      navigate('/');
    }
  }, [location, navigate]);

  // 채팅 목록 불러오기
  const fetchChats = async (phone) => {
    try {
      const list = await getChatList(phone);
      if (Array.isArray(list)) {
        setChats(list);
      } else {
        console.error('채팅목록 응답이 배열이 아님:', list);
        setChats([]);
      }
    } catch (err) {
      console.error('fetchChats 에러:', err);
      setChats([]);
    }
  };

  // 2초마다 채팅 목록 갱신
  useEffect(() => {
    if (myPhone) {
      fetchChats(myPhone);
      const interval = setInterval(() => {
        fetchChats(myPhone);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [myPhone]);

  // 로그아웃 처리(세션 파괴)
  const handleLogout = async () => {
    try {
      const res = await logout();
      alert(res.message); // "로그아웃 되었습니다." 등
      navigate('/');
    } catch (err) {
      alert('로그아웃 실패: ' + err.message);
    }
  };

  // 새 대화 화면으로 이동
  const handlePlus = () => {
    navigate('/new-chat', { state: { myPhone } });
  };

  return (
    <div>
      {/* 배너: 왼쪽 "로그아웃" 버튼, 오른쪽 "+" 버튼 */}
      <Banner
        title="채팅목록"
        backText="로그아웃"
        onBack={handleLogout}
        rightAction={
          <button
            style={{
              color: '#2196f3',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
            onClick={handlePlus}
          >
            +
          </button>
        }
      />

      <div style={{ padding: '20px' }}>
        {chats.map((chat, idx) => {
          // 닉네임(있다면) 또는 전화번호
          const displayName = chat.nickname || chat.otherParty;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
                padding: '10px 0',
                cursor: 'pointer'
              }}
              onClick={() => {
                navigate(`/chat/${chat.otherParty}`, {
                  state: { myPhone, otherPhone: chat.otherParty }
                });
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{displayName}</div>
                <div style={{ color: '#777' }}>{chat.content}</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                  {chat.timestamp}
                </div>
              </div>

              {/* 안 읽은 메시지 수 */}
              {chat.unreadCount > 0 && (
                <div
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: 'red',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {chat.unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList;
