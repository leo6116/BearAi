"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Nav } from "@/components/landing/Nav";
import { Timeline } from "@/components/generator/Timeline";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { useGenerationStore } from "@/store/generationStore";
import { loadSession, saveSession } from "@/lib/sessionStorage";
import type { GenerationRequest } from "@/types";

export default function SessionPage() {
  const t = useTranslations("session");
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const [status, setStatus] = useState<"loading" | "found" | "missing">("loading");
  const requestRef = useRef<GenerationRequest | null>(null);

  const result = useGenerationStore((s) => s.result);
  const hydrateResult = useGenerationStore((s) => s.hydrateResult);
  const setTone = useGenerationStore((s) => s.setTone);
  const setAspectRatio = useGenerationStore((s) => s.setAspectRatio);
  const regeneratingScenes = useGenerationStore((s) => s.regeneratingScenes);
  const regenerateScene = useGenerationStore((s) => s.regenerateScene);

  useEffect(() => {
    // Reading localStorage requires the browser, so the session can only be
    // resolved (and its found/missing status set) from inside an effect.
    /* eslint-disable react-hooks/set-state-in-effect */
    const session = loadSession(sessionId);
    if (!session) {
      setStatus("missing");
      return;
    }
    requestRef.current = session.request;
    hydrateResult(session.result);
    setTone(session.request.tone);
    setAspectRatio(session.request.aspectRatio);
    setStatus("found");
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    if (status === "found" && result && requestRef.current) {
      saveSession(sessionId, requestRef.current, result);
    }
  }, [result, status, sessionId]);

  async function handleRegenerate(sceneNumber: number) {
    const succeeded = await regenerateScene(sceneNumber);
    if (succeeded) {
      toast.success(t("regenerateSuccess", { number: sceneNumber }));
    } else {
      toast.error(t("regenerateError"));
    }
  }

  return (
    <>
      <Nav />
      <main className="min-h-[calc(100vh-88px)] px-6 py-16 md:px-20 md:py-24">
        <div className="mx-auto max-w-4xl">
          {status === "loading" && (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}

          {status === "missing" && (
            <div className="py-24 text-center">
              <p className="eyebrow mb-4">{t("missingTitle")}</p>
              <h1 className="mb-6 text-3xl font-bold text-text-primary md:text-4xl">
                {t("missingHeading")}
              </h1>
              <p className="mx-auto mb-10 max-w-md text-text-secondary">
                {t("missingDescription")}
              </p>
              <Link href="/generate">
                <Button>{t("missingCta")}</Button>
              </Link>
            </div>
          )}

          {status === "found" && result && (
            <Timeline
              result={result}
              regeneratingScenes={regeneratingScenes}
              onRegenerateScene={handleRegenerate}
            />
          )}
        </div>
      </main>
    </>
  );
}
