'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ScrollText,
  Printer,
  Sparkles,
  CheckCircle2,
  Circle,
  Heart,
  Baby,
  ShieldCheck,
  Save,
  FileDown
} from 'lucide-react';

export const BirthPlanModule: React.FC = () => {
  const { birthPlan, updateBirthPlan, updateBirthPlanNotes, profile, t } = useApp();
  const [savedToast, setSavedToast] = useState(false);

  const handleToggle = (section: keyof typeof birthPlan, key: string, currentVal: boolean) => {
    updateBirthPlan(section, key, !currentVal);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-bold mb-2">
            <ScrollText className="w-3.5 h-3.5" />
            <span>{t('Labor & Delivery Preferences', 'Labor & Delivery Preferences')}</span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-foreground">
            {t('birthPlanTitle', 'Interactive Birth Plan Builder')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('birthPlanSubtitle', 'Clarify and document your personal wishes for labor environment, pain relief, delivery positions, and newborn immediate care.')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold transition-colors flex items-center gap-1.5 shadow-soft cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('printBirthPlan', 'Print Birth Plan')}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t('saveBirthPlan', 'Save Preferences')}</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="p-3 bg-primary-soft text-primary font-bold text-xs rounded-2xl border border-primary/20 text-center animate-in fade-in">
          ✓ {t('Your birth preferences have been safely synchronized!', 'Your birth preferences have been safely synchronized!')}
        </div>
      )}

      {/* Clinical Guidance Notice */}
      <div className="p-4 bg-muted/40 rounded-3xl border border-border text-xs text-muted-foreground space-y-1 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-foreground uppercase text-[11px]">{t('Collaborative Clinical Partnership', 'Collaborative Clinical Partnership')}:</h4>
          <p className="leading-relaxed">
            {t('A birth plan communicates your ideal preferences to your obstetrician and labor nurses. Remember that labor is dynamic; maintaining flexibility for unexpected medical shifts ensures the ultimate safety of mother and baby.', 'A birth plan communicates your ideal preferences to your obstetrician and labor nurses. Remember that labor is dynamic; maintaining flexibility for unexpected medical shifts ensures the ultimate safety of mother and baby.')}
          </p>
        </div>
      </div>

      {/* Preferences Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Labor Environment */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-4">
          <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            {t('environmentSection', '1. Atmosphere & Labor Environment')}
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { key: 'dimLighting', label: t('Dim and soft warm lighting in labor suite', 'Dim and soft warm lighting in labor suite') },
              { key: 'calmMusic', label: t('Play soothing birth playlist / relaxation soundscapes', 'Play soothing birth playlist / relaxation soundscapes') },
              { key: 'aromatherapy', label: t('Use natural lavender or citrus aromatherapy diffuser', 'Use natural lavender or citrus aromatherapy diffuser') },
              { key: 'minimalInterruption', label: t('Minimize unnecessary chatter and room traffic', 'Minimize unnecessary chatter and room traffic') },
              { key: 'bringOwnPillow', label: t('Use my own maternity pillows and cozy blankets', 'Use my own maternity pillows and cozy blankets') }
            ].map(item => {
              const isChecked = birthPlan.environment[item.key as keyof typeof birthPlan.environment];
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggle('environment', item.key, isChecked)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isChecked ? 'bg-primary-soft/40 border-primary text-foreground font-semibold' : 'bg-muted/10 border-border text-muted-foreground'
                  }`}
                >
                  <span>{item.label}</span>
                  {isChecked ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Companions & Support */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-4">
          <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            {t('companionsSection', '2. Birth Companions & Labor Support')}
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { key: 'partnerPresent', label: `${t('My partner by my side at all times', 'My partner by my side at all times')} (${profile.partnerProfile?.name || 'Rohan'})` },
              { key: 'doulaPresent', label: t('Continuous support from our certified doula', 'Continuous support from our certified doula') },
              { key: 'familyVisitorsRestricted', label: t('No family visitors in labor room until after golden hour', 'No family visitors in labor room until after golden hour') }
            ].map(item => {
              const isChecked = birthPlan.companions[item.key as keyof typeof birthPlan.companions];
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggle('companions', item.key, isChecked)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isChecked ? 'bg-primary-soft/40 border-primary text-foreground font-semibold' : 'bg-muted/10 border-border text-muted-foreground'
                  }`}
                >
                  <span>{item.label}</span>
                  {isChecked ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Pain Management */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-4">
          <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            {t('painReliefSection', '3. Comfort Measures & Pain Relief')}
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { key: 'breathingAndMovement', label: t('Non-pharmacological breathing, rocking, and massage first', 'Non-pharmacological breathing, rocking, and massage first') },
              { key: 'birthingBall', label: t('Access to birthing ball and peanut ball for pelvic opening', 'Access to birthing ball and peanut ball for pelvic opening') },
              { key: 'warmShowerOrTub', label: t('Hydrotherapy: warm shower or tub for pain reduction', 'Hydrotherapy: warm shower or tub for pain reduction') },
              { key: 'openToEpidural', label: t('Open to epidural analgesia if labor becomes prolonged', 'Open to epidural analgesia if labor becomes prolonged') },
              { key: 'nitrousOxideGas', label: t('Nitrous oxide (laughing gas) for contraction surges', 'Nitrous oxide (laughing gas) for contraction surges') }
            ].map(item => {
              const isChecked = birthPlan.painManagement[item.key as keyof typeof birthPlan.painManagement];
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggle('painManagement', item.key, isChecked)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isChecked ? 'bg-primary-soft/40 border-primary text-foreground font-semibold' : 'bg-muted/10 border-border text-muted-foreground'
                  }`}
                >
                  <span>{item.label}</span>
                  {isChecked ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Delivery & Cord Clamping */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-4">
          <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
            <Baby className="w-4 h-4 text-primary" />
            {t('deliverySection', '4. Delivery & Immediate Golden Hour')}
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { key: 'freedomOfPosition', label: t('Freedom to push in upright, side-lying, or squatting position', 'Freedom to push in upright, side-lying, or squatting position') },
              { key: 'delayedCordClamping', label: t('Delayed umbilical cord clamping (until pulsation ceases)', 'Delayed umbilical cord clamping (until pulsation ceases)') },
              { key: 'partnerCutCord', label: `${t('Allow my partner to cut the cord', 'Allow my partner to cut the cord')} (${profile.partnerProfile?.name || 'Rohan'})` },
              { key: 'immediateSkinToSkin', label: t('Immediate uninterrupted skin-to-skin contact (at least 60 mins)', 'Immediate uninterrupted skin-to-skin contact (at least 60 mins)') }
            ].map(item => {
              const isChecked = birthPlan.delivery[item.key as keyof typeof birthPlan.delivery];
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggle('delivery', item.key, isChecked)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isChecked ? 'bg-primary-soft/40 border-primary text-foreground font-semibold' : 'bg-muted/10 border-border text-muted-foreground'
                  }`}
                >
                  <span>{item.label}</span>
                  {isChecked ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Special Notes & Medical Preferences */}
      <div className="bg-card rounded-3xl p-6 border border-border shadow-soft space-y-3">
        <h3 className="text-sm font-serif font-bold text-foreground">{t('specialInstructions', 'Special Instructions for Delivery Team')}</h3>
        <textarea
          rows={4}
          value={
            birthPlan.specialNotes === 'Please explain every procedure before administering. We prefer a gentle, quiet birth atmosphere.'
              ? t('Please explain every procedure before administering. We prefer a gentle, quiet birth atmosphere.')
              : t(birthPlan.specialNotes, birthPlan.specialNotes)
          }
          onChange={e => updateBirthPlanNotes(e.target.value)}
          placeholder={t("Any personal requests, cultural ceremonies, or medical allergies...", "Any personal requests, cultural ceremonies (e.g. whispering blessings in baby's ear), or medical allergies...")}
          className="w-full p-3 bg-muted/20 border border-input rounded-2xl text-xs text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
};
