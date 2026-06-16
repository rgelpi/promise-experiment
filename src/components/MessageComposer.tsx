"use client";

import { useState } from "react";
import styles from "./MessageComposer.module.css";

const MAX_CHARS = 500;

interface MessageComposerProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
}

export default function MessageComposer({
  onSubmit,
  placeholder = "Type your message here...",
  label = "Your message to your partner",
  hint,
}: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_CHARS - message.length;
  const isOverLimit = remaining < 0;

  function handleSubmit() {
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Please write a message before continuing.");
      return;
    }
    if (isOverLimit) {
      setError(`Your message is too long. Please shorten it by ${-remaining} character${-remaining === 1 ? "" : "s"}.`);
      return;
    }
    setError(null);
    onSubmit(trimmed);
  }

  return (
    <div className={styles.wrapper}>
      <label htmlFor="message-input" className={styles.label}>{label}</label>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.textareaWrapper}>
        <textarea
          id="message-input"
          value={message}
          onChange={(e) => { setMessage(e.target.value); setError(null); }}
          placeholder={placeholder}
          rows={6}
          className={styles.textarea}
          aria-describedby="char-count"
        />
        <span
          id="char-count"
          className={`${styles.charCount} ${isOverLimit ? styles.overLimit : ""}`}
        >
          {remaining} character{remaining === 1 ? "" : "s"} remaining
        </span>
      </div>
      {error && <p className="text-error text-sm">{error}</p>}
      <div className={styles.footer}>
        <p className="text-sm text-muted">
          Do not include any information that could identify you (e.g., your name or Prolific ID).
        </p>
        <button
          id="message-submit-btn"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!message.trim() || isOverLimit}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
