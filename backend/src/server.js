import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

import { authRouter } from './modules/auth/auth.routes.js';
import { chatRouter } from './modules/chat/chat.routes.js';
import { callsRouter } from './modules/calls/calls.routes.js';
import { mediaRouter } from './modules/media/media.routes.js';
import { socialRouter } from './modules/social/social.routes.js';
import { aiRouter } from './modules/ai/ai.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { groupsRouter } from './modules/groups/groups.routes.js';
import { channelsRouter } from './modules/channels/channels.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import { swaggerDocument } from './swagger.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Swagger OpenAPI Documentation UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// REST API Module Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/calls', callsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/social', socialRouter);
app.use('/api/ai', aiRouter);
app.use('/api/admin', adminRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/channels', channelsRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '2.4.0',
    active_connections: io.engine.clientsCount,
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// WebSockets & WebRTC Signaling Socket.io Server
const activeSockets = new Map();

io.on('connection', (socket) => {
  log(`Client connected over WebSocket: ${socket.id}`);
  activeSockets.set(socket.id, { connectedAt: Date.now() });

  // Broadcast presence
  io.emit('presence:change', { socketId: socket.id, status: 'online' });

  // Handle Instant Messaging
  socket.on('message:send', (payload) => {
    socket.broadcast.emit('message:receive', {
      ...payload,
      status: 'delivered',
      serverTimestamp: Date.now(),
    });
  });

  // Handle Typing Indicators
  socket.on('typing:start', (data) => {
    socket.broadcast.emit('typing:status', { ...data, isTyping: true });
  });

  socket.on('typing:stop', (data) => {
    socket.broadcast.emit('typing:status', { ...data, isTyping: false });
  });

  // Handle WebRTC Call Signaling (Offer, Answer, ICE Candidate)
  socket.on('call:offer', (data) => {
    socket.broadcast.emit('call:incoming', data);
  });

  socket.on('call:answer', (data) => {
    socket.broadcast.emit('call:accepted', data);
  });

  socket.on('call:ice-candidate', (candidate) => {
    socket.broadcast.emit('call:ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    activeSockets.delete(socket.id);
    io.emit('presence:change', { socketId: socket.id, status: 'offline' });
    log(`Client disconnected: ${socket.id}`);
  });
});

function log(msg) {
  console.log(`[NovaLink-Server] ${new Date().toISOString()} - ${msg}`);
}

server.listen(PORT, () => {
  console.log(`
  =============================================================
  ⚡ NovaLink Enterprise Production Backend Server Active
  📡 WebSockets Engine: ws://localhost:${PORT}
  📚 OpenAPI Documentation: http://localhost:${PORT}/api/docs
  =============================================================
  `);
});
