"use client";

import { useEffect, useState } from "react";
import { useExperiment } from "@/context/ExperimentContext";
import ConsentForm from "./ConsentForm";
import InstructionScreen from "./InstructionScreen";
import AttentionCheck from "./AttentionCheck";
import MessageComposer from "./MessageComposer";
import MessageViewer from "./MessageViewer";
import CommunityFeedback from "./CommunityFeedback";
import PromiseJudgment from "./PromiseJudgment";
import FairnessJudgment from "./FairnessJudgment";
import SurveyForm from "./SurveyForm";
import CompletionScreen from "./CompletionScreen";
import TrialOutcome from "./TrialOutcome";

import TrustDecision from "./experiments/TrustDecision";
import UltimatumDecision from "./experiments/UltimatumDecision";
import PowerToTakeDecision from "./experiments/PowerToTakeDecision";
import ThirdPartyPunishmentDecision from "./experiments/ThirdPartyPunishmentDecision";
import PublicGoodsDecision from "./experiments/PublicGoodsDecision";

import { getExperimentConfig, PGG_MULTIPLIER } from "@/lib/experiments";
import { getProlificCompletionUrl, IS_DEV } from "@/lib/prolific";
import { PLACEHOLDER_SURVEY } from "@/lib/survey";
import type { CommunityAssessment } from "@/lib/types";

