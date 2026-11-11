'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AlertTriangle,
  Phone,
  X,
  ShieldAlert,
  HeartHandshake,
  Edit3,
  Check,
  Save,
  User,
  Building
} from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { activeEmergencyModal, dismissEmergencyModal, profile, updateProfile, t } = useApp();

  const isEditModeRequested = activeEmergencyModal === 'EDIT_DOCTOR';
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  const [doctorName, setDoctorName] = useState(profile.doctorInfo.name);
  const [doctorPhone, setDoctorPhone] = useState(profile.doctorInfo.phone);
  const [emergencyPhone, setEmergencyPhone] = useState(profile.doctorInfo.emergencyContact);
  const [clinicName, setClinicName] = useState(profile.doctorInfo.clinic);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    setDoctorName(profile.doctorInfo.name);
    setDoctorPhone(profile.doctorInfo.phone);
    setEmergencyPhone(profile.doctorInfo.emergencyContact);
    setClinicName(profile.doctorInfo.clinic);
  }, [profile.doctorInfo]);

  useEffect(() => {
    if (isEditModeRequested) {
      setIsEditingDoctor(true);
    }
  }, [isEditModeRequested]);

  if (!activeEmergencyModal) return null;

  const doctorDisplayName = (profile.doctorInfo.name || 'Obstetrician')
    .split(',')[0]
    .replace(/^Dr\.?\s*/i, '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !doctorPhone.trim()) return;

    updateProfile({
      doctorInfo: {
        ...profile.doctorInfo,
        name: doctorName.trim(),
        phone: doctorPhone.trim(),
        emergencyContact: emergencyPhone.trim() || profile.doctorInfo.emergencyContact,
        clinic: clinicName.trim() || profile.doctorInfo.clinic
      }
    });

    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
      if (isEditModeRequested) {
        setIsEditingDoctor(false);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-card rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-red-500 relative overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
        
        <button
          onClick={dismissEmergencyModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-muted rounded-full p-1.5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 mb-1">
              {isEditModeRequested ? 'SOS Setup' : t('sosEmergency')}
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-foreground leading-snug">
              {isEditModeRequested ? 'Emergency Doctor & Hotline Setup' : t('emergencyProtocol')}
            </h3>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 text-red-900 dark:text-red-200 text-sm leading-relaxed mb-5">
          <p className="font-semibold mb-1">
            {isEditModeRequested ? 'SOS Quick-Dial Configuration:' : 'Triggered Observation:'}
          </p>
          <p className="text-red-800 dark:text-red-300">
            {isEditModeRequested
              ? 'Update your personal obstetrician/gynecologist name and emergency phone numbers below. These will be dialed instantly whenever SOS Emergency is pressed.'
              : activeEmergencyModal}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Clinical Protocol:</strong> Never wait for symptoms to worsen. GarbhSarthi cannot provide diagnosis or physical clinical care. Proceed to your hospital triage immediately.
            </p>
          </div>

          {/* Quick Dial Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`tel:${profile.doctorInfo.phone}`}
              className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-sm group"
            >
              <Phone className="w-4 h-4 shrink-0 group-hover:animate-bounce" />
              <span className="truncate">Call Dr. {doctorDisplayName}</span>
            </a>

            <a
              href={`tel:${profile.doctorInfo.emergencyContact.split(' ')[0]}`}
              className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-sm group"
            >
              <Phone className="w-4 h-4 shrink-0 group-hover:animate-bounce" />
              <span className="truncate">Hospital Triage ER</span>
            </a>
          </div>

          {/* Edit Doctor Button Bar */}
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-gray-500 dark:text-gray-400 truncate max-w-[260px]">
              Dr. {doctorDisplayName} ({profile.doctorInfo.phone})
            </span>
            <button
              type="button"
              onClick={() => {
                setIsEditingDoctor(!isEditingDoctor);
                setShowSaveSuccess(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-bold px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/50 shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingDoctor ? 'Close Edit' : 'Edit Doctor Details'}</span>
            </button>
          </div>

          {/* Collapsible Edit Doctor & Number Form */}
          {isEditingDoctor && (
            <form onSubmit={handleSave} className="p-4 bg-gray-50 dark:bg-muted/40 border border-gray-200 dark:border-border rounded-2xl space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-border/60 pb-2">
                <span className="text-xs font-bold text-gray-900 dark:text-foreground flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  Edit Doctor Contact Details
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Updates SOS dialer immediately</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Doctor's Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="e.g. Dr. Sunita Kulkarni, MD"
                      className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-card border border-gray-200 dark:border-input rounded-xl text-xs text-gray-900 dark:text-foreground focus:ring-1 focus:ring-rose-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Doctor's Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="tel"
                      value={doctorPhone}
                      onChange={(e) => setDoctorPhone(e.target.value)}
                      placeholder="e.g. +91 98450 12345"
                      className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-card border border-gray-200 dark:border-input rounded-xl text-xs text-gray-900 dark:text-foreground focus:ring-1 focus:ring-rose-500 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Hospital Triage Hotline
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="e.g. +91 80 4000 9999"
                      className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-card border border-gray-200 dark:border-input rounded-xl text-xs text-gray-900 dark:text-foreground focus:ring-1 focus:ring-rose-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Clinic / Hospital Name
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="e.g. Bloom Care Hospital"
                      className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-card border border-gray-200 dark:border-input rounded-xl text-xs text-gray-900 dark:text-foreground focus:ring-1 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {showSaveSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2 rounded-xl animate-in fade-in">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Doctor contact saved! SOS Emergency button is now updated with {doctorName}.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingDoctor(false);
                    setShowSaveSuccess(false);
                    setDoctorName(profile.doctorInfo.name);
                    setDoctorPhone(profile.doctorInfo.phone);
                    setEmergencyPhone(profile.doctorInfo.emergencyContact);
                    setClinicName(profile.doctorInfo.clinic);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-border text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Contact Details</span>
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 dark:text-gray-400 pt-1">
            <div className="p-2 bg-gray-50 dark:bg-muted/50 rounded-lg border border-gray-100 dark:border-border">
              <span className="block font-bold text-gray-900 dark:text-foreground">National ER</span>
              <span>112 / 911 / 108</span>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-muted/50 rounded-lg border border-gray-100 dark:border-border">
              <span className="block font-bold text-gray-900 dark:text-foreground">Crisis Lifeline</span>
              <span>988 / 112</span>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-muted/50 rounded-lg border border-gray-100 dark:border-border">
              <span className="block font-bold text-gray-900 dark:text-foreground">Partner Alert</span>
              <span>{profile.partnerProfile?.phone || 'Connected'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-border pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Stay calm, take slow breaths, keep warm.</span>
          </div>
          <button
            onClick={dismissEmergencyModal}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-foreground underline font-medium cursor-pointer"
          >
            I am safe / Dismiss alert
          </button>
        </div>
      </div>
    </div>
  );
};
