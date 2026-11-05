'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { WEEKS_DATA, WeekData } from '@/data/pregnancyJourneyData';
import {
  getPregnancyMonth,
  getPregnancyTrimester
} from '@/utils/pregnancyCalculations';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Heart,
  Scale,
  Ruler,
  Activity,
  Volume2
} from 'lucide-react';

interface FetalWeeklyHeroProps {
  currentGestationalWeek: number;
  estimatedDueDate?: string;
  onSelectWeek?: (week: number) => void;
}

export const FetalWeeklyHero: React.FC<FetalWeeklyHeroProps> = ({
  currentGestationalWeek,
  estimatedDueDate,
  onSelectWeek
}) => {
  const { updateProfile } = useApp();
  const [selectedWeek, setSelectedWeek] = useState<number>(currentGestationalWeek || 24);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // 0 = Mon, 3 = Thu, etc.
  const [isKicking, setIsKicking] = useState<boolean>(false);
  const [kickNotice, setKickNotice] = useState<string | null>(null);

  // Sync state if currentGestationalWeek changes (e.g. settings updated)
  useEffect(() => {
    if (currentGestationalWeek && currentGestationalWeek >= 1 && currentGestationalWeek <= 40) {
      setSelectedWeek(currentGestationalWeek);
    }
  }, [currentGestationalWeek]);

  const handleWeekChange = (newWeek: number) => {
    const clamped = Math.max(1, Math.min(40, newWeek));
    setSelectedWeek(clamped);
    if (onSelectWeek) onSelectWeek(clamped);
  };

  // 1-Click Update of Mother's actual current week
  const handleSetAsCurrentWeek = () => {
    updateProfile({ currentGestationalWeek: selectedWeek });
  };

  // Interactive kick reaction
  const triggerBabyKick = () => {
    setIsKicking(true);
    const msgs = [
      `Baby gave a gentle flutter at Week ${selectedWeek}! ✨`,
      `Baby rolled happily in the amniotic waters! 🌸`,
      `Baby felt your warm touch! Quickening motion detected 💕`,
      `Active little kick registered! 👶`
    ];
    setKickNotice(msgs[Math.floor(Math.random() * msgs.length)]);
    setTimeout(() => {
      setIsKicking(false);
    }, 1200);
    setTimeout(() => {
      setKickNotice(null);
    }, 3500);
  };

  // Comprehensive weekly clinical data for all 40 weeks
  const currentWeekData: WeekData = useMemo(() => {
    return (
      WEEKS_DATA.find((w) => w.week === selectedWeek) ||
      WEEKS_DATA[Math.min(WEEKS_DATA.length - 1, Math.max(0, selectedWeek - 1))] ||
      WEEKS_DATA[0]
    );
  }, [selectedWeek]);

  // Dynamic clinical fetal heart rate (BPM) based on gestational age
  const fetalBpm = useMemo(() => {
    if (selectedWeek <= 4) return null; // Pre-heartbeat
    if (selectedWeek <= 7) return 110 + (selectedWeek - 4) * 15; // 125 to 155 bpm
    if (selectedWeek <= 10) return 165 - (selectedWeek - 8) * 3; // 165 to 160 bpm
    if (selectedWeek <= 20) return 155 - (selectedWeek - 10) * 1; // 155 to 145 bpm
    if (selectedWeek <= 30) return 145 - (selectedWeek - 20) * 0.7; // 145 to 138 bpm
    return Math.round(135 - (selectedWeek - 30) * 0.5); // 135 to 130 bpm
  }, [selectedWeek]);

  // Calculate calendar days for this week based on EDD or baseline reference
  const weekCalendarData = useMemo(() => {
    const baseDate = new Date();
    const weekDiff = selectedWeek - (currentGestationalWeek || 24);
    baseDate.setDate(baseDate.getDate() + weekDiff * 7);

    // Compute Monday of that week
    const currentDay = baseDate.getDay();
    const distanceToMonday = (currentDay + 6) % 7;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() - distanceToMonday);

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const startPregDay = (selectedWeek - 1) * 7 + 1;

    return days.map((dayLabel, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      return {
        label: dayLabel,
        pregnancyDay: startPregDay + idx,
        dateNumber: d.getDate(),
        monthName: d.toLocaleString('en-US', { month: 'long' }),
        fullDate: d
      };
    });
  }, [selectedWeek, currentGestationalWeek]);

  const activeDay = weekCalendarData[selectedDayIndex] || weekCalendarData[3];
  const selectedMonth = getPregnancyMonth(selectedWeek);
  const selectedTrimester = getPregnancyTrimester(selectedWeek);

  // Biological stage category for SVG styling and visual morphing
  const biologicalStage = useMemo(() => {
    if (selectedWeek <= 3) return 'germinal';
    if (selectedWeek <= 5) return 'early-embryo';
    if (selectedWeek <= 7) return 'heartbeat-embryo';
    if (selectedWeek <= 9) return 'curled-embryo';
    if (selectedWeek <= 13) return 'tiny-human';
    if (selectedWeek <= 21) return 'active-fetus';
    if (selectedWeek <= 27) return 'developed-fetus';
    if (selectedWeek <= 34) return 'third-trimester';
    return 'full-term';
  }, [selectedWeek]);

  // Thematic illustration type for "Tips for you Mom"
  const illustrationType = useMemo(() => {
    if (selectedWeek <= 7 || (selectedWeek >= 28 && selectedWeek <= 33)) return 'yoga-rest';
    if (selectedWeek >= 8 && selectedWeek <= 15) return 'healthy-meal';
    return 'hydration-vitamins';
  }, [selectedWeek]);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-4xl bg-card border border-border shadow-card overflow-hidden transition-all duration-300">
      {/* ========================================================= */}
      {/* 1. WARM PEACH HERO SECTION WITH ORGANIC CURVE */}
      {/* ========================================================= */}
      <div className="relative bg-gradient-to-b from-[#FDE8D4] via-[#F8DAC3] to-[#FCEEE1] pt-6 pb-2 px-4 sm:px-8 text-stone-900 overflow-hidden">
        {/* Ambient subtle glow circles in background */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/4 -right-12 w-56 h-56 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar: Date & Month Pill on Left & Navigation Chevrons on Right */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
          {/* Date pill with calendar icon and current month */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-xs text-xs font-semibold text-stone-800">
            <span className="text-amber-800 text-sm">📅</span>
            <span>
              {activeDay.dateNumber} {activeDay.monthName}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-primary font-bold">Month {selectedMonth}</span>
            <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              T{selectedTrimester}
            </span>
          </div>

          {/* Quick interactive week switcher & Arrow navigation */}
          <div className="flex items-center gap-1.5">
            {/* Quick Pills for 4, 8, 12, 20, 28, 36, 40 */}
            <div className="hidden sm:flex items-center gap-1 bg-white/60 p-1 rounded-full border border-white/60 backdrop-blur-sm mr-1">
              {[4, 8, 12, 20, 28, 36, 40].map((wk) => (
                <button
                  key={wk}
                  type="button"
                  onClick={() => handleWeekChange(wk)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    selectedWeek === wk
                      ? 'bg-white text-stone-900 shadow-xs ring-1 ring-amber-300'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {wk}w
                </button>
              ))}
            </div>

            {/* Previous Week */}
            <button
              type="button"
              onClick={() => handleWeekChange(selectedWeek - 1)}
              disabled={selectedWeek <= 1}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-white/60 shadow-xs flex items-center justify-center text-stone-700 transition-all disabled:opacity-40 cursor-pointer"
              title="Previous Week"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Week */}
            <button
              type="button"
              onClick={() => handleWeekChange(selectedWeek + 1)}
              disabled={selectedWeek >= 40}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-white/60 shadow-xs flex items-center justify-center text-stone-700 transition-all disabled:opacity-40 cursor-pointer"
              title="Next Week"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Day Calendar Strip */}
        <div className="relative z-10 grid grid-cols-7 gap-1 sm:gap-2 text-center max-w-md mx-auto mb-4">
          {weekCalendarData.map((item, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected ? 'bg-white/50 backdrop-blur-xs shadow-xs' : 'hover:bg-white/20'
                }`}
              >
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-tight">
                  {item.label}
                </span>

                <span className="text-[10px] text-stone-400 font-mono scale-90">
                  {item.pregnancyDay}d
                </span>

                <div className="relative mt-0.5 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-300'
                        : 'text-stone-700'
                    }`}
                  >
                    {item.dateNumber}
                  </div>

                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 mt-1" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* DYNAMIC ANIMATED BABY SANCTUARY CANVAS                    */}
        {/* Changes visually and biologically for every week 1 to 40  */}
        {/* ========================================================= */}
        <div className="relative z-10 flex flex-col items-center justify-center py-2 sm:py-3">
          {/* Fetal Heartbeat Indicator Pill */}
          {fetalBpm ? (
            <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-rose-200/80 text-rose-700 text-xs font-bold shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>{Math.round(fetalBpm)} BPM Fetal Heartbeat</span>
            </div>
          ) : (
            <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-amber-200/80 text-amber-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Cellular Cleavage & Implantation</span>
            </div>
          )}

          {/* Interactive Baby Canvas Wrapper */}
          <div
            onClick={triggerBabyKick}
            className="relative flex items-center justify-center min-h-[170px] sm:min-h-[210px] cursor-pointer group select-none"
            title="Click or tap to feel a gentle baby kick!"
          >
            {/* Womb Pulsing Aura */}
            <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-amber-200/40 via-rose-100/50 to-orange-100/30 blur-xl animate-womb-pulse pointer-events-none" />

            {/* Ripple Wave on Kick Interaction */}
            {isKicking && (
              <div className="absolute w-28 h-28 rounded-full border-2 border-rose-400/80 animate-ripple pointer-events-none" />
            )}

            {/* Ambient soft shadow underneath baby */}
            <div className="absolute bottom-1 w-36 h-5 bg-amber-900/10 rounded-full blur-md" />

            {/* Floating Animated Fetal Illustration for this specific week */}
            <div className={`transition-transform duration-300 animate-fetal-float ${isKicking ? 'scale-110' : 'group-hover:scale-105'}`}>
              <AnimatedFetalVisualizer
                week={selectedWeek}
                stage={biologicalStage}
                hasHeartbeat={Boolean(fetalBpm)}
                isKicking={isKicking}
              />
            </div>
          </div>

          {/* Kick Toast Feedback */}
          {kickNotice && (
            <div className="mt-1 px-3 py-1 bg-white/90 text-rose-800 text-xs font-bold rounded-full shadow-xs border border-rose-200 animate-in fade-in slide-in-from-bottom-2">
              {kickNotice}
            </div>
          )}

          {/* Centered Week Title & Biometrics Bar */}
          <div className="mt-2 text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-800 tracking-tight flex items-center justify-center gap-2">
              <span>{selectedWeek} Weeks</span>
              <span className="text-sm font-sans font-bold text-stone-600 bg-white/70 px-2.5 py-0.5 rounded-full border border-white/60">
                {currentWeekData.fruitEmoji} {currentWeekData.babySizeFruit}
              </span>
            </h2>

            {/* Fetal Biometric Badges (Length & Weight) */}
            <div className="flex items-center justify-center gap-3 text-xs font-semibold text-stone-700">
              <span className="flex items-center gap-1 bg-white/60 px-2.5 py-0.5 rounded-full border border-white/40">
                <Ruler className="w-3 h-3 text-primary" />
                <span>
                  {currentWeekData.babyLengthCm < 1
                    ? `${(currentWeekData.babyLengthCm * 10).toFixed(1)} mm`
                    : `${currentWeekData.babyLengthCm} cm`}
                </span>
              </span>

              <span className="flex items-center gap-1 bg-white/60 px-2.5 py-0.5 rounded-full border border-white/40">
                <Scale className="w-3 h-3 text-accent" />
                <span>
                  {currentWeekData.babyWeightG >= 1000
                    ? `${(currentWeekData.babyWeightG / 1000).toFixed(2)} kg`
                    : `${currentWeekData.babyWeightG} g`}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Organic Curved Wave Transition Dip into lower card section */}
        <div className="w-full overflow-hidden leading-none mt-2 -mb-2">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-8 sm:h-12 fill-card"
          >
            <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. LOWER SECTION: TWO CARDS ("Baby at X Weeks" & "Tips for you Mom") */}
      {/* ========================================================= */}
      <div className="p-4 sm:p-6 space-y-4 bg-card">
        {/* CARD 1: "Baby at [X] Weeks" */}
        <div className="p-5 rounded-3xl bg-[#FFF9F3] border border-[#F5DECC] shadow-xs space-y-2 transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#8A5A38]">
              {currentWeekData.headline || `Baby at ${selectedWeek} Weeks`}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold uppercase">
              Week {selectedWeek} Milestones
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
            {currentWeekData.babyDevelopment}
          </p>
        </div>

        {/* CARD 2: "Tips for you Mom" */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#F2F1FD] via-[#F5F4FE] to-[#F8F7FF] border border-[#E0DEFD] shadow-xs flex items-center justify-between gap-4 transition-all">
          <div className="space-y-1.5 max-w-lg">
            <h4 className="text-xs sm:text-sm font-bold text-[#5E59B3] tracking-wide flex items-center gap-1.5">
              <span>Tips for you Mom</span>
              <span className="text-[10px] font-normal text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                Trimester {selectedTrimester}
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {currentWeekData.weeklyAdvice || currentWeekData.nutritionTip || currentWeekData.safeExerciseTip}
            </p>
          </div>

          <div className="shrink-0">
            <ThematicTipGraphic type={illustrationType} />
          </div>
        </div>

        {/* Quick Week Scrubber Bar (Allows scrolling 1 to 40 weeks seamlessly) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/50 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Select any pregnancy week (1 - 40):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <input
              type="range"
              min={1}
              max={40}
              value={selectedWeek}
              onChange={(e) => handleWeekChange(Number(e.target.value))}
              className="w-full sm:w-44 accent-primary cursor-pointer"
            />
            <span className="font-mono font-bold text-foreground px-2 py-0.5 rounded-lg bg-muted/50 border border-border min-w-[54px] text-center">
              Wk {selectedWeek}
            </span>

            {/* If browsing a different week, show 1-click update button */}
            {selectedWeek !== currentGestationalWeek ? (
              <button
                type="button"
                onClick={handleSetAsCurrentWeek}
                className="px-2.5 py-1 bg-primary text-white rounded-lg text-[11px] font-bold shadow-2xs hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1"
                title={`Set your pregnancy current progress to Week ${selectedWeek}`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Set as My Current Week</span>
              </button>
            ) : (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                ● Your Current Week
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// ANIMATED FETAL VISUALIZER
// Renders dynamic, biological, beautifully illustrated SVGs with
// real heartbeat pulse, floating animations, and tactile kick reactions.
// =====================================================================
interface AnimatedFetalVisualizerProps {
  week: number;
  stage: string;
  hasHeartbeat: boolean;
  isKicking: boolean;
}

const AnimatedFetalVisualizer: React.FC<AnimatedFetalVisualizerProps> = ({
  week,
  stage,
  hasHeartbeat,
  isKicking
}) => {
  // Continuous scaling factor: smoothly scales from 0.75 in week 1 to 1.15 in week 40
  const scale = 0.75 + (week / 40) * 0.4;

  // 1. WEEKS 1 to 3: The Germinal Blastocyst
  if (stage === 'germinal') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500"
      >
        <defs>
          <radialGradient id="blastocystSphere" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFEBD6" />
            <stop offset="70%" stopColor="#F5C498" />
            <stop offset="100%" stopColor="#D98A55" />
          </radialGradient>
          <radialGradient id="innerCells" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD39B" />
            <stop offset="100%" stopColor="#C46E35" />
          </radialGradient>
        </defs>

        {/* Translucent zona pellucida outer shell */}
        <circle cx="80" cy="80" r="46" fill="none" stroke="#E6A672" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
        <circle cx="80" cy="80" r="42" fill="url(#blastocystSphere)" opacity="0.9" />

        {/* Dividing blastomeres / inner cell mass */}
        <circle cx="72" cy="72" r="14" fill="url(#innerCells)" opacity="0.85" />
        <circle cx="88" cy="74" r="12" fill="url(#innerCells)" opacity="0.85" />
        <circle cx="78" cy="88" r="13" fill="url(#innerCells)" opacity="0.85" />

        {/* Glowing genetic nucleus */}
        <circle cx="78" cy="78" r="4" fill="#FF5E57" opacity="0.9" className="animate-pulse" />
      </svg>
    );
  }

  // 2. WEEKS 4 to 5: Early C-Curve Embryo & Yolk Sac
  if (stage === 'early-embryo') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500"
      >
        <defs>
          <radialGradient id="embryoGrad4" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF4E6" />
            <stop offset="40%" stopColor="#F8D3B0" />
            <stop offset="75%" stopColor="#DE9E6E" />
            <stop offset="100%" stopColor="#AB6033" />
          </radialGradient>
          <radialGradient id="yolkSac4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#F5D7B3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DB9F6B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Translucent Yolk Sac */}
        <circle cx="102" cy="98" r="28" fill="url(#yolkSac4)" stroke="#E4B484" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />

        {/* Curled Embryo Body C-Shape */}
        <path
          d="M62,48 C85,34 108,50 102,76 C96,98 80,112 64,112 C48,112 40,94 48,80 C54,68 66,70 70,80 C74,88 68,96 60,94"
          fill="url(#embryoGrad4)"
          stroke="#BA7440"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Primordial neural heartbeat tube */}
        <circle cx="76" cy="72" r="3.5" fill="#E65A4B" opacity="0.9" className="animate-fetal-heart" />
        <circle cx="76" cy="72" r="7" fill="#E65A4B" opacity="0.2" className="animate-ping" />
      </svg>
    );
  }

  // 3. WEEKS 6 to 7: Heartbeat Embryo with Limb Buds & Prominent Head
  if (stage === 'heartbeat-embryo') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500"
      >
        <defs>
          <radialGradient id="bodyGrad6" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFF7EC" />
            <stop offset="30%" stopColor="#F7D4B2" />
            <stop offset="70%" stopColor="#DC9C6E" />
            <stop offset="100%" stopColor="#A86134" />
          </radialGradient>
        </defs>

        {/* Curled spine & body */}
        <path
          d="M74,36 C98,34 116,54 112,82 C108,106 88,124 68,124 C50,124 42,110 46,94 C50,80 62,78 70,86 C76,92 72,102 62,102"
          fill="url(#bodyGrad6)"
          stroke="#B56E3F"
          strokeWidth="1.2"
        />

        {/* Enlarged embryonic head and brain cavity */}
        <circle cx="74" cy="48" r="21" fill="url(#bodyGrad6)" stroke="#B56E3F" strokeWidth="1" />

        {/* Developing optic eye placode */}
        <circle cx="64" cy="50" r="3" fill="#5A3219" opacity="0.75" />

        {/* Paddle-like arm bud */}
        <path d="M72,70 C64,74 62,82 68,85" stroke="#B56E3F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Glowing Fetal Heartbeat */}
        <circle cx="82" cy="74" r="4.5" fill="#EF4444" className="animate-fetal-heart" />
        <circle cx="82" cy="74" r="8" fill="#EF4444" opacity="0.25" className="animate-ping" />
      </svg>
    );
  }

  // 4. WEEKS 8 to 9: Curled Embryo / Early Fetus with Elbows & Knee Contours
  if (stage === 'curled-embryo') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500"
      >
        <defs>
          <radialGradient id="bodyGrad8" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFF8EE" />
            <stop offset="30%" stopColor="#F9D7B7" />
            <stop offset="70%" stopColor="#DC9E70" />
            <stop offset="100%" stopColor="#A86134" />
          </radialGradient>
        </defs>

        {/* Curled back & body */}
        <path
          d="M78,35 C104,35 118,56 114,82 C110,108 92,126 70,126 C52,126 44,112 48,96 C50,84 62,80 72,88 C80,95 78,106 68,106"
          fill="url(#bodyGrad8)"
          stroke="#BA7442"
          strokeWidth="1.2"
        />

        {/* Developing head with forehead curvature */}
        <circle cx="76" cy="50" r="23" fill="url(#bodyGrad8)" stroke="#BA7442" strokeWidth="1" />

        {/* Closed eye slit */}
        <ellipse cx="66" cy="52" rx="2.5" ry="3.5" fill="#5F3419" opacity="0.6" />

        {/* Arm reaching toward chest */}
        <path d="M72,70 C62,74 60,82 66,86 C72,89 76,82 76,75" fill="#F8D6B4" stroke="#BA7442" strokeWidth="1" />

        {/* Folded leg bud */}
        <path d="M88,102 C82,106 72,112 68,108 C64,104 70,96 78,96" fill="#DE9D6E" stroke="#BA7442" strokeWidth="1" />

        {/* Pulsing heart inside chest */}
        <circle cx="80" cy="74" r="4.2" fill="#E11D48" className="animate-fetal-heart" />
      </svg>
    );
  }

  // 5. WEEKS 10 to 13: The Tiny Human (Face, Fingers, Toes)
  if (stage === 'tiny-human') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500"
      >
        <defs>
          <radialGradient id="bodyGrad10" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFF9F1" />
            <stop offset="35%" stopColor="#FADBC0" />
            <stop offset="70%" stopColor="#DC9E72" />
            <stop offset="100%" stopColor="#A86134" />
          </radialGradient>
        </defs>

        {/* Spine curvature */}
        <path
          d="M76,45 C98,42 114,60 110,88 C106,112 90,130 68,130 C50,130 42,116 46,100 C50,85 64,84 74,92 C80,98 76,108 66,108"
          fill="url(#bodyGrad10)"
          stroke="#B56E3F"
          strokeWidth="1.2"
        />

        {/* Profile head with delicate nose contour */}
        <path
          d="M62,35 C68,26 84,24 94,32 C104,40 102,56 94,64 C86,72 74,70 66,62 C60,56 58,42 62,35 Z"
          fill="url(#bodyGrad10)"
          stroke="#B56E3F"
          strokeWidth="1"
        />

        {/* Closed peaceful eye */}
        <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.2" fill="none" opacity="0.8" />

        {/* Soft rosy cheek */}
        <circle cx="76" cy="56" r="4.5" fill="#E87C65" opacity="0.35" />

        {/* Arms held up towards chest */}
        <path d="M78,68 C72,70 65,76 68,82 C71,86 78,85 82,78 Z" fill="#FADBC0" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="70" cy="80" r="3.2" fill="#FFF0DE" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Legs and feet */}
        <path d="M84,105 C78,110 68,116 62,110 C58,104 66,95 76,96 Z" fill="#DC9E72" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="64" cy="112" r="3.5" fill="#FADBC0" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Active Heartbeat */}
        <circle cx="80" cy="74" r="4" fill="#F43F5E" className="animate-fetal-heart" />
      </svg>
    );
  }

  // 6. WEEKS 14 to 21: Active & Thumb-Sucking Fetus
  if (stage === 'active-fetus') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500"
      >
        <defs>
          <radialGradient id="activeFetusGrad" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFF9F2" />
            <stop offset="35%" stopColor="#F9DCBF" />
            <stop offset="70%" stopColor="#D99C70" />
            <stop offset="100%" stopColor="#A86134" />
          </radialGradient>
        </defs>

        {/* Spine and body */}
        <path
          d="M76,40 C100,36 118,56 114,88 C110,116 92,134 68,134 C48,134 40,118 44,98 C48,80 64,80 75,90 C82,97 78,110 66,110"
          fill="url(#activeFetusGrad)"
          stroke="#B56E3F"
          strokeWidth="1.2"
        />

        {/* Baby Head with defined chin */}
        <circle cx="78" cy="46" r="23" fill="url(#activeFetusGrad)" stroke="#B56E3F" strokeWidth="1" />

        {/* Closed calm eyelid */}
        <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M68,56 Q71,58 74,56" stroke="#9C5226" strokeWidth="0.9" fill="none" opacity="0.7" />

        {/* Rosy warm cheek */}
        <circle cx="74" cy="53" r="5" fill="#E87C65" opacity="0.4" />

        {/* Arm reaching with thumb towards mouth */}
        <path d="M78,68 C72,70 64,74 65,80 C68,84 76,82 82,76 Z" fill="#F9DCBF" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="66" cy="78" r="3.5" fill="#FFF2E2" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Bent active legs */}
        <path d="M86,106 C80,112 68,118 62,112 C58,106 68,96 78,98 Z" fill="#D99C70" stroke="#B56E3F" strokeWidth="1" />
        <ellipse cx="64" cy="114" rx="4.5" ry="3.5" fill="#F9DCBF" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Heartbeat pulse */}
        <circle cx="82" cy="74" r="4.2" fill="#E11D48" className="animate-fetal-heart" />
      </svg>
    );
  }

  // 7. WEEKS 22 to 27: The Developed Fetus (Hearing Voices, Eyelashes)
  if (stage === 'developed-fetus') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500"
      >
        <defs>
          <radialGradient id="devFetusGrad" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFFBF5" />
            <stop offset="35%" stopColor="#FADEBE" />
            <stop offset="70%" stopColor="#D99A6C" />
            <stop offset="100%" stopColor="#A85F31" />
          </radialGradient>
        </defs>

        {/* Contoured torso */}
        <path
          d="M74,38 C98,34 118,52 115,84 C112,114 94,134 70,134 C50,134 40,118 44,98 C48,80 64,80 75,90 C82,97 78,110 66,110"
          fill="url(#devFetusGrad)"
          stroke="#B56E3F"
          strokeWidth="1.2"
        />

        {/* Head */}
        <circle cx="78" cy="46" r="23" fill="url(#devFetusGrad)" stroke="#B56E3F" strokeWidth="1" />

        {/* Eyelid and tiny lashes */}
        <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M67,46 L66,44" stroke="#663618" strokeWidth="0.8" />
        <path d="M71,46 L71,43" stroke="#663618" strokeWidth="0.8" />
        <path d="M75,47 L76,44" stroke="#663618" strokeWidth="0.8" />

        <circle cx="74" cy="53" r="5" fill="#E87C65" opacity="0.4" />

        {/* Arms and hands */}
        <path d="M80,68 C74,70 66,77 69,83 C72,87 79,86 84,78 Z" fill="#FADEBE" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="71" cy="80" r="3.5" fill="#FFF2E2" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Plump legs and feet */}
        <path d="M86,106 C80,112 68,118 62,112 C58,106 68,96 78,98 Z" fill="#D99A6C" stroke="#B56E3F" strokeWidth="1" />
        <ellipse cx="64" cy="114" rx="4.5" ry="3.5" fill="#FADEBE" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Steady Heartbeat Pulse */}
        <circle cx="82" cy="74" r="4.2" fill="#E11D48" className="animate-fetal-heart" />
      </svg>
    );
  }

  // 8. WEEKS 28 to 34: Third Trimester Plump Fetus
  if (stage === 'third-trimester') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500"
      >
        <defs>
          <radialGradient id="thirdTriGrad" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="35%" stopColor="#F9DABE" />
            <stop offset="70%" stopColor="#D89768" />
            <stop offset="100%" stopColor="#A65D2F" />
          </radialGradient>
        </defs>

        {/* Robust plump fetal body */}
        <path
          d="M74,36 C102,32 122,52 118,86 C114,118 96,136 68,136 C46,136 36,120 42,98 C46,78 64,78 76,88 C84,96 80,110 66,110"
          fill="url(#thirdTriGrad)"
          stroke="#B56E3F"
          strokeWidth="1.3"
        />

        {/* Round chubby head */}
        <circle cx="78" cy="46" r="24" fill="url(#thirdTriGrad)" stroke="#B56E3F" strokeWidth="1" />

        {/* Soft hair contour */}
        <path d="M68,26 Q86,22 96,36" stroke="#9A6139" strokeWidth="1.5" fill="none" opacity="0.75" />

        {/* Peaceful closed eyelid and sweet smile */}
        <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.3" fill="none" opacity="0.85" />
        <path d="M68,57 Q72,60 76,57" stroke="#9C5226" strokeWidth="1" fill="none" opacity="0.75" />

        <circle cx="74" cy="54" r="5.5" fill="#E87C65" opacity="0.45" />

        {/* Plump arms */}
        <path d="M82,68 C74,70 64,78 68,84 C72,88 80,86 86,78 Z" fill="#F9DABE" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="70" cy="81" r="3.8" fill="#FFF2E2" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Chubby legs nestled together */}
        <path d="M88,106 C80,114 66,120 60,112 C56,104 68,94 80,96 Z" fill="#D89768" stroke="#B56E3F" strokeWidth="1" />
        <ellipse cx="62" cy="114" rx="5" ry="4" fill="#F9DABE" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Strong Steady Heartbeat */}
        <circle cx="82" cy="74" r="4.5" fill="#BE123C" className="animate-fetal-heart" />
      </svg>
    );
  }

  // 9. WEEKS 35 to 40+: Full Term Ready Baby
  return (
    <svg
      viewBox="0 0 160 160"
      style={{ transform: `scale(${scale})` }}
      className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500"
    >
      <defs>
        <radialGradient id="fullTermGrad" cx="38%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="35%" stopColor="#F9DCBF" />
          <stop offset="70%" stopColor="#DCA479" />
          <stop offset="100%" stopColor="#A86337" />
        </radialGradient>
      </defs>

      {/* Full-term plump newborn curled head down */}
      <path
        d="M74,36 C102,32 122,52 118,86 C114,118 96,136 68,136 C46,136 36,120 42,98 C46,78 64,78 76,88 C84,96 80,110 66,110"
        fill="url(#fullTermGrad)"
        stroke="#B56E3F"
        strokeWidth="1.3"
      />

      {/* Head with silky baby hair */}
      <circle cx="78" cy="46" r="24.5" fill="url(#fullTermGrad)" stroke="#B56E3F" strokeWidth="1" />
      <path d="M66,26 Q86,20 98,34" stroke="#8C4F27" strokeWidth="2" fill="none" opacity="0.8" />

      {/* Serene sleeping face */}
      <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.3" fill="none" opacity="0.85" />
      <path d="M68,57 Q72,60 76,57" stroke="#9C5226" strokeWidth="1.1" fill="none" opacity="0.8" />

      <circle cx="74" cy="54" r="6" fill="#E87C65" opacity="0.45" />

      {/* Arms tucked near chin */}
      <path d="M82,68 C74,70 64,78 68,84 C72,88 80,86 86,78 Z" fill="#F9DCBF" stroke="#B56E3F" strokeWidth="1" />
      <circle cx="70" cy="81" r="3.8" fill="#FFF2E2" stroke="#B56E3F" strokeWidth="0.8" />

      {/* Plump legs and feet ready for delivery */}
      <path d="M88,106 C80,114 66,120 60,112 C56,104 68,94 80,96 Z" fill="#DCA479" stroke="#B56E3F" strokeWidth="1" />
      <ellipse cx="62" cy="114" rx="5.2" ry="4.2" fill="#F9DCBF" stroke="#B56E3F" strokeWidth="0.8" />

      {/* Strong, calm term heartbeat */}
      <circle cx="82" cy="74" r="4.5" fill="#BE123C" className="animate-fetal-heart" />
    </svg>
  );
};

