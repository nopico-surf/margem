import type { Metadata } from "next";
import { TelaDesafiar } from "@/components/mochila/telas/TelaDesafiar";

export const metadata: Metadata = {
  title: "Desafiar um amigo | Mochila do Rolê",
  robots: { index: false },
};

export default function Page() {
  return <TelaDesafiar />;
}
