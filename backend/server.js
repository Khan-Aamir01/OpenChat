const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors()); 

const rooms = new Map();
const users = new Map();

wss.on('connection', ws => { // Trigger Once during Connection
  const userId = uuidv4();
  let currentRoomId = null;
  let username = null;

  ws.on('message', (message) => { // Trigger Everytime there is message
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'create_room' || parsedMessage.type === 'join_room') {
      username = parsedMessage.username;
      users.set(ws, { userId, username });
      //console.log(`User ${username} connected with ID ${userId}`);
    }

    switch (parsedMessage.type) {
      case 'create_room':

      // Generate a unique room ID
      const idGenerator = IdGenerator();
      const id = idGenerator.next().value;

        const roomId = id + '';
        const roomName = parsedMessage.chatname;
        // Create a room in the rooms map
        rooms.set(roomId, {
          name: roomName,
          users: new Set()
        });
        // Add the user to the room
        rooms.get(roomId).users.add(ws);
        currentRoomId = roomId;
        //console.log(`Room created with ID ${roomId}`);

        // Notify the client of the room creation
        ws.send(JSON.stringify({ type: 'room_created', roomId, roomName }));
        break;

      case 'join_room':
        // Add the user to the specified room
        if (rooms.has(parsedMessage.roomId)) {
          rooms.get(parsedMessage.roomId).users.add(ws);
          const roomName = rooms.get(parsedMessage.roomId).name;
          currentRoomId = parsedMessage.roomId;
          // Notify the client that they have joined the room
          ws.send(JSON.stringify({ type: 'joined_room', roomId: parsedMessage.roomId, chatname: roomName }));

          const welcomeMessage = `${username} has joined the chat.`;
          rooms.get(parsedMessage.roomId).users.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              const notification = "THISISANOTIFICATION"; // Replace this 
              client.send(JSON.stringify({ type: 'message', message: welcomeMessage,sender:notification }));
            }
          });
        } else {
          // Room does not exist
          ws.send(JSON.stringify({ type: 'error', message: 'Room does not exist' }));
        }
        break;

      case 'message':
        // Broadcast the message to all users in the room

        if (currentRoomId && rooms.has(currentRoomId)) {
          const room = rooms.get(currentRoomId);
          const sender = username;

          room.users.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'message', message: parsedMessage.message, sender: sender }));
            }
          });
        } else {
          // User is not in any room
          ws.send(JSON.stringify({ type: 'error', message: 'Not in any room' }));
        }
        break;

      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  });

  ws.on('close', () => {
    // Remove user from the map
    users.delete(userId);
    //console.log(`User ID ${userId} disconnected`);

    // Remove user from their room, if any
    if (currentRoomId && rooms.has(currentRoomId)) {
      const room = rooms.get(currentRoomId);
      room.users.delete(ws);

      // If the room is empty after user leaves, you might want to delete it
      if (room.users.size === 0) {
        rooms.delete(currentRoomId);
        //console.log(`Room ID ${currentRoomId} deleted due to being empty`);
      }
    }
  });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function* IdGenerator(){
  let NUM = 10000;
  while (true) {
    let rand = Math.ceil(Math.random() * 100);
    NUM += rand;
    yield NUM;
  }
}