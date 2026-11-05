# GarbaKosh / BloomNest 🌸
> **Every heartbeat, every milestone, every moment — together.**

GarbaKosh (BloomNest) is a comprehensive, clinically informed, AI-powered pregnancy and parenthood web platform designed for expecting mothers, supportive partners, and growing families. Built with Next.js 14, TypeScript, Tailwind CSS, and powered by ultra-fast Groq Cloud LPU AI inference.

---

## 🌟 Key Features

### 1. 🤖 Bloom AI Clinical & Emotional Assistant
- **Live Groq Cloud LPU Inference**: High-speed, context-aware obstetric intelligence powered by top-tier models (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`) with automated fallback to Google Gemini and offline clinical synthesis.
- **Multilingual Support**: Real-time understanding in English, Kannada (ಕನ್ನಡ), Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), and Malayalam (മലയാളം).
- **Culturally Attuned Guidance**: Incorporates Garbh Sanskar traditions, Ayurvedic rasayanas, classical ragas, and traditional home comforts alongside evidence-based obstetric protocols.
- **Clinical Emergency Triage**: Detects obstetric red flags (heavy bleeding, preeclampsia signs, reduced fetal movements, rupture of membranes, and perinatal crisis) and pops immediate emergency triage guidance.

### 2. 🛡️ Sanctuary Authentication & Mother-Partner Pairing
- **Pre-Dashboard Auth Gate**: Complete data isolation with permanent role immutability.
- **Unique Security Codes**:
  - **Mothers**: Unique code format `MAMA-xxxx` (e.g., `MAMA-2026`).
  - **Partners**: Unique code format `PAPA-xxxx` (e.g., `PAPA-7140`, `PAPA-9921`).
- **Zero Data Leakage**: Unpaired partners cannot access maternal ultrasound images, clinical vitals, or medical records without explicit mother code pairing.
- **Granular Sharing Controls**: Mother retains unilateral control over sharing permissions for vitals, mood, birth plan, ultrasound vault, and appointments.
- **Shared Dashboard Modal**: Allows paired partners to review permitted maternal updates in a dedicated, read-only view.

### 3. 🗓️ 40-Week Interactive Gestational Journey
- Complete week-by-week (Week 1 to Week 40) visual timeline.
- 9 monthly developmental stages with genuine obstetric guidance.
- Baby size comparisons with fruits, vegetables, and everyday objects.
- Fetal milestones, maternal anatomical changes, and trimester-specific clinical checks.

### 4. ⏱️ Labor Surge Contraction Timer & 5-1-1 Rule
- High-precision contraction timing with duration and decimal-accurate frequency calculations (e.g., 3.5 minutes apart).
- Automated **5-1-1 Clinical Hospital Departure Protocol**: alerts parents when surges are 5 minutes apart or less, lasting at least 60 seconds, across 3+ consecutive cycles.

### 5. 📜 Clinical Birth Plan & Hospital Bag Checklist
- Customizable birth preferences: delivery room ambiance, labor companions, pain management options, labor positions, and cord clamping preferences.
- Synchronized birth plan notes directly accessible from the hospital packing checklist.
- Categorized hospital bag checklist for Mother, Baby, and Partner with packing status indicators.
- One-click print & PDF review for obstetrician alignment.

### 6. 🥗 Clinical Nutrition & Craving Tracker
- Formulated around USDA and ICMR maternal dietary guidelines (calories, protein, calcium, iron, folate, vitamin D).
- Daily meal logging with macro breakdown and trimester nutritional targets.
- Hydration counter tracking daily fluid intake.
- Craving logger with **Pica detection** (flags clay, soil, chalk, or ice cravings for iron-deficiency anemia evaluation).

### 7. 🛍️ Baby Shopping & Baby Shower (Godh Bharai) Registry
- **Curated Baby Registry**: Indian baby brands and essentials with authentic pricing in Indian Rupees (`₹`).
- **Cross-Module Wishlist Sync**: Clicking "Add to Baby Registry" in Shopping directly syncs items into the Baby Shower gift wishlist.
- **1-Click Claiming**: Friends and family can claim wishlist items to avoid duplicate gifting.
- **Celebration Planner**: Guest RSVP manager, task checklist, and Indian Rupee (`₹`) budget tracker.

### 8. 👶 Baby Names Explorer & Couple Voting
- Rich dictionary spanning Sanskrit, Tamil, Hindi, Kannada, Telugu, Malayalam, and modern origins.
- Filter by gender, language/origin, and style (Modern & Trendy, Traditional Heritage, Sanskrit Classic, Royal).
- Couple voting system: Mother and Partner cast independent votes to reveal mutual matches.
- Custom name submission to add personal family choices into the shared dictionary.

### 9. 🧘 Prenatal Fitness, Pelvic Health & 4-7-8 Breathing
- Trimester-safe exercise library: prenatal yoga, pelvic floor Kegels, and restorative stretches.
- **Guided 4-7-8 Breathing Coach**: Interactive animated breathing sphere with timed cycles (Inhale 4s, Hold 7s, Exhale 8s) to manage labor anxiety.

### 10. ☀️ Emotional Wellness & Sleep Center
- Daily mood check-ins with emotional journaling and stress scales.
- Multi-track ambient sound generator using the HTML5 Web Audio API (Rain, Ocean Waves, Forest Ambiance, White Noise, Lullaby).

### 11. 📸 Little Moments & Ultrasound Vault
- Chronological scan, belly bump, and milestone memory vault.
- Direct device image uploads with client-side preview and file-size validation (< 8MB).

### 12. 🍼 Fourth Trimester & Newborn Care
- Postpartum physical recovery logger (lochia flow, perineal/incision healing, breastfeeding condition).
- Automated red flag alerts for postpartum hemorrhage and suspected mastitis.
- Newborn routine activity logger: breastfeeding, bottle feeding, sleep duration, and diaper logs with full deletion support.
- Pediatric care guide: Safe Sleep ABCs, newborn sneezing physiology, burping methods, and National Pediatric Immunization Roadmap.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, custom design tokens, modern glassmorphism
- **AI Engine**: Groq Cloud LPU (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`), Google Gemini API fallback
- **Icons**: Lucide React
- **Audio Engine**: HTML5 Web Audio API synthesizer
- **State & Storage**: React Context + LocalStorage persistence (zero database dependency required)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/siddharthr21/GarbaKosh.git
   cd GarbaKosh
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the project root:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
   *(Note: The app also operates with built-in clinical synthesis if no API key is provided).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## 🧪 Testing & Verification

