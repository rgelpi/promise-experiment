# Power to Take Game

This document details the full, verbatim participant-facing text for all instructions, comprehension checks, decision interfaces, feedback messages, and outcome displays in the **Power to Take Game**, organized chronologically by role according to the platform's experimental flow.

---

## 1. Experimental Overview & Manipulated Variables

In this variant of the Power to Take Game (Bosman & van Winden, 2002):

- **Role A (Proposer)** claims a "take rate" between 0% and 100% of Person B's endowment.
- **Role B (Responder)** is endowed with resources ($2.50 / 10 points) and, upon seeing Person A's take rate, may choose to destroy between 0% and 100% of their endowment in retaliation. Person A only claims the take-rate percentage of any endowment that remains undestroyed.
- **Role C (Community Assessor)** evaluates proposed take rates and determines whether each rate conforms to community standards of "fairness".

### Summary of Variables and Manipulations

| Variable / Parameter | Type | Possible Values & Description |
| :--- | :--- | :--- |
| `[showFeedback]` | Boolean Feature Flag | `true` (Proposer views community feedback and can revise take rate) \| `false` (Feedback and revision steps skipped) |
| `[partnerWillSee]` | Boolean Feature Flag | `true` ("Your partner will also see this community feedback.") \| `false` ("Your partner will not see this community feedback.") |
| `[Endowment]` | Numeric | Default: `10 points` / `$2.50` (Value can vary across study conditions) |
| `[consensusThreshold]` | Numeric | Default: `50%` agreement required to consider a take rate fair (Value can vary) |
| `[Role_C_NumItems]` | Numeric Range | Default: `15–25 take rates` to evaluate (Value can vary) |
| `[ProposerTakeRate]` | Choice Variable | Integer between `0%` and `100%` set by Person A |
| `[DestroyRate]` | Choice Variable | Integer between `0%` and `100%` set by Person B |
| `[Payoff_B_Kept]` | Computed Value | `[Endowment] * (1 - [DestroyRate]/100) * (1 - [ProposerTakeRate]/100)` |
| `[Payoff_A_Taken]` | Computed Value | `[Endowment] * (1 - [DestroyRate]/100) * ([ProposerTakeRate]/100)` |

---

## 2. Participant Flow Map

**Role A (Proposer / Person A):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Make Offer (Set Take Rate)
  5. View Community Feedback *(if `showFeedback = true`)*
  6. Revise Offer *(if `showFeedback = true`)*
  7. Trial Outcome
  8. Post-Task Survey (see separate file)
  9. Study Complete

**Role B (Responder / Person B):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. View Community Feedback *(if `showFeedback = true`)*
  5. Make Decision (Set Destroy Rate)
  6. Trial Outcome
  7. Post-Task Survey (see separate file)
  8. Study Complete

**Role C (Community Assessor):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Judge Decisions (Repeated for 15–25 items)
  5. Post-Task Survey (see separate file)
  6. Study Complete

---

## 3. Role A (Proposer / Person A) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

**Page 1: Role Overview & The Take Rate**

> [!NOTE] Instructions: Proposer (Person A)
> In this experiment, you are in the role of the **Proposer**. You are paired with Person B (the **Responder**).
> 
> **The Take Rate**
> You will set a "take rate" between 0% and 100%. This is the percentage of Person B's initial endowment ($2.50) that you wish to claim for yourself.

**Page 2: Community Assessment**

> [!NOTE] Community Assessment
> Before your take rate is finalized, a group of other participants (the Community) will view your proposed rate. They will provide a judgment on whether your proposal is "fair".
> 
> You will see this feedback and have one opportunity to **revise** your take rate if you wish.

**Page 3: The Outcome**

> [!NOTE] The Outcome
> Person B will see your final take rate. However, Person B has the option to **destroy** any percentage of their endowment before your take rate is applied.
> 
> For example, if you set a 50% take rate, and Person B chooses to destroy 100% of their money, both of you receive $0 from that endowment.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Proposer.
> 
> 1. **ptt-a-q1:** What is the range of the 'take rate' you can set?
>    - `0-10%`
>    - `0-50%`
>    - `0-100%` *(Correct Answer)*
> 
> 2. **ptt-a-q2:** If Person B decides to destroy 100% of their endowment, what happens to your take rate?
>    - `Your take rate applies to the initial endowment, and Person B gets nothing`
>    - `Both you and Person B get nothing` *(Correct Answer)*
>    - `You get half of the initial endowment, and Person B gets nothing`


---

### Stage 4: Make Offer (Set Take Rate)

> [!NOTE] Your Proposal
> 
> Set a 'take rate' to determine the percentage of Person B's endowment you will claim.
> 
> **Take Rate Slider:**
> 
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

*Allows the proposer to adjust or confirm their take rate following community feedback.*

- Re-renders the **Interactive Rate Slider** interface with the previous take rate preloaded.

---

### Stage 7: Trial Outcome Screen

