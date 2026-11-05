/**
 * Test Suite: Auth & Login Scenarios for Mother & Partner
 * Verifies email and security code authentication, case insensitivity,
 * 1-click evaluation personas, and pairing during registration.
 */

const INITIAL_ACCOUNTS = [
  {
    id: 'usr_mother_siri',
    name: 'Siri Rao',
    email: 'siri@bloomnest.com',
    role: 'mother',
    uniqueCode: 'MAMA-2026',
    partnerLinkedCode: 'PAPA-7140',
    isPaired: true,
    profile: {
      id: 'usr_mother_siri',
      name: 'Siri Rao',
      email: 'siri@bloomnest.com',
      role: 'mother',
      currentGestationalWeek: 24,
      estimatedDueDate: '2027-02-16',
      babyNickname: 'Little Bean',
      partnerProfile: {
        name: 'Rohan Rao',
        email: 'rohan@bloomnest.com',
        relationship: 'Husband & Supportive Partner',
        phone: '+91 98450 67890',
        pairingCode: 'MAMA-2026',
        isConnected: true
      }
    }
  },
  {
    id: 'usr_partner_rohan',
    name: 'Rohan Rao',
    email: 'rohan@bloomnest.com',
    role: 'partner',
    uniqueCode: 'PAPA-7140',
    partnerLinkedCode: 'MAMA-2026',
    isPaired: true,
    profile: {
      id: 'usr_partner_rohan',
      name: 'Rohan Rao',
      email: 'rohan@bloomnest.com',
      role: 'partner',
      currentGestationalWeek: 24,
      partnerProfile: {
        name: 'Siri Rao',
        email: 'siri@bloomnest.com',
        relationship: 'Expecting Mother',
        phone: '',
        pairingCode: 'MAMA-2026',
        isConnected: true
      }
    }
  },
  {
    id: 'usr_mother_priya',
    name: 'Priya Nair',
    email: 'priya@bloomnest.com',
    role: 'mother',
    uniqueCode: 'MAMA-4819',
    isPaired: false,
    profile: {
      id: 'usr_mother_priya',
      name: 'Priya Nair',
      email: 'priya@bloomnest.com',
      role: 'mother',
      currentGestationalWeek: 20,
      partnerProfile: {
        name: '',
        email: '',
        relationship: 'Partner',
        phone: '',
        pairingCode: 'MAMA-4819',
        isConnected: false
      }
    }
  },
  {
    id: 'usr_partner_arjun',
    name: 'Arjun Mehta',
    email: 'arjun@bloomnest.com',
    role: 'partner',
    uniqueCode: 'PAPA-9921',
    isPaired: false,
    profile: {
      id: 'usr_partner_arjun',
      name: 'Arjun Mehta',
      email: 'arjun@bloomnest.com',
      role: 'partner',
      currentGestationalWeek: 0,
      partnerProfile: {
        name: '',
        email: '',
        relationship: 'Partner',
        phone: '',
        pairingCode: 'PAPA-9921',
        isConnected: false
      }
    }
  }
];

