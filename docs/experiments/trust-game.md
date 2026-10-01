# Trust Game (Investment Game)

This document details the full, verbatim participant-facing text for all instructions, comprehension checks, decision interfaces, feedback messages, and outcome displays in the **Trust Game**, organized chronologically by role according to the platform's experimental flow.

---

## 1. Experimental Overview & Manipulated Variables

In this variant of the Trust Game (Berg, Dickhaut, & McCabe, 1995; Charness & Dufwenberg, 2006):
- **Role A (Trustor)** begins with an endowment and chooses whether to keep it (`OUT`) or transfer it to Person B (`IN`).
- **Role B (Trustee)** can send a free-form message to Person A prior to A's decision. If A transfers points, B chooses whether to keep all points (`DON'T ROLL`) or spend points to roll a 6-sided die (`ROLL`), which gives A a high payoff on numbers 2–6 and 0 points on a 1.
- **Role C (Community Assessor)** evaluates messages sent by B players and determines whether each message constitutes a "promise".

### Summary of Variables and Manipulations

| Variable / Parameter | Type | Possible Values & Description |
| :--- | :--- | :--- |
| `[showFeedback]` | Boolean Flag | `true` (Participant views community assessment before finalizing action) \| `false` (Feedback step is skipped) |
| `[partnerWillSee]` | Boolean Flag | `true` ("Your partner will also see this community feedback.") \| `false` ("Your partner will not see this community feedback.") |
| `[Endowment]` | Numeric | Default: `7 points` / `$1.75` (Value can vary across study conditions) |
| `[Role_C_NumItems]` | Numeric Range | Default: `15–25 messages` to evaluate (Value can vary) |
| `[consensusThreshold]` | Numeric | Default: `50%` agreement required to classify an item as a promise (Value can vary) |
| `[PartnerChoice_A]` | Choice Outcome | `IN` (Send points) \| `OUT` (Keep points) |
| `[PartnerChoice_B]` | Choice Outcome | `ROLL` (Roll die) \| `DON'T ROLL` (Keep all points) |
| `[DieRollOutcome]` | Stochastic Value | `1` (A receives 0 points) \| `2, 3, 4, 5, or 6` (A receives 12 points) |

---

## 2. Participant Flow Map

**Role A (Trustor):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. View Partner Message
  5. View Community Feedback *(if `showFeedback = true`)*
  6. Make Decision (IN / OUT)
  7. Trial Outcome
  8. Post-Task Survey (see separate file)
  9. Study Complete

