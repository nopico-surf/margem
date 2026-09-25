import { textoDoBotaoContinuar } from "@/lib/experimento";
import BemVindoCliente from "./BemVindoCliente";

export default async function BemVindoPage() {
  const botao = await textoDoBotaoContinuar();
  return <BemVindoCliente botao={botao} />;
}
