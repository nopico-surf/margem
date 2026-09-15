"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultPage } from "@/components/figma-results/ResultPage";
import { getOrCreateSessaoId } from "@/lib/sessao-client";

type OrientationResult = {
  acolhimento: string;
  orientacao: string;
  pilula_espiritual: string | null;
  checklist_agora: string[];
  checklist_proximo: string[];
  perguntas_aprofundamento: Array<{ pergunta: string; opcoes: string[] }>;
  risco?: unknown;
  foi_cache_hit?: boolean;
};

export default function ConversaPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<OrientationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let value: string | null = null;
    try {
      value = window.sessionStorage.getItem("margem-mensagem");
    } catch {}
    if (!value) {
      router.replace("/app");
      return;
    }
    setMessage(value);

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/orientacao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto: value, sessaoId: getOrCreateSessaoId() }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Não foi possível preparar a orientação.");
        if (typeof result.acolhimento !== "string" || typeof result.orientacao !== "string" || !Array.isArray(result.checklist_agora) || !Array.isArray(result.checklist_proximo)) {
          throw new Error("A resposta recebida não está completa.");
        }
        setOrientation(result);
      } catch (err) {
        setOrientation(null);
        setError(err instanceof Error ? err.message : "Não foi possível preparar a orientação.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router]);

  if (!message) return null;

  return <ResultPage message={message} orientation={orientation} isLoading={isLoading} error={error} />;
}
