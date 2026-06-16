"use client";

import { useState } from "react";
import styles from "./PromiseJudgment.module.css"; // Reuse the same styles

interface FairnessJudgmentProps {
  decisionDescription: string;
  itemIndex: number;
  totalItems: number;
  onSubmit: (result: { reasonFor: string; reasonAgainst: string; isFair: boolean }) => void;
}

export default function FairnessJudgment({
  decisionDescription,
  itemIndex,
  totalItems,
  onSubmit,
}: FairnessJudgmentProps) {
  const [reasonFor, setReasonFor] = useState("");
  const [reasonAgainst, setReasonAgainst] = useState("");
  const [judgment, setJudgment] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!reasonFor.trim()) { setError("Please provide a reason in favor of calling this fair."); return; }
    if (!reasonAgainst.trim()) { setError("Please provide a reason against calling this fair."); return; }
    if (judgment === null) { setError("Please make a final decision (Fair or Not Fair)."); return; }
    setError(null);
    onSubmit({ reasonFor: reasonFor.trim(), reasonAgainst: reasonAgainst.trim(), isFair: judgment });
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.counter}>Decision {itemIndex + 1} of {totalItems}</p>

      <div className={styles.messageBox}>
        <p className={styles.messageLabel}>Decision details:</p>
        <blockquote className={styles.message}>{decisionDescription}</blockquote>
      </div>

      <div className={styles.field}>
        <label htmlFor="reason-for">A reason this <strong>is</strong> fair:</label>
        <textarea
          id="reason-for"
          value={reasonFor}
          onChange={(e) => { setReasonFor(e.target.value); setError(null); }}
          rows={3}
          placeholder="Argue why it IS fair..."
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="reason-against">A reason this <strong>is not</strong> fair:</label>
        <textarea
          id="reason-against"
          value={reasonAgainst}
          onChange={(e) => { setReasonAgainst(e.target.value); setError(null); }}
          rows={3}
          placeholder="Argue why it is NOT fair..."
        />
      </div>

      <div className={styles.field}>
        <p className={styles.judgmentLabel}>Your final decision:</p>
        <div className={styles.judgmentButtons}>
          <button
            id="judgment-fair-btn"
            className={`btn ${judgment === true ? "btn-primary" : "btn-secondary"}`}
            onClick={() => { setJudgment(true); setError(null); }}
          >
            Fair
          </button>
          <button
            id="judgment-not-fair-btn"
            className={`btn ${judgment === false ? "btn-primary" : "btn-secondary"}`}
            onClick={() => { setJudgment(false); setError(null); }}
          >
            Not Fair
          </button>
        </div>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <button
        id="fairness-judgment-submit-btn"
        className="btn btn-primary"
        onClick={handleSubmit}
      >
        {itemIndex < totalItems - 1 ? "Next Decision →" : "Finish"}
      </button>
    </div>
  );
}
