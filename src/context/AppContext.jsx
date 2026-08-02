import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER, INITIAL_CHATS, INITIAL_MESSAGES, INITIAL_STORIES, INITIAL_CALLS } from '../utils/dummyData';
import { storageService } from '../services/storage';
import { cryptoService } from '../services/cryptoService';
import { novaMeshEngine } from '../services/novamesh';
import { aiService } from '../services/aiService';
import { soundEngine } from '../utils/soundEngine';
import { apiClient } from '../services/apiClient';
import { socketService } from '../services/socketService';
import { webrtcService } from '../services/webrtcService';
import { supabaseAuthService } from '../services/supabase/authService';
import { supabaseChatService } from '../services/supabase/chatService';
import { supabasePresenceService } from '../services/supabase/presenceService';
import { supabaseStorageService } from '../services/supabase/storageService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [isOfflineMesh, setIsOfflineMesh] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');
  const [activeChatId, setActiveChatId] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(INITIAL_USER);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [stories, setStories] = useState(INITIAL_STORIES);
  const [calls, setCalls] = useState(INITIAL_CALLS);
  
  // Modals & Active UI Overlays
  const [activeCall, setActiveCall] = useState(null);
  const [isBiometricLocked, setIsBiometricLocked] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [e2eeModalOpen, setE2eeModalOpen] = useState(false);
  const [meshTopologyOpen, setMeshTopologyOpen] = useState(false);
  const [activeStoryView, setActiveStoryView] = useState(null);
  const [newContactModalOpen, setNewContactModalOpen] = useState(false);

  // Clear Existing User & Reset Local Storage / IndexedDB
  const clearUserSession = async () => {
    await supabaseAuthService.logout();
    localStorage.removeItem('novalink_token');
    apiClient.setToken(null);
    await storageService.clearAllStorage();

    setChats([]);
    setMessages({});
    setActiveChatId(null);

    setCurrentUser({
      id: 'user_' + Date.now(),
      name: 'Guest User',
      username: '@guest',
      phone: '',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'New NovaLink User',
      statusEmoji: '👋',
      statusText: 'Ready to connect',
      isVerified: false,
      e2eeFingerprint: '00000 00000 00000 00000 00000 00000',
      devices: [],
    });

    setAuthModalOpen(true);
  };

  // Add New Contact & Start Conversation
  const addNewContact = (name, username) => {
    const newChatId = 'chat_' + Date.now();
    const newChat = {
      id: newChatId,
      name,
      username: username.startsWith('@') ? username : `@${username}`,
      type: 'direct',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      isOnline: true,
      lastSeen: 'Online',
      meshConnected: isOfflineMesh,
      rssi: -52,
      unreadCount: 0,
      pinned: false,
      disappearingTimer: 'off',
      e2eeVerified: true,
      lastMessage: {
        text: 'Encrypted conversation started.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'System',
        status: 'read',
      },
    };

    setChats((prev) => [newChat, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newChatId]: [
        {
          id: 'm_' + Date.now(),
          chatId: newChatId,
          text: `🔒 End-to-End Encrypted conversation established with ${name}.`,
          sender: 'System',
          isMe: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true,
        },
      ],
    }));

    setActiveChatId(newChatId);
    storageService.saveChat(newChat);
    setNewContactModalOpen(false);
    soundEngine.playMeshDiscover();
  };

  // Restore Supabase Auth Session & Connect Realtime
  useEffect(() => {
    supabaseAuthService.getCurrentSession().then((sessionRes) => {
      if (sessionRes && sessionRes.user) {
        setCurrentUser({
          id: sessionRes.user.id,
          name: sessionRes.user.fullname || sessionRes.user.email?.split('@')[0] || 'Alex Vance',
          username: sessionRes.user.username || '@alex_vance',
          email: sessionRes.user.email,
          avatar: sessionRes.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          bio: sessionRes.user.bio || 'Connected via Supabase Auth & Realtime',
          statusEmoji: '⚡',
          statusText: 'Online',
          isVerified: true,
        });
      }
    });

    // Initialize Local Persistent Storage
    storageService.init().then(async () => {
      const savedChats = await storageService.getChats();
      if (savedChats && savedChats.length > 0) {
        const cleanChats = savedChats.filter((c) => c.id !== 'chat_elena' && c.id !== 'chat_marcus');
        setChats(cleanChats);
        if (cleanChats.length > 0) {
          setActiveChatId(cleanChats[0].id);
        }
      }
    });

    // Subscribe to Supabase Presence Engine
    const unsubscribePresence = supabasePresenceService.subscribePresence(
      currentUser.id || 'user_me',
      (presenceState) => {
        // Updated online presence from Supabase channel
      }
    );

    // Connect WebSockets Fallback Gateway
    socketService.connect();

    // Listen for Real-Time Messages over WebSocket & Supabase Realtime
    socketService.on('message:receive', (incomingMsg) => {
      soundEngine.playReceive();
      setMessages((prev) => ({
        ...prev,
        [incomingMsg.chatId]: [...(prev[incomingMsg.chatId] || []), incomingMsg],
      }));
    });

    // Listen for Incoming Calls
    socketService.on('call:incoming', (callData) => {
      soundEngine.playCallRingtone();
      setActiveCall({
        user: callData.caller || 'Contact',
        type: callData.type || 'video',
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
      });
    });

    // Listen for NovaMesh Offline P2P Events
    const unsubscribeMesh = novaMeshEngine.subscribe((eventData) => {
      if (eventData.type === 'MESH_MESSAGE') {
        handleIncomingMeshMessage(eventData);
      } else if (eventData.type === 'EMERGENCY_SOS_BROADCAST') {
        soundEngine.playSOSAlert();
        alert(`🚨 EMERGENCY SOS BROADCAST: ${eventData.alertText}`);
      }
    });

    return () => {
      unsubscribeMesh();
      if (unsubscribePresence) unsubscribePresence();
    };
  }, []);

  // Subscribe to Realtime Messages whenever activeChatId changes
  useEffect(() => {
    if (!activeChatId) return;

    const unsubscribeRealtime = supabaseChatService.subscribeToMessages(
      activeChatId,
      (newMsgPayload) => {
        soundEngine.playReceive();
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: [
            ...(prev[activeChatId] || []),
            {
              id: newMsgPayload.id,
              chatId: newMsgPayload.conversation_id,
              text: newMsgPayload.text_content,
              sender: newMsgPayload.sender_id,
              isMe: newMsgPayload.sender_id === currentUser.id,
              timestamp: new Date(newMsgPayload.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: newMsgPayload.status,
            },
          ],
        }));
      }
    );

    return () => {
      if (unsubscribeRealtime) unsubscribeRealtime();
    };
  }, [activeChatId]);

  // Theme effect on HTML document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleOfflineMesh = () => {
    const nextState = !isOfflineMesh;
    setIsOfflineMesh(nextState);
    novaMeshEngine.setOfflineMode(nextState);
    soundEngine.playMeshDiscover();
  };

  const handleIncomingMeshMessage = (meshData) => {
    soundEngine.playReceive();
    const targetChatId = meshData.chatId || activeChatId;
    if (!targetChatId) return;

    const newMsg = {
      id: meshData.id,
      chatId: targetChatId,
      text: meshData.text,
      sender: meshData.sender || 'Mesh Peer',
      isMe: false,
      timestamp: meshData.timestamp,
      status: 'delivered',
      isMesh: true,
      transport: meshData.transport,
    };

    setMessages((prev) => ({
      ...prev,
      [targetChatId]: [...(prev[targetChatId] || []), newMsg],
    }));
  };

  const sendMessage = async (chatId, text, attachment = null) => {
    if (!chatId || (!text.trim() && !attachment)) return;

    soundEngine.playSend();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const encrypted = cryptoService.encryptPayload(text);

    const newMsg = {
      id: 'msg_' + Date.now(),
      chatId,
      text,
      sender: currentUser.name,
      isMe: true,
      timestamp,
      status: isOfflineMesh ? 'pending' : 'read',
      isMesh: isOfflineMesh,
      attachment,
      encryptedCipher: encrypted.ciphertext,
    };

    // Update Local State
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));

    // Update Last Message in Chat list
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: {
                text: text || (attachment ? `Sent ${attachment.type}` : ''),
                time: timestamp,
                sender: 'You',
                status: 'read',
              },
            }
          : c
      )
    );

    // Save to Local Persistent IndexedDB Store
    await storageService.saveMessage(newMsg);

    if (isOfflineMesh) {
      // Dispatch over NovaMesh P2P Radio channel
      novaMeshEngine.sendMeshMessage(chatId, text, attachment);
      await storageService.enqueueOffline(newMsg);
    } else {
      // Dispatch over Supabase Database & Realtime Channel
      await supabaseChatService.sendMessage({
        conversationId: chatId,
        senderId: currentUser.id,
        textContent: text,
        encryptedCipher: encrypted.ciphertext,
        mediaUrl: attachment?.url,
      });

      // Dispatch over WebSockets Gateway
      socketService.sendMessage(newMsg);
      apiClient.sendMessage(chatId, text, attachment);
    }
  };

  const addReaction = (chatId, messageId, emoji) => {
    setMessages((prev) => {
      const chatMsgs = prev[chatId] || [];
      const updated = chatMsgs.map((m) => {
        if (m.id === messageId) {
          const reactions = { ...(m.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...m, reactions };
        }
        return m;
      });
      return { ...prev, [chatId]: updated };
    });

    supabaseChatService.addReaction(messageId, currentUser.id, emoji);
  };

  const startCall = async (user, type = 'video') => {
    soundEngine.playCallRingtone();
    await webrtcService.startLocalMedia(type === 'video', true);

    setActiveCall({
      user,
      type,
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
      backgroundBlur: true,
      noiseCancellation: true,
      startTime: Date.now(),
    });
  };

  const endCall = () => {
    if (activeCall) {
      webrtcService.endCall();
      const duration = '0m 45s';
      setCalls((prev) => [
        {
          id: 'call_' + Date.now(),
          user: activeCall.user?.name || activeCall.user,
          avatar: activeCall.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          type: activeCall.type,
          direction: 'outgoing',
          duration,
          timestamp: 'Just now',
        },
        ...prev,
      ]);
      setActiveCall(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isOfflineMesh,
        toggleOfflineMesh,
        activeTab,
        setActiveTab,
        activeChatId,
        setActiveChatId,
        currentUser,
        setCurrentUser,
        clearUserSession,
        addNewContact,
        chats,
        setChats,
        messages,
        stories,
        calls,
        sendMessage,
        addReaction,
        activeCall,
        startCall,
        endCall,
        isBiometricLocked,
        setIsBiometricLocked,
        authModalOpen,
        setAuthModalOpen,
        e2eeModalOpen,
        setE2eeModalOpen,
        meshTopologyOpen,
        setMeshTopologyOpen,
        activeStoryView,
        setActiveStoryView,
        newContactModalOpen,
        setNewContactModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
