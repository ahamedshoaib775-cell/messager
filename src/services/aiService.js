// NovaAI Assistant Engine for Translation, Summarization, Voice & Smart Replies

const TRANSLATION_MAP = {
  es: {
    'Hello! How are you doing?': '¡Hola! ¿Cómo estás?',
    'The project presentation is ready for review.': 'La presentación del proyecto está lista para revisión.',
    'Let us connect over NovaMesh offline link.': 'Conectémonos a través del enlace fuera de línea NovaMesh.',
  },
  fr: {
    'Hello! How are you doing?': 'Bonjour! Comment allez-vous?',
    'The project presentation is ready for review.': 'La présentation du projet est prête à être examinée.',
    'Let us connect over NovaMesh offline link.': 'Connectons-nous via le lien hors ligne NovaMesh.',
  },
  de: {
    'Hello! How are you doing?': 'Hallo! Wie geht es dir?',
    'The project presentation is ready for review.': 'Die Projektpräsentation steht zur Überprüfung bereit.',
  },
  ja: {
    'Hello! How are you doing?': 'こんにちは！お元気ですか？',
    'The project presentation is ready for review.': 'プロジェクトのプレゼンテーションの準備ができました。',
  },
  hi: {
    'Hello! How are you doing?': 'नमस्ते! आप कैसे हैं?',
    'The project presentation is ready for review.': 'प्रोजेक्ट प्रस्तुति समीक्षा के लिए तैयार है।',
  },
};

class AIService {
  // Translate message text to target language
  async translateMessage(text, targetLang = 'es') {
    await new Promise((res) => setTimeout(res, 400));
    if (TRANSLATION_MAP[targetLang] && TRANSLATION_MAP[targetLang][text]) {
      return TRANSLATION_MAP[targetLang][text];
    }
    return `[Translated (${targetLang.toUpperCase()})]: ${text}`;
  }

  // Generate 3 smart reply suggestions based on input context
  generateSmartReplies(lastMessageText = '') {
    const lower = lastMessageText.toLowerCase();
    if (lower.includes('call') || lower.includes('meet')) {
      return ['Sure, joining now! 📞', 'Give me 5 mins ⏳', 'Can we meet later? 📅'];
    }
    if (lower.includes('mesh') || lower.includes('offline')) {
      return ['Switching to NovaMesh! 📶', 'Node RSSI is strong ⚡', 'Syncing offline queue 🔄'];
    }
    if (lower.includes('file') || lower.includes('pdf') || lower.includes('doc')) {
      return ['Downloading now 📥', 'Looks good to me! 👍', 'Please send revision 📝'];
    }
    return ['Sounds great! 👍', 'Thanks for the update! 🙌', 'Let me check on that 🔍'];
  }

  // Summarize chat conversation thread into key action items
  async summarizeThread(messages = []) {
    await new Promise((res) => setTimeout(res, 600));
    if (messages.length === 0) return 'No messages to summarize.';

    return `✨ AI Thread Summary (${messages.length} messages):
• Key Topic: Project milestones and NovaMesh deployment.
• Action Item 1: Elena verified E2EE Signal protocol identity keys.
• Action Item 2: P2P offline mesh bridge tested with zero loss.
• Decision: Launch full release sprint.`;
  }

  // Text to speech reader using browser SpeechSynthesis
  speakText(text) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Spam & Scam Risk Analysis
  detectSpamRisk(text = '') {
    const lower = text.toLowerCase();
    if (lower.includes('otp') || lower.includes('password') || lower.includes('bank') || lower.includes('claim prize')) {
      return { isSpam: true, riskScore: 85, reason: 'Contains security credential request or suspicious incentive.' };
    }
    return { isSpam: false, riskScore: 5, reason: 'Clean' };
  }
}

export const aiService = new AIService();
