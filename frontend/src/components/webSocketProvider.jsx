// WebSocketContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a WebSocket Context
const WebSocketContext = createContext();

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [chatname,setchatname] = useState('OpenChat');

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      // Handle the connection open
      if (username) {
        socket.send(JSON.stringify({ type: 'username', username }));
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'room_created':
          setchatname(data.chatname);
          setRoomId(data.roomId);
          break;
        case 'joined_room':
          setRoomId(data.roomId);
          setchatname(data.chatname);
          break;
        case 'error':
          setError(data.message);
          break;
        default:
          console.error('Unknown message type:', data.type);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(socket);

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Function to create a room
  const createRoom = (username,chatname) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'create_room',username,chatname }));
    }
    
  };

  // Function to join a room
  const joinRoom = (username,roomId) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'join_room',username, roomId }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ws, createRoom, joinRoom, roomId,chatname, error }}>
      {children}
    </WebSocketContext.Provider>
  );
};
