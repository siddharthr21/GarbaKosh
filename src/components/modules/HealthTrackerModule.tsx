'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Activity,
  HeartPulse,
  TrendingUp,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Footprints,
  Play,
  RotateCcw,
  Sparkles,
  Droplet
} from 'lucide-react';

export const HealthTrackerModule: React.FC = () => {
  const {
    profile,
    vitals,
    addVitalRecord,
    reminders,
    addReminder,
    toggleReminder,
    deleteReminder,
    t
  } = useApp();

  // Vitals form state
  const [bpSys, setBpSys] = useState('118');
  const [bpDia, setBpDia] = useState('78');
  const [weight, setWeight] = useState(profile.currentWeightKg.toString());
  const [pulse, setPulse] = useState('78');
  const [glucose, setGlucose] = useState('');
  const [vitalNotes, setVitalNotes] = useState('');

  // Kick Counter State
  const [kickCount, setKickCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [kickTimerSec, setKickTimerSec] = useState(0);

  // New Reminder State
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [remTitle, setRemTitle] = useState('');
  const [remCategory, setRemCategory] = useState<any>('doctor');
  const [remDate, setRemDate] = useState('2026-11-15');
  const [remTime, setRemTime] = useState('10:00 AM');
  const [remDoctor, setRemDoctor] = useState('');

  // Kick Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isCounting) {
      interval = setInterval(() => {
        setKickTimerSec(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCounting]);

  const handleRegisterKick = () => {
    if (!isCounting) setIsCounting(true);
    setKickCount(prev => prev + 1);
  };

  const resetKickSession = () => {
    setIsCounting(false);
    setKickCount(0);
    setKickTimerSec(0);
  };

  const saveKickSession = () => {
    if (kickCount === 0) return;
    const mins = Math.max(1, Math.round(kickTimerSec / 60));
    addVitalRecord({
      date: new Date().toISOString().split('T')[0],
      bloodPressureSys: Number(bpSys) || 118,
      bloodPressureDia: Number(bpDia) || 78,
      weightKg: Number(weight) || profile.currentWeightKg,
      pulseBpm: Number(pulse) || 78,
      kickCount: kickCount,
      notes: `Kick count: ${kickCount} movements recorded in ${mins} minutes.`
    });
    alert(`Kick session saved! Recorded ${kickCount} movements.`);
    resetKickSession();
  };

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    addVitalRecord({
      date: new Date().toISOString().split('T')[0],
      bloodPressureSys: Number(bpSys) || 120,
      bloodPressureDia: Number(bpDia) || 80,
      weightKg: Number(weight) || profile.currentWeightKg,
      pulseBpm: Number(pulse) || 78,
      bloodGlucoseMgDl: glucose ? Number(glucose) : undefined,
      notes: vitalNotes || 'Self-logged vitals'
    });
    setVitalNotes('');
    alert('Vitals successfully updated.');
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle.trim()) return;
    addReminder({
      title: remTitle.trim(),
      category: remCategory,
      date: remDate,
      time: remTime,
      doctorOrLocation: remDoctor.trim() || undefined
    });
    setRemTitle('');
    setRemDoctor('');
    setShowAddReminder(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Module Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>{t('vitalsTitle', 'Maternal & Fetal Vitals Engine')}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          {t('Health Tracker & Smart Reminders', 'Health Tracker & Smart Reminders')}
        </h1>
        <p className="text-sm text-gray-600">
          {t('vitalsSubtitle', 'Record blood pressure, maternal weight gain, fetal kicks, glucose screenings, and doctor visits.')}
        </p>
      </div>

      {/* Top Split: Kick Counter & New Vitals Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kick Counter Card */}
        <div className="bg-gradient-to-br from-cream-50 via-blush-50 to-lavender-50 rounded-3xl p-6 border border-blush-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blush-500 text-white flex items-center justify-center shadow-md shadow-blush-200">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{t('kickCounterTitle', 'Interactive Kick Counter')}</h3>
                <p className="text-xs text-gray-500">{t('Goal: 10 kicks in under 2 hours', 'Goal: 10 kicks in under 2 hours')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-blush-100 font-mono text-xs font-bold text-gray-700">
              <Clock className="w-3.5 h-3.5 text-blush-500" />
              <span>{formatTimer(kickTimerSec)}</span>
            </div>
          </div>

          {/* Big Tap Button */}
          <div className="py-6 flex flex-col items-center justify-center">
            <button
              onClick={handleRegisterKick}
              className="w-36 h-36 rounded-full bg-gradient-to-tr from-blush-500 via-rose-400 to-peach-400 text-white flex flex-col items-center justify-center shadow-xl shadow-blush-200 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
            >
              <Footprints className="w-8 h-8 group-hover:animate-bounce mb-1" />
              <span className="text-3xl font-black">{kickCount}</span>
              <span className="text-[11px] uppercase font-bold tracking-wider opacity-90">{t('Tap on Kick', 'Tap on Kick')}</span>
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center max-w-xs">
              {t('kickCounterDesc', 'Relax on your left side in a calm room. Tap each time you feel a distinct kick, swish, or flutter.')}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-blush-200/60">
            <button
              onClick={resetKickSession}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('Reset', 'Reset')}</span>
            </button>

            <button
              onClick={saveKickSession}
              disabled={kickCount === 0}
              className="px-4 py-2 rounded-xl bg-blush-500 hover:bg-blush-600 text-white text-xs font-bold shadow-md shadow-blush-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {t('Log Kick Count', 'Log Kick Count')} ({kickCount})
            </button>
          </div>
        </div>

        {/* Log Today's Vitals Form */}
        <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{t('Record Today’s Vitals', 'Record Today’s Vitals')}</h3>
              <p className="text-xs text-gray-500">{t('Track cardiovascular & metabolic markers', 'Track cardiovascular & metabolic markers')}</p>
            </div>
          </div>

          <form onSubmit={handleSaveVital} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t('Blood Pressure (Systolic)', 'Blood Pressure (Systolic)')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={bpSys}
                    onChange={e => setBpSys(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blush-400 focus:outline-none"
                    placeholder="120"
                  />
                  <span className="text-gray-400 shrink-0">/</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t('Blood Pressure (Diastolic)', 'Blood Pressure (Diastolic)')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={bpDia}
                    onChange={e => setBpDia(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blush-400 focus:outline-none"
                    placeholder="80"
                  />
                  <span className="text-gray-400 text-[10px] shrink-0">mmHg</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t('Current Weight', 'Current Weight')} (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blush-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t('Heart Pulse', 'Heart Pulse')} (BPM)</label>
                <input
                  type="number"
                  value={pulse}
                  onChange={e => setPulse(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blush-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">{t('Blood Glucose', 'Blood Glucose')} (mg/dL)</label>
              <input
                type="number"
                value={glucose}
                onChange={e => setGlucose(e.target.value)}
                placeholder="e.g. 92"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blush-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">{t('Clinical Notes or Observations', 'Clinical Notes or Observations')}</label>
              <input
                type="text"
                value={vitalNotes}
                onChange={e => setVitalNotes(e.target.value)}
                placeholder="e.g., Felt energetic after morning walk"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blush-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-md transition-all text-xs cursor-pointer"
            >
              {t('Save Vital Update', 'Save Vital Update')}
            </button>
          </form>
        </div>
      </div>

      {/* Historical Vitals Table */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          {t('vitalHistory', 'Recent Vitals History')}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">{t('Date', 'Date')}</th>
                <th className="py-2.5 px-3">{t('Blood Pressure', 'Blood Pressure')}</th>
                <th className="py-2.5 px-3">{t('Weight', 'Weight')}</th>
                <th className="py-2.5 px-3">{t('Pulse', 'Pulse')}</th>
                <th className="py-2.5 px-3">{t('Glucose', 'Glucose')}</th>
                <th className="py-2.5 px-3">{t('Kicks', 'Kicks')}</th>
                <th className="py-2.5 px-3">{t('Notes', 'Notes')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vitals.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-3 font-semibold text-gray-900">{v.date}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-gray-800">{v.bloodPressureSys}/{v.bloodPressureDia}</span>
                    <span className="text-[10px] text-gray-400 ml-1">mmHg</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-gray-700">{v.weightKg} kg</td>
                  <td className="py-3 px-3 text-gray-600">{v.pulseBpm} bpm</td>
                  <td className="py-3 px-3 text-gray-600">{v.bloodGlucoseMgDl ? `${v.bloodGlucoseMgDl} mg/dL` : '—'}</td>
                  <td className="py-3 px-3">
                    {v.kickCount ? (
                      <span className="px-2 py-0.5 rounded-full bg-blush-100 text-blush-700 font-bold text-[10px]">
                        {v.kickCount} {t('kicks', 'kicks')}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-[11px] truncate max-w-xs">{v.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Reminders & Appointments Section */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-lavender-600" />
              {t('Smart Reminders & Clinical Calendar', 'Smart Reminders & Clinical Calendar')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('Prenatal checkups, blood tests, ultrasound scans, and daily prescriptions', 'Prenatal checkups, blood tests, ultrasound scans, and daily prescriptions')}
            </p>
          </div>

          <button
            onClick={() => setShowAddReminder(!showAddReminder)}
            className="px-3.5 py-2 bg-lavender-600 hover:bg-lavender-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Add Reminder', 'Add Reminder')}</span>
          </button>
        </div>

        {/* Add Reminder Form */}
        {showAddReminder && (
          <form onSubmit={handleCreateReminder} className="p-4 bg-lavender-50/60 rounded-2xl border border-lavender-200 text-xs space-y-3">
            <h4 className="font-bold text-lavender-900">{t('Schedule New Reminder', 'Schedule New Reminder')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Title', 'Title')}</label>
                <input
                  type="text"
                  value={remTitle}
                  onChange={e => setRemTitle(e.target.value)}
                  placeholder="e.g. 28-Week Growth Scan"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Category', 'Category')}</label>
                <select
                  value={remCategory}
                  onChange={e => setRemCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                >
                  <option value="doctor">{t('Doctor Visit', 'Doctor Visit')}</option>
                  <option value="scan">{t('Ultrasound Scan', 'Ultrasound Scan')}</option>
                  <option value="medication">{t('Medication', 'Medication')}</option>
                  <option value="vaccination">{t('Vaccination', 'Vaccination')}</option>
                  <option value="hospital">{t('Hospital Preparation', 'Hospital Preparation')}</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Date', 'Date')}</label>
                <input
                  type="date"
                  value={remDate}
                  onChange={e => setRemDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Time', 'Time')}</label>
                <input
                  type="text"
                  value={remTime}
                  onChange={e => setRemTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Doctor or Location', 'Doctor or Location')}</label>
              <input
                type="text"
                value={remDoctor}
                onChange={e => setRemDoctor(e.target.value)}
                placeholder="Dr. Sunita / Fetal Imaging Suite"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddReminder(false)}
                className="px-3 py-1.5 rounded-xl bg-gray-200 text-gray-700 font-bold cursor-pointer"
              >
                {t('Cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-lavender-600 hover:bg-lavender-700 text-white font-bold cursor-pointer"
              >
                {t('Save Schedule', 'Save Schedule')}
              </button>
            </div>
          </form>
        )}

        {/* Reminders List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reminders.map(rem => (
            <div
              key={rem.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                rem.completed
                  ? 'bg-gray-50 border-gray-200 text-gray-400'
                  : 'bg-white border-blush-100 hover:border-blush-300 shadow-2xs'
              }`}
            >
              <button
                onClick={() => toggleReminder(rem.id)}
                className="mt-0.5 shrink-0 text-lavender-600"
              >
                {rem.completed ? (
                  <CheckCircle2 className="w-5 h-5 fill-lavender-600 text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 hover:text-lavender-500" />
                )}
              </button>

              <div className="flex-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-lavender-700 bg-lavender-50 px-2 py-0.5 rounded-md inline-block mb-1">
                  {t(rem.category, rem.category)}
                </span>
                <p className={`font-bold text-gray-900 ${rem.completed ? 'line-through text-gray-400' : ''}`}>
                  {t(rem.title, rem.title)}
                </p>
                <div className="flex items-center gap-2 text-gray-500 text-[11px] mt-1">
                  <span>📅 {rem.date}</span>
                  <span>⏰ {t(rem.time, rem.time)}</span>
                </div>
                {rem.doctorOrLocation && (
                  <p className="text-gray-500 text-[11px] mt-0.5">📍 {t(rem.doctorOrLocation, rem.doctorOrLocation)}</p>
                )}
              </div>

              <button
                onClick={() => deleteReminder(rem.id)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
