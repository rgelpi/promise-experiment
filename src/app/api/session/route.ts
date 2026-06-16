import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import type { Session, ExperimentSlug, ParticipantRole } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// POST /api/session — create a new session
// GET  /api/session?prolificPid=XXX — resume existing session

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prolificPid, studyId, prolificSessionId, experimentSlug, role } = body as {
      prolificPid: string;
      studyId: string;
      prolificSessionId: string;
      experimentSlug: ExperimentSlug;
      role: ParticipantRole;
    };

    if (!prolificPid || !studyId || !prolificSessionId || !experimentSlug || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date();

    const session: Session = {
      id: uuidv4(),
      prolificPid,
      studyId,
      prolificSessionId,
      experimentSlug,
      role,
      status: "created",
      currentStep: "consent",
      createdAt: now,
      updatedAt: now,
    };

    if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === "true") {
      console.log("[MOCK] Created session:", session.id);
      return NextResponse.json({ session }, { status: 201 });
    }

    await adminDb.collection("sessions").doc(session.id).set(session);
    return NextResponse.json({ session }, { status: 201 });
  } catch (err) {
    console.error("POST /api/session error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const prolificPid = req.nextUrl.searchParams.get("prolificPid");
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (!prolificPid && !sessionId) {
      return NextResponse.json({ error: "prolificPid or sessionId required" }, { status: 400 });
    }
    
    if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === "true") {
      console.log("[MOCK] GET session");
      return NextResponse.json({ session: {
        id: sessionId || uuidv4(),
        prolificPid: prolificPid || "MOCK_PID",
        studyId: "MOCK_STUDY",
        prolificSessionId: "MOCK_SESSION",
        experimentSlug: "trust-game",
        role: "A",
        status: "created",
        currentStep: "consent",
        createdAt: new Date(),
        updatedAt: new Date()
      } }, { status: 200 });
    }

    if (sessionId) {
      const docSnap = await adminDb.collection("sessions").doc(sessionId).get();
      if (!docSnap.exists) {
        return NextResponse.json({ session: null }, { status: 200 });
      }
      return NextResponse.json({ session: docSnap.data() }, { status: 200 });
    } else {
      const snap = await adminDb.collection("sessions")
        .where("prolificPid", "==", prolificPid)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      if (snap.empty) {
        return NextResponse.json({ session: null }, { status: 200 });
      }

      return NextResponse.json({ session: snap.docs[0].data() }, { status: 200 });
    }
  } catch (err) {
    console.error("GET /api/session error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/session — update session status/step
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, status, currentStep, pairedWith, responseStep, responseData, surveyAnswers } = body as {
      sessionId: string;
      status?: string;
      currentStep?: string;
      pairedWith?: string;
      responseStep?: string;
      responseData?: any;
      surveyAnswers?: Record<string, string | number>;
    };

    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (currentStep) updates.currentStep = currentStep;
    if (pairedWith) updates.pairedWith = pairedWith;
    if (responseStep && responseData !== undefined) {
      updates[`responses.${responseStep}`] = responseData;
    }
    if (surveyAnswers) {
      updates.survey = surveyAnswers;
    }

    if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === "true") {
      console.log("[MOCK] PATCH session", sessionId, updates);
      return NextResponse.json({ ok: true });
    }

    await adminDb.collection("sessions").doc(sessionId).update(updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/session error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
