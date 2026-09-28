import { IconeSeguranca } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";

export function IdentityBadge() {
  return (
    <Badge color="primary">
      <IconeSeguranca />
      Você não precisa se identificar
    </Badge>
  );
}
