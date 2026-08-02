import { Router } from 'express';

export const socialRouter = Router();

socialRouter.get('/stories', (req, res) => {
  res.json({
    success: true,
    stories: [
      { id: 'story_01', user: { name: 'Elena Vance', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }, timestamp: '2h ago', mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', caption: 'Testing NovaMesh hop speed!', viewCount: 42 },
      { id: 'story_02', user: { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }, timestamp: '4h ago', mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', caption: 'E2EE Signal keys verified!', viewCount: 78 },
    ],
  });
});

socialRouter.get('/communities', (req, res) => {
  res.json({
    success: true,
    communities: [
      { id: 'comm_1', name: 'Global Mesh Infrastructure Hub', members: 14200, channels: ['#announcements', '#ble-mesh-core', '#wifi-direct-bridge'] },
      { id: 'comm_2', name: 'E2EE Cryptography & Signal Labs', members: 8900, channels: ['#key-verification', '#signal-protocol'] },
    ],
  });
});

socialRouter.get('/channels', (req, res) => {
  res.json({
    success: true,
    channels: [
      { id: 'chan_1', name: '📢 NovaLink Official Announcements', subscribers: 24900, verified: true },
      { id: 'chan_2', name: '⚡ NovaMesh Radar & Node Intel', subscribers: 18400, verified: true },
    ],
  });
});
