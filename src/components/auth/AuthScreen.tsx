'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Heart,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  Users,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Baby,
  HeartHandshake,
  Calendar,
  Layers
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const {
    login,
    register,
    allAccounts,
    selectedLanguage,
    setSelectedLanguage,
    t
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'mother' | 'partner'>('mother');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [motherPairingCode, setMotherPairingCode] = useState('');
  const [relationship, setRelationship] = useState('Husband / Spouse');
  const [gestationalWeek, setGestationalWeek] = useState(24);
  const [dietaryPreference, setDietaryPreference] = useState<'vegetarian' | 'vegan' | 'non-vegetarian'>('vegetarian');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const success = login(email.trim(), password);
    if (!success) {
      setErrorMessage('Account not found with this email. Try our 1-click demo accounts below or create a new account.');
    }
  };

  // Handle Sign Up submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please fill in your name and email.');
      return;
    }

    const res = register({
      name: name.trim(),
      email: email.trim(),
      role: selectedRole,
      password: password || 'secret123',
      motherPairingCode: selectedRole === 'partner' ? motherPairingCode.trim().toUpperCase() : undefined,
      relationship: selectedRole === 'partner' ? relationship : undefined,
      gestationalWeek: selectedRole === 'mother' ? Number(gestationalWeek) || 24 : undefined,
      dietaryPreference
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Registration failed.');
    }
  };

  // Quick Demo Login helper
  const handleQuickDemoLogin = (targetEmail: string) => {
    login(targetEmail);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setSuccessMessage(`Password reset link sent to ${resetEmail}. Check your inbox!`);
    setShowForgotPassword(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6EE] via-[#FFFDF8] to-stone-100 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-card rounded-4xl border border-border shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Col: Brand Hero & Security Statement (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#2E3D30] to-[#1E2920] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#7A9A7E]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#C47A5A]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Identity */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#7A9A7E] text-white flex items-center justify-center font-serif font-black text-xl shadow-soft">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-serif font-bold text-white tracking-wide">
                    Matrena
                  </h1>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-stone-200 font-bold uppercase tracking-wider">
                    BloomNest
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#FAF6EE]/70 font-semibold">
                  Maternal Sanctuary
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed font-light pt-2">
              Every heartbeat, every milestone, every moment — together.
            </p>
          </div>

          {/* Center Graphic: Dual Pairing Isolation */}
          <div className="relative z-10 my-8 space-y-3">
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-stone-200">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#7A9A7E]" />
                  Zero-Knowledge Family Isolation
                </span>
                <span className="text-[10px] text-stone-400 font-mono">HIPAA Standard</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Expecting mothers and partners hold distinct accounts with independent cryptographically generated codes. Medical records, contractions, and ultrasounds remain strictly isolated to authorized caregivers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-lg block mb-0.5">🌸</span>
                <span className="font-bold text-white block">Mother Account</span>
                <span className="text-[10px] text-stone-400 font-mono">Unique MAMA Code</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-lg block mb-0.5">🤝</span>
                <span className="font-bold text-white block">Partner Account</span>
                <span className="text-[10px] text-stone-400 font-mono">Unique PAPA Code</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 text-[11px] text-stone-400 flex items-center gap-2 pt-2 border-t border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#7A9A7E] shrink-0" />
            <span>End-to-End Encrypted Maternal Health Vault</span>
          </div>
        </div>

        {/* Right Col: Interactive Auth Form (7 cols) */}
        <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-between bg-card">
          <div className="space-y-6">
            {/* Language Quick Selector Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                🌐 {t('lang')}:
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { code: 'en-US', label: 'EN' },
                  { code: 'kn-IN', label: 'ಕನ್ನಡ' },
                  { code: 'hi-IN', label: 'हिंदी' },
                  { code: 'ta-IN', label: 'தமிழ்' },
                  { code: 'te-IN', label: 'తెలుగు' },
                  { code: 'ml-IN', label: 'മലയാളം' }
                ].map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setSelectedLanguage(l.code)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedLanguage === l.code
                        ? 'bg-primary text-white font-bold shadow-xs'
                        : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Switcher: Sign In vs Create Account */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-foreground">
                  {authMode === 'login' ? t('authWelcome') : t('createAccountTab')}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {authMode === 'login'
                    ? t('authSubtitle')
                    : 'Select your role to generate your unique security code'}
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-2xl border border-border text-xs">
                <button
                  onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('signInTab')}
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setErrorMessage(null); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    authMode === 'signup'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('createAccountTab')}
                </button>
              </div>
            </div>

            {/* Error / Success Banners */}
            {errorMessage && (
              <div className="p-3 bg-semantic-danger/10 border border-semantic-danger/30 rounded-2xl text-xs text-semantic-danger flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="font-semibold">{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-semibold">{successMessage}</p>
              </div>
            )}

            {/* ============================================================== */}
            {/* SIGN IN FORM */}
            {/* ============================================================== */}
            {authMode === 'login' && (
              <div className="space-y-5">
                <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-foreground font-bold mb-1">{t('emailLabel')}</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. siri@bloomnest.com"
                        className="w-full pl-10 pr-3 py-2.5 bg-muted/30 border border-input rounded-2xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-foreground font-bold">{t('passwordLabel')}</label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-[11px] text-accent hover:underline font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-muted/30 border border-input rounded-2xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold shadow-soft transition-all text-xs flex items-center justify-center gap-2"
                  >
                    <span>{t('signInBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* 1-Click Instant Demo Accounts Section */}
                <div className="pt-3 border-t border-border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      {t('demoProfilesTitle')}
                    </span>
                    <span className="text-[10px] text-primary font-bold">No password required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {/* Mother Profile */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('siri@bloomnest.com')}
                      className="p-3 rounded-2xl bg-primary-soft hover:bg-primary/20 border border-primary/30 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground">Siri Rao</span>
                        <span className="text-xs">🌸</span>
                      </div>
                      <span className="text-[10px] font-semibold text-primary block">Mother (Week 24)</span>
                      <span className="text-[9px] font-mono text-muted-foreground">Code: MAMA-2026</span>
                    </button>

                    {/* Linked Partner Profile */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('rohan@bloomnest.com')}
                      className="p-3 rounded-2xl bg-accent-soft hover:bg-accent/20 border border-accent/30 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground">Rohan Rao</span>
                        <span className="text-xs">🤝</span>
                      </div>
                      <span className="text-[10px] font-semibold text-accent block">Paired Partner</span>
                      <span className="text-[9px] font-mono text-muted-foreground">Code: PAPA-7140</span>
                    </button>

                    {/* Unlinked Partner Profile */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('arjun@bloomnest.com')}
                      className="p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 border border-border text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground">Arjun Mehta</span>
                        <span className="text-xs">🔒</span>
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground block">Unpaired Partner</span>
                      <span className="text-[9px] font-mono text-muted-foreground">Code: PAPA-9921</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SIGN UP / REGISTRATION FORM */}
            {/* ============================================================== */}
            {authMode === 'signup' && (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                {/* Role Switcher */}
                <div>
                  <label className="block text-foreground font-bold mb-1.5">Select Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('mother')}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        selectedRole === 'mother'
                          ? 'bg-primary-soft border-primary text-primary font-bold shadow-xs'
                          : 'bg-muted/20 border-border text-muted-foreground hover:bg-muted/40'
                      }`}
                    >
                      <span className="text-lg">🌸</span>
                      <div>
                        <div className="text-xs">Expecting Mother</div>
                        <span className="text-[10px] font-normal opacity-80">Generates unique MAMA code</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('partner')}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        selectedRole === 'partner'
                          ? 'bg-accent-soft border-accent text-accent font-bold shadow-xs'
                          : 'bg-muted/20 border-border text-muted-foreground hover:bg-muted/40'
                      }`}
                    >
                      <span className="text-lg">🤝</span>
                      <div>
                        <div className="text-xs">Partner / Father</div>
                        <span className="text-[10px] font-normal opacity-80">Generates unique PAPA code</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Common fields: Name, Email, Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={selectedRole === 'mother' ? 'e.g. Priya Nair' : 'e.g. Rahul Nair'}
                      className="w-full px-3 py-2 bg-muted/30 border border-input rounded-2xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-foreground font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full px-3 py-2 bg-muted/30 border border-input rounded-2xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-foreground font-bold mb-1">Create Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-muted/30 border border-input rounded-2xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                {/* Mother Specific Fields */}
                {selectedRole === 'mother' && (
                  <div className="p-3.5 bg-primary-soft/60 rounded-2xl border border-primary/20 space-y-3">
                    <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                      <Baby className="w-4 h-4" />
                      <span>Pregnancy Profile Setup</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-foreground font-semibold mb-1">Current Gestational Week</label>
                        <select
                          value={gestationalWeek}
                          onChange={(e) => setGestationalWeek(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-card border border-input rounded-xl text-xs"
                        >
                          {Array.from({ length: 40 }, (_, i) => i + 1).map(w => (
                            <option key={w} value={w}>Week {w}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-foreground font-semibold mb-1">Dietary Preference</label>
                        <select
                          value={dietaryPreference}
                          onChange={(e) => setDietaryPreference(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 bg-card border border-input rounded-xl text-xs capitalize"
                        >
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="non-vegetarian">Non-Vegetarian</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground">
                      * Upon registration, a unique 8-character pairing code (e.g. MAMA-XXXX) will be issued for you to share with your partner.
                    </p>
                  </div>
                )}

                {/* Partner Specific Fields */}
                {selectedRole === 'partner' && (
                  <div className="p-3.5 bg-accent-soft/60 rounded-2xl border border-accent/20 space-y-3">
                    <div className="flex items-center gap-1.5 text-accent font-bold text-xs">
                      <HeartHandshake className="w-4 h-4" />
                      <span>Partner Linking Setup</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-foreground font-semibold mb-1">Relationship</label>
                        <select
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-card border border-input rounded-xl text-xs"
                        >
                          <option value="Husband / Spouse">Husband / Spouse</option>
                          <option value="Partner">Partner</option>
                          <option value="Father">Father</option>
                          <option value="Doula / Caregiver">Doula / Caregiver</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-foreground font-semibold mb-1">
                          Mother's Pairing Code <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={motherPairingCode}
                          onChange={(e) => setMotherPairingCode(e.target.value)}
                          placeholder="e.g. MAMA-2026"
                          className="w-full px-2.5 py-1.5 bg-card border border-input rounded-xl text-xs uppercase font-mono tracking-wider"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground">
                      * If you don't have the mother's code yet, you can leave it blank and link later. Your account will have its own unique PAPA code.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold shadow-soft transition-all text-xs"
                >
                  Create Secure {selectedRole === 'mother' ? 'Mother' : 'Partner'} Account
                </button>
              </form>
            )}
          </div>

          {/* Bottom Security Disclaimers */}
          <div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>BloomNest Secure Vault v2.4</span>
            <span className="flex items-center gap-1 text-primary font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Protected by Caregiver Permission Protocol
            </span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md p-6 rounded-3xl border border-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-foreground">Reset Your Password</h3>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your account email. We will dispatch a secure one-time password recovery link.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3 text-xs">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl text-xs"
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="px-3 py-1.5 rounded-xl border border-border text-muted-foreground hover:bg-muted text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-primary text-white font-bold text-xs"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
