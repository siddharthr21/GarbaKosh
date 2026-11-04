export interface EmergencyRedFlag {
  id: string;
  triggerPhrases: string[];
  severity: 'CRITICAL_EMERGENCY' | 'URGENT_EVALUATION';
  title: string;
  warningText: string;
  actionRequired: string;
}

export const EMERGENCY_RED_FLAGS: EmergencyRedFlag[] = [
  {
    id: 'heavy-bleeding',
    triggerPhrases: ['bleeding', 'blood', 'soaked pad', 'clots', 'spotting heavily', 'haemorrhage', 'hemorrhage'],
    severity: 'CRITICAL_EMERGENCY',
    title: '🚨 IMMEDIATE MEDICAL ATTENTION REQUIRED',
    warningText: 'Heavy or persistent vaginal bleeding (soaking through a pad in under an hour, or passing large clots) can indicate placental abruption, placenta previa, miscarriage, or postpartum hemorrhage.',
    actionRequired: 'Proceed immediately to your nearest hospital maternity triage or call emergency medical services (911 / 112 / 108). Do not insert anything vaginally.'
  },
  {
    id: 'severe-pain',
    triggerPhrases: ['severe pain', 'intense pain', 'agony', 'excruciating', 'sharp stabbing', 'severe cramps', 'constant pain in abdomen'],
    severity: 'CRITICAL_EMERGENCY',
    title: '🚨 URGENT: SEVERE ABDOMINAL OR PELVIC PAIN',
    warningText: 'Unremitting or sudden excruciating abdominal or pelvic pain requires urgent clinical evaluation to rule out ectopic pregnancy, placental abruption, or acute surgical conditions.',
    actionRequired: 'Contact your OB/GYN triage emergency line or proceed directly to an emergency department.'
  },
  {
    id: 'preeclampsia-signs',
    triggerPhrases: ['severe headache', 'blurred vision', 'flashing spots', 'sudden swelling face', 'swollen eyes', 'epigastric pain', 'rib pain right side', 'high bp'],
    severity: 'CRITICAL_EMERGENCY',
    title: '⚠️ CRITICAL: POSSIBLE PREECLAMPSIA WARNING',
    warningText: 'A sudden severe persistent headache, vision changes (flashing lights, blurriness, aura), sudden facial/hand edema, or pain under the right ribs can signify Preeclampsia (dangerously high blood pressure).',
    actionRequired: 'Check your blood pressure immediately and contact your maternity unit or doctor right away for prompt assessment.'
  },
  {
    id: 'reduced-movement',
    triggerPhrases: ['baby not moving', 'reduced movement', 'kicks stopped', 'no kicks today', 'decreased movement', 'stopped kicking', 'cannot feel baby'],
    severity: 'CRITICAL_EMERGENCY',
    title: '🚨 URGENT: DECREASED FETAL MOVEMENT',
    warningText: 'A notable reduction or cessation of your baby’s regular movements after 24 weeks requires prompt fetal monitoring via CTG (cardiotocography).',
    actionRequired: 'Drink a glass of ice-cold water, lie on your left side for 30 minutes in a quiet room. If you do not count at least 10 kicks in 2 hours, proceed to maternity triage immediately.'
  },
  {
    id: 'water-break-premature',
    triggerPhrases: ['water broke', 'leaking fluid', 'gush of liquid', 'broken water', 'trickle of water'],
    severity: 'URGENT_EVALUATION',
    title: '⚠️ AMNIOTIC FLUID LEAK / WATER BREAKING',
    warningText: 'If you experience a sudden gush or continuous trickle of clear, sweet-smelling, or greenish/brown fluid, your membranes may have ruptured.',
    actionRequired: 'Note the time, color, and odor of the fluid. Put on a clean pad and notify your delivery hospital or OB/GYN immediately. If green/brown (meconium), proceed without delay.'
  },
  {
    id: 'mental-health-crisis',
    triggerPhrases: ['harm myself', 'harm baby', 'hurt baby', 'kill myself', 'suicide', 'cannot do this anymore', 'end it all', 'hear voices'],
    severity: 'CRITICAL_EMERGENCY',
    title: '❤️ IMMEDIATE EMOTIONAL SUPPORT & CRISIS ASSISTANCE',
    warningText: 'You are not alone, and this is not your fault. Severe postpartum depression or postpartum psychosis is a treatable medical emergency.',
    actionRequired: 'Please call or text the Suicide & Crisis Lifeline (988), the National Maternal Mental Health Hotline (1-833-852-6262 in US), or your local emergency number (112 / 108 / 911). Hand the baby to a trusted partner or family member now.'
  },
  {
    id: 'newborn-fever-illness',
    triggerPhrases: ['newborn fever', 'baby temperature high', 'baby breathing fast', 'baby blue lips', 'grunting sound baby', 'baby lethargic', 'not waking to feed'],
    severity: 'CRITICAL_EMERGENCY',
    title: '🚨 NEWBORN EMERGENCY ALERT',
    warningText: 'A rectal temperature ≥ 38°C (100.4°F) in a baby under 3 months, rapid breathing (>60 breaths/min), chest retractions, blueness around lips, or extreme lethargy requires emergency pediatric care.',
    actionRequired: 'Take your baby to the nearest pediatric emergency room immediately. Do not administer fever medications to babies under 3 months without direct physician guidance.'
  }
];

