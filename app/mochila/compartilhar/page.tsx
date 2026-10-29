import type { Metadata } from "next";
import { TelaCompartilhar } from "@/components/mochila/telas/TelaCompartilhar";

export const metadata: Metadata = {
  title: "Compartilhar sua mochila | Mochila do Rolê",
  robots: { index: false },
};

export default function Page() {
  return <TelaCompartilhar />;
}
