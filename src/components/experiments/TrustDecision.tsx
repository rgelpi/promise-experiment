"use client";

import { useState } from "react";
import styles from "./Decision.module.css";

interface TrustDecisionProps {
  role: "A" | "B";
  onSubmit: (decision: string) => void;
  // If role B, B needs to know what A decided, although here A always decided IN if B is deciding
}

export default function TrustDecision({ role, onSubmit }: TrustDecisionProps) {
  const [decision, setDecision] = useState<string | null>(null);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Decision</h2>
      {role === "A" ? (
        <>
          <p className={styles.description}>
            You have 7 points. You can keep them (OUT) or send them to your partner (IN).
          </p>
          <div className={styles.buttonGroup}>
            <button
              className={`btn ${decision === "OUT" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setDecision("OUT")}
            >
              OUT (Keep points)
            </button>
            <button
              className={`btn ${decision === "IN" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setDecision("IN")}
            >
              IN (Send points)
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={styles.description}>
            Person A chose IN (sent their points to you). You can choose to ROLL the die or DON'T ROLL.
          </p>
          <div className={styles.buttonGroup}>
            <button
              className={`btn ${decision === "DONT_ROLL" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setDecision("DONT_ROLL")}
            >
              DON'T ROLL (Keep all points)
            </button>
            <button
              className={`btn ${decision === "ROLL" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setDecision("ROLL")}
            >
              ROLL (Spend 4 points to roll)
            </button>
          </div>
        </>
      )}

      <button
        className="btn btn-primary"
        disabled={!decision}
        onClick={() => {
          if (decision) onSubmit(decision);
        }}
      >
        Confirm Decision
      </button>
    </div>
  );
}
