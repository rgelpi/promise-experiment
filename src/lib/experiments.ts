import type {
  ExperimentConfig,
  ExperimentSlug,
  AttentionCheckConfig,
  InstructionPage,
} from "./types";

// ── Feature Flags ─────────────────────────────────────────────────────────────

export const SHOW_COMMUNITY_FEEDBACK =
  process.env.NEXT_PUBLIC_SHOW_COMMUNITY_FEEDBACK === "true";

export const DICTATOR_MODE =
  process.env.NEXT_PUBLIC_DICTATOR_MODE === "true";

/** Multiplier applied to the public goods pool before equal division. Default: 1.5 */
export const PGG_MULTIPLIER: number =
  Number(process.env.NEXT_PUBLIC_PGG_MULTIPLIER) || 1.5;

// ── Instruction loader helpers ────────────────────────────────────────────────
// Instruction markdown is split by "---" into pages for paginated display.
function splitIntoPages(markdown: string): InstructionPage[] {
  return markdown
    .split(/^---$/m)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((content) => ({ content }));
}

// ── Attention Checks ──────────────────────────────────────────────────────────

const trustGameAttentionChecks: Record<string, AttentionCheckConfig> = {
  A: {
    preamble:
      "Please answer the following questions to ensure that you understand the task. " +
      "The instructions for the study are copied at the bottom of the page to help you find the answers. " +
      "You will have two chances to get each question right.",
    questions: [
      {
        id: "tg-a-q1",
        text: "If you choose to send B your 7 points, and they choose NOT to roll the die, how many bonus points do you get?",
        type: "multiple-choice",
        options: ["5", "10", "0", "12"],
        correctAnswer: "2", // index of "0"
        maxAttempts: 2,
      },
      {
        id: "tg-a-q2",
        text: "If you choose NOT to send B your 7 points, how many bonus points does B get?",
        type: "multiple-choice",
        options: ["7", "10", "0", "It depends on the outcome of the ROLL of the die"],
        correctAnswer: "0", // index of "7"
        maxAttempts: 2,
      },
      {
        id: "tg-a-q3",
        text: "When will you see the message B sent?",
        type: "multiple-choice",
        options: [
          "Before you decide to give your points to B.",
          "After you decide to give your points to B.",
        ],
        correctAnswer: "0",
        maxAttempts: 2,
      },
    ],
  },
  B: {
    preamble:
      "Please answer the following questions to ensure that you understand the task. " +
      "The instructions for the study are copied at the bottom of the page to help you find the answers. " +
      "You will have two chances to get each question right.",
    questions: [
      {
        id: "tg-b-q1",
        text: "If A sends you 7 points, and you choose NOT to roll the die, how many bonus points does A get?",
        type: "multiple-choice",
        options: ["5", "10", "0", "12"],
        correctAnswer: "2",
        maxAttempts: 2,
      },
      {
        id: "tg-b-q2",
        text: "If A chooses NOT to send you 7 points, how many bonus points do you get?",
        type: "multiple-choice",
        options: ["7", "10", "0", "It depends on the outcome of the ROLL of the die"],
        correctAnswer: "0",
        maxAttempts: 2,
      },
      {
        id: "tg-b-q3",
        text: "When will you send the message to A?",
        type: "multiple-choice",
        options: [
          "Before A decides to give their points to you.",
          "After A decides to give their points to you.",
        ],
        correctAnswer: "0",
        maxAttempts: 2,
      },
    ],
  },
  C: {
    preamble:
      "Please answer the following questions to ensure that you understand the task. " +
      "The instructions for the study are copied at the bottom of the page to help you find the answers. " +
      "You will have two chances to get each question right.",
    questions: [
      {
        id: "tg-c-q1",
        text: "True or false: A can end up with nothing if A chooses IN.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "0", // True
        maxAttempts: 2,
      },
      {
        id: "tg-c-q2",
        text: "When does A see the group decision about whether B's message is a promise or not?",
        type: "multiple-choice",
        options: ["Before deciding IN or OUT", "After deciding IN or OUT"],
        correctAnswer: "0",
        maxAttempts: 2,
      },
      {
        id: "tg-c-q3",
        text: "For each message you read you must think of:",
        type: "multiple-choice",
        options: [
          "A reason in favor of deciding it's a promise",
          "A reason against deciding it's a promise",
          "Both",
        ],
        correctAnswer: "2",
        maxAttempts: 2,
      },
      {
        id: "tg-c-q4",
        text: "Suppose you read 20 messages and you agree with the majority decision 10 times. How many bonus points do you earn?",
        type: "multiple-choice",
        options: ["20", "10", "5"],
        correctAnswer: "1",
        maxAttempts: 2,
      },
    ],
  },
};

