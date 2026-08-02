// Seed Data for NovaLink Application - Clean Slate Setup

export const INITIAL_USER = {
  id: 'user_me',
  name: 'Alex Vance',
  username: '@alex_vance',
  phone: '+1 (555) 019-2834',
  email: 'alex.vance@novalink.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Building resilient offline mesh networks 🌐 | E2EE Advocate 🔒',
  statusEmoji: '⚡',
  statusText: 'Online via NovaLink',
  isVerified: true,
  e2eeFingerprint: '48291 93820 10293 84729 01928 37461',
  devices: [
    { id: 'dev_01', name: 'MacBook Pro M3 Max', type: 'Desktop', active: true, location: 'San Francisco, CA' },
  ],
};

// Clean empty stories list
export const INITIAL_STORIES = [];

// Clean empty contacts and chats list
export const INITIAL_CHATS = [];

// Clean empty message history map
export const INITIAL_MESSAGES = {};

// Clean empty call history list
export const INITIAL_CALLS = [];
