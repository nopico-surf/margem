import type { Metadata } from "next";
import { TelaResultado } from "@/components/mochila/telas/TelaResultado";

export const metadata: Metadata = {
  title: "Sua mochila | Mochila do Rolê",
  robots: { index: false },
};

export default function Page() {
  return <TelaResultado />;
}
