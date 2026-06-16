"use client";

import styles from "./MessageViewer.module.css";

interface MessageViewerProps {
  message: string;
  senderLabel?: string;
  context?: string;
}

export default function MessageViewer({
  message,
  senderLabel = "Your partner's message",
  context,
}: MessageViewerProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.senderLabel}>{senderLabel}</p>
      {context && <p className={styles.context}>{context}</p>}
      <blockquote className={styles.messageBox}>
        {message}
      </blockquote>
    </div>
  );
}
