import { ProfissionaisPagina } from "../ProfissionaisPagina";

// Destino interno do rewrite de /profissionais?especialidade=medicos-psiquiatras (next.config.mjs): a mesma
// tela, mas com o HTML estático já nascendo na aba de psiquiatras. A URL vista continua a /profissionais.
export { metadata } from "../page";

export default function ProfissionaisPsiquiatrasPage() {
  return <ProfissionaisPagina especialidadeInicial="psiquiatra" />;
}
