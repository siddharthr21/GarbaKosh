export interface WeekData {
  week: number;
  month: number;
  trimester: 1 | 2 | 3;
  babySizeFruit: string;
  fruitEmoji: string;
  babyLengthCm: number;
  babyWeightG: number;
  headline: string;
  babyDevelopment: string;
  motherChanges: string;
  symptoms: string[];
  safeExerciseTip: string;
  nutritionTip: string;
  weeklyAdvice: string;
}

export interface MonthData {
  month: number;
  weeks: string;
  trimester: 1 | 2 | 3;
  themeTitle: string;
  fruitComparison: string;
  babyDevelopment: string[];
  milestones: string[];
  motherPhysicalChanges: string[];
  commonSymptoms: string[];
  emotionalAndHormonal: string[];
  recommendedNutrition: string[];
  safeActivityAndExercise: string[];
  medicalAppointmentsAndScans: string[];
  importantPrecautions: string[];
  faqs: { question: string; answer: string }[];
  weeklyTips: string[];
}

export const WEEKS_DATA: WeekData[] = [
  {
    week: 1,
    month: 1,
    trimester: 1,
    babySizeFruit: "Single Cell (Fertilization)",
    fruitEmoji: "✨",
    babyLengthCm: 0.01,
    babyWeightG: 0.001,
    headline: "Follicular Phase & Cycle Preparation",
    babyDevelopment: "Your body prepares for ovulation. A mature oocyte develops within the ovarian follicle.",
    motherChanges: "Uterine lining begins thickening in response to estrogen.",
    symptoms: ["Normal Cycle Symptoms", "Mild Bloating", "Mild Energy Shifts"],
    safeExerciseTip: "Maintain your standard aerobic walking or regular yoga routine.",
    nutritionTip: "Begin taking 400-600mcg of folic acid daily before conception.",
    weeklyAdvice: "Track your basal body temperature and cervical mucus to identify peak fertile window."
  },
  {
    week: 2,
    month: 1,
    trimester: 1,
    babySizeFruit: "Ovulated Ovum",
    fruitEmoji: "💫",
    babyLengthCm: 0.015,
    babyWeightG: 0.001,
    headline: "Ovulation & The Genetic Spark",
    babyDevelopment: "Ovulation occurs. A single sperm fertilizes the egg in the ampulla of the fallopian tube.",
    motherChanges: "Luteinizing Hormone (LH) surges; cervical fluid becomes clear and stretchy (egg-white texture).",
    symptoms: ["Mittelschmerz (Ovulatory Pain)", "Heightened Libido", "Mild Breast Sensitivity"],
    safeExerciseTip: "Moderate walking, gentle stretching, low stress.",
    nutritionTip: "Consume zinc- and antioxidant-rich foods like pumpkin seeds and berries.",
    weeklyAdvice: "Fertilization creates a unique 46-chromosome diploid genome determining biological traits."
  },
  {
    week: 3,
    month: 1,
    trimester: 1,
    babySizeFruit: "Blastocyst",
    fruitEmoji: "🔬",
    babyLengthCm: 0.05,
    babyWeightG: 0.005,
    headline: "Rapid Cleavage & Downward Journey",
    babyDevelopment: "The zygote undergoes exponential cell division, becoming a 16-cell morula, then a hollow blastocyst.",
    motherChanges: "Progesterone from the corpus luteum prevents the uterine lining from shedding.",
    symptoms: ["Heightened Sense of Smell", "Mild Fatigue", "Subtle Pelvic Twinges"],
    safeExerciseTip: "Gentle restorative stretching and evening strolls.",
    nutritionTip: "Hydrate well and include healthy fats like walnuts and avocados.",
    weeklyAdvice: "The inner cell mass will form the embryo, while the outer trophoblast will form the placenta."
  },
  {
    week: 4,
    month: 1,
    trimester: 1,
    babySizeFruit: "Poppy Seed",
    fruitEmoji: "🌱",
    babyLengthCm: 0.1,
    babyWeightG: 0.01,
    headline: "Implantation & The Neural Tube Begins",
    babyDevelopment: "Blastocyst implants into the uterine lining. The amniotic sac and primitive placenta form.",
    motherChanges: "Implantation spotting may occur. Breasts become tender as hCG levels surge.",
    symptoms: ["Fatigue", "Tender Breasts", "Mild Cramping", "Heightened Smell"],
    safeExerciseTip: "Keep to gentle walking and restorative yoga.",
    nutritionTip: "Prioritize 400-800mcg of folic acid daily to prevent neural tube defects.",
    weeklyAdvice: "Confirm your pregnancy with a blood test or second home kit and schedule your first prenatal appointment."
  },
  {
    week: 5,
    month: 2,
    trimester: 1,
    babySizeFruit: "Apple Seed",
    fruitEmoji: "🍎",
    babyLengthCm: 0.2,
    babyWeightG: 0.05,
    headline: "Neural Tube & Heart Tube Formation",
    babyDevelopment: "The embryo forms three germ layers (ectoderm, mesoderm, endoderm). Primitive heart tubes begin pulsating.",
    motherChanges: "High progesterone slows gut motility, causing mild early bloating.",
    symptoms: ["Morning Nausea", "Frequent Urination", "Tender Breasts", "Food Aversions"],
    safeExerciseTip: "Gentle 15-20 min walks; stay cool and well hydrated.",
    nutritionTip: "Eat small, frequent meals with complex carbs (crackers, oats) to calm nausea.",
    weeklyAdvice: "Avoid all unpasteurized dairy, raw meats, and high-mercury predatory fish."
  },
  {
    week: 6,
    month: 2,
    trimester: 1,
    babySizeFruit: "Sweet Pea",
    fruitEmoji: "🫛",
    babyLengthCm: 0.6,
    babyWeightG: 0.15,
    headline: "Rhythmic Heartbeat & Facial Features",
    babyDevelopment: "The heart beats at approximately 105-120 bpm. Optic vesicles and ear depressions emerge.",
    motherChanges: "Blood volume begins expanding; kidneys work harder filtering maternal and embryonic waste.",
    symptoms: ["Morning Sickness", "Dizziness on Standing", "Mood Fluctuations", "Salivation (Ptyalism)"],
    safeExerciseTip: "Slow mindful walking; avoid sudden postural changes.",
    nutritionTip: "Sip ginger root tea or citrus-infused water for natural anti-nausea relief.",
    weeklyAdvice: "Early transvaginal ultrasound can often detect the cardiac flutter this week."
  },
  {
    week: 7,
    month: 2,
    trimester: 1,
    babySizeFruit: "Blueberry",
    fruitEmoji: "🫐",
    babyLengthCm: 1.3,
    babyWeightG: 0.5,
    headline: "Rapid Brain Hemisphere & Limb Bud Growth",
    babyDevelopment: "Brain neurogenesis proceeds at 100,000 cells per minute. Paddle-shaped hand and foot buds appear.",
    motherChanges: "Cervix forms a thick protective mucus plug to seal the uterine cavity against bacteria.",
    symptoms: ["Intense Food Aversions", "Exhaustion", "Heightened Olfaction", "Heartburn"],
    safeExerciseTip: "Prenatal restorative yoga and diaphragmatic breathing.",
    nutritionTip: "Prioritize Vitamin B6 (pyridoxine) from bananas, chickpeas, and oats to combat nausea.",
    weeklyAdvice: "Keep bland whole-grain crackers by your bedside to eat before getting up."
  },
  {
    week: 8,
    month: 2,
    trimester: 1,
    babySizeFruit: "Raspberry",
    fruitEmoji: "🍇",
    babyLengthCm: 1.6,
    babyWeightG: 1.0,
    headline: "Webbed Digits & Spontaneous Twitches",
    babyDevelopment: "Webbed fingers and toes develop. The heart beats at 150-170 bpm. Cartilaginous skeleton forms.",
    motherChanges: "Uterus has enlarged to the size of a grapefruit. Plasma volume continues upward trajectory.",
    symptoms: ["Morning Sickness Peak", "Constipation", "Sciatic Twinges", "Sleep Disruptions"],
    safeExerciseTip: "Supported pelvic tilts and slow evening walks.",
    nutritionTip: "Boost dietary fiber with prunes, chia seeds, and soaked lentils to prevent constipation.",
    weeklyAdvice: "Schedule your first formal prenatal obstetric examination, blood tests, and pap/culture panel."
  },
  {
    week: 9,
    month: 3,
    trimester: 1,
    babySizeFruit: "Green Olive",
    fruitEmoji: "🫒",
    babyLengthCm: 2.3,
    babyWeightG: 2.0,
    headline: "Embryo Becomes a Fetus",
    babyDevelopment: "The embryonic tail completely disappears. Essential organs are mapped and functioning.",
    motherChanges: "Veins across breasts and abdomen become noticeably more prominent as circulation expands.",
    symptoms: ["Bloating", "Headaches", "Occasional Nasal Congestion", "Fatigue"],
    safeExerciseTip: "Gentle low-impact swimming or water aerobics.",
    nutritionTip: "Include magnesium-rich pumpkin seeds and almonds to ease muscle tension and headaches.",
    weeklyAdvice: "All major internal organ systems are now formed; the focus shifts to cellular maturation."
  },
  {
    week: 10,
    month: 3,
    trimester: 1,
    babySizeFruit: "Prune",
    fruitEmoji: "🍑",
    babyLengthCm: 3.1,
    babyWeightG: 4.0,
    headline: "Fingernails & Swallowing Amniotic Fluid",
    babyDevelopment: "Tiny fingernails and hair follicles form. Baby begins swallowing tiny sips of amniotic fluid.",
    motherChanges: "Round ligaments begin stretching as the uterus expands, causing occasional sharp groin twinges.",
    symptoms: ["Round Ligament Pangs", "Visible Veins", "Decreased Gastrointestinal Motility"],
    safeExerciseTip: "Cat-cow stretches on hands and knees relieve ligament tension.",
    nutritionTip: "Ensure sufficient calcium (1,000mg/day) from ragi, sesame, paneer, or fortified dairy.",
    weeklyAdvice: "Non-Invasive Prenatal Testing (NIPT) cell-free DNA blood screening can be conducted from this week."
  },
  {
    week: 11,
    month: 3,
    trimester: 1,
    babySizeFruit: "Lime",
    fruitEmoji: "🍈",
    babyLengthCm: 4.1,
    babyWeightG: 7.0,
    headline: "Breathing Movements & Diaphragm Practice",
    babyDevelopment: "The diaphragm develops, and the fetus practices breathing movements. Intestines retract into the abdomen.",
    motherChanges: "Nausea may begin to subside for many mothers. Nails and hair may grow faster.",
    symptoms: ["Reduced Nausea", "Occasional Lightheadedness", "Skin Changes", "Increased Vaginal Discharge (Leukorrhea)"],
    safeExerciseTip: "Pelvic floor Kegel exercises and brisk 20-min walks.",
    nutritionTip: "Stay hydrated with electrolyte-rich coconut water to maintain optimal amniotic fluid levels.",
    weeklyAdvice: "Leukorrhea is normal; wear breathable cotton underwear and avoid douching."
  },
  {
    week: 12,
    month: 3,
    trimester: 1,
    babySizeFruit: "Plum",
    fruitEmoji: "🍑",
    babyLengthCm: 5.4,
    babyWeightG: 14.0,
    headline: "Reflexes & End of First Trimester",
    babyDevelopment: "Fingers can curl and toes can flare. Kidneys excrete urine into the amniotic sac.",
    motherChanges: "The uterus rises above the pelvic rim, easing acute bladder pressure.",
    symptoms: ["Energy Returning", "Pregnancy Glow", "Occasional Heartburn"],
    safeExerciseTip: "Prenatal Pilates and gentle core stability.",
    nutritionTip: "Focus on dietary iron (spinach, lentils) coupled with Vitamin C (lemon, guava) to support blood volume.",
    weeklyAdvice: "The Nuchal Translucency (NT) ultrasound screening scan is commonly performed between weeks 11-13."
  },
  {
    week: 13,
    month: 3,
    trimester: 1,
    babySizeFruit: "Lemon",
    fruitEmoji: "🍋",
    babyLengthCm: 7.4,
    babyWeightG: 23.0,
    headline: "Unique Fingerprints & Vocal Chords",
    babyDevelopment: "Unique friction ridge fingerprints are permanently established on baby's fingertips. Vocal chords develop.",
    motherChanges: "Placenta has fully assumed progesterone and estrogen production. Miscarriage risk drops dramatically.",
    symptoms: ["Mild Pelvic Heaviness", "Increased Appetite", "Less Fatigue"],
    safeExerciseTip: "Moderate brisk walking and prenatal resistance band workouts.",
    nutritionTip: "Incorporate choline-rich eggs, edamame, and broccoli for continuous brain architecture development.",
    weeklyAdvice: "Congratulations on entering the second trimester milestone!"
  },
  {
    week: 14,
    month: 4,
    trimester: 2,
    babySizeFruit: "Navel Orange",
    fruitEmoji: "🍊",
    babyLengthCm: 8.7,
    babyWeightG: 43.0,
    headline: "The Golden Trimester Begins",
    babyDevelopment: "Baby can squint, frown, and grimace. Fine downy lanugo hair blankets baby's skin for warmth.",
    motherChanges: "Energy surges. Second trimester vitality allows improved stamina and mood.",
    symptoms: ["Round Ligament Pulling", "Increased Libido", "Mild Nasal Congestion (Pregnancy Rhinitis)"],
    safeExerciseTip: "Low-impact aerobics, swimming, and stationary cycling.",
    nutritionTip: "Add +340 kcal/day of wholesome foods (e.g., Greek yogurt with nuts, whole wheat chapati with paneer).",
    weeklyAdvice: "Invest in supportive maternity bras as breast tissue undergoes glandular expansion."
  },
  {
    week: 15,
    month: 4,
    trimester: 2,
    babySizeFruit: "Apple",
    fruitEmoji: "🍏",
    babyLengthCm: 10.1,
    babyWeightG: 70.0,
    headline: "Light Perception & Bone Calcification",
    babyDevelopment: "Bones continue ossifying. Baby can perceive light penetrating through the maternal abdominal wall.",
    motherChanges: "Melanocyte-Stimulating Hormone may cause the Linea Nigra (dark vertical midline abdominal line).",
    symptoms: ["Linea Nigra", "Sensitive Gums (Pregnancy Gingivitis)", "Occasional Forgetfulness"],
    safeExerciseTip: "Side-lying leg raises and gentle posture alignment.",
    nutritionTip: "Maintain high Vitamin C intake to support collagen synthesis in expanding maternal blood vessels.",
    weeklyAdvice: "Schedule a routine dental hygiene checkup; pregnancy gingivitis is common and treatable."
  },
  {
    week: 16,
    month: 4,
    trimester: 2,
    babySizeFruit: "Avocado",
    fruitEmoji: "🥑",
    babyLengthCm: 11.6,
    babyWeightG: 100.0,
    headline: "Hearing Voices & Coordinated Movements",
    babyDevelopment: "The tiny inner ear bones are hardened; baby can hear the muffled melody of your voice and heartbeat.",
    motherChanges: "A visible baby bump emerges as the fundal height reaches halfway between pubic bone and umbilicus.",
    symptoms: ["Bump Prominence", "Vivid Dreams", "Dry Eyes", "Increased Appetite"],
    safeExerciseTip: "Prenatal yoga, focusing on hip openers and gentle thoracic twists.",
    nutritionTip: "Wild salmon or chia seed pudding provides marine or plant Omega-3 DHA for retinal rod development.",
    weeklyAdvice: "Talk, read, or hum soothing songs to your baby; auditory familiarization begins now."
  },
  {
    week: 17,
    month: 4,
    trimester: 2,
    babySizeFruit: "Pomegranate",
    fruitEmoji: "🍎",
    babyLengthCm: 13.0,
    babyWeightG: 140.0,
    headline: "Adipose Layer & Umbilical Cord Thickens",
    babyDevelopment: "Brown adipose tissue (fat) accumulates to maintain neonatal body temperature after delivery.",
    motherChanges: "Center of gravity begins to shift forward, increasing lumbar lordosis.",
    symptoms: ["Backaches", "Sciatic Nerve Sensation", "Increased Perspiration", "Carpal Tunnel Tingling"],
    safeExerciseTip: "Pelvic tilts on a stability ball and hamstring stretches.",
    nutritionTip: "Stay well-hydrated to facilitate the expanding 500ml volume of amniotic fluid.",
    weeklyAdvice: "Switch from sleeping flat on your back to your left side with a supportive knee pillow."
  },
  {
    week: 18,
    month: 5,
    trimester: 2,
    babySizeFruit: "Bell Pepper",
    fruitEmoji: "🫑",
    babyLengthCm: 14.2,
    babyWeightG: 190.0,
    headline: "Myelin Sheath & First Flutters (Quickening)",
    babyDevelopment: "Myelin insulates peripheral nerve pathways. Baby practices yawning, hiccuping, and sucking.",
    motherChanges: "Many mothers feel 'quickening'—delicate fluttery sensations like butterfly wings or popping bubbles.",
    symptoms: ["First Kicks / Flutters", "Hypotension (Low BP when lying down)", "Varicose Vein Tendency"],
    safeExerciseTip: "Brisk walking in supportive shoes; wear compression stockings if legs feel heavy.",
    nutritionTip: "Eat potassium-rich foods (sweet potatoes, bananas, tender coconut water) to regulate blood pressure.",
    weeklyAdvice: "The comprehensive Mid-Pregnancy Anomaly Scan (Level II Ultrasound) is scheduled around weeks 18-22."
  },
  {
    week: 19,
    month: 5,
    trimester: 2,
    babySizeFruit: "Mango",
    fruitEmoji: "🥭",
    babyLengthCm: 15.3,
    babyWeightG: 240.0,
    headline: "Vernix Caseosa Protective Shield",
    babyDevelopment: "A white, waxy protective mantle called Vernix Caseosa coats the skin, preventing amniotic chapping.",
    motherChanges: "Hip joints loosen under the influence of Relaxin hormone, causing occasional pelvic clicking.",
    symptoms: ["Round Ligament Pangs", "Dizziness on Quick Rising", "Abdominal Itchiness"],
    safeExerciseTip: "Side-lying clam shells and pelvic bridge lifts.",
    nutritionTip: "Hydrate your skin from within with healthy monounsaturated fats (extra virgin olive oil, nuts).",
    weeklyAdvice: "Apply pure cold-pressed coconut oil or shea butter to soothing itchy, stretching bump skin."
  },
  {
    week: 20,
    month: 5,
    trimester: 2,
    babySizeFruit: "Banana",
    fruitEmoji: "🍌",
    babyLengthCm: 25.6,
    babyWeightG: 300.0,
    headline: "Halfway Mark & Taste Bud Activation",
    babyDevelopment: "Baby's length is now measured crown-to-heel. Taste buds are functional; baby tastes flavors in amniotic fluid.",
    motherChanges: "The top of the uterus (fundus) reaches the level of your belly button (umbilicus).",
    symptoms: ["Definite Fetal Kicks", "Occasional Heartburn", "Swollen Ankles", "Belly Button Flattening"],
    safeExerciseTip: "Cat-cow stretches, gentle prenatal yoga, and supportive belly bands.",
    nutritionTip: "Continue iron supplementation with lemon water; non-heme iron needs peak between weeks 20-30.",
    weeklyAdvice: "Celebrate your 20-week halfway milestone with your partner or loved ones!"
  },
  {
    week: 21,
    month: 5,
    trimester: 2,
    babySizeFruit: "Large Carrot",
    fruitEmoji: "🥕",
    babyLengthCm: 26.7,
    babyWeightG: 360.0,
    headline: "Bone Marrow Hematopoiesis",
    babyDevelopment: "Baby's bone marrow takes over red blood cell synthesis from the spleen and liver.",
    motherChanges: "Increased blood supply can trigger Braxton Hicks contractions—mild, painless practice tightenings.",
    symptoms: ["Braxton Hicks Contractions", "Leg Cramps at Night", "Varicose Veins", "Oily Skin"],
    safeExerciseTip: "Calf wall stretches before bed to prevent nocturnal charley horse cramps.",
    nutritionTip: "Ensure adequate magnesium and calcium balance to prevent muscle cramping.",
    weeklyAdvice: "Braxton Hicks contractions should be irregular and painless; hydrate and rest when they occur."
  },
  {
    week: 22,
    month: 5,
    trimester: 2,
    babySizeFruit: "Papaya",
    fruitEmoji: "🍈",
    babyLengthCm: 27.8,
    babyWeightG: 430.0,
    headline: "Tactile Sensation & Grasp Reflex",
    babyDevelopment: "Touch receptors are fully wired; baby grasps the umbilical cord and touches their face.",
    motherChanges: "Blood volume expands toward peak (~45-50% surplus), increasing cardiac output.",
    symptoms: ["Stretch Marks", "Spider Veins", "Occasional Mild Edema", "Increased Appetite"],
    safeExerciseTip: "Water walking or swimming, which removes all gravity load from joints.",
    nutritionTip: "Protein intake should reach ~75-80g daily (lentils, paneer, tofu, eggs, lean poultry).",
    weeklyAdvice: "A Level II anomaly scan provides detailed anatomical assessment of brain ventricles, heart, spine, and kidneys."
  },
  {
    week: 23,
    month: 6,
    trimester: 2,
    babySizeFruit: "Grapefruit",
    fruitEmoji: "🍊",
    babyLengthCm: 28.9,
    babyWeightG: 500.0,
    headline: "Auditory Startle Reflex & REM Sleep",
    babyDevelopment: "Baby startles at sudden loud external noises. Rapid Eye Movement (REM) brain waves emerge.",
    motherChanges: "Fundal height is now about 3cm above the navel. Postural shifts may cause mild upper back ache.",
    symptoms: ["Swollen Feet", "Snoring / Nasal Congestion", "Clumsiness from Relaxin", "Braxton Hicks"],
    safeExerciseTip: "Gentle shoulder rolls, chest opening yoga poses, and seated hamstring stretches.",
    nutritionTip: "Limit processed high-sodium foods to prevent excessive fluid retention in hands and ankles.",
    weeklyAdvice: "Elevate your feet on cushions whenever seated for more than 30 minutes."
  },
  {
    week: 24,
    month: 6,
    trimester: 2,
    babySizeFruit: "Ear of Corn",
    fruitEmoji: "🌽",
    babyLengthCm: 30.0,
    babyWeightG: 600.0,
    headline: "Viability Milestone & Surfactant Synthesis",
    babyDevelopment: "Baby's lungs begin synthesizing Surfactant in alveolar type II cells to allow alveoli to inflate after birth.",
    motherChanges: "Glucose screening window opens (weeks 24-28) to test for Gestational Diabetes Mellitus (GDM).",
    symptoms: ["Itchy Abdomen", "Glucose Fluctuations", "Restless Legs", "Carpal Tunnel Paresthesia"],
    safeExerciseTip: "20-30 min daily walking helps improve maternal peripheral insulin sensitivity.",
    nutritionTip: "Focus on complex low-glycemic carbohydrates (steel-cut oats, ragi, quinoa) and fiber.",
    weeklyAdvice: "Week 24 marks the medical threshold of viability. Take your oral glucose screening test (OGTT)."
  },
  {
    week: 25,
    month: 6,
    trimester: 2,
    babySizeFruit: "Acorn Squash",
    fruitEmoji: "🎃",
    babyLengthCm: 34.6,
    babyWeightG: 660.0,
    headline: "Capillary Beds & Vocal Recognition",
    babyDevelopment: "Capillary networks populate the skin. Baby clearly distinguishes parental voices from background noise.",
    motherChanges: "Hair enters an extended anagen (growth) phase due to high estrogen, appearing thicker and lustrous.",
    symptoms: ["Lustrous Hair", "Pelvic Girdle Heaviness", "Heartburn after Large Meals", "Constipation"],
    safeExerciseTip: "Pelvic tilts and cat-cow transitions; avoid exercising flat on your back.",
    nutritionTip: "Eat 5-6 smaller, nutrient-dense meals rather than 3 large sittings to prevent acid reflux.",
    weeklyAdvice: "Encourage your partner to talk or read bedtime stories directly against your bump."
  },
  {
    week: 26,
    month: 6,
    trimester: 2,
    babySizeFruit: "Zucchini",
    fruitEmoji: "🥒",
    babyLengthCm: 35.6,
    babyWeightG: 760.0,
    headline: "Eyes Open & Retinal Rod Photoreception",
    babyDevelopment: "Eyelids part for the first time. The fetus can blink and turn toward bright light sources.",
    motherChanges: "Diaphragm faces upward pressure as the uterus ascends, causing slight shortness of breath on stairs.",
    symptoms: ["Mild Breathlessness", "Braxton Hicks Contractions", "Lower Rib Pain", "Sleep Arousal"],
    safeExerciseTip: "Restorative deep chest breathing and gentle side-stretches.",
    nutritionTip: "High-fiber fruits (guava, apples, prunes) ensure smooth bowel movements without straining.",
    weeklyAdvice: "If you are Rh-negative, your obstetrician will schedule an antibody screening and RhoGAM injection."
  },
  {
    week: 27,
    month: 6,
    trimester: 2,
    babySizeFruit: "Cauliflower",
    fruitEmoji: "🥦",
    babyLengthCm: 36.6,
    babyWeightG: 875.0,
    headline: "Rhythmic Hiccups & End of Trimester 2",
    babyDevelopment: "Rhythmic jerky sensations indicate baby is practicing breathing with diaphragm hiccups. Lungs expand.",
    motherChanges: "Blood pressure returns from its mid-pregnancy nadir toward baseline levels.",
    symptoms: ["Fetal Hiccups", "Hemorrhoids / Varicose Veins", "Occasional Leg Cramps", "Vivid Dreams"],
    safeExerciseTip: "Water-based aquatic stretching and supported birth ball rotations.",
    nutritionTip: "Include bioavailable calcium (sesame seeds, paneer, fortified milk) for rapid third-trimester bone mineralization.",
    weeklyAdvice: "You are completing Trimester 2! Review and pack hospital bag essentials soon."
  },
  {
    week: 28,
    month: 7,
    trimester: 3,
    babySizeFruit: "Eggplant",
    fruitEmoji: "🍆",
    babyLengthCm: 37.6,
    babyWeightG: 1000.0,
    headline: "Third Trimester Begins & Kick Counting",
    babyDevelopment: "Baby weighs approximately 1 kilogram (2.2 lbs). Brain cortex develops intricate sulci and gyri grooves.",
    motherChanges: "Prenatal doctor visits typically increase to every two weeks. Kick counting routine begins.",
    symptoms: ["Shortness of Breath", "Frequent Bathroom Trips", "Restless Leg Sensations", "Lumbar Fatigue"],
    safeExerciseTip: "Gentle pelvic floor Kegels and supported wall squats.",
    nutritionTip: "Add +452 kcal/day to support rapid fetal fat storage and third-trimester brain development.",
    weeklyAdvice: "Start daily kick counts: monitor for 10 distinct kicks/movements within a 2-hour restful window."
  },
  {
    week: 29,
    month: 7,
    trimester: 3,
    babySizeFruit: "Butternut Squash",
    fruitEmoji: "🎃",
    babyLengthCm: 38.6,
    babyWeightG: 1150.0,
    headline: "Massive Brain Development & Temperature Control",
    babyDevelopment: "Billions of neurons form synapses. Baby regulates their own body temperature through the hypothalamus.",
    motherChanges: "High prolactin levels prepare mammary glandular lobules for colostrum production.",
    symptoms: ["Colostrum Secretion", "Varicose Veins", "Pelvic Pressure", "Heartburn"],
    safeExerciseTip: "Gentle hip circles on an exercise birth ball to alleviate pelvic floor tension.",
    nutritionTip: "Boost iron-rich foods (lentils, beetroot, spinach) to support maternal and neonatal blood reserves.",
    weeklyAdvice: "A supportive maternity belly band can significantly relieve lower back strain while walking."
  },
  {
    week: 30,
    month: 7,
    trimester: 3,
    babySizeFruit: "Large Cabbage",
    fruitEmoji: "🥬",
    babyLengthCm: 39.9,
    babyWeightG: 1320.0,
    headline: "Amniotic Fluid Peak & Red Cell Production",
    babyDevelopment: "Amniotic fluid volume reaches its peak (~800ml). Bone marrow completely commands red blood cell synthesis.",
    motherChanges: "Uterus reaches roughly 10cm above the navel, crowding internal stomach and intestinal room.",
    symptoms: ["Extreme Heartburn", "Shortness of Breath", "Mood Swings", "Sleep Fragmentation"],
    safeExerciseTip: "Side-lying stretching and 15-minute gentle evening strolls.",
    nutritionTip: "Avoid laying down within 2 hours after meals; elevate your head 30 degrees while sleeping.",
    weeklyAdvice: "Finalize your written Birth Plan preferences (pain management, companions, golden hour bonding)."
  },
  {
    week: 31,
    month: 7,
    trimester: 3,
    babySizeFruit: "Coconut",
    fruitEmoji: "🥥",
    babyLengthCm: 41.1,
    babyWeightG: 1500.0,
    headline: "Pupillary Light Reflex & Rapid Fat Deposit",
    babyDevelopment: "Pupils dilate and constrict in response to light. Arms and legs fill out with soft adipose tissue.",
    motherChanges: "Braxton Hicks tightenings may become more noticeable throughout the day.",
    symptoms: ["Braxton Hicks", "Frequent Urination", "Tender Ribs from Baby Kicks", "Fatigue"],
    safeExerciseTip: "Pelvic tilts against a wall and cat-cow breathing.",
    nutritionTip: "Maintain high hydration (3.0L water daily) to keep amniotic fluid turnover optimal.",
    weeklyAdvice: "Confirm that baby movements remain robust and consistent; notify triage if movement decreases."
  },
  {
    week: 32,
    month: 8,
    trimester: 3,
    babySizeFruit: "Pineapple",
    fruitEmoji: "🍍",
    babyLengthCm: 42.4,
    babyWeightG: 1700.0,
    headline: "Head-Down Turning (Cephalic Presentation)",
    babyDevelopment: "Most babies begin turning head-down into the cephalic presentation. Toenails and fingernails are complete.",
    motherChanges: "Blood volume is 45-50% higher than pre-pregnancy. Pelvic ligaments soften noticeably.",
    symptoms: ["Pelvic Heaviness", "Swollen Feet & Ankles", "Waddling Gait", "Lower Back Aches"],
    safeExerciseTip: "Supported birth ball rocking and gentle inner thigh butterfly stretches.",
    nutritionTip: "Calcium needs reach peak: 1,200mg/day to finalize fetal skeletal hardening.",
    weeklyAdvice: "Schedule your Tdap (Tetanus, Diphtheria, Pertussis) maternal vaccination between weeks 27-36."
  },
  {
    week: 33,
    month: 8,
    trimester: 3,
    babySizeFruit: "Celery Stalk",
    fruitEmoji: "🥬",
    babyLengthCm: 43.7,
    babyWeightG: 1900.0,
    headline: "Maternal Antibodies & Immune Transfer",
    babyDevelopment: "Maternal IgG antibodies traverse the placenta, imparting temporary immunity against infectious pathogens.",
    motherChanges: "Amniotic fluid begins gradually decreasing as the growing baby occupies majority of uterine cavity.",
    symptoms: ["Clumsiness", "Mild Headaches", "Pelvic Soreness", "Vivid Dreams"],
    safeExerciseTip: "Gentle prenatal walking; avoid high-impact jumping or balance-challenging exercises.",
    nutritionTip: "Include omega-3 DHA and choline to optimize final gestational brain myelination.",
    weeklyAdvice: "Install the infant car seat in your vehicle and inspect latch anchors."
  },
  {
    week: 34,
    month: 8,
    trimester: 3,
    babySizeFruit: "Cantaloupe",
    fruitEmoji: "🍈",
    babyLengthCm: 45.0,
    babyWeightG: 2150.0,
    headline: "Mature Central Nervous System & Surfactant",
    babyDevelopment: "Lungs and central nervous system are nearly fully mature. Vernix caseosa thickens across baby's body.",
    motherChanges: "Doctor appointments become weekly or bi-weekly. Fundus is at its highest position under the sternum.",
    symptoms: ["Rib Cage Pain", "Breathlessness", "Frequent Urination", "Insomnia"],
    safeExerciseTip: "Perineal massage can begin this week to enhance tissue elasticity for labor.",
    nutritionTip: "Continue drinking 3 liters of water; dehydration is a common trigger for premature uterine irritability.",
    weeklyAdvice: "Pack your hospital bag items: mother's records, nursing nightgowns, baby onesies, and partner snacks."
  },
  {
    week: 35,
    month: 8,
    trimester: 3,
    babySizeFruit: "Honeydew Melon",
    fruitEmoji: "🍈",
    babyLengthCm: 46.2,
    babyWeightG: 2380.0,
    headline: "Kidneys Fully Functional & Tight Quarters",
    babyDevelopment: "Kidneys excrete mature urine. Movement feels more like strong rolls, pushes, and stretches than sharp kicks.",
    motherChanges: "Doctor may perform Group B Streptococcus (GBS) vaginal-rectal screening swab.",
    symptoms: ["Pelvic Pressure", "Aching Hips", "Nesting Instinct", "Swollen Ankles"],
    safeExerciseTip: "Pelvic circles on birth ball, open squats with chair support.",
    nutritionTip: "Research shows consuming 3-6 Medjool dates daily from week 36 may enhance cervical ripening.",
    weeklyAdvice: "Group B Strep (GBS) screening is standard between weeks 35-37 to determine if IV antibiotics are needed in labor."
  },
  {
    week: 36,
    month: 9,
    trimester: 3,
    babySizeFruit: "Romaine Lettuce",
    fruitEmoji: "🥬",
    babyLengthCm: 47.4,
    babyWeightG: 2600.0,
    headline: "Full-Term Horizon & Lightening (Baby Drops)",
    babyDevelopment: "Baby's head may engage ('drop') into the pelvic brim (lightening). Lungs are fully developed.",
    motherChanges: "Breathing becomes easier as the diaphragm has more room, but bladder pressure intensifies.",
    symptoms: ["Frequent Urination", "Pelvic Stabbing Pangs (Lightning Crotch)", "Mucus Secretion", "Nesting Urge"],
    safeExerciseTip: "Deep pelvic relaxation breathing, wide supported squats.",
    nutritionTip: "Eat light, easily digestible high-energy foods; avoid overly greasy or spicy meals.",
    weeklyAdvice: "Review the 5-1-1 rule: Contractions 5 minutes apart, lasting 1 minute each, for 1 full hour."
  },
  {
    week: 37,
    month: 9,
    trimester: 3,
    babySizeFruit: "Swiss Chard",
    fruitEmoji: "🥬",
    babyLengthCm: 48.6,
    babyWeightG: 2860.0,
    headline: "Early Term Milestone Reached!",
    babyDevelopment: "Your baby is officially considered Early Term! Sucking, swallowing, and breathing reflexes are perfected.",
    motherChanges: "Cervix begins softening, effacing (thinning), and may dilate slightly in preparation for labor.",
    symptoms: ["Braxton Hicks More Frequent", "Loss of Mucus Plug (Show)", "Loose Stools (Natural Bowel Clearing)"],
    safeExerciseTip: "Slow walks, gentle pelvic circles, resting when tired.",
    nutritionTip: "Stay hydrated with electrolyte waters and nourishing bone broths or warm lentil soups.",
    weeklyAdvice: "Keep your hospital bag and prenatal binder in the car or near the front door."
  },
  {
    week: 38,
    month: 9,
    trimester: 3,
    babySizeFruit: "Leek",
    fruitEmoji: "🥬",
    babyLengthCm: 49.8,
    babyWeightG: 3080.0,
    headline: "Shedding Lanugo & Firm Vocal Grasp",
    babyDevelopment: "Most lanugo hair is shed. Baby has developed a firm grasp and firm cranial bones with flexible sutures.",
    motherChanges: "Pelvic pressure increases noticeably as the baby’s head acts as a natural dilating wedge.",
    symptoms: ["Strong Pelvic Pressure", "Sleep Interruption", "Bursts of Nesting Energy", "Backache"],
    safeExerciseTip: "Restorative resting in side-lying positions; slow deep perineal exhalations.",
    nutritionTip: "Continue eating small frequent meals with healthy complex carbs to build up liver glycogen reserves for labor.",
    weeklyAdvice: "Ensure phone numbers for your obstetrician, labor triage, and partner are pinned on speed dial."
  },
  {
    week: 39,
    month: 9,
    trimester: 3,
    babySizeFruit: "Mini Watermelon",
    fruitEmoji: "🍉",
    babyLengthCm: 50.7,
    babyWeightG: 3290.0,
    headline: "Full Term & Ready for Life Outside",
    babyDevelopment: "Your baby is Full Term. Fat stores smooth all wrinkles; the placenta continues transferring vital antibodies.",
    motherChanges: "Cervix continues effacing. Contractions may become rhythmic, longer, and stronger.",
    symptoms: ["Rhythmic Contractions", "Mucus Plug Release", "Nesting Urge", "Fatigue"],
    safeExerciseTip: "Gentle walking and pelvic rockings on the birth ball to encourage optimal cephalic positioning.",
    nutritionTip: "Eat light snacks (dates, toast, coconut water) to maintain maternal energy.",
    weeklyAdvice: "If your water breaks (clear gush or trickle), note the time and color and call your hospital triage immediately."
  },
  {
    week: 40,
    month: 9,
    trimester: 3,
    babySizeFruit: "Small Pumpkin",
    fruitEmoji: "🎃",
    babyLengthCm: 51.2,
    babyWeightG: 3460.0,
    headline: "Due Date Arrival & Meeting Your Miracle!",
    babyDevelopment: "A fully developed, healthy newborn ready to take their first atmospheric breath and cry.",
    motherChanges: "True labor can begin at any hour with involuntary, progressive uterine contractions.",
    symptoms: ["Labor Contractions", "Water Breaking (ROM)", "Bloody Show", "Pelvic Fullness"],
    safeExerciseTip: "Rest, gentle sway with partner support, and slow harmonic breathing during surges.",
    nutritionTip: "Sip isotonic electrolyte fluids and keep hydrated throughout early labor.",
    weeklyAdvice: "Trust your body's innate wisdom, follow your birth plan, and welcome your precious baby into your arms!"
  }
];

