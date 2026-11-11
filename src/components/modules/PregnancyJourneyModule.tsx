'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MONTHS_DATA, WEEKS_DATA } from '@/data/pregnancyJourneyData';
import { getPregnancyMonth } from '@/utils/pregnancyCalculations';
import {
  Sparkles,
  Calendar,
  Baby,
  Activity,
  HeartPulse,
  Apple,
  Dumbbell,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Scale,
  Ruler,
  Layers,
  Heart
} from 'lucide-react';

export const PregnancyJourneyModule: React.FC = () => {
  const { profile, t } = useApp();
  const currentMotherMonth = getPregnancyMonth(profile.currentGestationalWeek || 24);
  
  // View mode switcher: 40-week biometric timeline vs 9-month in-depth guide
  const [viewMode, setViewMode] = useState<'weeks' | 'months'>('weeks');
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(profile.currentGestationalWeek || 24);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMotherMonth - 1);

  useEffect(() => {
    const wk = profile.currentGestationalWeek || 24;
    setSelectedWeekNum(wk);
    setSelectedMonthIndex(getPregnancyMonth(wk) - 1);
  }, [profile.currentGestationalWeek]);

  const activeWeek = WEEKS_DATA.find(w => w.week === selectedWeekNum) || WEEKS_DATA[selectedWeekNum - 1] || WEEKS_DATA[0];
  const activeMonth = MONTHS_DATA[selectedMonthIndex] || MONTHS_DATA[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header and View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHO & Hadlock Fetal Biometric Progression</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            {t('journeyTitle')}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mt-0.5">
            {t('journeySubtitle')}
          </p>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="flex items-center gap-1.5 p-1.5 bg-muted/60 dark:bg-muted/40 rounded-2xl border border-border self-start md:self-auto shadow-xs">
          <button
            onClick={() => setViewMode('weeks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'weeks'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('timeline40Weeks')}</span>
          </button>
          <button
            onClick={() => setViewMode('months')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'months'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('chapters9Months')}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 40-WEEK REAL BIOMETRIC TIMELINE VIEW */}
      {/* ==================================================================== */}
      {viewMode === 'weeks' && (
        <div className="space-y-6">
          {/* Week Selector Bar (Scrollable 1 to 40) */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-500">
                {t('selectWeek')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedWeekNum(prev => Math.max(1, prev - 1))}
                  disabled={selectedWeekNum === 1}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {t('week')} {selectedWeekNum} / 40
                </span>
                <button
                  onClick={() => setSelectedWeekNum(prev => Math.min(40, prev + 1))}
                  disabled={selectedWeekNum === 40}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal 40-Week Scroller */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {WEEKS_DATA.map(w => {
                const isSelected = w.week === selectedWeekNum;
                const isCurrent = w.week === profile.currentGestationalWeek;
                const isPast = w.week < profile.currentGestationalWeek;

                return (
                  <button
                    key={w.week}
                    onClick={() => setSelectedWeekNum(w.week)}
                    className={`shrink-0 w-12 h-16 rounded-2xl flex flex-col items-center justify-center transition-all relative text-center border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-md scale-105'
                        : isCurrent
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold'
                        : isPast
                        ? 'bg-[#FAF6EE] text-stone-700 border-stone-200'
                        : 'bg-white text-stone-400 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold opacity-75">Wk</span>
                    <span className="text-sm font-black my-0.5">{w.week}</span>
                    <span className="text-[10px]">{w.fruitEmoji}</span>

                    {isCurrent && (
                      <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[8px] font-bold border border-white">
                        You
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Week Hero Biometric Card */}
          <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EE] to-emerald-50/50 rounded-3xl p-6 md:p-8 border border-stone-200 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {t('week')} {activeWeek.week} · {t('month')} {activeWeek.month} · {t('trimester')} {activeWeek.trimester}
                  </span>
                  {activeWeek.week === profile.currentGestationalWeek && (
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                      {t('active')}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                  {activeWeek.headline}
                </h2>

                <p className="text-sm text-stone-700 max-w-xl">
                  {t('babySizeOf')}{' '}
                  <span className="font-bold text-emerald-900">
                    {activeWeek.babySizeFruit} {activeWeek.fruitEmoji}
                  </span>
                  .
                </p>
              </div>

              {/* Exact Biometrics Tiles */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center min-w-[130px]">
                  <Ruler className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">{t('length')}</span>
                  <div className="text-xl font-serif font-bold text-emerald-900 mt-0.5">
                    {activeWeek.babyLengthCm} cm
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {activeWeek.week <= 13 ? 'Crown-Rump (CRL)' : 'Crown-Heel (CHL)'}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center min-w-[130px]">
                  <Scale className="w-4 h-4 text-[#C47A5A] mx-auto mb-1" />
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">{t('weightMetric')}</span>
                  <div className="text-xl font-serif font-bold text-[#C47A5A] mt-0.5">
                    {activeWeek.babyWeightG >= 1000
                      ? `${(activeWeek.babyWeightG / 1000).toFixed(2)} kg`
                      : `${activeWeek.babyWeightG} g`}
                  </div>
                  <span className="text-[10px] text-stone-500">Hadlock 50th %ile</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Detail Grid Cards for the Week */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Baby Development Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">{t('babyDevelopment')}</h3>
                  <p className="text-xs text-stone-500">{t('babyDevelopmentSub')}</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-stone-700 leading-relaxed pt-1">
                {activeWeek.babyDevelopment}
              </p>
            </div>

            {/* Maternal Changes & Symptoms Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">{t('motherBodySymptoms')}</h3>
                  <p className="text-xs text-stone-500">{t('motherBodySymptomsSub')}</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-stone-700 leading-relaxed pt-1">
                {activeWeek.motherChanges}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeWeek.symptoms.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF6EE] text-stone-800 text-xs font-semibold border border-stone-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Safe Exercise & Movement Tip */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">{t('activityPrecautions')}</h3>
                  <p className="text-xs text-stone-500">{t('activityPrecautionsSub')}</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-stone-700 leading-relaxed pt-1">
                {activeWeek.safeExerciseTip}
              </p>
            </div>

            {/* Clinical Nutrition & Obstetric Advice */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">{t('nutritionGuidance')}</h3>
                  <p className="text-xs text-stone-500">{t('nutritionGuidanceSub')}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs md:text-sm text-stone-700 leading-relaxed pt-1">
                <p>
                  <strong className="text-emerald-900">Nutrition Focus:</strong> {activeWeek.nutritionTip}
                </p>
                <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium">
                  💡 <strong className="font-bold">Clinical Advice:</strong> {activeWeek.weeklyAdvice}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 9 MONTHLY IN-DEPTH CHAPTERS VIEW */}
      {/* ==================================================================== */}
      {viewMode === 'months' && (
        <div className="space-y-6">
          {/* 9-Month Interactive Visual Timeline Navigation */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-500">
                Select Pregnancy Stage:
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSelectedMonthIndex(prev => Math.max(0, prev - 1))}
                  disabled={selectedMonthIndex === 0}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedMonthIndex(prev => Math.min(8, prev + 1))}
                  disabled={selectedMonthIndex === 8}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal 9-Step Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {MONTHS_DATA.map((m, idx) => {
                const isSelected = idx === selectedMonthIndex;
                const isCurrentMotherMonth = idx + 1 === currentMotherMonth;
                const isPast = idx + 1 < currentMotherMonth;

                return (
                  <button
                    key={m.month}
                    onClick={() => setSelectedMonthIndex(idx)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all text-center relative border ${
                      isSelected
                        ? 'bg-emerald-700 text-white font-extrabold shadow-md scale-102 border-emerald-700'
                        : isCurrentMotherMonth
                        ? 'bg-emerald-50 text-emerald-900 font-bold border-emerald-400'
                        : isPast
                        ? 'bg-[#FAF6EE] text-stone-700 border-stone-200'
                        : 'bg-white text-stone-400 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold">Month</span>
                    <span className="text-base font-black my-0.5">{m.month}</span>
                    <span className="text-[9px] opacity-80">{m.weeks.split(' ')[1]}</span>

                    {isCurrentMotherMonth && (
                      <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[8px] font-bold border border-white">
                        You
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Month Headline Card */}
          <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EE] to-emerald-50/50 rounded-3xl p-6 border border-stone-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-emerald-800 border border-emerald-200">
                  Month {activeMonth.month} ({activeMonth.weeks}) · Trimester {activeMonth.trimester}
                </span>
                {activeMonth.month === currentMotherMonth && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    Your Current Stage
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900">
                {activeMonth.themeTitle}
              </h2>
              <p className="text-sm text-stone-700 max-w-xl">
                <strong>Baby Size Comparison:</strong> {activeMonth.fruitComparison}
              </p>
            </div>

            <div className="shrink-0 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center min-w-[200px]">
              <span className="text-[10px] uppercase font-bold text-stone-400">Trimester Focus</span>
              <div className="text-sm font-serif font-bold text-emerald-900 mt-1">
                {activeMonth.trimester === 1
                  ? 'Organogenesis & Foundation'
                  : activeMonth.trimester === 2
                  ? 'Rapid Growth & Movement'
                  : 'Brain Maturity & Labor Readiness'}
              </div>
            </div>
          </div>

          {/* 12 Detailed Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1 & 3: Baby's Development & Major Milestones */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">1. {t('majorMilestones')}</h3>
                  <p className="text-xs text-stone-500">{t('babyDevelopmentSub')}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {activeMonth.babyDevelopment.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <p className="leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs space-y-1.5">
                <span className="font-bold text-emerald-900 uppercase text-[10px]">
                  {t('month')} {activeMonth.month} {t('majorMilestones')}:
                </span>
                {activeMonth.milestones.map((ms, i) => (
                  <div key={i} className="flex items-center gap-2 text-stone-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{ms}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 & 5: Mother's Physical Changes & Common Symptoms */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">2. {t('motherBodySymptoms')}</h3>
                  <p className="text-xs text-stone-500">{t('motherBodySymptomsSub')}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-stone-800 block text-[11px] uppercase">{t('maternalChanges')}:</span>
                {activeMonth.motherPhysicalChanges.map((chg, i) => (
                  <div key={i} className="flex items-start gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <p className="leading-relaxed">{chg}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <span className="font-bold text-stone-800 text-[11px] block uppercase">{t('motherBodySymptoms')}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeMonth.commonSymptoms.map((sym, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#FAF6EE] text-stone-800 text-xs font-semibold border border-stone-200">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 6: Emotional & Hormonal Changes */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">3. {t('emotionalWellness')}</h3>
                  <p className="text-xs text-stone-500">{t('maternalChanges')}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {activeMonth.emotionalAndHormonal.map((emo, i) => (
                  <div key={i} className="p-2.5 bg-[#FAF6EE] rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                    {emo}
                  </div>
                ))}
              </div>
            </div>

            {/* 7 & 8: Nutrition & Safe Activity */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">4. {t('nutritionAdvice')}</h3>
                  <p className="text-xs text-stone-500">{t('nutritionGuidance')}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-emerald-900 text-[11px] block uppercase">{t('nutrition')}:</span>
                {activeMonth.recommendedNutrition.map((nutr, i) => (
                  <div key={i} className="flex items-center gap-2 text-stone-700">
                    <Apple className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{nutr}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-stone-100">
                <span className="font-bold text-blue-900 text-[11px] block uppercase">{t('safeExercises')}:</span>
                {activeMonth.safeActivityAndExercise.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 text-stone-700">
                    <Dumbbell className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{ex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 9 & 10: Appointments, Scans & Precautions */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">5. {t('precautionsHeading')}</h3>
                  <p className="text-xs text-stone-500">{t('emergencyProtocol')}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-stone-800 text-[11px] block uppercase">Clinical Appointments & Scans:</span>
                {activeMonth.medicalAppointmentsAndScans.map((scan, i) => (
                  <div key={i} className="p-2.5 bg-[#FAF6EE] rounded-xl border border-stone-200 text-stone-800 font-medium">
                    {scan}
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs pt-2">
                <span className="font-bold text-red-700 text-[11px] block uppercase">Safety Precautions:</span>
                {activeMonth.importantPrecautions.map((prec, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-red-950 bg-red-50/70 p-2.5 rounded-xl border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{prec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 11 & 12: FAQs & Practical Weekly Tips */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">6. FAQs & Practical Advice</h3>
                  <p className="text-xs text-stone-500">Peer-reviewed obstetric questions and guidance</p>
                </div>
              </div>

              <div className="space-y-3">
                {activeMonth.faqs.map((faq, i) => (
                  <div key={i} className="p-3 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-1 text-xs">
                    <p className="font-bold text-gray-900">Q: {faq.question}</p>
                    <p className="text-stone-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs pt-2">
                <span className="font-bold text-emerald-800 text-[11px] flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Weekly Practical Advice:
                </span>
                {activeMonth.weeklyTips.map((tip, i) => (
                  <div key={i} className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-stone-800">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
