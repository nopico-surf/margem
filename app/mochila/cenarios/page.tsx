import type { Metadata } from "next";
import { TelaEscolha } from "@/components/mochila/telas/TelaEscolha";

export const metadata: Metadata = {
  title: "Pra onde você vai? | Mochila do Rolê",
  robots: { index: false },
};

export default function Page() {
  return <TelaEscolha />;
}
