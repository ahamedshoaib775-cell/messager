import { Router } from 'express';

export const chatRouter = Router();

// In-Memory Database store for demo REST persistence
let messagesDb = {
  chat_elena: [
    { id: 'm1', chatId: 'chat_elena', text: 'Hello Alex! Are we ready to demonstrate NovaMesh offline fallback?', sender: 'Elena Vance', isMe: false, timestamp: '10:38 AM', status: 'read' },
    { id: 'm2', chatId: 'chat_elena', text: 'Yes! IndexedDB persistent cache and BroadcastChannel P2P routing are fully active.', sender: 'Alex Vance', isMe: true, timestamp: '10:40 AM', status: 'read' },
  ],
};

chatRouter.get('/messages/:chatId', (req, res) => {
  const { chatId } = req.params;
  res.json({ success: true, messages: messagesDb[chatId] || [] });
});

chatRouter.post('/messages', (req, res) => {
  const { chatId, text, attachment, poll } = req.body;
  const newMsg = {
    id: 'msg_' + Date.now(),
    chatId,
    text,
    sender: 'You',
    isMe: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'read',
    attachment,
    poll,
  };

  if (!messagesDb[chatId]) messagesDb[chatId] = [];
  messagesDb[chatId].push(newMsg);

  res.status(201).json({ success: true, message: newMsg });
});

chatRouter.post('/messages/:id/reaction', (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;
  res.json({ success: true, messageId: id, reaction: emoji });
});

chatRouter.delete('/messages/:id', (req, res) => {
  const { id } = req.params;
  const { deleteMode } = req.query; // for_me or for_everyone
  res.json({ success: true, messageId: id, deleted: true, mode: deleteMode || 'for_everyone' });
});
