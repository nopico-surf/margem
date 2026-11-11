import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { CheckoutCliente } from "./CheckoutCliente";

// Checkout do programa para familiares (briefing 01): plano, valor, dados, Pix e confirmação, uma etapa
// por tela. Exige login; quem chega sem sessão vai pro login e volta pra cá. O título da aba fica o
// padrão, "Margem", como nas outras telas do programa.
// A lista de profissionais (carrossel de psicólogos do plano com acompanhamento) vem da busca cacheada.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  return <CheckoutCliente profissionais={await buscarTodosProfissionaisAtivos()} />;
}
