"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type {
  ExperimentSlug,
  ParticipantRole,
  ProlificParams,
  FlowStep,
  Session,
} from "@/lib/types";
import { getFlowSteps, getNextStep, getPreviousStep, getStepProgress } from "@/lib/flowEngine";

// ── Context shape ─────────────────────────────────────────────────────────────

interface ExperimentContextValue {
  // Identity
  prolificParams: ProlificParams | null;
  setProlificParams: (p: ProlificParams) => void;

  // Session / assignment
  session: Session | null;
  setSession: (s: Session) => void;
  experimentSlug: ExperimentSlug | null;
  role: ParticipantRole | null;

  // Flow navigation
  currentStep: FlowStep;
  steps: FlowStep[];
  progress: { current: number; total: number };
  goNext: () => void;
  goBack: () => void;
  goToStep: (step: FlowStep) => void;

  // Collected responses (keyed by step name)
  responses: Record<string, unknown>;
  saveResponse: (step: string, data: unknown) => void;
}

const ExperimentContext = createContext<ExperimentContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

interface ExperimentProviderProps {
  children: ReactNode;
  initialExperiment?: ExperimentSlug;
  initialRole?: ParticipantRole;
  initialStep?: FlowStep;
  initialSession?: Session;
}

export function ExperimentProvider({
  children,
  initialExperiment,
  initialRole,
  initialStep,
  initialSession,
}: ExperimentProviderProps) {
  const [prolificParams, setProlificParams] = useState<ProlificParams | null>(null);
  const [session, setSession] = useState<Session | null>(initialSession ?? null);
  const [experimentSlug] = useState<ExperimentSlug | null>(initialExperiment ?? null);
  const [role] = useState<ParticipantRole | null>(initialRole ?? null);
  const [responses, setResponses] = useState<Record<string, unknown>>(initialSession?.responses ?? {});

  const steps =
    experimentSlug && role ? getFlowSteps(experimentSlug, role) : [];

  const defaultStep: FlowStep = initialStep ?? steps[0] ?? "consent";
  const [currentStep, setCurrentStep] = useState<FlowStep>(defaultStep);

  const progress =
    experimentSlug && role
      ? getStepProgress(experimentSlug, role, currentStep)
      : { current: 0, total: 0 };

  const goNext = useCallback(() => {
    if (!experimentSlug || !role) return;
    const next = getNextStep(experimentSlug, role, currentStep);
    if (next) setCurrentStep(next);
  }, [experimentSlug, role, currentStep]);

  const goBack = useCallback(() => {
    if (!experimentSlug || !role) return;
    const prev = getPreviousStep(experimentSlug, role, currentStep);
    if (prev) setCurrentStep(prev);
  }, [experimentSlug, role, currentStep]);

  const goToStep = useCallback((step: FlowStep) => {
    setCurrentStep(step);
  }, []);

  const saveResponse = useCallback((step: string, data: unknown) => {
    setResponses((prev) => ({ ...prev, [step]: data }));
  }, []);

  return (
    <ExperimentContext.Provider
      value={{
        prolificParams,
        setProlificParams,
        session,
        setSession,
        experimentSlug,
        role,
        currentStep,
        steps,
        progress,
        goNext,
        goBack,
        goToStep,
        responses,
        saveResponse,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useExperiment(): ExperimentContextValue {
  const ctx = useContext(ExperimentContext);
  if (!ctx) {
    throw new Error("useExperiment must be used within an ExperimentProvider");
  }
  return ctx;
}
