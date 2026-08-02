import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, X, ShieldCheck, Sparkles } from 'lucide-react';

export const NewContactModal = () => {
  const { newContactModalOpen, setNewContactModalOpen, addNewContact } = useApp();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  if (!newContactModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addNewContact(name.trim(), username.trim() || `@${name.toLowerCase().replace(/\s+/g, '_')}`);
    setName('');
    setUsername('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-float">
      <div className="w-full max-w-md glass-panel border border-indigo-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-100">Add New Contact</h3>
          </div>
          <button onClick={() => setNewContactModalOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-300 font-semibold mb-1 block">Full Name or Alias</label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full glass-input text-xs py-2.5"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 font-semibold mb-1 block">Username or Phone Handle</label>
            <input
              type="text"
              placeholder="e.g. @sarah_j"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full glass-input text-xs py-2.5"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>End-to-End Encrypted Signal identity keys will be generated automatically.</span>
          </div>

          <button type="submit" className="w-full btn-primary py-3 rounded-xl justify-center font-bold mt-2">
            Start Encrypted Chat
          </button>
        </form>
      </div>
    </div>
  );
};
