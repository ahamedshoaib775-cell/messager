import { Router } from 'express';

export const channelsRouter = Router();

channelsRouter.get('/', (req, res) => {
  res.json({
    success: true,
    channels: [
      { id: 'chan_1', name: '📢 NovaLink Official Announcements', subscribers: 24900, verified: true },
      { id: 'chan_2', name: '⚡ NovaMesh Radar & Node Intel', subscribers: 18400, verified: true },
    ],
  });
});

channelsRouter.post('/subscribe/:id', (req, res) => {
  const { id } = req.params;
  res.json({ success: true, channelId: id, subscribed: true });
});
