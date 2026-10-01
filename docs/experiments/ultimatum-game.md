# Ultimatum Game & Dictator Game

This document details the full, verbatim participant-facing text for all instructions, comprehension checks, decision interfaces, feedback messages, and outcome displays in both the **Ultimatum Game** and **Dictator Game**, organized chronologically by role according to the platform's experimental flow.

---

## 1. Experimental Overview & Manipulated Variables

This experiment investigates bargaining, promissory communication, and third-party normative evaluations in bilateral resource division games:

- **Ultimatum Game Variant:** Person A proposes a split of an endowment; Person B can Accept (payoffs realized as proposed) or Reject (both receive 0 points).
- **Dictator Game Variant:** Person A unilaterally determines the split of the endowment; Person B cannot reject the allocation.
- In community feedback conditions, Person A receives a normative assessment of their proposed split before deciding whether to revise it.
- **Role C (Community Assessor)** observes proposals and messages and judges whether messages constitute binding promises.

### Summary of Variables and Manipulations

| Variable / Parameter | Type | Possible Values & Description |
| :--- | :--- | :--- |
| `[dictatorMode]` | Boolean Feature Flag | `false` (Ultimatum Game: Responder can Accept or Reject) \| `true` (Dictator Game: Receiver must accept offer) |
| `[showFeedback]` | Boolean Feature Flag | `true` (Proposer views community feedback and can revise offer) \| `false` (Feedback and revision steps skipped) |
| `[partnerWillSee]` | Boolean Feature Flag | `true` ("Your partner will also see this community feedback.") \| `false` ("Your partner will not see this community feedback.") |
| `[Endowment]` | Numeric | Default: `10 points` / `$2.50` (Value can vary across study conditions) |
| `[consensusThreshold]` | Numeric | Default: `50%` agreement required to consider an offer fair (Value can vary) |
| `[Role_C_NumItems]` | Numeric Range | Default: `15–25 messages` to evaluate (Value can vary) |
| `[ProposerOffer]` | Choice Variable | Integer between `0` and `[Endowment: 10]` points offered to Person B |
| `[ProposerKept]` | Computed Value | `[Endowment] - [ProposerOffer]` points kept by Person A |
| `[ResponderDecision]` | Choice Variable | `ACCEPT` (Offer accepted) \| `REJECT` (Offer rejected, both get 0 points) |

---

## 2. Participant Flow Map

**Role A (Proposer / Person A):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Make Offer (Money Slider)
  5. View Community Feedback *(if `showFeedback = true`)*
  6. Revise Offer *(if `showFeedback = true`)*
  7. Trial Outcome
  8. Post-Task Survey (see separate file)

**Role B (Responder / Receiver / Person B):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. View Proposer's Offer
  5. View Community Feedback *(if `showFeedback = true`)*
  6. Make Decision (Accept/Reject in Ultimatum | Acknowledge in Dictator)
  7. Trial Outcome
  8. Post-Task Survey (see separate file)

**Role C (Community Assessor):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Judge Proposals (Repeated for 15–25 items)
  5. Post-Task Survey (see separate file)

---

## 3. Role A (Proposer / Person A) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

#### Condition A: Ultimatum Game Variant (`[dictatorMode: false]`)  

**Page 1: Proposal & Message**

> [!NOTE] Instructions: Proposer (Person A)
> You have been randomly paired with another participant, Person B. 
>
> You have 10 points to divide between yourself and Person B. You will make a proposal for how to split these 10 points. 
<!-- >
> **Message to Person B**  
> Along with your proposal, you will send a message (up to 500 characters) to Person B. This is your chance to communicate. Please do not include identifying information. -->

**Page 2: Community Assessment**

> [!NOTE] Community Assessment
> Before your proposal is finalized, a group of other participants (the Community) will view your proposed split and message. They will provide a judgment on whether your proposal is "fair".
>
> You will see this feedback and have one opportunity to **revise** your proposal if you wish.

**Page 3: Final Outcome**

> [!NOTE] Final Outcome
> Person B will see your final proposal.  
> Person B can **Accept** or **Reject** your offer. If they Accept, the points are distributed as proposed. If they Reject, both of you receive **0 points**.

---

#### Condition B: Dictator Game Variant (`[dictatorMode: true]`)  

**Page 1: Proposal & Message**

> [!NOTE] Instructions: Proposer (Person A)
> You have been randomly paired with another participant, Person B. 
>
> You have 10 points to divide between yourself and Person B. You will make a proposal for how to split these 10 points. 
<!-- >
> **Message to Person B**  
> Along with your proposal, you will send a message (up to 500 characters) to Person B. This is your chance to communicate. Please do not include identifying information. -->

**Page 2: Community Assessment**

> [!NOTE] Community Assessment
> Before your proposal is finalized, a group of other participants (the Community) will view your proposed split and message. They will provide a judgment on whether your proposal is "fair".
>
> You will see this feedback and have one opportunity to **revise** your proposal if you wish.

**Page 3: Final Outcome**