const ultimatumGameAttentionChecks: Record<string, AttentionCheckConfig> = {
  A: {
    preamble: "Please answer the following questions to ensure you understand your role as Proposer.",
    questions: [
      {
        id: "ug-a-q1",
        text: "If you offer Person B 4 points and they REJECT the offer, how many points do you receive?",
        type: "multiple-choice",
        options: ["6", "4", "0", "10"],
        correctAnswer: "2",
        maxAttempts: 2,
      },
      {
        id: "ug-a-q2",
        text: "Can you revise your proposal after seeing the community assessment?",
        type: "true-false",
        options: ["Yes", "No"],
        correctAnswer: "0",
        maxAttempts: 2,
      }
    ]
  },
  B: {
    preamble: "Please answer the following questions to ensure you understand your role as Responder.",
    questions: [
      {
        id: "ug-b-q1",
        text: "If you REJECT the proposal, how many points does Person A receive?",
        type: "multiple-choice",
        options: ["The amount they kept", "0", "10"],
        correctAnswer: "1",
        maxAttempts: 2,
      },
      {
        id: "ug-b-q2",
        text: "Can you reject the offer in this game?",
        type: "true-false",
        options: ["Yes", "No"],
        correctAnswer: "0",
        maxAttempts: 2,
      }
    ]
  },
  C: {
    preamble: "Please answer the following questions to ensure you understand your role as Community Assessor.",
    questions: [
      {
        id: "ug-c-q1",
        text: "Will you receive a bonus if your judgment matches the majority of your group?",
        type: "true-false",
        options: ["Yes", "No"],
        correctAnswer: "0",
        maxAttempts: 2,
      }
    ]
  }
};

const dictatorGameAttentionChecks: Record<string, AttentionCheckConfig> = {
  A: {
    preamble: "Please answer the following questions to ensure you understand your role as Proposer.",
    questions: [
      {
        id: "dg-a-q1",
        text: "If you offer Person B 4 points, how many points do you keep for yourself?",
        type: "multiple-choice",
        options: ["4", "6", "10", "0"],
        correctAnswer: "1",
        maxAttempts: 2,
      },
      {
        id: "dg-a-q2",
        text: "Can you revise your proposal after seeing the community assessment?",
        type: "true-false",
        options: ["Yes", "No"],
        correctAnswer: "0",
        maxAttempts: 2,
      }
    ]
  },
  B: {
    preamble: "Please answer the following questions to ensure you understand your role as Receiver.",
    questions: [
      {
        id: "dg-b-q1",
        text: "Can you reject the proposal from Person A?",
        type: "true-false",
        options: ["Yes", "No"],
        correctAnswer: "1",
        maxAttempts: 2,
      },
      {
        id: "dg-b-q2",
        text: "How many points will you receive if Person A offers you 3 points?",
        type: "multiple-choice",
        options: ["3", "7", "0", "10"],
        correctAnswer: "0",
        maxAttempts: 2,
      }
    ]
  },
  C: {
    preamble: "Please answer the following questions to ensure you understand your role as Community Assessor.",
    questions: [
      {
        id: "dg-c-q1",
        text: "Will you receive a bonus if your judgment matches the majority of your group?",
        type: "true-false",
        options: ["Yes", "No"],
        correctAnswer: "0",
        maxAttempts: 2,
      }
    ]
  }
};

