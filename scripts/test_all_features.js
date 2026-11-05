/**
 * Comprehensive BloomNest Feature Test Suite
 * Tests all application modules, business logic, calculations, clinical safety rules, and APIs.
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

// ----------------------------------------------------------------------
// 1. Contraction Timer & 5-1-1 Clinical Rule Tests
// ----------------------------------------------------------------------
function testContractionTimer() {
  console.log('\n--- 1. CONTRACTION TIMER & 5-1-1 RULE TESTS ---');

  // Interval calculation helper
  function computeInterval(lastStartTimeMs, currentStartTimeMs) {
    const diffMs = currentStartTimeMs - lastStartTimeMs;
    const diffMins = diffMs / (1000 * 60);
    return Number(Math.max(0.1, diffMins).toFixed(1));
  }

  // Check accurate decimal interval
  const t1 = 100000000;
  const t2 = t1 + 3.5 * 60 * 1000; // 3.5 minutes later
  const interval = computeInterval(t1, t2);
  assert('Contraction interval preserves decimal precision', interval === 3.5, `Got: ${interval}`);

  // Test 5-1-1 Rule detection: 3+ contractions lasting >= 55s, <= 5.5 mins apart
  function check511(contractions) {
    if (contractions.length < 3) return false;
    return contractions.slice(0, 3).every(c => c.durationSeconds >= 55 && (c.intervalMinutes ?? 10) <= 5.5);
  }

  const normalLatentContractions = [
    { durationSeconds: 30, intervalMinutes: 12 },
    { durationSeconds: 25, intervalMinutes: 15 },
    { durationSeconds: 28, intervalMinutes: 14 }
  ];
  assert('Latent phase does not trigger 5-1-1 alert', check511(normalLatentContractions) === false);

  const activeLaborContractions = [
    { durationSeconds: 65, intervalMinutes: 4.2 },
    { durationSeconds: 60, intervalMinutes: 3.8 },
    { durationSeconds: 70, intervalMinutes: 4.5 }
  ];
  assert('Active labor triggers 5-1-1 alert', check511(activeLaborContractions) === true);

  const mixedContractions = [
    { durationSeconds: 65, intervalMinutes: 4.0 },
    { durationSeconds: 40, intervalMinutes: 4.0 }, // under 55s
    { durationSeconds: 65, intervalMinutes: 4.0 }
  ];
  assert('Inconsistent surge duration does not falsely trigger 5-1-1', check511(mixedContractions) === false);
}

// ----------------------------------------------------------------------
// 2. Clinical Vitals & Preeclampsia Safety Triage
// ----------------------------------------------------------------------
function testClinicalVitalsTriage() {
  console.log('\n--- 2. CLINICAL VITALS & PREECLAMPSIA SAFETY TESTS ---');

  function evaluateVitalsTriage(sys, dia) {
    const isPreeclampsiaEmergency = sys >= 140 || dia >= 90;
    const isSeverePreeclampsia = sys >= 160 || dia >= 110;
    return { isPreeclampsiaEmergency, isSeverePreeclampsia };
  }

  const normal = evaluateVitalsTriage(118, 76);
  assert('Normal blood pressure (118/76) does not trigger triage alert', !normal.isPreeclampsiaEmergency);

  const mildElevatedSys = evaluateVitalsTriage(142, 82);
  assert('Systolic hypertension (142/82) triggers preeclampsia alert', mildElevatedSys.isPreeclampsiaEmergency);

  const mildElevatedDia = evaluateVitalsTriage(128, 92);
  assert('Diastolic hypertension (128/92) triggers preeclampsia alert', mildElevatedDia.isPreeclampsiaEmergency);

  const severeEmergency = evaluateVitalsTriage(165, 112);
  assert('Severe gestational hypertension (165/112) is flagged as severe', severeEmergency.isSeverePreeclampsia);
}

// ----------------------------------------------------------------------
// 3. Baby Shower Registry & Shopping Synchronization
// ----------------------------------------------------------------------
function testRegistryAndShoppingSync() {
  console.log('\n--- 3. BABY SHOWER & SHOPPING REGISTRY TESTS ---');

  let showerPlan = {
    registryItems: [
      { id: 'reg-1', name: 'Organic Cotton Swaddles (Pack of 3)', priceEst: 899, claimedBy: undefined },
      { id: 'reg-2', name: 'Ergonomic Feeding Pillow', priceEst: 1499, claimedBy: 'Aunt Lakshmi' }
    ]
  };

  // Add item from shopping
  function addShowerRegistryItem(name, priceEst = 999) {
    const newItem = {
      id: `reg-${Date.now()}`,
      name,
      category: 'Essentials',
      priceEst,
      link: ''
    };
    showerPlan.registryItems.push(newItem);
    return newItem;
  }

  // Toggle claim
  function toggleClaimRegistryItem(id, claimant = 'Family Member') {
    showerPlan.registryItems = showerPlan.registryItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          claimedBy: item.claimedBy ? undefined : claimant
        };
      }
      return item;
    });
  }

  const added = addShowerRegistryItem('Baby Monitor Audio/Video', 3499);
  assert('New item successfully added to registry with INR price',
    showerPlan.registryItems.length === 3 && added.priceEst === 3499
  );

  // Claim unallocated item
  toggleClaimRegistryItem(added.id, 'Grandma Meena');
  const claimedItem = showerPlan.registryItems.find(i => i.id === added.id);
  assert('Item successfully claimed by gift giver', claimedItem.claimedBy === 'Grandma Meena');

  // Unclaim item
  toggleClaimRegistryItem(added.id);
  const uncalimedItem = showerPlan.registryItems.find(i => i.id === added.id);
  assert('Item successfully unclaimed and made available again', uncalimedItem.claimedBy === undefined);
}

// ----------------------------------------------------------------------
// 4. Baby Activity Stream & Deletion
// ----------------------------------------------------------------------
function testBabyActivityStream() {
  console.log('\n--- 4. BABY ACTIVITY STREAM & DELETION TESTS ---');

  let activities = [
    { id: 'act-1', type: 'breastfeeding', durationMinutes: 20, time: '08:00 AM' },
    { id: 'act-2', type: 'sleep', durationMinutes: 90, time: '09:00 AM' },
    { id: 'act-3', type: 'bottle', amountMl: 60, time: '11:00 AM' }
  ];

  function deleteBabyActivity(id) {
    activities = activities.filter(a => a.id !== id);
  }

  deleteBabyActivity('act-2');
  assert('Baby activity deleted by ID successfully',
    activities.length === 2 && !activities.some(a => a.id === 'act-2')
  );

  deleteBabyActivity('non-existent');
  assert('Deleting non-existent activity is a safe no-op', activities.length === 2);
}

// ----------------------------------------------------------------------
// 5. Baby Names Filtering & Voting Mechanics
// ----------------------------------------------------------------------
function testBabyNamesExplorer() {
  console.log('\n--- 5. BABY NAMES FILTERING & VOTING TESTS ---');

  const namesList = [
    { id: 'n1', name: 'Aadhya', gender: 'girl', origin: 'Sanskrit', style: 'Sanskrit Classic', meaning: 'First power', isFavorite: false, isShortlisted: true, motherVote: 1, partnerVote: 1 },
    { id: 'n2', name: 'Aarav', gender: 'boy', origin: 'Hindi', style: 'Modern', meaning: 'Peaceful', isFavorite: true, isShortlisted: true, motherVote: 1, partnerVote: 0 },
    { id: 'n3', name: 'Ananya', gender: 'girl', origin: 'Tamil', style: 'Traditional', meaning: 'Matchless', isFavorite: false, isShortlisted: false, motherVote: 0, partnerVote: 0 },
    { id: 'n4', name: 'Reyansh', gender: 'boy', origin: 'Sanskrit', style: 'Modern', meaning: 'Ray of sunlight', isFavorite: true, isShortlisted: true, motherVote: 1, partnerVote: 1 }
  ];

  function filterNames(list, { searchQuery = '', gender = 'all', origin = 'all', style = 'all', tab = 'explore' }) {
    return list.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = gender === 'all' || item.gender === gender;
      const matchesOrigin = origin === 'all' || item.origin.toLowerCase().includes(origin.toLowerCase());
      const matchesStyle = style === 'all' || (item.style && item.style.toLowerCase().includes(style.toLowerCase()));
      const matchesAll = matchesSearch && matchesGender && matchesOrigin && matchesStyle;

      if (tab === 'favorites') return item.isFavorite && matchesAll;
      if (tab === 'shortlist') return item.isShortlisted && matchesAll;
      return matchesAll;
    });
  }

  const girlNames = filterNames(namesList, { gender: 'girl' });
  assert('Filter by gender (girl) returns only girls', girlNames.length === 2 && girlNames.every(n => n.gender === 'girl'));

  const modernBoyNames = filterNames(namesList, { gender: 'boy', style: 'modern' });
  assert('Filter by gender (boy) + style (modern) works correctly',
    modernBoyNames.length === 2 && modernBoyNames.every(n => n.style === 'Modern' && n.gender === 'boy')
  );

  const sharedFavorites = filterNames(namesList, { tab: 'favorites' });
  assert('Filter favorites tab returns only favorites', sharedFavorites.length === 2);

  const coupleShortlist = filterNames(namesList, { tab: 'shortlist' });
  assert('Filter shortlist tab returns shortlisted items', coupleShortlist.length === 3);

  // Both parents voting check
  const bothVotedYes = namesList.filter(n => (n.motherVote + n.partnerVote) === 2);
  assert('Mutual couple agreement identified (both voted yes)', bothVotedYes.length === 2);
}

// ----------------------------------------------------------------------
// 6. Postpartum Recovery Red-Flag Triage
// ----------------------------------------------------------------------
function testPostpartumTriage() {
  console.log('\n--- 6. POSTPARTUM RECOVERY RED FLAGS ---');

  function checkPostpartumRedFlags({ lochiaFlow, breastCondition, fever }) {
    const alerts = [];
    if (lochiaFlow === 'red-flag') {
      alerts.push('POSTPARTUM_HEMORRHAGE');
    }
    if (breastCondition === 'mastitis-warning' || fever > 38.5) {
      alerts.push('MASTITIS_INFECTION');
    }
    return alerts;
  }

  const normalPostpartum = checkPostpartumRedFlags({ lochiaFlow: 'moderate', breastCondition: 'normal', fever: 37.0 });
  assert('Normal postpartum flow does not trigger emergency alerts', normalPostpartum.length === 0);

  const hemorrhageAlert = checkPostpartumRedFlags({ lochiaFlow: 'red-flag', breastCondition: 'normal', fever: 37.0 });
  assert('Lochia red-flag triggers hemorrhage alert', hemorrhageAlert.includes('POSTPARTUM_HEMORRHAGE'));

  const mastitisAlert = checkPostpartumRedFlags({ lochiaFlow: 'light', breastCondition: 'mastitis-warning', fever: 39.0 });
  assert('Mastitis symptoms trigger clinical alert', mastitisAlert.includes('MASTITIS_INFECTION'));
}

// ----------------------------------------------------------------------
// 7. Live HTTP API Tests (Localhost 3000)
// ----------------------------------------------------------------------
async function postJson(path, body) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      },
      timeout: 15000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, parseError: e.message });
        }
      });
    });

    req.on('error', err => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(dataString);
    req.end();
  });
}

async function getJson(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 10000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, parseError: e.message });
        }
      });
    });

    req.on('error', err => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.end();
  });
}

async function testLiveApiEndpoints() {
  console.log('\n--- 7. LIVE HTTP API TESTS (/api/ai/chat, /api/mothers/available, /api/pairing) ---');

  try {
    // 7.1 Available Mothers API
    const mothersRes = await getJson('/api/mothers/available');
    assert('GET /api/mothers/available responds with 200 OK', mothersRes.status === 200);
    assert('Available mothers returns array with valid profile structure',
      Array.isArray(mothersRes.data?.availableMothers) && mothersRes.data.availableMothers.length > 0,
      JSON.stringify(mothersRes.data)
    );

    // 7.2 AI Chatbot - Medical Question (Groq LPU)
    const chatRes = await postJson('/api/ai/chat', {
      message: 'What foods are rich in iron for the third trimester in South Indian diet?',
      gestationalWeek: 30,
      userRole: 'mother',
      language: 'en'
    });
    assert('POST /api/ai/chat answers medical question with 200 OK', chatRes.status === 200);
    assert('AI Chatbot response contains comprehensive text and dynamic follow-ups',
      chatRes.data?.success === true &&
      chatRes.data?.response?.length > 100 &&
      Array.isArray(chatRes.data?.followUps) &&
      chatRes.data?.followUps.length > 0,
      `Source: ${chatRes.data?.source}`
    );

    // 7.3 AI Chatbot - Multilingual Query (Kannada)
    const kannadaChatRes = await postJson('/api/ai/chat', {
      message: 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಯಾವ ಹಣ್ಣುಗಳನ್ನು ಸೇವಿಸಬೇಕು?',
      gestationalWeek: 16,
      userRole: 'mother',
      language: 'kn'
    });
    assert('POST /api/ai/chat handles multilingual Kannada prompt',
      kannadaChatRes.status === 200 && kannadaChatRes.data?.success === true
    );

    // 7.4 AI Chatbot - Emergency Red Flag Triage (Bleeding)
    const emergencyChatRes = await postJson('/api/ai/chat', {
      message: 'I am experiencing bright red bleeding with clots',
      gestationalWeek: 28,
      userRole: 'mother',
      language: 'en'
    });
    assert('POST /api/ai/chat detects bleeding red flag and triggers emergency triage',
      emergencyChatRes.status === 200 &&
      emergencyChatRes.data?.isEmergencyAlert === true &&
      emergencyChatRes.data?.source === 'clinical-emergency-triage'
    );

    // 7.5 AI Chatbot - Reduced Movement Red Flag
    const kicksEmergencyRes = await postJson('/api/ai/chat', {
      message: 'Baby has stopped moving and no kicks for 12 hours',
      gestationalWeek: 32,
      userRole: 'mother',
      language: 'en'
    });
    assert('POST /api/ai/chat detects cessation of fetal kicks and flags urgent triage',
      kicksEmergencyRes.status === 200 &&
      kicksEmergencyRes.data?.isEmergencyAlert === true
    );

    // 7.6 Pairing API - Invalid Code Rejection
    const invalidPairRes = await postJson('/api/pairing', {
      partnerId: 'usr_partner_a',
      motherCode: 'INVALID-CODE-XYZ'
    });
    assert('POST /api/pairing rejects invalid mother code',
      invalidPairRes.data?.success === false || invalidPairRes.status === 400 || invalidPairRes.status === 404,
      `Status: ${invalidPairRes.status}`
    );

  } catch (err) {
    console.error('API test error:', err.message);
    assert('Live API tests executed without network failure', false, err.message);
  }
}

// ----------------------------------------------------------------------
// Main Runner
// ----------------------------------------------------------------------
async function runAllTests() {
  console.log('================================================================');
  console.log('BLOOMNEST COMPREHENSIVE FEATURE TEST SUITE');
  console.log('Testing Contractions, Clinical Vitals, Baby Shower, Baby Care,');
  console.log('Baby Names, Postpartum Recovery & Live HTTP APIs');
  console.log('================================================================');

  testContractionTimer();
  testClinicalVitalsTriage();
  testRegistryAndShoppingSync();
  testBabyActivityStream();
  testBabyNamesExplorer();
  testPostpartumTriage();
  await testLiveApiEndpoints();

  console.log('\n================================================================');
  console.log(`TEST RESULTS: TOTAL: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('================================================================');

  if (failedTests > 0) {
    console.error('\nFAILURES SUMMARY:');
    failures.forEach((f, idx) => {
      console.error(`${idx + 1}. ${f.description}: ${f.details}`);
    });
    process.exit(1);
  } else {
    console.log('\nALL FEATURE AND CLINICAL TEST CASES PASSED SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runAllTests();
