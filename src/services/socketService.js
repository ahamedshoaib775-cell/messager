// WebSockets Connection Manager for NovaLink Real-Time Engine

import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:8080';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket && this.socket.connected) return;

    this.socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log(`[SocketService] Connected to WebSocket Server: ${this.socket.id}`);
    });

    this.socket.on('message:receive', (msg) => {
      this.emit('message:receive', msg);
    });

    this.socket.on('typing:status', (data) => {
      this.emit('typing:status', data);
    });

    this.socket.on('presence:change', (data) => {
      this.emit('presence:change', data);
    });

    this.socket.on('call:incoming', (data) => {
      this.emit('call:incoming', data);
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => cb(data));
    }
  }

  sendMessage(messagePayload) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message:send', messagePayload);
    }
  }

  sendTyping(chatId, isTyping) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(isTyping ? 'typing:start' : 'typing:stop', { chatId });
    }
  }
}

export const socketService = new SocketService();
