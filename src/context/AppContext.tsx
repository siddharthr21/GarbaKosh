'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserAccount,
  RegisterAccountData,
  DailyChecklistTask,
  VitalRecord,
  MealItem,
  CravingLog,
  ExerciseItem,
  MoodLog,
  MemoryVaultItem,
  ReminderItem,
  BabyNameItem,
  BabyActivityLog,
  PostpartumLog,
  BabyShowerPlan,
  HospitalChecklistItem,
  ContractionRecord,
  BirthPlanState,
  MotherPartnerRelationship,
  GranularSharingPermissions,
  AvailableMotherSummary
} from '@/types';
import { pairingService, DEFAULT_SHARING_PERMISSIONS } from '@/services/pairingService';
import { FOOD_PRESETS, NON_FOOD_PICA_SUBSTANCES } from '@/data/nutritionData';
import { EXERCISE_ROUTINES } from '@/data/exerciseData';
import { BABY_NAMES_DATABASE } from '@/data/babyNamesData';
import { getTranslation, SupportedLanguageCode } from '@/data/translations';
import { MULTILINGUAL_AI_RESPONSES, getLocalizedAiGreeting } from '@/data/multilingualAiKnowledge';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  emergencyTitle?: string;
  emergencyWarning?: string;
  emergencyAction?: string;
  suggestedFollowUps?: string[];
  language?: string;
}

interface AppContextType {
  // Authentication & Multi-Account Isolation
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  allAccounts: UserAccount[];
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  register: (data: RegisterAccountData) => { success: boolean; message?: string };
  pairPartnerWithMotherCode: (motherCode: string) => { success: boolean; message: string };
  unlinkPartner: () => { success: boolean; message: string };
  switchAccount: (userId: string) => void;
  activeRelationship: MotherPartnerRelationship | null;
  availableMothers: AvailableMotherSummary[];
  updateSharingPermissions: (perms: Partial<GranularSharingPermissions>) => void;
  isMotherSharedDashboardOpen: boolean;
  setIsMotherSharedDashboardOpen: (open: boolean) => void;

  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  activeRole: 'mother' | 'partner';
  setActiveRole: (role: 'mother' | 'partner') => void;
  
  // Dashboard & Checklist
  dailyChecklist: DailyChecklistTask[];
  toggleChecklistTask: (id: string) => void;
  addChecklistTask: (task: Omit<DailyChecklistTask, 'id' | 'completed'>) => void;
  
  // Vitals & Health
  vitals: VitalRecord[];
  addVitalRecord: (record: Omit<VitalRecord, 'id'>) => void;
  
  // Contractions / Labor Surge Timer (Garbkosh feature)
  contractions: ContractionRecord[];
  addContraction: (surge: Omit<ContractionRecord, 'id'>) => void;
  clearContractions: () => void;
  deleteContraction: (id: string) => void;
  is511RuleAlertActive: boolean;
  
  // Birth Plan (Garbkosh feature)
  birthPlan: BirthPlanState;
  updateBirthPlan: (section: keyof BirthPlanState, key: string, value: any) => void;
  updateBirthPlanNotes: (notes: string) => void;
  
  // Onboarding Wizard (Garbkosh feature)
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  
  // Design System Preview (Garbkosh feature)
  isDesignSystemOpen: boolean;
  setIsDesignSystemOpen: (open: boolean) => void;

  // Nutrition & Cravings
  meals: MealItem[];
  addMealItem: (meal: Omit<MealItem, 'id'>) => void;
  deleteMealItem: (id: string) => void;
  resetMeals: () => void;
  waterGlasses: number;
  incrementWater: () => void;
  decrementWater: () => void;
  cravings: CravingLog[];
  logCraving: (type: CravingLog['type'], description: string) => { isPicaFlagged: boolean };
  
  // Exercise
  exercises: ExerciseItem[];
  toggleExerciseComplete: (id: string) => void;
  
  // Mood & Wellness
  moodLogs: MoodLog[];
  logMood: (entry: Omit<MoodLog, 'id' | 'date'>) => void;
  
  // Memory Vault
  memories: MemoryVaultItem[];
  addMemoryItem: (item: Omit<MemoryVaultItem, 'id'>) => void;
  deleteMemoryItem: (id: string) => void;
  
