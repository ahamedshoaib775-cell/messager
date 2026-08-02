import { Router } from 'express';

export const adminRouter = Router();

adminRouter.get('/metrics', (req, res) => {
  res.json({
    success: true,
    metrics: {
      activeSockets: 14892,
      activeMeshNodes: 3410,
      cpuLoadPercent: 28,
      memoryUsageMB: 4200,
      flaggedSpamCount: 4,
    },
  });
});

adminRouter.post('/broadcast', (req, res) => {
  const { message } = req.body;
  res.json({
    success: true,
    broadcastDispatched: true,
    message,
    recipientCount: 18302,
  });
});