The project includes automated verification test suites:

```bash
# 1. Comprehensive Feature & Clinical Logic Test Suite (29 test cases)
node scripts/test_all_features.js

# 2. Mother-Partner Security & Role Immutability Scenarios (12 test cases)
node scripts/test_pairing_scenarios.js

# 3. TypeScript Static Type Check
npx tsc --noEmit
```

All 41 test scenarios and TypeScript checks pass with **100% success rate**.

---

## 👥 Demo Evaluation Accounts

On the sign-in screen, click **1-Click Evaluation Profiles** to instantly test:
1. **Siri Rao** (`siri@bloomnest.com`) — *Expecting Mother* (Code: `MAMA-2026`, Paired)
2. **Rohan Rao** (`rohan@bloomnest.com`) — *Paired Partner* (Code: `PAPA-7140`, linked to `MAMA-2026`)
3. **Arjun Mehta** (`arjun@bloomnest.com`) — *Unpaired Partner* (Code: `PAPA-9921`, shows zero-data-leakage isolation)
4. **Priya Nair** (`priya@bloomnest.com`) — *Unpaired Mother* (Code: `MAMA-4819`)

---

## 📄 Medical Disclaimer

GarbaKosh is an educational, supportive, and organizational companion. It is **not** a substitute for direct medical diagnosis, advice, or treatment from qualified obstetricians, gynecologists, or pediatricians. In the event of bleeding, acute abdominal pain, or sudden signs of complications, seek immediate emergency medical care.

---

## 📜 License

MIT License. Created with ❤️ for mothers, partners, and growing families.
