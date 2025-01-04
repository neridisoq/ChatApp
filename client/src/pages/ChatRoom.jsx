import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import ChatInput from '../components/ChatInput';
import {
  getChatRoom,
  sendMessage,
  sendImage,
  updateNickname,
  markAsRead,
  getNickname
} from '../utils/api';

function ChatRoom() {
  const { otherPhone } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [myPhone, setMyPhone] = useState('');
  const [chatList, setChatList] = useState([]);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(otherPhone);

  const messagesEndRef = useRef(null);

  // 로그인한 내 번호 추출
  useEffect(() => {
    if (location.state && location.state.myPhone) {
      setMyPhone(location.state.myPhone);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  // DB에서 상대방 닉네임 가져오기
  const fetchNickname = async () => {
    try {
      const user = await getNickname(otherPhone);
      if (user.nickname) {
        setNickname(user.nickname);
      } else {
        // 닉네임이 없으면 그냥 전화번호
        setNickname(otherPhone);
      }
    } catch (err) {
      console.error('fetchNickname 에러:', err);
    }
  };

  // 채팅 내역 가져오기
  const fetchChat = async () => {
    try {
      const data = await getChatRoom(myPhone, otherPhone);
      if (Array.isArray(data)) {
        setChatList(data);
      } else {
        setChatList([]);
      }
    } catch (err) {
      console.error(err);
      setChatList([]);
    }
  };

  // 채팅/닉네임 주기적 갱신
  useEffect(() => {
    if (myPhone) {
      // 1) 처음 진입 시 닉네임 + 채팅 내역
      fetchNickname();
      fetchChat();
      markAsRead(myPhone, otherPhone);

      // 2) 2초마다 갱신
      const interval = setInterval(async () => {
        await fetchNickname();
        await fetchChat();
        await markAsRead(myPhone, otherPhone);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [myPhone, otherPhone]);

  // 새 메시지가 추가될 때마다 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatList]);

  // 텍스트/이미지 전송
  const handleSendText = async (text) => {
    await sendMessage(myPhone, otherPhone, text);
  };
  const handleSendImage = async (imageBase64) => {
    await sendImage(myPhone, otherPhone, imageBase64);
  };

  // 닉네임 수정
  const handleUpdateNickname = async () => {
    if (!nickname.trim()) return;
    await updateNickname(otherPhone, nickname);
    setEditingNickname(false);
    alert('상대방의 이름이 수정되었습니다(내 DB 기준)');
    // 수정 후 다시 fetchNickname() 해서 반영
    await fetchNickname();
  };

  return (
    // 화면 전체 높이에서 상단 배너 + 채팅 영역 + 입력창 고정
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
      }}
    >
      <Banner
        title={
          editingNickname ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{ fontSize: '16px' }}
            />
          ) : (
            nickname
          )
        }
        backText="채팅목록"
        onBack={() => navigate('/chat-list', { state: { myPhone } })}
        rightAction={
          editingNickname ? (
            <button
              style={{
                border: 'none',
                background: 'none',
                color: '#2196f3',
                fontSize: '16px'
              }}
              onClick={handleUpdateNickname}
            >
              저장
            </button>
          ) : (
            <button
              style={{
                border: 'none',
                background: 'none',
                color: '#2196f3',
                fontSize: '16px'
              }}
              onClick={() => setEditingNickname(true)}
            >
              수정
            </button>
          )
        }
      />

      {/* 채팅 내용 스크롤 영역 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 20px'
        }}
      >
        {chatList.map((msg) => {
          const isMine = msg.sender === myPhone;
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}
            >
              {msg.content && (
                <div
                  style={{
                    backgroundColor: isMine ? '#2196f3' : '#f1f1f1',
                    color: isMine ? '#fff' : '#000',
                    padding: '8px',
                    borderRadius: '5px',
                    maxWidth: '60%'
                  }}
                >
                  {msg.content}
                </div>
              )}
              {msg.image && (
                <img
                  src={`data:image/png;base64,${msg.image.toString('base64')}`}
                  alt="img"
                  style={{
                    maxWidth: '150px',
                    borderRadius: '5px',
                    border: isMine ? '2px solid #2196f3' : '2px solid #ccc'
                  }}
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 고정 */}
      <div
        style={{
          flex: 'none',
          padding: '10px 20px'
        }}
      >
        <ChatInput onSendText={handleSendText} onSendImage={handleSendImage} />
      </div>
    </div>
  );
}

export default ChatRoom;