export const MONTHS_DATA: MonthData[] = [
  {
    month: 1,
    weeks: "Weeks 1 - 4",
    trimester: 1,
    themeTitle: "The Miracle of Conception & Implantation",
    fruitComparison: "From microscopic cell to a poppy seed (0.1 cm)",
    babyDevelopment: [
      "Fertilization occurs in the fallopian tube, creating a zygote.",
      "Rapid cellular division turns the zygote into a blastocyst of ~100 cells.",
      "The blastocyst implants into the nutrient-rich uterine wall around Day 7-10.",
      "The amniotic cavity, yolk sac, and primitive placenta begin to generate."
    ],
    milestones: [
      "Conception confirmed by home pregnancy test or blood hCG test.",
      "Amniotic sac forms to cushion the microscopic embryo."
    ],
    motherPhysicalChanges: [
      "Hormone hCG surges, signaling ovaries to produce progesterone.",
      "Mild implantation spotting or light pink discharge.",
      "Increased blood flow causes breast tingling and tenderness.",
      "Basal body temperature stays slightly elevated."
    ],
    commonSymptoms: [
      "Mild lower abdominal twinges",
      "Profound fatigue",
      "Slight nausea or aversion to strong smells",
      "Frequent urges to hydrate and urinate"
    ],
    emotionalAndHormonal: [
      "Surge of anticipation, anxiety, and joy upon positive test.",
      "Hormonal adjustments can trigger sudden tearfulness or excitement.",
      "Natural worry about pregnancy stability."
    ],
    recommendedNutrition: [
      "Folic acid (400 - 800 mcg/day) is non-negotiable for neural tube closure.",
      "Leafy greens: Spinach, kale, methi.",
      "Fortified cereals, lentils, and citrus fruits.",
      "Clean hydration: 2.5 liters of filtered water daily."
    ],
    safeActivityAndExercise: [
      "Gentle 20-30 minute walks.",
      "Restorative stretching avoiding abdominal strain.",
      "Focus on slow diaphragmatic breathing."
    ],
    medicalAppointmentsAndScans: [
      "Confirmation visit with OB/GYN or midwife.",
      "Baseline vitals, blood type, Rh factor, Rubella immunity, and complete blood count (CBC)."
    ],
    importantPrecautions: [
      "Cease all alcohol, smoking, vaping, and recreational substances immediately.",
      "Review any chronic prescription medications with your physician.",
      "Avoid raw unpasteurized dairy, raw fish (sushi), and unwashed produce."
    ],
    faqs: [
      {
        question: "Is light spotting normal during Week 3 or 4?",
        answer: "Yes, implantation bleeding occurs in roughly 25-30% of pregnancies when the embryo embeds into the vascular uterine wall. However, if bleeding becomes heavy or accompanied by severe cramping, consult your doctor immediately."
      },
      {
        question: "How is my gestational age calculated?",
        answer: "Gestational age is calculated from the first day of your Last Menstrual Period (LMP), which means you are technically considered 2 weeks pregnant at the moment of conception."
      }
    ],
    weeklyTips: [
      "Start prenatal vitamins containing methylfolate or folic acid right away.",
      "Download GarbhSarthi to begin your personalized health and milestone journal.",
      "Rest whenever your body asks for it; early embryonic cell growth requires massive metabolic energy."
    ]
  },
  {
    month: 2,
    weeks: "Weeks 5 - 8",
    trimester: 1,
    themeTitle: "The Beating Heart & Organogenesis",
    fruitComparison: "From sesame seed (Week 5) to a sweet raspberry (Week 8, 1.6 cm)",
    babyDevelopment: [
      "The primitive tube heart begins rhythmic contractions around 5.5 to 6 weeks.",
      "Brain divides into three distinct vesicles (forebrain, midbrain, hindbrain).",
      "Tiny limb buds sprout, quickly differentiating into arms, hands, and digital rays.",
      "Facial features form: optic vesicles (eyes), nasal pits, and inner ear canals."
    ],
    milestones: [
      "First audible or visible heartbeat on transvaginal ultrasound (110-160 bpm).",
      "Neural tube completely closes along the spine."
    ],
    motherPhysicalChanges: [
      "Uterus enlarges to the size of a lemon inside the pelvis.",
      "Blood volume expands by 15-20%, leading to increased cardiac output.",
      "Gastrointestinal motility slows down due to elevated progesterone."
    ],
    commonSymptoms: [
      "Morning sickness (nausea and vomiting at any hour of the day)",
      "Heightened olfactory sensitivity (hyperosmia)",
      "Food cravings and sudden intense aversions",
      "Frequent urination as the expanding uterus presses on the bladder"
    ],
    emotionalAndHormonal: [
      "Frustration with debilitating nausea or fatigue.",
      "Partner feeling helpless or unsure how best to provide physical support.",
      "Desire for privacy before reaching end of the first trimester."
    ],
    recommendedNutrition: [
      "Vitamin B6 (pyridoxine) rich foods (bananas, chickpeas, poultry) to ease nausea.",
      "Ginger root tea or candied ginger drops.",
      "High protein nibbles before bed (almonds, string cheese, Greek yogurt).",
      "Electrolyte replenishment: coconut water, light broths."
    ],
    safeActivityAndExercise: [
      "Low impact walks in fresh morning or evening air.",
      "Gentle prenatal yoga emphasizing spine lengthening and hips.",
      "Avoid hot yoga, heavy straining, or high-intensity intervals."
    ],
    medicalAppointmentsAndScans: [
      "Dating ultrasound (often around 7-8 weeks) to confirm viability and gestational sac location.",
      "Screening for thyroid function (TSH) and vitamin D levels."
    ],
    importantPrecautions: [
      "Report inability to retain fluids for 24 hours (signs of Hyperemesis Gravidarum).",
      "Avoid hot tubs, saunas, and hot baths above 38°C (100°F).",
      "Do not handle cat litter boxes to prevent toxoplasmosis exposure."
    ],
    faqs: [
      {
        question: "Why do I feel nauseous all day instead of just morning?",
        answer: "'Morning sickness' is a misnomer; fluctuating hCG, estrogen, and gastric dysmotility can strike at any hour. Eating small protein-packed snacks every two hours helps stabilize blood sugar."
      },
      {
        question: "Can ultrasound sound waves harm my baby?",
        answer: "Diagnostic ultrasound uses safe non-ionizing high-frequency sound waves, not radiation. Decades of clinical evidence show diagnostic scans perform vital safety assessments without harming fetal development."
      }
    ],
    weeklyTips: [
      "Keep a tin of bland crackers on your nightstand to nibble before lifting your head from the pillow.",
      "Switch to a gentle, unscented body wash and natural skincare.",
      "Invite your partner into GarbhSarthi so they can read weekly symptom explanations and support you empathetically."
    ]
  },
  {
    month: 3,
    weeks: "Weeks 9 - 12",
    trimester: 1,
    themeTitle: "Graduation to Fetus & The End of Trimester One",
    fruitComparison: "From green olive (Week 9) to a juicy plum (Week 12, 5.4 cm, 14g)",
    babyDevelopment: [
      "Embryo is officially designated a 'fetus'.",
      "All essential organ systems, though immature, are in place.",
      "Tiny fingers and toes lose their webbing; fingernails and hair follicles begin.",
      "Kidneys begin filtering blood and secreting amniotic fluid."
    ],
    milestones: [
      "Fetal reflexes develop: curled fingers, squinting eyelids, suckling motions.",
      "Placenta takes over primary progesterone production from the corpus luteum."
    ],
    motherPhysicalChanges: [
      "Uterus rises out of the true pelvic cavity above the pubic symphysis.",
      "Morning sickness gradually begins to abate for many mothers.",
      "Veins may become more prominent across breasts and abdomen."
    ],
    commonSymptoms: [
      "Decreasing extreme fatigue, initial spark of returning energy",
      "Occasional headaches caused by shifting vascular dynamics",
      "Visible darkening of the areolas and possible linea nigra start",
      "Occasional lightheadedness upon standing rapidly (orthostatic hypotension)"
    ],
    emotionalAndHormonal: [
      "Sense of relief as the critical organogenesis phase closes.",
      "Excitement building towards sharing pregnancy announcements.",
      "Anticipation of genetic screening results."
    ],
    recommendedNutrition: [
      "Calcium-rich choices: Paneer, curd, fortified plant milk, sesame seeds.",
      "Iron-dense lentils, ragi (finger millet), and dates.",
      "High fiber meals to prevent sluggish digestion."
    ],
    safeActivityAndExercise: [
      "Swimming: buoyant, pressure-free whole-body conditioning.",
      "Prenatal pilates targeting core stability and posture without lying flat on your back.",
      "Kegel exercises (pelvic floor muscle contractions and full releases)."
    ],
    medicalAppointmentsAndScans: [
      "Nuchal Translucency (NT) Scan (Weeks 11-13+6).",
      "Non-Invasive Prenatal Testing (NIPT) cell-free fetal DNA screening (optional).",
      "Routine Doppler check to hear the swishing fetal heartbeat."
    ],
    importantPrecautions: [
      "Do not perform abdominal crunches or exercises lying flat on back.",
      "Wear supportive footwear to prevent arch strain and slips."
    ],
    faqs: [
      {
        question: "What does the NT scan evaluate?",
        answer: "The NT ultrasound measures the fluid thickness at the back of the fetal neck. When combined with maternal blood markers, it provides risk assessment for chromosomal variations such as Down syndrome (Trisomy 21)."
      }
    ],
    weeklyTips: [
      "Celebrate completing Trimester 1! Treat yourself to comfortable maternity lounge wear.",
      "Stay hydrated: keep a designated water bottle nearby and log your daily glasses in GarbhSarthi."
    ]
  },
  {
    month: 4,
    weeks: "Weeks 13 - 16",
    trimester: 2,
    themeTitle: "The Golden Second Trimester & Blooming Energy",
    fruitComparison: "From a lemon (Week 13) to an avocado (Week 16, 11.6 cm, 100g)",
    babyDevelopment: [
      "Baby's neck lengthens and head becomes more erect.",
      "Eyes move closer to the front of the face; external ears reach final position.",
      "Baby swallows amniotic fluid and practices breathing movements.",
      "Fine lanugo hair covers the skin to hold protective vernix."
    ],
    milestones: [
      "Baby can make facial expressions: frowning, squinting, and smiling.",
      "Skeleton begins transitioning from flexible cartilage to dense bone."
    ],
    motherPhysicalChanges: [
      "Definite baby bump emerges.",
      "Increased melanin can produce chloasma ('mask of pregnancy') on forehead/cheeks.",
      "Round ligament stretches, causing brief sharp aches when sneezing or twisting."
    ],
    commonSymptoms: [
      "Renewed energy and vitality",
      "Nasal congestion or minor nosebleeds due to estrogen-rich mucosal blood flow",
      "Increased healthy vaginal discharge (leukorrhea)",
      "Mild back tension"
    ],
    emotionalAndHormonal: [
      "Feeling more connected to the baby as the physical shape shifts.",
      "Confidence in planning nursery, registry, and baby names.",
      "Increased intimacy and romantic connection with partner."
    ],
    recommendedNutrition: [
      "Omega-3 fatty acids: walnuts, flaxseeds, chia, wild salmon.",
      "Zinc and Vitamin C for maternal tissue elasticity and collagen synthesis.",
      "Healthy snack pairing: Apple slices with almond butter."
    ],
    safeActivityAndExercise: [
      "Brisk walking: 30 minutes 5 days a week.",
      "Stationary cycling: knee-safe cardiovascular workout.",
      "Pelvic tilts and side-lying leg lifts."
    ],
    medicalAppointmentsAndScans: [
      "Second trimester routine clinical check: fundal height, blood pressure, urine protein.",
      "Mid-trimester blood test (quadruple marker if indicated)."
    ],
    importantPrecautions: [
      "Always stand up slowly from sitting or lying down.",
      "Avoid heavy lifting (>10 kg) and sudden twisting motions.",
      "Apply broad-spectrum sunscreen to minimize melasma darkening."
    ],
    faqs: [
      {
        question: "Why do I feel sudden sharp pains in my lower groin when standing up?",
        answer: "This is classic Round Ligament Pain. The round ligaments support your expanding uterus. When you move suddenly, cough, or laugh, they stretch like rubber bands. Resting and warm compresses help ease the tension."
      }
    ],
    weeklyTips: [
      "Invest in a supportive pregnancy pillow to position between your knees and behind your back.",
      "Start shortlisting baby names in the Gnani AI Baby Name Generator with your partner."
    ]
  },
  {
    month: 5,
    weeks: "Weeks 17 - 20",
    trimester: 2,
    themeTitle: "The Halfway Mark & First Sweet Flutters",
    fruitComparison: "From a pomegranate (Week 17) to a banana (Week 20, 25 cm, 300g)",
    babyDevelopment: [
      "Hearing is remarkably developed; baby reacts to loud external sounds.",
      "Myelin sheath insulates nerves for faster sensory transmission.",
      "Vernix caseosa coats the skin like a natural creamy moisture barrier.",
      "In female fetuses, the uterus and fallopian tubes form; millions of primitive eggs are present."
    ],
    milestones: [
      "First perception of fetal movement (Quickening): feels like bubbles or fluttering butterflies.",
      "Week 20 marks the exact halfway point of pregnancy (20 weeks down, 20 to go!)."
    ],
    motherPhysicalChanges: [
      "Top of uterus (fundus) reaches level with the navel.",
      "Center of gravity begins to shift forward, increasing lumbar lordosis.",
      "Skin over the abdomen stretches, sometimes causing mild itchiness."
    ],
    commonSymptoms: [
      "Fetal kicks and somersaults",
      "Occasional leg cramps during sleep",
      "Heartburn after spicy or heavy meals",
      "Mild lower back aches"
    ],
    emotionalAndHormonal: [
      "Excitement over seeing detailed anatomy in the level II ultrasound.",
      "Deep bonding as partner can soon feel kicks from the outside.",
      "Maternal daydreaming and nesting instinct commences."
    ],
    recommendedNutrition: [
      "Magnesium-rich foods (pumpkin seeds, spinach, dark chocolate) for muscle relaxation.",
      "Adequate iron: Beetroots, pomegranate, rajma (kidney beans), lean poultry.",
      "Stay away from lying down within 90 minutes of eating to deter reflux."
    ],
    safeActivityAndExercise: [
      "Prenatal yoga incorporating hip openers (bound angle pose, goddess pose).",
      "Wall push-ups and light dumbbell shoulder presses for upper body strength.",
      "Foot ankle rotations to encourage venous return."
    ],
    medicalAppointmentsAndScans: [
      "The Anatomy Scan (Level II Ultrasound, 18-22 Weeks): comprehensive review of baby's brain, heart chambers, kidneys, spine, limbs, placenta position, and amniotic fluid index."
    ],
    importantPrecautions: [
      "Sleep strictly on your side (left side preferred) to keep the inferior vena cava uncompressed.",
      "Moisturize your stretching belly with natural shea butter or sweet almond oil."
    ],
    faqs: [
      {
        question: "When will my partner be able to feel the baby kick?",
        answer: "While you feel internal flutters around 18-20 weeks, kicks generally become strong enough for a hand placed on your abdomen to detect between weeks 22 and 24, especially when lying quiet in the evening."
      }
    ],
    weeklyTips: [
      "Upload your Level II ultrasound images directly into GarbhSarthi's Little Moments vault.",
      "Place your partner's warm hand on your abdomen after a cold glass of juice when baby is most active."
    ]
  },
  {
    month: 6,
    weeks: "Weeks 21 - 24",
    trimester: 2,
    themeTitle: "Viability Milestone & Sensory Awakening",
    fruitComparison: "From a carrot (Week 21) to an ear of corn (Week 24, 30 cm, 600g)",
    babyDevelopment: [
      "Baby's face is fully formed with visible eyelashes and delicate eyebrows.",
      "Lungs develop terminal sacs and begin manufacturing surfactant necessary for outside breathing.",
      "Baby establishes regular sleep and active wake cycles.",
      "Inner ear vestibular system matures, giving baby a sense of balance and upside-down orientation."
    ],
    milestones: [
      "Week 24 milestone of fetal viability with specialized neonatal intensive care.",
      "Baby responds actively to music, voices, and maternal laughter with rhythmic nudges."
    ],
    motherPhysicalChanges: [
      "Uterine muscle undergoes occasional painless practice tightening (Braxton Hicks).",
      "Feet may swell slightly towards evening (physiological dependent edema).",
      "Carpal tunnel sensations: occasional tingling in fingers from fluid retention."
    ],
    commonSymptoms: [
      "Active kick sessions throughout day and night",
      "Braxton Hicks contractions",
      "Itchy belly and hips",
      "Mild bleeding from gums during brushing due to vascular gingival changes"
    ],
    emotionalAndHormonal: [
      "Sense of profound maternal warmth and attachment.",
      "Occasional stress about labor readiness, balancing work and impending motherhood.",
      "Fun planning baby shower themes and nursery colors."
    ],
    recommendedNutrition: [
      "Fiber powerhouse: Oats, flaxseed, chia pudding, cooked lentils.",
      "Potassium-packed snacks: Coconut water, bananas, sweet potatoes.",
      "Avoid excess sodium to help manage evening ankle swelling."
    ],
    safeActivityAndExercise: [
      "Brisk walking on even surfaces with supportive athletic shoes.",
      "Seated posture exercises on an ergonomic yoga ball.",
      "Arm circles and gentle chest openers."
    ],
    medicalAppointmentsAndScans: [
      "Gestational Diabetes Screening: Oral Glucose Tolerance Test (OGTT, 24-28 weeks).",
      "Hemoglobin / Ferritin check for maternal anemia."
    ],
    importantPrecautions: [
      "Learn to distinguish Braxton Hicks (irregular, painless, stop with rest/water) from true preterm labor contractions (rhythmic, regular, increasing in intensity).",
      "Stay hydrated: dehydration triggers false uterine irritability."
    ],
    faqs: [
      {
        question: "How do I prepare for the Glucose Tolerance Test (OGTT)?",
        answer: "Eat your regular healthy diet in the days leading up to the test. Follow your doctor's specific fasting instructions, drink the measured glucose beverage calmly, and relax during the blood draws."
      }
    ],
    weeklyTips: [
      "Start browsing the Baby Shower Planner module in GarbhSarthi to pick your theme and draft your guest list.",
      "Use a soft-bristled toothbrush to protect sensitive pregnancy gums."
    ]
  },
  {
    month: 7,
    weeks: "Weeks 25 - 28",
    trimester: 3,
    themeTitle: "Entering Trimester Three & The Final Stretch",
    fruitComparison: "From an acorn squash (Week 25) to a plump eggplant (Week 28, 37.6 cm, 1000g / 1kg)",
    babyDevelopment: [
      "Baby's eyes open; pupils react to light penetrating through the uterine wall.",
      "Brain tissue develops characteristic complex fissures and convolutions.",
      "Baby practices swallowing, producing tiny rhythmic hiccups that mother can feel.",
      "Fat deposits accumulate under baby's skin, smoothing away wrinkly appearance."
    ],
    milestones: [
      "Baby crosses the 1-kilogram (2.2 lbs) milestone.",
      "Entering the definitive Third Trimester!"
    ],
    motherPhysicalChanges: [
      "Diaphragm is pushed upward by 4 cm; lung capacity reorganizes.",
      "Pelvic joints loosen under the influence of the hormone relaxin.",
      "Colostrum (first nutrient-dense antibody milk) may be produced."
    ],
    commonSymptoms: [
      "Shortness of breath on ascending stairs",
      "Rhythmic baby hiccups (gentle rhythmic ticking flutters)",
      "Frequent nighttime waking to change sleeping positions",
      "Restless legs sensation in the evening"
    ],
    emotionalAndHormonal: [
      "Patience tested by physical bulk and interrupted sleep.",
      "Nesting energy surges: urge to wash newborn clothes and organize drawers.",
      "Focus shifting towards birth education classes."
    ],
    recommendedNutrition: [
      "Choline (eggs, broccoli, soybeans) to support rapid fetal brain synapses.",
      "Iron + Vitamin C combinations: citrus salad with pumpkin seeds and spinach.",
      "Small meals every 3 hours to prevent severe acid reflux."
    ],
    safeActivityAndExercise: [
      "Pelvic clock rotations and gentle hip sways on a birth ball.",
      "Side-lying stretches and gentle hamstring stretches.",
      "Daily 20-minute walking sessions."
    ],
    medicalAppointmentsAndScans: [
      "Routine Third Trimester consultation.",
      "Rh-negative mothers receive Anti-D (RhoGAM) injection if indicated.",
      "Discussion of pediatric care options and hospital registration."
    ],
    importantPrecautions: [
      "Start daily fetal kick counts: track 10 distinct movements within a 2-hour window when resting.",
      "Avoid sleeping on your back.",
      "Report sudden severe headaches, blurry vision, or sudden hand/face swelling (preeclampsia flags)."
    ],
    faqs: [
      {
        question: "What do fetal hiccups feel like?",
        answer: "Fetal hiccups feel like regular, rhythmic tapping or twitching in your lower belly, lasting anywhere from a few minutes to half an hour. They are completely normal and show the diaphragm is practicing respiration."
      }
    ],
    weeklyTips: [
      "Use GarbhSarthi's Kick Counter in the Health Tracker module every evening around 8 PM.",
      "Take a hospital maternity ward virtual or in-person tour."
    ]
  },
  {
    month: 8,
    weeks: "Weeks 29 - 32",
    trimester: 3,
    themeTitle: "Brain Growth Explosion & Getting Ready for Delivery",
    fruitComparison: "From a butternut squash (Week 29) to a sweet pineapple (Week 32, 42.4 cm, 1700g / 1.7kg)",
    babyDevelopment: [
      "Baby gains half a pound (~250g) of healthy fat every single week now.",
      "Bones are fully developed, though soft and pliable to navigate the birth canal.",
      "Toenails have reached the tips of toes; full head of fine hair may be present.",
      "Most babies rotate into the cephalic (head-down) position."
    ],
    milestones: [
      "Baby's five senses are functional: can see shadows, taste amniotic flavors, hear voices, and suck thumb.",
      "Pupils dilate and constrict in response to light."
    ],
    motherPhysicalChanges: [
      "Ribs expand laterally; fundus sits about 3-5 inches above the navel.",
      "Swelling in feet and hands becomes more pronounced in hot weather.",
      "Sciatic nerve compression may trigger tingling down one thigh."
    ],
    commonSymptoms: [
      "Frequent heartburn and gastroesophageal reflux",
      "Pelvic heaviness and pressure on the bladder",
      "Clumsiness from shifted center of gravity and loose ligaments",
      "Vivid dreams about childbirth and baby"
    ],
    emotionalAndHormonal: [
      "Anticipation mixed with natural birth nervousness.",
      "Deep desire for cozy nest preparation at home.",
      "Appreciation for partner's support with daily errands."
    ],
    recommendedNutrition: [
      "Calcium (1200 mg/day) for final skeletal hardening.",
      "Adequate fluids: minimum 2.5 - 3 liters daily.",
      "Complex carbs: brown rice, quinoa, millet rotis for steady energy."
    ],
    safeActivityAndExercise: [
      "Deep supported squatting against a wall or with partner support.",
      "Gentle prenatal yoga cat-cow and child's pose with wide knees.",
      "Slow, mindful walking."
    ],
    medicalAppointmentsAndScans: [
      "Bi-weekly OB/GYN or midwife appointments begin.",
      "Growth scan ultrasound to verify fetal presentation (head-down vs breech), placental maturity, and estimated fetal weight."
    ],
    importantPrecautions: [
      "Never ignore decreased fetal movement; if baby is unusually quiet, drink cold water, lie on your left side, and contact triage if 10 kicks aren't felt.",
      "Do not climb ladders or balance on chairs during nesting."
    ],
    faqs: [
      {
        question: "What if my baby is breech (head up) at 32 weeks?",
        answer: "There is still plenty of amniotic fluid and time for your baby to turn naturally between 32 and 36 weeks. Techniques like forward-leaning inversions, pelvic tilts, and gentle swimming can encourage rotation."
      }
    ],
    weeklyTips: [
      "Review the GarbhSarthi Hospital Bag Checklist and start gathering items into two suitcases (one for labor, one for baby).",
      "Install the infant car seat and get it professionally inspected."
    ]
  },
  {
    month: 9,
    weeks: "Weeks 33 - 40+",
    trimester: 3,
    themeTitle: "Full Term Maturity & Welcoming Your Baby",
    fruitComparison: "From a honeydew melon (Week 36) to a ripe watermelon (Week 40, 51 cm, 3.4kg)",
    babyDevelopment: [
      "Lungs produce ample surfactant; baby is capable of breathing room air.",
      "Lanugo sheds and vernix is reabsorbed, leaving silky soft skin.",
      "Fat accumulates in dimpled elbows, knees, and cheeks.",
      "Immune system receives massive transfer of maternal antibodies for postpartum protection."
    ],
    milestones: [
      "Week 37: Reaching Early Term!",
      "Week 39 - 40: Full Term completion. Baby is ready for the world."
    ],
    motherPhysicalChanges: [
      "Lightening occurs: Baby's head engages into the pelvic inlet, easing breathing but increasing pelvic floor pressure.",
      "Cervix begins softening, effacing (thinning), and may dilate slightly.",
      "Loss of mucus plug or 'bloody show' indicating cervix preparation."
    ],
    commonSymptoms: [
      "Frequent strong Braxton Hicks or early latent contractions",
      "Intense pelvic pressure and waddling gait",
      "Frequent urges to empty bladder every 30-45 minutes",
      "Burst of sudden nesting energy"
    ],
    emotionalAndHormonal: [
      "Impatience, eagerness, and profound love ready to meet baby.",
      "Surrender to the natural birthing process.",
      "Quiet anticipation shared between parents."
    ],
    recommendedNutrition: [
      "Easily digestible energy foods: bone broths, dates, bananas, smoothies.",
      "Electrolytes to maintain cellular hydration during labor contractions.",
      "Keep meals warm, comforting, and light."
    ],
    safeActivityAndExercise: [
      "Perineal massage and relaxation breathing techniques.",
      "Gentle figure-8 hip movements on the birthing ball.",
      "Relaxing warm showers and restorative pacing."
    ],
    medicalAppointmentsAndScans: [
      "Weekly prenatal visits from Week 36 onwards.",
      "Group B Streptococcus (GBS) vaginal-rectal swab (36-37 weeks).",
      "Cervical dilation checks if indicated.",
      "Non-stress tests (NST) if past 40 weeks."
    ],
    importantPrecautions: [
      "Memorize emergency signs: sudden gush or trickle of fluid (water breaking), bright red vaginal bleeding, severe unremitting pain, decreased movement.",
      "Keep hospital bags and car keys in a designated spot."
    ],
    faqs: [
      {
        question: "How do I know I'm in true labor versus false labor?",
        answer: "True labor contractions become progressively longer, stronger, and closer together, do not stop when you change position, and are felt radiating from lower back to front. False labor contractions are irregular and fade with rest or hydration."
      },
      {
        question: "What is the 5-1-1 rule?",
        answer: "Head to the hospital or birth center when contractions come every 5 minutes, last for 1 full minute, and have stayed consistent for at least 1 hour (for first-time mothers)."
      }
    ],
    weeklyTips: [
      "Rest as much as humanly possible; your body will run a marathon soon.",
      "Review your birth preferences and hospital bag with your partner in GarbhSarthi.",
      "Take a deep breath and trust your body's remarkable ability to birth your baby!"
    ]
  }
];
