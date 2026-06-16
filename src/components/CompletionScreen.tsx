"use client";

import styles from "./CompletionScreen.module.css";

interface CompletionScreenProps {
  completionUrl?: string;
  completionCode?: string;
  message?: string;
}

export default function CompletionScreen({
  completionUrl,
  completionCode,
  message = "Thank you for participating in this study. Your responses have been recorded.",
}: CompletionScreenProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon} aria-hidden>✓</div>
      <h1 className={styles.heading}>Study Complete</h1>
      <p className={styles.message}>{message}</p>

      {completionCode && (
        <div className={styles.codeBox}>
          <p className={styles.codeLabel}>Your completion code:</p>
          <p className={styles.code} id="completion-code">{completionCode}</p>
          <p className={styles.codeHint}>
            If you are not redirected automatically, please copy this code and paste it into Prolific.
          </p>
        </div>
      )}

      {completionUrl && (
        <a
          id="prolific-return-btn"
          href={completionUrl}
          className="btn btn-primary"
        >
          Return to Prolific
        </a>
      )}
    </div>
  );
}
