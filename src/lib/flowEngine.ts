import type { ExperimentSlug, ParticipantRole, FlowStep } from "./types";
import { SHOW_COMMUNITY_FEEDBACK } from "./experiments";

// ── Flow step sequences per experiment + role ─────────────────────────────────
// Each entry is an ordered array of FlowStep values.
// The ExperimentRunner advances through these in order.

type FlowKey = `${ExperimentSlug}:${ParticipantRole}`;

const BASE_PROPOSER_STEPS: FlowStep[] = [
  "consent",
  "instructions",
  "attention-check",
  "compose-message",
  "make-offer",
  ...(SHOW_COMMUNITY_FEEDBACK ? (["view-community-feedback", "revise-offer"] as FlowStep[]) : []),
  "outcome",
  "survey",
  "complete",
];

const BASE_RESPONDER_STEPS: FlowStep[] = [
  "consent",
  "instructions",
  "attention-check",
  "view-message",
  ...(SHOW_COMMUNITY_FEEDBACK ? (["view-community-feedback"] as FlowStep[]) : []),
  "make-decision",
  "outcome",
  "survey",
  "complete",
];

const BASE_COMMUNITY_STEPS: FlowStep[] = [
  "consent",
  "instructions",
  "attention-check",
  "judge-messages",
  "survey",
  "complete",
];

const TRUST_A_STEPS: FlowStep[] = [
  "consent",
  "instructions",
  "attention-check",
  "view-message", // B sends a message first; A reads it
  ...(SHOW_COMMUNITY_FEEDBACK ? (["view-community-feedback"] as FlowStep[]) : []),
  "make-offer", // A decides IN or OUT
  "outcome",
  "survey",
  "complete",
];

const TRUST_B_STEPS: FlowStep[] = [
  "consent",
  "instructions",
  "attention-check",
  "compose-message", // B writes message to A before A decides
  "make-decision", // B decides ROLL or DON'T ROLL (after A chose IN)
  "outcome",
  "survey",
  "complete",
];

const FLOW_MAP: Record<FlowKey, FlowStep[]> = {
  "trust-game:A": TRUST_A_STEPS,
  "trust-game:B": TRUST_B_STEPS,
  "trust-game:C": BASE_COMMUNITY_STEPS,

  "ultimatum-game:A": BASE_PROPOSER_STEPS,
  "ultimatum-game:B": BASE_RESPONDER_STEPS,
  "ultimatum-game:C": BASE_COMMUNITY_STEPS,

  "power-to-take-game:A": [
    "consent",
    "instructions",
    "attention-check",
    "make-offer", // set take rate
    ...(SHOW_COMMUNITY_FEEDBACK ? (["view-community-feedback", "revise-offer"] as FlowStep[]) : []),
    "outcome",
    "survey",
    "complete",
  ],
  "power-to-take-game:B": [
    "consent",
    "instructions",
    "attention-check",
    ...(SHOW_COMMUNITY_FEEDBACK ? (["view-community-feedback"] as FlowStep[]) : []),
    "make-decision", // set destroy rate
    "outcome",
    "survey",
    "complete",
  ],
  "power-to-take-game:C": BASE_COMMUNITY_STEPS,

  "third-party-punishment:A": [
    "consent",
    "instructions",
    "attention-check",
    "make-offer", // set punishment rate
    ...(SHOW_COMMUNITY_FEEDBACK ? (["view-community-feedback", "revise-offer"] as FlowStep[]) : []),
    "outcome",
    "survey",
    "complete",
  ],
  // Third-party punishment has no Group B (only punisher + community)
  "third-party-punishment:B": [],
  "third-party-punishment:C": BASE_COMMUNITY_STEPS,

  // Public Goods Game — role A is Contributor, no role B, role C is Community Evaluator
  "public-goods-game:A": [
    "consent",
    "instructions",
    "attention-check",
    "make-offer", // set contribution rate
    ...(SHOW_COMMUNITY_FEEDBACK ? (["view-community-feedback", "revise-offer"] as FlowStep[]) : []),
    "outcome",
    "survey",
    "complete",
  ],
  "public-goods-game:B": [], // unused
  "public-goods-game:C": BASE_COMMUNITY_STEPS,
};

// ── Public API ────────────────────────────────────────────────────────────────

export function getFlowSteps(
  experiment: ExperimentSlug,
  role: ParticipantRole
): FlowStep[] {
  const key: FlowKey = `${experiment}:${role}`;
  return FLOW_MAP[key] ?? [];
}

export function getNextStep(
  experiment: ExperimentSlug,
  role: ParticipantRole,
  currentStep: FlowStep
): FlowStep | null {
  const steps = getFlowSteps(experiment, role);
  const idx = steps.indexOf(currentStep);
  if (idx === -1 || idx === steps.length - 1) return null;
  return steps[idx + 1];
}

export function getPreviousStep(
  experiment: ExperimentSlug,
  role: ParticipantRole,
  currentStep: FlowStep
): FlowStep | null {
  const steps = getFlowSteps(experiment, role);
  const idx = steps.indexOf(currentStep);
  if (idx <= 0) return null;
  return steps[idx - 1];
}

export function getStepProgress(
  experiment: ExperimentSlug,
  role: ParticipantRole,
  currentStep: FlowStep
): { current: number; total: number } {
  const steps = getFlowSteps(experiment, role);
  const idx = steps.indexOf(currentStep);
  return { current: idx + 1, total: steps.length };
}
