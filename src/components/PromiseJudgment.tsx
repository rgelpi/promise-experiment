"use client";

import { useState } from "react";
import styles from "./PromiseJudgment.module.css";

interface PromiseJudgmentProps {
  message: string;
  itemIndex: number;
  totalItems: number;
  onSubmit: (result: { reasonFor: string; reasonAgainst: string; isPromise: boolean }) => void;
}

export default function PromiseJudgment({
  message,
  itemIndex,
  totalItems,
  onSubmit,
}: PromiseJudgmentProps) {
  const [reasonFor, setReasonFor] = useState("");
  const [reasonAgainst, setReasonAgainst] = useState("");
  const [judgment, setJudgment] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!reasonFor.trim()) { setError("Please provide a reason in favor of calling this a promise."); return; }
    if (!reasonAgainst.trim()) { setError("Please provide a reason against calling this a promise."); return; }
    if (judgment === null) { setError("Please make a final decision (Promise or Not a Promise)."); return; }
    setError(null);
    onSubmit({ reasonFor: reasonFor.trim(), reasonAgainst: reasonAgainst.trim(), isPromise: judgment });
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.counter}>Message {itemIndex + 1} of {totalItems}</p>

      <div className={styles.messageBox}>
        <p className={styles.messageLabel}>Message from Person B:</p>
        <blockquote className={styles.message}>{message}</blockquote>
      </div>

      <div className={styles.field}>
        <label htmlFor="reason-for">A reason this <strong>is</strong> a promise:</label>
        <textarea
          id="reason-for"
          value={reasonFor}
          onChange={(e) => { setReasonFor(e.target.value); setError(null); }}
          rows={3}
          placeholder="Argue why it IS a promise..."
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="reason-against">A reason this <strong>is not</strong> a promise:</label>
        <textarea
          id="reason-against"
          value={reasonAgainst}
          onChange={(e) => { setReasonAgainst(e.target.value); setError(null); }}
          rows={3}
          placeholder="Argue why it is NOT a promise..."
        />
      </div>

      <div className={styles.field}>
        <p className={styles.judgmentLabel}>Your final decision:</p>
        <div className={styles.judgmentButtons}>
          <button
            id="judgment-promise-btn"
            className={`btn ${judgment === true ? "btn-primary" : "btn-secondary"}`}
            onClick={() => { setJudgment(true); setError(null); }}
          >
            Promise
          </button>
          <button
            id="judgment-not-promise-btn"
            className={`btn ${judgment === false ? "btn-primary" : "btn-secondary"}`}
            onClick={() => { setJudgment(false); setError(null); }}
          >
            Not a Promise
          </button>
        </div>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <button
        id="promise-judgment-submit-btn"
        className="btn btn-primary"
        onClick={handleSubmit}
      >
        {itemIndex < totalItems - 1 ? "Next Message →" : "Finish"}
      </button>
    </div>
  );
}
