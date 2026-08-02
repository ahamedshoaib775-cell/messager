import React, { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Users,
  ShieldAlert,
  Server,
  Send,
  Radio,
  BarChart3,
  CheckCircle,
  AlertOctagon,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [broadcastText, setBroadcastText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const stats = [
    { label: 'Active WebSocket Sockets', value: '14,892', change: '+12% this hour', icon: Activity, color: 'text-indigo-400' },
    { label: 'NovaMesh P2P Active Nodes', value: '3,410', change: 'Mesh hop latency 14ms', icon: Radio, color: 'text-cyan-400' },
    { label: 'Server CPU / Memory Load', value: '28% / 4.2GB', change: '8 Docker Containers Healthy', icon: Server, color: 'text-emerald-400' },
    { label: 'Spam & Scam Flags', value: '4 Flagged', change: 'AI Risk Engine Active', icon: ShieldAlert, color: 'text-amber-400' },
  ];

  const handleGlobalBroadcast = () => {
    if (!broadcastText.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setBroadcastText('');
    }, 3000);
  };

  return (
    <div className="flex-1 glass-panel p-6 overflow-y-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
            NovaLink Admin & Infrastructure Telemetry
          </h2>
          <p className="text-xs text-gray-400">
            Real-time server monitoring, active P2P mesh graph, user moderation, and global announcement control.
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
          <span className="status-dot online" /> All Systems Nominal
        </span>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="glass-card p-4 border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">{s.label}</span>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-white mb-1 font-mono">{s.value}</div>
              <span className="text-[10px] text-gray-400 font-medium">{s.change}</span>
            </div>
          );
        })}
      </div>

      {/* Global System Broadcast Sender */}
      <div className="glass-card p-6 border-indigo-500/30">
        <h3 className="font-bold text-sm text-gray-100 flex items-center gap-2 mb-2">
          <Send className="w-4 h-4 text-indigo-400" /> System-Wide Announcement Broadcast
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Sends high-priority system pop-up banner to all active cloud WebSockets and NovaMesh P2P nodes.
        </p>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type announcement message (e.g. Scheduled Maintenance or New Feature Update)..."
            value={broadcastText}
            onChange={(e) => setBroadcastText(e.target.value)}
            className="flex-1 glass-input text-xs py-2.5"
          />
          <button
            onClick={handleGlobalBroadcast}
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 whitespace-nowrap"
          >
            {sentSuccess ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {sentSuccess ? 'Broadcast Dispatched!' : 'Broadcast to All Users'}
          </button>
        </div>
      </div>

      {/* Content Moderation Queue */}
      <div className="glass-card p-6 border-white/10">
        <h3 className="font-bold text-sm text-gray-100 flex items-center gap-2 mb-4">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> AI Moderation & Flagged Report Queue
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-white/5 border border-amber-500/30 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-amber-300">Flagged for Credential Harvesting</span>
              <p className="text-gray-300 text-[11px] mt-0.5">"Please enter your OTP code to claim 500 Nova tokens..."</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px]">
                Ban User
              </button>
              <button className="px-3 py-1 rounded-lg bg-white/10 text-gray-300 font-bold text-[10px]">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
