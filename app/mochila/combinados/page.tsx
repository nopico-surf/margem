import type { Metadata } from "next";
import { TelaCombinados } from "@/components/mochila/telas/TelaCombinados";

export const metadata: Metadata = {
  title: "Combinados antes de sair | Mochila do Rolê",
  robots: { index: false },
};

export default function Page() {
  return <TelaCombinados />;
}
