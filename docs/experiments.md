# Occam's razor and the impartial spectator: explaining 'social preferences' as rational action

In this series of experiments, we replicate several classic behavioural economics experiments, each one featuring key experimental manipulations to test how communication and normative community assessments shape rational decision-making and coordination:

1. **Pre-Play Communication (Promises):** Senders can send free-form, non-identifying messages (<500 characters) to their counterpart before decisions are made. In some variants, these messages may include promises regarding intentions to share payoffs.
2. **Community Assessments:** When participants propose allocations or actions, they receive a normative signal in the form of a community assessment (aggregated evaluations from independent third-party observers in Role C) classifying the choice as "fair", "a promise", or "appropriate". In some conditions, participants are informed that their partner will also see this assessment.
3. **Decision Revisions:** After receiving community feedback, proposers are given the opportunity to revise their initial proposal or decision before it is finalized.

---

## Experimental Games & Complete Protocol Documents

Each economic game has a dedicated, full-text documentation file detailing all instructions, comprehension checks, decision interfaces, feedback screens, and trial outcomes for every participant role:

- **[Trust Game / Investment Game](experiments/trust-game.md)** (`docs/experiments/trust-game.md`)
  - *Roles:* Role A (Trustor), Role B (Trustee), Role C (Community Assessor)
  - *Key Manipulations:* Pre-play messaging, die-roll reciprocity, community assessment of promises.
- **[Ultimatum Game & Dictator Game](experiments/ultimatum-game.md)** (`docs/experiments/ultimatum-game.md`)
  - *Roles:* Role A (Proposer), Role B (Responder / Receiver), Role C (Community Assessor)
  - *Key Manipulations:* `[DICTATOR_MODE: true | false]`, free-form messaging, community assessment of fairness, offer revision.
- **[Power to Take Game](experiments/power-to-take-game.md)** (`docs/experiments/power-to-take-game.md`)
  - *Roles:* Role A (Proposer), Role B (Responder), Role C (Community Assessor)
  - *Key Manipulations:* Take-rate setting, endowment destruction in retaliation, community assessment of take rates.
- **[Third-Party Punishment Game](experiments/third-party-punishment.md)** (`docs/experiments/third-party-punishment.md`)
  - *Roles:* Role A (Punisher), Role C (Community Assessor)
  - *Key Manipulations:* Punishment-rate setting on Dictator allocations, community assessment of punishment severity.
- **[Public Goods Game](experiments/public-goods-game.md)** (`docs/experiments/public-goods-game.md`)
  - *Roles:* Role A (Contributor), Role C (Community Evaluator)
  - *Key Manipulations:* Contribution rates, multiplier variation (`[PGG_MULTIPLIER]`), community assessment of contribution appropriateness.

---

## Shared Experimental Stages

All experiments share identical consent, post-task questionnaire, and completion screens:
- **[Informed Consent Form](consent-form.md)** (`docs/consent-form.md`): Full digital consent agreement text, scrolling requirement, and participant confirmation.
- **[Post-Task Questionnaire & Study Completion](post-task-questionnaire.md)** (`docs/post-task-questionnaire.md`): Demographics (age, gender, education), economic fairness beliefs, general trust Likert scale questions, free-form comments, and Prolific completion code redirect.

---

## Global Experimental Flow

All experiments follow a consistent, 10-stage sequential flow engine implemented in the platform:

1. **Informed Consent Screen**
2. **Paginated Instructions**
3. **Comprehension / Attention Checks** (2 attempts allowed per question)
4. **Active Task / Messaging / Initial Proposal**
5. **Community Feedback** (Conditional on `[SHOW_COMMUNITY_FEEDBACK: true]`)
6. **Decision Revision** (Conditional on `[SHOW_COMMUNITY_FEEDBACK: true]`)
7. **Counterpart Decision / Interaction Resolution**
8. **Trial Outcome Summary & Payoff Calculation**
9. **Post-Task Questionnaire**
10. **Study Completion & Prolific Return**

Refer to the individual experiment markdown files above for the exact, verbatim text and question formatting for each role.