import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import { login } from '../utils/api';

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(phone, password);
      if (res.error) {
        alert(res.error);
      } else {
        alert(res.message);
        // 로그인 성공 -> 채팅목록으로
        navigate('/chat-list', { state: { myPhone: res.phone } });
      }
    } catch (err) {
      alert('로그인 실패: ' + err.message);
    }
  };

  // 엔터 키 처리
  const onKeyPressPhone = (e) => {
    if (e.key === 'Enter') {
      // 폰 입력에서 엔터 시 비밀번호로 포커스 넘기거나
      // 원하는 경우 바로 handleLogin() 호출 가능
      // 여기서는 비밀번호 Input에 포커스 이동 예시
      document.getElementById('passwordInput')?.focus();
    }
  };

  const onKeyPressPassword = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div>
      <Banner title="로그인" />
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>
            전화번호(010으로 시작 11자리)
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyPress={onKeyPressPhone}
            placeholder="01012345678"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>
            비밀번호
          </label>
          <input
            id="passwordInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={onKeyPressPassword}
            placeholder="비밀번호"
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
          onClick={handleLogin}
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
        >
          로그인
        </button>
      </div>
    </div>
  );
}

export default Login;
