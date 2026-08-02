import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Users,
  Phone,
  Globe,
  Radio,
  CircleDashed,
  Bot,
  Share2,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

export const SidebarNav = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'chats', label: 'Chats', icon: MessageSquare, badge: 3 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'communities', label: 'Communities', icon: Globe },
    { id: 'channels', label: 'Channels', icon: Radio, badge: 'NEW' },
    { id: 'stories', label: 'Stories', icon: CircleDashed, badge: '●' },
    { id: 'ai', label: 'NovaAI', icon: Bot, isGlow: true },
    { id: 'mesh', label: 'NovaMesh', icon: Share2 },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-16 md:w-20 glass-panel border-r border-white/10 flex flex-col items-center py-4 justify-between z-10">
      {/* Upper Navigation Icons */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative group w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              } ${item.isGlow ? 'border border-cyan-400/30' : ''}`}
            >
              <Icon className={`w-5 h-5 md:w-6 md:h-6 ${item.isGlow && !isActive ? 'text-cyan-400 animate-pulse' : ''}`} />

              {/* Notification Badges */}
              {item.badge && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white border border-slate-900">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on Hover */}
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
