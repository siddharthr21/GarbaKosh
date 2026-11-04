export type Trimester = 1 | 2 | 3 | 4; // 4 = Postpartum

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'mother' | 'partner';
  age: number;
  heightCm: number;
  currentWeightKg: number;
  prePregnancyWeightKg: number;
  bloodGroup: string;
  pregnancyConfirmationDate: string;
  lastMenstrualPeriod: string;
  estimatedDueDate: string;
  currentGestationalWeek: number;
  gestationalDays?: number; // 0-6
  conceptionMethod?: 'natural' | 'ivf' | 'iui' | 'medicated';
  isFirstPregnancy?: boolean;
  numberOfBabies?: number; // 1 = singleton, 2 = twins
  babyNickname?: string;
  medicalConditions: string[];
  allergies: string[];
  dietaryPreference: 'vegetarian' | 'vegan' | 'non-vegetarian';
  dietaryRestrictions?: string[];
  exerciseRestrictions?: string[];
  knownComplications: string[];
  currentMedications: string[];
  doctorInfo: {
    name: string;
    clinic: string;
    phone: string;
    emergencyContact: string;
    adviceNotes?: string;
  };
  partnerProfile?: {
    name: string;
    email: string;
    relationship: string;
    phone: string;
    pairingCode: string;
    isConnected: boolean;
    pairedAt?: string;
  };
  sharingPermissions: GranularSharingPermissions;
  isPostpartum: boolean;
  babyBirthDate?: string;
  babyName?: string;
  babyGender?: 'boy' | 'girl' | 'undisclosed';
  onboardingCompleted?: boolean;
}

export interface GranularSharingPermissions {
  viewPregnancyProgress: boolean;
  viewAppointments: boolean;
  viewSharedMilestones: boolean;
  viewHealthSummaries: boolean;
  viewBirthPlan: boolean;
  viewHospitalChecklist: boolean;
  editSharedTasks: boolean;
  receiveReminders: boolean;
  viewUltrasounds: boolean; // default false
  viewAIConversations: boolean; // default false (strictly private)
  viewJournalEntries: boolean; // default false (strictly private)
  shareVitals?: boolean;
  shareMood?: boolean;
  shareUltrasounds?: boolean;
  shareAppointments?: boolean;
  shareHospitalChecklist?: boolean;
  shareBirthPlan?: boolean;
}

export type RelationshipStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'EXPIRED' | 'DISCONNECTED';

export interface MotherPartnerRelationship {
  id: string;
  mother_user_id: string;
  mother_name: string;
  mother_email: string;
  mother_code: string;
  partner_user_id: string;
  partner_name: string;
  partner_email: string;
  partner_code: string;
  pairing_code_id: string;
  status: RelationshipStatus;
  requested_at: string;
  accepted_at?: string;
  disconnected_at?: string;
  created_at: string;
  updated_at: string;
  permissions: GranularSharingPermissions;
}

export interface AvailableMotherSummary {
  id: string;
  name: string;
  email: string;
  code: string;
  gestationalWeek: number;
  estimatedDueDate: string;
  isAvailable: boolean;
  pairedPartnerName?: string;
  pendingPartnerName?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'mother' | 'partner';
  uniqueCode: string; // e.g. MAMA-2026 for mother, PAPA-7140 for partner
  partnerLinkedCode?: string; // the mother code a partner is paired with
  isPaired: boolean;
  activeRelationshipId?: string;
  profile: UserProfile;
}

export interface RegisterAccountData {
  name: string;
  email: string;
  role: 'mother' | 'partner';
  password?: string;
  motherPairingCode?: string; // if partner is pairing with a mother
  relationship?: string; // if partner
  gestationalWeek?: number; // if mother
  dietaryPreference?: 'vegetarian' | 'vegan' | 'non-vegetarian';
}

export interface ContractionRecord {
  id: string;
  startTime: string; // ISO
  endTime?: string;  // ISO
  durationSeconds: number;
  intervalMinutes?: number; // Minutes since start of prior surge
  intensity: 'Mild' | 'Moderate' | 'Intense';
}

