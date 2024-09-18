import React, { useState, useEffect } from 'react';
import { useWebSocket } from './webSocketProvider';
import { useNavigate } from 'react-router-dom';

const CreatePage = () => {
  const { createRoom, roomId, error } = useWebSocket();
  const [inputUsername, setInputUsername] = useState('');
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [chatname,setchatname] = useState('Chat');
  const navigate = useNavigate();
/*
  useEffect(() => {
    if (roomId) {
      // Navigate to the chat page once the room is created
      
    }
  }, [roomId, navigate]);*/

  const handleCreateRoom = () => {
    if (!inputUsername) {
      alert('Please set a username first');
      return;
    }
    
    setCreatingRoom(true);
    createRoom(inputUsername,chatname);
    navigate(`/chat/${roomId}`);
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
          <h2 className="text-xl font-semibold mb-4">Enter Chatname</h2>
          <input
            type="text"
            value={chatname}
            placeholder="Chatname"
            onChange={(e) => setchatname(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateRoom}
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={creatingRoom}
          >
            {creatingRoom ? 'Creating Room...' : 'Create Chat'}
          </button>
          {error && <p className="mt-4 text-red-500">Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;