'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Smile,
  Heart,
  Sparkles,
  Calendar,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Flame,
  Wind,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

const DAILY_AFFIRMATIONS = [
  "My body knows exactly how to nurture and grow my baby with grace and wisdom.",
  "I surrender to the pace of my body and allow myself to rest without guilt.",
  "Every flutter and kick is a sacred whisper that we are connected and safe.",
  "I am patient with my changing emotions; all my feelings are welcome and temporary.",
  "My baby and I are working together as a divine team through every heartbeat."
];

export const MoodWellnessModule: React.FC = () => {
  const { profile, moodLogs, logMood } = useApp();

  const [selectedMood, setSelectedMood] = useState<'joyful' | 'calm' | 'anxious' | 'exhausted' | 'tearful' | 'nauseated'>('calm');
  const [stressLevel, setStressLevel] = useState(3);
  const [anxietyLevel, setAnxietyLevel] = useState(2);
  const [journalNotes, setJournalNotes] = useState('');
  const [activeAffirmationIdx, setActiveAffirmationIdx] = useState(0);

  // Guided Breathing Coach
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [isBreathingCoach, setIsBreathingCoach] = useState(false);
  const [breathCount, setBreathCount] = useState(4);

  const handleSubmitMood = (e: React.FormEvent) => {
    e.preventDefault();
    logMood({
      mood: selectedMood,
      stressLevel,
      anxietyLevel,
      journalNotes: journalNotes.trim() || 'Daily emotional check-in',
      symptoms: []
    });
    setJournalNotes('');
    alert('Thank you for checking in with your emotional wellbeing.');
  };

  const MOOD_OPTIONS = [
    { type: 'joyful', emoji: '🥰', label: 'Joyful & Connected' },
    { type: 'calm', emoji: '🌸', label: 'Calm & Peaceful' },
    { type: 'anxious', emoji: '😟', label: 'Anxious or Restless' },
    { type: 'exhausted', emoji: '🥱', label: 'Fatigued / Sleepy' },
    { type: 'tearful', emoji: '🥺', label: 'Sensitive / Emotional' },
    { type: 'nauseated', emoji: '🤢', label: 'Nauseated' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
          <Smile className="w-3.5 h-3.5" />
          <span>Maternal Mental & Emotional Sanctuary</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Mood & Emotional Wellness
        </h1>
        <p className="text-sm text-gray-600">
          A gentle, non-judgmental space to validate your emotional experience, release anxiety, and center yourself.
        </p>
      </div>

      {/* Daily Affirmation Card */}
      <div className="bg-gradient-to-r from-purple-100 via-blush-50 to-peach-50 rounded-3xl p-6 border border-purple-200/60 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Today’s Sacred Maternal Affirmation
          </span>
          <p className="text-lg md:text-xl font-serif italic text-purple-950 font-medium max-w-xl">
            "{DAILY_AFFIRMATIONS[activeAffirmationIdx]}"
          </p>
        </div>

        <button
          onClick={() => setActiveAffirmationIdx((prev) => (prev + 1) % DAILY_AFFIRMATIONS.length)}
          className="shrink-0 px-4 py-2 bg-white hover:bg-purple-50 text-purple-800 rounded-xl text-xs font-bold shadow-xs border border-purple-200 transition-colors"
        >
          New Affirmation ✨
        </button>
      </div>

      {/* Check-In Grid: Daily Mood Form & Emotional Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Check-In Card */}
        <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            How are you feeling right now, {profile.name.split(' ')[0]}?
          </h3>

          <form onSubmit={handleSubmitMood} className="space-y-4 text-xs">
            {/* Mood selector buttons */}
            <div className="grid grid-cols-3 gap-2">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setSelectedMood(opt.type as any)}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    selectedMood === opt.type
                      ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-xs scale-102'
                      : 'bg-gray-50/60 border-gray-200 text-gray-600 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl mb-1">{opt.emoji}</span>
                  <span className="text-[11px] text-center leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Stress level slider */}
            <div>
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Stress Level:</span>
                <span className="font-bold text-purple-700">{stressLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={e => setStressLevel(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Completely Zen (1)</span>
                <span>Moderate (5)</span>
                <span>Overwhelmed (10)</span>
              </div>
            </div>

            {/* Anxiety level slider */}
            <div>
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Anxiety / Restlessness:</span>
                <span className="font-bold text-rose-600">{anxietyLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={anxietyLevel}
                onChange={e => setAnxietyLevel(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Tranquil (1)</span>
                <span>Mild worry (5)</span>
                <span>High anxiety (10)</span>
              </div>
            </div>

            {/* Journal prompt */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Emotional Journal (Thoughts, worries, or joyful moments today):
              </label>
              <textarea
                rows={3}
                value={journalNotes}
                onChange={e => setJournalNotes(e.target.value)}
                placeholder="Write freely. Your notes are 100% private to you unless explicitly shared with your partner in privacy settings..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md transition-all text-xs"
            >
              Save Emotional Check-In
            </button>
          </form>
        </div>

        {/* Right: Guided Breathing Coach & Crisis Resources */}
        <div className="space-y-6">
          {/* Calming Breathing Coach */}
          <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-3xl p-6 border border-teal-200/70 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-teal-950 flex items-center gap-2">
                <Wind className="w-5 h-5 text-teal-600" />
                Vagus Nerve De-Stress Breathing
              </h3>
              <span className="text-xs text-teal-700 font-semibold">4-7-8 Relaxation</span>
            </div>

            <p className="text-xs text-teal-900/80 leading-relaxed">
              Gentle coherent diaphragmatic breathing instantly drops maternal heart rate and releases soothing oxytocin to baby.
            </p>

            <div className="py-4 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-teal-500/20 border-4 border-teal-500 flex flex-col items-center justify-center text-teal-950 transition-all duration-1000 animate-pulse">
                <span className="text-2xl font-black">Breathe</span>
                <span className="text-xs font-bold text-teal-700 uppercase">Slowly</span>
              </div>
            </div>

            <div className="p-3 bg-white/80 rounded-2xl border border-teal-100 text-xs text-teal-900">
              <p className="font-semibold mb-1">Gentle instructions:</p>
              <p className="text-teal-800">
                Inhale quietly through your nose for 4 seconds, soft pause for 4 seconds, exhale through soft lips for 6 seconds.
              </p>
            </div>
          </div>

          {/* Emotional Crisis Help Notice */}
          <div className="bg-rose-50 rounded-3xl p-5 border border-rose-200 text-xs space-y-2">
            <h4 className="font-bold text-rose-950 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Perinatal Mental Health Support Hotline
            </h4>
            <p className="text-rose-900 leading-relaxed">
              If you ever feel persistent sadness, detachment, or overwhelming anxiety, please know that you are deeply worthy of care. Specialized perinatal counselors are available 24/7 free of charge.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-bold text-rose-800">
              <span className="px-2.5 py-1 bg-white rounded-lg border border-rose-200">📞 National Maternal Hotline: 1-833-852-6262</span>
              <span className="px-2.5 py-1 bg-white rounded-lg border border-rose-200">📞 India Vandrevala Mental Health: 9999 666 555</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Mood Calendar & Patterns */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Recent Emotional Journal History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {moodLogs.map(log => (
            <div
              key={log.id}
              className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="capitalize font-bold text-gray-800 flex items-center gap-1.5">
                  <span className="text-lg">
                    {log.mood === 'joyful' ? '🥰' : log.mood === 'calm' ? '🌸' : log.mood === 'anxious' ? '😟' : '😴'}
                  </span>
                  {log.mood}
                </span>
                <span className="text-[10px] text-gray-400">{log.date}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <span>Stress: {log.stressLevel}/10</span>
                <span>·</span>
                <span>Anxiety: {log.anxietyLevel}/10</span>
              </div>

              <p className="text-gray-600 leading-relaxed italic line-clamp-3">
                "{log.journalNotes}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
