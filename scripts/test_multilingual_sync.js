/**
 * Multilingual Synchronization & Localization Verification Test Suite
 */

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

const { TRANSLATIONS, getTranslation } = loadTsModule('../src/data/translations.ts');

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

// 4. Multilingual Indic AI Knowledge Base & Live API Verification
console.log('\n--- 4. INDIC AI COMPANION MULTILINGUAL VERIFICATION ---');

const aiTsCode = fs.readFileSync(path.join(__dirname, '../src/data/multilingualAiKnowledge.ts'), 'utf8');
const aiJsCode = ts.transpileModule(aiTsCode, {
  compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText;

const aiMod = { exports: {} };
new Function('module', 'exports', aiJsCode)(aiMod, aiMod.exports);
const { MULTILINGUAL_AI_RESPONSES, getLocalizedAiGreeting } = aiMod.exports;

// Test greeting across all 6 languages
SUPPORTED_LANGS.forEach(lang => {
  const greeting = getLocalizedAiGreeting(lang, 'Anita');
  assert(!!greeting && greeting.length > 20, `Localized AI greeting generated for '${lang}'`);
});

// Test clinical sleep knowledge across languages
const testPrompts = [
  { lang: 'kn-IN', expectedWord: 'ಎಡ' },
  { lang: 'hi-IN', expectedWord: 'बाईं' },
  { lang: 'ta-IN', expectedWord: 'இடது' },
  { lang: 'te-IN', expectedWord: 'ఎడమ' },
  { lang: 'ml-IN', expectedWord: 'ഇടതു' },
  { lang: 'en-US', expectedWord: 'left' }
];

testPrompts.forEach(item => {
  const responses = MULTILINGUAL_AI_RESPONSES[item.lang] || [];
  const sleepItem = responses.find(r => r.keywords.some(k => k.includes('sleep') || k.includes('ಮಲಗ') || k.includes('सोने') || k.includes('தூங்க') || k.includes('పడుకో') || k.includes('കിട')));
  assert(!!sleepItem, `Clinical sleep guidance exists for '${item.lang}'`);
  if (sleepItem) {
    const text = (sleepItem.response || '').toLowerCase();
    assert(
      text.includes(item.expectedWord.toLowerCase()),
      `Clinical guidance for '${item.lang}' contains correct lateral decubitus terminology ('${item.expectedWord}')`
    );
  }
});

async function testAiMultilingualLive() {
  const http = require('http');

  const livePrompts = [
    { lang: 'kn-IN', query: 'ನಿದ್ರೆ ಮಾಡಲು ಯಾವ ಮಗ್ಗುಲು ಉತ್ತಮ?', expectedWord: 'ಎಡ' },
    { lang: 'hi-IN', query: 'सोने की सबसे सुरक्षित स्थिति क्या है?', expectedWord: 'बाईं' },
    { lang: 'en-US', query: 'What is the safest sleeping position in pregnancy?', expectedWord: 'left' }
  ];

  // Check if live server is reachable
  const isServerUp = await new Promise(resolve => {
    const req = http.request('http://localhost:3000/api/pairing', { method: 'GET', timeout: 800 }, res => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });

  if (isServerUp) {
    console.log('\n--- 5. LIVE HTTP ENDPOINT VERIFICATION (localhost:3000) ---');
    for (const item of livePrompts) {
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
  } else {
    console.log('\n(Live dev server not running on port 3000 - verified offline clinical Indic intelligence suite directly)');
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

testAiMultilingualLive();
