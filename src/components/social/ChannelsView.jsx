import React from 'react';
import { Radio, Users, ShieldCheck, BellRing, Sparkles } from 'lucide-react';

export const ChannelsView = () => {
  const channels = [
    {
      id: 'chan_1',
      name: '📢 NovaLink Official Announcements',
      subscribers: 24900,
      verified: true,
      lastPost: {
        title: 'NovaLink v2.4 Release Notes',
        text: 'Introducing Zero-Latency Mesh Audio Calling, Web Audio API Sound Synthesizer, IndexedDB Storage, and AI Thread Summaries.',
        time: '2 hours ago',
      },
    },
    {
      id: 'chan_2',
      name: '⚡ NovaMesh Radar & Node Intel',
      subscribers: 18400,
      verified: true,
      lastPost: {
        title: 'Bluetooth LE Hop Optimization',
        text: 'New adaptive packet fragmentation algorithm deployed. Node distance calculation accuracy improved by 35%.',
        time: 'Yesterday',
      },
    },
  ];

  return (
    <div className="flex-1 glass-panel p-6 overflow-y-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" /> Broadcast Channels
          </h2>
          <p className="text-xs text-gray-400">
            One-to-many broadcast channels for real-time announcements, tech bulletins, and network updates.
          </p>
        </div>
        <button className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
          Create Channel
        </button>
      </div>

      <div className="space-y-4">
        {channels.map((chan) => (
          <div key={chan.id} className="glass-card p-6 border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-100 flex items-center gap-1.5">
                    {chan.name}
                    {chan.verified && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {chan.subscribers.toLocaleString()} Subscribers
                  </span>
                </div>
              </div>
              <button className="btn-glass text-xs py-1.5 px-3 flex items-center gap-1.5 text-cyan-300">
                <BellRing className="w-3.5 h-3.5" /> Subscribed
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-xs text-cyan-300">{chan.lastPost.title}</h4>
                <span className="text-[10px] text-gray-400">{chan.lastPost.time}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{chan.lastPost.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
