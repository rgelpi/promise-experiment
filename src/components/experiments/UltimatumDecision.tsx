"use client";

import { useState } from "react";
import MoneySlider from "../MoneySlider";
import styles from "./Decision.module.css";

interface UltimatumDecisionProps {
  role: "A" | "B";
  endowment: number;
  isDictatorMode: boolean;
  proposerOffer?: number; // Needed for B
  onSubmit: (decision: any) => void;
}

export default function UltimatumDecision({
  role,
  endowment,
  isDictatorMode,
  proposerOffer,
  onSubmit,
}: UltimatumDecisionProps) {
  const [decision, setDecision] = useState<string | null>(null);

  if (role === "A") {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Your Proposal</h2>
        <p className={styles.description}>
          You have {endowment} points to divide between yourself and your partner.
        </p>
        <MoneySlider
          totalPoints={endowment}
          onSubmit={(pointsForB) => onSubmit({ offer: pointsForB })}
        />
      </div>
    );
  }

  // Role B
  if (proposerOffer === undefined) return null;

  if (isDictatorMode) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Division Details</h2>
        <p className={styles.description}>
          Person A has decided to divide the {endowment} points as follows:
          <br /><br />
          <strong>Person A keeps:</strong> {endowment - proposerOffer} points<br />
          <strong>You receive:</strong> {proposerOffer} points
        </p>
        <button
          className="btn btn-primary"
          onClick={() => onSubmit({ accepted: true, forced: true })}
        >
          Acknowledge and Continue
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Decision</h2>
      <p className={styles.description}>
        Person A proposes the following division of the {endowment} points:
        <br /><br />
        <strong>Person A keeps:</strong> {endowment - proposerOffer} points<br />
        <strong>You receive:</strong> {proposerOffer} points
        <br /><br />
        You can Accept this proposal, or Reject it. If you reject, both of you receive 0 points.
      </p>
      <div className={styles.buttonGroup}>
        <button
          className={`btn ${decision === "REJECT" ? "btn-danger" : "btn-secondary"}`}
          onClick={() => setDecision("REJECT")}
        >
          Reject Proposal
        </button>
        <button
          className={`btn ${decision === "ACCEPT" ? "btn-success" : "btn-secondary"}`}
          onClick={() => setDecision("ACCEPT")}
        >
          Accept Proposal
        </button>
      </div>

      <button
        className="btn btn-primary"
        disabled={!decision}
        onClick={() => {
          if (decision) onSubmit({ accepted: decision === "ACCEPT" });
        }}
      >
        Confirm Decision
      </button>
    </div>
  );
}
