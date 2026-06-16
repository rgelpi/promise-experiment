import type { ExperimentSlug, ParticipantRole, ProlificParams } from "./types";
import { ALL_EXPERIMENT_SLUGS } from "./experiments";

export function parseProlificParams(searchParams: URLSearchParams): ProlificParams | null {
  const prolificPid = searchParams.get("PROLIFIC_PID");
  const studyId = searchParams.get("STUDY_ID");
  const sessionId = searchParams.get("SESSION_ID");
  if (!prolificPid || !studyId || !sessionId) return null;
  return { prolificPid, studyId, sessionId };
}

export function parseExperimentOverride(searchParams: URLSearchParams): {
  experiment: ExperimentSlug | null;
  role: ParticipantRole | null;
} {
  const experimentParam = searchParams.get("experiment");
  const roleParam = searchParams.get("role");
  const experiment =
    experimentParam && ALL_EXPERIMENT_SLUGS.includes(experimentParam as ExperimentSlug)
      ? (experimentParam as ExperimentSlug)
      : null;
  const role =
    roleParam && ["A", "B", "C"].includes(roleParam)
      ? (roleParam as ParticipantRole)
      : null;
  return { experiment, role };
}

export function pickRandomExperiment(): ExperimentSlug {
  return ALL_EXPERIMENT_SLUGS[Math.floor(Math.random() * ALL_EXPERIMENT_SLUGS.length)];
}

export function pickRandomRole(availableRoles: ParticipantRole[]): ParticipantRole {
  return availableRoles[Math.floor(Math.random() * availableRoles.length)];
}

export function getProlificCompletionUrl(completionCode?: string): string {
  const code = completionCode ?? process.env.NEXT_PUBLIC_PROLIFIC_COMPLETION_CODE ?? "PLACEHOLDER";
  return `https://app.prolific.com/submissions/complete?cc=${code}`;
}

export function devProlificParams(): ProlificParams {
  return {
    prolificPid: "DEV_PID_" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    studyId: "DEV_STUDY",
    sessionId: "DEV_SESSION_" + Date.now(),
  };
}

export const IS_DEV = process.env.NODE_ENV === "development";