export const MEDICAL_DISCLAIMER = `DISCLAIMER: Bloom AI is an educational and supportive pregnancy and parenthood companion. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your gynecologist, obstetrician, pediatrician, or qualified healthcare provider with any questions regarding medical conditions or symptoms. Never disregard or delay seeking medical advice because of information provided here. In an emergency, contact your local emergency services (911 / 112 / 108) or go to the nearest emergency facility.`;

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', native: 'English', greeting: 'Hello! I am Bloom AI, your warm pregnancy companion.' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ! ನಾನು ಬ್ಲೂಮ್ ಎಐ, ನಿಮ್ಮ ಗರ್ಭಧಾರಣೆಯ ವೈಯಕ್ತಿಕ ಸಹಾಯಕ.' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', greeting: 'नमस्ते! मैं ब्लूम एआई हूँ, आपकी गर्भावस्था और शिशु देखभाल साथी।' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', greeting: 'வணக்கம்! நான் ப்ளூம் AI, உங்கள் கர்ப்பகால மற்றும் குழந்தை பராமரிப்பு தோழி.' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', greeting: 'నమస్కారం! నేను బ్లూమ్ AI, మీ గర్భధారణ సహాయకురాలిని.' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം', greeting: 'നമസ്കാരം! ഞാൻ ബ്ലൂം AI, നിങ്ങളുടെ ഗർഭകാല സുഹൃത്ത്.' }
];

export interface SuggestedPrompt {
  category: 'Pregnancy' | 'Labour' | 'Newborn' | 'Postpartum';
  question: string;
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { category: 'Pregnancy', question: 'How can I relieve severe morning sickness and nausea?' },
  { category: 'Pregnancy', question: 'What are safe sleeping positions during the second and third trimesters?' },
  { category: 'Pregnancy', question: 'Is sharp round ligament pain normal when turning in bed?' },
  { category: 'Pregnancy', question: 'What questions should I ask my doctor during the 20-week anatomy scan?' },
  { category: 'Labour', question: 'How can I differentiate Braxton Hicks from real labor contractions?' },
  { category: 'Labour', question: 'What are the three stages of labor and what should my partner do?' },
  { category: 'Labour', question: 'What non-pharmacological pain relief techniques work in early labor?' },
  { category: 'Newborn', question: 'Why does my newborn sneeze so often? Is it a cold or normal?' },
  { category: 'Newborn', question: 'What is the safe sleep ABC rule for preventing SIDS?' },
  { category: 'Newborn', question: 'How often should a 1-week-old newborn nurse or take a bottle?' },
  { category: 'Postpartum', question: 'What does normal lochia bleeding look like in the first two weeks?' },
  { category: 'Postpartum', question: 'How do I care for my perineal tear or C-section incision safely?' },
  { category: 'Postpartum', question: 'How do I distinguish the "baby blues" from postpartum depression?' }
];
