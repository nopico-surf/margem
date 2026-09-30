import { textoDoBotaoContinuar } from "@/lib/experimento";
import BemVindoCliente from "./BemVindoCliente";

// O texto do botão vem de um experimento e muda por pessoa (cookie de sessão), então a tela só existe
// inteira depois que o servidor responde. Rota bloqueante de propósito; o loader dela virá à parte.
export const instant = false;

export default async function BemVindoPage() {
  const botao = await textoDoBotaoContinuar();
  return <BemVindoCliente botao={botao} />;
}
