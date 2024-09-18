import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './components/webSocketProvider'; // Import the WebSocketProvider
import Homepage from './components/homepage';
import JoinPage from './components/joinPage';
import CreatePage from './components/createPage';
import ChatPage from './components/chatPage';

const App = () => {
  return (
    <WebSocketProvider> {/* Wrap the Router with WebSocketProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:roomId" element={<ChatPage />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
};

export default App;
