"use client";

import { useState } from "react";
import styles from "./RateSlider.module.css";

interface RateSliderProps {
  label?: string;
  description?: string;
  onSubmit: (rate: number) => void;
  /** Optional: called on every slider change with the current value */
  onPreviewChange?: (rate: number) => void;
  submitLabel?: string;
}

export default function RateSlider({
  label = "Select a rate",
  description,
  onSubmit,
  onPreviewChange,
  submitLabel = "Confirm Rate",
}: RateSliderProps) {
  const [rate, setRate] = useState(50);

  return (
    <div className={styles.wrapper}>
      <div className={styles.display}>
        <span className={styles.rateValue}>{rate}%</span>
        <span className={styles.rateLabel}>{label}</span>
      </div>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.sliderWrapper}>
        <span className={styles.bound}>0%</span>
        <input
          id="rate-slider"
          type="range"
          min={0}
          max={100}
          step={1}
          value={rate}
          onChange={(e) => { const v = Number(e.target.value); setRate(v); onPreviewChange?.(v); }}
          aria-label={label}
        />
        <span className={styles.bound}>100%</span>
      </div>
      <button
        id="rate-slider-submit-btn"
        className="btn btn-primary"
        onClick={() => onSubmit(rate)}
      >
        {submitLabel}
      </button>
    </div>
  );
}