  // Reminders & Calendar
  reminders: ReminderItem[];
  addReminder: (reminder: Omit<ReminderItem, 'id' | 'completed'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  
  // Baby Names
  babyNames: BabyNameItem[];
  toggleFavoriteName: (id: string) => void;
  voteName: (id: string, voter: 'mother' | 'partner', vote: number) => void;
  addCustomBabyName: (name: string, gender: 'boy' | 'girl' | 'neutral', origin: string, meaning: string) => void;
  
  // Baby Shower
  babyShower: BabyShowerPlan;
  updateBabyShowerTheme: (theme: BabyShowerPlan['theme']) => void;
  updateBabyShowerDetails: (details: Partial<BabyShowerPlan>) => void;
  toggleShowerTask: (id: string) => void;
  addShowerTask: (title: string, category: string) => void;
  addShowerGuest: (name: string) => void;
  updateGuestRsvp: (id: string, rsvp: 'attending' | 'declined' | 'pending') => void;
  
  // Hospital Bag Checklist
  hospitalChecklist: HospitalChecklistItem[];
  toggleHospitalItem: (id: string) => void;
  addHospitalItem: (category: 'mother' | 'baby' | 'partner', title: string) => void;
  
  // Postpartum & Newborn
  postpartumLogs: PostpartumLog[];
  addPostpartumLog: (log: Omit<PostpartumLog, 'id' | 'date'>) => void;
  babyActivities: BabyActivityLog[];
  addBabyActivity: (activity: Omit<BabyActivityLog, 'id' | 'date'>) => void;
  
  // Bloom AI
  chatMessages: ChatMessage[];
  sendUserMessage: (text: string, language?: string) => Promise<void>;
  clearChat: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  t: (key: string, fallback?: string) => string;
  
  // Utility
  resetToDemoData: () => void;
  exportAllDataJson: () => void;
  triggerEmergencyModal: (reason: string) => void;
  activeEmergencyModal: string | null;
  dismissEmergencyModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PROFILE: UserProfile = {
  id: 'usr_mother_siri',
  name: 'Siri Rao',
  email: 'siri@bloomnest.com',
  role: 'mother',
  age: 28,
  heightCm: 163,
  currentWeightKg: 64.5,
  prePregnancyWeightKg: 58.0,
  bloodGroup: 'O+',
  pregnancyConfirmationDate: '2026-06-15',
  lastMenstrualPeriod: '2026-05-12',
  estimatedDueDate: '2027-02-16',
  currentGestationalWeek: 24,
  gestationalDays: 2,
  conceptionMethod: 'natural',
  isFirstPregnancy: true,
  numberOfBabies: 1,
  babyNickname: 'Little Bean',
  medicalConditions: ['Mild Gestational Anemia (Hb 10.4 g/dL)'],
  allergies: ['Peanuts'],
  dietaryPreference: 'vegetarian',
  dietaryRestrictions: ['Strictly Vegetarian', 'No Artificial Sweeteners'],
  exerciseRestrictions: ['No Supine Exercises After Week 20'],
  knownComplications: ['None reported'],
  currentMedications: ['Prenatal Multivitamin with 400mcg Folic Acid', 'Ferrous Ascorbate (Iron) 100mg', 'Calcium + Vit D3 500mg'],
  doctorInfo: {
    name: 'Dr. Sunita Kulkarni, MD (OB/GYN)',
    clinic: 'Bloom Women & Fetal Care Center',
    phone: '+91 98450 12345',
    emergencyContact: '+91 80 4000 9999 (Hospital Triage)',
    adviceNotes: 'Drink 2.5L water daily, stay active with 20m walks, continue iron with citrus.'
  },
  partnerProfile: {
    name: 'Rohan Rao',
    email: 'rohan@bloomnest.com',
    relationship: 'Husband & Supportive Partner',
    phone: '+91 98450 67890',
    pairingCode: 'MAMA-2026',
    isConnected: true,
    pairedAt: '2026-06-18T10:00:00Z'
  },
  sharingPermissions: {
    ...DEFAULT_SHARING_PERMISSIONS,
    shareVitals: true,
    shareMood: true,
    shareUltrasounds: true,
    shareAppointments: true,
    shareHospitalChecklist: true,
    shareBirthPlan: true,
    viewHealthSummaries: true
  },
  isPostpartum: false,
  babyName: 'Aarav / Aadhya',
  babyGender: 'undisclosed',
  onboardingCompleted: true
};

const DEFAULT_MOTHER_ACCOUNT: UserAccount = {
  id: 'usr_mother_siri',
  name: 'Siri Rao',
  email: 'siri@bloomnest.com',
  role: 'mother',
  uniqueCode: 'MAMA-2026',
  partnerLinkedCode: 'PAPA-7140',
  isPaired: true,
  profile: INITIAL_PROFILE
};

const DEFAULT_PARTNER_ACCOUNT: UserAccount = {
  id: 'usr_partner_rohan',
  name: 'Rohan Rao',
  email: 'rohan@bloomnest.com',
  role: 'partner',
  uniqueCode: 'PAPA-7140',
  partnerLinkedCode: 'MAMA-2026',
  isPaired: true,
  profile: {
    ...INITIAL_PROFILE,
    id: 'usr_partner_rohan',
    name: 'Rohan Rao',
    email: 'rohan@bloomnest.com',
    role: 'partner'
  }
};

const DEFAULT_UNPAIRED_PARTNER_ACCOUNT: UserAccount = {
  id: 'usr_partner_arjun',
  name: 'Arjun Mehta',
  email: 'arjun@bloomnest.com',
  role: 'partner',
  uniqueCode: 'PAPA-9921',
  partnerLinkedCode: undefined,
  isPaired: false,
  profile: {
    ...INITIAL_PROFILE,
    id: 'usr_partner_arjun',
    name: 'Arjun Mehta',
    email: 'arjun@bloomnest.com',
    role: 'partner',
    currentGestationalWeek: 0,
    estimatedDueDate: 'Not Connected',
    partnerProfile: {
      name: '',
      email: '',
      relationship: 'Partner',
      phone: '',
      pairingCode: 'PAPA-9921',
      isConnected: false
    }
  }
};

const DEFAULT_UNPAIRED_MOTHER_PRIYA: UserAccount = {
  id: 'usr_mother_priya',
  name: 'Priya Nair',
  email: 'priya@bloomnest.com',
  role: 'mother',
  uniqueCode: 'MAMA-4819',
  isPaired: false,
  profile: {
    ...INITIAL_PROFILE,
    id: 'usr_mother_priya',
    name: 'Priya Nair',
    email: 'priya@bloomnest.com',
    role: 'mother',
    currentGestationalWeek: 20,
    estimatedDueDate: '2027-03-28',
    partnerProfile: {
      name: '',
      email: '',
      relationship: 'Partner',
      phone: '',
      pairingCode: 'MAMA-4819',
      isConnected: false
    }
  }
};

const DEFAULT_UNPAIRED_MOTHER_DIYA: UserAccount = {
  id: 'usr_mother_diya',
  name: 'Diya Patel',
  email: 'diya@bloomnest.com',
  role: 'mother',
  uniqueCode: 'MAMA-6314',
  isPaired: false,
  profile: {
    ...INITIAL_PROFILE,
    id: 'usr_mother_diya',
    name: 'Diya Patel',
    email: 'diya@bloomnest.com',
    role: 'mother',
    currentGestationalWeek: 16,
    estimatedDueDate: '2027-04-25',
    partnerProfile: {
      name: '',
      email: '',
      relationship: 'Partner',
      phone: '',
      pairingCode: 'MAMA-6314',
      isConnected: false
    }
  }
};

const INITIAL_ACCOUNTS: UserAccount[] = [
  DEFAULT_MOTHER_ACCOUNT,
  DEFAULT_PARTNER_ACCOUNT,
  DEFAULT_UNPAIRED_MOTHER_PRIYA,
  DEFAULT_UNPAIRED_MOTHER_DIYA,
  DEFAULT_UNPAIRED_PARTNER_ACCOUNT
];

const INITIAL_CONTRACTIONS: ContractionRecord[] = [
  { id: 'c1', startTime: '2026-11-04T18:10:00Z', endTime: '2026-11-04T18:10:45Z', durationSeconds: 45, intervalMinutes: 12, intensity: 'Mild' },
  { id: 'c2', startTime: '2026-11-04T18:22:00Z', endTime: '2026-11-04T18:22:50Z', durationSeconds: 50, intervalMinutes: 10, intensity: 'Moderate' },
  { id: 'c3', startTime: '2026-11-04T18:31:00Z', endTime: '2026-11-04T18:32:00Z', durationSeconds: 60, intervalMinutes: 9, intensity: 'Moderate' },
];

const INITIAL_BIRTH_PLAN: BirthPlanState = {
  environment: {
    dimLighting: true,
    calmMusic: true,
    aromatherapy: true,
    minimalInterruption: true,
    bringOwnPillow: true,
  },
  companions: {
    partnerPresent: true,
    doulaPresent: false,
    familyVisitorsRestricted: true,
  },
  painManagement: {
    breathingAndMovement: true,
    birthingBall: true,
    warmShowerOrTub: true,
    openToEpidural: true,
    nitrousOxideGas: false,
  },
  delivery: {
    freedomOfPosition: true,
    delayedCordClamping: true,
    partnerCutCord: true,
    immediateSkinToSkin: true,
  },
  newbornCare: {
    delayFirstBath: true,
    exclusiveBreastfeeding: true,
    roomingInAlways: true,
    vitaminKGiven: true,
  },
  specialNotes: 'Please explain every procedure before administering. We prefer a gentle, quiet birth atmosphere.'
};

const INITIAL_CHECKLIST: DailyChecklistTask[] = [
  { id: 't1', title: 'Take morning Prenatal Vitamin & Iron with orange juice', category: 'nutrition', completed: true, time: '8:30 AM' },
  { id: 't2', title: 'Hydration goal: 2.5 Liters of water / coconut water', category: 'nutrition', completed: true, time: 'Throughout day' },
  { id: 't3', title: '20-minute mindful evening walk in the park', category: 'exercise', completed: false, time: '5:30 PM' },
  { id: 't4', title: '10-minute pelvic floor Kegel contractions', category: 'exercise', completed: false, time: '7:00 PM' },
  { id: 't5', title: 'Evening baby kick count (10 kicks within 2 hours)', category: 'wellness', completed: false, time: '8:30 PM' },
  { id: 't6', title: 'Read Chapter 4 in "The Mindful Birth" guide', category: 'wellness', completed: true, time: '9:30 PM' }
];

const INITIAL_VITALS: VitalRecord[] = [
  { id: 'v1', date: '2026-10-28', bloodPressureSys: 114, bloodPressureDia: 74, weightKg: 63.8, pulseBpm: 76, kickCount: 14, notes: 'Feeling active in evening' },
  { id: 'v2', date: '2026-10-30', bloodPressureSys: 118, bloodPressureDia: 76, weightKg: 64.1, pulseBpm: 78, kickCount: 16, notes: 'Good energy today' },
  { id: 'v3', date: '2026-11-01', bloodPressureSys: 116, bloodPressureDia: 75, weightKg: 64.2, pulseBpm: 80, bloodGlucoseMgDl: 92, kickCount: 15, notes: 'Fasting glucose normal' },
  { id: 'v4', date: '2026-11-03', bloodPressureSys: 118, bloodPressureDia: 78, weightKg: 64.5, pulseBpm: 79, kickCount: 18, notes: 'Rhythmic kicks after warm dinner' }
];

const INITIAL_MEALS: MealItem[] = [
  {
    id: 'm1',
    name: 'Spiced Steel-Cut Oatmeal with Chia Seeds, Walnuts & Fresh Berries',
    calories: 320,
    proteinG: 12,
    carbsG: 48,
    fatG: 10,
    fiberG: 9,
    ironMg: 3.5,
    calciumMg: 150,
    folateMcg: 65,
    vitaminDiu: 40,
    mealType: 'breakfast',
    time: '8:30 AM'
  },
  {
    id: 'm2',
    name: 'Palak Paneer with 2 Multigrain Rotis & Beetroot Cucumber Salad',
    calories: 450,
    proteinG: 22,
    carbsG: 45,
    fatG: 18,
    fiberG: 8,
    ironMg: 4.8,
    calciumMg: 380,
    folateMcg: 140,
    vitaminDiu: 25,
    mealType: 'lunch',
    time: '1:15 PM'
  },
  {
    id: 'm3',
    name: 'Roasted Makhana (Foxnuts) & Handful of Almonds with Coconut Water',
    calories: 180,
    proteinG: 6,
    carbsG: 22,
    fatG: 8,
    fiberG: 4,
    ironMg: 1.8,
    calciumMg: 90,
    folateMcg: 30,
    vitaminDiu: 0,
    mealType: 'snack',
    time: '4:45 PM'
  }
];

const INITIAL_CRAVINGS: CravingLog[] = [
  { id: 'cr1', date: '2026-10-31', time: '3:30 PM', type: 'sour', description: 'Raw mango slices with mild chaat masala', isPicaFlagged: false },
  { id: 'cr2', date: '2026-11-02', time: '9:15 PM', type: 'sweet', description: 'Warm cardamom milk with 2 soft dates', isPicaFlagged: false }
];

const INITIAL_MEMORIES: MemoryVaultItem[] = [
  {
    id: 'mem1',
    date: '2026-07-28',
    gestationalWeek: 11,
    type: 'ultrasound',
    title: 'First Trimester NT Scan',
    caption: 'We saw tiny hands waving and heard a strong 158 bpm heartbeat!',
    notes: 'Nuchal translucency measurement: 1.4 mm (Normal range). Dr. Sunita confirmed healthy cranial and spine structure.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    doctorComments: 'Crown-rump length exactly matches 11w4d. Placenta posterior, high.'
  },
  {
    id: 'mem2',
    date: '2026-09-29',
    gestationalWeek: 20,
    type: 'ultrasound',
    title: 'Mid-Pregnancy Level II Anomaly Scan',
    caption: 'All four chambers of the heart, kidneys, ten tiny fingers, and cutest profile!',
    notes: 'Detailed anatomical scan clear. Baby yawned twice during the ultrasound!',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    doctorComments: 'Amniotic fluid index 14 cm. Cervical length 3.8 cm (Normal). Estimated fetal weight 340g.'
  },
  {
    id: 'mem3',
    date: '2026-10-18',
    gestationalWeek: 22,
    type: 'milestone',
    title: 'First Time Rohan Felt the Kicks!',
    caption: 'We were sitting on the couch listening to ocean waves and baby did three big kicks right against Rohan’s palm.',
    notes: 'A memory we will cherish forever. Rohan got so teary-eyed.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_REMINDERS: ReminderItem[] = [
  { id: 'rem1', title: 'Oral Glucose Tolerance Test (OGTT) Screening', category: 'doctor', date: '2026-11-08', time: '09:00 AM', completed: false, doctorOrLocation: 'Bloom Hospital Lab' },
  { id: 'rem2', title: 'Third Trimester Baseline Checkup with Dr. Sunita', category: 'doctor', date: '2026-11-20', time: '11:30 AM', completed: false, doctorOrLocation: 'Clinic Suite 304' },
  { id: 'rem3', title: 'Tdap (Tetanus, Diphtheria, Pertussis) Maternal Vaccination', category: 'vaccination', date: '2026-11-28', time: '10:00 AM', completed: false, doctorOrLocation: 'Immunization Clinic' },
  { id: 'rem4', title: 'Daily Iron & Vitamin D3 Reminder', category: 'medication', date: '2026-11-04', time: '08:30 PM', completed: false }
];

const INITIAL_HOSPITAL_ITEMS: HospitalChecklistItem[] = [
  { id: 'h1', category: 'mother', title: 'Original ID, insurance cards & prenatal medical record binder', packed: true },
  { id: 'h2', category: 'mother', title: '2 Front-opening soft nursing nightgowns', packed: true },
  { id: 'h3', category: 'mother', title: 'High-waist disposable postpartum cotton briefs (pack of 10)', packed: true },
  { id: 'h4', category: 'mother', title: 'Heavy flow maternity sanitary pads / witch hazel pads', packed: false },
  { id: 'h5', category: 'mother', title: 'Non-skid warm slippers & cozy socks', packed: true },
  { id: 'h6', category: 'mother', title: 'Lip balm, gentle moisturizer & hair ties', packed: true },
  { id: 'h7', category: 'mother', title: 'Loose, comfortable going-home outfit (maternity fit)', packed: false },
  { id: 'h8', category: 'baby', title: 'Installed infant car seat in vehicle (inspected)', packed: true },
  { id: 'h9', category: 'baby', title: '3 Kimono-style organic cotton newborn onesies', packed: true },
  { id: 'h10', category: 'baby', title: 'Soft swaddle blankets (muslin & thermal)', packed: true },
  { id: 'h11', category: 'baby', title: 'Newborn diapers (1 pack) & fragrance-free water wipes', packed: true },
  { id: 'h12', category: 'baby', title: 'Baby scratch mittens, knit beanie cap & booties', packed: false },
  { id: 'h13', category: 'baby', title: 'Going-home heirloom baby outfit', packed: false },
  { id: 'h14', category: 'partner', title: 'Phone chargers with extra-long 10ft cables', packed: true },
  { id: 'h15', category: 'partner', title: 'High-protein snacks, nuts, energy bars & electrolyte tablets', packed: false },
  { id: 'h16', category: 'partner', title: 'Change of comfortable clothes & light sweatshirt', packed: false },
  { id: 'h17', category: 'partner', title: 'Birth playlist downloaded offline & portable Bluetooth speaker', packed: true },
  { id: 'h18', category: 'partner', title: 'List of emergency and family announcement contacts', packed: true }
];

const INITIAL_SHOWER_PLAN: BabyShowerPlan = {
  eventDate: '2026-12-12',
  theme: 'Traditional Indian',
  venue: 'Gulmohar Garden Courtyard & Banquet',
  budgetTotal: 75000,
  budgetSpent: 32000,
  guestCount: 35,
  tasks: [
    { id: 'sh1', title: 'Finalize Seemantham / Godh Bharai floral decoration (Jasmine & Marigold garlands)', completed: true, category: 'decor' },
    { id: 'sh2', title: 'Send digital floral invitations with RSVP tracking', completed: true, category: 'invitation' },
    { id: 'sh3', title: 'Order custom cardamom saffron cake & traditional sweet laddoos', completed: false, category: 'catering' },
    { id: 'sh4', title: 'Prepare baby trivia games and guessing game printouts', completed: false, category: 'games' },
    { id: 'sh5', title: 'Assemble gift hampers for guests with scented candles & sweets', completed: false, category: 'favors' }
  ],
  guests: [
    { id: 'g1', name: 'Ananya Deshmukh', rsvp: 'attending', gift: 'Organic Cotton Swaddle Set' },
    { id: 'g2', name: 'Dr. Sunita Kulkarni', rsvp: 'attending', gift: 'Baby Milestone Keepsake Book' },
    { id: 'g3', name: 'Meera & Vikram Rao', rsvp: 'attending', gift: 'Ergonomic Baby Bouncer' },
    { id: 'g4', name: 'Kavita Sharma (Grandmother)', rsvp: 'attending', gift: 'Handcrafted Silver Anklets' }
  ],
  registryItems: [
    { id: 'rg1', name: 'Borosilicate Anti-Colic Glass Bottle Set', link: '#', claimedBy: 'Meera Rao' },
    { id: 'rg2', name: 'Greenguard Certified Breathable Crib Mattress', link: '#', claimedBy: 'Rohan’s Parents' },
    { id: 'rg3', name: 'Modular All-Terrain Infant Stroller', link: '#' }
  ]
};

const INITIAL_BABY_NAMES: BabyNameItem[] = BABY_NAMES_DATABASE.map((item, idx) => ({
  id: item.id,
  name: item.name,
  gender: item.gender,
  origin: item.origin,
  meaning: item.meaning,
  pronunciation: item.pronunciation,
  culturalContext: item.culturalContext,
  isFavorite: idx < 4,
  isShortlisted: idx < 6,
  motherVote: idx === 0 || idx === 1 ? 1 : 0,
  partnerVote: idx === 1 || idx === 2 ? 1 : 0
}));

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: "Hello Anita! 🌸 I am Bloom AI, your personal pregnancy and parenthood companion. I'm tailored to your 24th week of pregnancy (Month 6). How are you and baby feeling today? Feel free to ask about your symptoms, safe movements, nutrition, hospital bags, or talk to me in English, Hindi, Kannada, Tamil, Telugu, or Malayalam!",
    timestamp: '10:00 AM',
    suggestedFollowUps: [
      'What are common symptoms during Week 24?',
      'How to safely relieve round ligament pain?',
      'What should I prepare for the glucose screening test?'
    ]
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts Registry & Security State
  const [allAccounts, setAllAccounts] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_accounts');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('bloomnest_auth_session');
      if (session) {
        try { return JSON.parse(session); } catch (e) {}
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('bloomnest_auth_session');
      return !!session;
    }
    return false;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('bloomnest_auth_session');
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed && parsed.profile) return parsed.profile;
        } catch (e) {}
      }
      const saved = localStorage.getItem('bloomnest_profile');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_PROFILE;
  });

  // Permanent Account Role: assigned during registration, strictly immutable
  const activeRole: 'mother' | 'partner' = currentUser ? currentUser.role : 'mother';
  const setActiveRole = (role: 'mother' | 'partner') => {
    console.warn(`Role immutability policy: User account '${currentUser?.name}' is registered as '${currentUser?.role}'. Account role cannot be converted.`);
  };

  const [isMotherSharedDashboardOpen, setIsMotherSharedDashboardOpen] = useState(false);

  const availableMothers: AvailableMotherSummary[] = pairingService.getAvailableMothers(
    allAccounts,
    currentUser?.id
  );

  const activeRelationship: MotherPartnerRelationship | null = currentUser
    ? pairingService.getActiveRelationshipForUser(currentUser.id)
    : null;

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  const [contractions, setContractions] = useState<ContractionRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_contractions');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CONTRACTIONS;
  });

  const [birthPlan, setBirthPlan] = useState<BirthPlanState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_birthplan');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BIRTH_PLAN;
  });

  const [dailyChecklist, setDailyChecklist] = useState<DailyChecklistTask[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_checklist');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CHECKLIST;
  });

  const [vitals, setVitals] = useState<VitalRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_vitals');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_VITALS;
  });

  const [meals, setMeals] = useState<MealItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_meals');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MEALS;
  });

  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_water');
      if (saved) return Number(saved) || 7;
    }
    return 7;
  });

  const [cravings, setCravings] = useState<CravingLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_cravings');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CRAVINGS;
  });

  const [exercises, setExercises] = useState<ExerciseItem[]>(() => {
    return EXERCISE_ROUTINES.map(e => ({
      id: e.id,
      name: e.name,
      category: e.category,
      trimesterSuitable: e.trimesterSuitable,
      durationMinutes: e.durationMinutes,
      difficulty: e.difficulty,
      instructions: e.instructions,
      precautions: e.precautions,
      completedToday: e.id === 'ex1'
    }));
  });

  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_moods');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'm-1', date: '2026-11-01', mood: 'calm', stressLevel: 3, anxietyLevel: 2, journalNotes: 'Slept well with the pregnancy pillow. Baby was gently fluttering this morning.', symptoms: ['Mild lower back tightness'] },
      { id: 'm-2', date: '2026-11-02', mood: 'joyful', stressLevel: 2, anxietyLevel: 2, journalNotes: 'Rohan helped make dinner. We picked out baby nursery colors!', symptoms: ['Glowing skin', 'Appetite boost'] },
      { id: 'm-3', date: '2026-11-03', mood: 'anxious', stressLevel: 5, anxietyLevel: 6, journalNotes: 'A bit anxious thinking about labor stages, but listening to the ocean soundscape helped calm my mind.', symptoms: ['Heartburn', 'Braxton Hicks'] }
    ];
  });

  const [memories, setMemories] = useState<MemoryVaultItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_memories');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MEMORIES;
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_reminders');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_REMINDERS;
  });

  const [babyNames, setBabyNames] = useState<BabyNameItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_babynames');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BABY_NAMES;
  });

  const [babyShower, setBabyShower] = useState<BabyShowerPlan>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_babyshower');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SHOWER_PLAN;
  });
  const [hospitalChecklist, setHospitalChecklist] = useState<HospitalChecklistItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_hospital');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_HOSPITAL_ITEMS;
  });

  const [postpartumLogs, setPostpartumLogs] = useState<PostpartumLog[]>([
    {
      id: 'pp-1',
      date: '2026-11-03',
      deliveryDate: '2026-10-25',
      deliveryType: 'vaginal',
      painScale: 2,
      lochiaFlow: 'light',
      breastCondition: 'normal',
      sleepHours: 5.5,
      hydrationGlasses: 9,
      emotionalScore: 8,
      notes: 'Baby latched comfortably on both sides. Swelling in ankles has completely resolved.'
    }
  ]);

  const [babyActivities, setBabyActivities] = useState<BabyActivityLog[]>([
    { id: 'ba-1', date: '2026-11-03', time: '08:00 AM', type: 'breastfeeding', durationMinutes: 20, notes: 'Right breast 10m, left 10m' },
    { id: 'ba-2', date: '2026-11-03', time: '09:30 AM', type: 'sleep', durationMinutes: 90, notes: 'Restful swaddled nap in bassinet' },
    { id: 'ba-3', date: '2026-11-03', time: '11:15 AM', type: 'diaper-wet', notes: 'Clear pale urine, good hydration' }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_chat');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_language');
      if (saved) return saved;
    }
    return 'en-US';
  });

  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bloomnest_gemini_api_key') || '';
    }
    return '';
  });

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloomnest_gemini_api_key', key);
    }
  };

  const [activeEmergencyModal, setActiveEmergencyModal] = useState<string | null>(null);

  const t = (key: string, fallback?: string): string => {
    return getTranslation(selectedLanguage, key, fallback);
  };

  // Sync to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('bloomnest_language', selectedLanguage);
    localStorage.setItem('bloomnest_profile', JSON.stringify(profile));
    localStorage.setItem('bloomnest_contractions', JSON.stringify(contractions));
    localStorage.setItem('bloomnest_birthplan', JSON.stringify(birthPlan));
    localStorage.setItem('bloomnest_checklist', JSON.stringify(dailyChecklist));
    localStorage.setItem('bloomnest_vitals', JSON.stringify(vitals));
    localStorage.setItem('bloomnest_meals', JSON.stringify(meals));
    localStorage.setItem('bloomnest_water', waterGlasses.toString());
    localStorage.setItem('bloomnest_cravings', JSON.stringify(cravings));
    localStorage.setItem('bloomnest_memories', JSON.stringify(memories));
    localStorage.setItem('bloomnest_reminders', JSON.stringify(reminders));
    localStorage.setItem('bloomnest_babynames', JSON.stringify(babyNames));
    localStorage.setItem('bloomnest_hospital', JSON.stringify(hospitalChecklist));
    localStorage.setItem('bloomnest_chat', JSON.stringify(chatMessages));
  }, [selectedLanguage, profile, contractions, birthPlan, dailyChecklist, vitals, meals, waterGlasses, cravings, memories, reminders, babyNames, hospitalChecklist, chatMessages]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  // Authentication & Multi-Account Functions
  const login = (email: string, password?: string): boolean => {
    const found = allAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!found) return false;

    setCurrentUser(found);
    setIsAuthenticated(true);
    setActiveRole(found.role);
    setProfile(found.profile);

    if (typeof window !== 'undefined') {
      localStorage.setItem('bloomnest_auth_session', JSON.stringify(found));
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bloomnest_auth_session');
    }
  };

  const register = (data: RegisterAccountData): { success: boolean; message?: string } => {
    if (allAccounts.some(a => a.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }

    if (data.role === 'mother') {
      const uniqueCode = `MAMA-${Math.floor(1000 + Math.random() * 9000)}`;
      const newMotherProfile: UserProfile = {
        ...INITIAL_PROFILE,
        id: `usr_mother_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'mother',
        currentGestationalWeek: data.gestationalWeek || 24,
        dietaryPreference: data.dietaryPreference || 'vegetarian',
        partnerProfile: {
          name: '',
          email: '',
          relationship: 'Partner',
          phone: '',
          pairingCode: uniqueCode,
          isConnected: false
        },
        sharingPermissions: { ...DEFAULT_SHARING_PERMISSIONS }
      };

      const newAccount: UserAccount = {
        id: newMotherProfile.id,
        name: data.name,
        email: data.email,
        role: 'mother',
        uniqueCode,
        isPaired: false,
        profile: newMotherProfile
      };

      const updated = [...allAccounts, newAccount];
      setAllAccounts(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_accounts', JSON.stringify(updated));
        localStorage.setItem('bloomnest_auth_session', JSON.stringify(newAccount));
      }

      setCurrentUser(newAccount);
      setIsAuthenticated(true);
      setProfile(newMotherProfile);
      return { success: true };
    } else {
      // Partner account
      const uniqueCode = `PAPA-${Math.floor(1000 + Math.random() * 9000)}`;
      let isPaired = false;
      let partnerLinkedCode: string | undefined = undefined;
      let targetMother: UserAccount | undefined = undefined;

      if (data.motherPairingCode) {
        const cleanInput = data.motherPairingCode.trim().toUpperCase();
        targetMother = allAccounts.find(
          a => a.role === 'mother' && a.uniqueCode.toUpperCase() === cleanInput
        );

        if (!targetMother) {
          return {
            success: false,
            message: `Mother pairing code "${cleanInput}" not found in registered accounts.`
          };
        }

        // 1-to-1 Pairing Check: Is target mother already paired?
        if (targetMother.isPaired || pairingService.isMotherPaired(targetMother.id)) {
          return {
            success: false,
            message: `${targetMother.name} is already paired with an active partner. 1-to-1 pairing rules forbid duplicate connections.`
          };
        }

        isPaired = true;
        partnerLinkedCode = targetMother.uniqueCode;
      }

      const initialPartnerProfile: UserProfile = {
        ...(targetMother ? targetMother.profile : INITIAL_PROFILE),
        id: `usr_partner_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'partner',
        currentGestationalWeek: targetMother ? targetMother.profile.currentGestationalWeek : 0,
        estimatedDueDate: targetMother ? targetMother.profile.estimatedDueDate : 'Not Connected',
        partnerProfile: {
          name: targetMother ? targetMother.name : '',
          email: targetMother ? targetMother.email : '',
          relationship: data.relationship || 'Partner',
          phone: '',
          pairingCode: targetMother ? targetMother.uniqueCode : uniqueCode,
          isConnected: isPaired
        },
        sharingPermissions: { ...DEFAULT_SHARING_PERMISSIONS }
      };

      const newPartnerAccount: UserAccount = {
        id: initialPartnerProfile.id,
        name: data.name,
        email: data.email,
        role: 'partner',
        uniqueCode,
        partnerLinkedCode,
        isPaired,
        profile: initialPartnerProfile
      };

      let updatedAccounts = [...allAccounts, newPartnerAccount];

      if (targetMother && isPaired) {
        // Connect in pairingService
        const pairResult = pairingService.connectPartnerWithMother(newPartnerAccount, targetMother);
        if (pairResult.success && pairResult.relationship) {
          newPartnerAccount.activeRelationshipId = pairResult.relationship.id;
          const updatedMotherAccount: UserAccount = {
            ...targetMother,
            isPaired: true,
            partnerLinkedCode: newPartnerAccount.uniqueCode,
            activeRelationshipId: pairResult.relationship.id,
            profile: {
              ...targetMother.profile,
              partnerProfile: {
                name: newPartnerAccount.name,
                email: newPartnerAccount.email,
                relationship: 'Partner',
                phone: '',
                pairingCode: targetMother.uniqueCode,
                isConnected: true,
                pairedAt: pairResult.relationship.accepted_at
              }
            }
          };

          updatedAccounts = updatedAccounts.map(a =>
            a.id === updatedMotherAccount.id ? updatedMotherAccount : a
          );
        }
      }

      setAllAccounts(updatedAccounts);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_accounts', JSON.stringify(updatedAccounts));
        localStorage.setItem('bloomnest_auth_session', JSON.stringify(newPartnerAccount));
      }

      setCurrentUser(newPartnerAccount);
      setIsAuthenticated(true);
      setProfile(initialPartnerProfile);
      return { success: true };
    }
  };

  const pairPartnerWithMotherCode = (motherCodeOrId: string): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in to connect.' };
    }

    if (currentUser.role !== 'partner') {
      return {
        success: false,
        message: 'Security validation error: Only registered Partner accounts can initiate mother pairing.'
      };
    }

    if (currentUser.isPaired || pairingService.isPartnerPaired(currentUser.id)) {
      const activeRel = pairingService.getActiveRelationshipForUser(currentUser.id);
      return {
        success: false,
        message: `Your account is already paired with ${activeRel?.mother_name || 'an expecting mother'}. Under 1-to-1 relationship rules, you must disconnect first before connecting with another mother.`
      };
    }

    const cleanInput = motherCodeOrId.trim().toUpperCase();
    const targetMother = allAccounts.find(
      a => a.role === 'mother' && (a.uniqueCode.toUpperCase() === cleanInput || a.id === motherCodeOrId)
    );

    if (!targetMother) {
      return {
        success: false,
        message: `Mother with code or ID "${cleanInput}" not found in registered accounts.`
      };
    }

    // Call pairingService
    const result = pairingService.connectPartnerWithMother(currentUser, targetMother);
    if (!result.success || !result.relationship) {
      return { success: false, message: result.message };
    }

    // Update target mother in allAccounts
    const updatedMotherProfile: UserProfile = {
      ...targetMother.profile,
      partnerProfile: {
        name: currentUser.name,
        email: currentUser.email,
        relationship: 'Partner',
        phone: '',
        pairingCode: targetMother.uniqueCode,
        isConnected: true,
        pairedAt: result.relationship.accepted_at
      },
      sharingPermissions: result.relationship.permissions
    };

    const updatedMotherAccount: UserAccount = {
      ...targetMother,
      isPaired: true,
      partnerLinkedCode: currentUser.uniqueCode,
      activeRelationshipId: result.relationship.id,
      profile: updatedMotherProfile
    };

    // Update requesting partner
    const updatedPartnerProfile: UserProfile = {
      ...targetMother.profile,
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: 'partner',
      partnerProfile: {
        name: targetMother.name,
        email: targetMother.email,
        relationship: 'Expecting Mother',
        phone: '',
        pairingCode: targetMother.uniqueCode,
        isConnected: true,
        pairedAt: result.relationship.accepted_at
      },
      sharingPermissions: result.relationship.permissions
    };

    const updatedPartnerAccount: UserAccount = {
      ...currentUser,
      isPaired: true,
      partnerLinkedCode: targetMother.uniqueCode,
      activeRelationshipId: result.relationship.id,
      profile: updatedPartnerProfile
    };

    const updatedAccounts = allAccounts.map(a => {
      if (a.id === updatedMotherAccount.id) return updatedMotherAccount;
      if (a.id === updatedPartnerAccount.id) return updatedPartnerAccount;
      return a;
    });

    setAllAccounts(updatedAccounts);
    setCurrentUser(updatedPartnerAccount);
    setProfile(updatedPartnerProfile);

    if (typeof window !== 'undefined') {
      localStorage.setItem('bloomnest_accounts', JSON.stringify(updatedAccounts));
      localStorage.setItem('bloomnest_auth_session', JSON.stringify(updatedPartnerAccount));
    }

    return {
      success: true,
      message: `Successfully connected with ${targetMother.name}! Permitted caregiver synchronization is now active.`
    };
  };

  const unlinkPartner = (): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Not logged in.' };

    const activeRel = pairingService.getActiveRelationshipForUser(currentUser.id);
    if (!activeRel) {
      return { success: false, message: 'No active pairing relationship found.' };
    }

    const res = pairingService.disconnectRelationship(activeRel.id, currentUser.id);
    if (!res.success) return res;

    // Disconnect both accounts
    const motherId = activeRel.mother_user_id;
    const partnerId = activeRel.partner_user_id;

    const updatedAccounts = allAccounts.map(acc => {
      if (acc.id === motherId) {
        return {
          ...acc,
          isPaired: false,
          partnerLinkedCode: undefined,
          activeRelationshipId: undefined,
          profile: {
            ...acc.profile,
            partnerProfile: {
              name: '',
              email: '',
              relationship: 'Partner',
              phone: '',
              pairingCode: acc.uniqueCode,
              isConnected: false
            }
          }
        };
      }
      if (acc.id === partnerId) {
        return {
          ...acc,
          isPaired: false,
          partnerLinkedCode: undefined,
          activeRelationshipId: undefined,
          profile: {
            ...acc.profile,
            currentGestationalWeek: 0,
            estimatedDueDate: 'Not Connected',
            partnerProfile: {
              name: '',
              email: '',
              relationship: 'Partner',
              phone: '',
              pairingCode: acc.uniqueCode,
              isConnected: false
            }
          }
        };
      }
      return acc;
    });

    setAllAccounts(updatedAccounts);
    const updatedSelf = updatedAccounts.find(a => a.id === currentUser.id) || currentUser;
    setCurrentUser(updatedSelf);
    setProfile(updatedSelf.profile);

    if (typeof window !== 'undefined') {
      localStorage.setItem('bloomnest_accounts', JSON.stringify(updatedAccounts));
      localStorage.setItem('bloomnest_auth_session', JSON.stringify(updatedSelf));
    }

    return {
      success: true,
      message: 'Pairing successfully disconnected. Both accounts are now eligible for new pairing.'
    };
  };

  const updateSharingPermissions = (newPerms: Partial<GranularSharingPermissions>) => {
    if (!currentUser || currentUser.role !== 'mother') {
      console.warn('Unauthorized: Only an expecting mother can update sharing permissions.');
      return;
    }

    const activeRel = pairingService.getActiveRelationshipForUser(currentUser.id);
    if (activeRel) {
      pairingService.updatePermissions(activeRel.id, currentUser.id, newPerms);
    }

    const updatedPermissions = {
      ...profile.sharingPermissions,
      ...newPerms
    };

    setProfile(prev => ({
      ...prev,
      sharingPermissions: updatedPermissions
    }));

    // Update in allAccounts
    const updatedAccounts = allAccounts.map(a => {
      if (a.id === currentUser.id) {
        return {
          ...a,
          profile: {
            ...a.profile,
            sharingPermissions: updatedPermissions
          }
        };
      }
      if (activeRel && a.id === activeRel.partner_user_id) {
        return {
          ...a,
          profile: {
            ...a.profile,
            sharingPermissions: updatedPermissions
          }
        };
      }
      return a;
    });

    setAllAccounts(updatedAccounts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloomnest_accounts', JSON.stringify(updatedAccounts));
    }
  };

  const switchAccount = (userId: string) => {
    const acc = allAccounts.find(a => a.id === userId);
    if (acc) {
      setCurrentUser(acc);
      setIsAuthenticated(true);
      setProfile(acc.profile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_auth_session', JSON.stringify(acc));
      }
    }
  };

  // Contractions logic (Garbkosh feature)
  const addContraction = (surge: Omit<ContractionRecord, 'id'>) => {
    const newSurge: ContractionRecord = {
      ...surge,
      id: `surge-${Date.now()}`
    };
    setContractions(prev => [newSurge, ...prev]);

    // Check if 5-1-1 departure alert criteria is reached
    if (surge.durationSeconds >= 60 && surge.intervalMinutes && surge.intervalMinutes <= 5) {
      triggerEmergencyModal(
        '5-1-1 LABOR RULE ALERT: Contractions are arriving 5 minutes apart or closer, lasting at least 60 seconds. If this pattern has continued for 1 hour, your cervix is actively dilating. Please contact your hospital triage and head to the maternity center!'
      );
    }
  };

  const clearContractions = () => setContractions([]);
  const deleteContraction = (id: string) => setContractions(prev => prev.filter(c => c.id !== id));

  // Determine 5-1-1 rule alert status
  const recentSurges = contractions.slice(0, 3);
  const is511RuleAlertActive = recentSurges.length >= 3 &&
    recentSurges.every(s => s.durationSeconds >= 55 && (s.intervalMinutes ?? 10) <= 5.5);

  // Birth plan logic (Garbkosh feature)
  const updateBirthPlan = (section: keyof BirthPlanState, key: string, value: any) => {
    setBirthPlan(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object'
        ? { ...(prev[section] as any), [key]: value }
        : value
    }));
  };

  const updateBirthPlanNotes = (specialNotes: string) => {
    setBirthPlan(prev => ({ ...prev, specialNotes }));
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...data,
      onboardingCompleted: true
    }));
    setIsOnboardingOpen(false);
  };

  const toggleChecklistTask = (id: string) => {
    setDailyChecklist(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addChecklistTask = (task: Omit<DailyChecklistTask, 'id' | 'completed'>) => {
    const newTask: DailyChecklistTask = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false
    };
    setDailyChecklist(prev => [newTask, ...prev]);
  };

  const addVitalRecord = (record: Omit<VitalRecord, 'id'>) => {
    const newRecord: VitalRecord = {
      ...record,
      id: `vital-${Date.now()}`
    };
    setVitals(prev => [...prev, newRecord]);
    if (record.weightKg) {
      setProfile(prev => ({ ...prev, currentWeightKg: record.weightKg }));
    }
  };

  const addMealItem = (meal: Omit<MealItem, 'id'>) => {
    const newMeal: MealItem = {
      ...meal,
      id: `meal-${Date.now()}`
    };
    setMeals(prev => {
      const updated = [newMeal, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_meals', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteMealItem = (id: string) => {
    setMeals(prev => {
      const updated = prev.filter(m => m.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_meals', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetMeals = () => {
    setMeals([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloomnest_meals', JSON.stringify([]));
    }
  };

  const incrementWater = () => setWaterGlasses(prev => prev + 1);
  const decrementWater = () => setWaterGlasses(prev => Math.max(0, prev - 1));

  const logCraving = (type: CravingLog['type'], description: string) => {
    const lower = description.toLowerCase();
    const isPicaFlagged =
      type === 'non-food' ||
      NON_FOOD_PICA_SUBSTANCES.some(sub => lower.includes(sub));

    const newCraving: CravingLog = {
      id: `craving-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      description,
      isPicaFlagged
    };

    setCravings(prev => [newCraving, ...prev]);

    if (isPicaFlagged) {
      triggerEmergencyModal(
        `Non-food craving detected ("${description}"). Craving substances such as soil, chalk, clay, ice, or detergent (Pica) is frequently linked with severe iron deficiency anemia or mineral imbalances. Please contact Dr. ${profile.doctorInfo.name} for an immediate blood panel.`
      );
    }

    return { isPicaFlagged };
  };

  const toggleExerciseComplete = (id: string) => {
    setExercises(prev =>
      prev.map(ex => (ex.id === id ? { ...ex, completedToday: !ex.completedToday } : ex))
    );
  };

  const logMood = (entry: Omit<MoodLog, 'id' | 'date'>) => {
    const newEntry: MoodLog = {
      ...entry,
      id: `mood-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setMoodLogs(prev => {
      const updated = [newEntry, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_moods', JSON.stringify(updated));
      }
      return updated;
    });

    if (entry.stressLevel >= 9 || entry.anxietyLevel >= 9) {
      triggerEmergencyModal(
        'You reported very high stress/anxiety. Pregnancy hormones, physical changes, and life transitions can be overwhelming. Please remember you do not have to carry this alone. Would you like to reach out to Dr. Sunita or access our guided 4-7-8 calming breathing session?'
      );
    }
  };

  const addMemoryItem = (item: Omit<MemoryVaultItem, 'id'>) => {
    const newItem: MemoryVaultItem = {
      ...item,
      id: `mem-${Date.now()}`
    };
    setMemories(prev => [newItem, ...prev]);
  };

  const deleteMemoryItem = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const addReminder = (reminder: Omit<ReminderItem, 'id' | 'completed'>) => {
    const newRem: ReminderItem = {
      ...reminder,
      id: `rem-${Date.now()}`,
      completed: false
    };
    setReminders(prev => [...prev, newRem]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleFavoriteName = (id: string) => {
    setBabyNames(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, isFavorite: !n.isFavorite, isShortlisted: !n.isFavorite ? true : n.isShortlisted } : n));
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_babynames', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const voteName = (id: string, voter: 'mother' | 'partner', vote: number) => {
    setBabyNames(prev => {
      const updated = prev.map(n => {
        if (n.id === id) {
          return voter === 'mother'
            ? { ...n, motherVote: vote }
            : { ...n, partnerVote: vote };
        }
        return n;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_babynames', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addCustomBabyName = (name: string, gender: 'boy' | 'girl' | 'neutral', origin: string, meaning: string) => {
    const newName: BabyNameItem = {
      id: `name-${Date.now()}`,
      name,
      gender,
      origin,
      meaning,
      pronunciation: name,
      culturalContext: 'Custom family addition',
      isFavorite: true,
      isShortlisted: true,
      motherVote: 1,
      partnerVote: 0
    };
    setBabyNames(prev => {
      const updated = [newName, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_babynames', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateBabyShowerDetails = (details: Partial<BabyShowerPlan>) => {
    setBabyShower(prev => {
      const updated = { ...prev, ...details };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_babyshower', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateBabyShowerTheme = (theme: BabyShowerPlan['theme']) => {
    setBabyShower(prev => {
      const updated = { ...prev, theme };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_babyshower', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleShowerTask = (id: string) => {
    setBabyShower(prev => {
      const updated = {
        ...prev,
        tasks: prev.tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_babyshower', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addShowerTask = (title: string, category: string) => {
    setBabyShower(prev => {
      const updated = {
        ...prev,
        tasks: [...prev.tasks, { id: `task-${Date.now()}`, title, completed: false, category }]
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_babyshower', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addShowerGuest = (name: string) => {
    setBabyShower(prev => {
      const updated = {
        ...prev,
        guestCount: prev.guestCount + 1,
        guests: [...prev.guests, { id: `g-${Date.now()}`, name, rsvp: 'pending' as const }]
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_babyshower', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateGuestRsvp = (id: string, rsvp: 'attending' | 'declined' | 'pending') => {
    setBabyShower(prev => {
      const updated = {
        ...prev,
        guests: prev.guests.map(g => (g.id === id ? { ...g, rsvp } : g))
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomnest_babyshower', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleHospitalItem = (id: string) => {
    setHospitalChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, packed: !item.packed } : item))
    );
  };

  const addHospitalItem = (category: 'mother' | 'baby' | 'partner', title: string) => {
    const newItem: HospitalChecklistItem = {
      id: `hosp-${Date.now()}`,
      category,
      title,
      packed: false,
      isCustom: true
    };
    setHospitalChecklist(prev => [...prev, newItem]);
  };

  const addPostpartumLog = (log: Omit<PostpartumLog, 'id' | 'date'>) => {
    const newLog: PostpartumLog = {
      ...log,
      id: `pp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setPostpartumLogs(prev => [newLog, ...prev]);
    if (log.lochiaFlow === 'red-flag' || log.breastCondition === 'mastitis-warning') {
      triggerEmergencyModal(
        'Postpartum warning detected! Rapid onset of heavy lochia (soaking pad < 1 hour) or high fever with painful red breast streaks (mastitis) requires immediate clinical review.'
      );
    }
  };

  const addBabyActivity = (activity: Omit<BabyActivityLog, 'id' | 'date'>) => {
    const newAct: BabyActivityLog = {
      ...activity,
      id: `act-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setBabyActivities(prev => [newAct, ...prev]);
  };

  const triggerEmergencyModal = (reason: string) => {
    setActiveEmergencyModal(reason);
  };

  const dismissEmergencyModal = () => {
    setActiveEmergencyModal(null);
  };

  // Bloom AI Assistant Logic
  const sendUserMessage = async (userText: string, lang = selectedLanguage) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: lang
    };

    setChatMessages(prev => [...prev, userMsg]);

    try {
      // Call dedicated AI Chat API Route
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiApiKey ? { 'x-gemini-key': geminiApiKey } : {})
        },
        body: JSON.stringify({
          message: userText,
          apiKey: geminiApiKey,
          history: chatMessages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
          gestationalWeek: profile.currentGestationalWeek || 24,
          userRole: currentUser?.role || profile.role || 'mother',
          language: lang,
          motherName: profile.name.split(' ')[0]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEmergencyAlert: data.isEmergencyAlert || false,
          emergencyTitle: data.emergencyTitle,
          emergencyWarning: data.emergencyWarning,
          emergencyAction: data.emergencyAction,
          suggestedFollowUps: data.followUps || [],
          language: lang
        };
        setChatMessages(prev => [...prev, assistantMsg]);
        return;
      }
    } catch (apiErr) {
      console.warn('API chat fetch failed, using internal offline responder:', apiErr);
    }

    // Offline / Fallback Symptom & Knowledge Handler
    const lower = userText.toLowerCase();
    const isHeavyBleeding = ['bleed', 'blood', 'soaked pad', 'clots'].some(w => lower.includes(w));
    const isSeverePain = ['severe pain', 'excruciating', 'sharp stabbing', 'intense cramps', 'agony'].some(w => lower.includes(w));
    const isPreeclampsia = ['severe headache', 'blurred vision', 'flashing spots', 'sudden swelling face', 'high bp'].some(w => lower.includes(w));
    const isReducedMovement = ['not moving', 'reduced movement', 'no kicks', 'stopped moving'].some(w => lower.includes(w));
    const isWaterBroke = ['water broke', 'leaking fluid', 'gush of water', 'broken water'].some(w => lower.includes(w));
    const isMentalCrisis = ['harm myself', 'hurt baby', 'kill myself', 'suicide', 'end it all'].some(w => lower.includes(w));
    const isNewbornEmergency = ['newborn fever', 'baby blue', 'baby breathing fast', 'not waking'].some(w => lower.includes(w));

    let assistantMsg: ChatMessage;

    if (isHeavyBleeding || isSeverePain || isPreeclampsia || isReducedMovement || isWaterBroke || isMentalCrisis || isNewbornEmergency) {
      let title = '🚨 CRITICAL MEDICAL ALERT';
      let warning = 'The symptoms described require prompt emergency evaluation by a healthcare professional.';
      let action = 'Please call your doctor, maternity triage, or local emergency services (112 / 911 / 108) immediately.';

      if (isHeavyBleeding) {
        title = '🚨 CRITICAL: IMMEDIATE ATTENTION FOR BLEEDING';
        warning = 'Heavy vaginal bleeding, especially with clots or dizziness, is an obstetric emergency. It can signify placental complications.';
        action = `Call Dr. ${profile.doctorInfo.name} or maternity emergency triage (${profile.doctorInfo.emergencyContact}) right away. Do not insert anything vaginally.`;
      } else if (isPreeclampsia) {
        title = '⚠️ CRITICAL: POSSIBLE PREECLAMPSIA SIGNS';
        warning = 'Persistent severe headache accompanied by vision changes or sudden facial swelling can indicate dangerous blood pressure elevation.';
        action = 'Check your blood pressure immediately and proceed to emergency maternity care.';
      } else if (isReducedMovement) {
        title = '🚨 URGENT: FETAL MOVEMENT EVALUATION';
        warning = 'At 24+ weeks, significant reduction in your baby’s active kicks warrants immediate non-stress test or ultrasound monitoring.';
        action = 'Drink ice-cold water, lie on your left side for 30 minutes. If 10 kicks are not felt within 2 hours, go to maternity triage immediately.';
      } else if (isWaterBroke) {
        title = '⚠️ NOTICE: POSSIBLE PREMATURE RUPTURE OF MEMBRANES';
        warning = 'Leaking amniotic fluid before 37 weeks requires sterile clinical assessment to prevent infection.';
        action = 'Note fluid color and odor, use a clean maternity pad, and contact your delivery hospital triage immediately.';
      } else if (isMentalCrisis) {
        title = '❤️ WE ARE HERE FOR YOU - CRISIS SUPPORT';
        warning = 'Please know that you are not alone and help is immediately available. Perinatal mental distress is treatable.';
        action = 'Call/text the 988 Suicide & Crisis Lifeline or National Maternal Mental Health Hotline (1-833-852-6262), or 112 / 108.';
      }

      assistantMsg = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ MEDICAL WARNING: ${warning}\n\nACTION: ${action}\n\n*DISCLAIMER: BloomNest cannot replace direct physical clinical evaluation by Dr. ${profile.doctorInfo.name} or hospital emergency doctors.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: true,
        emergencyTitle: title,
        emergencyWarning: warning,
        emergencyAction: action,
        suggestedFollowUps: [
          `Call Dr. ${profile.doctorInfo.name} (${profile.doctorInfo.phone})`,
          `Call Hospital Emergency Triage (${profile.doctorInfo.emergencyContact})`,
          'Find nearest emergency room'
        ]
      };
    } else {
      let responseText = '';
      let followUps: string[] = [];

      const langCode = (['en-US', 'kn-IN', 'hi-IN', 'ta-IN', 'te-IN', 'ml-IN'].includes(lang) ? lang : 'en-US') as SupportedLanguageCode;
      const responsesForLang = MULTILINGUAL_AI_RESPONSES[langCode] || MULTILINGUAL_AI_RESPONSES['en-US'];

      let matchedItem = responsesForLang.find(item =>
        item.keywords.some(kw => lower.includes(kw.toLowerCase()))
      );

      if (!matchedItem && langCode !== 'en-US') {
        const enMatchedIdx = MULTILINGUAL_AI_RESPONSES['en-US'].findIndex(item =>
          item.keywords.some(kw => lower.includes(kw.toLowerCase()))
        );
        if (enMatchedIdx !== -1 && responsesForLang[enMatchedIdx]) {
          matchedItem = responsesForLang[enMatchedIdx];
        }
      }

      if (matchedItem) {
        responseText = matchedItem.response;
        followUps = matchedItem.followUps;
      } else {
        responseText =
          langCode === 'kn-IN'
            ? `ಧನ್ಯವಾದಗಳು ${profile.name.split(' ')[0]}! 🌸 ${profile.currentGestationalWeek || 24}ನೇ ವಾರದಲ್ಲಿ ನಿಮ್ಮ ಆರೋಗ್ಯ ಮತ್ತು ಮಗುವಿನ ಬೆಳವಣಿಗೆಗೆ ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ, ನೀರು ಮತ್ತು ಸಮತೋಲಿತ ಪೌಷ್ಟಿಕ ಆಹಾರ ಅತ್ಯಗತ್ಯ. ನಿರಂತರ ನೋವು ಅಥವಾ ಅಸ್ವಸ್ಥತೆ ಇದ್ದರೆ ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.`
            : langCode === 'hi-IN'
            ? `धन्यवाद ${profile.name.split(' ')[0]}! 🌸 गर्भावस्था के ${profile.currentGestationalWeek || 24}वें हफ्ते में पर्याप्त पानी, हल्का पौष्टिक आहार और बाईं करवट सोना सबसे अच्छा रहता है। किसी भी परेशानी में अपने डॉक्टर से सलाह लें।`
            : `Thank you ${profile.name.split(' ')[0]}! 🌸 At Week ${profile.currentGestationalWeek || 24}, prioritize restful sleep on your left side (SOS), adequate hydration (8–10 glasses daily), and balanced nutrient-dense meals. Always consult your obstetrician for persistent symptoms.`;
        followUps = responsesForLang.flatMap(r => r.followUps.slice(0, 1)).slice(0, 3);
      }

      assistantMsg = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: followUps,
        language: lang
      };
    }

    setChatMessages(prev => [...prev, assistantMsg]);
  };

  const clearChat = () => {
    const greetingText = getLocalizedAiGreeting(selectedLanguage, profile.name.split(' ')[0]);
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps:
          selectedLanguage === 'kn-IN'
            ? ['ಗರ್ಭಿಣಿಯರಿಗೆ ಉತ್ತಮ ಆಹಾರ ಕ್ರಮ', 'ಬೆಳಗಿನ ವಾಕರಿಕೆಗೆ ಪರಿಹಾರ', 'ಹೆರಿಗೆ ಸಿದ್ಧತೆ 5-1-1 ನಿಯಮ']
            : selectedLanguage === 'hi-IN'
            ? ['गर्भावस्था में क्या खाना चाहिए?', 'मॉर्निंग सिकनेस से कैसे बचें?', 'प्रसव के लक्षण और तैयारी']
            : [
                'What are common symptoms during Week 24?',
                'How to safely relieve round ligament pain?',
                'What should I prepare for the glucose screening test?'
              ]
      }
    ]);
  };

  const resetToDemoData = () => {
    setProfile(INITIAL_PROFILE);
    setContractions(INITIAL_CONTRACTIONS);
    setBirthPlan(INITIAL_BIRTH_PLAN);
    setDailyChecklist(INITIAL_CHECKLIST);
    setVitals(INITIAL_VITALS);
    setMeals(INITIAL_MEALS);
    setWaterGlasses(7);
    setCravings(INITIAL_CRAVINGS);
    setMemories(INITIAL_MEMORIES);
    setReminders(INITIAL_REMINDERS);
    setBabyNames(INITIAL_BABY_NAMES);
    setHospitalChecklist(INITIAL_HOSPITAL_ITEMS);
    setBabyShower(INITIAL_SHOWER_PLAN);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  };

  const exportAllDataJson = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      platform: 'BloomNest Pregnancy & Parenthood Platform (Harmonized with Garbkosh / Nurtura Architecture)',
      profile,
      contractions,
      birthPlan,
      dailyChecklist,
      vitals,
      meals,
      waterGlasses,
      cravings,
      memories,
      reminders,
      babyNames,
      hospitalChecklist,
      babyShower,
      postpartumLogs,
      babyActivities
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BloomNest_Medical_Health_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        allAccounts,
        login,
        logout,
        register,
        pairPartnerWithMotherCode,
        unlinkPartner,
        switchAccount,
        activeRelationship,
        availableMothers,
        updateSharingPermissions,
        isMotherSharedDashboardOpen,
        setIsMotherSharedDashboardOpen,
        profile,
        updateProfile,
        activeRole,
        setActiveRole,
        contractions,
        addContraction,
        clearContractions,
        deleteContraction,
        is511RuleAlertActive,
        birthPlan,
        updateBirthPlan,
        updateBirthPlanNotes,
        isOnboardingOpen,
        setIsOnboardingOpen,
        completeOnboarding,
        isDesignSystemOpen,
        setIsDesignSystemOpen,
        dailyChecklist,
        toggleChecklistTask,
        addChecklistTask,
        vitals,
        addVitalRecord,
        meals,
        addMealItem,
        deleteMealItem,
        resetMeals,
        waterGlasses,
        incrementWater,
        decrementWater,
        cravings,
        logCraving,
        exercises,
        toggleExerciseComplete,
        moodLogs,
        logMood,
        memories,
        addMemoryItem,
        deleteMemoryItem,
        reminders,
        addReminder,
        toggleReminder,
        deleteReminder,
        babyNames,
        toggleFavoriteName,
        voteName,
        addCustomBabyName,
        babyShower,
        updateBabyShowerTheme,
        updateBabyShowerDetails,
        toggleShowerTask,
        addShowerTask,
        addShowerGuest,
        updateGuestRsvp,
        hospitalChecklist,
        toggleHospitalItem,
        addHospitalItem,
        postpartumLogs,
        addPostpartumLog,
        babyActivities,
        addBabyActivity,
        chatMessages,
        sendUserMessage,
        clearChat,
        selectedLanguage,
        setSelectedLanguage,
        geminiApiKey,
        setGeminiApiKey,
        t,
        resetToDemoData,
        exportAllDataJson,
        triggerEmergencyModal,
        activeEmergencyModal,
        dismissEmergencyModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
