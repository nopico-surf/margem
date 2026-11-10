import { EntrarCliente } from "../EntrarCliente";

// Volta do Google, da Apple ou do Facebook. O cliente do Supabase troca o código da URL pela
// sessão sozinho (PKCE), e a tela segue como a de entrar.
export default function RetornoPage() {
  return <EntrarCliente retorno />;
}
