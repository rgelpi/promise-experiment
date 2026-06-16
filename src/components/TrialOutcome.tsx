"use client";

import { useEffect, useState } from "react";
import { useExperiment } from "@/context/ExperimentContext";
import { getExperimentConfig } from "@/lib/experiments";
import { getDummyPartnerOutcome } from "@/lib/dummyStrategies";
import styles from "./TrialOutcome.module.css";

interface TrialOutcomeProps {
  onSubmit: (data: any) => void;
}

export default function TrialOutcome({ onSubmit }: TrialOutcomeProps) {
  const { session, experimentSlug, role, responses, saveResponse } = useExperiment();
  const [loading, setLoading] = useState(true);
  const [outcome, setOutcome] = useState<any>(null);

  const config = getExperimentConfig(experimentSlug!);

  useEffect(() => {
    const needsPartner =
      (experimentSlug === "trust-game" && role === "B") ||
      (experimentSlug === "ultimatum-game" && role === "B") ||
      (experimentSlug === "power-to-take-game" && role === "B") ||
      (experimentSlug === "third-party-punishment" && role === "A");

    async function loadAndCompute() {
      let pData = null;
      if (needsPartner) {
        try {
          const res = await fetch("/api/pairing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentSessionId: session!.id,
              experimentSlug,
              role,
            }),
          });
          const data = await res.json();
          if (data.paired) {
            pData = data;
          } else if (process.env.NEXT_PUBLIC_USE_DUMMY_PARTNER_DATA === "true") {
            pData = {
              paired: true,
              partnerSessionId: "DUMMY_SESSION",
              partnerResponses: [
                { stepName: "message-composed", data: { message: "Dummy message" } },
                { stepName: "initial-offer", data: { offer: 4, takeRate: 50 } },
                { stepName: "revised-offer", data: { offer: 4, takeRate: 50 } },
              ],
            };
          }
        } catch (err) {
          console.error("Failed to load partner data in outcome step:", err);
          if (process.env.NEXT_PUBLIC_USE_DUMMY_PARTNER_DATA === "true") {
            pData = {
              paired: true,
              partnerSessionId: "DUMMY_SESSION",
              partnerResponses: [
                { stepName: "message-composed", data: { message: "Dummy message" } },
                { stepName: "initial-offer", data: { offer: 4, takeRate: 50 } },
              ],
            };
          }
        }
      }

      // Check if we already have a saved outcome in the state
      const savedOutcome = responses["trial-outcome"] as any;
      if (savedOutcome) {
        setOutcome(savedOutcome);
        setLoading(false);
        return;
      }

      // Compute outcome
      const computed = computeOutcome(pData);
      
      // Persist outcome choice to session DB so it doesn't change on refresh
      try {
        await fetch("/api/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: session!.id,
            responseStep: "trial-outcome",
            responseData: computed,
          }),
        });
      } catch (err) {
        console.error("Failed to persist trial-outcome to database:", err);
      }

      saveResponse("trial-outcome", computed);
      setOutcome(computed);
      setLoading(false);
    }

    loadAndCompute();
  }, [session, experimentSlug, role, responses, saveResponse]);

  function computeOutcome(pData: any) {
    if (!experimentSlug || !role) return null;

    const ownOfferRes = responses["revised-offer"] || responses["initial-offer"];
    
    const getPartnerOffer = () => {
      const pResponses = pData?.partnerResponses || [];
      const res = pResponses.find((r: any) => r.stepName === "revised-offer") || pResponses.find((r: any) => r.stepName === "initial-offer");
      return res?.data;
    };

    switch (experimentSlug) {
      case "trust-game": {
        if (role === "A") {
          const decision = (responses["initial-offer"] as any)?.decision || "OUT";
          if (decision === "OUT") {
            return {
              ownChoiceText: "You chose to keep your 7 points (OUT).",
              partnerChoiceText: "Not applicable.",
              payoffText: `You receive ${config.endowment} points.`,
              pointsEarned: config.endowment,
            };
          } else {
            const dummy = getDummyPartnerOutcome("trust-game", responses["initial-offer"], config.endowment);
            let partnerText = `Person B chose: ${dummy.partnerChoiceValue === "ROLL" ? "ROLL the die" : "DON'T ROLL the die"}.`;
            if (dummy.dieRoll) {
              partnerText += ` The virtual die landed on ${dummy.dieRoll}.`;
            }
            return {
              ownChoiceText: "You chose to send your 7 points to Person B (IN).",
              partnerChoiceText: partnerText,
              payoffText: `You receive ${dummy.payoffs.participant} points.`,
              pointsEarned: dummy.payoffs.participant,
            };
          }
        } else {
          const decision = (responses["trustee-decision"] as any)?.decision || "DONT_ROLL";
          const partnerText = "Person A chose to send you their 7 points (IN).";
          
          if (decision === "DONT_ROLL") {
            return {
              ownChoiceText: "You chose NOT to roll the die (DON'T ROLL).",
              partnerChoiceText: partnerText,
              payoffText: "You receive 14 points.",
              pointsEarned: 14,
            };
          } else {
            const dieRoll = Math.floor(Math.random() * 6) + 1;
            const aGets = dieRoll === 1 ? 0 : 12;
            return {
              ownChoiceText: "You chose to spend 4 points to roll the virtual die (ROLL).",
              partnerChoiceText: `${partnerText} The virtual die landed on ${dieRoll}. Your partner (Person A) receives ${aGets} points.`,
              payoffText: "You receive 10 points.",
              pointsEarned: 10,
            };
          }
        }
      }

      case "ultimatum-game": {
        const isDictator = config.isDictatorMode;
        if (role === "A") {
          const offer = (ownOfferRes as any)?.offer ?? 0;
          if (isDictator) {
            return {
              ownChoiceText: `You proposed to keep ${config.endowment - offer} points and offer ${offer} points to Person B.`,
              partnerChoiceText: "Not applicable (in the Dictator Game, offers cannot be rejected).",
              payoffText: `You receive ${config.endowment - offer} points.`,
              pointsEarned: config.endowment - offer,
            };
          } else {
            const dummy = getDummyPartnerOutcome("ultimatum-game", ownOfferRes, config.endowment);
            const accepted = dummy.partnerChoiceValue === "ACCEPT";
            return {
              ownChoiceText: `You proposed to keep ${config.endowment - offer} points and offer ${offer} points to Person B.`,
              partnerChoiceText: `Person B chose: ${dummy.partnerChoiceValue}.`,
              payoffText: accepted 
                ? `The offer was accepted. You receive ${config.endowment - offer} points.`
                : `The offer was rejected. Both players receive 0 points.`,
              pointsEarned: accepted ? config.endowment - offer : 0,
            };
          }
        } else {
          const pOfferData = getPartnerOffer();
          const offer = pOfferData?.offer ?? 0;
          const partnerText = `Person A proposed to offer you ${offer} points (keeping ${config.endowment - offer} points).`;
          
          if (isDictator) {
            return {
              ownChoiceText: "Acknowledged the proposal.",
              partnerChoiceText: partnerText,
              payoffText: `You receive ${offer} points.`,
              pointsEarned: offer,
            };
          } else {
            const accepted = (responses["ultimatum-accept-reject"] as any)?.accepted;
            return {
              ownChoiceText: `You chose to ${accepted ? "ACCEPT" : "REJECT"} the proposal.`,
              partnerChoiceText: partnerText,
              payoffText: accepted
                ? `You receive ${offer} points.`
                : `Both players receive 0 points.`,
              pointsEarned: accepted ? offer : 0,
            };
          }
        }
      }

      case "power-to-take-game": {
        if (role === "A") {
          const takeRate = (ownOfferRes as any)?.takeRate ?? 0;
          const dummy = getDummyPartnerOutcome("power-to-take-game", ownOfferRes, config.endowment);
          const destroyRate = dummy.partnerChoiceValue as number;
          
          return {
            ownChoiceText: `You proposed a take rate of ${takeRate}%.`,
            partnerChoiceText: `Person B chose to destroy ${destroyRate}% of their endowment.`,
            payoffText: `You receive ${dummy.payoffs.participant} points.`,
            pointsEarned: dummy.payoffs.participant,
          };
        } else {
          const pTakeData = getPartnerOffer();
          const takeRate = pTakeData?.takeRate ?? 0;
          const destroyRate = (responses["destroy-rate"] as any)?.destroyRate ?? 0;
          
          const remaining = config.endowment * (1 - destroyRate / 100);
          const taken = Math.round(remaining * (takeRate / 100) * 10) / 10;
          const kept = Math.round((remaining - taken) * 10) / 10;

          return {
            ownChoiceText: `You chose to destroy ${destroyRate}% of your endowment.`,
            partnerChoiceText: `Person A set a take rate of ${takeRate}%.`,
            payoffText: `You keep ${kept} points. (Person A gets ${taken} points)`,
            pointsEarned: kept,
          };
        }
      }

      case "third-party-punishment": {
        const pDictatorData = getPartnerOffer();
        const kept = config.endowment - (pDictatorData?.offer ?? 0);
        const offered = pDictatorData?.offer ?? 0;
        const punishmentRate = (ownOfferRes as any)?.punishmentRate ?? 0;
        
        const deducted = Math.round(kept * (punishmentRate / 100) * 10) / 10;
        const dictatorFinal = Math.round((kept - deducted) * 10) / 10;

        return {
          ownChoiceText: `You proposed a punishment rate of ${punishmentRate}%.`,
          partnerChoiceText: `The Dictator chose to keep ${kept} points and offer ${offered} points to the Receiver.`,
          payoffText: `You receive ${config.endowment} points. The Dictator's points are reduced by ${deducted} points (leaving them with ${dictatorFinal} points).`,
          pointsEarned: config.endowment,
        };
      }

      case "public-goods-game": {
        const rate = (ownOfferRes as any)?.contributionRate ?? 0;
        const contributed = Math.round((rate / 100) * config.endowment * 10) / 10;
        return {
          ownChoiceText: `You chose a contribution rate of ${rate}% (${contributed} points).`,
          partnerChoiceText: "All other contributions will be recorded from remaining group members.",
          payoffText: "Your total bonus will be computed later once all participants are grouped.",
          pointsEarned: null,
        };
      }

      default:
        return null;
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading trial outcomes...</p>
      </div>
    );
  }

  if (!outcome) {
    return (
      <div className="alert alert-error">
        <p>Could not compute trial outcome.</p>
      </div>
    );
  }

  const hasPayoff = outcome.pointsEarned !== null;
  const bonusUsd = hasPayoff ? (outcome.pointsEarned * config.pointsToUsd).toFixed(2) : null;

  return (
    <div>
      <h2 className={styles.title}>Trial Completed</h2>
      <p className={styles.description}>
        You have finished the decision task for this trial. Below is a summary of the decisions and outcomes.
      </p>

      <div className={styles.summaryBox}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Your Choice</span>
          <span className={styles.summaryValue}>{outcome.ownChoiceText}</span>
        </div>

        {outcome.partnerChoiceText && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Partner's Decision</span>
            <span className={styles.summaryValue}>{outcome.partnerChoiceText}</span>
          </div>
        )}

        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Trial Outcome</span>
          <span className={styles.summaryValue}>
            {hasPayoff ? (
              <>
                You earned <strong>{outcome.pointsEarned} points</strong> 
                <span className={styles.usdBonus}> (equivalent to a <strong>${bonusUsd}</strong> bonus payment)</span>.
              </>
            ) : (
              outcome.payoffText
            )}
          </span>
        </div>
      </div>

      <div className={styles.nextInfo}>
        <p>
          Before completing the experiment, you will next be presented with a short questionnaire (demographic and psychometric questions).
        </p>
      </div>

      <div className={styles.buttonWrapper}>
        <button className="btn btn-primary" onClick={() => onSubmit(outcome)}>
          Continue to Questionnaire
        </button>
      </div>
    </div>
  );
}
