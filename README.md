# Promise Experiment Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)

An interactive, web-based behavioral economics platform designed to investigate how rational beliefs about others' expectations drive coordination in strategic interactions. 

This platform replicates classic behavioral economics experiments with key manipulations (such as community assessments, message passing, and optional decision revisions) to evaluate the role of community expectations on individuals' rational choice.

---

## Supported Experiments

The platform currently includes interactive variants of the following behavioral games:

*   **[Ultimatum / Dictator Game](docs/experiments/ultimatum-game.md)**: Proposers divide resources; Responders can accept or reject the proposal (Ultimatum) or must accept it (Dictator).
*   **[Trust Game](docs/experiments/trust-game.md)**: Trustors decide how much to invest, which is multiplied; Trustees decide how much of the returns to send back.
*   **[Power to Take Game](docs/experiments/power-to-take-game.md)**: One player can take resources from another; the other player can respond by destroying resources in retaliation.
*   **[Third-Party Punishment Game](docs/experiments/third-party-punishment.md)**: A classic game where an unaffected third party can pay a cost to punish unfair behavior between two players.
*   **[Public Goods Game](docs/experiments/public-goods-game.md)**: Multiple participants contribute to a common pool, which is multiplied and distributed equally.

Each experiment is fully documented in `docs/experiments/` with experimental designs, participant roles, and game-specific rules.

---

## Platform Architecture & Experiment Flow

The application is built around a unified, modular **Experiment Runner** state machine ([ExperimentRunner.tsx](src/components/ExperimentRunner.tsx)) that guides participants through consecutive stages:

1.  **Consent Form & Onboarding**: Digital consent and setup details ([ConsentForm.tsx](src/components/ConsentForm.tsx)).
2.  **Instructions & Attention Checks**: Guided training screens with custom validation questions to ensure comprehension ([InstructionScreen.tsx](src/components/InstructionScreen.tsx), [AttentionCheck.tsx](src/components/AttentionCheck.tsx)).
3.  **Active Role Decision Phases**:
    *   **Proposer**: Sends optional free-form messages (promises) to partner, proposes action, receives community feedback, and potentially revises decisions.
    *   **Responder / Trustor**: Views proposal or message from partner, and chooses how to act.
    *   **Community Assessment**: Reads other participants' decisions/messages and evaluates if they constitute promises or represent fair actions ([PromiseJudgment.tsx](src/components/PromiseJudgment.tsx), [FairnessJudgment.tsx](src/components/FairnessJudgment.tsx)).
4.  **Trial Outcome / Feedback**: Visual summary showing choices, partner outcomes, and points/bonus calculations ([TrialOutcome.tsx](src/components/TrialOutcome.tsx)).
5.  **Post-Experiment Surveys**: Modular post-game feedback and demographic questionnaires ([SurveyForm.tsx](src/components/SurveyForm.tsx)).

### Pairing Mechanics
By default, the platform supports **asynchronous pairing** ([route.ts](src/app/api/pairing/route.ts)). Senders/Proposers complete trials first and their data is persisted in Firestore. Later, Responders/Community assessors are matched to these records automatically.

---

## Tech Stack

*   **Frontend**: Next.js 15 (App Router, React 19, TypeScript)
*   **Styling**: Vanilla CSS (Scoped CSS Modules)
*   **Database & Auth**: Cloud Firestore & Firebase SDK (Firebase Admin SDK for API route pairing)

---

## Repository Structure

```text
├── docs/                  # Detailed documentation & guidelines
│   └── experiments/       # Individual economic game designs
├── src/
│   ├── app/               # Next.js App Router routes & API endpoints
│   ├── components/        # Interactive React UI components & games
│   ├── context/           # Global experiment state provider
│   └── lib/               # Firestore, helper functions, and flow engines
└── README.md              # Project overview
```

---

## Getting Started

### Prerequisites
*   Node.js (v18.x or later)
*   Firebase Project (with Firestore enabled)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rgelpi/promise-experiment.git
   cd promise-experiment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root of the project with the following Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
   FIREBASE_PRIVATE_KEY=your_firebase_admin_private_key
   ```

### Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform locally.

### Building for Production
```bash
npm run build
npm run start
```