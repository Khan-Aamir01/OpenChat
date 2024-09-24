import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useWebSocket } from './webSocketProvider';

const ChatPage = () => {
  const { roomId } = useParams();
  const { chatname: wsChatname } = useWebSocket();
  const chatname = location.state?.chatname || wsChatname || 'OpenChat';
  const { ws } = useWebSocket(); // Assuming ws is provided via WebSocketContext
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);



  useEffect(() => {
    if (ws) {
      const handleMessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            console.log(data.sender);
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: data.message, sender: data.sender }
            ]);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.addEventListener('message', handleMessage);

      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws]);

  useEffect(() => {
    // Scroll to bottom of chat messages when new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Sending message:', { type: 'message', roomId, message }); // Debug log
        ws.send(JSON.stringify({ type: 'message', roomId, message }));
        setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'Me' }]);
        setMessage('');
      } else {
        console.error('WebSocket connection is not open');
      }
    } else {
      console.log('Message is empty');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-950 text-white p-4 flex items-center justify-between">
      <h1
      className="text-3xl font-extrabold tracking-wide relative"
      style={{
        background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '2px 2px 8px rgba(0, 114, 255, 0.5)',
        letterSpacing: '1px',
      }}
    >
      {chatname}
    </h1>
        <span className="text-lg">ROOM ID: {roomId}</span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col w-full bg-white border border-gray-300 rounded-t-lg shadow-lg">
        <div className="flex-1 p-4 overflow-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.sender === 'THISISANOTIFICATION' ? 'text-center' : (msg.sender === 'Me' ? 'text-right' : 'text-left')}`}
            >
              {msg.sender === 'THISISANOTIFICATION' ? (
                <div
                  className="inline-block px-4 py-2 rounded-lg bg-blue-100 text-black font-bold"
                >
                  {msg.text}
                </div>
              ) : (
                <>
                  <div className={`text-sm font-semibold ${msg.sender === 'Me' ? 'text-blue-500' : 'text-gray-800'}`}>
                    {msg.sender || 'Unknown'}
                  </div>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'Me'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-black'
                      }`}
                  >
                    {msg.text}
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* For auto-scrolling */}
        </div>
        <div className="p-4 border-t border-gray-300 bg-white flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;