**Role B (Trustee):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Compose Message
  5. Make Decision (ROLL / DON'T ROLL)
  6. Trial Outcome
  7. Post-Task Survey (see separate file)
  8. Study Complete

**Role C (Community Assessor):**

  1. Consent (see separate file)
  2. Instructions
  3. Attention Check
  4. Judge Messages (Repeated for 15–25 items)
  5. Post-Task Survey (see separate file)
  6. Study Complete

---

## 3. Role A (Trustor / Person A) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

**Page 1: Introduction & Task Rules**

> [!NOTE] Instructions: Introduction & Task Rules
> Thank you for participating in this experiment in decision making. The goal is to explore how people make decisions together. The study is expected to take around 15 minutes, and you will receive at least $3 for your participation, on top of any bonus payments based on your decisions in the game.
> 
> You will be randomly matched to another person (whom we'll call B) in this experiment. You will start out with 7 points. You can decide to:
> - Keep your 7 points OR
> - Send your 7 points to B.
> 
> If you decide not to send your points to B, the experiment ends and both you and B receive 7 points.
> 
> If you decide to send your points to B, B can then decide to:
> - Keep the 7 points for themselves (so they get 14 points total and you get nothing) OR
> - Spend 4 points to roll a 6-sided die (leaving them with 10 points) and possibly earn points for you. If B chooses this option, you will receive 12 points if the die comes up with anything except a 1; you'll get 0 points if a 1 comes up.

**Page 2: Payoff Table & Communication**

> [!NOTE] Payoff Table & Communication
> Here is a table of possible outcomes:
> 
> | Your decision | B's decision | Your earnings | B's earnings |
> | :--- | :--- | :--- | :--- |
> | Keep 7 points | — | 7 | 7 |
> | Send 7 points | Don't roll die | 0 | 14 |
> | Send 7 points | Roll die (lands on 1) | 0 | 10 |
> | Send 7 points | Roll die (lands on 2–6) | 12 | 10 |
> 
> The points mentioned above will be converted to bonus payments ($0.25 per point.) These bonus payments are in addition to the payment you and B will each receive for participation.
> 
> **Message from Person B**  
> Before you make your decision about whether to keep your points or send them to B, you will receive a message from B.
> 
> **Additional Details**  
> Upon completion of the study, the bonus payment will be made to you through Prolific. Neither the researchers nor any other participant will be able to personally identify you or know how much you have been paid or what decisions you made.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure that you understand the task.
> 
> 1. **tg-a-q1:** If you choose to send B your 7 points, and they choose NOT to roll the die, how many bonus points do you get?
>    - 5
>    - 10
>    - 0 *(Correct Answer)*
>    - 12
> 
> 2. **tg-a-q2:** If you choose NOT to send B your 7 points, how many bonus points does B get?
>    - 7 *(Correct Answer)*
>    - 10
>    - 0
>    - It depends on the outcome of the ROLL of the die
> 
> 3. **tg-a-q3:** When will you see the message B sent?
>    - Before you decide to give your points to B. *(Correct Answer)*
>    - After you decide to give your points to B.

---

### Stage 4: View Partner's Message

> [!NOTE] Partner's Message
> 
> "[Message composed by Person B; up to 500 characters, e.g.: 'I promise that if you send me your points, I will roll the die!']"

---

### Stage 5: View Community Feedback (Conditional on `[showFeedback: true]`)

*Presented only if community feedback manipulation is enabled.*

> [!NOTE] Community Feedback
> 
> The community has reviewed your partner's message. The community has determined that in order to consider a message as a promise, at least [consensusThreshold: default 50%]% of the community must consider it a promise.
> 
> *If community positive ratio >= 50%:*
> 
>    - `[Green Alert]` "The community **does** consider this a promise."
> 
> *If community positive ratio < 50%:*
> 
>    - `[Yellow Alert]` "The community **does not** consider this a promise."
> 
> *If `[partnerWillSee: true]`:*
> 
>    - "Your partner will also see this community feedback."
> 
> *If `[partnerWillSee: false]`:*
> 
>    - "Your partner will not see this community feedback."

---

### Stage 6: Make Decision (IN or OUT)

> [!NOTE] Your Decision
> 
> You have [Endowment: default 7] points. You can keep them (OUT) or send them to your partner (IN).
> 
> **Choices:**
> - `OUT` (Keep points)
> - `IN` (Send points)

---

### Stage 7: Trial Outcome Screen

> [!NOTE] Trial Completed
> 
> You have finished the decision task for this trial. Below is a summary of the decisions and outcomes.

**If Person A chose OUT:**

> *Your Choice:* "You chose to keep your 7 points (OUT)."
> 
> *Partner's Decision:* "Not applicable."
> 
> *Trial Outcome:* "You earned **7 points** (equivalent to a **$3.50** bonus payment)."

**If Person A chose IN:**

> *Your Choice:* "You chose to send your 7 points to Person B (IN)."
> 
> *Partner's Decision:*
> 
>   - *If B chose DON'T ROLL:* "Person B chose: DON'T ROLL the die."
>   - *If B chose ROLL:* "Person B chose: ROLL the die. The virtual die landed on [DieRollOutcome: 1–6]."
> 
> *Trial Outcome:*
> 
>   - *If B chose DON'T ROLL:* "You earned **0 points** (equivalent to a **$0.00** bonus payment)."
>   - *If B chose ROLL and die landed on 1:* "You earned **0 points** (equivalent to a **$0.00** bonus payment)."
>   - *If B chose ROLL and die landed on 2, 3, 4, 5, or 6:* "You earned **12 points** (equivalent to a **$6.00** bonus payment)."

---

### Stage 8: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 9: Study Complete

> [!NOTE] Study Complete
> 
> Thank you for your participation!
> 
> You have earned a total of **[total-points] points** from the Trust Game task. This corresponds to a bonus payment of **$[total-usd]**.

---

## 4. Role B (Trustee / Person B) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

**Page 1: Introduction & Task Rules**

> [!NOTE] Instructions: Introduction & Task Rules
> Thank you for participating in this experiment in decision making. The goal is to explore how people make decisions together. The study is expected to take around 15 minutes, and you will receive at least $2 for your participation, on top of any bonus payments based on your decisions.
> 
> You will be randomly matched to another person (whom we'll call A) in this experiment.
> 
> A will start out with 7 points. A can decide to:
> - Keep their 7 points OR
> - Send their 7 points to you.
> 
> If A decides not to send the 7 points to you, the experiment ends and both you and A receive 7 points.
> 
> If A decides to send the 7 points to you, you can then decide to:
> - Keep the 7 points (so you end up with 14 points and A ends up with 0 points) OR
> - Spend 4 points to roll a 6-sided die (leaving you with 10 points) and possibly earn points for A. If you choose this option, A will receive 12 points if the die comes up with anything except a 1; A will get 0 points if a 1 comes up.

**Page 2: Payoff Table & Message to Person A**

> [!NOTE] Payoff Table & Message to Person A
> Here is a table of possible outcomes:
> 
> | A's decision | Your decision | Your earnings | A's earnings |
> | :--- | :--- | :--- | :--- |
> | Keep 7 points | — | 7 | 7 |
> | Send 7 points | Don't roll die | 14 | 0 |
> | Send 7 points | Roll die (lands on 1) | 10 | 0 |
> | Send 7 points | Roll die (lands on 2–6) | 10 | 12 |
> 
> The points mentioned above will be converted to bonus payments ($0.25 per point). These bonus payments are in addition to the payment you and A will each receive for participation.
> 
> ## Message to Person A
> 
> Before A makes their decision, you will send a message to Person A. Feel free to say anything you like, as long as it doesn't reveal your identity (e.g., don't include your name or Prolific ID). This is your chance to communicate with your partner before they make their decision.
> 
> ## Additional Details
> 
> Upon completion of the study, the bonus payment will be made to you through Prolific. Neither the researchers nor any other participant will be able to personally identify you or know how much you have been paid or what decisions you made.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure that you understand the task.
> 
> 1. **tg-b-q1:** If A sends you 7 points, and you choose NOT to roll the die, how many bonus points does A get?
>    - 5
>    - 10
>    - 0 *(Correct Answer)*
>    - 12
> 
> 2. **tg-b-q2:** If A chooses NOT to send you 7 points, how many bonus points do you get?
>    - 7 *(Correct Answer)*
>    - 10
>    - 0
>    - It depends on the outcome of the ROLL of the die
> 
> 3. **tg-b-q3:** When will you send the message to A?
>    - Before A decides to give their points to you. *(Correct Answer)*
>    - After A decides to give their points to you.

---

### Stage 4: Compose Message to Person A

> [!NOTE] Message to Person A
> 
> Before A makes their decision, you will send a message to Person A. Feel free to say anything you like, as long as it doesn't reveal your identity (e.g., don't include your name or Prolific ID).
> 
> *Text input field (up to 500 characters)*

---

### Stage 5: Make Decision (ROLL or DON'T ROLL)

> [!NOTE] Your Decision
> 
> Person A chose IN (sent their points to you). You can choose to ROLL the die or DON'T ROLL.
> 
> **Choices:**
> 
> - `DON'T ROLL` (Keep all 14 points)
> - `ROLL` (Spend 4 points to roll the die)

---

### Stage 6: Trial Outcome Screen

> [!NOTE] Trial Completed
> 
> You have finished the decision task for this trial. Below is a summary of the decisions and outcomes.

**If Person B chose DON'T ROLL:**

> *Your Choice:* "You chose NOT to roll the die (DON'T ROLL)."
> 
> *Partner's Decision:* "Person A chose to send you their 7 points (IN)."
> 
> *Trial Outcome:* "You earned **14 points** (equivalent to a **$7.00** bonus payment)."

**If Person B chose ROLL:**

> *Your Choice:* "You chose to spend 4 points to roll the virtual die (ROLL)."
> 
> *Partner's Decision:* "Person A chose to send you their 7 points (IN). The virtual die landed on [DieRollOutcome: 1–6]. Your partner (Person A) receives [0 points (if 1) / 12 points (if 2–6)]."
> 
> *Trial Outcome:* "You earned **10 points** (equivalent to a **$5.00** bonus payment)."

---

### Stage 7: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 8: Study Complete

> [!NOTE] Study Complete
> 
> Thank you for your participation!
> 
> You have earned a total of **[total-points] points** from the Trust Game task. This corresponds to a bonus payment of **$[total-usd]**.

---

## 5. Role C (Community Assessor) Full Text

### Stage 1: Consent Screen
*See consent form for full text.*

---

### Stage 2: Instructions (Paginated)

**Page 1: Overview & Pairing System**

> [!NOTE] Overview & Pairing System
> You will be part of a group with about 10 other people. In this study, you will help decide if the messages you read from other people in the study contain promises about decisions they will make in a pair.
> 
> Here's how it works:
> 
> ## The Pairing System
> 
> - There are two roles in each pair: A and B.
> - Each pair has one A and one B.
> - B sends a message to their A partner.
> - You will read these messages and as a member of your group decide if they include any promises.
> - A and B will be told the group's decision.
> - A and B will then each make a decision.

**Page 2: Pair Decisions & Scoring**

> [!NOTE] The Pair Decisions & Scoring
> ## The Pair Decisions
> 
> - A decides whether to stay in the interaction or leave. They choose "IN" to stay or "OUT" to leave.
> - B decides if they want to roll a virtual die or not if A chooses "IN".
> - B has two choices:
>   - "ROLL": The computer rolls a fair six-sided die.
>   - "DON'T ROLL": No die is rolled.
> 
> ## Scoring
> 
> - If A chooses "OUT": Both A and B get 5 points each. B's choice doesn't matter.
> - If A chooses "IN" and B chooses "DON'T ROLL": B gets 14 points, and A gets 0 points.
> - If A chooses "IN" and B chooses "ROLL": B gets 10 points. The die roll decides A's points:
>   - Rolling a 1: A gets 0 points.
>   - Rolling a 2, 3, 4, 5, or 6: A gets 12 points.
> - Each point is worth 50 cents.
> - Payments are in addition to guaranteed payments. A gets a guaranteed payment of $3. B gets a guaranteed payment of $4. B's payment is higher because they have to come back a second time to finish the study.
> 
> Here is a table of possible outcomes:
> 
> | A's decision | B's decision | A's earnings | B's earnings |
> | :--- | :--- | :--- | :--- |
> | OUT | — | 7 | 7 |
> | IN | DON'T ROLL | 0 | 14 |
> | IN | ROLL (lands on 1) | 0 | 10 |
> | IN | ROLL (lands on 2–6) | 12 | 10 |

**Page 3: Messages & Concept of Promises**

> [!NOTE] Messages & Concept of Promises
> Before A makes their decision, B can send any message they want to A, as long as it doesn't reveal B's identity and remains under 500 characters. Both A and B will know what decision your group made about B's message before they make their own decisions.
> 
> ## What are promises?
> 
> In this study we use the word "promise" like they do in court. A promise is when someone says they are going to do something and the person they say it to is entitled to trust them to do it, to rely on the promise.
> 
> Courts hold people accountable for breaking a promise if it was reasonable to trust that the person would do what they say. People don't have to say the words "I promise" to make a promise. Sometimes, even when someone says "I promise" they haven't really made a promise because the person who got the promise wasn't entitled to rely on it.
> 
> For example, if people are playing a game, like poker, it's not reasonable to believe someone if they "promise" that they have a weak hand – poker is all about convincing others that your hand is good, even when it is not.

**Page 4: Task Description & Group Incentives**

> [!NOTE] Your Task & Group Decision
> Your role in this study is to read a set of messages and decide for each one: is this really a promise?
> 
> You can think of it this way: suppose your friend told you they sent a message in this study but then they didn't roll. Would you think they are a bad person?
> 
> For each message we show you, we'll ask you for each message to provide a reason it might be reasonable to say "this is a promise" and a reason it might not be. You can think of this like being a lawyer first for the A player arguing "it's a promise" and then for the B player arguing "no it's not."
> 
> ## Group Decision
> 
> - You'll be given 15–25 messages to read and asked to write down your reasons "for" and "against" saying "it's a promise".
> - After you write your reasons down for each message, we'll ask you what your decision is: promise or not.
> - We will give you 1 bonus point every time you make a decision that matches what the majority of people in your group decide.
> - Each point is worth 20 cents. So you could make as much as $3 to $5 in bonus payments.
> - Bonus points are in addition to your guaranteed payment of $5.
> - The group decision will be based on what the majority decides.

---

### Stage 3: Comprehension Questions

> [!NOTE] Comprehension Questions
> 
> Please answer the following questions to ensure that you understand the task.
> 
> 1. **tg-c-q1:** True or false: A can end up with nothing if A chooses IN.
>    - `True` *(Correct Answer)*
>    - `False`
> 
> 2. **tg-c-q2:** When does A see the group decision about whether B's message is a promise or not?
>    - `Before deciding IN or OUT` *(Correct Answer)*
>    - `After deciding IN or OUT`
> 
> 3. **tg-c-q3:** For each message you read you must think of:
>    - `A reason in favor of deciding it's a promise`
>    - `A reason against deciding it's a promise`
>    - `Both` *(Correct Answer)*
> 
> 4. **tg-c-q4:** Suppose you read 20 messages and you agree with the majority decision 10 times. How many bonus points do you earn?
>    - `20`
>    - `10` *(Correct Answer)*
>    - `5`

---

### Stage 4: Judge Messages (Repeated for 15–25 Items)

For each item `i` from 1 to `[Role_C_NumItems: 15–25]`:

> [!NOTE] Message [i] of [Total]
> 
> **Message:** [Message text submitted by a Person B participant]
> 
> **A reason this is a promise:**
> 
> - *Input Field:* `Argue why it IS a promise...`
> 
> **A reason this is not a promise:**
> 
> - *Input Field:* `Argue why it is NOT a promise...`
> 
> **Your final decision:**
> 
> - *Choice:* `[Promise | Not a Promise]`

---

### Stage 5: Post-Task Survey
*See separate file for full text and options.*

---

### Stage 6: Study Complete

> [!NOTE] Study Complete
> 
> Thank you for your participation!
> 
> You have earned a total of **[total-points] points** from the Trust Game task. This corresponds to a bonus payment of **$[total-usd]**.
