import React, { useState } from 'react';

function ChatInput({ onSendText, onSendImage }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() !== '') {
      onSendText(message);
      setMessage('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target.result.split(',')[1];
      onSendImage(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', marginTop: '10px' }}>
      <label style={{ cursor: 'pointer', marginRight: '5px' }}>
        <img
          alt="upload"
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0iIzIxOTZmMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMu b3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuMTY2NyAwQzEyLjU4NzYgMCAxMi45OTk5IDAuMTc1IDEzLjI4ODYgMC41MDc3OEwxMy41MDc3IDAuNzExNTVDMTMuODI1NCAwLjk5OTg5IDE0IDEuNDEyMSAxNCAxLjgzMzMgTDE0IDEyLjE2NjcgQzE0IDEzLjIwMyAxMy4yMDMgMTQgMTIuMTY2NyAxNCBMMi44MzMzIDE0IEMxLjc5NjcxIDE0IDEgMTMuMjAzIDEgMTIuMTY2NyBMMSAxLjgzMzMgQzEgMC43OTY3MSAxLjc5NjcxIDAgMi44MzMzIDBMMTIuMTY2NyAwIFoiPjwvcGF0aD48L3N2Zz4="
          width="24"
          height="24"
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </label>
      <input
        type="text"
        style={{
          flex: 1,
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px',
          padding: '8px'
        }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          // 엔터로 전송
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
      <button
        style={{
          marginLeft: '5px',
          backgroundColor: '#2196f3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '0 10px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        onClick={handleSend}
      >
        보내기
      </button>
    </div>
  );
}

export default ChatInput;
