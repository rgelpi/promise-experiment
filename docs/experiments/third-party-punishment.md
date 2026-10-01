# Third-Party Punishment Game

This document details the full, verbatim participant-facing text for all instructions, comprehension checks, decision interfaces, feedback messages, and outcome displays in the **Third-Party Punishment Game**, organized chronologically by role according to the platform's experimental flow.

---

## 1. Experimental Overview & Manipulated Variables

In this variant of the Third-Party Punishment Game (Fehr & Fischbacher, 2004):
- An unaffected third party (the **Punisher / Role A**) observes a Dictator's prior division of resources between themselves and a Receiver.
- The Punisher chooses a "punishment rate" (0%–100%) to penalize the Dictator. This percentage is deducted directly from the Dictator's kept points.
- In conditions with community feedback, the Punisher views normative evaluations from peer observers before choosing whether to revise the punishment rate.
- **Role C (Community Assessor)** evaluates proposed punishment rates and determines whether each penalty is considered "fair".
- *Note:* Role B is not actively played in this protocol; the initial Dictator division is presented as observed data from a prior interaction.

### Summary of Variables and Manipulations

| Variable / Parameter | Type | Possible Values & Description |
| :--- | :--- | :--- |
| `[showFeedback]` | Boolean Feature Flag | `true` (Punisher views community feedback and can revise punishment rate) \| `false` (Feedback and revision steps skipped) |
| `[partnerWillSee]` | Boolean Feature Flag | `true` ("Your partner will also see this community feedback.") \| `false` ("Your partner will not see this community feedback.") |
| `[Endowment]` | Numeric | Default: `10 points` / `$2.50` (Value can vary across study conditions) |
| `[consensusThreshold]` | Numeric | Default: `50%` agreement required to consider a penalty fair (Value can vary) |
| `[Role_C_NumItems]` | Numeric Range | Default: `15–25 punishment rates` to evaluate (Value can vary) |
| `[DictatorKept]` | Observed Value | Points kept by Dictator (e.g., `10 points`, value can vary based on observed trial) |
| `[DictatorGiven]` | Observed Value | Points given to Receiver by Dictator (e.g., `0 points`, value can vary) |
| `[PunishmentRate]` | Choice Variable | Integer between `0%` and `100%` set by the Punisher |
| `[PointsDeducted]` | Computed Value | `[DictatorKept] * ([PunishmentRate] / 100)` points deducted from Dictator |
| `[DictatorFinalPoints]` | Computed Value | `[DictatorKept] - [PointsDeducted]` |

---

## 2. Participant Flow Map

**Role A (Punisher):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Make Offer (Set Punishment Rate)
  5. View Community Feedback *(if `showFeedback = true`)*
  6. Revise Offer *(if `showFeedback = true`)*
  7. Trial Outcome
  8. Post-Task Survey (see separate file)
  9. Study Complete

**Role C (Community Assessor):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Judge Decisions (Repeated for 15–25 items)
  5. Post-Task Survey (see separate file)
  6. Study Complete

---

## 3. Role A (Punisher) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

#### Page 1: Background & Dictator Division

> [!NOTE] Instructions: Punisher
> In this experiment, you observe a "Dictator Game" interaction between two other participants (a Dictator and a Receiver).
> 
> The Dictator has divided a sum of money between themselves and the Receiver.

#### Page 2: Your Role

> [!NOTE] Your Role
> As a **Punisher**, you can choose to assign a "punishment rate" (0-100%) to the Dictator. This rate determines what percentage of the Dictator's kept points will be deducted.

#### Page 3: Community Assessment

> [!NOTE] Community Assessment
> Before your punishment rate is finalized, the Community will evaluate it. You will see their feedback and can **revise** your rate once.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Punisher.
> 
> 1. **tpp-a-q1:** Whose points are deducted if you assign a punishment rate?
>    - `The Dictator` *(Correct Answer)*
>    - `The Receiver`
>    - `Both`
> 
> 2. **tpp-a-q2:** Can you revise your punishment rate after seeing community feedback?
>    - `Yes` *(Correct Answer)*
>    - `No`