> [!NOTE] Trial Completed
> 
> You have finished the decision task for this trial. Below is a summary of the decisions and outcomes.
> 
> *Your Choice:* "You proposed a take rate of [ProposerTakeRate]%."
> 
> *Partner's Decision:* "Person B chose to destroy [DestroyRate]% of their endowment."
> 
> *Trial Outcome:* "You receive **[Payoff_A_Taken] points** (equivalent to a **$[USD]** bonus payment)."

---

### Stage 8: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 9: Study Complete

> [!NOTE] Study Complete
> 
> Thank you for your participation!
> 
> You have earned a total of **[total-points] points** from the Power to Take Game task. This corresponds to a bonus payment of **$[total-usd]**.

---

## 4. Role B (Responder / Person B) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

**Page 1: Role Overview & Endowment**

> [!NOTE] Instructions: Responder (Person B)
> In this experiment, you are in the role of the **Responder**. You are paired with Person A (the **Proposer**).
> 
> **Your Endowment**
> You are gifted with an initial endowment of $2.50.

**Page 2: The Take Rate & Your Decision**

> [!NOTE] The Take Rate & Your Decision
> Person A will set a "take rate" between 0% and 100%. This is the percentage of your money that they claim.
> 
> **Your Decision**
> Before the take rate is applied, you can choose to **destroy** between 0% and 100% of your initial endowment. Person A will only receive the percentage of the *remaining* money.
> 
> For example, if A sets a 100% take rate, but you destroy 100% of your money, Person A receives nothing, and you also receive nothing.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Responder.
> 
> 1. **ptt-b-q1:** What can you do to your endowment before Person A's take rate is applied?
>    - `Nothing`
>    - `Destroy a percentage of it` *(Correct Answer)*
>    - `Double it`
> 
> 2. **ptt-b-q2:** If you destroy 100% of your endowment, how many points does Person A receive from you?
>    - `All of it`
>    - `The take rate percentage`
>    - `0` *(Correct Answer)*

---

### Stage 4: View Community Feedback (Conditional on `[showFeedback: true]`)

*Presented if the condition displays community feedback to the responder.*

> [!NOTE] Community Feedback
> 
> The community has reviewed Person A's proposed take rate. The community has determined that in order to consider a decision as fair, at least [consensusThreshold: default 50%]% of the community must consider it fair.
> 
> *If community positive ratio >= 50%:*
>    - `[Green Alert]` "The community **does** consider this fair."
> 
> *If community positive ratio < 50%:*
>    - `[Yellow Alert]` "The community **does not** consider this fair."

---

### Stage 5: Make Decision (Set Destroy Rate)

> [!NOTE] Your Decision
> 
> Person A has set a take rate of **[ProposerTakeRate]%**.  
> This means they will claim [ProposerTakeRate]% of whatever endowment you have remaining.
> 
> You may choose to destroy a percentage of your initial endowment before the take rate is applied.
> 
> **Destroy Rate Slider:**
> - *Rate Display:* `[rate]%`
> - *Bounds:* 0% to 100% (step size 1%, default initial value: 50%)

---

### Stage 6: Trial Outcome Screen

> [!NOTE] Trial Completed
> 
> You have finished the decision task for this trial. Below is a summary of the decisions and outcomes.
> 
> *Your Choice:* "You chose to destroy [DestroyRate]% of your endowment."
> 
> *Partner's Decision:* "Person A set a take rate of [ProposerTakeRate]%."
> 
> *Trial Outcome:* "You keep **[Payoff_B_Kept] points**. (Person A gets [Payoff_A_Taken] points)."

---

### Stage 7: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 8: Study Complete

> [!NOTE] Study Complete
> 
> Thank you for your participation!
> 
> You have earned a total of **[total-points] points** from the Power to Take Game task. This corresponds to a bonus payment of **$[total-usd]**.

---

## 5. Role C (Community Assessor) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

**Page 1: Overview**

> [!NOTE] Instructions: Community Assessor
> In this study, you will observe interactions in the "Power to Take" game.
> 
> Your task is to evaluate "take rates" proposed by Person A.

**Page 2: Bonus Payment & Evaluation Steps**

> [!NOTE] Bonus Payment & Evaluation Steps
> You will be shown several proposed take rates. For each one:
> 
> 1. Provide a reason why it might be fair.
> 2. Provide a reason why it might be unfair.
> 3. Make a final judgment: Fair or Unfair.
> 
> If your judgment matches the majority of your group, you will receive a **bonus payment**.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Assessor.
> 
> 1. **ptt-c-q1:** What are you evaluating in this task?
>    - `Whether the take rate is fair` *(Correct Answer)*
>    - `Whether B destroyed money`
>    - `Both`

---

### Stage 4: Judge Decisions (Repeated for 15–25 Items)

For each item `i` from 1 to `[Role_C_NumItems: 15–25]`:

> [!NOTE] Decision [i] of [Total]
> 
> **Decision details:** Offer: [ProposerTakeRate]%
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
> You have earned a total of **[total-points] points** from the Power to Take Game task. This corresponds to a bonus payment of **$[total-usd]**.