export default function ExperimentRunner() {
  const {
    session,
    experimentSlug,
    role,
    currentStep,
    goNext,
    saveResponse,
    responses,
  } = useExperiment();

  const [loading, setLoading] = useState(false);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [communityItems, setCommunityItems] = useState<any[]>([]);
  const [communityIndex, setCommunityIndex] = useState(0);
  const [devFeedback, setDevFeedback] = useState<CommunityAssessment | null>(null);

  // Generate random community feedback when entering the feedback step in development mode
  useEffect(() => {
    if (IS_DEV && currentStep === "view-community-feedback") {
      const total = Math.floor(Math.random() * 11) + 5; // 5 to 15 judgments
      const positive = Math.floor(Math.random() * (total + 1));
      const ratio = positive / total;

      setDevFeedback({
        targetResponseId: "DEV_RESPONSE_" + Date.now(),
        judgmentType: experimentSlug === "trust-game" ? "promise" : "fairness",
        totalJudgments: total,
        positiveCount: positive,
        positiveRatio: ratio,
      });
    }
  }, [currentStep, experimentSlug]);

  useEffect(() => {
    async function updateSessionStep() {
      if (!session) return;
      await fetch("/api/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, currentStep }),
      });
    }
    updateSessionStep();
  }, [currentStep, session]);

  if (!experimentSlug || !role || !session) return null;

  const config = getExperimentConfig(experimentSlug);
  const roleConfig = config.roles.find((r) => r.role === role);

  async function handleResponse(stepName: string, data: any) {
    setLoading(true);
    await fetch("/api/session", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session!.id,
        currentStep, // Keep progress in sync
        responseStep: stepName,
        responseData: data,
      }),
    });
    saveResponse(stepName, data);
    setLoading(false);
    goNext();
  }

  const needsPartnerData =
    currentStep === "view-message" ||
    currentStep === "make-decision" ||
    currentStep === "outcome" ||
    (currentStep === "make-offer" && experimentSlug === "third-party-punishment");

  useEffect(() => {
    if (needsPartnerData && !partnerData && session) {
      async function load() {
        setLoading(true);
        try {
          const res = await fetch("/api/pairing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentSessionId: session!.id, experimentSlug, role }),
          });
          const data = await res.json();
          if (data.paired) {
            setPartnerData(data);
          } else if (process.env.NEXT_PUBLIC_USE_DUMMY_PARTNER_DATA === "true") {
            console.log("[DUMMY] Using dummy partner data fallback");
            setPartnerData({
              paired: true,
              partnerSessionId: "DUMMY_SESSION",
              partnerResponses: [
                { stepName: "message-composed", data: { message: "This is a dummy message for testing purposes." } },
                { stepName: "initial-offer", data: { offer: 5, takeRate: 50, sentPoints: true } },
              ],
            });
          } else {
            console.warn("No partner data available");
          }
        } catch (err) {
          console.error("Failed to fetch partner data:", err);
          if (process.env.NEXT_PUBLIC_USE_DUMMY_PARTNER_DATA === "true") {
            setPartnerData({
              paired: true,
              partnerSessionId: "DUMMY_SESSION",
              partnerResponses: [
                { stepName: "message-composed", data: { message: "This is a dummy message (fetch error fallback)." } },
                { stepName: "initial-offer", data: { offer: 5, takeRate: 50, sentPoints: true } },
              ],
            });
          }
        } finally {
          setLoading(false);
        }
      }
      load();
    }
  }, [needsPartnerData, partnerData, session, experimentSlug, role]);

  switch (currentStep) {
    case "consent":
      return (
        <ConsentForm
          onAgree={() => handleResponse("consent", { agreed: true })}
          onDecline={() => {
            // handle decline, e.g. redirect out
            window.location.href = "https://prolific.com";
          }}
        />
      );

    case "instructions":
      if (!roleConfig) return null;
      return (
        <InstructionScreen
          pages={roleConfig.instructions}
          onComplete={goNext}
        />
      );

    case "attention-check":
      if (!roleConfig) return null;
      return (
        <AttentionCheck
          config={roleConfig.attentionChecks}
          onComplete={() => handleResponse("attention-check", { passed: true })}
          onResults={(results) => saveResponse("attention-results", results)}
        />
      );

    case "compose-message":
      return (
        <MessageComposer
          onSubmit={(msg) => handleResponse("message-composed", { message: msg })}
          label={role === "A" ? "Message to Person B" : "Message to Person A"}
        />
      );

    case "view-message":
      // B needs to see A's message (or A sees B's depending on game).
      // We must fetch partner data first.
      if (!partnerData) {
        return <p>Loading partner's message...</p>;
      }
      
      const partnerResponses = partnerData.partnerResponses || [];
      const msgRes = partnerResponses.find((r: any) => r.stepName === "message-composed");
      const message = msgRes?.data?.message || "No message provided.";

      return (
        <div>
          <MessageViewer message={message} />
          <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={goNext}>
            Continue
          </button>
        </div>
      );

    case "make-offer":
      if (experimentSlug === "trust-game") {
        return <TrustDecision role={role as "A" | "B"} onSubmit={(dec) => handleResponse("initial-offer", { decision: dec })} />;
      }
      if (experimentSlug === "ultimatum-game") {
        return <UltimatumDecision role={role as "A" | "B"} endowment={config.endowment} isDictatorMode={config.isDictatorMode} onSubmit={(dec) => handleResponse("initial-offer", dec)} />;
      }
      if (experimentSlug === "power-to-take-game") {
        return <PowerToTakeDecision role={role as "A" | "B"} onSubmit={(dec) => handleResponse("initial-offer", dec)} />;
      }
      if (experimentSlug === "third-party-punishment") {
        // Punisher A needs dictator division. Fetch from partner (a Dictator).
        if (!partnerData) {
          return <p>Loading dictator division...</p>;
        }
        const offerRes = partnerData.partnerResponses.find((r: any) => r.stepName === "initial-offer" || r.stepName === "revised-offer");
        const dictatorKept = config.endowment - (offerRes?.data?.offer || 0);
        const given = offerRes?.data?.offer || 0;
        return <ThirdPartyPunishmentDecision dictatorDivision={{ kept: dictatorKept, given }} onSubmit={(dec) => handleResponse("initial-offer", dec)} />;
      }
      if (experimentSlug === "public-goods-game") {
        return (
          <PublicGoodsDecision
            endowment={config.endowment}
            multiplier={PGG_MULTIPLIER}
            onSubmit={(dec) => handleResponse("initial-offer", { contributionRate: dec.contributionRate })}
          />
        );
      }
      return null;

    case "view-community-feedback":
      // Fetch community judgment for the current response.
      // This happens after make-offer, so we need the ID of the offer response.
      // For a real async platform, we might just show an empty/no feedback yet if no judgements.
      // In development mode, we show randomly generated community feedback.
      const feedback = IS_DEV ? devFeedback : null;
      const label =
        experimentSlug === "trust-game" ? "a promise" :
        experimentSlug === "public-goods-game" ? "appropriate" :
        "fair";
      return <CommunityFeedback assessment={feedback} judgmentLabel={label} onContinue={goNext} />;

    case "revise-offer":
      // Re-use make-offer UI but save as revised-offer
      if (experimentSlug === "ultimatum-game") {
        return <UltimatumDecision role={role as "A" | "B"} endowment={config.endowment} isDictatorMode={config.isDictatorMode} onSubmit={(dec) => handleResponse("revised-offer", dec)} />;
      }
      if (experimentSlug === "power-to-take-game") {
        return <PowerToTakeDecision role={role as "A" | "B"} onSubmit={(dec) => handleResponse("revised-offer", dec)} />;
      }
      if (experimentSlug === "third-party-punishment") {
        return <ThirdPartyPunishmentDecision dictatorDivision={{ kept: 10, given: 0 }} onSubmit={(dec) => handleResponse("revised-offer", dec)} />;
      }
      if (experimentSlug === "public-goods-game") {
        return (
          <PublicGoodsDecision
            endowment={config.endowment}
            multiplier={PGG_MULTIPLIER}
            onSubmit={(dec) => handleResponse("revised-offer", { contributionRate: dec.contributionRate })}
          />
        );
      }
      return null;

    case "make-decision":
      if (!partnerData) {
        return <p>Loading partner's proposal...</p>;
      }
      
      const pResponses = partnerData.partnerResponses || [];
      const pOfferRes = pResponses.find((r: any) => r.stepName === "revised-offer") || pResponses.find((r: any) => r.stepName === "initial-offer");
      
      if (experimentSlug === "trust-game") {
        return <TrustDecision role={role as "A" | "B"} onSubmit={(dec) => handleResponse("trustee-decision", { decision: dec })} />;
      }
      if (experimentSlug === "ultimatum-game") {
        const offer = pOfferRes?.data?.offer || 0;
        return <UltimatumDecision role={role as "A" | "B"} endowment={config.endowment} isDictatorMode={config.isDictatorMode} proposerOffer={offer} onSubmit={(dec) => handleResponse("ultimatum-accept-reject", dec)} />;
      }
      if (experimentSlug === "power-to-take-game") {
        const takeRate = pOfferRes?.data?.takeRate || 0;
        return <PowerToTakeDecision role={role as "A" | "B"} proposerTakeRate={takeRate} onSubmit={(dec) => handleResponse("destroy-rate", dec)} />;
      }
      return null;

    case "judge-messages":
      // Group C loops through multiple items.
      // In a real app, fetch 15-25 items from backend. Here we mock for demonstration,
      // but we should fetch from an API in a real implementation.
      if (communityItems.length === 0) {
        // Fetch items
        setCommunityItems([{ id: "mock1", message: "I will roll", offer: 5 }]);
        return <p>Loading items to judge...</p>;
      }

      const item = communityItems[communityIndex];
      const handleJudgment = async (result: any) => {
        // save judgment
        await fetch("/api/community", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: session.id,
            experimentSlug,
            targetResponseId: item.id,
            judgmentType: experimentSlug === "trust-game" || experimentSlug === "ultimatum-game" ? "promise" : "fairness",
            ...result,
          })
        });

        if (communityIndex < communityItems.length - 1) {
          setCommunityIndex(c => c + 1);
        } else {
          goNext();
        }
      };

      if (experimentSlug === "trust-game" || experimentSlug === "ultimatum-game") {
        return (
          <PromiseJudgment
            message={item.message}
            itemIndex={communityIndex}
            totalItems={communityItems.length}
            onSubmit={handleJudgment}
          />
        );
      } else {
        // power-to-take-game, third-party-punishment, public-goods-game all use fairness/appropriateness judgment
        const isPublicGoods = experimentSlug === "public-goods-game";
        return (
          <FairnessJudgment
            decisionDescription={
              isPublicGoods
                ? `Proposed contribution rate: ${item.contributionRate ?? item.offer}%`
                : `Offer: ${item.offer}`
            }
            itemIndex={communityIndex}
            totalItems={communityItems.length}
            onSubmit={handleJudgment}
          />
        );
      }

    case "outcome":
      return (
        <TrialOutcome
          onSubmit={(outcomeData) => handleResponse("trial-outcome", outcomeData)}
        />
      );

    case "survey":
      return (
        <SurveyForm
          questions={PLACEHOLDER_SURVEY}
          onSubmit={async (answers) => {
            setLoading(true);
            await fetch("/api/session", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: session.id, surveyAnswers: answers })
            });
            setLoading(false);
            goNext();
          }}
        />
      );

    case "complete":
      return (
        <CompletionScreen
          completionUrl={getProlificCompletionUrl()}
          completionCode={process.env.NEXT_PUBLIC_PROLIFIC_COMPLETION_CODE}
        />
      );

    default:
      return <div>Unknown step: {currentStep}</div>;
  }
}
