import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Pin, ShieldCheck, Signal, Plus, UserPlus, MessageSquare } from 'lucide-react';

export const ChatSidebar = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    setNewContactModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage && chat.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMode === 'unread') return chat.unreadCount > 0;
    if (filterMode === 'groups') return chat.type === 'group';
    if (filterMode === 'mesh') return chat.meshConnected;
    if (filterMode === 'channels') return chat.type === 'channel';
    return true;
  });

  return (
    <aside className={`w-full md:w-96 glass-panel border-r border-white/10 flex flex-col h-full z-10 ${
      activeChatId ? 'hidden md:flex' : 'flex'
    }`}>
      {/* Header & Search */}
      <div className="p-4 border-b border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            Messages
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-normal">
              {chats.length}
            </span>
          </h2>
          <button
            onClick={() => setNewContactModalOpen(true)}
            className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/20"
            title="Add New Contact"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts, messages or handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-9 text-xs py-2"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {['all', 'unread', 'groups', 'mesh', 'channels'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize whitespace-nowrap transition-all ${
                filterMode === mode
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {mode === 'mesh' ? '⚡ NovaMesh' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List or Clean Empty State */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3 h-64 text-gray-400">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 border border-white/10">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-200">No Conversations Yet</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Your contact list is completely clean. Click below to start a new chat.
              </p>
            </div>
            <button
              onClick={() => setNewContactModalOpen(true)}
              className="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" /> Add New Contact
            </button>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isActive = activeChatId === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-transparent border-l-4 border-indigo-500'
                    : 'hover:bg-white/5'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/10"
                  />
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 status-dot online ring-2 ring-slate-900" />
                  )}
                  {chat.meshConnected && (
                    <span className="absolute -top-1 -left-1 p-0.5 bg-blue-600 rounded-full text-white" title="Connected over NovaMesh P2P">
                      <Signal className="w-3 h-3 animate-pulse" />
                    </span>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm text-gray-100 truncate flex items-center gap-1.5">
                      {chat.name}
                      {chat.e2eeVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" title="Signal E2EE Verified" />
                      )}
                    </h3>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {chat.lastMessage ? chat.lastMessage.time : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 truncate pr-2">
                      {chat.lastMessage ? chat.lastMessage.text : 'No messages yet'}
                    </p>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {chat.pinned && <Pin className="w-3 h-3 text-amber-400 rotate-45" />}
                      {chat.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-indigo-600/50">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
