import type { ExperimentSlug } from "./types";

export interface DummyOutcome {
  partnerChoiceLabel: string;
  partnerChoiceValue: string | number;
  dieRoll?: number;
  payoffs: {
    participant: number;
    partner: number;
    thirdParty?: number;
  };
}

/**
 * Evaluates the outcome for games where the participant acts first,
 * using a dummy strategy for the partner.
 * 
 * Returns the partner's simulated choice and the resulting payoffs.
 */
export function getDummyPartnerOutcome(
  experiment: ExperimentSlug,
  ownDecision: Record<string, unknown> | null | undefined,
  endowment: number
): DummyOutcome {
  switch (experiment) {
    case "trust-game": {
      const choice = ownDecision?.decision || "OUT";
      if (choice === "OUT") {
        return {
          partnerChoiceLabel: "Not applicable (you chose OUT)",
          partnerChoiceValue: "N/A",
          payoffs: {
            participant: endowment, // 7 points
            partner: endowment, // 7 points
          },
        };
      }

      // If A chose IN, B chooses ROLL (50%) or DONT_ROLL (50%)
      const rand = Math.random();
      const BChoice = rand < 0.5 ? "ROLL" : "DONT_ROLL";
      if (BChoice === "ROLL") {
        const dieRoll = Math.floor(Math.random() * 6) + 1;
        const participantPayoff = dieRoll === 1 ? 0 : 12;
        return {
          partnerChoiceLabel: "ROLL",
          partnerChoiceValue: "ROLL",
          dieRoll,
          payoffs: {
            participant: participantPayoff,
            partner: 10, // B gets 10 points when rolling
          },
        };
      } else {
        return {
          partnerChoiceLabel: "DON'T ROLL",
          partnerChoiceValue: "DONT_ROLL",
          payoffs: {
            participant: 0,
            partner: 14, // B keeps all 14 points
          },
        };
      }
    }

    case "ultimatum-game": {
      const offer = typeof ownDecision?.offer === "number" ? ownDecision.offer : 0;
      const rand = Math.random();
      const threshold = offer >= 3 ? 0.9 : 0.2; // 90% accept if offer >= 3, 20% accept otherwise
      const accepted = rand < threshold;

      if (accepted) {
        return {
          partnerChoiceLabel: "ACCEPT",
          partnerChoiceValue: "ACCEPT",
          payoffs: {
            participant: endowment - offer,
            partner: offer,
          },
        };
      } else {
        return {
          partnerChoiceLabel: "REJECT",
          partnerChoiceValue: "REJECT",
          payoffs: {
            participant: 0,
            partner: 0,
          },
        };
      }
    }

    case "power-to-take-game": {
      const takeRate = typeof ownDecision?.takeRate === "number" ? ownDecision.takeRate : 0;
      let destroyRate = 0;
      if (takeRate > 70) {
        destroyRate = 80;
      } else if (takeRate > 30) {
        destroyRate = 30;
      }

      const remainingEndowment = endowment * (1 - destroyRate / 100);
      const takenPoints = Math.round(remainingEndowment * (takeRate / 100) * 10) / 10;
      const responderKept = Math.round((remainingEndowment - takenPoints) * 10) / 10;

      return {
        partnerChoiceLabel: `Destroy ${destroyRate}% of endowment`,
        partnerChoiceValue: destroyRate,
        payoffs: {
          participant: takenPoints,
          partner: responderKept,
        },
      };
    }

    default:
      throw new Error(`No dummy strategy configured for experiment: ${experiment}`);
  }
}
