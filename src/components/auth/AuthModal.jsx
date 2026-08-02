import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Mail,
  User,
  QrCode,
  Lock,
  KeyRound,
  X,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Trash2,
} from 'lucide-react';

export const AuthModal = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    isBiometricLocked,
    setIsBiometricLocked,
    currentUser,
    setCurrentUser,
    clearUserSession,
  } = useApp();

  const [authMethod, setAuthMethod] = useState('phone');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [otp, setOtp] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!authModalOpen && !isBiometricLocked) return null;

  // Biometric Unlock Overlay
  if (isBiometricLocked) {
    const handleUnlock = () => {
      setIsBiometricLocked(false);
      setPinInput('');
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-float">
        <div className="w-full max-w-sm glass-panel border border-indigo-500/40 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/40 animate-pulse-glow">
            <Fingerprint className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-extrabold text-white mb-1">NovaLink Locked</h2>
          <p className="text-xs text-gray-400 mb-6">Use Biometric FaceID / Fingerprint or enter PIN</p>

          <input
            type="password"
            maxLength={6}
            placeholder="••••••"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            className="w-full glass-input text-center font-mono text-xl tracking-widest py-3 mb-4"
          />

          <button
            onClick={handleUnlock}
            className="w-full btn-primary py-3 rounded-xl justify-center font-bold"
          >
            Unlock App
          </button>
        </div>
      </div>
    );
  }

  const handleLogin = () => {
    setIsSuccess(true);
    setCurrentUser({
      id: 'user_' + Date.now(),
      name: phone.includes('555') ? 'Alex Vance' : 'New NovaLink User',
      username: `@user_${Math.floor(1000 + Math.random() * 9000)}`,
      phone: phone || '+1 (555) 019-2834',
      email: 'user@novalink.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Active NovaLink User',
      statusEmoji: '⚡',
      statusText: 'Online',
      isVerified: true,
    });

    setTimeout(() => {
      setIsSuccess(false);
      setAuthModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-float">
      <div className="w-full max-w-md glass-panel border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-gray-100">Multi-Device Authentication</h3>
          </div>
          <button onClick={() => setAuthModalOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Banner */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500"
            />
            <div>
              <h4 className="font-bold text-xs text-white">{currentUser.name}</h4>
              <p className="text-[10px] text-gray-400">{currentUser.username} • {currentUser.phone || 'Guest'}</p>
            </div>
          </div>
          <button
            onClick={clearUserSession}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
            title="Clear Existing User & Session Token"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear User
          </button>
        </div>

        {/* Method Tabs */}
        <div className="p-4 grid grid-cols-4 gap-2 border-b border-white/10 bg-white/5 text-xs">
          {[
            { id: 'phone', label: 'Phone OTP', icon: Smartphone },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'username', label: 'Username', icon: User },
            { id: 'qr', label: 'QR Scan', icon: QrCode },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setAuthMethod(m.id)}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 font-medium transition-all ${
                  authMethod === m.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Auth Body */}
        <div className="p-6 flex flex-col gap-4">
          {authMethod === 'phone' && (
            <>
              <div>
                <label className="text-xs text-gray-300 font-semibold mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full glass-input text-xs py-2.5"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 font-semibold mb-1 block">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  placeholder="8 4 9 2 0 1"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full glass-input text-xs py-2.5 font-mono text-center tracking-widest"
                />
              </div>
            </>
          )}

          {authMethod === 'qr' && (
            <div className="flex flex-col items-center p-4 border border-dashed border-white/20 rounded-2xl">
              <div className="w-40 h-40 bg-white p-3 rounded-xl flex items-center justify-center mb-3">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NovaLinkE2EEDevicePairingKey"
                  alt="QR Code"
                  className="w-full h-full"
                />
              </div>
              <p className="text-xs text-gray-300 text-center">
                Scan this QR code from your NovaLink Mobile App to pair desktop session instantly.
              </p>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full btn-primary py-3 rounded-xl justify-center font-bold mt-2"
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : 'Authenticate Session'}
          </button>
        </div>
      </div>
    </div>
  );
};
