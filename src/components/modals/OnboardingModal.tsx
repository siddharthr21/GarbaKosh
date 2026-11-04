'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Heart,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Baby,
  User,
  Users
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    completeOnboarding,
    profile,
    selectedLanguage,
    setSelectedLanguage,
    t
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<'mother' | 'partner'>(profile.role || 'mother');

  // Step 1: Profile
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [language, setLanguage] = useState(profile.partnerProfile?.pairingCode ? 'en-US' : 'en-US');

  // Step 2: Pregnancy Details
  const [calcMethod, setCalcMethod] = useState<'due_date' | 'lmp'>('due_date');
  const [dueDate, setDueDate] = useState(profile.estimatedDueDate);
  const [lmpDate, setLmpDate] = useState(profile.lastMenstrualPeriod);
  const [isFirstPregnancy, setIsFirstPregnancy] = useState(profile.isFirstPregnancy ?? true);
  const [numberOfBabies, setNumberOfBabies] = useState(profile.numberOfBabies || 1);
  const [babyNickname, setBabyNickname] = useState(profile.babyNickname || 'Little Bean');

  // Step 3: Health Preferences
  const [dietaryPref, setDietaryPref] = useState(profile.dietaryPreference);
  const [allergies, setAllergies] = useState<string[]>(profile.allergies || ['Peanuts']);
  const [allergyInput, setAllergyInput] = useState('');
  const [doctorNotes, setDoctorNotes] = useState(profile.doctorInfo.adviceNotes || '');

  // Step 4: Partner & Consent
  const [pairingCodeInput, setPairingCodeInput] = useState('MAMA-2026');
  const [consentAcknowledged, setConsentAcknowledged] = useState(true);

  if (!isOnboardingOpen) return null;

  const handleAddAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (al: string) => {
    setAllergies(allergies.filter(a => a !== al));
  };

  const handleFinish = () => {
    completeOnboarding({
      name,
      role,
      age: Number(age) || 29,
      dietaryPreference: dietaryPref,
      allergies,
      estimatedDueDate: dueDate,
      lastMenstrualPeriod: lmpDate,
      isFirstPregnancy,
      numberOfBabies,
      babyNickname,
      doctorInfo: {
        ...profile.doctorInfo,
        adviceNotes: doctorNotes
      },
      partnerProfile: {
        ...profile.partnerProfile!,
        pairingCode: pairingCodeInput
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-4xl max-w-xl w-full p-6 md:p-8 shadow-card border border-border relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-foreground">{t('authWelcome', 'Welcome to BloomNest')}</h2>
              <p className="text-xs text-muted-foreground">{t('Personalized Setup', 'Step')} {currentStep} / 4: {t('Personalized Setup', 'Personalized Setup')}</p>
            </div>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Language Bar for Onboarding */}
        <div className="pt-2 flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-semibold border-b border-border/50 pb-2">
          <span className="text-muted-foreground text-[10px] uppercase font-bold shrink-0">{t('Language', 'Language')}:</span>
          <div className="flex items-center gap-1">
            {[
              { code: 'en-US', label: 'EN' },
              { code: 'kn-IN', label: 'ಕನ್ನಡ' },
              { code: 'hi-IN', label: 'हिंदी' },
              { code: 'ta-IN', label: 'தமிழ்' },
              { code: 'te-IN', label: 'తెలుగు' },
              { code: 'ml-IN', label: 'മലയാളം' }
            ].map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => setSelectedLanguage(l.code as any)}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  selectedLanguage === l.code
                    ? 'bg-primary text-white font-bold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-muted h-1.5 rounded-full my-4 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-foreground">1. {t('Tell us about yourself', 'Tell us about yourself')}</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-foreground font-semibold mb-1">{t('Your Role', 'Your Role')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('mother')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        role === 'mother'
                          ? 'bg-primary-soft/50 border-primary text-foreground font-bold'
                          : 'bg-muted/10 border-border text-muted-foreground'
                      }`}
                    >
                      🌸 {t('iAmExpectingMother', 'Expecting Mother')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('partner')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        role === 'partner'
                          ? 'bg-accent-soft/50 border-accent text-foreground font-bold'
                          : 'bg-muted/10 border-border text-muted-foreground'
                      }`}
                    >
                      🤝 {t('iAmSupportivePartner', 'Supportive Partner')}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1">{t('fullNameLabel', 'Full Name')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-foreground">2. Pregnancy Details & Gestational Timing</h3>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcMethod('due_date')}
                    className={`flex-1 py-1.5 rounded-xl border font-semibold ${
                      calcMethod === 'due_date' ? 'bg-primary text-white border-primary' : 'bg-muted/40 border-border'
                    }`}
                  >
                    I Know My Due Date
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcMethod('lmp')}
                    className={`flex-1 py-1.5 rounded-xl border font-semibold ${
                      calcMethod === 'lmp' ? 'bg-primary text-white border-primary' : 'bg-muted/40 border-border'
                    }`}
                  >
                    Calculate From Last Period (LMP)
                  </button>
                </div>

                {calcMethod === 'due_date' ? (
                  <div>
                    <label className="block text-foreground font-semibold mb-1">Estimated Due Date (EDD)</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-foreground font-semibold mb-1">First Day of Last Menstrual Period (LMP)</label>
                    <input
                      type="date"
                      value={lmpDate}
                      onChange={e => {
                        setLmpDate(e.target.value);
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getTime())) {
                          d.setDate(d.getDate() + 280);
                          setDueDate(d.toISOString().split('T')[0]);
                        }
                      }}
                      className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl text-xs"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground font-semibold mb-1">Baby Nickname</label>
                    <input
                      type="text"
                      value={babyNickname}
                      onChange={e => setBabyNickname(e.target.value)}
                      placeholder="e.g. Peanut, Bean"
                      className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground font-semibold mb-1">Number of Babies</label>
                    <select
                      value={numberOfBabies}
                      onChange={e => setNumberOfBabies(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl text-xs"
                    >
                      <option value={1}>Single Pregnancy</option>
                      <option value={2}>Twins 👶👶</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-foreground">3. Nutrition & Health Preferences</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-foreground font-semibold mb-1">Dietary Preference</label>
                  <select
                    value={dietaryPref}
                    onChange={e => setDietaryPref(e.target.value as any)}
                    className="w-full px-3 py-2 bg-muted/30 border border-input rounded-xl text-xs"
                  >
                    <option value="vegetarian">Vegetarian (Lacto-ovo)</option>
                    <option value="vegan">100% Plant-Based / Vegan</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1">Known Allergies</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={allergyInput}
                      onChange={e => setAllergyInput(e.target.value)}
                      placeholder="e.g. Peanuts, Gluten"
                      className="flex-1 px-3 py-1.5 bg-muted/30 border border-input rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddAllergy}
                      className="px-3 py-1.5 bg-primary text-white rounded-xl font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {allergies.map(al => (
                      <span
                        key={al}
                        className="px-2.5 py-0.5 rounded-full bg-accent-soft text-accent text-[11px] font-semibold flex items-center gap-1"
                      >
                        <span>{al}</span>
                        <button type="button" onClick={() => handleRemoveAllergy(al)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1">Doctor Advice / Obstetric Notes</label>
                  <textarea
                    rows={2}
                    value={doctorNotes}
                    onChange={e => setDoctorNotes(e.target.value)}
                    placeholder="e.g. Iron supplements prescribed, avoid strenuous abdominal strain"
                    className="w-full p-2.5 bg-muted/30 border border-input rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-foreground">4. Partner Connection & Clinical Safety</h3>

              <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                  Couple Pairing Code
                </span>
                <input
                  type="text"
                  value={pairingCodeInput}
                  onChange={e => setPairingCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-card border border-input rounded-xl text-center font-mono font-bold text-base text-accent"
                />
                <p className="text-[11px] text-muted-foreground text-center">
                  Share this code with your partner so both accounts stay synchronized.
                </p>
              </div>

              <div className="p-3.5 bg-primary-soft/50 rounded-2xl border border-primary/20 text-xs text-foreground space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAcknowledged}
                    onChange={e => setConsentAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary"
                  />
                  <span className="leading-relaxed">
                    <strong>Medical Safety Acknowledgment:</strong> I understand that BloomNest provides evidence-based guidance and emotional support, but does not provide diagnostic care or replace my obstetrician.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl bg-muted text-foreground font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!consentAcknowledged}
              onClick={handleFinish}
              className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Complete Setup</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