> [!NOTE] Final Outcome
> Person B will see your final proposal.  
> Person B receives the points you offered automatically; they cannot reject.

---

### Stage 3: Comprehension Questions  

**Condition A: Ultimatum Game Variant** 


> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Proposer.
> 
> 1. **ug-a-q1:** If you offer Person B 4 points and they REJECT the offer, how many points do you receive?
>    - 6
>    - 4
>    - 0 *(Correct Answer)*
>    - 10
>
> 2. **ug-a-q2:** Can you revise your proposal after seeing the community assessment?
>    - Yes *(Correct Answer)*
>    - No

**Condition B: Dictator Game Variant** 


> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Proposer.
> 
> 1. **dg-a-q1:** If you offer Person B 4 points, how many points do you keep for yourself?
>    - 4
>    - 6 *(Correct Answer)*
>    - 10
>    - 0
> 
> 2. **dg-a-q2:** Can you revise your proposal after seeing the community assessment?
>    - Yes *(Correct Answer)*
>    - No

---

### Stage 4: Make Offer (Money Slider)

> [!NOTE] Make Offer
> 
> You have [Endowment: default 10] points to divide between yourself and your partner.  
> You can choose how many points to offer to Person B using the slider below.
> 
> **Slider:**
> 
>    - *Left Display (Role A):* `You keep: [10 - offer] pts ($[USD])`
>    - *Right Display (Role B):* `Partner receives: [offer] pts ($[USD])`
>    - *Bounds:* 0 to 10 points (step size 1 point)
>    - *Initial Value:* 5 points
>    - *Hint:* "Move the slider to choose how many points to give to your partner."

---

### Stage 5: View Community Feedback (if feedback is available)

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

### Stage 6: Revise Offer (if feedback is available)

*Allows the proposer to adjust or confirm their offer following community feedback.*

- Re-renders the **Interactive Money Slider** interface from Stage 5.
- Displays the previously selected offer as the starting point.

---

### Stage 7: Trial Outcome Screen

> [!NOTE] Trial Completed
> 
> You have finished the decision task for this trial. Below is a summary of the decisions and outcomes.

**Dictator Game Variant**  

> *Your Choice:* "You proposed to keep [10 - offer] points and offer [offer] points to Person B."
> 
> *Trial Outcome:* "You earned **[10 - offer] points** (equivalent to a **$[USD]** bonus payment)."

**Ultimatum Game Variant**  

> *Your Choice:* "You proposed to keep [10 - offer] points and offer [offer] points to Person B."
> 
> *Partner's Decision:* "Person B chose: [ACCEPT | REJECT]."
> 
> *Trial Outcome:*
> 
>    - *If ACCEPT:* 
>        - "The offer was accepted. You receive **[10 - offer] points** (equivalent to a **$[USD]** bonus payment)."
>    - *If REJECT:* 
>        - "The offer was rejected. Both players receive **0 points** (equivalent to a **$0.00** bonus payment)."

---

### Stage 8: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 9: Study Complete

> [!NOTE] Study Complete
>
> Thank you for your participation!
>
> You have earned a total of **[total-points] points** from the [Experiment Name] task. This corresponds to a bonus payment of **$[total-usd]**.  

---

## 4. Role B (Responder / Receiver / Person B) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

#### Condition A: Ultimatum Game Variant (`[dictatorMode: false]`) — Responder

**Page 1: Overview & Message**

> [!NOTE] Instructions: Responder (Person B)
> 
> You have been randomly paired with another participant, Person A. 
>
> Person A has 10 points to divide. They will propose a split of these points between the two of you.

**Page 2: Your Decision**

> [!NOTE] Your Decision
> 
> You will see Person A's proposal. 
>
> You can **Accept** or **Reject** the offer. If you Accept, you get the points offered and A keeps the rest. If you Reject, **both of you receive 0 points**.

---

#### Condition B: Dictator Game Variant (`[dictatorMode: true]`) — Receiver

**Page 1: Overview & Message**

> [!NOTE] Instructions: Receiver (Person B)
> You have been randomly paired with another participant, Person A. 
>
> Person A has 10 points to divide. They will propose a split of these points between the two of you.

**Page 2: The Outcome**

> [!NOTE] The Outcome
> You will see Person A's proposal. 
>
> You simply receive the points offered. You do not have the option to reject.

---

### Stage 3: Comprehension Questions

**Condition A: Ultimatum Game Variant (`[dictatorMode: false]`)**

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Responder.
> 
> 1. **ug-b-q1:** If you REJECT the proposal, how many points does Person A receive?
>      - `The amount they kept`
>      - `0` *(Correct Answer)*
>      - `10`
>
> 2. **ug-b-q2:** Can you reject the offer in this game?
>      - `Yes` *(Correct Answer)*
>      - `No`

---

**Condition B: Dictator Game Variant (`[dictatorMode: true]`)**

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure you understand your role as Receiver.
> 
> 1. **dg-b-q1:** Can you reject the proposal from Person A?
>      - `Yes`
>      - `No` *(Correct Answer)*
>
> 2. **dg-b-q2:** How many points will you receive if Person A offers you 3 points?
>      - `3` *(Correct Answer)*
>      - `7`
>      - `0`
>      - `10`

