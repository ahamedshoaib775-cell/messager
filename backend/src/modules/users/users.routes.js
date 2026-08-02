import { Router } from 'express';

export const usersRouter = Router();

usersRouter.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'user_me',
      name: 'Alex Vance',
      username: '@alex_vance',
      phone: '+1 (555) 019-2834',
      email: 'alex.vance@novalink.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Building resilient offline mesh networks 🌐 | E2EE Advocate 🔒',
      statusEmoji: '⚡',
      statusText: 'Connected via NovaMesh Node #01',
      isVerified: true,
    },
  });
});

usersRouter.put('/profile', (req, res) => {
  const { bio, statusEmoji, statusText } = req.body;
  res.json({ success: true, bio, statusEmoji, statusText });
});
