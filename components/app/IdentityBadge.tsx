import { IconeCadeado } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";

export function IdentityBadge() {
  return (
    <Badge color="primary">
      <IconeCadeado />
      Você não precisa se identificar
    </Badge>
  );
}
