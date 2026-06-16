"use client";

import RateSlider from "../RateSlider";
import styles from "./Decision.module.css";

interface ThirdPartyPunishmentDecisionProps {
  dictatorDivision: { kept: number; given: number };
  onSubmit: (decision: { punishmentRate: number }) => void;
}

export default function ThirdPartyPunishmentDecision({
  dictatorDivision,
  onSubmit,
}: ThirdPartyPunishmentDecisionProps) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Decision</h2>
      <p className={styles.description}>
        A Dictator has proposed the following division of their endowment:
        <br /><br />
        <strong>Dictator keeps:</strong> {dictatorDivision.kept} points<br />
        <strong>Receiver gets:</strong> {dictatorDivision.given} points
        <br /><br />
        As a third-party observer, you may assign a punishment rate.
        This rate determines what percentage of the Dictator&apos;s points will be deducted.
      </p>
      <RateSlider
        label="Punishment Rate"
        submitLabel="Confirm Punishment"
        onSubmit={(rate) => onSubmit({ punishmentRate: rate })}
      />
    </div>
  );
}
