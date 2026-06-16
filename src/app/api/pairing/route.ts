import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import type { ExperimentSlug } from "@/lib/types";

// POST /api/pairing — find an available Group A session and pair it with the current Group B session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentSessionId, experimentSlug, role } = body as {
      currentSessionId: string;
      experimentSlug: ExperimentSlug;
      role: string;
    };

    if (!currentSessionId || !experimentSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === "true") {
      console.log("[MOCK] POST pairing");
      return NextResponse.json({
        paired: true,
        partnerSessionId: "MOCK_PARTNER_SESSION",
        partnerResponses: [],
      });
    }

    // Find the most recent completed Group A session for this experiment that hasn't been paired yet
    const partnerRole = role === "B" ? "A" : "A";
    
    const snap = await adminDb.collection("sessions")
      .where("experimentSlug", "==", experimentSlug)
      .where("role", "==", partnerRole)
      .where("status", "==", "complete")
      .orderBy("createdAt", "desc")
      .limit(10) // fetch a few to find an available one
      .get();

    if (snap.empty) {
      return NextResponse.json({ paired: false });
    }

    // In async mode, we just grab the first available one (even if it's been used, though ideally we'd track usage).
    // For simplicity, we just use the most recent one.
    const partnerSessionDoc = snap.docs[0];
    const partnerSession = partnerSessionDoc.data();

    // Mark the current session as paired
    await adminDb.collection("sessions").doc(currentSessionId).update({ pairedWith: partnerSession.id });

    // Extract responses from the partner session
    const partnerResponsesObject = partnerSession.responses || {};
    const partnerResponses = Object.entries(partnerResponsesObject).map(([stepName, data]) => ({
      stepName,
      data,
    }));

    return NextResponse.json({
      paired: true,
      partnerSessionId: partnerSession.id,
      partnerResponses,
    });
  } catch (err) {
    console.error("POST /api/pairing error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
