import { Router } from 'express';

export const callsRouter = Router();

callsRouter.get('/history', (req, res) => {
  res.json({
    success: true,
    calls: [
      { id: 'call_1', user: 'Elena Vance', type: 'video', direction: 'incoming', duration: '14m 22s', timestamp: 'Today, 11:20 AM' },
      { id: 'call_2', user: 'NovaMesh Core Group', type: 'group_video', direction: 'outgoing', duration: '45m 10s', timestamp: 'Yesterday, 04:15 PM' },
    ],
  });
});

callsRouter.post('/initiate', (req, res) => {
  const { recipientId, callType } = req.body;
  res.json({
    success: true,
    callId: 'call_' + Date.now(),
    webrtcRoomId: `room_${Math.random().toString(36).substr(2, 6)}`,
    status: 'ringing',
  });
});
