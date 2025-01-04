import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ChatList from './pages/ChatList';
import NewChat from './pages/NewChat';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat-list" element={<ChatList />} />
      <Route path="/new-chat" element={<NewChat />} />
      <Route path="/chat/:otherPhone" element={<ChatRoom />} />
    </Routes>
  );
}

export default App;