---

### Stage 4: Make Offer (Set Punishment Rate)

> [!NOTE] Your Decision
> 
> A Dictator has proposed the following division of their endowment:
> 
> **Dictator keeps:** [DictatorKept: e.g. 10] points  
> **Receiver gets:** [DictatorGiven: e.g. 0] points  
> 
> As a third-party observer, you may assign a punishment rate. This rate determines what percentage of the Dictator's points will be deducted.
> 
> **Punishment Rate Slider:**
> - *Rate Display:* `[rate]%`
> - *Bounds:* 0% to 100% (step size 1%, default initial value: 50%)

---

### Stage 5: View Community Feedback (Conditional on `[showFeedback: true]`)

*Presented only if community feedback manipulation is enabled.*

> [!NOTE] Community Feedback
> 
> The community has reviewed your decision. The community has determined that in order to consider a decision as fair, at least [consensusThreshold: default 50%]% of the community must consider it fair.
> 
> *If community positive ratio >= 50%:*
> 
>    - `[Green Alert]` "The community **does** consider this fair."
> 
> *If community positive ratio < 50%:*
> 
>    - `[Yellow Alert]` "The community **does not** consider this fair."
> 
> *If `[partnerWillSee: true]`:*
> 
>    - "Your partner will also see this community feedback."
> 
> *If `[partnerWillSee: false]`:*
> 
>    - "Your partner will not see this community feedback."

---

### Stage 6: Revise Offer (Conditional on `[showFeedback: true]`)

*Allows the punisher to adjust or confirm their punishment rate following community feedback.*

- Re-renders the **Interactive Rate Slider** interface with the previous rate preloaded.

---

### Stage 7: Trial Outcome Screen

> [!NOTE] Trial Completed
> 
> You have finished the decision task for this trial. Below is a summary of the decisions and outcomes.

> *Your Choice:* "You proposed a punishment rate of [PunishmentRate]%."
> 
> *Partner's Decision:* "The Dictator chose to keep [DictatorKept] points and offer [DictatorGiven] points to the Receiver."
> 
> *Trial Outcome:* "You receive **[Endowment: 10] points**. The Dictator's points are reduced by **[PointsDeducted] points** (leaving them with **[DictatorFinalPoints] points**)."

---

### Stage 8: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 9: Study Complete

> [!NOTE] Study Complete
> 
> Thank you for your participation!
> 
> You have earned a total of **[total-points] points** from the Third-Party Punishment Game task. This corresponds to a bonus payment of **$[total-usd]**.

---

## 4. Role C (Community Assessor) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

#### Page 1: Overview

> [!NOTE] Instructions: Community Assessor
> In this study, you observe the actions of a **Punisher** in response to a Dictator's division of money.
> 
> Your task is to evaluate whether the Punisher's proposed punishment rate is **fair**.

#### Page 2: Bonus Payment

> [!NOTE] Bonus Payment
> If your judgment matches the majority of your group, you will receive a **bonus payment**.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Assessor.
> 
> 1. **tpp-c-q1:** What are you evaluating?
>    - `The Dictator's split`
>    - `The Punisher's punishment rate` *(Correct Answer)*
>    - `Both`

---

### Stage 4: Judge Decisions (Repeated for 15–25 Items)

For each item `i` from 1 to `[Role_C_NumItems: 15–25]`:

> [!NOTE] Decision [i] of [Total]
> 
> **Decision details:** Offer: [PunishmentRate]%
> 
> **A reason this is fair:**
> 
> - *Input Field:* `Argue why it IS fair...`
> 
> **A reason this is not fair:**
> 
> - *Input Field:* `Argue why it is NOT fair...`
> 
> **Your final decision:**
> 
> - *Choice:* `[Fair | Not Fair]`

---

### Stage 5: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 6: Study Complete

> [!NOTE] Study Complete
> 
> Thank you for your participation!
> 
> You have earned a total of **[total-points] points** from the Third-Party Punishment Game task. This corresponds to a bonus payment of **$[total-usd]**.