const powerToTakeAttentionChecks: Record<string, AttentionCheckConfig> = {
  A: {
    preamble: "Please answer the following questions to ensure you understand your role as Proposer.",
    questions: [
      {
        id: "ptt-a-q1",
        text: "What is the range of the 'take rate' you can set?",
        type: "multiple-choice",
        options: ["0-10%", "0-50%", "0-100%"],
        correctAnswer: "2",
        maxAttempts: 2,
      }
    ]
  },
  B: {
    preamble: "Please answer the following questions to ensure you understand your role as Responder.",
    questions: [
      {
        id: "ptt-b-q1",
        text: "What can you do to your endowment before Person A's take rate is applied?",
        type: "multiple-choice",
        options: ["Nothing", "Destroy a percentage of it", "Double it"],
        correctAnswer: "1",
        maxAttempts: 2,
      },
      {
        id: "ptt-b-q2",
        text: "If you destroy 100% of your endowment, how many points does Person A receive from you?",
        type: "multiple-choice",
        options: ["All of it", "The take rate percentage", "0"],
        correctAnswer: "2",
        maxAttempts: 2,
      }
    ]
  },
  C: {
    preamble: "Please answer the following questions to ensure you understand your role as Assessor.",
    questions: [
      {
        id: "ptt-c-q1",
        text: "What are you evaluating in this task?",
        type: "multiple-choice",
        options: ["Whether the take rate is fair", "Whether B destroyed money", "Both"],
        correctAnswer: "0",
        maxAttempts: 2,
      }
    ]
  }
};

const thirdPartyPunishmentAttentionChecks: Record<string, AttentionCheckConfig> = {
  A: {
    preamble: "Please answer the following questions to ensure you understand your role as Punisher.",
    questions: [
      {
        id: "tpp-a-q1",
        text: "Whose points are deducted if you assign a punishment rate?",
        type: "multiple-choice",
        options: ["The Dictator", "The Receiver", "Both"],
        correctAnswer: "0",
        maxAttempts: 2,
      },
      {
        id: "tpp-a-q2",
        text: "Can you revise your punishment rate after seeing community feedback?",
        type: "true-false",
        options: ["Yes", "No"],
        correctAnswer: "0",
        maxAttempts: 2,
      }
    ]
  },
  C: {
    preamble: "Please answer the following questions to ensure you understand your role as Assessor.",
    questions: [
      {
        id: "tpp-c-q1",
        text: "What are you evaluating?",
        type: "multiple-choice",
        options: ["The Dictator's split", "The Punisher's punishment rate", "Both"],
        correctAnswer: "1",
        maxAttempts: 2,
      }
    ]
  }
};

const publicGoodsGameAttentionChecks: Record<string, AttentionCheckConfig> = {
  A: {
    preamble:
      "Please answer the following questions to ensure you understand the task. " +
      "The instructions for the study are copied at the bottom of the page to help you find the answers. " +
      "You will have two chances to get each question right.",
    questions: [
      {
        id: "pgg-a-q1",
        text: "What happens to the total amount contributed to the common pool?",
        type: "multiple-choice",
        options: [
          "It is kept by the researchers.",
          "It is multiplied and then divided equally among all group members.",
          "It is given only to the person who contributed the most.",
        ],
        correctAnswer: "1",
        maxAttempts: 2,
      },
      {
        id: "pgg-a-q2",
        text: "If you contribute 0% of your endowment, what portion of the pool do you receive?",
        type: "multiple-choice",
        options: [
          "Nothing — only contributors receive a share.",
          "An equal share, the same as everyone else.",
          "Half the pool.",
        ],
        correctAnswer: "1",
        maxAttempts: 2,
      },
      {
        id: "pgg-a-q3",
        text: "Can you revise your contribution rate after seeing the community evaluation?",
        type: "true-false",
        options: ["Yes", "No"],
        correctAnswer: "0",
        maxAttempts: 2,
      },
    ],
  },
  C: {
    preamble:
      "Please answer the following questions to ensure you understand your role as Community Evaluator. " +
      "You will have two chances to get each question right.",
    questions: [
      {
        id: "pgg-c-q1",
        text: "What are you evaluating in this task?",
        type: "multiple-choice",
        options: [
          "Whether contribution rates are appropriate.",
          "Whether participants contributed more than average.",
          "Whether the pool was large enough.",
        ],
        correctAnswer: "0",
        maxAttempts: 2,
      },
      {
        id: "pgg-c-q2",
        text: "Will you receive a bonus if your evaluation matches the majority of other evaluators?",
        type: "true-false",
        options: ["Yes", "No"],
        correctAnswer: "0",
        maxAttempts: 2,
      },
    ],
  },
};

// ── Instructions ──────────────────────────────────────────────────────────────

