const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const cache = {};
function loadTsModule(relPath) {
  const fullPath = path.resolve(__dirname, relPath);
  if (cache[fullPath]) return cache[fullPath];
  const tsCode = fs.readFileSync(fullPath, 'utf8');
  const jsCode = ts.transpileModule(tsCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const mod = { exports: {} };
  cache[fullPath] = mod.exports;
  const fn = new Function('require', 'module', 'exports', '__dirname', '__filename', jsCode);
  fn((reqPath) => {
    if (reqPath.startsWith('.')) {
      const ext = reqPath.endsWith('.ts') ? '' : '.ts';
      return loadTsModule(path.join(path.dirname(fullPath), reqPath + ext));
    }
    return require(reqPath);
  }, mod, mod.exports, path.dirname(fullPath), fullPath);
  cache[fullPath] = mod.exports;
  return mod.exports;
}

const { getTranslation, TRANSLATIONS } = loadTsModule('../src/data/translations.ts');

const REGIONAL_LANGS = ['kn-IN', 'hi-IN', 'ta-IN', 'te-IN', 'ml-IN'];

const TEST_QUERIES = [
  // User Prompt 9 explicitly reported items:
  'Curated Organic Soundscapes',
  'Bedtime Visualizations & Sleep Stories',
  'Partner Collaboration & Family Sanctuary',
  'partnerCollabTitle',
  'Coordinate hospital packing, birth plans, and labor support with your partner.',
  'motherSubtitle',
  'Baby Shower & Ceremony Planner',
  'Celebration & Blessing Planning',
  'Design your Godh Bharai, Seemantham, or modern baby shower: guest list RSVP, budget, theme, and registry.',
  'Baby Shopping & Product Safety',
  'Curated Nursery & Newborn Gear',
  'Pediatric reviews, full specifications, high-res photos, and live price links to Amazon India & Flipkart.',
  'Verified Pediatric Safety & Live Marketplace Connectivity',
  '100% Organic / Non-Toxic Only',
  'All Essentials',
  'Clothing',
  'Diapering',
  'Skincare',
  'Feeding',
  'Crib & Sleep',
  'Strollers & Seats',
  'Bath',
  'Safety & Monitors',

  // Image 1: Exercise Module
  'Pelvic Floor Master: Kegel Contractions & Release',
  'Prenatal Cat-Cow Spine Decompression',
  'Mindful 20-Minute Prenatal Brisk Walk',
  'Supported Birth Squats & Hip Openers',
  'Coherent 4-7-8 Labor Preparation Breathing',
  'Gentle',
  'gentle',
  'Moderate',
  'moderate',
  'Restorative',
  'restorative',
  'Yoga',
  'Walking',
  'Pelvic Floor',
  'pelvic floor',
  'Breathing',
  'Stretching',
  'Completed Today',
  'Mark as Done',
  'Sit comfortably on a chair or lie on your left side with knees bent.',
  'Come onto hands and knees in a tabletop position with wrists under shoulders and knees under hips.',

  // Image 2: Little Moments Module
  'Little Moments',
  'vaultTitle',
  'Diagnostic Imagery Disclaimer',
  'vaultDisclaimer',
  'Compare Scans',
  'Export Scrapbook',
  'uploadScan',
  'First Trimester NT Scan',
  'Mid-Pregnancy Level II Anomaly Scan',
  'First Time Rohan Felt the Kicks!',
  "Doctor's Observation:",

  // Image 3: Postpartum Module
  'The Fourth Trimester Maternal Recovery',
  'postpartumTitle',
  'Daily Maternal Recovery Log',
  'Delivery Type',
  'Vaginal Birth',
  'Cesarean (C-Section)',
  'Lochia (Bleeding) Flow',
  'Light Pink / Brownish (Normal)',
  'Moderate Red (Normal Days 3-10)',
  'Heavy (Soaking 1 pad / 2 hrs)',
  'Emergency: Soaking < 1 hr or big clots',
  'Breast Condition',
  'Soft / Normal Milk Flow',
  'Engorged & Full',
  'Tender or Sore Nipples',
  'High Fever & Red Hard Streaks',
  'Save Postpartum Check-In',
  'The 6-Week Recovery Milestones',
  'Days 1 - 7: Immediate Involution',
  'Weeks 2 - 4: Healing & Gentle Rhythm',
  'Week 6: Postpartum Clinical Checkup',

  // Image 4: Baby Care Module
  'Estimated Birth Weight',
  'Today’s Feedings',
  'Wet Diapers (24h)',
  'Total Sleep',
  'Quick Activity Logger',
  'Nursing',
  'Bottle',
  'Sleep',
  'Wet Diaper',
  'Dirty Diaper',
  'Today’s Newborn Activity Stream',
  'Pediatric Care Knowledge & Safe Sleep',
  'Why Newborns Sneeze:',
  'The Safe Sleep ABCs:',
  'Burping Techniques:',
  'National Pediatric Immunization Roadmap',
  'Age Window',
  'Recommended Vaccines',

  // Image 5: Settings & Privacy Module
  'Privacy & Data Sharing',
  'Full transparency over who can access your maternal health records.',
  'Your Data is Private',
  'Partner Companion Sharing',
  'YOUR UNIQUE MOTHER SECURITY CODE',
  'YOUR UNIQUE PARTNER CODE',
  'Gestational Progression',
  'Appointments Schedule',
  'Shared Milestones',
  'Selected Health Summaries',
  'Birth Delivery Plan',
  'Hospital & Nursery Checklist',
  'Collaborative Tasks',
  'Pregnancy Reminders',
  'Ultrasound Documents'
];

let totalChecks = 0;
let passedChecks = 0;
let failures = [];

console.log('================================================================');
console.log('VERIFYING TRANSLATIONS FOR ALL USER-REPORTED MODULES & IMAGES');
console.log('================================================================\n');

for (const lang of REGIONAL_LANGS) {
  let langPassed = 0;
  let langTotal = 0;

  for (const query of TEST_QUERIES) {
    totalChecks++;
    langTotal++;
    const translated = getTranslation(lang, query, query);

    // It must return a string, not empty, and not the raw English query (unless it's already in the target language)
    const isEnglishOnly = translated === query && !['5-1-1', 'WHO', 'OGTT', 'Tdap'].includes(query);
    if (!translated || isEnglishOnly) {
      failures.push({ lang, query, got: translated });
    } else {
      passedChecks++;
      langPassed++;
    }
  }

  console.log(`[${lang}] Passed: ${langPassed} / ${langTotal} (${Math.round((langPassed / langTotal) * 100)}%)`);
}

console.log('\n----------------------------------------------------------------');
console.log(`TOTAL CHECKS: ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${failures.length}`);
console.log('----------------------------------------------------------------');

if (failures.length > 0) {
  console.error('\nFAILED TRANSLATIONS SAMPLE (up to 15):');
  failures.slice(0, 15).forEach(f => {
    console.error(`- [${f.lang}] "${f.query}" => "${f.got}"`);
  });
  process.exit(1);
} else {
  console.log('\nALL USER-REPORTED ITEMS ARE 100% TRANSLATED IN ALL 5 REGIONAL LANGUAGES!');
}
