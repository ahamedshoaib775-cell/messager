import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { soundEngine } from '../../utils/soundEngine';
import { PollWidget } from './PollWidget';
import { SharedNoteWidget } from './SharedNoteWidget';
import {
  Phone,
  Video,
  ShieldCheck,
  MoreVertical,
  Paperclip,
  Mic,
  Send,
  Pin,
  CheckCheck,
  Check,
  Sparkles,
  Volume2,
  Languages,
  FileText,
  Vote,
  Image as ImageIcon,
  MapPin,
  X,
  Bot,
  MessageSquare,
  UserPlus,
  Zap,
} from 'lucide-react';

export const ChatWindow = () => {
  const {
    activeChatId,
    chats,
    messages,
    sendMessage,
    addReaction,
    startCall,
    isOfflineMesh,
    setE2eeModalOpen,
    setNewContactModalOpen,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [smartReplies, setSmartReplies] = useState([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState('');
  const [translatedMessages, setTranslatedMessages] = useState({});

  const chat = chats.find((c) => c.id === activeChatId);
  const currentMessages = activeChatId ? messages[activeChatId] || [] : [];
  const messagesEndRef = useRef(null);

  // Clean empty state if no chat selected or contact list empty
  if (!chat || !activeChatId) {
    return (
      <main className="flex-1 flex flex-col h-full glass-panel relative overflow-hidden items-center justify-center p-8 text-center">
        <div className="max-w-md flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[2px] shadow-2xl shadow-indigo-500/30 animate-float">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Zap className="w-10 h-10 text-cyan-400" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white mb-2 gradient-text">
              Welcome to NovaLink
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your workspace is completely clean. Start a new E2EE encrypted conversation or toggle NovaMesh for offline P2P communication.
            </p>
          </div>

          <button
            onClick={() => setNewContactModalOpen(true)}
            className="btn-primary text-xs py-3 px-6 rounded-xl font-bold flex items-center gap-2 mt-2"
          >
            <UserPlus className="w-4 h-4" /> Add New Contact
          </button>
        </div>
      </main>
    );
  }

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (currentMessages.length > 0) {
      const lastMsg = currentMessages[currentMessages.length - 1];
      if (!lastMsg.isMe && !lastMsg.isSystem) {
        setSmartReplies(aiService.generateSmartReplies(lastMsg.text));
      } else {
        setSmartReplies([]);
      }
    }
  }, [currentMessages, activeChatId]);

  // Voice note timer effect
  useEffect(() => {
    let interval;
    if (isRecordingVoice) {
      interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(activeChatId, inputText);
    setInputText('');
    setSmartReplies([]);
  };

  const handleSendVoiceNote = () => {
    setIsRecordingVoice(false);
    sendMessage(activeChatId, '', {
      type: 'voice',
      duration: `${recordingTime}s`,
      waveform: [30, 55, 80, 45, 90, 60, 35, 75, 40],
    });
  };

  const handleTranslate = async (msgId, text) => {
    const translated = await aiService.translateMessage(text, 'es');
    setTranslatedMessages((prev) => ({ ...prev, [msgId]: translated }));
  };

  const handleSummarizeThread = async () => {
    const summary = await aiService.summarizeThread(currentMessages);
    setAiSummaryText(summary);
    setShowAiSummary(true);
  };

  const handleSendPoll = () => {
    setShowAttachMenu(false);
    sendMessage(activeChatId, '📊 Created a new NovaLink Poll');
  };

  const handleSendNote = () => {
    setShowAttachMenu(false);
    sendMessage(activeChatId, '📝 Attached a Collaborative Canvas Note');
  };

  return (
    <main className="flex-1 flex flex-col h-full glass-panel relative overflow-hidden">
      {/* Top Header */}
      <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between z-10 glass-panel">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-2xl object-cover ring-1 ring-white/20"
            />
            {chat.isOnline && (
              <span className="absolute bottom-0 right-0 status-dot online ring-2 ring-slate-900" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-gray-100">{chat.name}</h3>
              {chat.e2eeVerified && (
                <button onClick={() => setE2eeModalOpen(true)}>
                  <ShieldCheck className="w-4 h-4 text-indigo-400" title="E2EE Fingerprint Key Verified" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              {isOfflineMesh ? '📶 Connected via NovaMesh Hop' : chat.lastSeen}
            </p>
          </div>
        </div>

        {/* Header Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSummarizeThread}
            className="btn-glass text-xs py-1.5 px-3 flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300"
            title="Summarize Chat Thread with NovaAI"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Summary</span>
          </button>

          <button
            onClick={() => startCall(chat, 'audio')}
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Start HD Voice Call"
          >
            <Phone className="w-5 h-5 text-indigo-400" />
          </button>
          <button
            onClick={() => startCall(chat, 'video')}
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Start HD Video Call"
          >
            <Video className="w-5 h-5 text-cyan-400" />
          </button>
          <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AI Thread Summary Modal Drawer */}
      {showAiSummary && (
        <div className="p-4 m-4 glass-card border border-cyan-400/40 relative animate-float">
          <button
            onClick={() => setShowAiSummary(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-xs">
            <Bot className="w-4 h-4" />
            NovaAI Instant Thread Summary
          </div>
          <pre className="text-xs text-gray-200 font-sans whitespace-pre-wrap leading-relaxed">
            {aiSummaryText}
          </pre>
        </div>
      )}

      {/* Message Thread List Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {currentMessages.map((msg) => {
          const isMe = msg.isMe;

          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="text-[11px] px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 group`}
            >
              <div
                className={`max-w-[75%] md:max-w-[60%] p-3.5 rounded-2xl relative shadow-md transition-all ${
                  isMe
                    ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-br-none shadow-indigo-600/20'
                    : 'glass-card text-gray-100 rounded-bl-none border-white/10'
                }`}
              >
                <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap select-text">
                  {msg.text}
                </p>

                {translatedMessages[msg.id] && (
                  <div className="mt-2 pt-2 border-t border-white/20 text-xs italic text-cyan-200">
                    🌐 {translatedMessages[msg.id]}
                  </div>
                )}

                {msg.attachment?.type === 'voice' && (
                  <div className="my-2 p-2 rounded-xl bg-slate-900/50 flex items-center gap-3 w-64 border border-white/10">
                    <button
                      onClick={() => soundEngine.playReceive()}
                      className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center"
                    >
                      ▶
                    </button>
                    <div className="flex-1 flex items-center gap-1">
                      {msg.attachment.waveform.map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-indigo-400 rounded-full animate-pulse"
                          style={{ height: `${h / 3}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-gray-300">
                      {msg.attachment.duration}
                    </span>
                  </div>
                )}

                {msg.poll && <PollWidget poll={msg.poll} />}
                {msg.text.includes('Collaborative Canvas Note') && <SharedNoteWidget />}

                <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[10px] opacity-75">
                  {msg.isMesh && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 font-semibold" title="NovaMesh P2P">
                      NovaMesh
                    </span>
                  )}
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-cyan-300 inline" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-gray-300 inline" />
                      )}
                    </span>
                  )}
                </div>

                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="absolute -bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-xs shadow-lg">
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <span key={emoji}>
                        {emoji} {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity pt-0.5 px-2">
                <button
                  onClick={() => addReaction(activeChatId, msg.id, '❤️')}
                  className="text-xs hover:scale-125 transition-transform"
                >
                  ❤️
                </button>
                <button
                  onClick={() => addReaction(activeChatId, msg.id, '🔥')}
                  className="text-xs hover:scale-125 transition-transform"
                >
                  🔥
                </button>
                <button
                  onClick={() => handleTranslate(msg.id, msg.text)}
                  className="p-1 rounded text-gray-400 hover:text-cyan-400"
                  title="Translate with NovaAI"
                >
                  <Languages className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => aiService.speakText(msg.text)}
                  className="p-1 rounded text-gray-400 hover:text-indigo-400"
                  title="Listen (Text-to-Speech)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Smart Reply Suggestions */}
      {smartReplies.length > 0 && (
        <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar z-10">
          <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Smart Reply:
          </span>
          {smartReplies.map((chip, i) => (
            <button
              key={i}
              onClick={() => sendMessage(activeChatId, chip)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-indigo-600 hover:text-white text-gray-200 border border-white/10 transition-all whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Popover Menu */}
      {showAttachMenu && (
        <div className="absolute bottom-20 left-6 p-3 glass-card border border-white/20 rounded-2xl flex items-center gap-3 shadow-2xl z-50 animate-float">
          <button
            onClick={handleSendPoll}
            className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-xl text-indigo-400"
          >
            <Vote className="w-5 h-5" />
            <span className="text-[10px]">Create Poll</span>
          </button>
          <button
            onClick={handleSendNote}
            className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-xl text-cyan-400"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px]">Shared Canvas</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-xl text-emerald-400">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px]">HD Photo</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-xl text-amber-400">
            <MapPin className="w-5 h-5" />
            <span className="text-[10px]">Live Map</span>
          </button>
        </div>
      )}

      {/* Bottom Message Input Box */}
      <div className="p-4 border-t border-white/10 glass-panel flex items-center gap-3 z-10">
        <button
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className={`p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors ${
            showAttachMenu ? 'bg-indigo-600 text-white' : 'hover:bg-white/10'
          }`}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {isRecordingVoice ? (
          <div className="flex-1 glass-input flex items-center justify-between border-rose-500/50">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono text-rose-300">
                Recording Voice Note... ({recordingTime}s)
              </span>
            </div>
            <button
              onClick={handleSendVoiceNote}
              className="text-xs px-3 py-1 rounded-lg bg-rose-600 text-white font-bold"
            >
              Send Voice
            </button>
          </div>
        ) : (
          <input
            type="text"
            placeholder={
              isOfflineMesh
                ? 'Type message (NovaMesh P2P fallback active)...'
                : 'Type an encrypted message...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 glass-input text-xs py-3"
          />
        )}

        {inputText.trim() ? (
          <button
            onClick={handleSend}
            className="btn-primary p-3 rounded-xl shadow-lg shadow-indigo-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setIsRecordingVoice(!isRecordingVoice)}
            className={`p-3 rounded-xl transition-all ${
              isRecordingVoice
                ? 'bg-rose-600 text-white animate-pulse'
                : 'btn-glass text-gray-400 hover:text-white'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </main>
  );
};
