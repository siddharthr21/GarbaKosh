'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Heart,
  Copy,
  Check,
  User,
  Calendar,
  Apple,
  Lock,
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
  Link,
  Unlink,
  CheckCircle2,
  Circle,
  AlertTriangle
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const {
    currentUser,
    profile,
    updateProfile,
    exportAllDataJson,
    resetToDemoData,
    selectedLanguage,
    setSelectedLanguage,
    logout,
    switchAccount,
    allAccounts,
    unlinkPartner,
    updateSharingPermissions,
    activeRelationship,
    t
  } = useApp();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'pregnancy' | 'health' | 'privacy' | 'account'>('privacy');
  const [copiedCode, setCopiedCode] = useState(false);

  // Profile Form State
  const [displayName, setDisplayName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [age, setAge] = useState(profile.age.toString());

  // Pregnancy Form State
  const [dueDate, setDueDate] = useState(profile.estimatedDueDate);
  const [lmpDate, setLmpDate] = useState(profile.lastMenstrualPeriod);
  const [babyNickname, setBabyNickname] = useState(profile.babyNickname || 'Little Bean');
  const [numberOfBabies, setNumberOfBabies] = useState(profile.numberOfBabies || 1);
  const [isFirstPregnancy, setIsFirstPregnancy] = useState(profile.isFirstPregnancy ?? true);

  // Health Preferences State
  const [dietaryPref, setDietaryPref] = useState(profile.dietaryPreference);
  const [allergies, setAllergies] = useState(profile.allergies.join(', '));
  const [doctorNotes, setDoctorNotes] = useState(profile.doctorInfo.adviceNotes || '');

  // Partner Pairing State & Granular Permissions
  const isMother = (currentUser?.role || profile.role) === 'mother';
  const mySecurityCode = currentUser?.uniqueCode || profile.partnerProfile?.pairingCode || (isMother ? 'MAMA-2026' : 'PAPA-7140');
  const isPaired = Boolean(currentUser?.isPaired);
  const connectedPartnerName = activeRelationship
    ? (isMother ? activeRelationship.partner_name : activeRelationship.mother_name)
    : (currentUser?.profile.partnerProfile?.name || (isMother ? 'Partner' : 'Expecting Mother'));

  const currentPermissions = activeRelationship?.permissions || {
    viewPregnancyProgress: true,
    viewAppointments: true,
    viewSharedMilestones: true,
    viewHealthSummaries: true,
    viewBirthPlan: true,
    viewHospitalChecklist: true,
    editSharedTasks: true,
    receiveReminders: true,
    viewUltrasounds: false,
  };

  const handleToggleGranularPermission = (key: keyof typeof currentPermissions) => {
    if (!isMother) return;
    updateSharingPermissions({
      [key]: !currentPermissions[key]
    });
  };

  const handleDisconnectPartner = () => {
    if (confirm('Are you sure you want to disconnect your partner? All sharing access will be revoked immediately and both accounts will be freed for new pairing.')) {
      const res = unlinkPartner();
      alert(res.message);
    }
  };

  // Account deletion confirmation
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(mySecurityCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTogglePermission = (permKey: keyof typeof profile.sharingPermissions) => {
    updateProfile({
      sharingPermissions: {
        ...profile.sharingPermissions,
        [permKey]: !profile.sharingPermissions[permKey]
      }
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: displayName,
      email,
      age: Number(age) || 29
    });
    alert('Profile preferences saved!');
  };

  const handleSavePregnancy = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      estimatedDueDate: dueDate,
      lastMenstrualPeriod: lmpDate,
      babyNickname,
      numberOfBabies,
      isFirstPregnancy
    });
    alert('Pregnancy timeline updated!');
  };

  const handleSaveHealth = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      dietaryPreference: dietaryPref as any,
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
      doctorInfo: {
        ...profile.doctorInfo,
        adviceNotes: doctorNotes
      }
    });
    alert('Health preferences saved!');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header matching user photo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-foreground">
            {t('settingsTitle', 'Settings & Preferences')}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {t('Manage your profile, pregnancy timeline, health preferences, and account security.', 'Manage your profile, pregnancy timeline, health preferences, and account security.')}
          </p>
        </div>

        {/* Global Language Selector Bar in Settings */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-border shadow-soft text-xs font-bold self-start sm:self-auto">
          {[
            { code: 'en-US', label: 'English' },
            { code: 'kn-IN', label: 'ಕನ್ನಡ' },
            { code: 'hi-IN', label: 'हिंदी' },
            { code: 'ta-IN', label: 'தமிழ்' },
            { code: 'te-IN', label: 'తెలుగు' },
            { code: 'ml-IN', label: 'മലയാളം' }
          ].map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLanguage(lang.code as any)}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                selectedLanguage === lang.code
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Navigation Tabs matching screenshot */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border w-fit max-w-full overflow-x-auto text-xs font-semibold">
        {[
          { id: 'profile', label: t('tabProfile', 'Profile') },
          { id: 'pregnancy', label: t('tabPregnancy', 'Pregnancy') },
          { id: 'health', label: t('tabHealth', 'Health Preferences') },
          { id: 'privacy', label: t('tabPrivacy', 'Privacy & Sharing') },
          { id: 'account', label: t('tabAccount', 'Account') },
        ].map((tab) => {
          const isActive = activeSettingsTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-card text-foreground font-bold shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB: PRIVACY & SHARING (EXACT MATCH TO USER PHOTO)        */}
      {/* ======================================================== */}
      {activeSettingsTab === 'privacy' && (
        <div className="bg-card rounded-4xl p-6 md:p-8 border border-border shadow-card space-y-6 animate-in fade-in">
          {/* Card Title & Subtitle */}
          <div className="space-y-1 pb-2">
            <h2 className="text-xl font-serif font-bold text-foreground">
              Privacy & Data Sharing
            </h2>
            <p className="text-xs text-muted-foreground">
              Full transparency over who can access your maternal health records.
            </p>
          </div>

          {/* Subcard 1: Your Data is Private */}
          <div className="p-4 md:p-5 rounded-3xl bg-muted/20 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Your Data is Private</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-6">
              No one else currently has access to your data. All maternal timelines, medical notes, and health records are secured with Row Level Security.
            </p>
          </div>

          {/* Subcard 2: Partner Companion Sharing */}
          <div className="p-5 md:p-6 rounded-3xl bg-card border border-border shadow-soft space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-accent fill-accent" />
                  <h3 className="text-sm font-serif font-bold text-foreground">
                    Partner Companion Sharing
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share real-time gestational milestones and labor tools with your supportive partner.
                </p>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                isPaired
                  ? 'bg-primary-soft text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isPaired ? 'Active' : 'Unpaired'}
              </span>
            </div>

            {/* Unique Partner Pairing Code Box */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                  {isMother ? 'YOUR UNIQUE MOTHER SECURITY CODE' : 'YOUR UNIQUE PARTNER CODE'}
                </span>
                <span className="text-xl md:text-2xl font-mono font-black text-foreground tracking-wider">
                  {mySecurityCode}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {isMother
                    ? 'Share this code with your partner so they can securely synchronize from their partner account.'
                    : currentUser?.isPaired
                      ? `Linked to Mother Code: ${currentUser?.partnerLinkedCode || 'MAMA-2026'}`
                      : 'Unpaired: Connect using the mother’s code in the Partner Space tab to view records.'
                  }
                </p>
              </div>

              <button
                onClick={copyCode}
                className="px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied Code' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Granular Caregiver Permissions (Mother Controls Data Sovereignty) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground block">
                  {isMother ? 'Granular Sharing Permissions Granted to Partner:' : 'Sharing Permissions Granted by Expecting Mother:'}
                </span>
                {isMother && (
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                    Controlled by You
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  {
                    key: 'viewPregnancyProgress' as const,
                    title: 'Gestational Progression',
                    desc: 'Weekly milestone progression & baby dimensions'
                  },
                  {
                    key: 'viewAppointments' as const,
                    title: 'Appointments Schedule',
                    desc: 'Prenatal visits, scans, and clinical tests'
                  },
                  {
                    key: 'viewSharedMilestones' as const,
                    title: 'Shared Milestones',
                    desc: 'Baby shower, movements, and shared moments'
                  },
                  {
                    key: 'viewHealthSummaries' as const,
                    title: 'Selected Health Summaries',
                    desc: 'Approved vitals, BP trends, and rest summaries'
                  },
                  {
                    key: 'viewBirthPlan' as const,
                    title: 'Birth Delivery Plan',
                    desc: 'Labor preferences and hospital delivery wishes'
                  },
                  {
                    key: 'viewHospitalChecklist' as const,
                    title: 'Hospital & Nursery Checklist',
                    desc: 'Delivery bags and shared newborn checklist'
                  },
                  {
                    key: 'editSharedTasks' as const,
                    title: 'Collaborative Tasks',
                    desc: 'Partner can add or complete shared preparation tasks'
                  },
                  {
                    key: 'receiveReminders' as const,
                    title: 'Pregnancy Reminders',
                    desc: 'Receive alerts for upcoming appointments & milestones'
                  },
                  {
                    key: 'viewUltrasounds' as const,
                    title: 'Ultrasound Documents',
                    desc: 'High-resolution scan images in memory vault'
                  }
                ].map((item) => {
                  const isGranted = currentPermissions[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => isMother && handleToggleGranularPermission(item.key)}
                      className={`p-2.5 rounded-2xl border transition-all flex items-start gap-2.5 ${
                        isMother ? 'cursor-pointer hover:border-primary/50' : 'cursor-default'
                      } ${
                        isGranted
                          ? 'bg-primary-soft/40 border-primary/40 text-foreground'
                          : 'bg-muted/20 border-border text-muted-foreground'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isGranted ? (
                          <CheckCircle2 className="w-4 h-4 fill-primary text-white" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="font-semibold text-xs flex items-center justify-between">
                          <span className="truncate">{item.title}</span>
                          <span className={`text-[10px] font-bold ${isGranted ? 'text-primary' : 'text-muted-foreground'}`}>
                            {isGranted ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Private Data Sovereignty Guarantee */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 mt-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Strict Maternal Privacy Guarantee</span>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    Private journal entries, personal Bloom AI chat consultations, and unshared clinical records are <strong>never accessible</strong> to your partner or any third party.
                  </p>
                </div>
              </div>
            </div>

            {/* Partner Connection Status Bar */}
            <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isPaired ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                <span>
                  {isPaired ? (
                    <>Connected with {isMother ? 'partner' : 'mother'}: <strong className="text-foreground font-semibold">{connectedPartnerName}</strong></>
                  ) : (
                    <>No active partner connected yet. Share your code <strong className="font-mono text-primary font-bold">{mySecurityCode}</strong> to link.</>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {!isPaired && isMother && (
                  <button
                    type="button"
                    onClick={copyCode}
                    className="px-3 py-1.5 rounded-xl bg-primary-soft hover:bg-primary/20 text-primary font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                )}

                {isPaired && (
                  <button
                    type="button"
                    onClick={handleDisconnectPartner}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold border border-rose-500/20 text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Disconnect {isMother ? 'Partner' : 'Sanctuary'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: PROFILE                                             */}
      {/* ======================================================== */}
      {activeSettingsTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-card rounded-4xl p-6 md:p-8 border border-border shadow-card space-y-4 animate-in fade-in text-xs">
          <h2 className="text-xl font-serif font-bold text-foreground">Maternal Profile</h2>
          <p className="text-muted-foreground">Update your identity and contact information.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-foreground font-semibold mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
              >
                <option value="en-US">English</option>
                <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
                <option value="hi-IN">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold"
            >
              Save Profile
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB: PREGNANCY                                           */}
      {/* ======================================================== */}
      {activeSettingsTab === 'pregnancy' && (
        <form onSubmit={handleSavePregnancy} className="bg-card rounded-4xl p-6 md:p-8 border border-border shadow-card space-y-4 animate-in fade-in text-xs">
          <h2 className="text-xl font-serif font-bold text-foreground">Pregnancy Timeline</h2>
          <p className="text-muted-foreground">Adjust due dates and gestational calculation milestones.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-foreground font-semibold mb-1">Estimated Due Date (EDD)</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1">Last Menstrual Period (LMP)</label>
              <input
                type="date"
                value={lmpDate}
                onChange={e => setLmpDate(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1">Baby Nickname</label>
              <input
                type="text"
                value={babyNickname}
                onChange={e => setBabyNickname(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1">Number of Babies</label>
              <select
                value={numberOfBabies}
                onChange={e => setNumberOfBabies(Number(e.target.value))}
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
              >
                <option value={1}>Single Pregnancy</option>
                <option value={2}>Twins 👶👶</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold"
            >
              Update Pregnancy
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB: HEALTH PREFERENCES                                 */}
      {/* ======================================================== */}
      {activeSettingsTab === 'health' && (
        <form onSubmit={handleSaveHealth} className="bg-card rounded-4xl p-6 md:p-8 border border-border shadow-card space-y-4 animate-in fade-in text-xs">
          <h2 className="text-xl font-serif font-bold text-foreground">Health & Dietary Preferences</h2>
          <p className="text-muted-foreground">Tailor your nutrition suggestions and clinical guidelines.</p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-foreground font-semibold mb-1">Dietary Preference</label>
              <select
                value={dietaryPref}
                onChange={e => setDietaryPref(e.target.value as any)}
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
              >
                <option value="vegetarian">Vegetarian (Lacto-ovo)</option>
                <option value="vegan">Vegan / Plant-based</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1">Allergies (comma separated)</label>
              <input
                type="text"
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
                placeholder="e.g. Peanuts, Shellfish"
                className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1">Doctor Advice Notes</label>
              <textarea
                rows={3}
                value={doctorNotes}
                onChange={e => setDoctorNotes(e.target.value)}
                className="w-full p-2.5 bg-muted/30 border border-input rounded-xl"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold"
            >
              Save Health Preferences
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB: ACCOUNT                                            */}
      {/* ======================================================== */}
      {activeSettingsTab === 'account' && (
        <div className="bg-card rounded-4xl p-6 md:p-8 border border-border shadow-card space-y-6 animate-in fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">Account & Security Management</h2>
              <p className="text-muted-foreground">Manage active session, cryptographic codes, switch profiles, or sign out.</p>
            </div>
            <button
              onClick={() => logout()}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold border border-rose-500/30 transition-all self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Sign Out Session</span>
            </button>
          </div>

          {/* Current Session Overview */}
          <div className="p-4 bg-muted/20 rounded-3xl border border-border space-y-3">
            <span className="font-bold text-foreground block text-sm">Active Session Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-card rounded-2xl border border-border">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">User</span>
                <span className="text-xs font-bold text-foreground">{currentUser?.name || profile.name}</span>
              </div>
              <div className="p-3 bg-card rounded-2xl border border-border">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">Email</span>
                <span className="text-xs font-bold text-foreground">{currentUser?.email || profile.email}</span>
              </div>
              <div className="p-3 bg-card rounded-2xl border border-border">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">Role</span>
                <span className="text-xs font-bold text-primary capitalize">{currentUser?.role || profile.role}</span>
              </div>
              <div className="p-3 bg-card rounded-2xl border border-border">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">Security Code</span>
                <span className="text-xs font-mono font-black text-accent">{mySecurityCode}</span>
              </div>
            </div>
          </div>

          {/* 1-Click Evaluation Profile Switcher */}
          <div className="p-4 bg-card rounded-3xl border border-border space-y-3 shadow-soft">
            <div className="space-y-0.5">
              <span className="font-bold text-foreground block text-sm">Evaluation Profile Switcher</span>
              <p className="text-muted-foreground">
                Authenticate as different registered accounts to verify role isolation and 1-to-1 pairing constraints. <em>(Account roles are permanent and cannot be modified)</em>:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allAccounts.map(acc => {
                const isCurrent = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => switchAccount(acc.id)}
                    className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                      isCurrent
                        ? 'bg-primary-soft/60 border-primary shadow-xs'
                        : 'bg-muted/20 border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{acc.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-card border border-border">
                        {acc.uniqueCode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="capitalize">{acc.role} {acc.isPaired ? '(Paired)' : '(Unpaired)'}</span>
                      {isCurrent && <span className="text-primary font-bold">Active</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-muted/20 rounded-2xl border border-border space-y-2">
            <span className="font-bold text-foreground block">{t('exportData', 'Data Sovereignty & Medical Export')}</span>
            <p className="text-muted-foreground">
              {t('Download your complete maternal record, vitals logs, and memories as a clean JSON backup.', 'Download your complete maternal record, vitals logs, and memories as a clean JSON backup.')}
            </p>
            <button
              onClick={exportAllDataJson}
              className="px-4 py-2 bg-card border border-border hover:bg-muted text-foreground rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t('exportData', 'Export Medical JSON')}</span>
            </button>
          </div>

          <div className="p-4 bg-accent-soft/30 rounded-2xl border border-accent/20 space-y-2">
            <span className="font-bold text-accent block">{t('resetDemo', 'Reset to Baseline Demo State')}</span>
            <p className="text-muted-foreground">
              {t('Reset all local states, milestones, and sample records back to initial values.', 'Reset all local states, milestones, and sample records back to initial values.')}
            </p>
            <button
              onClick={() => {
                if (confirm('Reset all demo state?')) {
                  resetToDemoData();
                  alert('Reset complete!');
                }
              }}
              className="px-4 py-2 bg-card border border-border hover:bg-accent-soft text-accent rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('resetDemo', 'Reset Demo State')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
