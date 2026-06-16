"use client";

import { useState } from "react";
import type { InstructionPage } from "@/lib/types";
import styles from "./InstructionScreen.module.css";

interface InstructionScreenProps {
  pages: InstructionPage[];
  onComplete: () => void;
}

// Minimal markdown renderer: headings, bold, lists, tables, horizontal rules
function renderMarkdown(md: string): string {
  return md
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr>")
    // Tables — convert markdown table rows
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row.split("|").map((c: string) => c.trim());
      return "<tr>" + cells.map((c: string) => `<td>${c}</td>`).join("") + "</tr>";
    })
    .replace(/(<tr>.*<\/tr>)/gs, (match) => {
      // Wrap in table if not already
      return `<table class="md-table">${match}</table>`;
    })
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
    // Paragraphs (lines not starting with a tag)
    .replace(/^(?!<[a-z])(.*\S.*)$/gm, "<p>$1</p>")
    // Clean up double-wrapped tables
    .replace(/<table[^>]*><table[^>]*>/g, '<table class="md-table">')
    .replace(/<\/table><\/table>/g, "</table>");
}

export default function InstructionScreen({ pages, onComplete }: InstructionScreenProps) {
  const [pageIndex, setPageIndex] = useState(0);

  const currentPage = pages[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === pages.length - 1;

  return (
    <div className={styles.wrapper}>
      {pages.length > 1 && (
        <p className={styles.pageIndicator}>
          Page {pageIndex + 1} of {pages.length}
        </p>
      )}

      <div
        className={`prose ${styles.content}`}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(currentPage.content) }}
      />

      <div className={styles.nav}>
        {!isFirst && (
          <button
            id="instructions-prev-btn"
            className="btn btn-secondary"
            onClick={() => setPageIndex((i) => i - 1)}
          >
            ← Previous
          </button>
        )}
        <div style={{ flex: 1 }} />
        {!isLast ? (
          <button
            id="instructions-next-btn"
            className="btn btn-primary"
            onClick={() => setPageIndex((i) => i + 1)}
          >
            Next →
          </button>
        ) : (
          <button
            id="instructions-continue-btn"
            className="btn btn-primary"
            onClick={onComplete}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
