"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  parseProlificParams,
  parseExperimentOverride,
  pickRandomExperiment,
  pickRandomRole,
  devProlificParams,
  IS_DEV,
} from "@/lib/prolific";
import { getExperimentConfig, EXPERIMENTS, ALL_EXPERIMENT_SLUGS } from "@/lib/experiments";
import type { ExperimentSlug, ParticipantRole, ProlificParams } from "@/lib/types";
import styles from "./page.module.css";

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error" | "dev_portal" | "launching">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Development portal state variables
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentSlug>("trust-game");
  const [selectedRole, setSelectedRole] = useState<ParticipantRole>("A");
  const [prolificPid, setProlificPid] = useState("");
  const [studyId, setStudyId] = useState("");
  const [sessionId, setSessionId] = useState("");

  // Core launch function
  async function launch(slug: ExperimentSlug, role: ParticipantRole, prolific: ProlificParams) {
    setStatus("launching");
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prolificPid: prolific.prolificPid,
          studyId: prolific.studyId,
          prolificSessionId: prolific.sessionId,
          experimentSlug: slug,
          role,
        }),
      });

      if (!res.ok) throw new Error("Failed to create session");
      const { session } = await res.json();

      router.replace(
        `/experiment/${slug}?sessionId=${session.id}&role=${role}`
      );
    } catch (err) {
      console.error(err);
      setErrorMsg("There was a problem starting the study. Please try refreshing, or contact the research team.");
      setStatus("error");
    }
  }

  // Effect to load initial parameters and either auto-launch (production) or show portal (development)
  useEffect(() => {
    async function init() {
      // 1. Parse Prolific params (or use dev fallback)
      let prolific: ProlificParams | null = parseProlificParams(searchParams);
      if (!prolific) {
        if (IS_DEV) {
          prolific = devProlificParams();
        } else {
          setErrorMsg("Missing study parameters. Please access this study through Prolific.");
          setStatus("error");
          return;
        }
      }

      // 2. Determine experiment and role overrides from search parameters
      const { experiment: expOverride, role: roleOverride } = parseExperimentOverride(searchParams);

      if (IS_DEV) {
        // Pre-populate interactive dev portal states
        const initialExp = expOverride ?? "trust-game";
        const config = getExperimentConfig(initialExp);
        const availableRoles = config.roles.map((r) => r.role);
        const initialRole = roleOverride ?? availableRoles[0] ?? "A";

        setSelectedExperiment(initialExp);
        setSelectedRole(initialRole);
        setProlificPid(prolific.prolificPid);
        setStudyId(prolific.studyId);
        setSessionId(prolific.sessionId);
        setStatus("dev_portal");
      } else {
        // Production: auto-launch directly
        const experimentSlug: ExperimentSlug = expOverride ?? pickRandomExperiment();
        const config = getExperimentConfig(experimentSlug);
        const availableRoles = config.roles.map((r) => r.role);
        const role: ParticipantRole = roleOverride ?? pickRandomRole(availableRoles);

        await launch(experimentSlug, role, prolific);
      }
    }

    init();
  }, [router, searchParams]);

  // Keep selectedRole valid when selectedExperiment changes
  useEffect(() => {
    if (selectedExperiment) {
      try {
        const config = getExperimentConfig(selectedExperiment);
        const availableRoles = config.roles.map((r) => r.role);
        if (!availableRoles.includes(selectedRole)) {
          setSelectedRole(availableRoles[0] ?? "A");
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [selectedExperiment, selectedRole]);

  const handleLaunch = () => {
    launch(selectedExperiment, selectedRole, {
      prolificPid,
      studyId,
      sessionId,
    });
  };

  if (status === "error") {
    return (
      <div className={styles.center}>
        <div className={styles.card}>
          <h1>Unable to Start Study</h1>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (status === "loading" || status === "launching") {
    return (
      <div className={styles.center}>
        <div className={styles.card}>
          <p className={styles.loadingText}>
            {status === "launching" ? "Setting up your study session…" : "Loading study environment…"}
          </p>
        </div>
      </div>
    );
  }

  // Render Development Portal
  return (
    <div className={styles.center}>
      <div className={styles.portalCard}>
        <div className={styles.portalHeader}>
          <div className={styles.portalTitleGroup}>
            <h1>Promise Experiment</h1>
            <span className={styles.badge}>Dev Mode</span>
          </div>
        </div>
        
        <p className={styles.portalDescription}>
          Welcome to the sandbox interface. Select an experiment scenario and participant role to begin testing the flow.
        </p>

        {/* 1. Experiment Cards Grid */}
        <div className={styles.sectionTitle}>
          <span>1. Select Experiment</span>
        </div>
        <div className={styles.experimentGrid}>
          {ALL_EXPERIMENT_SLUGS.map((slug) => {
            const exp = EXPERIMENTS[slug];
            const isActive = selectedExperiment === slug;
            return (
              <div
                key={slug}
                className={`${styles.experimentCard} ${isActive ? styles.experimentCardActive : ""}`}
                onClick={() => setSelectedExperiment(slug)}
              >
                <div>
                  <div className={styles.experimentName}>{exp.name}</div>
                  <div className={styles.experimentDesc}>{exp.shortDescription}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Role Selector Tabs */}
        <div className={styles.roleSection}>
          <div className={styles.sectionTitle}>
            <span>2. Choose Role</span>
          </div>
          <div className={styles.roleGrid}>
            {EXPERIMENTS[selectedExperiment]?.roles.map((r) => {
              const isActive = selectedRole === r.role;
              return (
                <div
                  key={r.role}
                  className={`${styles.roleCard} ${isActive ? styles.roleCardActive : ""}`}
                  onClick={() => setSelectedRole(r.role)}
                >
                  <div className={styles.roleLabel}>{r.label}</div>
                  <div className={styles.roleSub}>Role {r.role}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Editable Prolific Parameters */}
        <div className={styles.prolificSection}>
          <div className={styles.sectionTitle}>
            <span>3. Prolific Parameters (Mock)</span>
          </div>
          <div className={styles.prolificGrid}>
            <div className={styles.prolificField}>
              <label>Participant ID</label>
              <input
                type="text"
                value={prolificPid}
                onChange={(e) => setProlificPid(e.target.value)}
              />
            </div>
            <div className={styles.prolificField}>
              <label>Study ID</label>
              <input
                type="text"
                value={studyId}
                onChange={(e) => setStudyId(e.target.value)}
              />
            </div>
            <div className={styles.prolificField}>
              <label>Session ID</label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className={styles.actionRow}>
          <button
            className={styles.launchBtn}
            onClick={handleLaunch}
          >
            Launch Experiment →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p>Loading…</p>
      </div>
    }>
      <LandingContent />
    </Suspense>
  );
}
