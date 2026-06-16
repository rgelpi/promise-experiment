"use client";

import { useState } from "react";
import RateSlider from "../RateSlider";
import styles from "./Decision.module.css";

interface PublicGoodsDecisionProps {
  endowment: number;
  multiplier: number;
  groupSize?: number; // default 4 per spec
  onSubmit: (decision: { contributionRate: number }) => void;
}

export default function PublicGoodsDecision({
  endowment,
  multiplier,
  groupSize = 4,
  onSubmit,
}: PublicGoodsDecisionProps) {
  const [rate, setRate] = useState(50);

  const contributed = Math.round((rate / 100) * endowment * 10) / 10;
  const poolValue = Math.round(contributed * multiplier * 10) / 10;
  const eachReceives = Math.round((poolValue / groupSize) * 10) / 10;
  const kept = Math.round((endowment - contributed) * 10) / 10;
  const totalForYou = Math.round((kept + eachReceives) * 10) / 10;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Contribution</h2>
      <p className={styles.description}>
        You have been given an initial endowment of <strong>{endowment} points</strong>.
        You may contribute between 0% and 100% of your endowment to a shared common pool.
        The pool will be multiplied by <strong>{multiplier}×</strong> and then divided equally
        among all <strong>{groupSize} participants</strong> in your group.
      </p>

      {/* Live payoff preview */}
      <div className={styles.preview}>
        <p className={styles.previewTitle}>Live Payoff Preview</p>
        <table className={styles.previewTable}>
          <tbody>
            <tr>
              <td>You contribute</td>
              <td><strong>{contributed} pts ({rate}%)</strong></td>
            </tr>
            <tr>
              <td>You keep</td>
              <td><strong>{kept} pts</strong></td>
            </tr>
            <tr>
              <td>Pool value (after {multiplier}× multiplier)</td>
              <td><strong>{poolValue} pts</strong></td>
            </tr>
            <tr>
              <td>Each player receives from pool</td>
              <td><strong>{eachReceives} pts</strong></td>
            </tr>
            <tr className={styles.previewTotal}>
              <td>Your estimated total</td>
              <td><strong>{totalForYou} pts</strong></td>
            </tr>
          </tbody>
        </table>
        <p className={styles.previewNote}>
          * This preview assumes all other participants contribute at the same rate as you.
          Actual payoffs depend on the contributions of all group members.
        </p>
      </div>

      <RateSlider
        label="Contribution Rate"
        submitLabel="Confirm Contribution Rate"
        onSubmit={(r) => onSubmit({ contributionRate: r })}
        onPreviewChange={setRate}
      />
    </div>
  );
}
