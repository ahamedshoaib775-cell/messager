import { Router } from 'express';
import jwt from 'jsonwebtoken';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'novalink_super_secret_jwt_key_2026';

// Phone Number OTP Login
authRouter.post('/phone-otp', (req, res) => {
  const { phone, otp } = req.body;
  const token = jwt.sign({ userId: 'user_me', phone }, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId: 'user_me', type: 'refresh' }, JWT_SECRET, { expiresIn: '30d' });

  res.json({
    success: true,
    token,
    refreshToken,
    user: {
      id: 'user_me',
      name: 'Alex Vance',
      username: '@alex_vance',
      phone: phone || '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });
});

// Email Login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const token = jwt.sign({ userId: 'user_me', email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    token,
    user: { id: 'user_me', email: email || 'alex.vance@novalink.io', username: '@alex_vance' },
  });
});

// QR Code Pairing Token Endpoint
authRouter.post('/qr-pair', (req, res) => {
  const { devicePairKey } = req.body;
  res.json({
    success: true,
    paired: true,
    device: { id: 'dev_' + Date.now(), name: 'Desktop Session', active: true },
  });
});

// OAuth Mock Endpoints (Google & Apple)
authRouter.post('/google', (req, res) => {
  const token = jwt.sign({ userId: 'user_me', provider: 'google' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: 'user_me', name: 'Alex Vance (Google Account)' } });
});

authRouter.post('/apple', (req, res) => {
  const token = jwt.sign({ userId: 'user_me', provider: 'apple' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: 'user_me', name: 'Alex Vance (Apple ID)' } });
});
