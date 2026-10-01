# Public Goods Game

This document details the full, verbatim participant-facing text for all instructions, comprehension checks, decision interfaces, feedback messages, and outcome displays in the **Public Goods Game**, organized chronologically by role according to the platform's experimental flow.

---

## 1. Experimental Overview & Manipulated Variables

In this variant of the linear Public Goods Game (Ledyard, 1994):
- Participants in a group of 4 (the **Contributors / Role A**) receive an initial endowment (10 points) and privately choose a contribution rate (0%–100%) to a common pool.
- All contributions to the pool are summed and multiplied by a factor (`pggMultiplier`, default `1.5×`), and the total pool return is divided equally among all group members regardless of their individual contribution.
- In conditions with community feedback, contributors receive normative evaluations from third-party evaluators indicating whether their proposed contribution rate is considered "appropriate" before choosing whether to revise their contribution.
- **Role C (Community Evaluator)** evaluates individual contribution rates and determines whether each contribution is "appropriate".
- *Note:* Role B is unused in this experiment; all interactive players hold the Contributor role (Role A).

### Summary of Variables and Manipulations

| Variable / Parameter | Type | Possible Values & Description |
| :--- | :--- | :--- |
| `[pggMultiplier]` | Numeric Multiplier | Default: `1.5×` (Can be set via environment variable, value can vary, e.g. 1.2×–2.0×) |
| `[showFeedback]` | Boolean Feature Flag | `true` (Contributor views community feedback and can revise contribution) \| `false` (Feedback and revision steps skipped) |
| `[partnerWillSee]` | Boolean Feature Flag | `true` ("Your partner will also see this community feedback.") \| `false` ("Your partner will not see this community feedback.") |
| `[Endowment]` | Numeric | Default: `10 points` / `$2.50` (Value can vary across study conditions) |
| `[GroupSize]` | Numeric | Default: `4 participants` (Value can vary) |
| `[Role_C_NumItems]` | Numeric Range | Default: `15–25 contribution rates` to evaluate (Value can vary) |
| `[consensusThreshold]` | Numeric | Default: `50%` agreement required to consider a contribution appropriate (Value can vary) |
| `[ContributionRate]` | Choice Variable | Integer between `0%` and `100%` set by the Contributor |
| `[PointsContributed]` | Computed Value | `([ContributionRate] / 100) * [Endowment]` |
| `[PointsKept]` | Computed Value | `[Endowment] - [PointsContributed]` |

---

## 2. Participant Flow Map

**Role A (Contributor):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Make Offer (Set Contribution Rate with Live Payoff Preview)
  5. View Community Feedback *(if `showFeedback = true`)*
  6. Revise Offer *(if `showFeedback = true`)*
  7. Trial Outcome
  8. Post-Task Survey (see separate file)
  9. Study Complete

**Role C (Community Evaluator):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Judge Decisions (Repeated for 15–25 items)
  5. Post-Task Survey (see separate file)
  6. Study Complete

---

## 3. Role A (Contributor) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

#### Page 1: Group Structure & Endowment

> [!NOTE] Instructions: Contributor
> Thank you for participating in this study. You are about to play a version of the **Public Goods Game**.
> 
> ## Your Group
> 
> You will be randomly placed in a group of **four participants**, all of whom will complete the same task.
> 
> ## Your Endowment
> 
> You have been given an initial endowment of **10 points**. You may keep some or all of these points, or contribute any portion of them to a **shared common pool**.

#### Page 2: How the Pool Works & Example

> [!NOTE] How the Pool Works & Example
> 1. Each of the four participants privately chooses how much of their endowment to contribute to the common pool (between 0% and 100%).
> 2. The total amount in the pool is **multiplied by [pggMultiplier: default 1.5]×**.
> 3. The resulting value is then **divided equally** among all four group members — regardless of how much each person individually contributed.
> 
> ## Example
> 
> Suppose all four players each contribute 50% of their 10-point endowment (5 points each):
> - Total pool = 20 points
> - After multiplier: 20 × [pggMultiplier: default 1.5] = [20 * pggMultiplier: default 30] points
> - Each player receives: [(20 * pggMultiplier) / 4: default 7.5] points from the pool
> - Each player also keeps 5 points
> - **Total per player: [5 + (20 * pggMultiplier) / 4: default 12.5] points**

#### Page 3: Your Decision & Bonus Payments

> [!NOTE] Your Decision & Bonus Payments
> You will privately select a **contribution rate** (0%–100%) of your endowment to add to the common pool.
> 
> Before making your final decision, you will receive feedback from a group of **Community Evaluators** about whether your proposed contribution is considered **appropriate**.
> 
> You will then have the opportunity to **revise** your contribution rate before it is finalised.
> 
> ## Bonus Payments
> 
> Your final contribution rate — along with the contributions of your three group members — will be used to calculate your **bonus payment**. Each point is worth $0.25 in bonus payment.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand the task.
> 
> 1. **pgg-a-q1:** What happens to the total amount contributed to the common pool?
>    - `It is kept by the researchers.`
>    - `It is multiplied and then divided equally among all group members.` *(Correct Answer)*
>    - `It is given only to the person who contributed the most.`
> 
> 2. **pgg-a-q2:** If you contribute 0% of your endowment, what portion of the pool do you receive?
>    - `Nothing — only contributors receive a share.`
>    - `An equal share, the same as everyone else.` *(Correct Answer)*
>    - `Half the pool.`
> 
> 3. **pgg-a-q3:** Can you revise your contribution rate after seeing the community evaluation?
>    - `Yes` *(Correct Answer)*
>    - `No`

