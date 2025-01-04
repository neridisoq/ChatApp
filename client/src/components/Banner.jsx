import React from 'react';
import { useNavigate } from 'react-router-dom';

function Banner({ title, onBack, backText, rightAction }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'relative',       // 절대 위치로 좌우 버튼을 배치해도 중앙정렬 유지
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',   // 가운데 정렬
        padding: '12px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fff'
      }}
    >
      {/* 왼쪽 뒤로가기 버튼 */}
      <button
        style={{
          position: 'absolute',
          left: '10px',
          color: '#2196f3',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        onClick={() => {
          if (onBack) onBack();
          else navigate(-1);
        }}
      >
        {backText || '뒤로가기'}
      </button>

      {/* 가운데 제목 (문자열 혹은 JSX) */}
      <h2
        style={{
          margin: 0,
          fontSize: '20px'
        }}
      >
        {title}
      </h2>

      {/* 오른쪽 액션 버튼 (수정/저장 등) */}
      {rightAction && (
        <div
          style={{
            position: 'absolute',
            right: '10px'
          }}
        >
          {rightAction}
        </div>
      )}
    </div>
  );
}

export default Banner;
