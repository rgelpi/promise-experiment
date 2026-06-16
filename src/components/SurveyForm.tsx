"use client";

import { useState } from "react";
import type { SurveyQuestion } from "@/lib/types";
import styles from "./SurveyForm.module.css";

interface SurveyFormProps {
  questions: SurveyQuestion[];
  onSubmit: (answers: Record<string, string | number>) => void;
}

export default function SurveyForm({ questions, onSubmit }: SurveyFormProps) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(id: string, value: string | number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[id]; return e; });
  }

  function handleSubmit() {
    const newErrors: Record<string, string> = {};
    questions.forEach((q) => {
      if (q.required && (answers[q.id] === undefined || answers[q.id] === "")) {
        newErrors[q.id] = "This question is required.";
      }
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSubmit(answers);
  }

  return (
    <div className={styles.wrapper}>
      {questions.map((q) => (
        <div key={q.id} className={styles.question}>
          <label htmlFor={q.id} className={styles.questionText}>
            {q.text}
            {q.required && <span className={styles.required}> *</span>}
          </label>

          {q.type === "free-text" && (
            <textarea
              id={q.id}
              rows={3}
              value={String(answers[q.id] ?? "")}
              onChange={(e) => set(q.id, e.target.value)}
            />
          )}

          {(q.type === "multiple-choice" || q.type === "demographic-select") && (
            <select
              id={q.id}
              value={String(answers[q.id] ?? "")}
              onChange={(e) => set(q.id, e.target.value)}
            >
              <option value="">— Select —</option>
              {q.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {q.type === "likert" && q.scale && (
            <div className={styles.likert}>
              <div className={styles.likertLabel}>{q.scale.minLabel}</div>
              <div className={styles.likertOptions}>
                {Array.from({ length: q.scale.max - q.scale.min + 1 }, (_, i) => i + q.scale!.min).map((v) => (
                  <label key={v} className={styles.likertOption}>
                    <input
                      type="radio"
                      name={q.id}
                      value={v}
                      checked={answers[q.id] === v}
                      onChange={() => set(q.id, v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
              <div className={styles.likertLabel}>{q.scale.maxLabel}</div>
            </div>
          )}

          {errors[q.id] && <p className="text-error text-sm">{errors[q.id]}</p>}
        </div>
      ))}

      <button id="survey-submit-btn" className="btn btn-primary" onClick={handleSubmit}>
        Submit Survey
      </button>
    </div>
  );
}