const trustGameInstructions: Record<string, InstructionPage[]> = {
  A: splitIntoPages(`# Instructions
  
Thank you for participating in this experiment in decision making. The goal is to explore how people make decisions together. The study is expected to take around 15 minutes, and you will receive at least $3 for your participation, on top of any bonus payments based on your decisions in the game.

You will be randomly matched to another person (whom we'll call B) in this experiment. You will start out with 7 points. You can decide to:
- Keep your 7 points OR
- Send your 7 points to B.

If you decide not to send your points to B, the experiment ends and both you and B receive 7 points.

If you decide to send your points to B, B can then decide to:
- Keep the 7 points for themselves (so they get 14 points total and you get nothing) OR
- Spend 4 points to roll a 6-sided die (leaving them with 10 points) and possibly earn points for you. If B chooses this option, you will receive 12 points if the die comes up with anything except a 1; you'll get 0 points if a 1 comes up.

---

Here is a table of possible outcomes:

| Your decision | B's decision | Your earnings | B's earnings |
| Keep 7 points | — | 7 | 7 |
| Send 7 points | Don't roll die | 0 | 14 |
| Send 7 points | Roll die (lands on 1) | 0 | 10 |
| Send 7 points | Roll die (lands on 2–6) | 12 | 10 |

The points mentioned above will be converted to bonus payments ($0.50 per point.) These bonus payments are in addition to the payment you and B will each receive for participation.

## Message from Person B

Before you make your decision about whether to keep your points or send them to B, you will receive a message from B.

## Additional Details

Upon completion of the study, the bonus payment will be made to you through Prolific. Neither the researchers nor any other participant will be able to personally identify you or know how much you have been paid or what decisions you made.`),

  B: splitIntoPages(`# Instructions

Thank you for participating in this experiment in decision making. The goal is to explore how people make decisions together. The study is expected to take around 15 minutes, and you will receive at least $2 for your participation, on top of any bonus payments based on your decisions.

You will be randomly matched to another person (whom we'll call A) in this experiment.

A will start out with 7 points. A can decide to:
- Keep their 7 points OR
- Send their 7 points to you.

If A decides not to send the 7 points to you, the experiment ends and both you and A receive 7 points.

If A decides to send the 7 points to you, you can then decide to:
- Keep the 7 points (so you end up with 14 points and A ends up with 0 points) OR
- Spend 4 points to roll a 6-sided die (leaving you with 10 points) and possibly earn points for A. If you choose this option, A will receive 12 points if the die comes up with anything except a 1; A will get 0 points if a 1 comes up.

---

Here is a table of possible outcomes:

| A's decision | Your decision | Your earnings | A's earnings |
| Keep 7 points | — | 7 | 7 |
| Send 7 points | Don't roll die | 14 | 0 |
| Send 7 points | Roll die (lands on 1) | 10 | 0 |
| Send 7 points | Roll die (lands on 2–6) | 10 | 12 |

The points mentioned above will be converted to bonus payments ($0.50 per point.) These bonus payments are in addition to the payment you and A will each receive for participation.

## Message to Person A

Before A makes their decision, you will send a message to Person A. Feel free to say anything you like, as long as it doesn't reveal your identity (e.g., don't include your name or Prolific ID). This is your chance to communicate with your partner before they make their decision.

## Additional Details

Upon completion of the study, the bonus payment will be made to you through Prolific. Neither the researchers nor any other participant will be able to personally identify you or know how much you have been paid or what decisions you made.`),

  C: splitIntoPages(`# Instructions

You will be part of a group with about 10 other people. In this study, you will help decide if the messages you read from other people in the study contain promises about decisions they will make in a pair.

Here's how it works:

## The Pairing System

- There are two roles in each pair: A and B.
- Each pair has one A and one B.
- B sends a message to their A partner.
- You will read these messages and as a member of your group decide if they include any promises.
- A and B will be told the group's decision.
- A and B will then each make a decision.

---

## The Pair Decisions

- A decides whether to stay in the interaction or leave. They choose "IN" to stay or "OUT" to leave.
- B decides if they want to roll a virtual die or not if A chooses "IN".
- B has two choices:
  - "ROLL": The computer rolls a fair six-sided die.
  - "DON'T ROLL": No die is rolled.

## Scoring

- If A chooses "OUT": Both A and B get 5 points each. B's choice doesn't matter.
- If A chooses "IN" and B chooses "DON'T ROLL": B gets 14 points, and A gets 0 points.
- If A chooses "IN" and B chooses "ROLL": B gets 10 points. The die roll decides A's points:
  - Rolling a 1: A gets 0 points.
  - Rolling a 2, 3, 4, 5, or 6: A gets 12 points.
- Each point is worth 50 cents.
- Payments are in addition to guaranteed payments. A gets a guaranteed payment of $3. B gets a guaranteed payment of $4. B's payment is higher because they have to come back a second time to finish the study.

Here is a table of possible outcomes:

| A's decision | B's decision | A's earnings | B's earnings |
| OUT | — | 7 | 7 |
| IN | DON'T ROLL | 0 | 14 |
| IN | ROLL (lands on 1) | 0 | 10 |
| IN | ROLL (lands on 2–6) | 12 | 10 |

---

## Messages

Before A makes their decision, B can send any message they want to A, as long as it doesn't reveal B's identity and remains under 500 characters. Both A and B will know what decision your group made about B's message before they make their own decisions.

## What are promises?

In this study we use the word "promise" like they do in court. A promise is when someone says they are going to do something and the person they say it to is entitled to trust them to do it, to rely on the promise.

Courts hold people accountable for breaking a promise if it was reasonable to trust that the person would do what they say. People don't have to say the words "I promise" to make a promise. Sometimes, even when someone says "I promise" they haven't really made a promise because the person who got the promise wasn't entitled to rely on it.

For example, if people are playing a game, like poker, it's not reasonable to believe someone if they "promise" that they have a weak hand – poker is all about convincing others that your hand is good, even when it is not.

---

## Your Task

Your role in this study is to read a set of messages and decide for each one: is this really a promise?

You can think of it this way: suppose your friend told you they sent a message in this study but then they didn't roll. Would you think they are a bad person?

For each message we show you, we'll ask you for each message to provide a reason it might be reasonable to say "this is a promise" and a reason it might not be. You can think of this like being a lawyer first for the A player arguing "it's a promise" and then for the B player arguing "no it's not."

## Group Decision

- You'll be given 15–25 messages to read and asked to write down your reasons "for" and "against" saying "it's a promise".
- After you write your reasons down for each message, we'll ask you what your decision is: promise or not.
- We will give you 1 bonus point every time you make a decision that matches what the majority of people in your group decide.
- Each point is worth 20 cents. So you could make as much as $3 to $5 in bonus payments.
- Bonus points are in addition to your guaranteed payment of $5.
- The group decision will be based on what the majority decides.`),
};

