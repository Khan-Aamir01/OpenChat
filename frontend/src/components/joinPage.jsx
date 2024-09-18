import React, { useState, useEffect } from 'react';
import { useWebSocket } from './webSocketProvider';
import { useNavigate } from 'react-router-dom';

const JoinPage = () => {
  const { joinRoom, roomId, error } = useWebSocket();
  const [inputUsername, setInputUsername] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log(roomId);
    if (roomId) {
      // Navigate to the chat page once the room is joined
      navigate(`/chat/${roomId}`);
    }
  }, [roomId, navigate]); 

  const handleJoinRoom = () => {
    if (!inputUsername) {
      alert('Please set a username first');
      return;
    }

    if (inputRoomId.trim() === '') {
      alert('Please enter a room code');
      return;
    }
    joinRoom(inputUsername,inputRoomId);
    
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-900">
      <div className="absolute inset-0 backdrop-blur-sm bg-gray-950 bg-opacity-70 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Enter Username</h2>
          <input
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <h2 className="text-xl font-semibold mb-4">Enter Room Code</h2>
          <input
            type="text"
            value={inputRoomId}
            onChange={(e) => setInputRoomId(e.target.value)}
            placeholder="Room Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleJoinRoom}
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={!inputUsername || !inputRoomId}
          >
            Join Chat
          </button>
          {error && <p className="mt-4 text-red-500">Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

export default JoinPage;