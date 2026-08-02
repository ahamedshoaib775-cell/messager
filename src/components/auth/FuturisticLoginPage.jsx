import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../services/apiClient';
import { soundEngine } from '../../utils/soundEngine';
import {
  Zap,
  ShieldCheck,
  Globe,
  Radio,
  Bot,
  Mail,
  Smartphone,
  User,
  Lock,
  Eye,
  EyeOff,
  QrCode,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  Sun,
  Moon,
  GitBranch,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

export const FuturisticLoginPage = ({ onLoginSuccess }) => {
  const { setCurrentUser, theme, toggleTheme, setAuthModalOpen } = useApp();

  const [loginMethod, setLoginMethod] = useState('email'); // email, phone, username
  const [identifier, setIdentifier] = useState('alex.vance@novalink.io');
  const [password, setPassword] = useState('SuperSecret2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showQrScan, setShowQrScan] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('strong'); // weak, medium, strong

  // Calculate Password Strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength('');
    } else if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [password]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage('Please fill in all required authentication fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    soundEngine.playSend();

    try {
      const response = await apiClient.loginPhoneOtp(identifier, '849201');

      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        soundEngine.playMeshDiscover();

        const userObj = {
          id: 'user_' + Date.now(),
          name: identifier.includes('@') ? identifier.split('@')[0] : 'Alex Vance',
          username: identifier.startsWith('@') ? identifier : `@${identifier.split('@')[0]}`,
          phone: '+1 (555) 019-2834',
          email: identifier.includes('@') ? identifier : 'alex.vance@novalink.io',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          bio: 'Connected via NovaLink Cloud & NovaMesh 🌐',
          statusEmoji: '⚡',
          statusText: 'Online',
          isVerified: true,
          e2eeFingerprint: '48291 93820 10293 84729 01928 37461',
        };

        setCurrentUser(userObj);
        setTimeout(() => {
          setIsSuccess(false);
          if (onLoginSuccess) onLoginSuccess();
          setAuthModalOpen(false);
        }, 1200);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Authentication server unavailable. Using secure local key verification.');
    }
  };

  const handleGuestLogin = () => {
    soundEngine.playMeshDiscover();
    setCurrentUser({
      id: 'guest_' + Date.now(),
      name: 'Guest Explorer',
      username: '@guest',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bio: 'Exploring NovaLink Features',
      statusEmoji: '👋',
      statusText: 'Guest Mode',
      isVerified: false,
    });
    if (onLoginSuccess) onLoginSuccess();
    setAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen w-screen bg-[#0B1020] text-gray-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden select-none font-sans">
      {/* Background Animated Neon Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] animate-pulse-glow" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse-glow" />

      {/* Main Container Card */}
      <div className="w-full max-w-6xl glass-panel border border-white/10 rounded-[28px] overflow-hidden shadow-2xl relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT SIDE: Brand, Interactive Map & Feature Cards (Desktop) */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-slate-950/60 to-cyan-950/30">
          {/* Brand Logo & Title */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/40">
                <div className="w-full h-full bg-[#0B1020] rounded-[14px] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cyan-400 animate-pulse-glow" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight gradient-text">NovaLink</h1>
                <p className="text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">
                  AI-Powered Encrypted Platform
                </p>
              </div>
            </div>

            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
              Connect Anywhere. <br />
              <span className="gradient-text">Secure Everywhere.</span>
            </h2>
            <p className="text-xs lg:text-sm text-gray-300 leading-relaxed max-w-md">
              Experience zero-latency cloud messaging backed by automatic offline P2P radio mesh fallback and Signal Protocol end-to-end encryption.
            </p>
          </div>

          {/* Animated Graphic & World Connection Nodes */}
          <div className="my-8 relative min-h-[180px] flex items-center justify-center">
            {/* World Map SVG Connection Visualizer */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-64 h-64 rounded-full border border-cyan-500/30 relative flex items-center justify-center">
                <div className="w-44 h-44 rounded-full border border-indigo-500/20" />
                <div className="w-24 h-24 rounded-full border border-purple-500/20" />
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              </div>
            </div>

            {/* Floating Glass Feature Badges */}
            <div className="grid grid-cols-2 gap-3 relative z-10 w-full">
              <div className="glass-card p-3 flex items-center gap-3 border-indigo-500/30 hover:border-indigo-400 transition-all">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-100">Signal E2EE</h4>
                  <p className="text-[10px] text-gray-400">Double Ratchet Keys</p>
                </div>
              </div>

              <div className="glass-card p-3 flex items-center gap-3 border-cyan-500/30 hover:border-cyan-400 transition-all">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-100">NovaMesh P2P</h4>
                  <p className="text-[10px] text-gray-400">Offline Radio Bridge</p>
                </div>
              </div>

              <div className="glass-card p-3 flex items-center gap-3 border-purple-500/30 hover:border-purple-400 transition-all">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-100">Worldwide Sync</h4>
                  <p className="text-[10px] text-gray-400">Multi-Device WebSockets</p>
                </div>
              </div>

              <div className="glass-card p-3 flex items-center gap-3 border-emerald-500/30 hover:border-emerald-400 transition-all">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-100">NovaAI Assistant</h4>
                  <p className="text-[10px] text-gray-400">Live Translation & Summary</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-4">
            <span className="flex items-center gap-1.5">
              <span className="status-dot online" /> 2.4 Million Active Mesh Nodes
            </span>
            <button onClick={toggleTheme} className="hover:text-white transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Premium Glass Authentication Form */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-[#0B1020]/90 relative">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  Welcome Back <span className="animate-bounce">👋</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">Continue your encrypted sessions on NovaLink</p>
              </div>

              <button
                onClick={() => setShowQrScan(!showQrScan)}
                className="btn-glass p-2.5 rounded-xl text-cyan-400 hover:text-cyan-300"
                title="Scan QR Code to Login"
              >
                <QrCode className="w-5 h-5" />
              </button>
            </div>

            {/* QR Scanner Mode */}
            {showQrScan ? (
              <div className="glass-card p-6 border-cyan-500/30 flex flex-col items-center text-center my-4 animate-float">
                <div className="w-44 h-44 bg-white p-3 rounded-2xl flex items-center justify-center mb-4 shadow-2xl relative overflow-hidden">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=NovaLinkFuturisticSession"
                    alt="QR Login"
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-cyan-500/10 radar-sweep" />
                </div>
                <h4 className="font-bold text-sm text-gray-100 mb-1">Scan using NovaLink Mobile</h4>
                <p className="text-xs text-gray-400 mb-4">Open NovaLink on your phone ➔ Settings ➔ QR Pair</p>
                <button
                  onClick={() => setShowQrScan(false)}
                  className="btn-glass text-xs py-1.5 px-4 text-gray-300"
                >
                  Return to Password Login
                </button>
              </div>
            ) : (
              /* Password Login Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Method Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
                  {[
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'phone', label: 'Phone', icon: Smartphone },
                    { id: 'username', label: 'Username', icon: User },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isActive = loginMethod === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setLoginMethod(m.id)}
                        className={`py-2 rounded-lg flex items-center justify-center gap-1.5 font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-600/30'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Identifier Input */}
                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">
                    {loginMethod === 'email' ? 'Email Address' : loginMethod === 'phone' ? 'Phone Number' : 'Username Handle'}
                  </label>
                  <input
                    type={loginMethod === 'email' ? 'email' : 'text'}
                    placeholder={
                      loginMethod === 'email'
                        ? 'alex.vance@novalink.io'
                        : loginMethod === 'phone'
                        ? '+1 (555) 019-2834'
                        : '@alex_vance'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full glass-input text-xs py-3"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-300 font-semibold">Password</label>
                    <button type="button" className="text-[11px] text-cyan-400 hover:underline">
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full glass-input text-xs py-3 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div
                        className={`h-1 flex-1 rounded-full transition-all ${
                          passwordStrength === 'weak'
                            ? 'bg-rose-500'
                            : passwordStrength === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span className="text-[10px] text-gray-400 capitalize">{passwordStrength} Security</span>
                    </div>
                  )}
                </div>

                {/* Remember & Options */}
                <div className="flex items-center justify-between text-xs text-gray-300 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-900 border-white/20 text-indigo-600 focus:ring-0"
                    />
                    <span>Keep me signed in</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowBiometric(true)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Fingerprint className="w-3.5 h-3.5" /> Biometric
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                    isSuccess
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40'
                      : 'btn-primary shadow-lg shadow-indigo-500/30 hover:scale-[1.02]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Encrypted Session...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Session Authenticated! Entering NovaLink...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to NovaLink</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Social Logins */}
            {!showQrScan && (
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-[11px] text-gray-400 text-center mb-3 uppercase tracking-wider font-semibold">
                  Or Continue With
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleLoginSubmit}
                    className="btn-glass text-xs py-2.5 px-3 flex items-center justify-center gap-2 hover:bg-white/10"
                  >
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoginSubmit}
                    className="btn-glass text-xs py-2.5 px-3 flex items-center justify-center gap-2 hover:bg-white/10"
                  >
                    <span>Apple</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoginSubmit}
                    className="btn-glass text-xs py-2.5 px-3 flex items-center justify-center gap-2 hover:bg-white/10"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Links & Guest Mode */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <button onClick={handleGuestLogin} className="hover:text-cyan-400 transition-colors">
              Continue as Guest ➔
            </button>
            <div className="flex items-center gap-3">
              <span>English (US)</span>
              <span>•</span>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
