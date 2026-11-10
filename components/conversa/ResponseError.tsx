import { BotaoContinuar } from "@/components/ui/BotaoContinuar";

export function ResponseError({ error, onRetry, rotuloTentar = "Tentar novamente" }: { error: string; onRetry: () => void; rotuloTentar?: string }) {
  return (
    <div className="figma-response-error" role="alert">
      <p>{error}</p>
      <BotaoContinuar onClick={onRetry} label={rotuloTentar} fullWidth={false} />
    </div>
  );
}