const ultimatumGameInstructions: Record<string, InstructionPage[]> = {
  A: splitIntoPages(`# Instructions: Proposer (Person A)

You have been randomly paired with another participant, Person B. 

You have 10 points to divide between yourself and Person B. You will make a proposal for how to split these 10 points. 

**Message to Person B**
Along with your proposal, you will send a message (up to 500 characters) to Person B. This is your chance to communicate. Please do not include identifying information.

---

**Community Assessment**
Before your proposal is finalized, a group of other participants (the Community) will view your proposed split and message. They will provide a judgment on whether your proposal is "fair".

You will see this feedback and have one opportunity to **revise** your proposal if you wish.

---

**Final Outcome**
Person B will see your message and your final proposal.
Person B can **Accept** or **Reject** your offer. If they Accept, the points are distributed as proposed. If they Reject, both of you receive **0 points**.`),

  B: splitIntoPages(`# Instructions: Responder (Person B)

You have been randomly paired with another participant, Person A. 

Person A has 10 points to divide. They will propose a split of these points between the two of you.

**Message from Person A**
Person A will also send you a message along with their proposal.

---

**Your Decision**
You will see Person A's message and their proposal. 

You can **Accept** or **Reject** the offer. If you Accept, you get the points offered and A keeps the rest. If you Reject, **both of you receive 0 points**.`),

  C: splitIntoPages(`# Instructions: Community Assessor

In this study, you will observe interactions between other participants (Proposers and Responders) in the Ultimatum Game.

Your task is to read messages sent by Proposers and decide if they constitute a **promise**.

---

**Bonus Payment**
You will be shown several messages. For each message:
1. Provide a reason why it might be a promise.
2. Provide a reason why it might NOT be a promise.
3. Make a final judgment: Promise or Not.

If your judgment matches the majority of other Assessors in your group, you will receive a **bonus payment**.`)
};

