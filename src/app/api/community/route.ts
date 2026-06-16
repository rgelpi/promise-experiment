import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import type { CommunityJudgment, CommunityAssessment, ExperimentSlug, JudgmentType } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// POST /api/community
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, experimentSlug, targetResponseId, judgmentType, reasonFor, reasonAgainst, judgment } = body as {
      sessionId: string;
      experimentSlug: ExperimentSlug;
      targetResponseId: string;
      judgmentType: JudgmentType;
      reasonFor?: string;
      reasonAgainst?: string;
      judgment: number; // e.g. 1-7 scale or boolean
    };

    if (!sessionId || !targetResponseId || judgment === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const record: CommunityJudgment = {
      id: uuidv4(),
      sessionId,
      experimentSlug,
      targetResponseId,
      judgmentType,
      reasonFor,
      reasonAgainst,
      judgment,
      createdAt: new Date(),
    };

    if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === "true") {
      console.log("[MOCK] POST community", record.id);
      return NextResponse.json({ judgment: record }, { status: 201 });
    }

    await adminDb.collection("communityJudgments").doc(record.id).set(record);
    return NextResponse.json({ judgment: record }, { status: 201 });
  } catch (err) {
    console.error("POST /api/community error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/community?targetResponseId=XXX&judgmentType=YYY
// Returns aggregate assessment for a specific response
export async function GET(req: NextRequest) {
  try {
    const targetResponseId = req.nextUrl.searchParams.get("targetResponseId");
    const judgmentType = req.nextUrl.searchParams.get("judgmentType") as JudgmentType | null;

    if (!targetResponseId) {
      return NextResponse.json({ error: "targetResponseId required" }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === "true") {
      console.log("[MOCK] GET community");
      return NextResponse.json({
        assessment: {
          targetResponseId,
          judgmentType: judgmentType ?? "fairness",
          totalJudgments: 1,
          positiveCount: 1,
          positiveRatio: 1,
        },
        judgments: []
      });
    }

    let queryRef: FirebaseFirestore.Query = adminDb.collection("communityJudgments")
      .where("targetResponseId", "==", targetResponseId);

    if (judgmentType) {
      queryRef = queryRef.where("judgmentType", "==", judgmentType);
    }

    const snap = await queryRef.get();
    const judgments = snap.docs.map((doc) => doc.data() as CommunityJudgment);

    // Simple aggregation
    let positiveCount = 0;
    judgments.forEach((j) => {
      // Assuming a threshold for "positive" judgment, e.g., > 4 on a 7 point scale, or true for boolean
      if (typeof j.judgment === "number" && j.judgment > 4) positiveCount++;
      if (typeof j.judgment === "boolean" && j.judgment) positiveCount++;
    });

    const assessment: CommunityAssessment = {
      targetResponseId,
      judgmentType: judgmentType ?? "fairness", // fallback
      totalJudgments: judgments.length,
      positiveCount,
      positiveRatio: judgments.length > 0 ? positiveCount / judgments.length : 0,
    };

    return NextResponse.json({ assessment, judgments }, { status: 200 });
  } catch (err) {
    console.error("GET /api/community error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
