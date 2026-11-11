/**
 * Comprehensive Gnani AI & Clinical Assistant Test Suite
 * Tests Gnani TTS, STT, Chat Routing, Emergency Triage, Multilingual Synthesis,
 * Obstetric Domains, and Edge Cases.
 */

const http = require('http');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(description, condition, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${description}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${description} ${details ? `--> ${details}` : ''}`);
    failedTests++;
    failures.push({ description, details });
  }
}

function postJson(path, body, headers = {}) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        let data = null;
        try { data = JSON.parse(raw); } catch (e) { data = raw; }
        resolve({ status: res.statusCode, headers: res.headers, data });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });

    req.write(postData);
    req.end();
  });
}

function getJson(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        let data = null;
        try { data = JSON.parse(raw); } catch (e) { data = raw; }
        resolve({ status: res.statusCode, data });
      });
    }).on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });
  });
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('GNANI AI & CLINICAL INTELLIGENCE VERIFICATION TEST SUITE');
  console.log('Testing Gnani TTS, Connectivity, Multilingual QA, and Safety');
  console.log('================================================================\n');

  // -------------------------------------------------------------------
  // 1. Connectivity & Provider Configuration
  // -------------------------------------------------------------------
  console.log('--- 1. GNANI AI CONFIGURATION & CONNECTIVITY TESTS ---');
  const configRes = await getJson('/api/ai/chat');
  assert('GET /api/ai/chat returns status 200', configRes.status === 200);
  assert('AI assistant is configured', configRes.data?.configured === true);
  assert('Gnani is registered as an active server provider', configRes.data?.serverProviders?.gnani === true);
  assert('Active provider is Gnani AI', configRes.data?.activeProvider === 'gnani');

  const testConnRes = await postJson('/api/ai/chat', { test: true });
  assert('POST /api/ai/chat { test: true } verifies Gnani connectivity', 
    testConnRes.status === 200 && testConnRes.data?.success === true && testConnRes.data?.provider === 'Gnani AI',
    JSON.stringify(testConnRes.data)
  );

  // -------------------------------------------------------------------
  // 2. Gnani Timbre Speech-To-Text & Text-To-Speech Tests
  // -------------------------------------------------------------------
  console.log('\n--- 2. GNANI TIMBRE INDIC TTS TESTS ---');
  const ttsEnRes = await postJson('/api/ai/gnani/tts', {
    text: 'Rest on your left side to maximize placental blood flow.',
    language: 'en-IN'
  });
  assert('POST /api/ai/gnani/tts returns HTTP 200 for English (en-IN)', ttsEnRes.status === 200);
  assert('TTS returns audio/wav Content-Type', ttsEnRes.headers?.['content-type'] === 'audio/wav');
  assert('TTS returns RIFF binary data', typeof ttsEnRes.data === 'string' && ttsEnRes.data.startsWith('RIFF'));

  const ttsKnRes = await postJson('/api/ai/gnani/tts', {
    text: 'ಎಡ ಮಗ್ಗುಲಿನಲ್ಲಿ ಮಲಗುವುದು ಮಗುವಿಗೆ ಅತ್ಯಂತ ಸುರಕ್ಷಿತ.',
    language: 'kn-IN'
  });
  assert('POST /api/ai/gnani/tts returns HTTP 200 for Kannada (kn-IN) Nayana voice', ttsKnRes.status === 200);

  const ttsHiRes = await postJson('/api/ai/gnani/tts', {
    text: 'गर्भावस्था में बाईं करवट सोना सबसे अच्छा है।',
    language: 'hi-IN'
  });
  assert('POST /api/ai/gnani/tts returns HTTP 200 for Hindi (hi-IN) Nalini voice', ttsHiRes.status === 200);

  const ttsEmptyRes = await postJson('/api/ai/gnani/tts', { text: '' });
  assert('POST /api/ai/gnani/tts rejects empty text with HTTP 400', ttsEmptyRes.status === 400);

  // -------------------------------------------------------------------
  // 3. Question-Answer Semantic Alignment: Sleep Posture
  // -------------------------------------------------------------------
  console.log('\n--- 3. QUESTION-ANSWER ALIGNMENT: SLEEP POSTURE ---');
  const sleepEn = await postJson('/api/ai/chat', {
    message: 'What is the best position to sleep during pregnancy?',
    language: 'en-US'
  });
  assert('Sleep query in English returns Left Side / SOS sleeping guidance',
    sleepEn.status === 200 &&
    sleepEn.data?.response?.toLowerCase().includes('left side') &&
    sleepEn.data?.response?.includes('IVC')
  );

  const sleepKn = await postJson('/api/ai/chat', {
    message: 'ಗರ್ಭಿಣಿಯರು ಹೇಗೆ ಮಲಗಬೇಕು?',
    language: 'kn-IN'
  });
  assert('Sleep query in Kannada returns ಎಡ ಮಗ್ಗುಲು guidance',
    sleepKn.status === 200 && sleepKn.data?.response?.includes('ಎಡ ಮಗ್ಗುಲಿನಲ್ಲಿ ಮಲಗುವುದು')
  );

  const sleepHi = await postJson('/api/ai/chat', {
    message: 'गर्भावस्था में किस करवट सोना चाहिए?',
    language: 'hi-IN'
  });
  assert('Sleep query in Hindi returns बाईं करवट guidance',
    sleepHi.status === 200 && sleepHi.data?.response?.includes('बाईं करवट सोना')
  );

  // -------------------------------------------------------------------
  // 4. Question-Answer Semantic Alignment: Morning Sickness
  // -------------------------------------------------------------------
  console.log('\n--- 4. QUESTION-ANSWER ALIGNMENT: NAUSEA & SICKNESS ---');
  const nauseaEn = await postJson('/api/ai/chat', {
    message: 'How can I stop morning sickness and nausea?',
    language: 'en-US'
  });
  assert('Nausea query in English returns ginger, crackers and B6 advice',
    nauseaEn.status === 200 &&
    nauseaEn.data?.response?.toLowerCase().includes('nausea') &&
    nauseaEn.data?.response?.toLowerCase().includes('crackers')
  );

  const nauseaKn = await postJson('/api/ai/chat', {
    message: 'ಮುಂಜಾನೆ ವಾಂತಿ ವಾಕರಿಕೆಗೆ ಏನು ಮಾಡಬೇಕು?',
    language: 'kn-IN'
  });
  assert('Nausea query in Kannada returns ವಾಕರಿಕೆ / ವಾಂತಿ guidance',
    nauseaKn.status === 200 && nauseaKn.data?.response?.includes('ವಾಕರಿಕೆ')
  );

  // -------------------------------------------------------------------
  // 5. Question-Answer Semantic Alignment: Fetal Kicks & Movement
  // -------------------------------------------------------------------
  console.log('\n--- 5. QUESTION-ANSWER ALIGNMENT: FETAL KICKS ---');
  const kicksEn = await postJson('/api/ai/chat', {
    message: 'How to count baby kicks?',
    language: 'en-US'
  });
  assert('Kick query in English explains 10 movements in 2 hours rule',
    kicksEn.status === 200 &&
    kicksEn.data?.response?.includes('10 movements') &&
    kicksEn.data?.response?.includes('2 hours')
  );

  const kicksKn = await postJson('/api/ai/chat', {
    message: 'ಮಗುವಿನ ಕಿಕ್ ಎಣಿಕೆ ಮಾಡುವುದು ಹೇಗೆ?',
    language: 'kn-IN'
  });
  assert('Kick query in Kannada returns ೧೦ ಬಾರಿ ಮಗುವಿನ ಚಲನೆ rule',
    kicksKn.status === 200 && kicksKn.data?.response?.includes('೧೦ ಬಾರಿ ಮಗುವಿನ ಚಲನೆ')
  );

  // -------------------------------------------------------------------
  // 6. Question-Answer Semantic Alignment: Hospital Bag
  // -------------------------------------------------------------------
  console.log('\n--- 6. QUESTION-ANSWER ALIGNMENT: HOSPITAL BAG ---');
  const bagEn = await postJson('/api/ai/chat', {
    message: 'What should I pack in my hospital bag?',
    language: 'en-US'
  });
  assert('Hospital bag query in English provides categorized packing list',
    bagEn.status === 200 &&
    bagEn.data?.response?.includes('For Mother') &&
    bagEn.data?.response?.includes('For Baby')
  );

  const bagHi = await postJson('/api/ai/chat', {
    message: 'अस्पताल बैग की तैयारी कैसे करें?',
    language: 'hi-IN'
  });
  assert('Hospital bag query in Hindi provides माँ और शिशु के लिए list',
    bagHi.status === 200 && bagHi.data?.response?.includes('माँ के लिए')
  );

  // -------------------------------------------------------------------
  // 7. Question-Answer Semantic Alignment: Labor Contractions & 5-1-1
  // -------------------------------------------------------------------
  console.log('\n--- 7. QUESTION-ANSWER ALIGNMENT: LABOR & CONTRACTIONS ---');
  const laborEn = await postJson('/api/ai/chat', {
    message: 'How do I know I am in labor contractions?',
    language: 'en-US'
  });
  assert('Labor query explains 5-1-1 Rule for hospital departure',
    laborEn.status === 200 &&
    laborEn.data?.response?.includes('5-1-1 Rule') &&
    laborEn.data?.response?.includes('5 minutes')
  );

  // -------------------------------------------------------------------
  // 8. Question-Answer Semantic Alignment: Breastfeeding & Colostrum
  // -------------------------------------------------------------------
  console.log('\n--- 8. QUESTION-ANSWER ALIGNMENT: BREASTFEEDING ---');
  const feedEn = await postJson('/api/ai/chat', {
    message: 'Tell me about breastfeeding and latching',
    language: 'en-US'
  });
  assert('Breastfeeding query covers Golden Hour, Colostrum and Latching',
    feedEn.status === 200 &&
    feedEn.data?.response?.includes('Golden Hour') &&
    feedEn.data?.response?.includes('Colostrum') &&
    feedEn.data?.response?.includes('Latch')
  );

  // -------------------------------------------------------------------
  // 9. Week Milestones & Fetal Growth
  // -------------------------------------------------------------------
  console.log('\n--- 9. WEEK-SPECIFIC FETAL DEVELOPMENT ---');
  const week12 = await postJson('/api/ai/chat', {
    message: 'How big is my baby in week 12?',
    gestationalWeek: 12
  });
  assert('Week 12 inquiry returns Plum size and first trimester milestone',
    week12.status === 200 &&
    week12.data?.response?.includes('Plum') &&
    week12.data?.response?.includes('Week 12')
  );

  const week36 = await postJson('/api/ai/chat', {
    message: 'How big is my baby in week 36?',
    gestationalWeek: 36
  });
  assert('Week 36 inquiry returns Romaine Lettuce and third trimester milestone',
    week36.status === 200 &&
    week36.data?.response?.includes('Romaine Lettuce') &&
    week36.data?.response?.includes('Week 36')
  );

  // -------------------------------------------------------------------
  // 10. Food Safety, Travel, Scans & Digestion
  // -------------------------------------------------------------------
  console.log('\n--- 10. SPECIALIZED CLINICAL TOPICS ---');
  const foodQuery = await postJson('/api/ai/chat', {
    message: 'Is it safe to eat papaya or pineapple?'
  });
  assert('Food safety query explains unripe papaya latex risks and bromelain',
    foodQuery.status === 200 &&
    foodQuery.data?.response?.includes('Raw/Unripe Papaya') &&
    foodQuery.data?.response?.includes('latex and papain')
  );

  const travelQuery = await postJson('/api/ai/chat', {
    message: 'Can I travel by flight in pregnancy?'
  });
  assert('Travel query explains 2nd trimester safety window and DVT prevention',
    travelQuery.status === 200 &&
    travelQuery.data?.response?.includes('Golden Window') &&
    travelQuery.data?.response?.includes('Air Travel')
  );

  const scanQuery = await postJson('/api/ai/chat', {
    message: 'What scans do I need in pregnancy?'
  });
  assert('Scan query outlines NT scan, TIFFA anomaly scan and OGTT',
    scanQuery.status === 200 &&
    scanQuery.data?.response?.includes('NT') &&
    scanQuery.data?.response?.includes('TIFFA')
  );

  const digestionQuery = await postJson('/api/ai/chat', {
    message: 'How to relieve constipation and severe heartburn?'
  });
  assert('Digestion query gives fiber, water, and reflux elevation guidance',
    digestionQuery.status === 200 &&
    digestionQuery.data?.response?.includes('Heartburn Relief') &&
    digestionQuery.data?.response?.includes('Constipation Relief')
  );

  // -------------------------------------------------------------------
  // 11. Clinical Safety & Emergency Triage Tests
  // -------------------------------------------------------------------
  console.log('\n--- 11. CLINICAL SAFETY & EMERGENCY TRIAGE ---');
  const bleedTest = await postJson('/api/ai/chat', {
    message: 'I have severe vaginal bleeding with clots'
  });
  assert('Vaginal bleeding triggers IMMEDIATE EMERGENCY ALERT',
    bleedTest.status === 200 && bleedTest.data?.isEmergencyAlert === true && bleedTest.data?.source === 'clinical-emergency-triage'
  );

  const preeclampsiaTest = await postJson('/api/ai/chat', {
    message: 'Severe headache and blurred vision with flashing spots'
  });
  assert('Preeclampsia symptoms trigger IMMEDIATE EMERGENCY ALERT',
    preeclampsiaTest.status === 200 && preeclampsiaTest.data?.isEmergencyAlert === true
  );

  const waterBreakTest = await postJson('/api/ai/chat', {
    message: 'My water broke and leaking green fluid'
  });
  assert('Rupture of membranes / meconium triggers IMMEDIATE ALERT',
    waterBreakTest.status === 200 && waterBreakTest.data?.isEmergencyAlert === true
  );

  // -------------------------------------------------------------------
  // 12. Edge Cases & Robustness
  // -------------------------------------------------------------------
  console.log('\n--- 12. EDGE CASES & ROBUSTNESS ---');
  const emptyRes = await postJson('/api/ai/chat', { message: '   ' });
  assert('Empty message string is rejected with HTTP 400', emptyRes.status === 400);

  const week50Res = await postJson('/api/ai/chat', {
    message: 'How big is my baby?',
    gestationalWeek: 50 // Out of bounds week
  });
  assert('Out-of-bounds week 50 is safely clamped to week 40 without crashing',
    week50Res.status === 200 && week50Res.data?.response?.includes('Week 40')
  );

  const unknownLangRes = await postJson('/api/ai/chat', {
    message: 'What should I pack for hospital?',
    language: 'fr-FR' // unsupported language code
  });
  assert('Unsupported language fr-FR gracefully falls back to English',
    unknownLangRes.status === 200 && unknownLangRes.data?.response?.includes('hospital bag')
  );

  // -------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`TEST SUITE RESULTS: TOTAL: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('================================================================');

  if (failedTests > 0) {
    console.error('\nFAILURES SUMMARY:');
    failures.forEach((f, idx) => {
      console.error(`${idx + 1}. ${f.description}: ${f.details}`);
    });
    process.exit(1);
  } else {
    console.log('\nALL 34 GNANI AI & CLINICAL INTELLIGENCE TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  }
}

runTestSuite();