const dictatorGameInstructions: Record<string, InstructionPage[]> = {
  A: splitIntoPages(`# Instructions: Proposer (Person A)

You have been randomly paired with another participant, Person B. 

You have 10 points to divide between yourself and Person B. You will make a proposal for how to split these 10 points. 

**Message to Person B**
Along with your proposal, you will send a message (up to 500 characters) to Person B. This is your chance to communicate. Please do not include identifying information.

---

**Community Assessment**
Before your proposal is finalized, a group of other participants (the Community) will view your proposed split and message. They will provide a judgment on whether your proposal is "fair".

You will see this feedback and have one opportunity to **revise** your proposal if you wish.

---

**Final Outcome**
Person B will see your message and your final proposal.
Person B receives the points you offered automatically; they cannot reject.`),

  B: splitIntoPages(`# Instructions: Receiver (Person B)

You have been randomly paired with another participant, Person A. 

Person A has 10 points to divide. They will propose a split of these points between the two of you.

**Message from Person A**
Person A will also send you a message along with their proposal.

---

**The Outcome**
You will see Person A's message and their proposal. 

You simply receive the points offered. You do not have the option to reject.`),

  C: splitIntoPages(`# Instructions: Community Assessor

In this study, you will observe interactions between other participants (Proposers and Receivers) in the Dictator Game.

Your task is to read messages sent by Proposers and decide if they constitute a **promise**.

---

**Bonus Payment**
You will be shown several messages. For each message:
1. Provide a reason why it might be a promise.
2. Provide a reason why it might NOT be a promise.
3. Make a final judgment: Promise or Not.

If your judgment matches the majority of other Assessors in your group, you will receive a **bonus payment**.`)
};

const powerToTakeInstructions: Record<string, InstructionPage[]> = {
  A: splitIntoPages(`# Instructions: Proposer (Person A)

In this experiment, you are in the role of the **Proposer**. You are paired with Person B (the **Responder**).

**The Take Rate**
You will set a "take rate" between 0% and 100%. This is the percentage of Person B's initial endowment ($10) that you wish to claim for yourself.

---

**Community Assessment**
Before your take rate is finalized, a group of other participants (the Community) will view your proposed rate. They will provide a judgment on whether your proposal is "fair".

You will see this feedback and have one opportunity to **revise** your take rate if you wish.

---

**The Outcome**
Person B will see your final take rate. However, Person B has the option to **destroy** any percentage of their endowment before your take rate is applied.

For example, if you set a 50% take rate, and Person B chooses to destroy 100% of their money, both of you receive $0 from that endowment.`),

  B: splitIntoPages(`# Instructions: Responder (Person B)

In this experiment, you are in the role of the **Responder**. You are paired with Person A (the **Proposer**).

**Your Endowment**
You are gifted with an initial endowment of $10.

---

**The Take Rate**
Person A will set a "take rate" between 0% and 100%. This is the percentage of your money that they claim.

**Your Decision**
Before the take rate is applied, you can choose to **destroy** between 0% and 100% of your initial endowment. Person A will only receive the percentage of the *remaining* money.

For example, if A sets a 100% take rate, but you destroy 100% of your money, Person A receives nothing, and you also receive nothing.`),

  C: splitIntoPages(`# Instructions: Community Assessor

In this study, you will observe interactions in the "Power to Take" game.

Your task is to evaluate "take rates" proposed by Person A. 

---

**Bonus Payment**
You will be shown several proposed take rates. For each one:
1. Provide a reason why it might be fair.
2. Provide a reason why it might be unfair.
3. Make a final judgment: Fair or Unfair.

If your judgment matches the majority of your group, you will receive a **bonus payment**.`)
};

const thirdPartyPunishmentInstructions: Record<string, InstructionPage[]> = {
  A: splitIntoPages(`# Instructions: Punisher

In this experiment, you observe a "Dictator Game" interaction between two other participants (a Dictator and a Receiver).

The Dictator has divided a sum of money between themselves and the Receiver.

---

**Your Role**
As a **Punisher**, you can choose to assign a "punishment rate" (0-100%) to the Dictator. This rate determines what percentage of the Dictator's kept points will be deducted.

---

**Community Assessment**
Before your punishment rate is finalized, the Community will evaluate it. You will see their feedback and can **revise** your rate once.`),

  C: splitIntoPages(`# Instructions: Community Assessor

In this study, you observe the actions of a **Punisher** in response to a Dictator's division of money.

Your task is to evaluate whether the Punisher's proposed punishment rate is **fair**.

---

**Bonus Payment**
If your judgment matches the majority of your group, you will receive a **bonus payment**.`)
};

