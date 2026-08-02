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

  // Primary Mobile Tabs (select top 5 items for clean mobile bottom bar)
  const mobileNavItems = navItems.filter((i) =>
    ['chats', 'communities', 'channels', 'stories', 'mesh', 'settings'].includes(i.id)
  );

  return (
    <>
      {/* Desktop Vertical Icon Bar */}
      <aside className="hidden md:flex md:w-20 glass-panel border-r border-white/10 flex-col items-center py-4 justify-between z-20">
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative group w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                } ${item.isGlow ? 'border border-cyan-400/30' : ''}`}
              >
                <Icon className={`w-6 h-6 ${item.isGlow && !isActive ? 'text-cyan-400 animate-pulse' : ''}`} />

                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white border border-slate-900">
                    {item.badge}
                  </span>
                )}

                <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile Floating Glass Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B1020]/95 backdrop-blur-2xl border-t border-white/10 z-40 px-3 flex items-center justify-around safe-area-pb shadow-2xl">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-cyan-400 scale-105' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-indigo-600/30 border border-cyan-400/30' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${isActive ? 'font-bold text-white' : 'text-gray-400'}`}>
                {item.label}
              </span>

              {item.badge && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
