"use client";

import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className={styles.wrapper} role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.label}>
        {label ?? `Step ${current} of ${total}`}
      </span>
    </div>
  );
}
