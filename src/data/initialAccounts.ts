import { UserAccount, UserProfile } from '@/types';
import { DEFAULT_SHARING_PERMISSIONS } from '@/services/pairingService';

export const INITIAL_PROFILE: UserProfile = {
  id: 'usr_mother_siri',
  name: 'Siri Rao',
  email: 'siri@garbhsarthi.com',
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
    clinic: 'GarbhSarthi Maternal & Fetal Care Center',
    phone: '+91 98450 12345',
    emergencyContact: '+91 80 4000 9999 (Hospital Triage)',
    adviceNotes: 'Drink 2.5L water daily, stay active with 20m walks, continue iron with citrus.'
  },
  partnerProfile: {
    name: 'Rohan Rao',
    email: 'rohan@garbhsarthi.com',
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

export const DEFAULT_MOTHER_ACCOUNT: UserAccount = {
  id: 'usr_mother_siri',
  name: 'Siri Rao',
  email: 'siri@garbhsarthi.com',
  role: 'mother',
  uniqueCode: 'MAMA-2026',
  partnerLinkedCode: 'PAPA-7140',
  isPaired: true,
  profile: INITIAL_PROFILE
};

export const DEFAULT_PARTNER_ACCOUNT: UserAccount = {
  id: 'usr_partner_rohan',
  name: 'Rohan Rao',
  email: 'rohan@garbhsarthi.com',
  role: 'partner',
  uniqueCode: 'PAPA-7140',
  partnerLinkedCode: 'MAMA-2026',
  isPaired: true,
  profile: {
    ...INITIAL_PROFILE,
    id: 'usr_partner_rohan',
    name: 'Rohan Rao',
    email: 'rohan@garbhsarthi.com',
    role: 'partner'
  }
};

export const DEFAULT_UNPAIRED_PARTNER_ACCOUNT: UserAccount = {
  id: 'usr_partner_arjun',
  name: 'Arjun Mehta',
  email: 'arjun@garbhsarthi.com',
  role: 'partner',
  uniqueCode: 'PAPA-9921',
  partnerLinkedCode: undefined,
  isPaired: false,
  profile: {
    ...INITIAL_PROFILE,
    id: 'usr_partner_arjun',
    name: 'Arjun Mehta',
    email: 'arjun@garbhsarthi.com',
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

export const DEFAULT_UNPAIRED_MOTHER_PRIYA: UserAccount = {
  id: 'usr_mother_priya',
  name: 'Priya Nair',
  email: 'priya@garbhsarthi.com',
  role: 'mother',
  uniqueCode: 'MAMA-4819',
  isPaired: false,
  profile: {
    ...INITIAL_PROFILE,
    id: 'usr_mother_priya',
    name: 'Priya Nair',
    email: 'priya@garbhsarthi.com',
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

export const DEFAULT_UNPAIRED_MOTHER_DIYA: UserAccount = {
  id: 'usr_mother_diya',
  name: 'Diya Patel',
  email: 'diya@garbhsarthi.com',
  role: 'mother',
  uniqueCode: 'MAMA-6314',
  isPaired: false,
  profile: {
    ...INITIAL_PROFILE,
    id: 'usr_mother_diya',
    name: 'Diya Patel',
    email: 'diya@garbhsarthi.com',
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

export const INITIAL_ACCOUNTS: UserAccount[] = [
  DEFAULT_MOTHER_ACCOUNT,
  DEFAULT_PARTNER_ACCOUNT,
  DEFAULT_UNPAIRED_MOTHER_PRIYA,
  DEFAULT_UNPAIRED_MOTHER_DIYA,
  DEFAULT_UNPAIRED_PARTNER_ACCOUNT
];
