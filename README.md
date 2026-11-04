# GarbaKosh / BloomNest 🌸
> **Every heartbeat, every milestone, every moment — together.**

GarbaKosh (BloomNest) is a comprehensive, modern, AI-powered pregnancy and parenthood web platform designed for expecting mothers, supportive partners, and growing families. Built with Next.js 14, TypeScript, and Tailwind CSS.

---

## 🌟 Key Features

### 1. 🛡️ Sanctuary Authentication & Zero Data Leakage
- **Pre-Dashboard Auth Gate**: Dashboard access is securely gated by role-aware authentication.
- **Unique Security Codes**:
  - **Mothers**: Unique code format `MAMA-xxxx` (e.g. `MAMA-2026`).
  - **Partners**: Unique code format `PAPA-xxxx` (e.g. `PAPA-7140`, `PAPA-9921`).
- **Complete Data Isolation**:
  - Unpaired partners cannot access maternal ultrasound images, clinical vitals, or medical records without explicit mother code verification.
  - Interactive pairing and unlinking workflow in the Partner Sanctuary.
  - Granular privacy permissions controlled by the mother.

### 2. 🗓️ 40-Week Interactive Gestational Journey
- Complete week-by-week (Week 1 to Week 40) visual timeline.
- 9 monthly developmental stages with real medical guidance.
- Baby size fruit & vegetable comparisons with interactive 3D/visual cards.
- Fetal milestones, maternal physical changes, and clinical red flags.

### 3. 🤖 Bloom AI Clinical & Emotional Assistant
- Conversational pregnancy, labor, newborn care, and postpartum guidance.
- Trimester-aware context and personalized answers.
- Clinical red-flag emergency protocols and triage warnings (112 / 911 dispatch alerts).
- Multi-language support: English, Kannada (ಕನ್ನಡ), Hindi (हिंदी), Tamil (தமிழ்), Telugu, and Malayalam.

### 4. ⏱️ Labor Surge Contraction Timer & 5-1-1 Rule
- High-precision contraction timing with duration and interval calculation.
- Automated **5-1-1 Rule Hospital Departure Protocol**: alerts parents when contractions are 5 minutes apart, lasting 1 minute, for at least 1 hour.

### 5. 📜 Clinical Birth Plan Builder
- Customizable birth preferences: environment, companions, pain management, delivery positions, and newborn care.
- One-click print / clinical PDF export for doctor review.

### 6. 🥗 Real Clinical Nutrition & Craving Tracker
- Backed by real USDA / ICMR maternal dietary guidelines (calories, protein, calcium, iron, folate, vitamin D).
- Daily meal logging with macro breakdown and trimester targets.
- Daily hydration glass counter.
- Pregnancy craving logger with **Pica detection** (flags chalk, soil, clay consumption with medical alerts).

### 7. 🧘 Prenatal Fitness & Pelvic Floor Kegels
- Trimester-safe exercise routines: prenatal yoga, pelvic tilts, walking, and guided Kegel exercises.
- Safety precautions and completion check-offs.

### 8. ☀️ Mood & Emotional Wellness Tracker
- Daily mood check-in (Calm, Joyful, Sensitive, Fatigued, Anxious).
- Stress and anxiety scale tracking with emotional journaling.
- Positive affirmations and clinical support recommendations.

### 9. 🎧 Sleep Center & Relaxing Soundscapes
- Built-in multi-track ambient sound generator using the Web Audio API.
- Calming rain, ocean waves, forest ambiance, white noise, and gentle lullabies with independent volume sliders.

### 10. 🖼️ Ultrasound & Little Moments Vault
- Chronological ultrasound scan and memory document vault.
- Gestational week tag, caption, and medical notes.
- Private storage disclaimer highlighting professional medical interpretation.

### 11. 🤝 Partner Sanctuary & Caregiver Missions
- Trimester-adaptive caregiver missions (e.g. morning sickness relief, second-trimester bonding, third-trimester labor prep).
- Shared baby name shortlist and collaborative voting.
- Hospital bag checklist with categorized bags for mother, baby, and partner.

### 12. 🍼 Fourth Trimester & Newborn Care
- Postpartum physical and emotional recovery logger (pain scale, lochia flow, sleep, hydration).
- Newborn activity tracker: breastfeeding intervals, swaddled sleep, wet diapers, and developmental milestones.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, custom design tokens, modern glassmorphism
- **Icons**: Lucide React
- **Audio Engine**: HTML5 Web Audio API synthesizer
- **State & Storage**: React Context + LocalStorage persistence (zero server setup needed)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ or Node.js 20+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/siddharthr21/GarbaKosh.git
cd GarbaKosh
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## 👥 Demo Evaluation Accounts

On the login screen, click **1-Click Evaluation Profiles** to test:
1. **Siri Rao** (`siri@bloomnest.com`) — *Expecting Mother* (Code: `MAMA-2026`)
2. **Rohan Rao** (`rohan@bloomnest.com`) — *Paired Partner* (Code: `PAPA-7140`, linked to `MAMA-2026`)
3. **Arjun Mehta** (`arjun@bloomnest.com`) — *Unpaired Partner* (Code: `PAPA-9921`, shows zero-data-leakage isolation)

---

## 📄 Medical Disclaimer

GarbaKosh is an educational, supportive, and organizational companion. It is **not** a substitute for direct medical diagnosis, advice, or treatment from qualified obstetricians, gynecologists, or pediatricians. In the event of bleeding, acute abdominal pain, or sudden signs of complications, seek immediate emergency medical care.

---

## 📜 License
MIT License. Created with ❤️ for mothers, partners, and growing families.