---

### Stage 4: Make Offer (Set Contribution Rate with Live Payoff Preview)

> [!NOTE] Your Contribution
> 
> You have been given an initial endowment of **[Endowment: default 10] points**. You may contribute between 0% and 100% of your endowment to a shared common pool. The pool will be multiplied by **[pggMultiplier: default 1.5]×** and then divided equally among all **[GroupSize: default 4] participants** in your group.
> 
> **Live Payoff Preview:**
> 
> | Metric | Dynamic Preview Value |
> | :--- | :--- |
> | You contribute | `[PointsContributed] pts ([rate]%)` |
> | You keep | `[PointsKept] pts` |
> | Pool value (after [pggMultiplier]× multiplier) | `[PoolValue] pts` |
> | Each player receives from pool | `[EachReceives] pts` |
> | **Your estimated total** | `[TotalForYou] pts` |
> 
> *Preview assumes all other participants contribute at the same rate as you.*
> 
> **Contribution Rate Slider:**
> - *Rate Display:* `[rate]%`
> - *Bounds:* 0% to 100% (step size 1%, default initial value: 50%)

---

### Stage 5: View Community Feedback (Conditional on `[showFeedback: true]`)

*Presented only if community feedback manipulation is enabled.*

> [!NOTE] Community Feedback
> 
> The community has reviewed your decision. The community has determined that in order to consider a decision as appropriate, at least [consensusThreshold: default 50%]% of the community must consider it appropriate.
> 
> *If community positive ratio >= 50%:*
> 
>    - `[Green Alert]` "The community **does** consider this appropriate."
> 
> *If community positive ratio < 50%:*
> 
>    - `[Yellow Alert]` "The community **does not** consider this appropriate."
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

*Allows the contributor to adjust or confirm their contribution rate following community feedback.*

- Re-renders the **Interactive Rate Slider** interface with the **Live Payoff Preview Table**.
- Preloads the previously selected contribution rate.

---

### Stage 7: Trial Outcome Screen

> [!NOTE] Trial Completed
> 
> You have finished the decision task for this trial. Below is a summary of the decisions and outcomes.

> *Your Choice:* "You chose a contribution rate of [ContributionRate]% ([PointsContributed] points)."
> 
> *Partner's Decision:* "All other contributions will be recorded from remaining group members."
> 
> *Trial Outcome:* "Your total bonus will be computed later once all participants are grouped."

---

### Stage 8: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 9: Study Complete

> [!NOTE] Study Complete
> 
> Thank you for your participation!
> 
> You have earned a total of **[total-points] points** from the Public Goods Game task. This corresponds to a bonus payment of **$[total-usd]**.

---

## 4. Role C (Community Evaluator) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

#### Page 1: Role Overview & Background

> [!NOTE] Instructions: Community Evaluator
> Thank you for participating in this study. You are taking on the role of a **Community Evaluator** in a Public Goods Game.
> 
> ## Background
> 
> Other participants in this study are each playing the role of a **Contributor** in a group of four. Each contributor has been given an initial endowment of **10 points** and privately proposes a contribution rate (0%–100%) to a shared common pool. The pool is multiplied by **[pggMultiplier: default 1.5]×** and divided equally among all four group members.

#### Page 2: Your Role & Evaluation Tasks

> [!NOTE] Your Role & Evaluation Tasks
> Your task is to review the **proposed contribution rates** of individual contributors and evaluate whether each proposed rate is **appropriate**.
> 
> For each contribution rate you review, you will be asked to:
> 1. Provide a reason why the rate **is** appropriate.
> 2. Provide a reason why the rate **is not** appropriate.
> 3. Make a final judgment: **Appropriate** or **Not Appropriate**.

#### Page 3: Bonus Payment

> [!NOTE] Bonus Payment
> You will be shown **15–25 proposed contribution rates**. If your evaluation **matches the majority** of other Community Evaluators in your group, you will earn a **bonus point** for that item.
> 
> Each bonus point is worth $0.20. You could earn up to $3–$5 in bonus payments on top of your guaranteed participation fee.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Community Evaluator.
> 
> 1. **pgg-c-q1:** What are you evaluating in this task?
>    - `Whether contribution rates are appropriate.` *(Correct Answer)*
>    - `Whether participants contributed more than average.`
>    - `Whether the pool was large enough.`
> 
> 2. **pgg-c-q2:** Will you receive a bonus if your evaluation matches the majority of other evaluators?
>    - `Yes` *(Correct Answer)*
>    - `No`

---

### Stage 4: Judge Decisions (Repeated for 15–25 Items)

For each item `i` from 1 to `[Role_C_NumItems: 15–25]`:

> [!NOTE] Decision [i] of [Total]
> 
> **Decision details:** Proposed contribution rate: [ContributionRate]%
> 
> **A reason this is appropriate:**
> 
> - *Input Field:* `Argue why it IS appropriate...`
> 
> **A reason this is not appropriate:**
> 
> - *Input Field:* `Argue why it is NOT appropriate...`
> 
> **Your final decision:**
> 
> - *Choice:* `[Appropriate | Not Appropriate]`

---

### Stage 5: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 6: Study Complete

> [!NOTE] Study Complete
> 
> Thank you for your participation!
> 
> You have earned a total of **[total-points] points** from the Public Goods Game task. This corresponds to a bonus payment of **$[total-usd]**.