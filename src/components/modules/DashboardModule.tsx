'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { WEEKS_DATA, MONTHS_DATA } from '@/data/pregnancyJourneyData';
import { calculateMaternalNutritionTargets } from '@/data/nutritionData';
import { FetalWeeklyHero } from '@/components/dashboard/FetalWeeklyHero';
import {
  getPregnancyMonth,
  getPregnancyTrimester,
  calculateFromDueDate
} from '@/utils/pregnancyCalculations';
import {
  Heart,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Droplets,
  Apple,
  Dumbbell,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Smile,
  Activity,
  Timer,
  ScrollText,
  Baby,
  Footprints,
  ShieldAlert,
  ArrowLeft,
  Users
} from 'lucide-react';

interface DashboardModuleProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    profile,
    updateProfile,
    dailyChecklist,
    toggleChecklistTask,
    addChecklistTask,
    vitals,
    addVitalRecord,
    meals,
    waterGlasses,
    incrementWater,
    decrementWater,
    reminders,
    activeRole,
    is511RuleAlertActive,
    contractions,
    unlinkPartner,
    pairPartnerWithMotherCode,
    availableMothers,
    setIsMotherSharedDashboardOpen,
    t
  } = useApp();

  const [connectingMotherId, setConnectingMotherId] = useState<string | null>(null);
  const [pairingNotice, setPairingNotice] = useState<{ success: boolean; message: string } | null>(null);
  const [manualMotherCode, setManualMotherCode] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTrackerWeek, setSelectedTrackerWeek] = useState(profile.currentGestationalWeek || 24);

  useEffect(() => {
    setSelectedTrackerWeek(profile.currentGestationalWeek || 24);
  }, [profile.currentGestationalWeek]);

  const currentWeek = profile.currentGestationalWeek || 24;
  const currentMonth = getPregnancyMonth(currentWeek);
  const currentTrimester = getPregnancyTrimester(currentWeek);
  const daysRemaining = calculateFromDueDate(profile.estimatedDueDate).daysRemaining;
  const weekInfo = WEEKS_DATA.find(w => w.week === selectedTrackerWeek) || WEEKS_DATA[selectedTrackerWeek - 1] || WEEKS_DATA[0];

  const clinicalRda = useMemo(() => {
    return calculateMaternalNutritionTargets(
      profile.currentGestationalWeek || 24,
      profile.prePregnancyWeightKg || 62,
      profile.heightCm || 163,
      profile.age || 29,
      Array.isArray(profile.medicalConditions) ? profile.medicalConditions.join(' ') : '',
      Array.isArray(profile.allergies) ? profile.allergies.join(' ') : ''
    );
  }, [profile]);

  const totalCalories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const targetCalories = clinicalRda.calories;
  const totalProtein = meals.reduce((acc, m) => acc + (m.proteinG || 0), 0);
  const targetProtein = clinicalRda.proteinG;

  const completedTasks = dailyChecklist.filter(t => t.completed).length;
  const checklistPercent = dailyChecklist.length > 0 ? Math.round((completedTasks / dailyChecklist.length) * 100) : 0;

  const latestVital = vitals[vitals.length - 1] || {
    bloodPressureSys: 118,
    bloodPressureDia: 78,
    weightKg: profile.currentWeightKg,
    pulseBpm: 78,
    kickCount: 18
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addChecklistTask({
      title: newTaskTitle.trim(),
      category: 'wellness'
    });
    setNewTaskTitle('');
  };

  // ==========================================
  // PARTNER DASHBOARD (Garbkosh Partner Sanctuary)
  // ==========================================
  if (activeRole === 'partner') {
    const partnerName = profile.partnerProfile?.name || 'Rohan';

    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-300">
        {/* Partner Connection Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-muted/40 border border-border shadow-soft">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-accent text-white font-bold text-sm shadow-soft">
              🤝
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">
                {currentUser?.isPaired
                  ? `${t('caregiverSuiteSync', 'Caregiver Suite: Synchronized with')} ${profile.name}'s ${t('maternalSanctuary', 'Pregnancy Sanctuary')}`
                  : t('unpairedCaregiverSuite', 'Caregiver Suite: Unpaired Partner Sanctuary (Zero Data Leakage Active)')}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {currentUser?.isPaired
                  ? t('caregiverSyncSub', 'Labor surge timing, kick counting, and weekly caregiver missions are synchronized.')
                  : t('unpairedCaregiverSub', 'Maternal records remain isolated until authorized by an eligible expecting mother.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {currentUser?.isPaired ? (
              <>
                <button
                  onClick={() => setIsMotherSharedDashboardOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🌸</span>
                  <span>{t('viewMotherDashboard', "View Mother's Shared Dashboard")}</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Disconnect from ${profile.name}'s maternal sanctuary? Sharing access will be revoked immediately.`)) {
                      unlinkPartner();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all cursor-pointer"
                >
                  {t('disconnect', 'Disconnect')}
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigateTab('partner-space')}
                className="px-3.5 py-1.5 rounded-xl bg-accent text-white text-xs font-bold transition-all shadow-xs"
              >
                {t('goToPartnerSpace', 'Go to Partner Space →')}
              </button>
            )}
          </div>
        </div>

        {/* Pairing Notification Feedback */}
        {pairingNotice && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            pairingNotice.success
              ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-700 border border-rose-500/30'
          }`}>
            <span>{pairingNotice.message}</span>
            <button onClick={() => setPairingNotice(null)} className="text-xs font-bold ml-2 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Unpaired Partner Privacy Alert & Registered Available Mothers Section */}
        {currentUser?.role === 'partner' && !currentUser?.isPaired && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col gap-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> {t('dataSequesteredTitle', 'Data Sequestered · Unpaired Partner Account')}
                  </span>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    {t('dataSequesteredDesc', 'Maternal clinical records, ultrasounds, and vitals are protected by cryptographic account isolation. Enter your partner\'s code below or choose an available mother.')}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-card border border-border text-foreground shrink-0 self-start sm:self-auto">
                  {t('yourCode', 'Your Code')}: {currentUser.uniqueCode}
                </span>
              </div>

              {/* Direct Code Entry */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!manualMotherCode.trim()) return;
                  const res = pairPartnerWithMotherCode(manualMotherCode.trim());
                  setPairingNotice(res);
                  if (res.success) setManualMotherCode('');
                }}
                className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-amber-500/20"
              >
                <input
                  type="text"
                  value={manualMotherCode}
                  onChange={e => setManualMotherCode(e.target.value.toUpperCase())}
                  placeholder={t('enterMotherCodePlaceholder', "Enter Mother's Code (e.g. MAMA-4819 for Priya, MAMA-6314 for Diya)")}
                  className="w-full sm:flex-1 px-3.5 py-2 rounded-xl bg-card border border-input text-xs font-mono font-bold tracking-wider placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  disabled={!manualMotherCode.trim()}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {t('connectCode', 'Connect Code')}
                </button>
              </form>
            </div>

            {/* Registered Available Mothers Directory (Requirement 3) */}
            <div className="p-6 bg-card rounded-3xl border border-border shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-foreground text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span>{t('registeredMothersTitle', 'Registered Available Mothers (Eligible for 1-to-1 Pairing)')}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t('registeredMothersDesc', 'Connect with your partner using her invitation code or directly from this authorized directory. Paired mothers are automatically excluded.')}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-bold shrink-0">
                  {availableMothers.filter(m => m.isAvailable).length} {t('available', 'Available')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {availableMothers.map(mother => {
                  const isAvailable = mother.isAvailable;
                  return (
                    <div
                      key={mother.id}
                      className={`p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between gap-3 ${
                        isAvailable
                          ? 'bg-card border-border hover:border-accent shadow-2xs'
                          : 'bg-muted/30 border-dashed border-border opacity-70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground text-sm">{mother.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}>
                            {isAvailable ? t('available', 'Available') : t('alreadyConnected', 'Already Connected')}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px]">
                          {t('week', 'Week')} {mother.gestationalWeek} · {t('due', 'Due')} {mother.estimatedDueDate}
                        </p>
                        <span className="font-mono text-[10px] text-muted-foreground block">
                          {t('code', 'Code')}: {mother.code}
                        </span>
                        {!isAvailable && mother.pairedPartnerName && (
                          <span className="text-[10px] text-stone-500 italic block">
                            {t('pairedWith', 'Paired with')} {mother.pairedPartnerName}
                          </span>
                        )}
                      </div>

                      {isAvailable ? (
                        <button
                          onClick={() => {
                            setConnectingMotherId(mother.id);
                            const res = pairPartnerWithMotherCode(mother.id);
                            setPairingNotice(res);
                            setConnectingMotherId(null);
                          }}
                          disabled={connectingMotherId === mother.id}
                          className="w-full py-2 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>{t('connectWith', 'Connect with')} {mother.name.split(' ')[0]}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="py-1.5 text-center text-[11px] font-semibold text-muted-foreground bg-muted/40 rounded-xl">
                          {t('notAvailableForPairing', 'Not available for pairing')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Hero Banner for Partner */}
        <div className="bg-hero-gradient rounded-4xl p-6 md:p-8 border border-border shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('week', 'Week')} {currentWeek} · {t('partnerReadiness', 'Partner Readiness')}</span>
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-foreground">
              Hello, {partnerName}! 🌿
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {profile.name.split(' ')[0]} and your baby ({profile.babyNickname || 'Little Bean'}) are in <strong>{t('week', 'Week')} {currentWeek}</strong>. {t('babySizeOf', 'Baby is approximately the size of an')} <strong>{weekInfo.babySizeFruit} {weekInfo.fruitEmoji}</strong>.
            </p>
          </div>

          <div className="p-4 bg-card/90 backdrop-blur-md rounded-3xl border border-border shadow-soft text-center shrink-0 min-w-[170px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">{t('dueCountdown', 'Due Date Countdown')}</span>
            <div className="text-3xl font-black text-foreground my-1">{daysRemaining}</div>
            <span className="text-[10px] text-muted-foreground">{t('daysUntil', 'days until')} {profile.estimatedDueDate}</span>
          </div>
        </div>

        {/* 5-1-1 Departure Notice if active */}
        {is511RuleAlertActive && (
          <div className="p-4 rounded-3xl bg-semantic-danger/10 border-2 border-semantic-danger text-foreground space-y-2 animate-pulse">
            <div className="flex items-center gap-2 text-semantic-danger font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5" />
              <span>{t('rule511AlertTitle', '5-1-1 Rule Active: Prepare for Hospital Departure')}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('rule511AlertBody', 'Contractions have reached the 5-1-1 threshold. Verify the car seat is installed, grab both packed bags, and phone hospital triage.')}
            </p>
          </div>
        )}

        {/* Partner Rapid Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigateTab('contractions')}
            className="p-5 bg-card rounded-3xl border border-border shadow-soft hover:shadow-card cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center font-bold">
                <Timer className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent-soft text-accent">
                {contractions.length} {t('surgesLogged', 'Surges Logged')}
              </span>
            </div>
            <h3 className="font-serif font-bold text-foreground text-sm group-hover:text-accent transition-colors">
              {t('laborContractionTimer', 'Labor Contraction Timer')}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('surgeTimerSubtitle', 'Time her labor surges with live stopwatch and automatic 5-1-1 rule hospital departure guidance.')}
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('birth-plan')}
            className="p-5 bg-card rounded-3xl border border-border shadow-soft hover:shadow-card cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold">
              <ScrollText className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-foreground text-sm group-hover:text-primary transition-colors">
              {t('birthPlanRole', 'Birth Plan & Hospital Role')}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('birthPlanSubtitle', 'Review her pain relief choices, lighting preferences, and partner cord-cutting instructions.')}
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('partner-space')}
            className="p-5 bg-card rounded-3xl border border-border shadow-soft hover:shadow-card cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-muted text-foreground flex items-center justify-center font-bold">
              <Footprints className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-serif font-bold text-foreground text-sm group-hover:text-primary transition-colors">
              {t('partnerMission', 'Partner Mission & Readiness')}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Trimester-adaptive caregiver advice, hospital checklist, and couple synchronization permissions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MOTHER DASHBOARD VIEW
  // ==========================================
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Partner Collaboration Status Card (Mother View) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-card border border-border shadow-xs text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center font-bold">
            🤝
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                {currentUser?.isPaired
                  ? `Caregiver Partner: ${profile.partnerProfile?.name || 'Rohan Rao'}`
                  : 'Partner Collaboration: Not Connected'}
              </span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                currentUser?.isPaired ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {currentUser?.isPaired ? 'Connected & Synced' : 'Awaiting Connection'}
              </span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              {currentUser?.isPaired
                ? 'Your partner receives approved pregnancy milestones, reminders, and birth prep tasks.'
                : `Share your private invitation code with your partner: ${currentUser?.uniqueCode || 'MAMA-2026'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {currentUser?.isPaired ? (
            <>
              <button
                onClick={() => onNavigateTab('settings')}
                className="px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-bold transition-all shadow-2xs cursor-pointer"
              >
                {t('managePermissions', 'Manage Permissions')}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to disconnect partner ${profile.partnerProfile?.name}? Their access to shared records will be revoked immediately.`)) {
                    unlinkPartner();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-rose-50 text-rose-600 font-bold transition-all cursor-pointer"
              >
                {t('disconnect', 'Disconnect')}
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigateTab('settings')}
              className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold transition-all shadow-xs cursor-pointer"
            >
              {t('sharePairingCode', 'Share Pairing Code →')}
            </button>
          )}
        </div>
      </div>

      {/* Fetal Weekly Development & Maternal Care Hero (UI/UX matching maternal mockup) */}
      <FetalWeeklyHero
        currentGestationalWeek={profile.currentGestationalWeek}
        estimatedDueDate={profile.estimatedDueDate}
      />

      {/* Quick Maternal Shortcuts Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {[
          { id: 'health-tracker', label: t('vitalsKicks', 'Log Vitals'), icon: Activity, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50' },
          { id: 'contractions', label: t('contractions', 'Contractions'), icon: Timer, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50' },
          { id: 'nutrition', label: t('nutrition', 'Meal Plans'), icon: Apple, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50' },
          { id: 'birth-plan', label: t('birthPlan', 'Birth Plan'), icon: ScrollText, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50' },
          { id: 'hospital-checklist', label: t('hospitalBag', 'Hospital Bag'), icon: Footprints, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/50' },
          { id: 'bloom-ai', label: t('bloomAi', 'Ask AI Care'), icon: Sparkles, color: 'text-primary bg-primary-soft dark:bg-primary/20 border-primary/30' },
        ].map(shortcut => {
          const Icon = shortcut.icon;
          return (
            <button
              key={shortcut.id}
              type="button"
              onClick={() => onNavigateTab(shortcut.id)}
              className="flex items-center gap-2 p-2.5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 shadow-2xs hover-card-lift tap-bounce transition-all text-left cursor-pointer group"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 ${shortcut.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {shortcut.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Health Overview, Checklist, Nutrition, Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Health Overview & Vitals */}
        <div className="space-y-6">
          <div className="bg-card rounded-4xl p-5 border border-border shadow-soft space-y-4 hover-card-lift">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                {t('recentVitals')}
              </h3>
              <button
                onClick={() => onNavigateTab('health-tracker')}
                className="text-xs text-primary hover:text-primary-hover font-bold tap-bounce"
              >
                {t('logVitals', 'Log Vitals')} →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 dark:bg-card/40 rounded-2xl border border-border/80 transition-all hover:border-primary/30">
                <span className="text-[11px] text-muted-foreground font-medium">{t('bloodPressure')}</span>
                <div className="text-lg font-mono font-extrabold text-foreground mt-0.5">
                  {latestVital.bloodPressureSys}/{latestVital.bloodPressureDia}{' '}
                  <span className="text-[10px] font-normal text-muted-foreground">mmHg</span>
                </div>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-md bg-primary-soft text-primary font-bold">
                  {t('normalRange', 'Normal Range')}
                </span>
              </div>

              <div className="p-3 bg-muted/30 dark:bg-card/40 rounded-2xl border border-border/80 transition-all hover:border-accent/30">
                <span className="text-[11px] text-muted-foreground font-medium">{t('weight')}</span>
                <div className="text-lg font-mono font-extrabold text-foreground mt-0.5">
                  {latestVital.weightKg}{' '}
                  <span className="text-[10px] font-normal text-muted-foreground">kg</span>
                </div>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-md bg-accent-soft text-accent font-bold">
                  +{((latestVital.weightKg - profile.prePregnancyWeightKg)).toFixed(1)} kg
                </span>
              </div>

              <div className="p-3 bg-muted/30 dark:bg-card/40 rounded-2xl border border-border/80 transition-all">
                <span className="text-[11px] text-muted-foreground font-medium">{t('pulse')}</span>
                <div className="text-lg font-mono font-extrabold text-foreground mt-0.5">
                  {latestVital.pulseBpm}{' '}
                  <span className="text-[10px] font-normal text-muted-foreground">bpm</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{t('normalRhythm', 'Normal rhythm')}</span>
              </div>

              <div className="p-3 bg-muted/30 dark:bg-card/40 rounded-2xl border border-border/80 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-medium">{t('kicksToday')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        addVitalRecord({
                          date: new Date().toISOString(),
                          bloodPressureSys: latestVital.bloodPressureSys || 118,
                          bloodPressureDia: latestVital.bloodPressureDia || 78,
                          weightKg: latestVital.weightKg || profile.currentWeightKg,
                          pulseBpm: latestVital.pulseBpm || 78,
                          kickCount: (latestVital.kickCount || 0) + 1
                        });
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 bg-primary text-white rounded-lg hover:bg-primary-hover tap-bounce cursor-pointer shadow-2xs"
                      title="Quick record 1 kick"
                    >
                      +1 Kick
                    </button>
                  </div>
                  <div className="text-lg font-mono font-extrabold text-foreground mt-0.5">
                    {latestVital.kickCount || 18}{' '}
                    <span className="text-[10px] font-normal text-muted-foreground">{t('kicks', 'kicks')}</span>
                  </div>
                </div>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-md bg-primary-soft text-primary font-bold">
                  {t('activeResponsive', 'Active & Responsive')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-2xl border border-border text-xs text-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>{t('activePrescriptionReminder', 'Active Prescription Reminder')}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t('prescriptionDetail', 'Ferrous Ascorbate 100mg & Vitamin D3 due at 8:30 PM. Remember: avoid taking calcium and iron together.')}
              </p>
            </div>
          </div>

          {/* Water Intake Tracker */}
          <div className="bg-card rounded-4xl p-5 border border-border shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-sky-500" />
                <h3 className="text-sm font-serif font-bold text-foreground">{t('waterIntake')}</h3>
              </div>
              <span className="text-xs font-bold text-primary">{waterGlasses} of 10 {t('glasses')} ({(waterGlasses * 0.25).toFixed(1)}L)</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-10 rounded-xl flex items-center justify-center transition-all ${
                    idx < waterGlasses
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-muted/30 border border-border text-muted-foreground/30'
                  }`}
                >
                  <Droplets className="w-4 h-4" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={decrementWater}
                className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors"
              >
                - 1 {t('glasses', 'Glass')}
              </button>
              <span className="text-xs text-muted-foreground font-medium">{t('goalLiters', 'Goal: 2.5 Liters daily')}</span>
              <button
                onClick={incrementWater}
                className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                + 1 {t('glasses', 'Glass')}
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Today's Health Checklist & Nutrition Progress */}
        <div className="space-y-6">
          <div className="bg-card rounded-4xl p-5 border border-border shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {t('todaysHealthChecklist')}
                </h3>
                <p className="text-xs text-muted-foreground">{completedTasks} of {dailyChecklist.length} {t('completedTasks')} ({checklistPercent}%)</p>
              </div>
              <span className="text-xs font-extrabold text-primary bg-primary-soft px-2.5 py-1 rounded-xl">
                {checklistPercent}%
              </span>
            </div>

            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${checklistPercent}%` }}
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {dailyChecklist.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleChecklistTask(task.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    task.completed
                      ? 'bg-muted/20 border-border text-muted-foreground'
                      : 'bg-card border-border hover:border-primary/50 text-foreground'
                  }`}
                >
                  <button className="mt-0.5 text-primary shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 fill-primary text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/40" />
                    )}
                  </button>
                  <div className="flex-1 text-xs">
                    <p className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {t(task.title)}
                    </p>
                    {task.time && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {t(task.time)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={t('enterNewTask', 'Add daily prenatal task...')}
                className="flex-1 text-xs px-3 py-2 bg-muted/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors shrink-0"
                title="Add task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Nutrition Progress */}
          <div className="bg-card rounded-4xl p-5 border border-border shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
                <Apple className="w-4 h-4 text-primary" />
                {t('dailyNutritionOverview')}
              </h3>
              <button
                onClick={() => onNavigateTab('nutrition')}
                className="text-xs text-primary hover:text-primary-hover font-semibold"
              >
                {t('foodDiary', 'Food Diary')}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">{t('calories')}: {totalCalories} / {targetCalories} kcal</span>
                  <span className="text-muted-foreground">{Math.round((totalCalories / targetCalories) * 100)}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min(100, (totalCalories / targetCalories) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">{t('protein')}: {totalProtein} / {targetProtein} g</span>
                  <span className="text-muted-foreground">{Math.round((totalProtein / targetProtein) * 100)}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full"
                    style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Appointments & Quick Feature Launchers */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-card rounded-4xl p-5 border border-border shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                {t('upcomingReminders')}
              </h3>
              <button
                onClick={() => onNavigateTab('health-tracker')}
                className="text-xs text-accent hover:underline font-semibold"
              >
                {t('viewAll', 'View All')}
              </button>
            </div>

            <div className="space-y-2.5">
              {reminders.slice(0, 3).map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 bg-muted/30 rounded-2xl border border-border space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{t(rem.title)}</span>
                    <span className="px-2 py-0.5 bg-card text-foreground rounded-md font-semibold text-[10px] border border-border">
                      {rem.date}
                    </span>
                  </div>
                  {rem.doctorOrLocation && (
                    <p className="text-[11px] text-muted-foreground">{t(rem.doctorOrLocation)} · {t(rem.time)}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('bloom-ai')}
              className="w-full py-2.5 bg-primary-soft hover:bg-primary-soft/80 text-primary rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('askGnaniDoctorQuestions', 'Ask Gnani AI questions for next doctor visit')}</span>
            </button>
          </div>

          {/* Complete Suite Feature Shortcuts */}
          <div className="bg-card rounded-4xl p-5 border border-border shadow-soft space-y-3">
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-muted-foreground">
              {t('allMaternalModules', 'All GarbhSarthi Maternal Modules')}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateTab('contractions')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">⏱️</span>
                {t('contractions', 'Surge Timer (5-1-1)')}
              </button>

              <button
                onClick={() => onNavigateTab('birth-plan')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">📜</span>
                {t('birthPlan', 'Birth Plan Builder')}
              </button>

              <button
                onClick={() => onNavigateTab('relaxation')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">🎧</span>
                {t('soundscapes', 'Sleep & Soundscapes')}
              </button>

              <button
                onClick={() => onNavigateTab('little-moments')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">📸</span>
                {t('memoryVault', 'Ultrasound Vault')}
              </button>

              <button
                onClick={() => onNavigateTab('hospital-checklist')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">🧳</span>
                {t('hospitalBag', 'Hospital Bag List')}
              </button>

              <button
                onClick={() => onNavigateTab('baby-names')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">📖</span>
                {t('babyNames', 'Baby Names Explorer')}
              </button>

              <button
                onClick={() => onNavigateTab('baby-shower')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">🎉</span>
                {t('babyShower', 'Baby Shower Planner')}
              </button>

              <button
                onClick={() => onNavigateTab('baby-care')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">👶</span>
                {t('newbornCare', 'Newborn Care Tracker')}
              </button>

              <button
                onClick={() => onNavigateTab('postpartum')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">🌸</span>
                {t('fourthTrimester', 'Fourth Trimester')}
              </button>

              <button
                onClick={() => onNavigateTab('baby-shopping')}
                className="p-2.5 bg-muted/20 hover:bg-muted/50 rounded-2xl border border-border font-semibold text-foreground text-left transition-all cursor-pointer"
              >
                <span className="text-sm block mb-0.5">🛍️</span>
                {t('nurseryRegistry', 'Nursery Registry')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