// =====================================================================
// THEMATIC TIP GRAPHIC COMPONENT
// Beautiful stickers/illustrations for the "Tips for you Mom" card
// =====================================================================
interface ThematicTipGraphicProps {
  type: 'yoga-rest' | 'healthy-meal' | 'hydration-vitamins';
}

const ThematicTipGraphic: React.FC<ThematicTipGraphicProps> = ({ type }) => {
  if (type === 'yoga-rest') {
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <circle cx="50" cy="50" r="38" fill="#EAE8FC" opacity="0.7" />
          <rect x="18" y="52" width="10" height="22" rx="3" fill="#38BDF8" opacity="0.85" />
          <rect x="20" y="47" width="6" height="5" rx="1.5" fill="#0284C7" />
          <circle cx="58" cy="32" r="10" fill="#FCD34D" opacity="0.3" />
          <circle cx="58" cy="34" r="7.5" fill="#FBBF24" />
          <ellipse cx="58" cy="27" rx="4" ry="3.5" fill="#4B3B2B" />
          <circle cx="58" cy="35" r="5.5" fill="#F8C498" />
          <path d="M46,47 C50,44 66,44 70,47 L72,62 C72,66 44,66 44,62 Z" fill="#FB7185" />
          <path d="M40,65 C40,58 76,58 76,65 C76,71 40,71 40,65 Z" fill="#475569" />
          <circle cx="68" cy="28" r="1.5" fill="#818CF8" />
          <circle cx="48" cy="24" r="1" fill="#818CF8" />
        </svg>
      </div>
    );
  }

  if (type === 'healthy-meal') {
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <circle cx="50" cy="50" r="38" fill="#EAE8FC" opacity="0.7" />
          <rect x="22" y="28" width="56" height="44" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="36" cy="42" r="7" fill="#4ADE80" />
          <circle cx="44" cy="38" r="6" fill="#22C55E" />
          <ellipse cx="60" cy="42" rx="8" ry="6" fill="#D97706" />
          <circle cx="62" cy="56" r="6" fill="#FEF08A" />
          <circle cx="62" cy="56" r="3" fill="#F59E0B" />
          <circle cx="36" cy="56" r="4.5" fill="#EF4444" />
          <circle cx="46" cy="58" r="4.5" fill="#DC2626" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        <circle cx="50" cy="50" r="38" fill="#EAE8FC" opacity="0.7" />
        <rect x="36" y="24" width="16" height="52" rx="4" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.8" />
        <rect x="37" y="40" width="14" height="34" rx="2" fill="#38BDF8" opacity="0.65" />
        <rect x="40" y="18" width="8" height="6" rx="2" fill="#0284C7" />
        <rect x="56" y="44" width="18" height="32" rx="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        <rect x="59" y="38" width="12" height="6" rx="2" fill="#B45309" />
        <rect x="59" y="52" width="12" height="14" rx="2" fill="#FEF3C7" />
        <line x1="62" y1="58" x2="68" y2="58" stroke="#D97706" strokeWidth="1.5" />
        <ellipse cx="28" cy="70" rx="4.5" ry="2.5" fill="#FB923C" transform="rotate(-20 28 70)" />
        <ellipse cx="32" cy="74" rx="4" ry="2.5" fill="#F43F5E" transform="rotate(30 32 74)" />
      </svg>
    </div>
  );
};
