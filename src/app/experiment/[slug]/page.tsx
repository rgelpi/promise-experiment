"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ExperimentProvider } from "@/context/ExperimentContext";
import Layout from "@/components/Layout";
import ExperimentRunner from "@/components/ExperimentRunner";
import { getExperimentConfig } from "@/lib/experiments";
import type { ExperimentSlug, ParticipantRole, Session, ExperimentConfig } from "@/lib/types";

function ExperimentContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const role = searchParams.get("role") as ParticipantRole | null;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const experimentSlug = slug as ExperimentSlug;
  const config = getExperimentConfig(experimentSlug);

  useEffect(() => {
    async function loadSession() {
      if (!sessionId || !role) {
        setError("Missing session or role information.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/session?sessionId=${sessionId}`);
        if (!res.ok) {
          throw new Error("Session not found");
        }
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
        } else {
          setError("Session not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load session.");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [sessionId, role]);

  if (loading) {
    return (
      <Layout experimentName={config.name} showHeader={false}>
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p>Loading session...</p>
        </div>
      </Layout>
    );
  }

  if (error || !session) {
    return (
      <Layout experimentName={config.name} showHeader={false}>
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <ExperimentProvider
      initialSession={session}
      initialExperiment={experimentSlug}
      initialRole={role!}
    >
      <ExperimentPageWrapper config={config} />
    </ExperimentProvider>
  );
}

function ExperimentPageWrapper({ config }: { config: ExperimentConfig }) {
  // We need to access context here to get the current step for the progress bar
  // Since we are inside the provider, we could create a custom hook or just render it.
  // We will just let Layout know the step if we want to show progress.
  // Actually, Layout is rendered outside of Provider in the structure above. Wait.
  // Let's render Layout inside the Provider.
  return (
    <Layout experimentName={config.name} showHeader={true}>
      <ExperimentRunner />
    </Layout>
  );
}

export default function ExperimentPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExperimentContent slug={unwrappedParams.slug} />
    </Suspense>
  );
}
