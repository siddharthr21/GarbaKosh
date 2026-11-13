'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Timer,
  Play,
  Square,
  RotateCcw,
  AlertTriangle,
  Heart,
  Phone,
  Clock,
  Trash2,
  CheckCircle2,
  Activity,
  Flame,
  ShieldCheck
} from 'lucide-react';

export const ContractionTimerModule: React.FC = () => {
  const { contractions, addContraction, clearContractions, deleteContraction, profile, triggerEmergencyModal, t } = useApp();

  const [isTiming, setIsTiming] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [surgeStartTime, setSurgeStartTime] = useState<Date | null>(null);
  const [surgeIntensity, setSurgeIntensity] = useState<'Mild' | 'Moderate' | 'Intense'>('Moderate');

  useEffect(() => {
    let interval: any = null;
    if (isTiming) {
      interval = setInterval(() => {
        setDurationSec(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTiming]);

  const handleToggleTimer = () => {
    if (!isTiming) {
      // Start surge
      setIsTiming(true);
      setDurationSec(0);
      setSurgeStartTime(new Date());
    } else {
      // Stop surge
      setIsTiming(false);
      const endTime = new Date();
      const startTime = surgeStartTime || new Date(Date.now() - durationSec * 1000);

      // Compute interval since prior surge if one exists
      let intervalMinutes: number | undefined = undefined;
      if (contractions.length > 0) {
        const lastSurgeStart = new Date(contractions[0].startTime);
        const diffMs = startTime.getTime() - lastSurgeStart.getTime();
        const diffMins = diffMs / (1000 * 60);
        intervalMinutes = Number(Math.max(0.1, diffMins).toFixed(1));
      }

      addContraction({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationSeconds: durationSec,
        intervalMinutes,
        intensity: surgeIntensity
      });
    }
  };

  // Compute averages
  const avgDuration = contractions.length > 0
    ? Math.round(contractions.reduce((a, b) => a + b.durationSeconds, 0) / contractions.length)
    : 0;

  const validIntervals = contractions.filter(c => c.intervalMinutes !== undefined);
  const avgInterval = validIntervals.length > 0
    ? (validIntervals.reduce((a, b) => a + (b.intervalMinutes || 0), 0) / validIntervals.length).toFixed(1)
    : '—';

  // 5-1-1 Rule: Contractions 5 mins apart or less, lasting 60s or more, across 3+ consecutive surges
  const is511Alert = contractions.length >= 3 &&
    contractions.slice(0, 3).every(c => c.durationSeconds >= 55 && (c.intervalMinutes ?? 10) <= 5.5);

  const formatSec = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold mb-2">
            <Timer className="w-3.5 h-3.5" />
            <span>{t('surgeTimerTitle', 'Labor Surge Analysis & Contraction Timer')}</span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-foreground">
            {t('contractions', 'Labor Contraction Timer')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('surgeTimerSubtitle', 'Track labor surge duration, interval frequency, and receive automatic 5-1-1 rule hospital departure guidance.')}
          </p>
        </div>

        {contractions.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all logged contraction surges?')) clearContractions();
            }}
            className="px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('Reset History', 'Reset History')}</span>
          </button>
        )}
      </div>

      {/* 5-1-1 Rule Critical Departure Alert Banner */}
      {is511Alert && (
        <div className="p-5 rounded-3xl bg-semantic-danger/10 border-2 border-semantic-danger text-foreground space-y-3 animate-pulse shadow-glow">
          <div className="flex items-center gap-2.5 text-semantic-danger font-extrabold">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <span className="text-base">{t('rule511AlertTitle', '🚨 5-1-1 RULE REACHED: PROCEED TO HOSPITAL MATERNITY TRIAGE')}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t('rule511AlertBody', 'Your contractions are arriving every 5 minutes or less and lasting 60 seconds or longer. This signifies active cervical dilation. Stay calm, take deep diaphragmatic breaths, and head to your delivery hospital with your packed bag.')}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={`tel:${profile.doctorInfo.emergencyContact.split(' ')[0]}`}
              className="px-4 py-2 bg-semantic-danger text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>{t('Call Hospital Triage', 'Call Hospital Triage')} ({profile.doctorInfo.emergencyContact})</span>
            </a>
            <a
              href={`tel:${profile.doctorInfo.phone}`}
              className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{t('Call Doctor', 'Call Dr.')} {profile.doctorInfo.name.split(',')[0].replace(/^Dr\.?\s*/i, '')}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Stopwatch Timer Card */}
      <div className="bg-card rounded-4xl p-6 md:p-8 border border-border shadow-card relative overflow-hidden flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
            {isTiming ? t('Surge In Progress', 'Surge In Progress') : t('Resting Between Surges', 'Resting Between Surges')}
          </span>
          <div className="text-6xl md:text-7xl font-mono font-black text-foreground tracking-tight py-2">
            {formatSec(durationSec)}
          </div>
        </div>

        {/* Big Action Button */}
        <button
          onClick={handleToggleTimer}
          className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-white font-extrabold transition-all duration-300 shadow-glow active:scale-95 cursor-pointer ${
            isTiming
              ? 'bg-gradient-to-tr from-semantic-danger to-rose-500 scale-105'
              : 'bg-gradient-to-tr from-primary to-primary-hover hover:scale-102'
          }`}
        >
          {isTiming ? (
            <>
              <Square className="w-8 h-8 fill-current mb-1" />
              <span className="text-base uppercase tracking-wider">{t('stopTimer', 'STOP SURGE')}</span>
              <span className="text-[10px] opacity-80 mt-0.5">{t('Surge Ending', 'Surge Ending')}</span>
            </>
          ) : (
            <>
              <Play className="w-8 h-8 fill-current mb-1 ml-1" />
              <span className="text-base uppercase tracking-wider">{t('startTimer', 'START SURGE')}</span>
              <span className="text-[10px] opacity-80 mt-0.5">{t('Contraction Starting', 'Contraction Starting')}</span>
            </>
          )}
        </button>

        {/* Intensity Selector */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-muted-foreground">{t('intensityLabel', 'Intensity')}:</span>
          {(['Mild', 'Moderate', 'Intense'] as const).map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSurgeIntensity(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                surgeIntensity === lvl
                  ? lvl === 'Intense'
                    ? 'bg-semantic-danger text-white'
                    : lvl === 'Moderate'
                    ? 'bg-accent text-white'
                    : 'bg-primary text-white'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted'
              }`}
            >
              {lvl === 'Mild' ? t('intensityMild', 'Mild') : lvl === 'Moderate' ? t('intensityModerate', 'Moderate') : t('intensityStrong', 'Intense')}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Stats Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-3xl border border-border shadow-soft space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase">{t('Total Surges Logged', 'Total Surges Logged')}</span>
          <div className="text-2xl font-black text-foreground">{contractions.length}</div>
          <span className="text-[10px] text-muted-foreground">{t('This session', 'This session')}</span>
        </div>

        <div className="p-4 bg-card rounded-3xl border border-border shadow-soft space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase">{t('Average Duration', 'Average Duration')}</span>
          <div className="text-2xl font-black text-primary">{avgDuration}s</div>
          <span className="text-[10px] text-muted-foreground">{t('Target: 60s+', 'Target: 60s+')}</span>
        </div>

        <div className="p-4 bg-card rounded-3xl border border-border shadow-soft space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase">{t('Average Interval', 'Average Interval')}</span>
          <div className="text-2xl font-black text-accent">{avgInterval} min</div>
          <span className="text-[10px] text-muted-foreground">{t('Frequency apart', 'Frequency apart')}</span>
        </div>

        <div className="p-4 bg-card rounded-3xl border border-border shadow-soft space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase">{t('5-1-1 Rule Readiness', '5-1-1 Rule Readiness')}</span>
          <div className={`text-sm font-bold mt-1 ${is511Alert ? 'text-semantic-danger' : 'text-primary'}`}>
            {is511Alert ? t('Hospital Ready', 'Hospital Ready') : t('Early Latent Stage', 'Early Latent Stage')}
          </div>
          <span className="text-[10px] text-muted-foreground">{t('Continuous monitoring', 'Continuous monitoring')}</span>
        </div>
      </div>

      {/* Contraction History Table */}
      <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-foreground">{t('Recent Surges History', 'Recent Surges History')}</h3>
          <span className="text-xs text-muted-foreground">{contractions.length} {t('records', 'records')}</span>
        </div>

        {contractions.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
            <Timer className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
            <p>{t('No contractions timed yet.', 'No contractions timed yet.')}</p>
            <p>{t('Tap "Start Surge" when you feel the uterine muscles begin tightening.', 'Tap "Start Surge" when you feel the uterine muscles begin tightening.')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">{t('Surge Time', 'Surge Time')}</th>
                  <th className="py-2.5 px-3">{t('Duration', 'Duration')}</th>
                  <th className="py-2.5 px-3">{t('Interval (Frequency)', 'Interval (Frequency)')}</th>
                  <th className="py-2.5 px-3">{t('Intensity', 'Intensity')}</th>
                  <th className="py-2.5 px-3 text-right">{t('Action', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {contractions.map(c => (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="py-3 px-3 font-semibold text-foreground">
                      {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {c.durationSeconds}s
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {c.intervalMinutes !== undefined ? `${c.intervalMinutes} ${t('mins apart', 'mins apart')}` : t('First surge', 'First surge')}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        c.intensity === 'Intense'
                          ? 'bg-semantic-danger/20 text-semantic-danger'
                          : c.intensity === 'Moderate'
                          ? 'bg-accent-soft text-accent'
                          : 'bg-primary-soft text-primary'
                      }`}>
                        {c.intensity === 'Mild' ? t('intensityMild', 'Mild') : c.intensity === 'Moderate' ? t('intensityModerate', 'Moderate') : t('intensityStrong', 'Intense')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteContraction(c.id)}
                        className="p-1 text-muted-foreground hover:text-semantic-danger transition-colors cursor-pointer"
                        title={t('Delete surge', 'Delete surge')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