---

### Stage 4: View Community Feedback (Conditional on `[showFeedback: true]`)

*Presented if the experimental condition displays community feedback to the responder.*

> [!NOTE] Community Feedback
> 
> The community has reviewed your partner's proposal. The community has determined that in order to consider a decision as fair, at least [consensusThreshold: default 50%]% of the community must consider it fair.
> 
> *If community positive ratio >= 50%:*    
>    - `[Green Alert]` "The community **does** consider this fair."
> 
> *If community positive ratio < 50%:*    
>    - `[Yellow Alert]` "The community **does not** consider this fair."
> 
> *If `[partnerWillSee: true]`:*    
>    - "Your partner will also see this community feedback."
> 
> *If `[partnerWillSee: false]`:*    
>    - "Your partner will not see this community feedback."

---

### Stage 5: Make Decision (Accept/Reject or Acknowledge)

#### Condition A: Ultimatum Game Variant (`[dictatorMode: false]`)

> [!NOTE] Your Decision
> 
> "Person A proposes the following division of the [Endowment: 10] points:
>
> **Person A keeps:** [10 - offer] points  
> **You receive:** [offer] points  
> 
> You can Accept this proposal, or Reject it. If you reject, both of you receive 0 points."

---

#### Condition B: Dictator Game Variant (`[dictatorMode: true]`)

> [!NOTE] Division Details
> 
> "Person A has decided to divide the [Endowment: 10] points as follows:
>
> **Person A keeps:** [10 - offer] points  
> **You receive:** [offer] points"

---

### Stage 6: Trial Outcome Screen

> [!NOTE] Trial Completed
> 
> You have finished the decision task for this trial. Below is a summary of the decisions and outcomes.


**Dictator Game Variant (`[dictatorMode: true]`):**

> *Partner's Decision:* "Person A proposed to offer you [offer] points (keeping [10 - offer] points)."
> 
> *Trial Outcome:* "You earned **[offer] points** (equivalent to a **$[USD]** bonus payment)."


**Ultimatum Game Variant (`[dictatorMode: false]`):**

> *Your Choice:* "You chose to [ACCEPT | REJECT] the proposal."
> 
> *Partner's Decision:* "Person A proposed to offer you [offer] points (keeping [10 - offer] points)."
> 
> *Trial Outcome:*
> 
>   - *If ACCEPT:* "You receive **[offer] points** (equivalent to a **$[USD]** bonus payment)."
>   - *If REJECT:* "Both players receive **0 points** (equivalent to a **$0.00** bonus payment)."

---

### Stage 7: Post-Task Survey
*See separate file for full text and options.*

### Stage 8: Study Complete

> [!NOTE] Study Complete
>
> Thank you for your participation!
>
> You have earned a total of **[total-points] points** from the [Experiment Name] task. This corresponds to a bonus payment of **$[total-usd]**.

---

## 5. Role C (Community Assessor) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

**Page 1: Overview**

> [!NOTE] Instructions: Community Assessor
> In this study, you will observe interactions between other participants (Proposers and Responders) in the Ultimatum Game.
>
> Your task is to assess proposals sent by Proposers and decide if they are appropriate.

*(Note: In Dictator mode, "Responders" is replaced with "Receivers" and "Ultimatum Game" is replaced with "Dictator Game".)*

**Page 2: Bonus Payment & Evaluation Steps**

> [!NOTE] Bonus Payment & Evaluation Steps
> You will be shown several proposals. For each message:
> 
> 1. Provide a reason why it might be appropriate.
> 2. Provide a reason why it might NOT be appropriate.
> 3. Make a final judgment: Appropriate or Not appropriate.
>
> If your judgment matches the majority of other Assessors in your group, you will receive a **bonus payment**.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Question
> 
> Please answer the following questions to ensure you understand your role as Community Assessor.
> 
> 1. **ug-c-q1 (or dg-c-q1):** Will you receive a bonus if your judgment matches the majority of your group?
>      - `Yes` *(Correct Answer)*
>      - `No`

---

### Stage 4: Judge Proposals (Repeated for 15–25 Items)

For each item `i` from 1 to `[Role_C_NumItems: 15–25]`:

> [!NOTE] Proposal [i] of [Total]
> 
> **Proposal:** [Proposal from the Proposer participant]
> 
> **A reason this is appropriate:**
> 
> - *Input Field:* `Argue why this is appropriate...`
> 
> **A reason this is not appropriate:**
> 
> - *Input Field:* `Argue why this is not appropriate...`
> 
> **Your final decision:**
> 
> - *Choice:* `[Appropriate | Not appropriate]`

---

### Stage 5: Post-Task Survey
*See separate file for full text and options.*

### Stage 6: Study Complete

> [!NOTE] Study Complete
>
> Thank you for your participation!
>
> You have earned a total of **[total-points] points** from the [Experiment Name] task. This corresponds to a bonus payment of **$[total-usd]**.