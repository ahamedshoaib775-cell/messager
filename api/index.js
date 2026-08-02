import express from 'express';
import cors from 'cors';

import { authRouter } from '../backend/src/modules/auth/auth.routes.js';
import { chatRouter } from '../backend/src/modules/chat/chat.routes.js';
import { callsRouter } from '../backend/src/modules/calls/calls.routes.js';
import { mediaRouter } from '../backend/src/modules/media/media.routes.js';
import { socialRouter } from '../backend/src/modules/social/social.routes.js';
import { aiRouter } from '../backend/src/modules/ai/ai.routes.js';
import { adminRouter } from '../backend/src/modules/admin/admin.routes.js';
import { groupsRouter } from '../backend/src/modules/groups/groups.routes.js';
import { channelsRouter } from '../backend/src/modules/channels/channels.routes.js';
import { usersRouter } from '../backend/src/modules/users/users.routes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    environment: 'vercel',
    timestamp: new Date().toISOString(),
  });
});

export default app;
