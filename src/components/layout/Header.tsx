'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { SUPPORTED_LANGUAGES } from '@/data/aiMedicalKnowledge';
import {
  Heart,
  Calendar,
  AlertTriangle,
  UserCheck,
  Users,
  Menu,
  Volume2,
  Sparkles,
  Compass,
  Palette,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, activeTab }) => {
  const {
    profile,
    currentUser,
    logout,
    activeRole,
    setActiveRole,
    selectedLanguage,
    setSelectedLanguage,
    triggerEmergencyModal,
    setIsOnboardingOpen,
    setIsDesignSystemOpen,
    t
  } = useApp();

  const getDaysRemaining = () => {
    const today = new Date();
    const edd = new Date(profile.estimatedDueDate);
    const diffTime = edd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = getDaysRemaining();
  const currentMonth = Math.min(9, Math.ceil(profile.currentGestationalWeek / 4.44));

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-border px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile toggle & Title breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <h2 className="text-sm font-serif font-bold text-foreground capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>
        </div>

        {/* Center: Gestational Tracker Pill */}
        <div className="flex items-center gap-2 md:gap-3 bg-muted/40 px-3.5 py-1.5 rounded-full border border-border shadow-xs text-xs md:text-sm">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <Heart className="w-3.5 h-3.5 fill-primary" />
            <span>{t('week')} {profile.currentGestationalWeek}</span>
            <span className="hidden md:inline font-normal text-muted-foreground">· {t('month')} {currentMonth}</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5 text-accent font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{daysLeft} {t('daysToEdd')}</span>
          </div>
        </div>

        {/* Right: Role switcher, Language, Onboarding, SOS */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Quick Onboarding Wizard Trigger */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="hidden xl:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-xl hover:bg-muted/50 transition-colors font-medium"
            title="Open Setup Wizard"
          >
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>{t('onboarding')}</span>
          </button>

          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="hidden md:block text-xs bg-card hover:bg-muted/40 text-foreground border border-input rounded-xl px-2.5 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            aria-label="Choose Language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.native})
              </option>
            ))}
          </select>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-muted/50 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveRole('mother')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeRole === 'mother'
                  ? 'bg-card text-primary shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('mother')}</span>
            </button>
            <button
              onClick={() => setActiveRole('partner')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeRole === 'partner'
                  ? 'bg-card text-accent shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('partner')}</span>
            </button>
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={() => triggerEmergencyModal('Maternal or newborn red flag symptoms reported by user. Direct emergency hospital dispatch protocol.')}
            className="flex items-center gap-1.5 bg-semantic-danger hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm hover:shadow-md transition-all shrink-0"
            title="Emergency Medical Triage Protocol"
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline">{t('sosEmergency')}</span>
          </button>

          {/* Logout button */}
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-xl transition-all font-semibold shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t('signOut')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
