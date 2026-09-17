import { BotaoContinuar } from "@/components/ui/BotaoContinuar";

export function ResponseError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="figma-response-error" role="alert">
      <p>{error}</p>
      <BotaoContinuar onClick={onRetry} label="Tentar novamente" fullWidth={false} />
    </div>
  );
}