function createAuthContextMock() {
  let allAccounts = [...INITIAL_ACCOUNTS];
  let currentUser = null;
  let isAuthenticated = false;
  let activeRole = 'mother';

  function login(emailOrCode, password) {
    if (!emailOrCode || !emailOrCode.trim()) return false;
    const clean = emailOrCode.trim().toLowerCase();
    const cleanCode = emailOrCode.trim().toUpperCase();

    const found = allAccounts.find(
      a => a.email.toLowerCase() === clean || (a.uniqueCode && a.uniqueCode.toUpperCase() === cleanCode)
    );
    if (!found) return false;

    let targetProfile = found.profile;
    if (found.role === 'partner' && found.partnerLinkedCode) {
      const linkedMother = allAccounts.find(
        a => a.role === 'mother' && a.uniqueCode.toUpperCase() === found.partnerLinkedCode?.toUpperCase()
      );
      if (linkedMother) {
        targetProfile = {
          ...targetProfile,
          currentGestationalWeek: linkedMother.profile.currentGestationalWeek,
          estimatedDueDate: linkedMother.profile.estimatedDueDate,
          babyNickname: linkedMother.profile.babyNickname,
          partnerProfile: {
            relationship: 'Expecting Mother',
            phone: '',
            ...(targetProfile.partnerProfile || {}),
            name: linkedMother.name,
            email: linkedMother.email,
            pairingCode: linkedMother.uniqueCode,
            isConnected: true
          }
        };
      }
    }

    const updatedFound = {
      ...found,
      profile: targetProfile
    };

    currentUser = updatedFound;
    isAuthenticated = true;
    activeRole = updatedFound.role;
    return true;
  }

  function logout() {
    currentUser = null;
    isAuthenticated = false;
  }

  function register(data) {
    if (allAccounts.some(a => a.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    if (data.role === 'mother') {
      const uniqueCode = `MAMA-${Math.floor(1000 + Math.random() * 9000)}`;
      const newMotherAccount = {
        id: `usr_mother_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'mother',
        uniqueCode,
        isPaired: false,
        profile: {
          id: `usr_mother_${Date.now()}`,
          name: data.name,
          email: data.email,
          role: 'mother',
          currentGestationalWeek: data.gestationalWeek || 24,
          partnerProfile: {
            name: '',
            email: '',
            relationship: 'Partner',
            phone: '',
            pairingCode: uniqueCode,
            isConnected: false
          }
        }
      };
      allAccounts.push(newMotherAccount);
      currentUser = newMotherAccount;
      isAuthenticated = true;
      activeRole = 'mother';
      return { success: true, account: newMotherAccount };
    } else {
      const uniqueCode = `PAPA-${Math.floor(1000 + Math.random() * 9000)}`;
      let isPaired = false;
      let targetMother = undefined;

      if (data.motherPairingCode) {
        const cleanInput = data.motherPairingCode.trim().toUpperCase();
        const cleanEmail = data.motherPairingCode.trim().toLowerCase();
        targetMother = allAccounts.find(
          a => a.role === 'mother' && (a.uniqueCode.toUpperCase() === cleanInput || a.email.toLowerCase() === cleanEmail)
        );

        if (!targetMother) {
          return { success: false, message: 'Mother pairing code or email not found.' };
        }

        if (targetMother.isPaired) {
          return { success: false, message: 'Mother is already paired.' };
        }

        isPaired = true;
      }

      const newPartnerAccount = {
        id: `usr_partner_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'partner',
        uniqueCode,
        partnerLinkedCode: targetMother ? targetMother.uniqueCode : undefined,
        isPaired,
        profile: {
          id: `usr_partner_${Date.now()}`,
          name: data.name,
          email: data.email,
          role: 'partner',
          currentGestationalWeek: targetMother ? targetMother.profile.currentGestationalWeek : 0,
          partnerProfile: {
            name: targetMother ? targetMother.name : '',
            email: targetMother ? targetMother.email : '',
            relationship: data.relationship || 'Partner',
            phone: '',
            pairingCode: targetMother ? targetMother.uniqueCode : uniqueCode,
            isConnected: isPaired
          }
        }
      };

      if (targetMother && isPaired) {
        targetMother.isPaired = true;
        targetMother.partnerLinkedCode = uniqueCode;
      }

      allAccounts.push(newPartnerAccount);
      currentUser = newPartnerAccount;
      isAuthenticated = true;
      activeRole = 'partner';
      return { success: true, account: newPartnerAccount };
    }
  }

  return {
    login,
    logout,
    register,
    getCurrentUser: () => currentUser,
    getIsAuthenticated: () => isAuthenticated,
    getActiveRole: () => activeRole,
    getAllAccounts: () => allAccounts
  };
}

let passed = 0;
let total = 0;

function assert(description, condition) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ ${description}`);
  } else {
    console.error(`  ✗ FAIL: ${description}`);
  }
}

console.log('=== TEST SUITE: AUTH & LOGIN WORKFLOWS ===\n');

const ctx = createAuthContextMock();

// Test 1: Siri login with email
assert('Siri login via email succeeds', ctx.login('siri@bloomnest.com') === true);
assert('Current user is Siri Rao', ctx.getCurrentUser()?.name === 'Siri Rao');
assert('Current user role is mother', ctx.getActiveRole() === 'mother');
assert('Is authenticated is true', ctx.getIsAuthenticated() === true);
ctx.logout();
assert('Logout clears session', ctx.getIsAuthenticated() === false && ctx.getCurrentUser() === null);

// Test 2: Siri login with unique security code
assert('Siri login via code MAMA-2026 succeeds', ctx.login('MAMA-2026') === true);
assert('Current user is Siri Rao via code', ctx.getCurrentUser()?.name === 'Siri Rao');
ctx.logout();

// Test 3: Case-insensitive login
assert('Siri login with lowercase mama-2026 succeeds', ctx.login('mama-2026') === true);
ctx.logout();
assert('Siri login with uppercase SIRI@BLOOMNEST.COM succeeds', ctx.login('SIRI@BLOOMNEST.COM') === true);
ctx.logout();

// Test 4: Rohan login via email
assert('Rohan login via email succeeds', ctx.login('rohan@bloomnest.com') === true);
assert('Current user is Rohan Rao', ctx.getCurrentUser()?.name === 'Rohan Rao');
assert('Role is partner', ctx.getActiveRole() === 'partner');
assert('Partner sees linked mother details', ctx.getCurrentUser()?.profile.partnerProfile.isConnected === true);
assert('Partner sees Week 24 from Siri', ctx.getCurrentUser()?.profile.currentGestationalWeek === 24);
ctx.logout();

// Test 5: Rohan login via security code
assert('Rohan login via code PAPA-7140 succeeds', ctx.login('PAPA-7140') === true);
assert('Current user is Rohan via code', ctx.getCurrentUser()?.name === 'Rohan Rao');
ctx.logout();

// Test 6: Priya Nair (Unpaired Mother) login
assert('Priya login via email succeeds', ctx.login('priya@bloomnest.com') === true);
assert('Priya is mother', ctx.getActiveRole() === 'mother');
assert('Priya is unpaired', ctx.getCurrentUser()?.isPaired === false);
assert('Priya code is MAMA-4819', ctx.getCurrentUser()?.uniqueCode === 'MAMA-4819');
ctx.logout();
assert('Priya login via code MAMA-4819 succeeds', ctx.login('MAMA-4819') === true);
ctx.logout();

// Test 7: Arjun Mehta (Unpaired Partner) login
assert('Arjun login via email succeeds', ctx.login('arjun@bloomnest.com') === true);
assert('Arjun is partner', ctx.getActiveRole() === 'partner');
assert('Arjun is unpaired', ctx.getCurrentUser()?.isPaired === false);
assert('Arjun code is PAPA-9921', ctx.getCurrentUser()?.uniqueCode === 'PAPA-9921');
ctx.logout();
assert('Arjun login via code PAPA-9921 succeeds', ctx.login('PAPA-9921') === true);
ctx.logout();

// Test 8: Invalid credentials
assert('Non-existent email returns false', ctx.login('fake@unknown.com') === false);
assert('Non-existent code returns false', ctx.login('MAMA-0000') === false);
assert('Empty string returns false', ctx.login('') === false);
assert('Session is still not authenticated', ctx.getIsAuthenticated() === false);

// Test 9: Register partner with mother email directly
const regWithEmail = ctx.register({
  name: 'Dev Nair',
  email: 'dev@bloomnest.com',
  role: 'partner',
  motherPairingCode: 'priya@bloomnest.com' // Using email instead of code!
});
assert('Partner can register with mother email', regWithEmail.success === true);
assert('Partner is immediately paired with Priya', ctx.getCurrentUser()?.isPaired === true);
assert('Partner has Priya unique code linked', ctx.getCurrentUser()?.partnerLinkedCode === 'MAMA-4819');

// Test 10: Duplicate pairing prevention
const regDuplicate = ctx.register({
  name: 'Samir',
  email: 'samir@bloomnest.com',
  role: 'partner',
  motherPairingCode: 'MAMA-4819' // Priya is now paired!
});
assert('Cannot pair with already paired mother', regDuplicate.success === false);

console.log(`\nResults: ${passed} / ${total} tests passed.`);
if (passed === total) {
  console.log('🎉 ALL AUTH & LOGIN TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
