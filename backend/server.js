const express = require('express');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const { pictures } = require('./data/pictures');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory chat history: Map<pictureId, Array<Message>>
const chatHistory = new Map();

// API endpoint
app.get('/api/pictures', (req, res) => {
  res.json(pictures);
});

// Create one HTTP server for both Express and WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket protocol:
// - { type: "history", pictureId }  -> reply only to sender with { type:"history", pictureId, items: [...] }
// - { type: "chat", pictureId, text, author?, ts? } -> normalize, store, broadcast to all
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data.toString()); } catch { return; }

    // History request
    if (msg.type === 'history' && msg.pictureId) {
      const items = chatHistory.get(msg.pictureId) || [];
      ws.send(JSON.stringify({ type: 'history', pictureId: msg.pictureId, items }));
      return;
    }

    // New chat message
    if (msg.type === 'chat' && msg.pictureId && msg.text) {
      const payload = {
        type: 'chat',
        pictureId: msg.pictureId,
        text: msg.text,
        author: msg.author || 'Guest',
        ts: msg.ts || Date.now(),
      };

      const arr = chatHistory.get(payload.pictureId) || [];
      arr.push(payload);
      chatHistory.set(payload.pictureId, arr);

      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`HTTP+WS listening on http://localhost:${PORT}`);
});