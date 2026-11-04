'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { EXERCISE_ROUTINES, CONTRAINDICATIONS_WARNING } from '@/data/exerciseData';
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Heart,
  Clock,
  Flame,
  Activity,
  Footprints,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const ExerciseModule: React.FC = () => {
  const { profile, exercises, toggleExerciseComplete } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'yoga' | 'walking' | 'breathing' | 'pelvic-floor' | 'stretching'>('all');
  const [selectedRoutine, setSelectedRoutine] = useState(EXERCISE_ROUTINES[0]);

  // Kegel / Breathing interactive trainer state
  const [isTrainerActive, setIsTrainerActive] = useState(false);
  const [trainerPhase, setTrainerPhase] = useState<'squeeze' | 'release'>('squeeze');
  const [trainerCountdown, setTrainerCountdown] = useState(5);
  const [trainerCyclesDone, setTrainerCyclesDone] = useState(0);

  // Daily walking log state
  const [walkingMinutes, setWalkingMinutes] = useState(20);
  const [walkingSteps, setWalkingSteps] = useState(2800);
  const [isWalkingLogged, setIsWalkingLogged] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isTrainerActive) {
      timer = setInterval(() => {
        setTrainerCountdown(prev => {
          if (prev <= 1) {
            if (trainerPhase === 'squeeze') {
              setTrainerPhase('release');
              return 6;
            } else {
              setTrainerPhase('squeeze');
              setTrainerCyclesDone(c => c + 1);
              return 5;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTrainerActive, trainerPhase]);

  const toggleTrainer = () => {
    setIsTrainerActive(!isTrainerActive);
    if (!isTrainerActive) {
      setTrainerCountdown(5);
      setTrainerPhase('squeeze');
    }
  };

  const resetTrainer = () => {
    setIsTrainerActive(false);
    setTrainerPhase('squeeze');
    setTrainerCountdown(5);
    setTrainerCyclesDone(0);
  };

  const handleLogWalk = () => {
    setIsWalkingLogged(true);
    alert(`Logged ${walkingMinutes} minutes (${walkingSteps} steps) of mindful walking!`);
  };

  const filteredRoutines = activeCategory === 'all'
    ? EXERCISE_ROUTINES
    : EXERCISE_ROUTINES.filter(r => r.category === activeCategory);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-2">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Prenatal Movement & Pelvic Conditioning</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Smart Exercise & Fitness
        </h1>
        <p className="text-sm text-gray-600">
          Physician-safe routines tailored for Week {profile.currentGestationalWeek} (Trimester 2).
        </p>
      </div>

      {/* Contraindications Warning Banner */}
      <div className="p-4 bg-amber-50 rounded-3xl border border-amber-200 text-xs text-amber-900 space-y-1.5 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-950 uppercase text-[11px]">Safety Protocol & Contraindications:</h4>
          <p className="text-amber-800 leading-relaxed">{CONTRAINDICATIONS_WARNING}</p>
        </div>
      </div>

      {/* Interactive Pelvic Floor Kegel Trainer & Walking Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Animated Kegel & Labor Breath Trainer */}
        <div className="bg-gradient-to-br from-lavender-50 via-cream-50 to-blush-50 rounded-3xl p-6 border border-lavender-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Pelvic Floor & Kegel Trainer</h3>
              <p className="text-xs text-gray-500">Rhythmic contraction and release coaching</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-lavender-200 text-lavender-800 text-xs font-bold">
              {trainerCyclesDone} Reps Completed
            </span>
          </div>

          {/* Animated Visual Pulsing Ring */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-xl ${
                trainerPhase === 'squeeze'
                  ? 'bg-gradient-to-tr from-lavender-600 to-purple-600 scale-95 shadow-lavender-300'
                  : 'bg-gradient-to-tr from-teal-500 to-emerald-500 scale-110 shadow-teal-200'
              }`}
            >
              <span className="text-3xl font-black">{trainerCountdown}s</span>
              <span className="text-xs font-bold uppercase tracking-wider mt-1">
                {trainerPhase === 'squeeze' ? 'Squeeze & Lift 🌸' : 'Gently Release 🍃'}
              </span>
            </div>

            <p className="text-xs text-gray-600 mt-4 text-center max-w-sm">
              {trainerPhase === 'squeeze'
                ? 'Engage your deep pelvic hammock as if stopping the flow of urine. Do not hold breath.'
                : 'Allow all muscles to drop and fully relax into your seat. Full release is essential.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={toggleTrainer}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                isTrainerActive
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-lavender-600 hover:bg-lavender-700 text-white'
              }`}
            >
              {isTrainerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTrainerActive ? 'Pause Trainer' : 'Start Kegel Routine'}</span>
            </button>

            <button
              onClick={resetTrainer}
              className="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Daily Walking Tracker */}
        <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Mindful Walking Tracker</h3>
              <p className="text-xs text-gray-500">Low-impact cardiovascular conditioning</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center py-2">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 uppercase font-bold">Minutes Walked</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{walkingMinutes} min</div>
              <span className="text-[10px] text-gray-500">Goal: 20-30 mins</span>
            </div>

            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100">
              <span className="text-[10px] text-teal-800 uppercase font-bold">Estimated Steps</span>
              <div className="text-2xl font-black text-teal-700 mt-1">{walkingSteps}</div>
              <span className="text-[10px] text-gray-500">Moderate pace</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Adjust Duration (Minutes):</label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={walkingMinutes}
                onChange={e => {
                  const m = Number(e.target.value);
                  setWalkingMinutes(m);
                  setWalkingSteps(m * 140);
                }}
                className="w-full accent-emerald-600"
              />
            </div>

            <button
              onClick={handleLogWalk}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all text-xs"
            >
              {isWalkingLogged ? '✓ Walking Activity Logged' : 'Log Today’s Walk'}
            </button>
          </div>
        </div>
      </div>

      {/* Stage-Based Exercise Library */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Pregnancy Exercise Library</h3>
            <p className="text-xs text-gray-500">Filtered for Trimester 2 suitability</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {(['all', 'yoga', 'walking', 'pelvic-floor', 'breathing', 'stretching'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl capitalize font-bold transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-blush-500 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoutines.map(routine => {
            const isCompleted = exercises.find(e => e.id === routine.id)?.completedToday;

            return (
              <div
                key={routine.id}
                className="p-4 bg-gray-50/60 hover:bg-white rounded-2xl border border-gray-200 hover:border-blush-200 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-blush-100 text-blush-800 uppercase">
                      {routine.difficulty}
                    </span>
                    <span className="text-gray-500 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {routine.durationMinutes} mins
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900">{routine.name}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {routine.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="text-[11px] text-gray-500 space-y-1">
                    <p className="font-semibold text-gray-700">Instructions snippet:</p>
                    <p className="italic line-clamp-2">{routine.instructions[0]}</p>
                  </div>

                  <button
                    onClick={() => toggleExerciseComplete(routine.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-white hover:bg-blush-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completed Today</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-gray-400" />
                        <span>Mark as Done</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
