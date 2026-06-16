"use client";

import RateSlider from "../RateSlider";
import styles from "./Decision.module.css";

interface PowerToTakeDecisionProps {
  role: "A" | "B";
  proposerTakeRate?: number; // Needed for B
  onSubmit: (decision: any) => void;
}

export default function PowerToTakeDecision({
  role,
  proposerTakeRate,
  onSubmit,
}: PowerToTakeDecisionProps) {
  if (role === "A") {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Your Proposal</h2>
        <p className={styles.description}>
          Set a "take rate" to determine the percentage of Person B's endowment you will claim.
        </p>
        <RateSlider
          label="Take Rate"
          submitLabel="Confirm Take Rate"
          onSubmit={(rate) => onSubmit({ takeRate: rate })}
        />
      </div>
    );
  }

  // Role B
  if (proposerTakeRate === undefined) return null;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Decision</h2>
      <p className={styles.description}>
        Person A has set a take rate of <strong>{proposerTakeRate}%</strong>.
        This means they will claim {proposerTakeRate}% of whatever endowment you have remaining.
        <br /><br />
        You may choose to destroy a percentage of your initial endowment before the take rate is applied.
      </p>
      <RateSlider
        label="Destroy Rate"
        submitLabel="Confirm Destroy Rate"
        onSubmit={(rate) => onSubmit({ destroyRate: rate })}
      />
    </div>
  );
}
