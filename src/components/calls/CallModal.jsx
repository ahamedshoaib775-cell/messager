import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  Sparkles,
  ShieldCheck,
  Volume2,
  Maximize2,
} from 'lucide-react';

export const CallModal = () => {
  const { activeCall, endCall } = useApp();
  const [isMuted, setIsMuted] = useState(activeCall?.isMuted || false);
  const [isVideoOff, setIsVideoOff] = useState(activeCall?.isVideoOff || false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!activeCall) return null;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const partnerName = activeCall.user.name || activeCall.user;
  const partnerAvatar =
    activeCall.user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-float">
      <div className="w-full max-w-4xl glass-panel border border-white/20 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        {/* Call Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm text-gray-100 flex items-center gap-2">
                NovaLink HD {activeCall.type === 'video' ? 'Video Call' : 'Voice Call'}
                <ShieldCheck className="w-4 h-4 text-indigo-400" title="WebRTC E2EE Direct Stream" />
              </h3>
              <p className="text-[11px] text-gray-400">
                Peer: {partnerName} • WebRTC 1080p60 • Latency 14ms
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold text-cyan-300">
            {formatDuration(callDuration)}
          </div>
        </div>

        {/* Video / Audio Main Canvas Stream Display */}
        <div className="relative flex-1 min-h-[380px] bg-slate-900 flex items-center justify-center p-6">
          {activeCall.type === 'video' && !isVideoOff ? (
            <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-gradient-to-br from-indigo-950/50 to-slate-950/80">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80"
                alt="Partner Video Stream"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/50 backdrop-blur text-xs font-semibold text-white flex items-center gap-2">
                <span>{partnerName}</span>
                <span className="text-[10px] text-emerald-400 font-normal">HD Live</span>
              </div>

              {/* Self Pip Camera Preview */}
              <div className="absolute bottom-4 right-4 w-36 h-24 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-2xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                  alt="Your Video"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            /* Voice Audio Call View */
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <img
                  src={partnerAvatar}
                  alt={partnerName}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-indigo-500/40 shadow-2xl animate-pulse-glow"
                />
                <span className="absolute bottom-1 right-1 p-2 rounded-full bg-indigo-600 text-white">
                  <Volume2 className="w-5 h-5 animate-bounce" />
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-100">{partnerName}</h2>
              <p className="text-xs text-indigo-300">AI Noise Suppression Active</p>
            </div>
          )}
        </div>

        {/* In-Call Controls Toolbar */}
        <div className="p-6 border-t border-white/10 glass-panel flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-2xl transition-all ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'btn-glass text-gray-200 hover:text-white'
            }`}
            title="Toggle Mute"
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {activeCall.type === 'video' && (
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-4 rounded-2xl transition-all ${
                isVideoOff
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'btn-glass text-gray-200 hover:text-white'
              }`}
              title="Toggle Camera"
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-2xl transition-all ${
              isScreenSharing
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'btn-glass text-gray-200 hover:text-white'
            }`}
            title="Share Screen"
          >
            <Monitor className="w-6 h-6" />
          </button>

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 transition-all hover:scale-105"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
