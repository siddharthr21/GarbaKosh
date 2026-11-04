'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
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
  Footprints
} from 'lucide-react';

export const PartnerSpaceModule: React.FC<{ onNavigateTab?: (tab: string) => void }> = ({ onNavigateTab }) => {
  const {
    profile,
    updateProfile,
    activeRole,
    currentUser,
    pairPartnerWithMotherCode,
    unlinkPartner,
    allAccounts,
    availableMothers,
    setIsMotherSharedDashboardOpen,
    t
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [motherCodeInput, setMotherCodeInput] = useState('');
  const [pairingStatus, setPairingStatus] = useState<{ success?: boolean; text?: string } | null>(null);

  const isPartnerUnpaired = currentUser?.role === 'partner' && !currentUser?.isPaired;

  const handlePairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motherCodeInput.trim()) return;
    const res = pairPartnerWithMotherCode(motherCodeInput.trim());
    setPairingStatus({ success: res.success, text: res.message });
    if (res.success) {
      setMotherCodeInput('');
    }
  };

  const handleUnlink = () => {
    if (confirm('Are you sure you want to disconnect from this maternal sanctuary? You will no longer view synced records until re-paired.')) {
      unlinkPartner();
      setPairingStatus({ success: true, text: 'Account unlinked. Your partner dashboard is now sequestered.' });
    }
  };
  const [partnerChecklist, setPartnerChecklist] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('matrena_partner_checklist');
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
      localStorage.setItem('matrena_partner_checklist', JSON.stringify(updated));
    }
  };

  const copyPairingCode = () => {
    const code = profile.partnerProfile?.pairingCode || 'MAMA-2026';
    navigator.clipboard.writeText(code);
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

  const week = profile.currentGestationalWeek;

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
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{t('Caregiver Suite', 'The Partner Sanctuary · GarbaKosh Caregiver Suite')}</span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-foreground">
            {t('partnerSanctuaryTitle', 'Partner Sanctuary & Collaboration')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('partnerSanctuarySubtitle', 'Caregiver tools for labor surge timing, kick monitoring, and supportive trimester missions.')}
          </p>
        </div>

        {/* Partner Account Header Info & Shared View Trigger */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {currentUser?.isPaired ? (
            <button
              onClick={() => setIsMotherSharedDashboardOpen(true)}
              className="px-4 py-2 rounded-2xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🌸</span>
              <span>View Mother's Shared Dashboard</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-2xl bg-card border border-border text-xs font-mono font-bold text-muted-foreground shadow-2xs">
              Role: PARTNER ({currentUser?.uniqueCode})
            </div>
          )}
        </div>
      </div>

      {/* Unpaired Partner Security Gateway Banner */}
      {isPartnerUnpaired && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>{t('unpairedNoticeTitle', 'Zero Data Leakage Security Active · Unpaired Partner Account')}</span>
                </div>
                <h2 className="text-lg font-serif font-bold text-foreground">
                  {t('Welcome', 'Welcome')}, {currentUser?.name || 'Partner'}!
                </h2>
                <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  {t('unpairedNoticeBody', 'Maternal clinical records, ultrasound images, and vitals logs are protected by cryptographic account isolation. Connect with an eligible expecting mother below or enter her unique pairing code.')}
                </p>
              </div>

              <div className="p-3 bg-card rounded-2xl border border-border text-center shrink-0 min-w-[170px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">{t('partnerCode', 'Your Partner Code')}</span>
                <span className="text-lg font-mono font-black text-foreground">{currentUser?.uniqueCode || 'PAPA-9921'}</span>
              </div>
            </div>

            <form onSubmit={handlePairSubmit} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={motherCodeInput}
                  onChange={e => setMotherCodeInput(e.target.value.toUpperCase())}
                  placeholder={t('enterMotherCode', "Enter Mother's Unique Code (e.g. MAMA-4819 for Priya, MAMA-6314 for Diya)")}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-input text-xs font-mono font-bold tracking-wider placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                {t('connectSanctuaryBtn', 'Connect Sanctuary')}
              </button>
            </form>

            {pairingStatus && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                pairingStatus.success ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
              }`}>
                {pairingStatus.text}
              </div>
            )}
          </div>

          {/* Registered Available Mothers List (Requirement 3) */}
          <div className="p-6 bg-card rounded-3xl border border-border shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-foreground text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span>Registered Available Mothers (Eligible for 1-to-1 Pairing)</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Under strict 1-to-1 pairing rules, only genuinely available expecting mothers are displayed. Paired mothers are automatically excluded from connection.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-bold shrink-0">
                {availableMothers.filter(m => m.isAvailable).length} Available for Pairing
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
                          {isAvailable ? 'Available' : 'Already Connected'}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Week {mother.gestationalWeek} · Due {mother.estimatedDueDate}
                      </p>
                      <span className="font-mono text-[10px] text-muted-foreground block">
                        Invitation Code: {mother.code}
                      </span>
                      {!isAvailable && mother.pairedPartnerName && (
                        <span className="text-[10px] text-stone-500 italic block">
                          Paired with {mother.pairedPartnerName}
                        </span>
                      )}
                    </div>

                    {isAvailable ? (
                      <button
                        onClick={() => {
                          const res = pairPartnerWithMotherCode(mother.id);
                          setPairingStatus({ success: res.success, text: res.message });
                        }}
                        className="w-full py-2 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1"
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

      {/* Account Pairing Status Card */}
      {!isPartnerUnpaired && (
        <div className="bg-gradient-to-r from-cream-100 via-primary-soft/30 to-accent-soft/30 rounded-3xl p-6 border border-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                {t('partnerConnected', 'Couples Synchronized & Connected')}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground">
              {t('Connected', 'Connected')}: {profile.name} & {profile.partnerProfile?.name || 'Rohan Sharma'}
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              {t('Both accounts share milestones, hospital bag items, shortlisted baby names, and doctor reminders.', 'Both accounts share milestones, hospital bag items, shortlisted baby names, and doctor reminders. The mother retains granular permission control over personal clinical notes.')}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => setIsMotherSharedDashboardOpen(true)}
                className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>🌸</span>
                <span>View Mother's Shared Dashboard</span>
              </button>

              {currentUser?.role === 'partner' && (
                <button
                  onClick={handleUnlink}
                  className="px-3 py-2 rounded-xl bg-card border border-border hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Disconnect from Sanctuary
                </button>
              )}
            </div>
          </div>

          {/* Pairing Code Card */}
          <div className="p-4 bg-card rounded-2xl border border-border shadow-soft text-center shrink-0 min-w-[220px] space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
              <span>Mother Code</span>
              <span className="font-mono text-accent font-black">{profile.partnerProfile?.pairingCode || 'MAMA-2026'}</span>
            </div>
            {currentUser?.role === 'partner' && (
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-t border-border pt-1">
                <span>Partner Code</span>
                <span className="font-mono text-foreground font-black">{currentUser.uniqueCode}</span>
              </div>
            )}
            <button
              onClick={copyPairingCode}
              className="w-full py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Invitation Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Garbkosh Trimester-Adaptive Partner Mission Banner */}
      <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Week {week} Partner Mission</span>
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

        {/* Partner Hospital & Nursery Preparedness Checklist (Garbkosh) */}
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

      {/* Mother's Privacy & Sharing Permissions Panel */}
      <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-foreground">{t('sharingPermissionsTitle', 'User-Controlled Sharing Permissions')}</h3>
            <p className="text-xs text-muted-foreground">{t('The mother controls exactly what personal data is synchronized', 'The mother controls exactly what personal data is synchronized')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { key: 'shareVitals', label: 'Share Blood Pressure & Weight Logs' },
            { key: 'shareMood', label: 'Share Daily Emotional Journal' },
            { key: 'shareUltrasounds', label: 'Share Ultrasound Scans & Moments' },
            { key: 'shareAppointments', label: 'Share Doctor Appointment Reminders' },
            { key: 'shareHospitalChecklist', label: 'Share Hospital Bag Checklist' },
            { key: 'shareBirthPlan', label: 'Share Birth Plan Preferences' }
          ].map(item => {
            const isEnabled = (profile.sharingPermissions as any)[item.key];

            return (
              <div
                key={item.key}
                onClick={() => handleTogglePermission(item.key as any)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
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
