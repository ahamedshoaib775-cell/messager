import React from 'react';
import { useApp } from '../../context/AppContext';
import { cryptoService } from '../../services/cryptoService';
import {
  ShieldCheck,
  Lock,
  Moon,
  Volume2,
  Smartphone,
  CheckCircle2,
  X,
  Key,
} from 'lucide-react';

export const SettingsModal = () => {
  const { e2eeModalOpen, setE2eeModalOpen, currentUser } = useApp();

  if (!e2eeModalOpen) return null;

  const fingerprint = cryptoService.getFingerprint();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-float">
      <div className="w-full max-w-lg glass-panel border border-indigo-500/40 rounded-3xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-100">Signal E2EE Security Keys</h3>
              <p className="text-xs text-gray-400">Signal Double Ratchet Protocol Verification</p>
            </div>
          </div>
          <button onClick={() => setE2eeModalOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fingerprint Matrix */}
        <div className="glass-card p-5 border-indigo-500/30 mb-6 text-center">
          <span className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider block mb-2">
            Safety Code Fingerprint
          </span>
          <div className="font-mono text-base font-bold text-white tracking-widest bg-slate-950/80 p-3 rounded-xl border border-white/10 select-all">
            {fingerprint}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Compare this 30-digit safety fingerprint with your recipient to verify zero man-in-the-middle tampering.
          </p>
        </div>

        {/* Active Devices */}
        <div className="mb-4">
          <h4 className="font-bold text-xs text-gray-200 mb-2 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" /> Active Session Devices ({currentUser.devices.length})
          </h4>
          <div className="space-y-2">
            {currentUser.devices.map((dev) => (
              <div
                key={dev.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-gray-100 flex items-center gap-2">
                    {dev.name}
                    {dev.active && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400">{dev.location}</div>
                </div>
                {!dev.active && (
                  <button className="text-[11px] text-rose-400 hover:underline">Revoke</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setE2eeModalOpen(false)}
          className="w-full btn-primary py-2.5 rounded-xl justify-center font-bold text-xs"
        >
          Confirm Security Fingerprint
        </button>
      </div>
    </div>
  );
};
