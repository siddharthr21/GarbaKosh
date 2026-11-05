'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Baby,
  Milk,
  Moon,
  Clock,
  Plus,
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Droplet,
  BookOpen,
  Calendar,
  Trash2
} from 'lucide-react';

const VACCINATION_ROADMAP = [
  { age: 'Birth', vaccines: ['BCG', 'OPV 0', 'Hepatitis B (Birth Dose)'], status: 'Completed' },
  { age: '6 Weeks', vaccines: ['DTwP / DTaP 1', 'IPV 1', 'Hepatitis B 1', 'Hib 1', 'Rotavirus 1', 'PCV 1'], status: 'Scheduled' },
  { age: '10 Weeks', vaccines: ['DTwP / DTaP 2', 'IPV 2', 'Hib 2', 'Rotavirus 2', 'PCV 2'], status: 'Upcoming' },
  { age: '14 Weeks', vaccines: ['DTwP / DTaP 3', 'IPV 3', 'Hib 3', 'Rotavirus 3', 'PCV 3'], status: 'Upcoming' },
  { age: '6 Months', vaccines: ['Influenza Annual Dose 1', 'Typhoid Conjugate'], status: 'Upcoming' },
  { age: '9 Months', vaccines: ['MMR (Measles, Mumps, Rubella) 1', 'Meningococcal'], status: 'Upcoming' }
];

