import React from 'react';
import { Globe, Users, Hash, ShieldCheck, Plus, ChevronRight } from 'lucide-react';

export const CommunitiesView = () => {
  const communities = [
    {
      id: 'comm_1',
      name: 'Global Mesh Infrastructure Hub',
      desc: 'Architecting decentralized P2P routing protocols, Bluetooth LE range extenders, and offline disaster response networks.',
      members: 14200,
      avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
      channels: ['#announcements', '#ble-mesh-core', '#wifi-direct-bridge', '#hardware-nodes'],
    },
    {
      id: 'comm_2',
      name: 'E2EE Cryptography & Signal Labs',
      desc: 'Research group dedicated to Double Ratchet key exchanges, post-quantum cryptography, and Zero-Knowledge proofs.',
      members: 8900,
      avatar: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80',
      channels: ['#key-verification', '#signal-protocol', '#quantum-shield'],
    },
  ];

  return (
    <div className="flex-1 glass-panel p-6 overflow-y-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-400" />
            NovaLink Communities
          </h2>
          <p className="text-xs text-gray-400">
            Multi-channel spaces connecting developers, researchers, and global mesh operators.
          </p>
        </div>
        <button className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Community
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((comm) => (
          <div key={comm.id} className="glass-card p-6 border-indigo-500/20 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={comm.avatar}
                  alt={comm.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <h3 className="font-bold text-base text-gray-100 flex items-center gap-1.5">
                    {comm.name}
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </h3>
                  <p className="text-xs text-indigo-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {comm.members.toLocaleString()} Active Members
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">{comm.desc}</p>

              {/* Channels List */}
              <div className="space-y-1.5 mb-6">
                {comm.channels.map((chan, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 hover:bg-white/10 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-mono">
                      <Hash className="w-3.5 h-3.5 text-indigo-400" /> {chan}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full btn-glass text-xs py-2 flex items-center justify-center gap-2 hover:text-indigo-300">
              Join Workspace Community
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
