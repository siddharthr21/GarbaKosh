'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  CheckCircle2,
  Circle,
  Plus,
  Printer,
  Sparkles,
  Baby,
  User,
  Heart,
  Phone,
  FileText
} from 'lucide-react';

export const HospitalChecklistModule: React.FC = () => {
  const { hospitalChecklist, toggleHospitalItem, addHospitalItem, profile, t } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'mother' | 'baby' | 'partner'>('all');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCat, setNewItemCat] = useState<'mother' | 'baby' | 'partner'>('mother');
  const [birthPlanNotes, setBirthPlanNotes] = useState(
    '1. Preferred birthing companion: Rohan (Husband).\n2. Environment: Dim warm lighting, low lavender music.\n3. Pain management: Breathing techniques first, open to epidural if labor stalls.\n4. Immediate postpartum: Delayed cord clamping (1-2 mins) and immediate uninterrupted skin-to-skin.'
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    addHospitalItem(newItemCat, newItemTitle.trim());
    setNewItemTitle('');
  };

  const handlePrint = () => {
    window.print();
  };

  const totalItems = hospitalChecklist.length;
  const packedItems = hospitalChecklist.filter(i => i.packed).length;
  const packedPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const filteredItems = activeCategory === 'all'
    ? hospitalChecklist
    : hospitalChecklist.filter(i => i.category === activeCategory);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title & Print Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t('Labor & Delivery Preparation', 'Labor & Delivery Preparation')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {t('hospitalBagTitle', 'Hospital Bag & Childbirth Checklist')}
          </h1>
          <p className="text-sm text-gray-600">
            {t('hospitalBagSubtitle', 'Smart tripartite packing list for Mother, Baby, and Partner plus your personal birth plan preferences.')}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{t('Print / Export PDF', 'Print / Export PDF')}</span>
        </button>
      </div>

      {/* Progress & Countdown Bar */}
      <div className="bg-gradient-to-r from-cream-100 via-blush-50 to-teal-50 rounded-3xl p-6 border border-blush-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800">
            <span>{t('Overall Hospital Bag Readiness', 'Overall Hospital Bag Readiness')}:</span>
            <span className="text-teal-700 font-extrabold">{packedPercent}% {t('Ready', 'Ready')} ({packedItems}/{totalItems} {t('Packed', 'Packed')})</span>
          </div>
          <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-blush-100">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${packedPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500">
            {t('Aim to have both hospital bags zipped and stored near the front door by Week 35-36.', 'Aim to have both hospital bags zipped and stored near the front door by Week 35-36.')}
          </p>
        </div>

        {/* Quick Emergency Call Pill */}
        <div className="shrink-0 p-4 bg-white rounded-2xl border border-rose-200 shadow-xs text-xs space-y-1">
          <span className="font-bold text-gray-900 block flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-rose-500" /> {t('Hospital Labor Triage', 'Hospital Labor Triage')}
          </span>
          <p className="text-rose-700 font-bold">{profile.doctorInfo.emergencyContact}</p>
          <p className="text-[10px] text-gray-400">{t('Call when contractions are 5-1-1', 'Call when contractions are 5-1-1')}</p>
        </div>
      </div>

      {/* Interactive Checklist Section */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-xs">
            {(['all', 'mother', 'baby', 'partner'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl capitalize font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? t('All Essentials', 'All Essentials') :
                 cat === 'mother' ? t('bagForMother', 'Mother’s Bag') :
                 cat === 'baby' ? t('bagForBaby', 'Baby’s Bag') :
                 t('bagForPartner', 'Partner’s Bag')}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400 hidden sm:inline">
            {t('Tap item to mark as packed', 'Tap item to mark as packed')}
          </span>
        </div>

        {/* Checklist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => toggleHospitalItem(item.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 text-xs ${
                item.packed
                  ? 'bg-teal-50/50 border-teal-200 text-gray-400'
                  : 'bg-white border-gray-200 hover:border-teal-300 text-gray-800'
              }`}
            >
              <button className="mt-0.5 text-teal-600 shrink-0 cursor-pointer">
                {item.packed ? (
                  <CheckCircle2 className="w-5 h-5 fill-teal-600 text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 hover:text-teal-500" />
                )}
              </button>

              <div className="flex-1">
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded mr-1.5 ${
                  item.category === 'mother' ? 'bg-pink-100 text-pink-700' :
                  item.category === 'baby' ? 'bg-cyan-100 text-cyan-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {t(item.category, item.category)}
                </span>
                <span className={`font-semibold ${item.packed ? 'line-through' : ''}`}>
                  {t(item.title, item.title)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Custom Item Form */}
        <form onSubmit={handleAddItem} className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newItemTitle}
            onChange={e => setNewItemTitle(e.target.value)}
            placeholder={t('Add custom packing item...', 'Add custom packing item (e.g. Favorite fluffy pillow, portable diffuser)...')}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <select
            value={newItemCat}
            onChange={e => setNewItemCat(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <option value="mother">{t('bagForMother', 'Mother’s Bag')}</option>
            <option value="baby">{t('bagForBaby', 'Baby’s Bag')}</option>
            <option value="partner">{t('bagForPartner', 'Partner’s Bag')}</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addItem', 'Add Item')}</span>
          </button>
        </form>
      </div>

      {/* Birth Plan Preferences Notepad */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Birth Preferences & Labor Wishes Notes
        </h3>
        <p className="text-xs text-gray-500">
          Document your preferences for labor comfort, companion involvement, pain management, and newborn immediate care. Share these with Dr. {profile.doctorInfo.name}.
        </p>

        <textarea
          rows={5}
          value={birthPlanNotes}
          onChange={e => setBirthPlanNotes(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div className="flex justify-end">
          <button
            onClick={() => alert('Birth preferences saved locally!')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
