"use client";

import type { ReactNode } from "react";
import ProgressBar from "./ProgressBar";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
  experimentName?: string;
  progress?: { current: number; total: number };
  showHeader?: boolean;
}

export default function Layout({
  children,
  experimentName,
  progress,
  showHeader = true,
}: LayoutProps) {
  return (
    <div className={styles.page}>
      {showHeader && (
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <span className={styles.studyLabel}>
              {experimentName ?? "Decision Making Study"}
            </span>
            {progress && progress.total > 0 && (
              <div className={styles.progressWrapper}>
                <ProgressBar current={progress.current} total={progress.total} />
              </div>
            )}
          </div>
        </header>
      )}
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
      {/* <footer className={styles.footer}>
        <p>This study is conducted by academic researchers. All responses are anonymous.</p>
      </footer> */}
    </div>
  );
}
