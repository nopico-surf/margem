import type { Metadata } from "next";
import { CheckoutCliente } from "./CheckoutCliente";

// Checkout do programa para familiares (briefing 01): plano, valor, dados, Pix e confirmação, uma etapa
// por tela. Exige login; quem chega sem sessão vai pro login e volta pra cá. O título da aba fica o
// padrão, "Margem", como nas outras telas do programa.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return <CheckoutCliente />;
}
