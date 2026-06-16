import type { SurveyQuestion } from "./types";

// Placeholder survey questions — replace with real questions before deployment.
export const PLACEHOLDER_SURVEY: SurveyQuestion[] = [
  {
    id: "sq-age",
    text: "What is your age?",
    type: "demographic-select",
    options: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65 or older", "Prefer not to say"],
    required: true,
  },
  {
    id: "sq-gender",
    text: "What is your gender?",
    type: "demographic-select",
    options: ["Man", "Woman", "Non-binary / third gender", "Self-describe", "Prefer not to say"],
    required: false,
  },
  {
    id: "sq-education",
    text: "What is the highest level of education you have completed?",
    type: "demographic-select",
    options: [
      "Less than high school",
      "High school diploma or GED",
      "Some college",
      "Associate degree",
      "Bachelor's degree",
      "Graduate or professional degree",
      "Prefer not to say",
    ],
    required: false,
  },
  {
    id: "sq-fairness-belief",
    text: "In general, how important is fairness in economic interactions?",
    type: "likert",
    scale: { min: 1, max: 7, minLabel: "Not at all important", maxLabel: "Extremely important" },
    required: true,
  },
  {
    id: "sq-trust-general",
    text: "In general, how much do you trust strangers?",
    type: "likert",
    scale: { min: 1, max: 7, minLabel: "Not at all", maxLabel: "Completely" },
    required: true,
  },
  {
    id: "sq-comments",
    text: "Do you have any comments about the study or your experience? (optional)",
    type: "free-text",
    required: false,
  },
];
