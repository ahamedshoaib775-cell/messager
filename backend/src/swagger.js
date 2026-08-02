export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NovaLink API Engine Specification',
    version: '2.4.0',
    description: 'Production REST & Real-time WebSockets API for NovaLink Messaging & NovaMesh Offline Platform',
  },
  servers: [
    {
      url: 'http://localhost:8080/api',
      description: 'Development Server',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Server Health Check',
        responses: {
          '200': { description: 'Healthy' },
        },
      },
    },
    '/auth/phone-otp': {
      post: {
        summary: 'Authenticate via Phone OTP',
        responses: {
          '200': { description: 'OTP verified, returns JWT tokens' },
        },
      },
    },
    '/chat/messages': {
      get: {
        summary: 'Get conversation message history',
        responses: {
          '200': { description: 'Message array' },
        },
      },
      post: {
        summary: 'Post encrypted message',
        responses: {
          '201': { description: 'Message created' },
        },
      },
    },
    '/ai/translate': {
      post: {
        summary: 'Translate message via NovaAI',
        responses: {
          '200': { description: 'Translated text' },
        },
      },
    },
  },
};
