export interface ExerciseRoutine {
  id: string;
  name: string;
  category: 'yoga' | 'walking' | 'breathing' | 'pelvic-floor' | 'stretching';
  trimesterSuitable: number[];
  durationMinutes: number;
  difficulty: 'Gentle' | 'Moderate' | 'Restorative';
  description: string;
  instructions: string[];
  precautions: string[];
  contraindications: string[];
  animationType: 'breathe' | 'kegel' | 'cat-cow' | 'walk' | 'squat';
}

export const EXERCISE_ROUTINES: ExerciseRoutine[] = [
  {
    id: 'ex1',
    name: 'Pelvic Floor Master: Kegel Contractions & Release',
    category: 'pelvic-floor',
    trimesterSuitable: [1, 2, 3, 4],
    durationMinutes: 8,
    difficulty: 'Gentle',
    description: 'Strengthens the pubococcygeus hammock supporting your uterus, bladder, and bowel to prepare for birth and prevent postpartum incontinence.',
    instructions: [
      'Sit comfortably on a chair or lie on your left side with knees bent.',
      'Exhale gently and squeeze the muscles you use to stop urine flow midstream.',
      'Lift the pelvic muscles upward and inward without clenching your buttocks or thighs.',
      'Hold the contraction for 4 to 5 seconds while breathing smoothly.',
      'Completely relax the pelvic floor for 5 to 6 seconds before repeating. Do 10 repetitions.'
    ],
    precautions: [
      'Never hold your breath while contracting.',
      'The relaxation phase is just as important as the contraction to avoid pelvic hypertension.'
    ],
    contraindications: ['Hypertonic pelvic floor or acute pelvic floor pain without physical therapy guidance.'],
    animationType: 'kegel'
  },
  {
    id: 'ex2',
    name: 'Prenatal Cat-Cow Spine Decompression',
    category: 'yoga',
    trimesterSuitable: [1, 2, 3],
    durationMinutes: 10,
    difficulty: 'Gentle',
    description: 'Relieves lower back ache, improves spinal flexibility, and encourages baby into an optimal anterior birth position.',
    instructions: [
      'Come onto hands and knees in a tabletop position with wrists under shoulders and knees under hips.',
      'Keep your belly softly supported by your abdominal wall.',
      'Inhale: Gently soften the belly toward the floor, lift your chest, and look forward (Cow Pose).',
      'Exhale: Press the floor away, round your upper back, and release your neck (Cat Pose).',
      'Move fluidly with your breath for 8 to 10 cycles.'
    ],
    precautions: [
      'Do not let your lower back over-arch or sag excessively.',
      'Use a soft folded blanket under sensitive knees.'
    ],
    contraindications: ['Wrist carpel tunnel syndrome (modify onto forearms or yoga blocks).'],
    animationType: 'cat-cow'
  },
  {
    id: 'ex3',
    name: 'Mindful 20-Minute Prenatal Brisk Walk',
    category: 'walking',
    trimesterSuitable: [1, 2, 3],
    durationMinutes: 20,
    difficulty: 'Moderate',
    description: 'Maintains cardiovascular fitness, regulates gestational blood sugar, and boosts natural mood-enhancing endorphins.',
    instructions: [
      'Put on supportive athletic shoes with cushioned arches.',
      'Begin with a 3-minute gentle warm-up walk at conversational pace.',
      'Maintain an upright posture, shoulders rolling back, arms swinging naturally.',
      'Perform the "talk test": you should be able to speak a full sentence without panting.',
      'Finish with a 2-minute cool down stroll and gentle calf stretch.'
    ],
    precautions: [
      'Stay hydrated; take small sips of water every 8-10 minutes.',
      'Avoid walking outdoors in intense midday heat or on slippery uneven trails.'
    ],
    contraindications: ['Incompetent cervix, cerclage in place, persistent vaginal bleeding, severe preeclampsia.'],
    animationType: 'walk'
  },
  {
    id: 'ex4',
    name: 'Supported Birth Squats & Hip Openers',
    category: 'stretching',
    trimesterSuitable: [2, 3],
    durationMinutes: 12,
    difficulty: 'Moderate',
    description: 'Expands the pelvic outlet by up to 30%, stretches the perineum, and utilizes gravity to guide the baby down.',
    instructions: [
      'Stand facing a sturdy chair, wall, or holding hands with your partner.',
      'Position feet slightly wider than shoulder-width apart, toes turned outward 45 degrees.',
      'Inhale: Keeping chest tall, bend your knees and lower into a deep squat, resting buttocks on a low stool or yoga block if needed.',
      'Bring hands to prayer position, using elbows to gently nudge knees wide.',
      'Take 5 slow breaths into your pelvic bowl, then press through heels to rise up.'
    ],
    precautions: [
      'Always have a support surface or partner nearby.',
      'Stop if you experience sharp knee or pubic symphysis pain.'
    ],
    contraindications: ['Placenta previa after 20 weeks, breech baby past 36 weeks (avoid squats until baby turns).'],
    animationType: 'squat'
  },
  {
    id: 'ex5',
    name: 'Coherent 4-7-8 Labor Preparation Breathing',
    category: 'breathing',
    trimesterSuitable: [1, 2, 3, 4],
    durationMinutes: 10,
    difficulty: 'Restorative',
    description: 'Activates the parasympathetic nervous system (vagus nerve), lowers cortisol, and primes maternal breathing instincts for labor contractions.',
    instructions: [
      'Sit comfortably supported with pillows or lie on your left side.',
      'Place one hand on your heart and one hand over your baby bump.',
      'Inhale quietly through your nose for a count of 4.',
      'Hold your breath gently and softly for a count of 7 (or comfortable 4 if breathless).',
      'Exhale completely through parted lips with a soft "whoosh" sound for a count of 8.',
      'Repeat for 6 relaxing cycles.'
    ],
    precautions: ['If holding breath causes any dizziness, transition to equal 4-second in, 4-second out box breathing.'],
    contraindications: ['None; safe for all trimesters.'],
    animationType: 'breathe'
  }
];

export const CONTRAINDICATIONS_WARNING = `NEVER EXERCISE IF YOU EXPERIENCE: Vaginal bleeding or fluid leakage, regular painful uterine contractions, dizziness, headache, chest pain, muscle weakness affecting balance, calf pain or swelling, or if your doctor has diagnosed placenta previa or cervical insufficiency.`;
