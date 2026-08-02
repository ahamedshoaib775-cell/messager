// IndexedDB Storage Layer for NovaLink Persistent Local State

const DB_NAME = 'NovaLinkStorage';
const DB_VERSION = 1;

class LocalStorageService {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        
        if (!db.objectStoreNames.contains('chats')) {
          db.createObjectStore('chats', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('messages')) {
          const msgStore = db.createObjectStore('messages', { keyPath: 'id' });
          msgStore.createIndex('chatId', 'chatId', { unique: false });
        }
        if (!db.objectStoreNames.contains('offlineQueue')) {
          db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error('IndexedDB Error:', e);
        reject(e);
      };
    });
  }

  async clearAllStorage() {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction(['chats', 'messages', 'offlineQueue'], 'readwrite');
      tx.objectStore('chats').clear();
      tx.objectStore('messages').clear();
      tx.objectStore('offlineQueue').clear();
      tx.oncomplete = () => resolve();
    });
  }

  async saveChat(chat) {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('chats', 'readwrite');
      tx.objectStore('chats').put(chat);
      tx.oncomplete = () => resolve(chat);
    });
  }

  async getChats() {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('chats', 'readonly');
      const req = tx.objectStore('chats').getAll();
      req.onsuccess = () => resolve(req.result || []);
    });
  }

  async saveMessage(message) {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('messages', 'readwrite');
      tx.objectStore('messages').put(message);
      tx.oncomplete = () => resolve(message);
    });
  }

  async getMessagesByChat(chatId) {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('messages', 'readonly');
      const store = tx.objectStore('messages');
      const index = store.index('chatId');
      const req = index.getAll(chatId);
      req.onsuccess = () => resolve(req.result || []);
    });
  }

  async enqueueOffline(msg) {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('offlineQueue', 'readwrite');
      tx.objectStore('offlineQueue').add({ message: msg, timestamp: Date.now() });
      tx.oncomplete = () => resolve();
    });
  }

  async getOfflineQueue() {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('offlineQueue', 'readonly');
      const req = tx.objectStore('offlineQueue').getAll();
      req.onsuccess = () => resolve(req.result || []);
    });
  }

  async clearOfflineQueue() {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('offlineQueue', 'readwrite');
      tx.objectStore('offlineQueue').clear();
      tx.oncomplete = () => resolve();
    });
  }
}

export const storageService = new LocalStorageService();
