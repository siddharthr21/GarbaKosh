'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateFromDueDate } from '@/utils/pregnancyCalculations';
import {
  HeartHandshake,
  Users,
  Copy,
  Check,
  Share2,
  Calendar,
  Lock,
  Unlock,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Heart,
  Baby,
  Smile,
  ListTodo,
  Timer,
  ScrollText,
  AlertTriangle,
  ArrowRight,
  Footprints,
  UserCheck,
  Unlink,
  CheckCircle2
} from 'lucide-react';

export const PartnerSpaceModule: React.FC<{ onNavigateTab?: (tab: string) => void }> = ({ onNavigateTab }) => {
  const {
    profile,
    updateProfile,
    currentUser,
    pairPartnerWithMotherCode,
    unlinkPartner,
    availableMothers,
    setIsMotherSharedDashboardOpen,
    activeRelationship,
    t
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [motherCodeInput, setMotherCodeInput] = useState('');
  const [pairingStatus, setPairingStatus] = useState<{ success?: boolean; text?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear role & pairing flags
  const isMother = currentUser?.role === 'mother';
  const isPartner = currentUser?.role === 'partner';
  const isPaired = Boolean(currentUser?.isPaired);

  // Derived names & security codes
  const motherName = isMother
    ? currentUser?.name || 'Expecting Mother'
    : activeRelationship?.mother_name || currentUser?.profile.partnerProfile?.name || 'Expecting Mother';

  const motherCode = isMother
    ? currentUser?.uniqueCode || 'MAMA-2026'
    : activeRelationship?.mother_code || currentUser?.partnerLinkedCode || profile.partnerProfile?.pairingCode || 'MAMA-2026';

  const partnerName = isPartner
    ? currentUser?.name || 'Partner'
    : activeRelationship?.partner_name || currentUser?.profile.partnerProfile?.name || 'Supportive Partner';

  const partnerCode = isPartner
    ? currentUser?.uniqueCode || 'PAPA-7140'
    : activeRelationship?.partner_code || currentUser?.partnerLinkedCode || 'PAPA-7140';

  const handlePairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = motherCodeInput.trim();
    if (!code) return;
    setIsSubmitting(true);
    const res = pairPartnerWithMotherCode(code);
    setIsSubmitting(false);
    setPairingStatus({ success: res.success, text: res.message });
    if (res.success) {
      setMotherCodeInput('');
    }
  };

  const handleQuickConnect = (motherIdOrCode: string) => {
    setIsSubmitting(true);
    const res = pairPartnerWithMotherCode(motherIdOrCode);
    setIsSubmitting(false);
    setPairingStatus({ success: res.success, text: res.message });
  };

  const handleUnlink = () => {
    const targetLabel = isMother ? 'your partner' : 'this maternal sanctuary';
    if (confirm(`Are you sure you want to disconnect from ${targetLabel}? Synced caregiver data will be revoked until reconnected.`)) {
      const res = unlinkPartner();
      setPairingStatus({ success: true, text: res.message || 'Accounts successfully unlinked.' });
    }
  };

  const [partnerChecklist, setPartnerChecklist] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('garbhsarthi_partner_checklist') || localStorage.getItem('bloomnest_partner_checklist');
      if (saved) try { return JSON.parse(saved); } catch {}
    }
    return {
      car_seat: true,
      bag_packed: false,
      birth_plan: true,
      contacts_saved: true,
      five_one_one: true,
      station_ready: false,
    };
  });

  const toggleChecklistItem = (key: string) => {
    const updated = { ...partnerChecklist, [key]: !partnerChecklist[key] };
    setPartnerChecklist(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('garbhsarthi_partner_checklist', JSON.stringify(updated));
      localStorage.setItem('bloomnest_partner_checklist', JSON.stringify(updated));
    }
  };

  const copyCode = (codeToCopy: string) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTogglePermission = (permKey: keyof typeof profile.sharingPermissions) => {
    if (!isMother) return;
    updateProfile({
      sharingPermissions: {
        ...profile.sharingPermissions,
        [permKey]: !profile.sharingPermissions[permKey]
      }
    });
  };

  const week = profile.currentGestationalWeek || 24;
  const daysRemaining = calculateFromDueDate(profile.estimatedDueDate || '2027-02-16').daysRemaining;

  // Garbkosh Trimester-Adaptive Partner Mission
  const getPartnerWeeklyMission = (currentWeek: number) => {
    if (currentWeek < 14) {
      return {
        focus: 'First Trimester Comfort & Reassurance',
        tip: 'Her body is working overtime building the placenta and adapting to hormonal surges. Take over evening meal prep and grocery runs to protect her from strong cooking aromas that might trigger morning sickness.',
        action: 'Offer chilled sparkling water with fresh lemon slices, keep crackers by her bedside, and encourage guilt-free 20-minute daytime naps.'
      };
    } else if (currentWeek < 28) {
      return {
        focus: 'Second Trimester Support & Active Bonding',
        tip: 'Baby can now clearly hear external low-frequency voices! Placing your hand on her lower belly and talking, singing, or reading aloud helps baby recognize your voice before birth.',
        action: 'Offer a 10-minute gentle lower back counter-pressure massage while she rests on her left side with a pillow between her knees.'
      };
    } else {
      return {
        focus: 'Third Trimester Labor Preparation & Readiness',
        tip: 'Physical strain is at its peak and sleep can be fragmented. Take the lead on installing the car seat, packing partner hospital snacks, and memorizing her birth plan preferences.',
        action: 'Practice the 5-1-1 contraction timing rule and keep the car fueled so you are calm and ready when labor begins.'
      };
    }
  };

  const mission = getPartnerWeeklyMission(week);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* ======================================================== */}
      {/* 1. Header & Identity Summary                              */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
            isMother ? 'bg-primary-soft text-primary' : 'bg-accent-soft text-accent'
          }`}>
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>
              {isMother
                ? t('Family Collaboration', 'Mother Sanctuary · Family & Caregiver Suite')
                : t('Caregiver Suite', 'Partner Sanctuary · GarbaKosh Caregiver Suite')}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-foreground">
            {isMother
              ? t('partnerCollabTitle', 'Partner Collaboration & Family Sanctuary')
              : t('partnerSanctuaryTitle', 'Partner Sanctuary & Caregiver Tools')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isMother
              ? t('motherSubtitle', 'Coordinate hospital packing, birth plans, and labor support with your partner.')
              : t('partnerSubtitle', 'Caregiver tools for labor surge timing, kick monitoring, and supportive trimester missions.')}
          </p>
        </div>

        {/* Top Right Badges */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {isPartner && isPaired && (
            <button
              onClick={() => setIsMotherSharedDashboardOpen(true)}
              className="px-4 py-2 rounded-2xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🌸</span>
              <span>{t("View Mother's Shared Dashboard", "View Mother's Shared Dashboard")}</span>
            </button>
          )}

          <div className="px-3.5 py-1.5 rounded-2xl bg-card border border-border text-xs font-bold flex items-center gap-2 shadow-2xs">
            <span className={`w-2 h-2 rounded-full ${isPaired ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
            <span className="capitalize">{currentUser?.role}: {currentUser?.uniqueCode}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
              isPaired ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
            }`}>
              {isPaired ? t('Connected', 'Connected') : t('Unpaired', 'Unpaired')}
            </span>
          </div>
        </div>
      </div>

      {/* Global Status Banner */}
      {pairingStatus && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border animate-in fade-in ${
          pairingStatus.success
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
        }`}>
          <span>{pairingStatus.text}</span>
          <button
            onClick={() => setPairingStatus(null)}
            className="text-xs font-bold hover:underline ml-3 cursor-pointer shrink-0"
          >
            {t('Dismiss', 'Dismiss')}
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MATCHING & PAIRING MATRIX (Role-Specific & Glitch-Free) */}
      {/* ======================================================== */}

      {/* CASE A: UNPAIRED MOTHER -> Invite Her Partner */}
      {isMother && !isPaired && (
        <div className="bg-gradient-to-r from-cream-100 via-primary-soft/40 to-blush-50 rounded-4xl p-6 md:p-8 border border-primary/20 shadow-soft space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold inline-flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>Invite Your Partner to Your Sanctuary</span>
              </span>
              <h2 className="text-xl font-serif font-bold text-foreground">
                Connect Your Partner with Your Pregnancy Journey
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When your partner connects using your private code, they can view your approved milestones, pack the hospital bag collaboratively, review the birth plan, and receive helpful trimester guidance.
              </p>
            </div>

            {/* Mother's Invitation Code Box */}
            <div className="p-5 bg-card rounded-3xl border border-primary/30 shadow-card text-center min-w-[240px] space-y-3 shrink-0">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
                Your Private Mother Code
              </span>
              <div className="text-2xl font-mono font-black text-primary tracking-widest bg-primary-soft/40 py-2 rounded-2xl border border-primary/20">
                {motherCode}
              </div>
              <button
                onClick={() => copyCode(motherCode)}
                className="w-full py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code for Partner'}</span>
              </button>
            </div>
          </div>

          {/* Simple 2-Step Walkthrough */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-border/60">
            <div className="p-3.5 bg-card/80 rounded-2xl border border-border space-y-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary-soft text-primary flex items-center justify-center text-[10px] font-black">1</span>
                <span>Send Code to Partner</span>
              </span>
              <p className="text-muted-foreground text-[11px]">
                Copy code <strong>{motherCode}</strong> and send it to your partner via WhatsApp, text, or email.
              </p>
            </div>

            <div className="p-3.5 bg-card/80 rounded-2xl border border-border space-y-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary-soft text-primary flex items-center justify-center text-[10px] font-black">2</span>
                <span>Partner Connects in 1 Step</span>
              </span>
              <p className="text-muted-foreground text-[11px]">
                Your partner signs in as a <strong>Partner</strong> and enters your code in their Partner Sanctuary.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CASE B: PAIRED MOTHER -> Synchronized with Partner */}
      {isMother && isPaired && (
        <div className="bg-gradient-to-r from-cream-100 via-primary-soft/30 to-accent-soft/30 rounded-4xl p-6 md:p-8 border border-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Couples Synchronized & Connected
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground">
              Connected with {partnerName}
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Your partner account ({partnerCode}) is synchronized with your pregnancy sanctuary. You retain unilateral control over which clinical records and summaries are shared.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => onNavigateTab && onNavigateTab('settings')}
                className="px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>⚙️</span>
                <span>Manage Sharing & Privacy</span>
              </button>

              <button
                onClick={handleUnlink}
                className="px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect Partner</span>
              </button>
            </div>
          </div>

          {/* Connection Card */}
          <div className="p-4 bg-card rounded-2xl border border-border shadow-soft text-center shrink-0 min-w-[220px] space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
              <span>Your Mother Code</span>
              <span className="font-mono text-primary font-black">{motherCode}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-t border-border pt-1">
              <span>Partner Code</span>
              <span className="font-mono text-accent font-black">{partnerCode}</span>
            </div>
            <button
              onClick={() => copyCode(motherCode)}
              className="w-full py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold flex items-center justify-center gap-1.5 transition-colors mt-2 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Mother Code'}</span>
            </button>
          </div>
        </div>
      )}

      {/* CASE C: UNPAIRED PARTNER -> Enter Code or Pick from Directory */}
      {isPartner && !isPaired && (
        <div className="space-y-6">
          {/* Unpaired Security Notice & Input */}
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-4xl p-6 md:p-8 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>Zero Data Leakage Security Active · Unpaired Partner Account</span>
                </div>
                <h2 className="text-lg font-serif font-bold text-foreground">
                  Welcome, {currentUser?.name || 'Partner'}!
                </h2>
                <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  Maternal clinical records, ultrasound images, and vitals logs are protected by cryptographic account isolation. Enter your partner's code below or select an available expecting mother to begin 1-to-1 synchronization.
                </p>
              </div>

              <div className="p-3.5 bg-card rounded-2xl border border-border text-center shrink-0 min-w-[170px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Your Partner Code</span>
                <span className="text-lg font-mono font-black text-foreground">{partnerCode}</span>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handlePairSubmit} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={motherCodeInput}
                  onChange={e => setMotherCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter Mother's Code (e.g. MAMA-4819 for Priya, MAMA-6314 for Diya)"
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-input text-xs font-mono font-bold tracking-wider placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !motherCodeInput.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Connecting...' : 'Connect Sanctuary'}
              </button>
            </form>
          </div>

          {/* Available Registered Mothers Directory */}
          <div className="p-6 bg-card rounded-4xl border border-border shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-foreground text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span>Registered Available Mothers (Eligible for 1-to-1 Pairing)</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Under strict 1-to-1 pairing rules, only genuinely available expecting mothers are displayed. Paired mothers are automatically excluded from new connections.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-bold shrink-0 self-start sm:self-auto">
                {availableMothers.filter(m => m.isAvailable).length} Available for Pairing
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {availableMothers.map(mother => {
                const isAvail = mother.isAvailable;
                return (
                  <div
                    key={mother.id}
                    className={`p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between gap-3 ${
                      isAvail
                        ? 'bg-card border-border hover:border-accent shadow-2xs'
                        : 'bg-muted/30 border-dashed border-border opacity-70'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-sm">{mother.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAvail
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}>
                          {isAvail ? 'Available' : 'Already Connected'}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Week {mother.gestationalWeek} · Due {mother.estimatedDueDate}
                      </p>
                      <span className="font-mono text-[10px] text-muted-foreground block">
                        Invitation Code: {mother.code}
                      </span>
                      {!isAvail && mother.pairedPartnerName && (
                        <span className="text-[10px] text-stone-500 italic block">
                          Paired with {mother.pairedPartnerName}
                        </span>
                      )}
                    </div>

                    {isAvail ? (
                      <button
                        onClick={() => handleQuickConnect(mother.id)}
                        disabled={isSubmitting}
                        className="w-full py-2 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <span>Connect with {mother.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="py-1.5 text-center text-[11px] font-semibold text-muted-foreground bg-muted/40 rounded-xl">
                        Not available for pairing
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CASE D: PAIRED PARTNER -> Connected to Mother */}
      {isPartner && isPaired && (
        <div className="bg-gradient-to-r from-cream-100 via-primary-soft/30 to-accent-soft/30 rounded-4xl p-6 md:p-8 border border-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Couples Synchronized & Connected
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground">
              Connected with {motherName}
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Week {week} · {daysRemaining} days to estimated due date. Both accounts share milestones, hospital bag items, shortlisted baby names, and doctor reminders.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => setIsMotherSharedDashboardOpen(true)}
                className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>🌸</span>
                <span>View Mother's Shared Dashboard</span>
              </button>

              <button
                onClick={handleUnlink}
                className="px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect from Sanctuary</span>
              </button>
            </div>
          </div>

          {/* Pairing Code Card */}
          <div className="p-4 bg-card rounded-2xl border border-border shadow-soft text-center shrink-0 min-w-[220px] space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
              <span>Mother Code</span>
              <span className="font-mono text-primary font-black">{motherCode}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-t border-border pt-1">
              <span>Your Partner Code</span>
              <span className="font-mono text-accent font-black">{partnerCode}</span>
            </div>
            <button
              onClick={() => copyCode(partnerCode)}
              className="w-full py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold flex items-center justify-center gap-1.5 transition-colors mt-2 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Partner Code'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. Caregiver Mission & Rapid Actions                      */}
      {/* ======================================================== */}
      <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Week {week} Caregiver Mission</span>
              <h3 className="text-base font-serif font-bold text-foreground">{mission.focus}</h3>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-soft text-primary">
            Trimester {week < 14 ? 1 : week < 28 ? 2 : 3}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {mission.tip}
        </p>

        <div className="p-3 bg-muted/40 rounded-2xl border border-border text-xs text-foreground flex items-center gap-2">
          <Heart className="w-4 h-4 text-accent shrink-0" />
          <span><strong>Action for today:</strong> {mission.action}</span>
        </div>
      </div>

      {/* Partner Quick Caregiver Tools & Hospital Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caregiver Rapid Actions */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-foreground">{t('caregiverTools', 'Rapid Caregiver Tools')}</h3>
              <p className="text-xs text-muted-foreground">{t('Direct actions for birth readiness', 'Direct actions for birth readiness')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => onNavigateTab && onNavigateTab('contractions')}
              className="p-4 rounded-2xl border border-border bg-card hover:bg-muted/30 text-left transition-all space-y-1.5 shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between text-accent font-bold">
                <span className="flex items-center gap-1.5">
                  <Timer className="w-4 h-4" /> {t('Labor Surge Timer', 'Labor Surge Timer')}
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t('Time contractions with automated 5-1-1 hospital departure guidance.', 'Time contractions with automated 5-1-1 hospital departure guidance.')}
              </p>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('birth-plan')}
              className="p-4 rounded-2xl border border-border bg-card hover:bg-muted/30 text-left transition-all space-y-1.5 shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between text-primary font-bold">
                <span className="flex items-center gap-1.5">
                  <ScrollText className="w-4 h-4" /> {t('Birth Plan Review', 'Birth Plan Review')}
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t('Review her pain relief choices, lighting, and your partner cord-cutting role.', 'Review her pain relief choices, lighting, and your partner cord-cutting role.')}
              </p>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('health-tracker')}
              className="p-4 rounded-2xl border border-border bg-card hover:bg-muted/30 text-left transition-all space-y-1.5 shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between text-foreground font-bold">
                <span className="flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-emerald-600" /> {t('Evening Kick Counter', 'Evening Kick Counter')}
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t('Bond with baby during quiet evening movement sessions.', 'Bond with baby during quiet evening movement sessions.')}
              </p>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('bloom-ai')}
              className="p-4 rounded-2xl border border-border bg-card hover:bg-muted/30 text-left transition-all space-y-1.5 shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between text-accent font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> {t('Partner AI Assistant', 'Partner AI Assistant')}
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t('Ask clinical questions on comfort measures, back labor, and red flags.', 'Ask clinical questions on comfort measures, back labor, and red flags.')}
              </p>
            </button>
          </div>
        </div>

        {/* Partner Hospital & Nursery Preparedness Checklist */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-foreground">{t('partnerReadinessChecklist', 'Partner Readiness Checklist')}</h3>
                <p className="text-xs text-muted-foreground">{t('Physical tasks to relieve maternal anxiety', 'Physical tasks to relieve maternal anxiety')}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary">
              {Object.values(partnerChecklist).filter(Boolean).length} of {Object.keys(partnerChecklist).length} {t('Ready', 'Ready')}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { key: 'car_seat', label: t('Infant car seat securely installed & inspected in vehicle', 'Infant car seat securely installed & inspected in vehicle') },
              { key: 'bag_packed', label: t('Partner overnight hospital bag & 10ft phone chargers packed', 'Partner overnight hospital bag & 10ft phone chargers packed') },
              { key: 'birth_plan', label: t('Birth preferences and cord-cutting wishes memorized', 'Birth preferences and cord-cutting wishes memorized') },
              { key: 'contacts_saved', label: t('Pediatric triage & labor ward emergency contacts in speed dial', 'Pediatric triage & labor ward emergency contacts in speed dial') },
              { key: 'five_one_one', label: t('5-1-1 contraction rule understood for hospital departure', '5-1-1 contraction rule understood for hospital departure') },
              { key: 'station_ready', label: t('Home recovery & newborn bassinet station sanitized and ready', 'Home recovery & newborn bassinet station sanitized and ready') }
            ].map(item => {
              const isDone = partnerChecklist[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleChecklistItem(item.key)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isDone ? 'bg-primary-soft/40 border-primary text-foreground' : 'bg-muted/10 border-border text-muted-foreground'
                  }`}
                >
                  <span className={isDone ? 'line-through opacity-70 font-medium' : 'font-medium'}>
                    {item.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => {}}
                    className="rounded text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. Granular Sharing Permissions Panel                     */}
      {/* ======================================================== */}
      <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-foreground">
                {isMother ? 'Your Granular Privacy & Sharing Controls' : 'Maternal Privacy & Synchronized Permissions'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isMother
                  ? 'You retain unilateral sovereignty over which personal clinical records are shared with your partner.'
                  : 'Configured by the expecting mother under strict cryptographic zero-data-leakage protocols.'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {isMother ? 'Editable by You' : 'Read-Only for Partner'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { key: 'shareVitals', label: 'Blood Pressure & Weight Logs' },
            { key: 'shareMood', label: 'Daily Emotional Journal' },
            { key: 'shareUltrasounds', label: 'Ultrasound Scans & Vault' },
            { key: 'shareAppointments', label: 'Doctor Appointments' },
            { key: 'shareHospitalChecklist', label: 'Hospital Bag Checklist' },
            { key: 'shareBirthPlan', label: 'Birth Plan Preferences' }
          ].map(item => {
            const isEnabled = Boolean((profile.sharingPermissions as any)[item.key]);

            return (
              <div
                key={item.key}
                onClick={() => isMother && handleTogglePermission(item.key as any)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                  isMother ? 'cursor-pointer hover:border-primary/50' : 'cursor-default'
                } ${
                  isEnabled
                    ? 'bg-primary-soft/60 border-primary text-foreground font-semibold'
                    : 'bg-muted/30 border-border text-muted-foreground'
                }`}
              >
                <span>{item.label}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  isEnabled ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {isEnabled ? 'Shared' : 'Private'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