export interface BirthPlanState {
  environment: {
    dimLighting: boolean;
    calmMusic: boolean;
    aromatherapy: boolean;
    minimalInterruption: boolean;
    bringOwnPillow: boolean;
  };
  companions: {
    partnerPresent: boolean;
    doulaPresent: boolean;
    familyVisitorsRestricted: boolean;
  };
  painManagement: {
    breathingAndMovement: boolean;
    birthingBall: boolean;
    warmShowerOrTub: boolean;
    openToEpidural: boolean;
    nitrousOxideGas: boolean;
  };
  delivery: {
    freedomOfPosition: boolean;
    delayedCordClamping: boolean;
    partnerCutCord: boolean;
    immediateSkinToSkin: boolean;
  };
  newbornCare: {
    delayFirstBath: boolean;
    exclusiveBreastfeeding: boolean;
    roomingInAlways: boolean;
    vitaminKGiven: boolean;
  };
  specialNotes: string;
}

export interface DailyChecklistTask {
  id: string;
  title: string;
  category: 'nutrition' | 'exercise' | 'wellness' | 'medical';
  completed: boolean;
  time?: string;
}

export interface VitalRecord {
  id: string;
  date: string;
  bloodPressureSys: number;
  bloodPressureDia: number;
  weightKg: number;
  pulseBpm: number;
  bloodGlucoseMgDl?: number;
  kickCount?: number;
  notes?: string;
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  ironMg: number;
  calciumMg: number;
  folateMcg: number;
  vitaminDiu: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  imageUrl?: string;
}

export interface CravingLog {
  id: string;
  date: string;
  time: string;
  type: 'sweet' | 'spicy' | 'salty' | 'sour' | 'unusual' | 'non-food';
  description: string;
  isPicaFlagged: boolean;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'yoga' | 'walking' | 'breathing' | 'pelvic-floor' | 'stretching';
  trimesterSuitable: number[];
  durationMinutes: number;
  difficulty: 'Gentle' | 'Moderate' | 'Restorative';
  instructions: string[];
  precautions: string[];
  completedToday: boolean;
  videoUrl?: string;
}

export interface MoodLog {
  id: string;
  date: string;
  mood: 'joyful' | 'calm' | 'anxious' | 'exhausted' | 'tearful' | 'nauseated';
  stressLevel: number;
  anxietyLevel: number;
  journalNotes: string;
  symptoms: string[];
}

export interface MemoryVaultItem {
  id: string;
  date: string;
  gestationalWeek: number;
  type: 'ultrasound' | 'belly-bump' | 'lab-report' | 'milestone' | 'document';
  title: string;
  caption: string;
  notes: string;
  imageUrl: string;
  doctorComments?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  category: 'doctor' | 'scan' | 'medication' | 'hydration' | 'exercise' | 'nutrition' | 'vaccination' | 'hospital';
  date: string;
  time: string;
  completed: boolean;
  doctorOrLocation?: string;
  notes?: string;
}

export interface BabyNameItem {
  id: string;
  name: string;
  gender: 'boy' | 'girl' | 'neutral';
  origin: string;
  meaning: string;
  pronunciation: string;
  culturalContext: string;
  isFavorite: boolean;
  isShortlisted: boolean;
  motherVote: number;
  partnerVote: number;
}

export interface BabyActivityLog {
  id: string;
  date: string;
  time: string;
  type: 'breastfeeding' | 'bottle' | 'sleep' | 'diaper-wet' | 'diaper-dirty' | 'tummy-time';
  durationMinutes?: number;
  amountMl?: number;
  notes?: string;
}

export interface PostpartumLog {
  id: string;
  date: string;
  deliveryDate?: string;
  deliveryType?: 'vaginal' | 'c-section' | 'assisted';
  painScale: number;
  lochiaFlow: 'none' | 'light' | 'moderate' | 'heavy' | 'red-flag';
  breastCondition: 'normal' | 'engorged' | 'sore' | 'mastitis-warning';
  sleepHours: number;
  hydrationGlasses: number;
  emotionalScore: number;
  notes: string;
}

export interface BabyShowerPlan {
  eventDate: string;
  theme: 'Floral' | 'Minimalist' | 'Pastel' | 'Traditional Indian' | 'Nature-inspired';
  venue: string;
  budgetTotal: number;
  budgetSpent: number;
  guestCount: number;
  tasks: { id: string; title: string; completed: boolean; category: string }[];
  guests: { id: string; name: string; rsvp: 'attending' | 'declined' | 'pending'; gift?: string }[];
  registryItems: { id: string; name: string; link: string; claimedBy?: string }[];
}

export interface HospitalChecklistItem {
  id: string;
  category: 'mother' | 'baby' | 'partner';
  title: string;
  packed: boolean;
  isCustom?: boolean;
}
