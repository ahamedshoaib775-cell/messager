import { Router } from 'express';

export const groupsRouter = Router();

groupsRouter.get('/', (req, res) => {
  res.json({
    success: true,
    groups: [
      { id: 'group_1', title: '⚡ NovaMesh Core Developers', membersCount: 148, isOnline: true },
    ],
  });
});

groupsRouter.post('/create', (req, res) => {
  const { title, description } = req.body;
  res.json({
    success: true,
    group: {
      id: 'group_' + Date.now(),
      title,
      description,
      inviteLink: `https://novalink.io/g/${Math.random().toString(36).substr(2, 6)}`,
      membersCount: 1,
    },
  });
});
