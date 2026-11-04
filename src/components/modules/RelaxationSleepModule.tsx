'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SOUNDSCAPE_TRACKS, SLEEP_STORIES, SoundscapeTrack } from '@/data/soundscapes';
import { audioSynth } from '@/utils/audioSynth';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  Waves,
  Trees,
  Activity,
  Sparkles,
  Clock,
  Heart,
  BookOpen,
  Moon
} from 'lucide-react';

export const RelaxationSleepModule: React.FC = () => {
  const { t } = useApp();
  const [activeTrack, setActiveTrack] = useState<SoundscapeTrack>(SOUNDSCAPE_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [activeSleepStory, setActiveSleepStory] = useState(SLEEP_STORIES[0]);

  // Handle Play/Stop
  const handleTogglePlay = (track: SoundscapeTrack) => {
    if (isPlaying && activeTrack.id === track.id) {
      audioSynth.stop();
      setIsPlaying(false);
    } else {
      setActiveTrack(track);
      audioSynth.setVolume(volume);
      audioSynth.playSoundscape(track.id, track.synthType);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioSynth.setVolume(newVol);
  };

  // Sleep timer effect
  useEffect(() => {
    let timer: any = null;
    if (sleepTimerMinutes && isPlaying) {
      timer = setTimeout(() => {
        audioSynth.stop();
        setIsPlaying(false);
        setSleepTimerMinutes(null);
        alert('Sleep timer completed. Sweet dreams! 🌙');
      }, sleepTimerMinutes * 60 * 1000);
    }
    return () => clearTimeout(timer);
  }, [sleepTimerMinutes, isPlaying]);

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain': return <CloudRain className="w-6 h-6" />;
      case 'Waves': return <Waves className="w-6 h-6" />;
      case 'Trees': return <Trees className="w-6 h-6" />;
      case 'Activity': return <Activity className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-2">
          <Moon className="w-3.5 h-3.5" />
          <span>{t('Acoustic Sanctuary & Restorative Sleep', 'Acoustic Sanctuary & Restorative Sleep')}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          {t('sleepTitle', 'Relaxation and Sleep Center')}
        </h1>
        <p className="text-sm text-gray-600">
          {t('sleepSubtitle', 'Scientifically crafted audio frequencies to soothe maternal anxiety, promote melatonin synthesis, and calm fetal heart rate.')}
        </p>
      </div>

      {/* Main Now-Playing Hero Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-gray-400'}`} />
            <span>{isPlaying ? t('Now Synthesizing Soundscape', 'Now Synthesizing Soundscape') : t('Select Soundscape', 'Select Soundscape')}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{t(activeTrack.title, activeTrack.title)}</h2>
          <p className="text-xs md:text-sm text-white/80 leading-relaxed">
            {t(activeTrack.description, activeTrack.description)}
          </p>

          {/* Volume Control & Sleep Timer */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-xs">
              <Volume2 className="w-4 h-4 text-white/80" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={e => handleVolumeChange(Number(e.target.value))}
                className="w-24 accent-purple-400"
              />
              <span className="font-mono text-[11px] text-white/70">{Math.round(volume * 100)}%</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-white/60" />
              <span className="text-[11px] text-white/70">{t('Timer', 'Timer')}:</span>
              {[15, 30, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => setSleepTimerMinutes(sleepTimerMinutes === mins ? null : mins)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    sleepTimerMinutes === mins
                      ? 'bg-purple-500 text-white shadow-xs'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Master Play/Pause Big Button */}
        <div className="shrink-0 flex flex-col items-center">
          <button
            onClick={() => handleTogglePlay(activeTrack)}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-rose-400 text-white flex items-center justify-center shadow-xl shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Play or Pause"
          >
            {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
          </button>
          <span className="text-[11px] text-white/70 mt-2 font-medium">
            {isPlaying ? t('stopAll', 'Pause Loop') : t('playAll', 'Play Ambient')}
          </span>
        </div>
      </div>

      {/* Soundscape Tracks Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900">{t('Curated Organic Soundscapes', 'Curated Organic Soundscapes')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOUNDSCAPE_TRACKS.map(track => {
            const isThisPlaying = isPlaying && activeTrack.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => handleTogglePlay(track)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all flex items-start gap-4 ${
                  isThisPlaying
                    ? 'bg-purple-50/80 border-purple-300 shadow-md ring-2 ring-purple-300 ring-offset-2'
                    : 'bg-white border-gray-200/80 hover:border-purple-200 hover:shadow-xs'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isThisPlaying
                      ? 'bg-purple-600 text-white animate-pulse'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  {getTrackIcon(track.iconName)}
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="capitalize text-[10px] font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md">
                      {t(track.category, track.category)}
                    </span>
                    <span className="text-gray-400 text-[10px]">{t(track.durationDesc, track.durationDesc)}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mt-0.5">{t(track.title, track.title)}</h4>
                  <p className="text-gray-500 line-clamp-2 leading-relaxed">{t(track.description, track.description)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bedtime Guided Sleep Stories */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold text-gray-900">Bedtime Visualizations & Sleep Stories</h3>
        </div>
        <p className="text-xs text-gray-500">
          Gently narrated visualizations to guide your mind into deep, dreamless restorative delta sleep.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SLEEP_STORIES.map(story => (
            <div
              key={story.id}
              onClick={() => setActiveSleepStory(story)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                activeSleepStory.id === story.id
                  ? 'bg-purple-50/50 border-purple-300'
                  : 'bg-gray-50 border-gray-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 text-sm">{story.title}</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold">
                  {story.duration}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{story.summary}</p>
              <div className="p-3 bg-white rounded-xl border border-gray-100 text-[11px] text-gray-600 italic leading-relaxed">
                "{story.textSnippet}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
