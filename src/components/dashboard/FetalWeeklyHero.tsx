'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Heart
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
  const [selectedWeek, setSelectedWeek] = useState<number>(currentGestationalWeek || 10);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // 0 = Mon, 3 = Thu, etc.

  const handleWeekChange = (newWeek: number) => {
    const clamped = Math.max(1, Math.min(40, newWeek));
    setSelectedWeek(clamped);
    if (onSelectWeek) onSelectWeek(clamped);
  };

  // Calculate calendar days for this week based on EDD or baseline reference
  const weekCalendarData = useMemo(() => {
    // Reference date anchor (Nov 2026 based on mock app timeline)
    const baseDate = new Date();
    // Shift base by week offset from currentGestationalWeek
    const weekDiff = selectedWeek - currentGestationalWeek;
    baseDate.setDate(baseDate.getDate() + weekDiff * 7);

    // Compute Monday of that week
    const currentDay = baseDate.getDay(); // 0 is Sun, 1 is Mon
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

  // Specific data matching reference image for Weeks 4, 8, 10, plus dynamic support for all 40 weeks
  const weekDetails = useMemo(() => {
    switch (selectedWeek) {
      case 4:
        return {
          babyTitle: 'Baby at 4 Weeks',
          babyDescription: 'Your baby is the size of a poppy seed, and the heart is beginning to form.',
          momTips: 'Rest well, drink water, and take folic acid daily.',
          illustrationType: 'yoga-rest' as const,
          fruitSize: 'Poppy seed',
          fetalStage: 'early-blastocyst' as const
        };
      case 8:
        return {
          babyTitle: 'Baby at 8 Weeks',
          babyDescription: 'Your baby is now the size of a cherry, and tiny limbs are forming.',
          momTips: 'Eat small meals, rest well, and stay hydrated.',
          illustrationType: 'healthy-meal' as const,
          fruitSize: 'Cherry',
          fetalStage: 'curled-embryo' as const
        };
      case 10:
        return {
          babyTitle: 'Baby at 10 Weeks',
          babyDescription: 'Your baby is starting to look like a tiny human, with developing facial features and gentle movements.',
          momTips: 'Eat balanced meals, stay hydrated, take your prenatal vitamins, and rest when needed.',
          illustrationType: 'hydration-vitamins' as const,
          fruitSize: 'Prune',
          fetalStage: 'tiny-human' as const
        };
      case 24:
        return {
          babyTitle: 'Baby at 24 Weeks',
          babyDescription: 'Your baby is the size of an ear of corn (approx 30 cm, 600g). Hearing is sharp and tiny taste buds are fully developed.',
          momTips: 'Keep hydrated with 2.5L fluids, practice mindful pelvic stretches, and enjoy evening kicks.',
          illustrationType: 'hydration-vitamins' as const,
          fruitSize: 'Ear of Corn',
          fetalStage: 'developed-fetus' as const
        };
      default:
        if (selectedWeek < 6) {
          return {
            babyTitle: `Baby at ${selectedWeek} Weeks`,
            babyDescription: `Your baby is microscopic yet rapidly dividing into vital cell layers that will become the organs and neural pathway.`,
            momTips: 'Prioritize nourishing sleep, take 400mcg folic acid, and drink plenty of water.',
            illustrationType: 'yoga-rest' as const,
            fruitSize: 'Poppy seed',
            fetalStage: 'early-blastocyst' as const
          };
        } else if (selectedWeek <= 9) {
          return {
            babyTitle: `Baby at ${selectedWeek} Weeks`,
            babyDescription: `Tiny arm and leg buds are elongating. The heart is beating rhythmically at 150-170 bpm!`,
            momTips: 'Eat small, frequent protein-rich snacks to ease morning nausea and stay hydrated.',
            illustrationType: 'healthy-meal' as const,
            fruitSize: 'Berry / Olive',
            fetalStage: 'curled-embryo' as const
          };
        } else if (selectedWeek <= 13) {
          return {
            babyTitle: `Baby at ${selectedWeek} Weeks`,
            babyDescription: `Your baby now has distinct fingers, toes, and delicate facial contours. Baby is practicing tiny swallows.`,
            momTips: 'Eat balanced meals, stay hydrated, take your prenatal vitamins, and rest when needed.',
            illustrationType: 'hydration-vitamins' as const,
            fruitSize: 'Lime / Plum',
            fetalStage: 'tiny-human' as const
          };
        } else if (selectedWeek <= 27) {
          return {
            babyTitle: `Baby at ${selectedWeek} Weeks`,
            babyDescription: `Your baby is actively kicking, flipping, and listening to maternal heartbeats and familiar voices.`,
            momTips: 'Stay hydrated, practice gentle prenatal yoga, and track peaceful evening movements.',
            illustrationType: 'yoga-rest' as const,
            fruitSize: 'Papaya / Eggplant',
            fetalStage: 'developed-fetus' as const
          };
        } else {
          return {
            babyTitle: `Baby at ${selectedWeek} Weeks`,
            babyDescription: `Baby has developed cute chubby cheeks and is storing maternal antibodies for newborn vitality.`,
            momTips: 'Keep hospital bags ready, rest in side-sleeping positions, and do gentle pelvic tilts.',
            illustrationType: 'healthy-meal' as const,
            fruitSize: 'Cantaloupe / Watermelon',
            fetalStage: 'full-term' as const
          };
        }
    }
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

        {/* Top Header Bar: Date Pill on Left & Navigation Chevrons on Right */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
          {/* Date pill with calendar icon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/60 shadow-xs text-xs font-semibold text-stone-800">
            <span className="text-amber-800 text-sm">📅</span>
            <span>
              {activeDay.dateNumber} {activeDay.monthName}
            </span>
          </div>

          {/* Quick interactive week switcher & Arrow navigation */}
          <div className="flex items-center gap-1.5">
            {/* Quick Pills for 4, 8, 10, Current */}
            <div className="hidden sm:flex items-center gap-1 bg-white/50 p-1 rounded-full border border-white/60 backdrop-blur-sm mr-1">
              {[4, 8, 10, 24].map((wk) => (
                <button
                  key={wk}
                  type="button"
                  onClick={() => handleWeekChange(wk)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    selectedWeek === wk
                      ? 'bg-white text-stone-900 shadow-xs'
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
              className="w-7 h-7 rounded-full bg-white/75 hover:bg-white border border-white/60 shadow-xs flex items-center justify-center text-stone-700 transition-all disabled:opacity-40 cursor-pointer"
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
              className="w-7 h-7 rounded-full bg-white/75 hover:bg-white border border-white/60 shadow-xs flex items-center justify-center text-stone-700 transition-all disabled:opacity-40 cursor-pointer"
              title="Next Week"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Day Calendar Strip matching the reference screenshot */}
        <div className="relative z-10 grid grid-cols-7 gap-1 sm:gap-2 text-center max-w-md mx-auto mb-6">
          {weekCalendarData.map((item, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/40 backdrop-blur-xs'
                    : 'hover:bg-white/20'
                }`}
              >
                {/* Day of Week Initial (M, T, W, T, F, S, S) */}
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-tight">
                  {item.label}
                </span>

                {/* Gestational Day Number */}
                <span className="text-[10px] text-stone-400 font-mono scale-90">
                  {item.pregnancyDay}
                </span>

                {/* Day of Month with active circle highlight */}
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

                  {/* Active dot indicator beneath active day */}
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 mt-1" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Center Baby Watercolor Illustration & Centered Week Title */}
        <div className="relative z-10 flex flex-col items-center justify-center py-2 sm:py-4">
          <div className="relative flex items-center justify-center min-h-[160px] sm:min-h-[190px]">
            {/* Ambient soft shadow underneath baby */}
            <div className="absolute bottom-2 w-32 h-6 bg-amber-900/10 rounded-full blur-md" />

            {/* Watercolor Fetal Illustration Component */}
            <FetalWatercolorArt stage={weekDetails.fetalStage} week={selectedWeek} />
          </div>

          {/* Centered Week Label matching reference e.g. "4 Weeks", "10 Weeks" */}
          <div className="mt-2 text-center">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-800 tracking-tight">
              {selectedWeek} Weeks
            </h2>
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
        <div className="p-5 rounded-3xl bg-[#FFF9F3] border border-[#F5DECC] shadow-xs space-y-1.5 transition-all">
          <h3 className="text-sm sm:text-base font-serif font-bold text-[#8A5A38]">
            {weekDetails.babyTitle}
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
            {weekDetails.babyDescription}
          </p>
        </div>

        {/* CARD 2: "Tips for you Mom" */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#F2F1FD] via-[#F5F4FE] to-[#F8F7FF] border border-[#E0DEFD] shadow-xs flex items-center justify-between gap-4 transition-all">
          {/* Left Text */}
          <div className="space-y-1.5 max-w-lg">
            <h4 className="text-xs sm:text-sm font-bold text-[#5E59B3] tracking-wide">
              Tips for you Mom
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {weekDetails.momTips}
            </p>
          </div>

          {/* Right Thematic Illustration Graphic */}
          <div className="shrink-0">
            <ThematicTipGraphic type={weekDetails.illustrationType} />
          </div>
        </div>

        {/* Quick Week Scrubber Bar (Allows scrolling 1 to 40 weeks seamlessly) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/50 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Select any week milestone (1 - 40):</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
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

            {selectedWeek !== currentGestationalWeek && (
              <button
                type="button"
                onClick={() => handleWeekChange(currentGestationalWeek)}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 shrink-0 cursor-pointer ml-1"
                title="Return to your actual gestational week"
              >
                <RotateCcw className="w-3 h-3" />
                <span>My Week ({currentGestationalWeek})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// FETAL WATERCOLOR ART RENDERER COMPONENT
// Beautiful, delicate, watercolor rendering representing fetal stages
// =====================================================================
interface FetalArtProps {
  stage: 'early-blastocyst' | 'curled-embryo' | 'tiny-human' | 'developed-fetus' | 'full-term';
  week: number;
}

const FetalWatercolorArt: React.FC<FetalArtProps> = ({ stage, week }) => {
  if (stage === 'early-blastocyst') {
    // 4 Weeks Stage: Tiny C-curved embryonic disc & yolk sac
    return (
      <svg
        viewBox="0 0 160 160"
        className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-md transition-all duration-500 animate-in fade-in zoom-in-95"
      >
        <defs>
          <radialGradient id="embryoGlow" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF2E2" />
            <stop offset="35%" stopColor="#F5D0A9" />
            <stop offset="70%" stopColor="#D99B6A" />
            <stop offset="100%" stopColor="#A86236" />
          </radialGradient>
          <radialGradient id="yolkSacGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#F0CE9E" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D49A62" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Translucent Yolk Sac ring */}
        <circle cx="95" cy="95" r="28" fill="url(#yolkSacGlow)" stroke="#E4B484" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.75" />

        {/* Curled Early Embryo Body (Week 4 C-shape) */}
        <path
          d="M65,50 C85,38 105,52 100,75 C95,95 82,108 68,110 C52,112 45,95 50,82 C55,70 65,72 70,80 C74,86 70,95 62,94"
          fill="url(#embryoGlow)"
          stroke="#C48452"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 4px 6px rgba(168,98,54,0.18))"
        />

        {/* Tiny pulsing neural/heart glow */}
        <circle cx="78" cy="74" r="3.5" fill="#E65A4B" opacity="0.85" className="animate-pulse" />
        <circle cx="78" cy="74" r="7" fill="#E65A4B" opacity="0.25" className="animate-ping" />
      </svg>
    );
  }

  if (stage === 'curled-embryo') {
    // 8 Weeks Stage: Curled fetus with distinct head, tiny arm/leg buds, curved back (matching screenshot)
    return (
      <svg
        viewBox="0 0 160 160"
        className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-md transition-all duration-500 animate-in fade-in zoom-in-95"
      >
        <defs>
          <radialGradient id="fetusBodyGrad" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFF5EA" />
            <stop offset="25%" stopColor="#F8D6B4" />
            <stop offset="60%" stopColor="#DE9D6E" />
            <stop offset="100%" stopColor="#AB6437" />
          </radialGradient>
          <radialGradient id="headShading" cx="35%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#FFF9F2" />
            <stop offset="50%" stopColor="#F5CEAA" />
            <stop offset="100%" stopColor="#C9814E" />
          </radialGradient>
        </defs>

        {/* Curled back, body and tail curvature */}
        <path
          d="M80,35 C105,35 118,55 114,80 C110,105 92,125 72,125 C55,125 45,112 48,96 C50,84 62,80 72,88 C80,95 78,106 68,106"
          fill="url(#fetusBodyGrad)"
          stroke="#BA7442"
          strokeWidth="1.2"
        />

        {/* Developing head */}
        <circle cx="78" cy="50" r="22" fill="url(#headShading)" stroke="#BA7442" strokeWidth="1" />

        {/* Eye indentation */}
        <ellipse cx="68" cy="52" rx="2.5" ry="3" fill="#693B1E" opacity="0.6" />

        {/* Arm bud reaching toward chest */}
        <path
          d="M72,70 C64,74 62,82 68,85 C73,87 76,82 76,75"
          fill="#F5CEAA"
          stroke="#BA7442"
          strokeWidth="1"
        />

        {/* Leg bud folded up */}
        <path
          d="M88,102 C82,106 72,112 68,108 C64,104 70,96 78,96"
          fill="#DE9D6E"
          stroke="#BA7442"
          strokeWidth="1"
        />
      </svg>
    );
  }

  if (stage === 'tiny-human') {
    // 10 Weeks Stage: Looks like a tiny human with visible face, gentle forehead, tiny hands near chest (exact match to screenshot)
    return (
      <svg
        viewBox="0 0 160 160"
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500 animate-in fade-in zoom-in-95"
      >
        <defs>
          <radialGradient id="tenWeekBody" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFF7EE" />
            <stop offset="30%" stopColor="#F7D8BD" />
            <stop offset="70%" stopColor="#DB9F73" />
            <stop offset="100%" stopColor="#A86134" />
          </radialGradient>
          <radialGradient id="tenWeekHead" cx="35%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#FFF9F3" />
            <stop offset="45%" stopColor="#FADBBF" />
            <stop offset="85%" stopColor="#D99B6E" />
            <stop offset="100%" stopColor="#BA7242" />
          </radialGradient>
        </defs>

        {/* Smooth Curved Spine & Body */}
        <path
          d="M76,45 C98,42 114,60 110,88 C106,112 90,130 68,130 C50,130 42,116 46,100 C50,85 64,84 74,92 C80,98 76,108 66,108"
          fill="url(#tenWeekBody)"
          stroke="#B56E3F"
          strokeWidth="1.2"
        />

        {/* Head with forehead and nose profile */}
        <path
          d="M62,35 C68,26 84,24 94,32 C104,40 102,56 94,64 C86,72 74,70 66,62 C60,56 58,42 62,35 Z"
          fill="url(#tenWeekHead)"
          stroke="#B56E3F"
          strokeWidth="1"
        />

        {/* Closed serene eyelid */}
        <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.2" fill="none" opacity="0.75" />

        {/* Soft rosy cheek warmth */}
        <circle cx="76" cy="56" r="4.5" fill="#E87C65" opacity="0.35" />

        {/* Arms held up towards chest / face */}
        <path
          d="M78,68 C72,70 65,76 68,82 C71,86 78,85 82,78 C84,74 82,70 78,68 Z"
          fill="#FADBBF"
          stroke="#B56E3F"
          strokeWidth="1"
        />

        {/* Tiny hands and fingers contour */}
        <circle cx="70" cy="80" r="3.2" fill="#FFF0DE" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Bent legs and tiny feet curled in womb */}
        <path
          d="M84,105 C78,110 68,116 62,110 C58,104 66,95 76,96 C84,97 88,100 84,105 Z"
          fill="#DB9F73"
          stroke="#B56E3F"
          strokeWidth="1"
        />
        <circle cx="64" cy="112" r="3.5" fill="#F7D8BD" stroke="#B56E3F" strokeWidth="0.8" />
      </svg>
    );
  }

  // Stage 4 & 5: Developed / Full Term Fetus (Weeks 14 to 40)
  return (
    <svg
      viewBox="0 0 160 160"
      className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-500 animate-in fade-in zoom-in-95"
    >
      <defs>
        <radialGradient id="fullTermBody" cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="35%" stopColor="#F9DCBF" />
          <stop offset="70%" stopColor="#DCA479" />
          <stop offset="100%" stopColor="#A86337" />
        </radialGradient>
      </defs>

      {/* Fully contoured fetus nestled peacefully */}
      <path
        d="M74,38 C98,34 118,52 115,84 C112,114 94,134 70,134 C50,134 40,118 44,98 C48,80 64,80 75,90 C82,97 78,110 66,110"
        fill="url(#fullTermBody)"
        stroke="#B56E3F"
        strokeWidth="1.2"
      />

      {/* Head */}
      <circle cx="78" cy="46" r="23" fill="url(#fullTermBody)" stroke="#B56E3F" strokeWidth="1" />

      {/* Peaceful closed eyelid and smile */}
      <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.2" fill="none" opacity="0.8" />
      <path d="M68,56 Q71,58 74,56" stroke="#9C5226" strokeWidth="0.9" fill="none" opacity="0.7" />

      {/* Rosy warm cheek */}
      <circle cx="74" cy="53" r="5" fill="#E87C65" opacity="0.4" />

      {/* Arms tucked near chin */}
      <path
        d="M80,68 C74,70 66,77 69,83 C72,87 79,86 84,78 Z"
        fill="#F9DCBF"
        stroke="#B56E3F"
        strokeWidth="1"
      />
      <circle cx="71" cy="80" r="3.5" fill="#FFF2E2" stroke="#B56E3F" strokeWidth="0.8" />

      {/* Plump legs and feet */}
      <path
        d="M86,106 C80,112 68,118 62,112 C58,106 68,96 78,98 Z"
        fill="#DCA479"
        stroke="#B56E3F"
        strokeWidth="1"
      />
      <ellipse cx="64" cy="114" rx="4.5" ry="3.5" fill="#F9DCBF" stroke="#B56E3F" strokeWidth="0.8" />
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
    // Meditating/Resting Mom with water bottle (matching Week 4 screenshot)
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Subtle background glow */}
          <circle cx="50" cy="50" r="38" fill="#EAE8FC" opacity="0.7" />

          {/* Water bottle on left */}
          <rect x="18" y="52" width="10" height="22" rx="3" fill="#38BDF8" opacity="0.85" />
          <rect x="20" y="47" width="6" height="5" rx="1.5" fill="#0284C7" />

          {/* Mom head & hair bun */}
          <circle cx="58" cy="32" r="10" fill="#FCD34D" opacity="0.3" />
          <circle cx="58" cy="34" r="7.5" fill="#FBBF24" />
          <ellipse cx="58" cy="27" rx="4" ry="3.5" fill="#4B3B2B" />
          <circle cx="58" cy="35" r="5.5" fill="#F8C498" />

          {/* Mom body in peaceful seated lotus */}
          <path d="M46,47 C50,44 66,44 70,47 L72,62 C72,66 44,66 44,62 Z" fill="#FB7185" />
          {/* Folded legs in yoga pose */}
          <path d="M40,65 C40,58 76,58 76,65 C76,71 40,71 40,65 Z" fill="#475569" />

          {/* Calming energy spark */}
          <circle cx="68" cy="28" r="1.5" fill="#818CF8" />
          <circle cx="48" cy="24" r="1" fill="#818CF8" />
        </svg>
      </div>
    );
  }

  if (type === 'healthy-meal') {
    // Wholesome colorful food bowl / nutrition tray (matching Week 8 screenshot)
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <circle cx="50" cy="50" r="38" fill="#EAE8FC" opacity="0.7" />

          {/* Bento / Salad Box */}
          <rect x="22" y="28" width="56" height="44" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

          {/* Fresh greens & broccoli */}
          <circle cx="36" cy="42" r="7" fill="#4ADE80" />
          <circle cx="44" cy="38" r="6" fill="#22C55E" />

          {/* Protein patties & boiled egg */}
          <ellipse cx="60" cy="42" rx="8" ry="6" fill="#D97706" />
          <circle cx="62" cy="56" r="6" fill="#FEF08A" />
          <circle cx="62" cy="56" r="3" fill="#F59E0B" />

          {/* Fresh berries / tomatoes */}
          <circle cx="36" cy="56" r="4.5" fill="#EF4444" />
          <circle cx="46" cy="58" r="4.5" fill="#DC2626" />
        </svg>
      </div>
    );
  }

  // type === 'hydration-vitamins' (matching Week 10 screenshot)
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        <circle cx="50" cy="50" r="38" fill="#EAE8FC" opacity="0.7" />

        {/* Tall clear water bottle with water level */}
        <rect x="36" y="24" width="16" height="52" rx="4" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.8" />
        <rect x="37" y="40" width="14" height="34" rx="2" fill="#38BDF8" opacity="0.65" />
        <rect x="40" y="18" width="8" height="6" rx="2" fill="#0284C7" />

        {/* Vitamin Supplement Bottle (Warm amber) */}
        <rect x="56" y="44" width="18" height="32" rx="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        <rect x="59" y="38" width="12" height="6" rx="2" fill="#B45309" />
        {/* Label on bottle */}
        <rect x="59" y="52" width="12" height="14" rx="2" fill="#FEF3C7" />
        <line x1="62" y1="58" x2="68" y2="58" stroke="#D97706" strokeWidth="1.5" />

        {/* Two tiny vitamin capsules */}
        <ellipse cx="28" cy="70" rx="4.5" ry="2.5" fill="#FB923C" transform="rotate(-20 28 70)" />
        <ellipse cx="32" cy="74" rx="4" ry="2.5" fill="#F43F5E" transform="rotate(30 32 74)" />
      </svg>
    </div>
  );
};
