"use client";

import { useState } from "react";
import styles from "./ConsentForm.module.css";

interface ConsentFormProps {
  onAgree: () => void;
  onDecline: () => void;
}

const CONSENT_TEXT = `
[PLACEHOLDER — Replace with your IRB-approved consent form text before deployment.]

**Purpose of the Study**

You are being invited to participate in a research study on decision-making. The purpose of this study is to investigate how people make economic decisions when interacting with others.

**What You Will Be Asked to Do**

If you agree to participate, you will be asked to read a set of instructions, answer some comprehension questions, and make one or more decisions in a simple economic game with another participant. The study will take approximately 15 minutes to complete.

**Risks and Benefits**

There are no significant risks associated with participation in this study. You will receive a base payment for your participation, plus a bonus payment based on the decisions made in the game.

**Confidentiality**

Your responses will be kept confidential. Data will be stored securely and will only be used for research purposes. You will not be identified by name in any reports or publications. We will use your Prolific participant ID only to process your payment.

**Voluntary Participation**

Your participation is completely voluntary. You may withdraw at any time without penalty. However, please note that partial completion may affect your bonus payment.

**Contact**

If you have questions about this study, please contact the research team via Prolific.

---

By clicking "I Agree" below, you confirm that:
- You are 18 years of age or older.
- You have read and understood the information above.
- You voluntarily agree to participate in this study.
`;

// Very simple markdown→HTML for the consent text (bold only)
function renderConsent(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n---\n/g, '<hr style="margin:1rem 0;border:none;border-top:1px solid var(--color-border)">')
    .replace(/\n/g, "<br>");
}

export default function ConsentForm({ onAgree, onDecline }: ConsentFormProps) {
  const [checked, setChecked] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setHasScrolled(true);
    }
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Informed Consent</h1>
      <div
        className={styles.scrollBox}
        onScroll={handleScroll}
        tabIndex={0}
        aria-label="Consent form — please scroll to read"
      >
        <div
          className={`prose ${styles.consentContent}`}
          dangerouslySetInnerHTML={{ __html: renderConsent(CONSENT_TEXT) }}
        />
      </div>
      {!hasScrolled && (
        <p className={`text-sm text-muted ${styles.scrollHint}`}>
          ↓ Please scroll to the bottom to read the full consent form.
        </p>
      )}
      <label className={styles.checkLabel}>
        <input
          type="checkbox"
          id="consent-checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          disabled={!hasScrolled}
          className={styles.checkbox}
        />
        I have read and understood the information above, and I agree to participate.
      </label>
      <div className={styles.buttons}>
        <button
          id="consent-decline-btn"
          className="btn btn-secondary"
          onClick={onDecline}
        >
          I Do Not Agree
        </button>
        <button
          id="consent-agree-btn"
          className="btn btn-primary"
          onClick={onAgree}
          disabled={!checked || !hasScrolled}
        >
          I Agree — Continue
        </button>
      </div>
    </div>
  );
}
