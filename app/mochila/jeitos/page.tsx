import type { Metadata } from "next";
import { TelaJeitos } from "@/components/mochila/telas/TelaJeitos";

export const metadata: Metadata = {
  title: "Jeitos de ir pro rolê | Mochila do Rolê",
  robots: { index: false },
};

export default function Page() {
  return <TelaJeitos />;
}
