// Automated Unit & Integration Tests for NovaLink Core Engine

import { cryptoService } from '../src/services/cryptoService';
import { novaMeshEngine } from '../src/services/novamesh';
import { aiService } from '../src/services/aiService';

describe('NovaLink Signal E2EE Crypto Service', () => {
  test('should generate identity keypair and 30-digit safety fingerprint', () => {
    const identity = cryptoService.generateIdentity();
    expect(identity.publicKey).toBeDefined();
    expect(identity.fingerprint).toMatch(/^\d{5} \d{5} \d{5} \d{5} \d{5} \d{5}$/);
  });

  test('should encrypt and decrypt message text correctly', () => {
    const originalText = 'NovaMesh packet payload confidential';
    const encrypted = cryptoService.encryptPayload(originalText);
    expect(encrypted.ciphertext).toContain('[E2EE_AES256_GCM::');

    const decrypted = cryptoService.decryptPayload(encrypted);
    expect(decrypted).toBe(originalText);
  });
});

describe('NovaMesh Offline P2P Engine', () => {
  test('should format mesh message with hop route tracing', () => {
    const meshMsg = novaMeshEngine.sendMeshMessage('chat_elena', 'Testing mesh hop');
    expect(meshMsg.transport).toBe('NovaMesh (P2P)');
    expect(meshMsg.hopRoute.length).toBeGreaterThan(1);
    expect(meshMsg.rssi).toBeLessThan(0);
  });
});

describe('NovaAI Assistant Engine', () => {
  test('should generate smart reply chips based on keyword triggers', () => {
    const replies = aiService.generateSmartReplies('Can we meet for a video call?');
    expect(replies).toContain('Sure, joining now! 📞');
  });

  test('should summarize conversation thread into key action bullets', async () => {
    const mockMessages = [
      { sender: 'Elena', text: 'E2EE keys verified' },
      { sender: 'Alex', text: 'Deploying mesh router' },
    ];
    const summary = await aiService.summarizeThread(mockMessages);
    expect(summary).toContain('✨ AI Thread Summary');
  });
});