const publicGoodsGameInstructions: Record<string, InstructionPage[]> = {
  A: splitIntoPages(`# Instructions: Contributor

Thank you for participating in this study. You are about to play a version of the **Public Goods Game**.

## Your Group

You will be randomly placed in a group of **four participants**, all of whom will complete the same task.

## Your Endowment

You have been given an initial endowment of **10 points**. You may keep some or all of these points, or contribute any portion of them to a **shared common pool**.

---

## How the Pool Works

1. Each of the four participants privately chooses how much of their endowment to contribute to the common pool (between 0% and 100%).
2. The total amount in the pool is **multiplied by ${PGG_MULTIPLIER}×**.
3. The resulting value is then **divided equally** among all four group members — regardless of how much each person individually contributed.

## Example

Suppose all four players each contribute 50% of their 10-point endowment (5 points each):
- Total pool = 20 points
- After multiplier: 20 × ${PGG_MULTIPLIER} = ${20 * PGG_MULTIPLIER} points
- Each player receives: ${(20 * PGG_MULTIPLIER) / 4} points from the pool
- Each player also keeps 5 points
- **Total per player: ${5 + (20 * PGG_MULTIPLIER) / 4} points**

---

## Your Decision

You will privately select a **contribution rate** (0%–100%) of your endowment to add to the common pool.

Before making your final decision, you will receive feedback from a group of **Community Evaluators** about whether your proposed contribution is considered **appropriate**.

You will then have the opportunity to **revise** your contribution rate before it is finalised.

## Bonus Payments

Your final contribution rate — along with the contributions of your three group members — will be used to calculate your **bonus payment**. Each point is worth $0.50 in bonus payment.`),

  C: splitIntoPages(`# Instructions: Community Evaluator

Thank you for participating in this study. You are taking on the role of a **Community Evaluator** in a Public Goods Game.

## Background

Other participants in this study are each playing the role of a **Contributor** in a group of four. Each contributor has been given an initial endowment of **10 points** and privately proposes a contribution rate (0%–100%) to a shared common pool. The pool is multiplied by **${PGG_MULTIPLIER}×** and divided equally among all four group members.

---

## Your Role

Your task is to review the **proposed contribution rates** of individual contributors and evaluate whether each proposed rate is **appropriate**.

For each contribution rate you review, you will be asked to:
1. Provide a reason why the rate **is** appropriate.
2. Provide a reason why the rate **is not** appropriate.
3. Make a final judgment: **Appropriate** or **Not Appropriate**.

---

## Bonus Payment

You will be shown **15–25 proposed contribution rates**. If your evaluation **matches the majority** of other Community Evaluators in your group, you will earn a **bonus point** for that item.

Each bonus point is worth $0.20. You could earn up to $3–$5 in bonus payments on top of your guaranteed participation fee.`),
};




// ── Experiment Registry ───────────────────────────────────────────────────────

