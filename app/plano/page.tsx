import type { Metadata } from "next";
import { PlanoCliente } from "./PlanoCliente";

// Página que o profissional abre pelo link pessoal de pagamento: /plano#{token_apoio}. O código vai
// depois do "#" para não chegar ao servidor nem aos logs de acesso, e a página não carrega medição
// nenhuma (lib/sem-medicao.ts). Ver docs/apoio-telas.md.
export const metadata: Metadata = {
  title: "Plano do profissional",
  robots: { index: false, follow: false },
};

export default function PlanoPage() {
  return <PlanoCliente />;
}
