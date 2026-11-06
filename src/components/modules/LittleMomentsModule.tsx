'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Download,
  ShieldCheck,
  Columns,
  Eye,
  FileText,
  Heart
} from 'lucide-react';

export const LittleMomentsModule: React.FC = () => {
  const { memories, addMemoryItem, deleteMemoryItem, profile, t } = useApp();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScanA, setSelectedScanA] = useState(memories[0]?.id || '');
  const [selectedScanB, setSelectedScanB] = useState(memories[1]?.id || '');

  // New Memory Upload form
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [notes, setNotes] = useState('');
  const [doctorComments, setDoctorComments] = useState('');
  const [week, setWeek] = useState(profile.currentGestationalWeek.toString());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState<'ultrasound' | 'belly-bump' | 'lab-report' | 'milestone'>('ultrasound');

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Image exceeds 8MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMemoryItem({
      date,
      gestationalWeek: Number(week) || profile.currentGestationalWeek,
      type,
      title: title.trim(),
      caption: caption.trim() || 'A precious memory from our pregnancy journey',
      notes: notes.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      doctorComments: doctorComments.trim() || undefined
    });

    setTitle('');
    setCaption('');
    setNotes('');
    setDoctorComments('');
    setShowUploadModal(false);
    alert('Milestone saved to your Little Moments Vault!');
  };

  const handleExportScrapbook = () => {
    const jsonStr = JSON.stringify(memories, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GarbhSarthi_LittleMoments_Scrapbook_${profile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scanA = memories.find(m => m.id === selectedScanA) || memories[0];
  const scanB = memories.find(m => m.id === selectedScanB) || memories[1] || memories[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach-100 text-peach-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('Secure Ultrasound & Milestone Vault', 'Secure Ultrasound & Milestone Vault')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {t('vaultTitle', 'Little Moments')}
          </h1>
          <p className="text-sm text-gray-600">
            {t('vaultSubtitle', 'A private keepsake album for ultrasound scans, bump photos, fetal test reports, and cherished milestones.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              compareMode
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>{compareMode ? t('Exit Compare', 'Exit Compare') : t('Compare Scans', 'Compare Scans')}</span>
          </button>

          <button
            onClick={handleExportScrapbook}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            title={t('Download Scrapbook Export', 'Download Scrapbook Export')}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Export Scrapbook', 'Export Scrapbook')}</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blush-500 to-rose-400 hover:from-blush-600 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blush-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('uploadScan', 'Add Scan / Memory')}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Medical Safety Disclaimer */}
      <div className="p-4 bg-amber-50 rounded-3xl border border-amber-200 text-xs text-amber-900 space-y-1 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-950 uppercase text-[11px]">{t('Diagnostic Imagery Disclaimer', 'Diagnostic Imagery Disclaimer')}:</h4>
          <p className="text-amber-800 leading-relaxed">
            {t('vaultDisclaimer', 'Ultrasound scans stored in Little Moments are for emotional bonding, personal organization, and parental memory keeping. Do not attempt diagnostic comparisons or growth evaluations through visual inspection. Official clinical interpretation must always remain with your certified radiologist or OB/GYN.')}
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Tool Mode */}
      {compareMode && (
        <div className="bg-gradient-to-r from-purple-50 via-cream-50 to-blush-50 rounded-3xl p-6 border border-purple-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Columns className="w-5 h-5 text-purple-600" />
              Stage Comparison Tool (Week vs Week)
            </h3>
            <span className="text-xs text-purple-700 font-semibold">Visual Keepsake Progression</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scan A */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">Earlier Stage:</span>
                <select
                  value={selectedScanA}
                  onChange={e => setSelectedScanA(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs"
                >
                  {memories.map(m => (
                    <option key={m.id} value={m.id}>
                      Week {m.gestationalWeek} - {m.title}
                    </option>
                  ))}
                </select>
              </div>

              {scanA && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="h-48 rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                    <img
                      src={scanA.imageUrl}
                      alt={scanA.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{scanA.title} (Week {scanA.gestationalWeek})</h4>
                  <p className="text-xs text-gray-600">{scanA.caption}</p>
                  {scanA.doctorComments && (
                    <p className="text-[11px] text-gray-500 italic">Dr Note: {scanA.doctorComments}</p>
                  )}
                </div>
              )}
            </div>

            {/* Scan B */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">Later Stage:</span>
                <select
                  value={selectedScanB}
                  onChange={e => setSelectedScanB(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs"
                >
                  {memories.map(m => (
                    <option key={m.id} value={m.id}>
                      Week {m.gestationalWeek} - {m.title}
                    </option>
                  ))}
                </select>
              </div>

              {scanB && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="h-48 rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                    <img
                      src={scanB.imageUrl}
                      alt={scanB.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{scanB.title} (Week {scanB.gestationalWeek})</h4>
                  <p className="text-xs text-gray-600">{scanB.caption}</p>
                  {scanB.doctorComments && (
                    <p className="text-[11px] text-gray-500 italic">Dr Note: {scanB.doctorComments}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chronological Scrapbook Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map(mem => (
          <div
            key={mem.id}
            className="bg-white rounded-3xl overflow-hidden border border-blush-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-blush-700 uppercase tracking-wider border border-blush-200">
                  Week {mem.gestationalWeek}
                </div>
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] capitalize">
                  {mem.type.replace('-', ' ')}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{mem.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base">{mem.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed italic">"{mem.caption}"</p>

                {mem.notes && (
                  <p className="text-[11px] text-gray-500 pt-1 leading-relaxed border-t border-gray-100">
                    {mem.notes}
                  </p>
                )}

                {mem.doctorComments && (
                  <div className="p-2.5 bg-blush-50/50 rounded-xl border border-blush-100 text-[11px] text-blush-900">
                    <span className="font-bold block text-[10px] uppercase text-blush-700">Doctor's Observation:</span>
                    {mem.doctorComments}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0 flex justify-end">
              <button
                onClick={() => deleteMemoryItem(mem.id)}
                className="text-gray-300 hover:text-red-500 p-1.5 transition-colors"
                title="Delete memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal Dialog */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Upload Ultrasound or Milestone</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 24-Week Detailed Profile Scan"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('Type', 'Type')}</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="ultrasound">{t('Ultrasound Scan', 'Ultrasound Scan')}</option>
                    <option value="belly-bump">{t('Belly Bump Photo', 'Belly Bump Photo')}</option>
                    <option value="milestone">{t('Cherished Milestone', 'Cherished Milestone')}</option>
                    <option value="lab-report">{t('Lab / Medical Report', 'Lab / Medical Report')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('scanWeek', 'Gestational Week')}</label>
                  <input
                    type="number"
                    value={week}
                    onChange={e => setWeek(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('scanDate', 'Scan / Event Date')}</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold mb-1">
                  Upload Ultrasound Scan or Bump Photo:
                </label>
                
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold border border-purple-200 cursor-pointer text-xs flex items-center gap-1.5 transition-colors shadow-2xs">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    <span>Choose Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[11px] text-gray-400">or paste image URL</span>
                </div>

                <input
                  type="text"
                  value={imageUrl.startsWith('data:') ? '[Device Photo Selected ✓]' : imageUrl}
                  onChange={e => {
                    if (!imageUrl.startsWith('data:')) setImageUrl(e.target.value);
                  }}
                  placeholder="https://... (or choose file from device above)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />

                {imageUrl && (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-300 shadow-sm mt-1">
                    <img
                      src={imageUrl}
                      alt="Upload Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('scanCaption', 'Personal Caption')}</label>
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="e.g. Baby sucking their thumb during the scan!"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('Doctor’s Clinical Observation', 'Doctor’s Clinical Observation')}</label>
                <input
                  type="text"
                  value={doctorComments}
                  onChange={e => setDoctorComments(e.target.value)}
                  placeholder="e.g. Normal amniotic fluid index, posterior placenta"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
                >
                  {t('Cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blush-500 hover:bg-blush-600 text-white font-bold shadow-md shadow-blush-200 cursor-pointer"
                >
                  {t('saveMoment', 'Upload to Vault')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