export const EXPERIMENTS: Record<ExperimentSlug, ExperimentConfig> = {
  "trust-game": {
    id: "trust-game",
    name: "Trust Game",
    shortDescription:
      "Decide whether to invest points with a partner, who may choose to share the returns.",
    endowment: 7,
    pointsToUsd: 0.5,
    hasProposerMessage: true,
    hasCommunityAssessment: true,
    isDictatorMode: false,
    roles: [
      {
        role: "A",
        label: "Trustor (Person A)",
        instructions: trustGameInstructions.A,
        attentionChecks: trustGameAttentionChecks.A,
      },
      {
        role: "B",
        label: "Trustee (Person B)",
        instructions: trustGameInstructions.B,
        attentionChecks: trustGameAttentionChecks.B,
      },
      {
        role: "C",
        label: "Community Assessor",
        instructions: trustGameInstructions.C,
        attentionChecks: trustGameAttentionChecks.C,
      },
    ],
  },

  "ultimatum-game": {
    id: "ultimatum-game",
    name: DICTATOR_MODE ? "Dictator Game" : "Ultimatum Game",
    shortDescription: DICTATOR_MODE
      ? "A proposer divides money between themselves and a receiver."
      : "A proposer offers a split of money; the responder can accept or reject.",
    endowment: 10,
    pointsToUsd: 0.5,
    hasProposerMessage: true,
    hasCommunityAssessment: true,
    isDictatorMode: DICTATOR_MODE,
    roles: [
      {
        role: "A",
        label: "Proposer (Person A)",
        instructions: DICTATOR_MODE ? dictatorGameInstructions.A : ultimatumGameInstructions.A,
        attentionChecks: DICTATOR_MODE ? dictatorGameAttentionChecks.A : ultimatumGameAttentionChecks.A,
      },
      {
        role: "B",
        label: DICTATOR_MODE ? "Receiver (Person B)" : "Responder (Person B)",
        instructions: DICTATOR_MODE ? dictatorGameInstructions.B : ultimatumGameInstructions.B,
        attentionChecks: DICTATOR_MODE ? dictatorGameAttentionChecks.B : ultimatumGameAttentionChecks.B,
      },
      {
        role: "C",
        label: "Community Assessor",
        instructions: DICTATOR_MODE ? dictatorGameInstructions.C : ultimatumGameInstructions.C,
        attentionChecks: DICTATOR_MODE ? dictatorGameAttentionChecks.C : ultimatumGameAttentionChecks.C,
      },
    ],
  },

  "power-to-take-game": {
    id: "power-to-take-game",
    name: "Power to Take Game",
    shortDescription:
      "A proposer sets a take rate; the responder can destroy part of their endowment in protest.",
    endowment: 10,
    pointsToUsd: 0.5,
    hasProposerMessage: false,
    hasCommunityAssessment: true,
    isDictatorMode: false,
    roles: [
      {
        role: "A",
        label: "Proposer (Person A)",
        instructions: powerToTakeInstructions.A,
        attentionChecks: powerToTakeAttentionChecks.A,
      },
      {
        role: "B",
        label: "Responder (Person B)",
        instructions: powerToTakeInstructions.B,
        attentionChecks: powerToTakeAttentionChecks.B,
      },
      {
        role: "C",
        label: "Community Assessor",
        instructions: powerToTakeInstructions.C,
        attentionChecks: powerToTakeAttentionChecks.C,
      },
    ],
  },

  "third-party-punishment": {
    id: "third-party-punishment",
    name: "Third-Party Punishment Game",
    shortDescription:
      "A punisher proposes a punishment rate in response to a dictator's division.",
    endowment: 10,
    pointsToUsd: 0.5,
    hasProposerMessage: false,
    hasCommunityAssessment: true,
    isDictatorMode: false,
    roles: [
      {
        role: "A",
        label: "Punisher",
        instructions: thirdPartyPunishmentInstructions.A,
        attentionChecks: thirdPartyPunishmentAttentionChecks.A,
      },
      {
        role: "C",
        label: "Community Assessor",
        instructions: thirdPartyPunishmentInstructions.C,
        attentionChecks: thirdPartyPunishmentAttentionChecks.C,
      },
    ],
  },

  "public-goods-game": {
    id: "public-goods-game",
    name: "Public Goods Game",
    shortDescription:
      "Contributors propose a contribution rate to a shared pool; community evaluators assess whether each rate is appropriate.",
    endowment: 10,
    pointsToUsd: 0.5,
    hasProposerMessage: false,
    hasCommunityAssessment: true,
    isDictatorMode: false,
    roles: [
      {
        role: "A",
        label: "Contributor",
        instructions: publicGoodsGameInstructions.A,
        attentionChecks: publicGoodsGameAttentionChecks.A,
      },
      {
        role: "C",
        label: "Community Evaluator",
        instructions: publicGoodsGameInstructions.C,
        attentionChecks: publicGoodsGameAttentionChecks.C,
      },
    ],
  },
};

export const ALL_EXPERIMENT_SLUGS = Object.keys(EXPERIMENTS) as ExperimentSlug[];

export function getExperimentConfig(slug: ExperimentSlug): ExperimentConfig {
  const config = EXPERIMENTS[slug];
  if (!config) throw new Error(`Unknown experiment: ${slug}`);
  return config;
}
