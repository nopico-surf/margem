import type { Metadata } from "next";
import { TelaTribo } from "@/components/mochila/telas/TelaTribo";

export const metadata: Metadata = {
  title: "Que som te leva pro rolê? | Mochila do Rolê",
  robots: { index: false },
};

export default function Page() {
  return <TelaTribo />;
}
