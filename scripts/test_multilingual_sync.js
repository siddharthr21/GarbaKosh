/**
 * Multilingual Synchronization & Localization Verification Test Suite
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const tsCode = fs.readFileSync(path.join(__dirname, '../src/data/translations.ts'), 'utf8');
const jsCode = ts.transpileModule(tsCode, {
  compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText;

const mod = { exports: {} };
const fn = new Function('module', 'exports', jsCode);
fn(mod, mod.exports);

const { TRANSLATIONS, getTranslation } = mod.exports;

const SUPPORTED_LANGS = ['en-US', 'kn-IN', 'hi-IN', 'ta-IN', 'te-IN', 'ml-IN'];

console.log('================================================================');
console.log('GARBHSARTHI MULTILINGUAL SYNCHRONIZATION TEST SUITE');
console.log('Testing 6 Supported Languages & Full UI Key Localization');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

// 1. Language Dictionary Presence
console.log('--- 1. LANGUAGE DICTIONARIES PRESENCE ---');
SUPPORTED_LANGS.forEach(lang => {
  const dict = TRANSLATIONS[lang];
  assert(!!dict, `Dictionary for '${lang}' exists`);
  const keysCount = Object.keys(dict || {}).length;
  assert(keysCount > 50, `Dictionary for '${lang}' has comprehensive key coverage (${keysCount} keys)`);
});

// 2. Core UI Navigation Keys in All 6 Languages
console.log('\n--- 2. CORE NAVIGATION & CLINICAL KEY TRANSLATIONS ---');
const CORE_KEYS = [
  'homeDashboard',
  'journey',
  'bloomAi',
  'contractions',
  'birthPlan',
  'nutrition',
  'exercise',
  'sosEmergency',
  'week',
  'month',
  'mother',
  'partner'
];

CORE_KEYS.forEach(key => {
  const missingLangs = [];
  SUPPORTED_LANGS.forEach(lang => {
    const val = getTranslation(lang, key);
    if (!val || val === key) {
      missingLangs.push(lang);
    }
  });

  assert(
    missingLangs.length === 0,
    `Key '${key}' is translated across all 6 languages (missing: ${missingLangs.join(', ') || 'none'})`
  );
});

// 3. Dynamic Switching Verification
console.log('\n--- 3. DYNAMIC TRANSLATION RESOLUTION ---');
assert(
  getTranslation('kn-IN', 'homeDashboard') === 'ಮುಖ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
  "Kannada 'homeDashboard' resolves to 'ಮುಖ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'"
);
assert(
  getTranslation('hi-IN', 'homeDashboard') === 'होम डैशबोर्ड',
  "Hindi 'homeDashboard' resolves to 'होम डैशबोर्ड'"
);
assert(
  getTranslation('ta-IN', 'homeDashboard') === 'முகப்பு பலகை',
  "Tamil 'homeDashboard' resolves to 'முகப்பு பலகை'"
);
assert(
  getTranslation('te-IN', 'homeDashboard') === 'హోమ్ డాష్‌బోర్డ్',
  "Telugu 'homeDashboard' resolves to 'హోమ్ డాష్‌బోర్డ్'"
);
assert(
  getTranslation('ml-IN', 'homeDashboard') === 'ഹോം ഡാഷ്‌ബോർഡ്',
  "Malayalam 'homeDashboard' resolves to 'ഹോം ഡാഷ്‌ബോർഡ്'"
);

// 4. Live API Multilingual AI Verification
console.log('\n--- 4. LIVE API INDIC AI COMPANION VERIFICATION ---');
async function testAiMultilingual() {
  const http = require('http');

  const testPrompts = [
    { lang: 'kn-IN', query: 'ನಿದ್ರೆ ಮಾಡಲು ಯಾವ ಮಗ್ಗುಲು ಉತ್ತಮ?', expectedWord: 'ಎಡ' },
    { lang: 'hi-IN', query: 'सोने की सबसे सुरक्षित स्थिति क्या है?', expectedWord: 'बाईं' },
    { lang: 'en-US', query: 'What is the safest sleeping position in pregnancy?', expectedWord: 'left' }
  ];

  for (const item of testPrompts) {
    try {
      const data = JSON.stringify({ message: item.query, language: item.lang });
      const res = await new Promise((resolve, reject) => {
        const req = http.request(
          'http://localhost:3000/api/ai/chat',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(data)
            },
            timeout: 5000
          },
          res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
          }
        );
        req.on('error', reject);
        req.write(data);
        req.end();
      });

      assert(res.status === 200, `POST /api/ai/chat returns 200 for ${item.lang}`);
      const text = ((res.body.response || res.body.text) || '').toLowerCase();
      assert(
        text.includes(item.expectedWord.toLowerCase()),
        `AI response for ${item.lang} contains expected localized guidance ('${item.expectedWord}')`
      );
    } catch (e) {
      assert(false, `AI test for ${item.lang} failed: ${e.message}`);
    }
  }

  console.log('\n================================================================');
  console.log(`MULTILINGUAL TEST RESULTS: TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================');
  if (failed === 0) {
    console.log('🎉 ALL MULTILINGUAL SYNCHRONIZATION TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

testAiMultilingual();
