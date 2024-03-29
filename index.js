const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

let nextPlayerId = 1;
const connectedPlayers = {};

server.on('connection', (socket) => {
  const playerId = nextPlayerId++;
  connectedPlayers[playerId] = socket;

  console.log(`Player ${playerId} connected`);
  // Send the player ID to the client
  socket.send(`Your Player id is ${playerId}`);

  // Handle messages from this client
  socket.on('message', (message) => {
    console.log(`Received from Player ${playerId}: ${message}`);

    // Broadcast the message to all connected players
    Object.values(connectedPlayers).forEach((playerSocket) => {
      playerSocket.send(`Player ${playerId} says: ${message}`);
    });
  });

  // Remove the player from the list when they disconnect
  socket.on('close', () => {
    console.log(`Player ${playerId} disconnected`);
    delete connectedPlayers[playerId];
    nextPlayerId--; 
  });
});
