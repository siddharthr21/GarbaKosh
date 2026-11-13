'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Calendar,
  KeyRound
} from 'lucide-react';

// Brand Lotus Flower Icon matching the BloomNest / GarbhSarathi emblem
const LotusBrandIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Base arc */}
    <path
      d="M10 35C16 38 32 38 38 35C35 39 28 41 24 41C20 41 13 39 10 35Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left Outer Petal */}
    <path
      d="M10 33C9 24 16 16 22 17C18.5 22 18 28 20 34"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right Outer Petal */}
    <path
      d="M38 33C39 24 32 16 26 17C29.5 22 30 28 28 34"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left Inner Petal */}
    <path
      d="M16 34C17 22 21 12 24 8.5C24.5 13 25 18 25 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right Inner Petal */}
    <path
      d="M32 34C31 22 27 12 24 8.5C23.5 13 23 18 23 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Central Heart of Bloom */}
    <path
      d="M24 8.5C22.5 13.5 22.5 21 24 26C25.5 21 25.5 13.5 24 8.5Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// High-resolution SVG portraits for Mother, Partner, and Evaluator
const AvatarPortrait: React.FC<{ type: 'mother' | 'partner' | 'evaluator'; className?: string }> = ({
  type,
  className = 'w-full h-full'
}) => {
  if (type === 'mother') {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="64" height="64" rx="32" fill="#FDF2E9" />
        <circle cx="32" cy="32" r="30" fill="url(#mother-grad)" />
        {/* Soft flowing hair */}
        <path
          d="M18 34C18 21 23 14 32 14C41 14 46 21 46 34C46 38 45 44 42 48C40 40 41 28 38 23C35 27 29 27 26 23C23 28 24 40 22 48C19 44 18 38 18 34Z"
          fill="#4A3428"
        />
        {/* Face */}
        <path
          d="M24 28C24 23 27 20 32 20C37 20 40 23 40 28C40 35 37 41 32 41C27 41 24 35 24 28Z"
          fill="#FBD8C5"
        />
        {/* Bindi / dot */}
        <circle cx="32" cy="26" r="1" fill="#C44D34" />
        {/* Eyes (gentle closed/smiling arcs) */}
        <path d="M28 29C29 30 30 30 31 29" stroke="#5D3A24" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M33 29C34 30 35 30 36 29" stroke="#5D3A24" strokeWidth="1.2" strokeLinecap="round" />
        {/* Gentle blush */}
        <circle cx="27" cy="32" r="2.5" fill="#F29879" fillOpacity="0.45" />
        <circle cx="37" cy="32" r="2.5" fill="#F29879" fillOpacity="0.45" />
        {/* Serene smile */}
        <path d="M30 34C31 35.5 33 35.5 34 34" stroke="#8E4833" strokeWidth="1.2" strokeLinecap="round" />
        {/* Shoulders / Dress in rose floral tone */}
        <path
          d="M17 56C19 46 25 43 32 43C39 43 45 46 47 56C43 59 37 60 32 60C27 60 21 59 17 56Z"
          fill="#D97A68"
        />
        <defs>
          <radialGradient id="mother-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 28) scale(32)">
            <stop stopColor="#FFF5EB" />
            <stop offset="1" stopColor="#F5DFD0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'partner') {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="64" height="64" rx="32" fill="#EBF3F5" />
        <circle cx="32" cy="32" r="30" fill="url(#partner-grad)" />
        {/* Hair */}
        <path
          d="M21 26C21 18 26 14 32 14C38 14 43 18 43 26C43 27 42 30 42 30C39 24 35 22 32 22C29 22 25 24 22 30C22 30 21 27 21 26Z"
          fill="#2C3437"
        />
        {/* Face */}
        <path
          d="M23 27C23 22 27 20 32 20C37 20 41 22 41 27C41 35 37 41 32 41C27 41 23 35 23 27Z"
          fill="#F5D0B5"
        />
        {/* Eyes */}
        <path d="M27 28C28 27.5 30 27.5 31 28" stroke="#3D2B1F" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M33 28C34 27.5 36 27.5 37 28" stroke="#3D2B1F" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="29" cy="29.5" r="1" fill="#3D2B1F" />
        <circle cx="35" cy="29.5" r="1" fill="#3D2B1F" />
        {/* Friendly smile */}
        <path d="M29 34C31 36 33 36 35 34" stroke="#7A4C32" strokeWidth="1.3" strokeLinecap="round" />
        {/* Collar / sage shirt */}
        <path
          d="M17 56C19 46 25 43 32 43C39 43 45 46 47 56C43 59 37 60 32 60C27 60 21 59 17 56Z"
          fill="#52796F"
        />
        <path d="M32 43V50" stroke="#FAF6EE" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <radialGradient id="partner-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 28) scale(32)">
            <stop stopColor="#F0F7F6" />
            <stop offset="1" stopColor="#D5E5E2" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  // Evaluator / Clinician
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="32" fill="#E8F4F0" />
      <circle cx="32" cy="32" r="30" fill="url(#eval-grad)" />
      {/* Hair */}
      <path
        d="M20 28C20 18 25 15 32 15C39 15 44 18 44 28C44 32 43 35 41 36C39 30 35 24 32 24C29 24 25 30 23 36C21 35 20 32 20 28Z"
        fill="#263A33"
      />
      {/* Face */}
      <path
        d="M24 27C24 22 27 20 32 20C37 20 40 22 40 27C40 34 37 40 32 40C27 40 24 34 24 27Z"
        fill="#F8D7C2"
      />
      {/* Glasses / Eyes */}
      <rect x="25.5" y="27" width="5.5" height="4" rx="1.5" stroke="#2D4A3E" strokeWidth="1.2" fill="none" />
      <rect x="33" y="27" width="5.5" height="4" rx="1.5" stroke="#2D4A3E" strokeWidth="1.2" fill="none" />
      <path d="M31 29H33" stroke="#2D4A3E" strokeWidth="1.2" />
      <circle cx="28.2" cy="29" r="0.8" fill="#2D4A3E" />
      <circle cx="35.8" cy="29" r="0.8" fill="#2D4A3E" />
      {/* Confident gentle smile */}
      <path d="M30 34C31 35.5 33 35.5 34 34" stroke="#7A4C32" strokeWidth="1.2" strokeLinecap="round" />
      {/* White Coat + Stethoscope */}
      <path
        d="M17 56C19 46 25 43 32 43C39 43 45 46 47 56C43 59 37 60 32 60C27 60 21 59 17 56Z"
        fill="#E6F0EC"
      />
      {/* Inner scrubs */}
      <path d="M29 43L32 49L35 43" fill="#2F6B56" />
      {/* Stethoscope */}
      <path
        d="M26 43V48C26 51 28 53 30 53H34C36 53 38 51 38 48V43"
        stroke="#1E392E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="54" r="2" fill="#C5D9D1" stroke="#1E392E" strokeWidth="1" />
      <defs>
        <radialGradient id="eval-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 28) scale(32)">
          <stop stopColor="#F4FBF8" />
          <stop offset="1" stopColor="#D2E8E0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export const AuthScreen: React.FC = () => {
  const {
    login,
    register,
    selectedLanguage,
    setSelectedLanguage,
    t
  } = useApp();

  // Mode and form states
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'mother' | 'partner'>('mother');
  const [emailOrCode, setEmailOrCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [gestationalWeek, setGestationalWeek] = useState(24);
  const [motherPairingCode, setMotherPairingCode] = useState('');

  // Interactive "Little One's Surprise" Guess State
  const [activeTeam, setActiveTeam] = useState<'Team Pink' | 'Team Blue' | 'Team Surprise'>('Team Pink');
  const [mumGuess, setMumGuess] = useState<'Team Pink' | 'Team Blue' | 'Team Surprise'>('Team Pink');
  const [partnerGuess, setPartnerGuess] = useState<'Team Pink' | 'Team Blue' | 'Team Surprise'>('Team Blue');
  const [lastGuesser, setLastGuesser] = useState<'mum' | 'partner'>('mum');
  const [guessToast, setGuessToast] = useState<string | null>(null);

  // Forgot password & UI states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  // Video Background Reference
  const videoRef = useRef<HTMLVideoElement>(null);

  // Language Dropdown
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages = [
    { code: 'en-US', label: 'English (EN)' },
    { code: 'kn-IN', label: 'ಕನ್ನಡ (KN)' },
    { code: 'hi-IN', label: 'हिंदी (HI)' },
    { code: 'ta-IN', label: 'தமிழ் (TA)' },
    { code: 'te-IN', label: 'తెలుగు (TE)' },
    { code: 'ml-IN', label: 'മലയാളം (ML)' }
  ];

  const currentLang = languages.find((l) => l.code === selectedLanguage) || languages[0];

  // Guaranteed Instant Autoplay on Load (Silent Video)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const play = () => {
      if (video && video.paused) {
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }
    };

    play();
    video.addEventListener('canplay', play);
    video.addEventListener('loadeddata', play);

    const onUserAction = () => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    };

    window.addEventListener('click', onUserAction, { capture: true });
    window.addEventListener('touchstart', onUserAction, { capture: true });
    window.addEventListener('mousemove', onUserAction, { once: true, capture: true });

    return () => {
      video.removeEventListener('canplay', play);
      video.removeEventListener('loadeddata', play);
      window.removeEventListener('click', onUserAction, { capture: true });
      window.removeEventListener('touchstart', onUserAction, { capture: true });
      window.removeEventListener('mousemove', onUserAction, { capture: true });
    };
  }, []);

  // Handle Team Guess Selection
  const handleTeamSelect = (team: 'Team Pink' | 'Team Blue' | 'Team Surprise') => {
    setActiveTeam(team);
    if (lastGuesser === 'mum') {
      setPartnerGuess(team);
      setLastGuesser('partner');
      setGuessToast(`Partner voted for ${team}! 💫`);
    } else {
      setMumGuess(team);
      setLastGuesser('mum');
      setGuessToast(`Mum voted for ${team}! 🌸`);
    }
    setTimeout(() => setGuessToast(null), 2500);
  };

  // Submit Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanInput = emailOrCode.trim();
    if (!cleanInput) {
      // Default seamless entry
      handleQuickDemoLogin('siri@garbhsarthi.com', 'Siri Rao');
      return;
    }

    setIsLoggingIn('signing-in');
    const success = login(cleanInput, password);
    if (!success) {
      setIsLoggingIn(null);
      setErrorMessage(
        `Account "${cleanInput}" not found. Try one of the 1-click profiles below or enter code (e.g. MAMA-2026, PAPA-7140, or HSP-9920).`
      );
    }
  };

  // Submit Sign Up
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!registerName.trim() || !registerEmail.trim()) {
      setErrorMessage('Please provide your name and email address.');
      return;
    }

    const res = register({
      name: registerName.trim(),
      email: registerEmail.trim(),
      role: selectedRole,
      password: registerPassword || 'secret123',
      gestationalWeek: selectedRole === 'mother' ? Number(gestationalWeek) || 24 : undefined,
      motherPairingCode:
        selectedRole === 'partner' && motherPairingCode.trim() ? motherPairingCode.trim() : undefined,
      dietaryPreference: 'vegetarian'
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Registration failed.');
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = (targetIdentifier: string, personaName: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmailOrCode(targetIdentifier);
    setIsLoggingIn(personaName);

    setTimeout(() => {
      const success = login(targetIdentifier);
      if (!success) {
        setIsLoggingIn(null);
        setErrorMessage(`Could not sign in with ${targetIdentifier}.`);
      }
    }, 150);
  };

  // Forgot Password
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setSuccessMessage(`Password recovery link sent to ${resetEmail}. Check your inbox!`);
    setShowForgotPassword(false);
    setResetEmail('');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAF6EE] flex flex-col justify-between select-none">
      {/* ============================================================== */}
      {/* 1. BACKGROUND ANIMATED VIDEO (LOTUS BLOOM & BABIES) */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[42%_center] lg:object-[38%_center] scale-[1.01]"
        >
          <source src="/auth/auth-animation.mp4" type="video/mp4" />
          <source src="/auth/auth-animation.mov" type="video/quicktime" />
        </video>

        {/* Ambient Warm Gradient Overlay for contrast while letting center shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EE]/45 via-transparent to-[#FAF6EE]/20 pointer-events-none" />
        <div className="absolute inset-0 bg-black/[0.04] pointer-events-none" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pt-4 sm:pt-5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/60 shadow-xs">
          <LotusBrandIcon className="w-7 h-7 text-[#2F4432]" />
          <div>
            <div className="flex items-center">
              <span className="font-serif text-base sm:text-lg font-bold text-[#1E2920] tracking-tight">
                GarbSarthi
              </span>
            </div>
            <p className="text-[8.5px] uppercase tracking-[0.24em] text-[#556957] font-bold">
              MATERNAL SANCTUARY
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN CONTENT STAGE: LEFT HERO & RIGHT LOGIN CARD */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-4 sm:py-6 flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        {/* LEFT COLUMN: HERO HEADLINE & "WHAT'S YOUR LITTLE ONE'S SURPRISE?" */}
        <div className="w-full lg:max-w-[390px] xl:max-w-[420px] flex flex-col justify-between space-y-5 lg:space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
          {/* Main Emotional Headline */}
          <div className="space-y-1.5">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-[#243326] font-normal leading-[1.18] tracking-tight drop-shadow-xs">
              Every heartbeat,<br />
              every milestone,<br />
              every moment —<br />
              <span className="text-[#B06545] font-semibold">together.</span>
            </h1>
          </div>

          {/* Interactive Guess Card: What's your little one's surprise? */}
          <div className="bg-white/80 backdrop-blur-md rounded-[28px] p-5 border border-white/70 shadow-lg shadow-stone-900/5 max-w-sm transition-all hover:bg-white/90">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-[#1E2920]">
                What&apos;s your little one&apos;s surprise?
              </h3>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-[11px] text-[#637665] mb-3">
              Make your guess together
            </p>

            {/* Team Selection Pills */}
            <div className="grid grid-cols-3 gap-2 mb-3.5">
              <button
                type="button"
                onClick={() => handleTeamSelect('Team Pink')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                  activeTeam === 'Team Pink'
                    ? 'bg-[#FCE7F3] text-[#BE185D] ring-2 ring-[#BE185D]/40 shadow-xs'
                    : 'bg-[#FDF2F8]/70 hover:bg-[#FCE7F3]/70 text-[#9D174D]'
                }`}
              >
                Team Pink
              </button>
              <button
                type="button"
                onClick={() => handleTeamSelect('Team Blue')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                  activeTeam === 'Team Blue'
                    ? 'bg-[#E0F2FE] text-[#0369A1] ring-2 ring-[#0369A1]/40 shadow-xs'
                    : 'bg-[#F0F9FF]/70 hover:bg-[#E0F2FE]/70 text-[#0284C7]'
                }`}
              >
                Team Blue
              </button>
              <button
                type="button"
                onClick={() => handleTeamSelect('Team Surprise')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                  activeTeam === 'Team Surprise'
                    ? 'bg-[#FEF3C7] text-[#B45309] ring-2 ring-[#B45309]/40 shadow-xs'
                    : 'bg-[#FFFBEB]/70 hover:bg-[#FEF3C7]/70 text-[#D97706]'
                }`}
              >
                Team Surprise
              </button>
            </div>

            {/* Guess Toast Feedback */}
            {guessToast && (
              <div className="mb-2.5 py-1 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 text-center font-semibold animate-in fade-in">
                {guessToast}
              </div>
            )}

            {/* Mum's Guess & Partner's Guess Avatars */}
            <div className="flex items-center justify-between px-3 pt-2 border-t border-stone-200/60">
              {/* Mum's Guess */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-pink-200 shadow-xs">
                  <AvatarPortrait type="mother" />
                </div>
                <span className="text-[10px] text-stone-600 font-medium">Mum&apos;s guess</span>
                <span className="text-[9px] font-bold text-pink-700 px-1.5 py-0.2 rounded-md bg-pink-50 border border-pink-100">
                  {mumGuess}
                </span>
              </div>

              {/* Heart Connector */}
              <div className="flex flex-col items-center px-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-100 animate-pulse" />
              </div>

              {/* Partner's Guess */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-sky-200 shadow-xs">
                  <AvatarPortrait type="partner" />
                </div>
                <span className="text-[10px] text-stone-600 font-medium">Partner&apos;s guess</span>
                <span className="text-[9px] font-bold text-sky-700 px-1.5 py-0.2 rounded-md bg-sky-50 border border-sky-100">
                  {partnerGuess}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FLOATING FROSTED AUTHENTICATION CARD */}
        <div className="w-full lg:max-w-[380px] xl:max-w-[400px] lg:ml-auto animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-[#FAF7F2]/90 backdrop-blur-xl border border-white/85 shadow-[0_20px_50px_-12px_rgba(46,61,48,0.22)] rounded-[32px] p-6 sm:p-7 transition-all">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2920] leading-snug">
                Your Motherhood<br />Journey Starts Here
              </h2>
              <div className="w-10 h-10 rounded-2xl bg-white/80 border border-stone-200/60 shadow-xs flex items-center justify-center text-stone-700">
                <LayoutGrid className="w-5 h-5 text-[#354D37]" />
              </div>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50/95 border border-rose-200 rounded-2xl text-[11px] text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="font-medium leading-tight">{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50/95 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-medium leading-tight">{successMessage}</p>
              </div>
            )}

            {/* Segmented Control: Sign In / Create Account */}
            <div className="flex items-center bg-[#ECE7DE]/75 p-1 rounded-2xl mb-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setShowForgotPassword(false);
                }}
                className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'login' && !showForgotPassword
                    ? 'bg-[#354D37] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setShowForgotPassword(false);
                }}
                className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-[#354D37] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* ============================================================== */}
            {/* VIEW A: FORGOT PASSWORD */}
            {/* ============================================================== */}
            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-3.5 text-xs">
                <p className="text-[11px] text-stone-600">
                  Enter your registered email address to receive password reset instructions.
                </p>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/80 border border-stone-200/80 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#354D37]/30 focus:border-[#354D37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#385139] hover:bg-[#2B402C] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold"
                >
                  Back to Sign In
                </button>
              </form>
            ) : authMode === 'login' ? (
              /* ============================================================== */
              /* VIEW B: SIGN IN FORM */
              /* ============================================================== */
              <div className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-3 text-xs">
                  {/* Email Input */}
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={emailOrCode}
                      onChange={(e) => setEmailOrCode(e.target.value)}
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 bg-white/80 border border-stone-200/80 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#354D37]/30 focus:border-[#354D37]"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-10 py-3 bg-white/80 border border-stone-200/80 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#354D37]/30 focus:border-[#354D37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-stone-600 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#354D37] border-stone-300 focus:ring-[#354D37]"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-stone-500 hover:text-[#354D37] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#3D5A40] hover:bg-[#324B35] active:scale-[0.99] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#3D5A40]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {isLoggingIn ? 'Entering Sanctuary...' : 'Sign in to GarbSarthi'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Subtitle / Divider */}
                <div className="relative text-center my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-300/60" />
                  </div>
                  <span className="relative bg-[#FAF7F2] px-3 text-[11px] text-stone-500 font-medium">
                    or try a demo account
                  </span>
                </div>

                {/* 3 Quick Demo Profiles in a Row */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Mother Demo Account */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('siri@garbhsarthi.com', 'Siri Rao')}
                    className={`p-2.5 rounded-2xl bg-[#F4EFE6]/80 hover:bg-[#EAE2D5] border border-stone-200/80 flex flex-col items-center text-center transition-all group hover:scale-[1.02] cursor-pointer ${
                      isLoggingIn === 'Siri Rao' ? 'ring-2 ring-[#3D5A40] bg-white' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden mb-1.5 border border-amber-200 shadow-xs">
                      <AvatarPortrait type="mother" />
                    </div>
                    <span className="text-xs font-bold text-stone-800 block">Mother</span>
                    <span className="text-[10px] text-stone-500 font-mono font-medium">(MAMA-2026)</span>
                  </button>

                  {/* Partner Demo Account */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('rohan@garbhsarthi.com', 'Rohan Rao')}
                    className={`p-2.5 rounded-2xl bg-[#F4EFE6]/80 hover:bg-[#EAE2D5] border border-stone-200/80 flex flex-col items-center text-center transition-all group hover:scale-[1.02] cursor-pointer ${
                      isLoggingIn === 'Rohan Rao' ? 'ring-2 ring-[#3D5A40] bg-white' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden mb-1.5 border border-sky-200 shadow-xs">
                      <AvatarPortrait type="partner" />
                    </div>
                    <span className="text-xs font-bold text-stone-800 block">Partner</span>
                    <span className="text-[10px] text-stone-500 font-mono font-medium">(PAPA-7140)</span>
                  </button>

                  {/* Evaluator Demo Account */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('evaluator@garbhsarthi.com', 'Dr. Sunita Kulkarni')}
                    className={`p-2.5 rounded-2xl bg-[#F4EFE6]/80 hover:bg-[#EAE2D5] border border-stone-200/80 flex flex-col items-center text-center transition-all group hover:scale-[1.02] cursor-pointer ${
                      isLoggingIn === 'Dr. Sunita Kulkarni' ? 'ring-2 ring-[#3D5A40] bg-white' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden mb-1.5 border border-emerald-200 shadow-xs">
                      <AvatarPortrait type="evaluator" />
                    </div>
                    <span className="text-xs font-bold text-stone-800 block">Evaluator</span>
                    <span className="text-[10px] text-stone-500 font-mono font-medium">(HSP-9920)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ============================================================== */
              /* VIEW C: CREATE ACCOUNT FORM */
              /* ============================================================== */
              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                {/* Role Switcher */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('mother')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedRole === 'mother'
                        ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                        : 'bg-white/60 border-stone-200 text-stone-600'
                    }`}
                  >
                    🌸 Expecting Mother
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('partner')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedRole === 'partner'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                        : 'bg-white/60 border-stone-200 text-stone-600'
                    }`}
                  >
                    🤝 Supportive Partner
                  </button>
                </div>

                {/* Name */}
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Full name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-stone-200/80 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#354D37]/30"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-stone-200/80 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#354D37]/30"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Choose password"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-stone-200/80 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#354D37]/30"
                  />
                </div>

                {/* Role Specific Field */}
                {selectedRole === 'mother' ? (
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      type="number"
                      min={1}
                      max={42}
                      value={gestationalWeek}
                      onChange={(e) => setGestationalWeek(Number(e.target.value))}
                      placeholder="Gestational Week (e.g. 24)"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-stone-200/80 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#354D37]/30"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={motherPairingCode}
                      onChange={(e) => setMotherPairingCode(e.target.value)}
                      placeholder="Mother's pairing code (e.g. MAMA-2026)"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-stone-200/80 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#354D37]/30"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#385139] hover:bg-[#2B402C] text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Create GarbSarthi Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Language Selector Dropdown at Bottom */}
            <div className="mt-4 pt-3 border-t border-stone-200/60 flex justify-center relative">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="px-3.5 py-1.5 bg-white/80 hover:bg-white border border-stone-200/80 rounded-xl text-[11px] font-semibold text-stone-700 flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <span>{currentLang.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {isLangMenuOpen && (
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-stone-200 py-1.5 w-44 z-30 animate-in fade-in zoom-in-95 duration-150">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(l.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          selectedLanguage === l.code
                            ? 'bg-[#354D37]/10 text-[#354D37] font-bold'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{l.label}</span>
                        {selectedLanguage === l.code && <span className="text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Sanctuary Footer */}
      <div className="relative z-10 w-full py-2.5 text-center text-[10px] text-stone-600 bg-white/40 backdrop-blur-xs border-t border-white/40 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span>End-to-End Encrypted Maternal & Family Health Suite • HIPAA & ABHA Compliant</span>
      </div>
    </div>
  );
};
