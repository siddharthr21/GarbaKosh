'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { SUPPORTED_LANGUAGES } from '@/data/aiMedicalKnowledge';
import {
  Home,
  Milestone,
  Sparkles,
  Activity,
  Timer,
  ScrollText,
  Apple,
  HeartPulse,
  SunMedium,
  Headphones,
  FileText,
  Users,
  Briefcase,
  BookOpen,
  PartyPopper,
  ShoppingBag,
  CalendarHeart,
  Baby,
  Settings,
  Globe,
  LogOut,
  X,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const {
    profile,
    currentUser,
    logout,
    activeRole,
    triggerEmergencyModal,
    selectedLanguage,
    setSelectedLanguage,
    is511RuleAlertActive,
    setIsMotherSharedDashboardOpen,
    t
  } = useApp();

  const NAV_SECTIONS = [
    {
      title: t('clinicalTracking'),
      items: [
        { id: 'dashboard', label: t('homeDashboard'), icon: Home },
        { id: 'journey', label: t('journey'), icon: Milestone },
        { id: 'bloom-ai', label: t('bloomAi'), icon: Sparkles },
        { id: 'health-tracker', label: t('vitalsKicks'), icon: Activity },
        { id: 'contractions', label: t('contractions'), icon: Timer, badge: is511RuleAlertActive ? '5-1-1' : undefined },
        { id: 'birth-plan', label: t('birthPlan'), icon: ScrollText },
      ]
    },
    {
      title: t('maternalHealth'),
      items: [
        { id: 'nutrition', label: t('nutrition'), icon: Apple },
        { id: 'exercise', label: t('exercise'), icon: HeartPulse },
        { id: 'mood-wellness', label: t('emotionalWellness'), icon: SunMedium },
        { id: 'relaxation', label: t('soundscapes'), icon: Headphones },
        { id: 'little-moments', label: t('memoryVault'), icon: FileText },
      ]
    },
    {
      title: t('partnerFamily'),
      items: [
        { id: 'partner-space', label: t('partnerCompanion'), icon: Users, badge: t('active') },
        { id: 'hospital-checklist', label: t('hospitalBag'), icon: Briefcase },
        { id: 'baby-names', label: t('babyNames'), icon: BookOpen },
        { id: 'baby-shower', label: t('babyShower'), icon: PartyPopper },
        { id: 'baby-shopping', label: t('nurseryRegistry'), icon: ShoppingBag },
      ]
    },
    {
      title: t('postpartumSettings'),
      items: [
        { id: 'postpartum', label: t('fourthTrimester'), icon: CalendarHeart },
        { id: 'baby-care', label: t('newbornCare'), icon: Baby },
        { id: 'settings', label: t('settings'), icon: Settings },
      ]
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar with all GarbhSarthi features */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shrink-0 shadow-soft lg:shadow-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 pb-2 flex items-center justify-between border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/garbhsarthi-logo.jpg"
              alt="GarbhSarthi Logo"
              className="w-10 h-10 rounded-2xl object-cover shadow-xs border border-border shrink-0 bg-white"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-serif font-bold text-foreground leading-tight">
                  GarbhSarthi
                </h1>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-primary/10 text-primary font-bold">
                  Care Suite
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                Your Companion Through Pregnancy
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden text-muted-foreground hover:text-foreground p-1.5 rounded-lg"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Language Quick Selector (Matching photo: 🌐 EN | ಕನ್ನಡ | हिंदी | தமிழ்) */}
        <div className="mx-3 mt-2.5 mb-1.5 p-1 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-[11px] font-semibold text-muted-foreground shrink-0">
          <div className="flex items-center gap-1 pl-2">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground/80">{t('lang')}</span>
          </div>
          <div className="flex items-center gap-1 pr-1">
            {[
              { code: 'en-US', label: 'EN' },
              { code: 'kn-IN', label: 'ಕನ್ನಡ' },
              { code: 'hi-IN', label: 'हिंदी' },
              { code: 'ta-IN', label: 'தமிழ்' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-2 py-0.5 rounded-lg transition-all text-[11px] ${
                  selectedLanguage === lang.code
                    ? 'bg-card text-foreground font-bold shadow-2xs border border-border/80'
                    : 'hover:text-foreground'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Complete Features Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin">
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </span>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-primary/10 text-primary font-bold shadow-2xs'
                          : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                            item.badge === '5-1-1'
                              ? 'bg-semantic-danger text-white animate-pulse'
                              : 'bg-primary/15 text-primary'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Emergency Protocol Guidance Card */}
        <div className="px-3 py-2 border-t border-border/60 shrink-0">
          <button
            onClick={() => triggerEmergencyModal('Maternal red-flag warning: If bleeding, severe pain, or reduced movements occur, seek emergency care.')}
            className="w-full py-2 px-2.5 rounded-xl bg-semantic-danger/10 hover:bg-semantic-danger/20 border border-semantic-danger/30 text-xs font-bold text-semantic-danger flex items-center gap-2 transition-all cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-semantic-danger text-white flex items-center justify-center text-[10px] font-black shrink-0">
              !
            </div>
            <span className="truncate text-left text-[11px]">{t('emergencyProtocol')}</span>
          </button>
        </div>

        {/* Language Selector */}
        <div className="px-3 py-1.5 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 shrink-0">
          <div className="flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px]">{t('language', 'Language')}</span>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-[11px] bg-card hover:bg-muted/40 text-foreground border border-input rounded-lg px-2 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            aria-label="Choose Language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.native}
              </option>
            ))}
          </select>
        </div>

        {/* Bottom User Card (Exact match to photo: s siri / Mother with Live Toggle) */}
        <div className="p-3 mx-2 mb-2 border-t border-border flex flex-col gap-2 bg-muted/20 rounded-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div
              onClick={() => { setActiveTab('settings'); onCloseMobile(); }}
              className="flex items-center gap-2.5 cursor-pointer flex-1 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 font-serif">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-foreground truncate">{profile.name.toLowerCase()}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground capitalize">
                  <span>{activeRole === 'mother' ? t('mother') : t('partner')}</span>
                  <span>·</span>
                  <span>{t('week')} {profile.currentGestationalWeek}</span>
                  <span>·</span>
                  <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-card border border-border font-bold text-foreground">
                    {currentUser?.uniqueCode || 'MAMA-2026'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {currentUser?.role === 'partner' && currentUser?.isPaired && (
                <button
                  onClick={() => setIsMotherSharedDashboardOpen(true)}
                  className="px-2 py-1 bg-card hover:bg-muted text-foreground border border-border rounded-lg transition-colors text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  title="View Mother's Shared Dashboard"
                >
                  <span>🌸</span>
                  <span className="hidden sm:inline">Shared</span>
                </button>
              )}
              <button
                onClick={() => { setActiveTab('settings'); onCloseMobile(); }}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                title="Settings & Privacy Sharing"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => logout()}
                className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Sign Out / Switch User"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
