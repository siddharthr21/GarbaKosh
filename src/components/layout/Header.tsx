'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { SUPPORTED_LANGUAGES } from '@/data/aiMedicalKnowledge';
import {
  getPregnancyMonth,
  getPregnancyTrimester,
  calculateFromDueDate
} from '@/utils/pregnancyCalculations';
import {
  Heart,
  Calendar,
  AlertTriangle,
  UserCheck,
  Users,
  Menu,
  Sparkles,
  Compass,
  LogOut,
  ArrowLeft,
  Globe,
  Sun,
  Moon,
  Edit3
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  activeTab: string;
  onNavigateTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  activeTab,
  onNavigateTab
}) => {
  const {
    profile,
    currentUser,
    logout,
    activeRole,
    selectedLanguage,
    setSelectedLanguage,
    triggerEmergencyModal,
    setIsOnboardingOpen,
    setIsMotherSharedDashboardOpen,
    theme,
    toggleTheme,
    t
  } = useApp();

  const isMother = currentUser?.role === 'mother';
  const isPaired = currentUser?.isPaired;

  const timing = useMemo(() => {
    return calculateFromDueDate(profile.estimatedDueDate);
  }, [profile.estimatedDueDate, profile.currentGestationalWeek]);

  const currentWeek = profile.currentGestationalWeek || timing.gestationalWeek;
  const currentMonth = getPregnancyMonth(currentWeek);
  const currentTrimester = getPregnancyTrimester(currentWeek);
  const daysLeft = timing.daysRemaining;

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-border px-3 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto w-full">
        {/* Left: Mobile Toggle, Back Button (if on subpage), & Title Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <img
            src="/garbhsarthi-logo.jpg"
            alt="GarbhSarthi Logo"
            className="w-7 h-7 rounded-xl object-cover lg:hidden border border-border shadow-2xs shrink-0 bg-white"
          />

          {/* Quick Exit / Return to Dashboard Back Button if user is on any other tab */}
          {activeTab !== 'dashboard' && onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-card hover:bg-muted border border-border text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs shrink-0"
              title="Return to Home Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline text-xs">{t('homeDashboard', 'Dashboard')}</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="text-xs sm:text-sm font-serif font-bold text-foreground capitalize truncate max-w-[120px] md:max-w-none">
              {t(activeTab, activeTab)}
            </h2>
          </div>
        </div>

        {/* Center: Gestational Tracker Pill (Shown gracefully on large screens, compact on medium) */}
        <div className="hidden lg:flex items-center gap-2 bg-muted/40 px-3.5 py-1 rounded-full border border-border shadow-xs text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <Heart className="w-3.5 h-3.5 fill-primary shrink-0" />
            <span>{t('week', 'Week')} {currentWeek}</span>
            <span className="font-normal text-muted-foreground">· {t('month', 'Month')} {currentMonth}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary-soft text-primary font-semibold">
              T{currentTrimester}
            </span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5 text-accent font-medium">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span suppressHydrationWarning>{daysLeft} {t('daysToEdd', 'days to EDD')}</span>
          </div>
        </div>

        {/* Right Section: Compact Language, Role Badge, SOS Emergency & Exit Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Onboarding Trigger (Only on extra large screens) */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="hidden 2xl:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-xl hover:bg-muted/50 transition-colors font-medium cursor-pointer"
            title="Open Setup Wizard"
          >
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>{t('onboarding')}</span>
          </button>

          {/* Language Selector (Clean & Compact) */}
          <div className="relative hidden md:flex items-center shrink-0">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs bg-card hover:bg-muted/40 text-foreground border border-input rounded-xl pl-2.5 pr-6 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary font-medium appearance-none shadow-2xs max-w-[110px] truncate"
              aria-label="Choose Language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native}
                </option>
              ))}
            </select>
            <Globe className="w-3 h-3 text-muted-foreground absolute right-2 pointer-events-none" />
          </div>

          {/* Account Role & Pairing Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-2xs ${
                isMother
                  ? 'bg-primary-soft text-primary border-primary/30'
                  : 'bg-accent-soft text-accent border-accent/30'
              }`}
            >
              {isMother ? <UserCheck className="w-3.5 h-3.5 shrink-0" /> : <Users className="w-3.5 h-3.5 shrink-0" />}
              <span className="hidden xl:inline">
                {isMother ? t('mother', 'Mother') : t('partner', 'Partner')}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                  isPaired ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {isPaired ? t('active', 'Paired') : t('unpaired', 'Unpaired')}
              </span>
            </div>

            {/* If Paired Partner: Quick shortcut to View Mother's Shared Dashboard */}
            {!isMother && isPaired && (
              <button
                onClick={() => setIsMotherSharedDashboardOpen(true)}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-card hover:bg-muted border border-border text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
                title="View Mother's Shared Dashboard"
              >
                <span>🌸</span>
                <span className="text-[11px]">Shared</span>
              </button>
            )}
          </div>

          {/* Theme Toggle Button (Light / Dark Mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-xl bg-card hover:bg-muted border border-border text-foreground transition-all cursor-pointer shadow-2xs shrink-0"
            title={theme === 'dark' ? 'Switch to Gentle Day Palette' : 'Switch to Night Maternal Sanctuary'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-500 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Emergency SOS Button with Doctor Edit Option */}
          <div className="inline-flex items-center rounded-xl shadow-xs shrink-0">
            <button
              type="button"
              onClick={() =>
                triggerEmergencyModal(
                  'Maternal or newborn red flag symptoms reported by user. Direct emergency hospital dispatch protocol.'
                )
              }
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-l-xl transition-all cursor-pointer"
              title="Emergency Medical Triage Protocol"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-pulse" />
              <span className="tracking-tight font-bold">SOS Emergency</span>
            </button>
            <button
              type="button"
              onClick={() => triggerEmergencyModal('EDIT_DOCTOR')}
              className="flex items-center justify-center bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-rose-100 hover:text-white px-2 py-1.5 rounded-r-xl border-l border-rose-500/50 transition-all cursor-pointer"
              title="Edit Doctor Name & Phone Number for SOS Emergency"
              aria-label="Edit Doctor Name & Phone Number"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Exit / Sign Out Button */}
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 hover:text-rose-600 bg-card hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-border px-2.5 sm:px-3 py-1.5 rounded-xl transition-all font-semibold shrink-0 cursor-pointer shadow-2xs"
            title="Exit & Sign Out"
            aria-label="Exit and Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>{t('signOut', 'Exit')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
