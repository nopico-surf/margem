import { cacheLife } from "next/cache";
import { anoAtualEmSaoPaulo } from "./anos-experiencia";

// O ano entra no prerender, então precisa de cache: fora dele o relógio é valor instável pro Cache
// Components e a tela toda sai do HTML. A validade acompanha a dos profissionais (lib/supabase.ts),
// e o rótulo "N anos de experiência" muda uma vez por ano, muito depois de qualquer revalidação.
export async function anoAtualCacheado(): Promise<number> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 1800, expire: 3300 });
  return anoAtualEmSaoPaulo();
}
