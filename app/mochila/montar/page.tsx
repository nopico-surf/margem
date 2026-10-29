import type { Metadata } from "next";
import { TelaMontagem } from "@/components/mochila/telas/TelaMontagem";

export const metadata: Metadata = {
  title: "Monte sua mochila | Mochila do Rolê",
  robots: { index: false },
};

export default function Page() {
  return <TelaMontagem />;
}
