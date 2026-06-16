"use client";

import { useState } from "react";
import styles from "./MoneySlider.module.css";

interface MoneySliderProps {
  totalPoints: number;
  pointsToUsd?: number;
  labelA?: string;
  labelB?: string;
  onSubmit: (pointsForB: number) => void;
}

export default function MoneySlider({
  totalPoints,
  pointsToUsd = 0.5,
  labelA = "You keep",
  labelB = "Partner receives",
  onSubmit,
}: MoneySliderProps) {
  const [forB, setForB] = useState(Math.floor(totalPoints / 2));
  const forA = totalPoints - forB;

  function fmt(pts: number) {
    const usd = (pts * pointsToUsd).toFixed(2);
    return `${pts} pts ($${usd})`;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.display}>
        <div className={styles.party}>
          <span className={styles.partyLabel}>{labelA}</span>
          <span className={styles.partyValue}>{fmt(forA)}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.party}>
          <span className={styles.partyLabel}>{labelB}</span>
          <span className={styles.partyValue}>{fmt(forB)}</span>
        </div>
      </div>

      <div className={styles.sliderWrapper}>
        <span className={styles.sliderBound}>0</span>
        <input
          id="money-slider"
          type="range"
          min={0}
          max={totalPoints}
          step={1}
          value={forB}
          onChange={(e) => setForB(Number(e.target.value))}
          aria-label="Points to give to your partner"
        />
        <span className={styles.sliderBound}>{totalPoints}</span>
      </div>

      <p className={styles.sliderHint}>
        Move the slider to choose how many points to give to your partner.
      </p>

      <button
        id="money-slider-submit-btn"
        className="btn btn-primary"
        onClick={() => onSubmit(forB)}
      >
        Confirm Division
      </button>
    </div>
  );
}
