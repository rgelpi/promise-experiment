"use client";

import { useState } from "react";
import type { AttentionCheckConfig, AttentionCheckQuestion } from "@/lib/types";
import styles from "./AttentionCheck.module.css";

interface AttentionCheckProps {
  config: AttentionCheckConfig;
  /** Called when all questions are answered correctly */
  onComplete: () => void;
  /** Optional: callback with full attempt results */
  onResults?: (results: QuestionResult[]) => void;
}

interface QuestionResult {
  questionId: string;
  correct: boolean;
  attempts: number;
  finalAnswer: string;
}

interface QuestionState {
  selectedIndex: string | null;
  attempts: number;
  status: "unanswered" | "correct" | "wrong" | "failed";
}

function initState(questions: AttentionCheckQuestion[]): Record<string, QuestionState> {
  return Object.fromEntries(
    questions.map((q) => [q.id, { selectedIndex: null, attempts: 0, status: "unanswered" }])
  );
}

export default function AttentionCheck({ config, onComplete, onResults }: AttentionCheckProps) {
  const [states, setStates] = useState<Record<string, QuestionState>>(() =>
    initState(config.questions)
  );
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const allResolved = config.questions.every(
    (q) => states[q.id].status === "correct" || states[q.id].status === "failed"
  );

  function handleSelect(qId: string, index: string) {
    const s = states[qId];
    if (s.status === "correct" || s.status === "failed") return;
    setStates((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], selectedIndex: index },
    }));
  }

  function handleSubmit() {
    setGlobalError(null);
    const unanswered = config.questions.filter(
      (q) => states[q.id].selectedIndex === null && states[q.id].status === "unanswered"
    );
    if (unanswered.length > 0) {
      setGlobalError("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
    const newStates = { ...states };
    config.questions.forEach((q) => {
      const s = newStates[q.id];
      if (s.status === "correct" || s.status === "failed") return;
      const isCorrect = s.selectedIndex === q.correctAnswer;
      const newAttempts = s.attempts + 1;
      newStates[q.id] = {
        ...s,
        attempts: newAttempts,
        status: isCorrect
          ? "correct"
          : newAttempts >= q.maxAttempts
          ? "failed"
          : "wrong",
        selectedIndex: isCorrect ? s.selectedIndex : null,
      };
    });
    setStates(newStates);

    const allDone = config.questions.every(
      (q) => newStates[q.id].status === "correct" || newStates[q.id].status === "failed"
    );
    if (allDone) {
      const results: QuestionResult[] = config.questions.map((q) => ({
        questionId: q.id,
        correct: newStates[q.id].status === "correct",
        attempts: newStates[q.id].attempts,
        finalAnswer: newStates[q.id].selectedIndex ?? "",
      }));
      onResults?.(results);
      onComplete();
    } else {
      setSubmitted(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.preamble}>{config.preamble}</p>
      <ol className={styles.questionList}>
        {config.questions.map((q) => {
          const s = states[q.id];
          const locked = s.status === "correct" || s.status === "failed";
          return (
            <li key={q.id} className={styles.question}>
              <p className={styles.questionText}>{q.text}</p>
              {s.status === "wrong" && (
                <p className={`${styles.feedback} ${styles.wrong}`}>
                  That answer is incorrect. Please try again ({q.maxAttempts - s.attempts} attempt{q.maxAttempts - s.attempts === 1 ? "" : "s"} remaining).
                </p>
              )}
              {s.status === "correct" && (
                <p className={`${styles.feedback} ${styles.correct}`}>✓ Correct.</p>
              )}
              {s.status === "failed" && (
                <p className={`${styles.feedback} ${styles.failed}`}>
                  The correct answer is: <strong>{q.options?.[parseInt(q.correctAnswer)] ?? q.correctAnswer}</strong>
                </p>
              )}
              <ul className={styles.options}>
                {(q.options ?? ["True", "False"]).map((opt, idx) => {
                  const idxStr = String(idx);
                  const isSelected = s.selectedIndex === idxStr;
                  return (
                    <li key={idxStr}>
                      <label className={`${styles.optionLabel} ${locked ? styles.locked : ""}`}>
                        <input
                          type="radio"
                          name={q.id}
                          value={idxStr}
                          checked={isSelected}
                          onChange={() => handleSelect(q.id, idxStr)}
                          disabled={locked}
                          className={styles.radio}
                        />
                        {opt}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
      {globalError && <p className={`text-error text-sm`}>{globalError}</p>}
      {!allResolved && (
        <button
          id="attention-check-submit-btn"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitted}
        >
          Submit Answers
        </button>
      )}
    </div>
  );
}
