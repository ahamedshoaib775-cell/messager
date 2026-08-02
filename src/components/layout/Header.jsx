import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wifi,
  WifiOff,
  ShieldCheck,
  Lock,
  Sun,
  Moon,
  Radio,
  Sparkles,
  Zap,
  Activity,
} from 'lucide-react';

export const Header = () => {
  const {
    theme,
    toggleTheme,
    isOfflineMesh,
    toggleOfflineMesh,
    setIsBiometricLocked,
    setE2eeModalOpen,
    setMeshTopologyOpen,
    setAuthModalOpen,
    currentUser,
  } = useApp();

  return (
    <header className="glass-panel h-16 px-6 flex items-center justify-between border-b border-white/10 z-20">
      {/* Brand & App Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse-glow" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg tracking-tight gradient-text">
              NovaLink
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              PRO v2.4
            </span>
          </div>
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className={`status-dot ${isOfflineMesh ? 'p2p' : 'online'}`} />
            {isOfflineMesh ? 'NovaMesh Offline P2P Active' : 'Cloud WebSocket Connected'}
          </p>
        </div>
      </div>

      {/* Center Engine Mode Controls */}
      <div className="flex items-center gap-3">
        {/* Cloud vs Offline Mesh Switcher */}
        <button
          onClick={toggleOfflineMesh}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            isOfflineMesh
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/20'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {isOfflineMesh ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>NovaMesh (Offline P2P)</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span>Cloud Engine (Online)</span>
            </>
          )}
        </button>

        {/* Mesh Router Network Topology Button */}
        <button
          onClick={() => setMeshTopologyOpen(true)}
          className="btn-glass text-xs py-1.5 px-3 flex items-center gap-1.5 hover:text-cyan-400"
          title="NovaMesh Topology Router"
        >
          <Radio className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Mesh Radar</span>
        </button>

        {/* E2EE Security Status */}
        <button
          onClick={() => setE2eeModalOpen(true)}
          className="btn-glass text-xs py-1.5 px-3 flex items-center gap-1.5 hover:text-indigo-400"
          title="End-to-End Encryption Verification"
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="hidden md:inline">E2EE Verified</span>
        </button>
      </div>

      {/* Right Controls (Biometric, Theme, Account) */}
      <div className="flex items-center gap-3">
        {/* Biometric App Lock */}
        <button
          onClick={() => setIsBiometricLocked(true)}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Lock NovaLink (Biometric / PIN)"
        >
          <Lock className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => setAuthModalOpen(true)}
          className="flex items-center gap-2 pl-2 border-l border-white/10"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/50 hover:ring-indigo-400 transition-all"
          />
        </button>
      </div>
    </header>
  );
};
