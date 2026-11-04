'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  ShieldCheck,
  Lock,
  Heart,
  Calendar,
  Sparkles,
  Activity,
  ScrollText,
  Briefcase,
  AlertTriangle,
  FileText,
  Smile,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

export const SharedMotherDashboardModal: React.FC = () => {
  const {
    isMotherSharedDashboardOpen,
    setIsMotherSharedDashboardOpen,
    profile,
    activeRelationship,
    currentUser,
    vitals,
    dailyChecklist,
    birthPlan,
    hospitalChecklist,
    t
  } = useApp();

  if (!isMotherSharedDashboardOpen) return null;

  const permissions = activeRelationship?.permissions || profile.sharingPermissions;
  const motherName = activeRelationship?.mother_name || profile.name;
  const currentWeek = profile.currentGestationalWeek || 24;

  const getDaysRemaining = () => {
    const today = new Date();
    const edd = new Date(profile.estimatedDueDate || '2027-02-16');
    const diffTime = edd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const latestVital = vitals[vitals.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-4xl border-2 border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-cream-100 via-primary-soft/30 to-accent-soft/30 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Restricted Read-Only Caregiver View</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground font-bold">
                Role: PARTNER ({currentUser?.name})
              </span>
            </div>
            <h2 className="text-xl font-serif font-extrabold text-foreground">
              {motherName}'s Shared Sanctuary Dashboard
            </h2>
            <p className="text-xs text-muted-foreground">
              Data synchronized under granular maternal privacy permissions. Modifying clinical data is disabled.
            </p>
          </div>

          <button
            onClick={() => setIsMotherSharedDashboardOpen(false)}
            className="p-2 rounded-2xl bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Pregnancy Progress Card (Controlled by viewPregnancyProgress) */}
          {permissions.viewPregnancyProgress ? (
            <div className="p-5 rounded-3xl bg-primary-soft/40 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Gestational Journey: Week {currentWeek}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-primary text-white font-bold text-xs">
                  {getDaysRemaining()} Days to Estimated Due Date
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Baby is now developing active sensory reflexes, coordinated kicks, and distinct sleep-wake cycles. Both parents share active bonding milestones.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center gap-2 text-muted-foreground">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span>Pregnancy progress summary is kept private by {motherName}.</span>
            </div>
          )}

          {/* Permitted Clinical Vitals & Kick Counter (Controlled by viewHealthSummaries) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-foreground text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span>Maternal Health Summary</span>
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                permissions.viewHealthSummaries ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
              }`}>
                {permissions.viewHealthSummaries ? 'Shared by Mother' : 'Sequestered (Private)'}
              </span>
            </div>

            {permissions.viewHealthSummaries ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-card rounded-2xl border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Blood Pressure</span>
                  <div className="text-base font-black text-foreground mt-0.5">
                    {latestVital?.bloodPressureSys || 118}/{latestVital?.bloodPressureDia || 78} mmHg
                  </div>
                </div>
                <div className="p-3 bg-card rounded-2xl border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Pulse Rate</span>
                  <div className="text-base font-black text-foreground mt-0.5">
                    {latestVital?.pulseBpm || 76} bpm
                  </div>
                </div>
                <div className="p-3 bg-card rounded-2xl border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Latest Kicks</span>
                  <div className="text-base font-black text-accent mt-0.5">
                    {latestVital?.kickCount || 18} kicks / 2hr
                  </div>
                </div>
                <div className="p-3 bg-card rounded-2xl border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Current Weight</span>
                  <div className="text-base font-black text-foreground mt-0.5">
                    {latestVital?.weightKg || profile.currentWeightKg} kg
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-muted-foreground flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {motherName} has designated clinical vitals and weight records as private medical data.
                </span>
              </div>
            )}
          </div>

          {/* Birth Plan Preferences (Controlled by viewBirthPlan) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-foreground text-sm flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-primary" />
                <span>Shared Birth Plan Preferences</span>
              </h3>
              <span className="text-[10px] font-bold text-primary">Read-Only</span>
            </div>

            {permissions.viewBirthPlan ? (
              <div className="p-4 bg-card rounded-2xl border border-border space-y-2">
                <p className="text-foreground leading-relaxed">
                  <strong>Environment:</strong> Dim lighting, soft music, Partner present continuously, partner to cut umbilical cord if permitted.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Pain relief preference:</strong> Rhythmic breathing and massage first; epidural open if recommended by obstetrician.
                </p>
                <p className="text-muted-foreground italic">
                  <strong>Special notes:</strong> "{birthPlan.specialNotes}"
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Birth plan sharing is currently restricted.</span>
              </div>
            )}
          </div>

          {/* Hospital Bag Checklist (Controlled by viewHospitalChecklist) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-foreground text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Hospital Bag Readiness</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700">Synchronized</span>
            </div>

            {permissions.viewHospitalChecklist ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hospitalChecklist.slice(0, 6).map(item => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-card rounded-xl border border-border flex items-center gap-2"
                  >
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.packed ? 'text-emerald-600' : 'text-stone-300'}`} />
                    <span className={`truncate ${item.packed ? 'line-through text-muted-foreground' : 'text-foreground font-semibold'}`}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Hospital checklist sharing is restricted.</span>
              </div>
            )}
          </div>

          {/* Strictly Private Sections Notice (Requirement 6) */}
          <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Protected Maternal Privacy Isolation
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground">
              <div className="p-2.5 rounded-xl bg-card border border-border flex items-center gap-2">
                <EyeOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Private Journal & Mood Logs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex items-center gap-2">
                <EyeOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Bloom AI Assistant Chats</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex items-center gap-2">
                <EyeOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Ultrasound Vault Scans</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card flex items-center justify-between text-xs">
          <span className="text-muted-foreground text-[11px]">
            Connected pairing code: <strong>{profile.partnerProfile?.pairingCode || 'MAMA-2026'}</strong>
          </span>
          <button
            onClick={() => setIsMotherSharedDashboardOpen(false)}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold cursor-pointer transition-all"
          >
            Close Shared View
          </button>
        </div>
      </div>
    </div>
  );
};
