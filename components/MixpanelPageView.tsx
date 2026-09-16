"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/mixpanel";

export function MixpanelPageView() {
  const pathname = usePathname();

  useEffect(() => {
    track("pagina_visualizada", { rota: pathname });
  }, [pathname]);

  return null;
}
