'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AlertTriangle, Phone, X, ShieldAlert, HeartHandshake } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { activeEmergencyModal, dismissEmergencyModal, profile, t } = useApp();

  if (!activeEmergencyModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-red-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
        
        <button
          onClick={dismissEmergencyModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 mb-1">
              {t('sosEmergency')}
            </span>
            <h3 className="text-xl font-bold text-gray-900 leading-snug">
              {t('emergencyProtocol')}
            </h3>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-900 text-sm leading-relaxed mb-5">
          <p className="font-semibold mb-1">Triggered Observation:</p>
          <p className="text-red-800">{activeEmergencyModal}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Clinical Protocol:</strong> Never wait for symptoms to worsen. GarbhSarthi cannot provide diagnosis or physical clinical care. Proceed to your hospital triage immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`tel:${profile.doctorInfo.phone}`}
              className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Dr. {profile.doctorInfo.name.split(',')[0]}</span>
            </a>

            <a
              href={`tel:${profile.doctorInfo.emergencyContact.split(' ')[0]}`}
              className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Hospital Triage ER</span>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 pt-1">
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="block font-bold text-gray-900">National ER</span>
              <span>112 / 911 / 108</span>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="block font-bold text-gray-900">Crisis Lifeline</span>
              <span>988 / 112</span>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="block font-bold text-gray-900">Partner Alert</span>
              <span>{profile.partnerProfile?.phone || 'Connected'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Stay calm, take slow breaths, keep warm.</span>
          </div>
          <button
            onClick={dismissEmergencyModal}
            className="text-xs text-gray-500 hover:text-gray-900 underline font-medium"
          >
            I am safe / Dismiss alert
          </button>
        </div>
      </div>
    </div>
  );
};
