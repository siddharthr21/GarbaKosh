'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  CalendarHeart,
  AlertTriangle,
  Heart,
  Droplet,
  Moon,
  Baby,
  ShieldAlert,
  Plus,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const PostpartumModule: React.FC = () => {
  const { profile, updateProfile, postpartumLogs, addPostpartumLog, triggerEmergencyModal, t } = useApp();

  const [deliveryType, setDeliveryType] = useState<'vaginal' | 'c-section' | 'assisted'>('vaginal');
  const [painScale, setPainScale] = useState(3);
  const [lochiaFlow, setLochiaFlow] = useState<'light' | 'moderate' | 'heavy' | 'red-flag'>('light');
  const [breastCondition, setBreastCondition] = useState<'normal' | 'engorged' | 'sore' | 'mastitis-warning'>('normal');
  const [sleepHours, setSleepHours] = useState(6);
  const [emotionalScore, setEmotionalScore] = useState(8);
  const [notes, setNotes] = useState('');

  const handlePostpartumCheckin = (e: React.FormEvent) => {
    e.preventDefault();

    if (lochiaFlow === 'red-flag') {
      triggerEmergencyModal(
        'POSTPARTUM HEMORRHAGE WARNING: Soaking through one or more maternity pads per hour, passing golf ball-sized blood clots, or feeling dizzy/faint requires IMMEDIATE emergency hospital triage.'
      );
    } else if (breastCondition === 'mastitis-warning') {
      triggerEmergencyModal(
        'SUSPECTED MASTITIS ALERT: Breast pain accompanied by high fever (>38.5°C / 101.3°F), chills, or red wedge-shaped streaks requires prompt antibiotic evaluation by your obstetrician to prevent abscess.'
      );
    }

    addPostpartumLog({
      deliveryType,
      painScale,
      lochiaFlow,
      breastCondition,
      sleepHours,
      hydrationGlasses: 8,
      emotionalScore,
      notes: notes.trim() || 'Daily fourth-trimester check-in'
    });

    setNotes('');
    alert('Postpartum daily recovery check-in logged.');
  };

  const handleTogglePostpartumMode = () => {
    updateProfile({ isPostpartum: !profile.isPostpartum });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title & Stage Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
            <CalendarHeart className="w-3.5 h-3.5" />
            <span>{t('The Fourth Trimester Maternal Recovery', 'The Fourth Trimester Maternal Recovery')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {t('postpartumTitle', 'Postpartum Recovery Dashboard')}
          </h1>
          <p className="text-sm text-gray-600">
            {t('postpartumSubtitle', 'Nurturing the mother after birth: lochia flow, perineal/incision healing, breastfeeding, sleep, and emotional health.')}
          </p>
        </div>

        <button
          onClick={handleTogglePostpartumMode}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
            profile.isPostpartum
              ? 'bg-emerald-600 text-white'
              : 'bg-cream-100 text-gray-700 hover:bg-cream-200 border border-cream-200'
          }`}
        >
          <Baby className="w-4 h-4" />
          <span>{t('Status', 'Status')}: {profile.isPostpartum ? t('Baby Born (Postpartum Active)', 'Baby Born (Postpartum Active)') : t('Pregnancy Stage (Previewing Postpartum)', 'Pregnancy Stage (Previewing Postpartum)')}</span>
        </button>
      </div>

      {/* Emergency Red-Flag Warning Banner for Postpartum Complications */}
      <div className="p-4 bg-red-50 rounded-3xl border-2 border-red-300 text-xs text-red-950 space-y-1.5 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-red-900 uppercase text-[11px]">{t('Emergency Postpartum Red Flags', 'Emergency Postpartum Red Flags')}:</h4>
          <p className="text-red-900/90 leading-relaxed">
            {t('Seek immediate emergency care (112 / 911 / 108) if you experience: Heavy vaginal bleeding, severe chest pain or shortness of breath, persistent severe headache, or fever.', 'Seek immediate emergency care (112 / 911 / 108) if you experience: Heavy vaginal bleeding (soaking a pad in 1 hour), severe chest pain or shortness of breath, persistent severe headache with visual disturbances, fever over 38°C, or thoughts of harming yourself or baby.')}
          </p>
        </div>
      </div>

      {/* Daily Postpartum Check-in Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            {t('Daily Maternal Recovery Log', 'Daily Maternal Recovery Log')}
          </h3>

          <form onSubmit={handlePostpartumCheckin} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Delivery Type', 'Delivery Type')}</label>
                <select
                  value={deliveryType}
                  onChange={e => setDeliveryType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer"
                >
                  <option value="vaginal">{t('Vaginal Birth', 'Vaginal Birth')}</option>
                  <option value="c-section">{t('Cesarean (C-Section)', 'Cesarean (C-Section)')}</option>
                  <option value="assisted">{t('Assisted (Vacuum / Forceps)', 'Assisted (Vacuum / Forceps)')}</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Pain / Discomfort', 'Pain / Discomfort')} (1-10)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painScale}
                  onChange={e => setPainScale(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="text-right text-[10px] text-gray-400 font-bold">{painScale} / 10</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Lochia (Bleeding) Flow', 'Lochia (Bleeding) Flow')}</label>
                <select
                  value={lochiaFlow}
                  onChange={e => setLochiaFlow(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer"
                >
                  <option value="light">{t('Light Pink / Brownish (Normal)', 'Light Pink / Brownish (Normal)')}</option>
                  <option value="moderate">{t('Moderate Red (Normal Days 3-10)', 'Moderate Red (Normal Days 3-10)')}</option>
                  <option value="heavy">{t('Heavy (Soaking 1 pad / 2 hrs)', 'Heavy (Soaking 1 pad / 2 hrs)')}</option>
                  <option value="red-flag">🚨 {t('Emergency: Soaking < 1 hr or big clots', 'Emergency: Soaking < 1 hr or big clots')}</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Breast Condition', 'Breast Condition')}</label>
                <select
                  value={breastCondition}
                  onChange={e => setBreastCondition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer"
                >
                  <option value="normal">{t('Soft / Normal Milk Flow', 'Soft / Normal Milk Flow')}</option>
                  <option value="engorged">{t('Engorged & Full', 'Engorged & Full')}</option>
                  <option value="sore">{t('Tender or Sore Nipples', 'Tender or Sore Nipples')}</option>
                  <option value="mastitis-warning">⚠️ {t('High Fever & Red Hard Streaks', 'High Fever & Red Hard Streaks')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Sleep Total (Hours)', 'Sleep Total (Hours)')}</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepHours}
                  onChange={e => setSleepHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Emotional Wellbeing (1-10)', 'Emotional Wellbeing (1-10)')}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={emotionalScore}
                  onChange={e => setEmotionalScore(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="text-right text-[10px] text-gray-400 font-bold">{emotionalScore} / 10</div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Daily Recovery Notes & Questions for Midwife', 'Daily Recovery Notes & Questions for Midwife')}</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t('e.g. Incision itching normally, baby feeding every 2.5 hours...', 'e.g. Incision itching normally, baby feeding every 2.5 hours...')}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all text-xs cursor-pointer"
            >
              {t('Save Postpartum Check-In', 'Save Postpartum Check-In')}
            </button>
          </form>
        </div>

        {/* Postpartum Timeline & Education */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              {t('The 6-Week Recovery Milestones', 'The 6-Week Recovery Milestones')}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900">{t('Days 1 - 7: Immediate Involution', 'Days 1 - 7: Immediate Involution')}</span>
                <p className="text-purple-800 leading-relaxed">
                  {t('Uterus contracts back toward pelvic bone with cramp-like afterpains (encouraged by breastfeeding oxytocin). Colostrum transitions to mature milk around day 3-5.', 'Uterus contracts back toward pelvic bone with cramp-like afterpains (encouraged by breastfeeding oxytocin). Colostrum transitions to mature milk around day 3-5.')}
                </p>
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-900">{t('Weeks 2 - 4: Healing & Gentle Rhythm', 'Weeks 2 - 4: Healing & Gentle Rhythm')}</span>
                <p className="text-rose-800 leading-relaxed">
                  {t('Lochia lightens from bright red (rubra) to pinkish-yellow (serosa/alba). Rest is non-negotiable: limit stairs and heavy lifting.', 'Lochia lightens from bright red (rubra) to pinkish-yellow (serosa/alba). Rest is non-negotiable: limit stairs and heavy lifting.')}
                </p>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 space-y-1">
                <span className="font-bold text-teal-900">{t('Week 6: Postpartum Clinical Checkup', 'Week 6: Postpartum Clinical Checkup')}</span>
                <p className="text-teal-800 leading-relaxed">
                  {t('Doctor evaluates cervical closure, pelvic floor tone, perineal/incision healing, mental health screening, and contraceptive planning.', 'Doctor evaluates cervical closure, pelvic floor tone, perineal/incision healing, mental health screening, and contraceptive planning.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
