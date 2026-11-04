'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { OnboardingModal } from '@/components/modals/OnboardingModal';
import { DesignSystemModal } from '@/components/modals/DesignSystemModal';
import { DashboardModule } from '@/components/modules/DashboardModule';
import { PregnancyJourneyModule } from '@/components/modules/PregnancyJourneyModule';
import { BloomAiModule } from '@/components/modules/BloomAiModule';
import { ContractionTimerModule } from '@/components/modules/ContractionTimerModule';
import { BirthPlanModule } from '@/components/modules/BirthPlanModule';
import { HealthTrackerModule } from '@/components/modules/HealthTrackerModule';
import { NutritionModule } from '@/components/modules/NutritionModule';
import { ExerciseModule } from '@/components/modules/ExerciseModule';
import { MoodWellnessModule } from '@/components/modules/MoodWellnessModule';
import { RelaxationSleepModule } from '@/components/modules/RelaxationSleepModule';
import { LittleMomentsModule } from '@/components/modules/LittleMomentsModule';
import { PartnerSpaceModule } from '@/components/modules/PartnerSpaceModule';
import { PostpartumModule } from '@/components/modules/PostpartumModule';
import { BabyCareModule } from '@/components/modules/BabyCareModule';
import { BabyNamesModule } from '@/components/modules/BabyNamesModule';
import { BabyShowerModule } from '@/components/modules/BabyShowerModule';
import { HospitalChecklistModule } from '@/components/modules/HospitalChecklistModule';
import { BabyShoppingModule } from '@/components/modules/BabyShoppingModule';
import { SettingsModule } from '@/components/modules/SettingsModule';

export default function Home() {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Authentication Gate: Require login before accessing the maternal sanctuary dashboard
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'journey':
        return <PregnancyJourneyModule />;
      case 'bloom-ai':
        return <BloomAiModule />;
      case 'contractions':
        return <ContractionTimerModule />;
      case 'birth-plan':
        return <BirthPlanModule />;
      case 'health-tracker':
        return <HealthTrackerModule />;
      case 'nutrition':
        return <NutritionModule />;
      case 'exercise':
        return <ExerciseModule />;
      case 'mood-wellness':
        return <MoodWellnessModule />;
      case 'relaxation':
        return <RelaxationSleepModule />;
      case 'little-moments':
        return <LittleMomentsModule />;
      case 'partner-space':
        return <PartnerSpaceModule onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'postpartum':
        return <PostpartumModule />;
      case 'baby-care':
        return <BabyCareModule />;
      case 'baby-names':
        return <BabyNamesModule />;
      case 'baby-shower':
        return <BabyShowerModule />;
      case 'hospital-checklist':
        return <HospitalChecklistModule />;
      case 'baby-shopping':
        return <BabyShoppingModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule onNavigateTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header
          onToggleMobileSidebar={() => setIsOpenMobile(true)}
          activeTab={activeTab}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveModule()}
        </main>

        {/* Floating Frosted Glass Mobile Bottom Navigation Dock */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileMenu={() => setIsOpenMobile(true)}
        />
      </div>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal />

      {/* Design System Preview Modal */}
      <DesignSystemModal />
    </div>
  );
}
