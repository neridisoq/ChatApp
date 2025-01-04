import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Banner from '../components/Banner';
import { sendMessage } from '../utils/api';

function NewChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otherPhone, setOtherPhone] = useState('');

  const myPhone =
    location.state && location.state.myPhone ? location.state.myPhone : '';

  const handleStartChat = async () => {
    if (!otherPhone) return alert('상대방 전화번호를 입력하세요.');
    await sendMessage(myPhone, otherPhone, '첫 대화');
    navigate(`/chat/${otherPhone}`, { state: { myPhone, otherPhone } });
  };

  return (
    <div>
      <Banner
        title="새 대화"
        backText="채팅목록"
        onBack={() => {
          navigate('/chat-list', { state: { myPhone } });
        }}
      />
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>
            상대방 전화번호(010xxxxxxxx)
          </label>
          <input
            type="text"
            value={otherPhone}
            onChange={(e) => setOtherPhone(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        <button
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={handleStartChat}
        >
          대화 시작
        </button>
      </div>
    </div>
  );
}

export default NewChat;
