// ── Shared TypeScript Types ────────────────────────────────────────────────────

// ── Experiments ───────────────────────────────────────────────────────────────

export type ExperimentSlug =
  | "trust-game"
  | "ultimatum-game"
  | "power-to-take-game"
  | "third-party-punishment"
  | "public-goods-game";

export type ParticipantRole = "A" | "B" | "C";

export type ExperimentVariant = "ultimatum" | "dictator";

// ── Attention Check Questions ─────────────────────────────────────────────────

export type AttentionCheckQuestion = {
  id: string;
  text: string;
  type: "multiple-choice" | "true-false";
  options?: string[];
  correctAnswer: string; // index (for MC) or "true"/"false"
  maxAttempts: number;
};

export type AttentionCheckConfig = {
  preamble: string;
  questions: AttentionCheckQuestion[];
};

// ── Experiment Config ─────────────────────────────────────────────────────────

export type InstructionPage = {
  /** Markdown content for this page */
  content: string;
};

export type RoleConfig = {
  role: ParticipantRole;
  label: string; // e.g., "Trustor (Person A)"
  instructions: InstructionPage[];
  attentionChecks: AttentionCheckConfig;
};

export type ExperimentConfig = {
  id: ExperimentSlug;
  name: string;
  shortDescription: string;
  endowment: number; // in points
  pointsToUsd: number; // e.g., 0.50 = $0.50 per point
  roles: RoleConfig[];
  hasProposerMessage: boolean; // whether Group A/B sends a free-form message
  hasCommunityAssessment: boolean; // always true for platform; runtime flag controls display
  /** Ultimatum only: if false (default), Responder can accept/reject */
  isDictatorMode: boolean;
};

// ── Prolific ──────────────────────────────────────────────────────────────────

export type ProlificParams = {
  prolificPid: string;
  studyId: string;
  sessionId: string;
};

// ── Sessions ──────────────────────────────────────────────────────────────────

export type SessionStatus =
  | "created"
  | "consent"
  | "instructions"
  | "attention-check"
  | "task"
  | "survey"
  | "complete"
  | "abandoned";

export type Session = {
  id: string;
  prolificPid: string;
  studyId: string;
  prolificSessionId: string;
  experimentSlug: ExperimentSlug;
  role: ParticipantRole;
  variant?: ExperimentVariant;
  status: SessionStatus;
  currentStep: string;
  pairedWith?: string; // Session ID of the paired participant
  createdAt: Date;
  updatedAt: Date;
  responses?: Record<string, any>;
  survey?: Record<string, string | number>;
};

// ── Responses ─────────────────────────────────────────────────────────────────

export type ResponseStepName =
  | "consent"
  | "attention-check"
  | "message-composed"
  | "initial-offer"
  | "revised-offer"
  | "trust-decision"
  | "trustee-decision"
  | "take-rate"
  | "revised-take-rate"
  | "destroy-rate"
  | "punishment-rate"
  | "revised-punishment-rate"
  | "ultimatum-accept-reject"
  | "contribution-rate"
  | "revised-contribution-rate";

export type ExperimentResponse = {
  id: string;
  sessionId: string;
  experimentSlug: ExperimentSlug;
  role: ParticipantRole;
  stepName: ResponseStepName;
  data: Record<string, unknown>;
  createdAt: Date;
};

// ── Community Judgments ───────────────────────────────────────────────────────

export type JudgmentType = "promise" | "fairness" | "wrongness";

export type CommunityJudgment = {
  id: string;
  sessionId: string; // the Group C session making the judgment
  experimentSlug: ExperimentSlug;
  targetResponseId: string; // the Group A/B response being judged
  judgmentType: JudgmentType;
  /** Free-text reasoning FOR the judgment (e.g., "This is a promise because...") */
  reasonFor: string;
  /** Free-text reasoning AGAINST the judgment */
  reasonAgainst: string;
  /** Final binary judgment */
  judgment: boolean;
  createdAt: Date;
};

// Aggregated community assessment shown to proposers
export type CommunityAssessment = {
  targetResponseId: string;
  judgmentType: JudgmentType;
  totalJudgments: number;
  positiveCount: number;
  positiveRatio: number; // 0–1
};

// ── Survey ────────────────────────────────────────────────────────────────────

export type SurveyQuestionType =
  | "likert"
  | "multiple-choice"
  | "free-text"
  | "demographic-select";

export type SurveyQuestion = {
  id: string;
  text: string;
  type: SurveyQuestionType;
  options?: string[];
  required: boolean;
  scale?: { min: number; max: number; minLabel: string; maxLabel: string };
};

export type SurveyResponse = {
  id: string;
  sessionId: string;
  answers: Record<string, string | number>;
  createdAt: Date;
};

// ── Flow Engine ───────────────────────────────────────────────────────────────

export type FlowStep =
  | "landing"
  | "consent"
  | "instructions"
  | "attention-check"
  | "compose-message"
  | "view-message"
  | "make-offer"
  | "view-community-feedback"
  | "revise-offer"
  | "make-decision"
  | "judge-messages"
  | "outcome"
  | "survey"
  | "complete";

export type FlowConfig = {
  steps: FlowStep[];
};
