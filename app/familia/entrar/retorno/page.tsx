import { EntrarCliente } from "../EntrarCliente";

// Volta do Google ou do Facebook (e da Apple, quando o botão voltar). O cliente do Supabase troca o código da URL pela
// sessão sozinho (PKCE), e a tela segue como a de entrar.
export default function RetornoPage() {
  return <EntrarCliente retorno />;
}