export const BabyCareModule: React.FC = () => {
  const { babyActivities, addBabyActivity, deleteBabyActivity, t } = useApp();

  const [activeType, setActiveType] = useState<'breastfeeding' | 'bottle' | 'sleep' | 'diaper-wet' | 'diaper-dirty'>('breastfeeding');
  const [durationMins, setDurationMins] = useState('20');
  const [amountMl, setAmountMl] = useState('60');
  const [notes, setNotes] = useState('');

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    addBabyActivity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: activeType,
      durationMinutes: activeType === 'breastfeeding' || activeType === 'sleep' ? Number(durationMins) : undefined,
      amountMl: activeType === 'bottle' ? Number(amountMl) : undefined,
      notes: notes.trim() || undefined
    });
    setNotes('');
    alert('Logged baby activity!');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold mb-2">
          <Baby className="w-3.5 h-3.5" />
          <span>{t('Newborn Care & Milestone Engine', 'Newborn Care & Milestone Engine')}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          {t('newbornCareTitle', 'My Little One: Baby Care & Development')}
        </h1>
        <p className="text-sm text-gray-600">
          {t('newbornCareSubtitle', 'Log daily feedings, sleep sessions, wet/dirty diapers, and monitor WHO pediatric growth milestones.')}
        </p>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-3xl border border-blush-100 shadow-2xs space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase">{t('Estimated Birth Weight', 'Estimated Birth Weight')}</span>
          <div className="text-xl font-black text-gray-900">3.2 kg</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{t('50th WHO Percentile', '50th WHO Percentile')}</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-blush-100 shadow-2xs space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase">{t('Today’s Feedings', 'Today’s Feedings')}</span>
          <div className="text-xl font-black text-gray-900">6 {t('Sessions', 'Sessions')}</div>
          <span className="text-[10px] text-gray-500">{t('Every 2.5 - 3 hours', 'Every 2.5 - 3 hours')}</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-blush-100 shadow-2xs space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase">{t('Wet Diapers (24h)', 'Wet Diapers (24h)')}</span>
          <div className="text-xl font-black text-cyan-600">5 {t('Diapers', 'Diapers')}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{t('Good hydration', 'Good hydration')} (&gt;4)</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-blush-100 shadow-2xs space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase">{t('Total Sleep', 'Total Sleep')}</span>
          <div className="text-xl font-black text-purple-600">14.5 {t('hrs', 'hrs')}</div>
          <span className="text-[10px] text-gray-500">{t('Normal range 14-17 hrs', 'Normal range 14-17 hrs')}</span>
        </div>
      </div>

      {/* Main Grid: Activity Logger & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baby Activity Logger */}
        <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-600" />
            {t('Quick Activity Logger', 'Quick Activity Logger')}
          </h3>

          {/* Activity Category Tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
            {[
              { type: 'breastfeeding', label: t('Nursing', 'Nursing'), emoji: '🤱' },
              { type: 'bottle', label: t('Bottle', 'Bottle'), emoji: '🍼' },
              { type: 'sleep', label: t('Sleep', 'Sleep'), emoji: '💤' },
              { type: 'diaper-wet', label: t('Wet Diaper', 'Wet Diaper'), emoji: '💧' },
              { type: 'diaper-dirty', label: t('Dirty Diaper', 'Dirty Diaper'), emoji: '💩' }
            ].map(tab => (
              <button
                key={tab.type}
                type="button"
                onClick={() => setActiveType(tab.type as any)}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  activeType === tab.type
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold shadow-2xs'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white'
                }`}
              >
                <span className="text-xl mb-0.5">{tab.emoji}</span>
                <span className="text-[10px] text-center leading-tight">{tab.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogActivity} className="space-y-3 text-xs pt-1">
            {(activeType === 'breastfeeding' || activeType === 'sleep') && (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('durationMin', 'Duration (Minutes)')}</label>
                <input
                  type="number"
                  value={durationMins}
                  onChange={e => setDurationMins(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  required
                />
              </div>
            )}

            {activeType === 'bottle' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Formula or Breastmilk', 'Formula or Breastmilk')} (ml)</label>
                <input
                  type="number"
                  value={amountMl}
                  onChange={e => setAmountMl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Notes', 'Notes')}</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t('Optional notes...', 'Optional notes (e.g. Left/Right breast, burped well)...')}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold shadow-md transition-all text-xs cursor-pointer"
            >
              {t('Log Newborn Activity', 'Log Newborn Activity')}
            </button>
          </form>
        </div>

        {/* Recent Baby Activity Stream */}
        <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            Today’s Newborn Activity Stream
          </h3>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {babyActivities.map(act => (
              <div
                key={act.id}
                className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
                    {act.type === 'breastfeeding' ? '🤱' : act.type === 'bottle' ? '🍼' : act.type === 'sleep' ? '💤' : '🚼'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 capitalize">{act.type.replace('-', ' ')}</h4>
                    <p className="text-[11px] text-gray-500">
                      {act.durationMinutes ? `${act.durationMinutes} mins · ` : ''}
                      {act.amountMl ? `${act.amountMl} ml · ` : ''}
                      {act.notes || 'Normal routine'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400 font-semibold">{act.time}</span>
                  <button
                    onClick={() => deleteBabyActivity(act.id)}
                    title="Delete entry"
                    aria-label="Delete entry"
                    className="p-1 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pediatric Care Guides: Sneezing, Burping, Safe Sleep ABCs */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Pediatric Care Knowledge & Safe Sleep
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1.5">
            <h4 className="font-bold text-blue-900">Why Newborns Sneeze:</h4>
            <p className="text-blue-950/80 leading-relaxed">
              Newborn nasal passages are microscopic. Sneezing is their only natural physiological reflex to clear out lint, dust, and amniotic fluid residue—not a sign of illness.
            </p>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1.5">
            <h4 className="font-bold text-purple-900">The Safe Sleep ABCs:</h4>
            <p className="text-purple-950/80 leading-relaxed">
              <strong>A:</strong> Alone (no pillows, stuffed animals, or loose blankets).<br />
              <strong>B:</strong> on their Back for every sleep.<br />
              <strong>C:</strong> in an uncluttered Crib with a firm mattress.
            </p>
          </div>

          <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 space-y-1.5">
            <h4 className="font-bold text-teal-900">Burping Techniques:</h4>
            <p className="text-teal-950/80 leading-relaxed">
              Hold baby upright over your shoulder or seated on your lap with your hand supporting their chin. Gentle cupped pats on the back help release swallowed air bubbles.
            </p>
          </div>
        </div>
      </div>

      {/* Vaccination Schedule Table */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          National Pediatric Immunization Roadmap
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Age Window</th>
                <th className="py-2.5 px-3">Recommended Vaccines</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {VACCINATION_ROADMAP.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="py-3 px-3 font-bold text-gray-900">{item.age}</td>
                  <td className="py-3 px-3 text-gray-700">
                    <div className="flex flex-wrap gap-1.5">
                      {item.vaccines.map((v, vidx) => (
                        <span key={vidx} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-[11px] font-medium">
                          {v}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      item.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
