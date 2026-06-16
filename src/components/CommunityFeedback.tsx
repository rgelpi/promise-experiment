"use client";

import type { CommunityAssessment } from "@/lib/types";
import styles from "./CommunityFeedback.module.css";

interface CommunityFeedbackProps {
  assessment: CommunityAssessment | null;
  judgmentLabel?: string; // e.g., "fair", "a promise", "wrong"
  partnerWillSee?: boolean;
  onContinue: () => void;
}

export default function CommunityFeedback({
  assessment,
  judgmentLabel = "fair",
  partnerWillSee,
  onContinue,
}: CommunityFeedbackProps) {
  if (!assessment) {
    return (
      <div className={styles.wrapper}>
        <div className="alert alert-info">
          <strong>No community feedback yet.</strong> You are among the first participants.
          Community feedback will be available in future rounds.
        </div>
        <button id="community-feedback-continue-btn" className="btn btn-primary" onClick={onContinue}>
          Continue
        </button>
      </div>
    );
  }

  const majority = assessment.positiveRatio >= 0.5;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Community Feedback</h2>
      <p className={styles.subtitle}>
        The community has reviewed your decision. The community has determined that in order to consider a decision as {judgmentLabel}, at least 50% of the community must consider it {judgmentLabel}.{/* Note: This threshold may change in future versions of the task. */}
      </p>

      {/* <div className={styles.bar}>
        <div
          className={`${styles.barFill} ${majority ? styles.barPositive : styles.barNegative}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className={styles.barLabels}>
        <span>{pct}% consider this {judgmentLabel}</span>
        <span>{100 - pct}% do not</span>
      </div> */}

      <div className={`alert ${majority ? "alert-success" : "alert-warning"}`}>
        The community <strong>{majority ? "does" : "does not"}</strong> consider this {judgmentLabel}.
      </div>

      {partnerWillSee !== undefined && (
        <p className={styles.partnerNote}>
          {partnerWillSee
            ? "Your partner will also see this community feedback."
            : "Your partner will not see this community feedback."}
        </p>
      )}

      <button id="community-feedback-continue-btn" className="btn btn-primary" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}
