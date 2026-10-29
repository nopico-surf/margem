import type { Metadata } from "next";
import { TelaRevelacao } from "@/components/mochila/telas/TelaRevelacao";

export const metadata: Metadata = {
  title: "O que foi na sua mochila | Mochila do Rolê",
  robots: { index: false },
};

export default function Page() {
  return <TelaRevelacao />;
}
