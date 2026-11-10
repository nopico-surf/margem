"use client";

import { useState } from "react";
import { CardHeader } from "@/components/conversa/CardHeader";
import { CheckBoxGroup } from "@/components/conversa/CheckBoxGroup";
import { Button } from "@/components/ui/Button";
import { entrarCom } from "@/lib/familia/auth-cliente";
import {
  CHAVE_CONSENTIMENTO_PENDENTE,
  LOGIN_GATE,
  PROVEDORES,
  TEXTO_CONSENTIMENTO_COMUNICACOES,
  TEXTO_CONSENTIMENTO_DADOS,
  type Provedor,
} from "@/lib/familia/config";
import { track } from "@/lib/mixpanel";

// Login só por provedor externo (briefing, seção 4.1). A Margem não guarda senha.
// Os dois consentimentos ficam aqui: o de dados é obrigatório (sem ele os botões não habilitam) e o
// de comunicações é opcional e vem desmarcado. A escolha vai pro localStorage antes do redirect e é
// gravada no perfil quando a pessoa volta (/familia/entrar/retorno).

// Logos de marca, fora do Figma: arquivos em /public/icons com as cores oficiais, os três no mesmo
// quadro de 20, pra ficarem do mesmo tamanho.
function IconeProvedor({ provedor }: { provedor: Provedor }) {
  return <img className="familia-login-icone" src={`/icons/${provedor}.svg`} alt="" width={20} height={20} />;
}

// O título vem de quem usa ("Seu resultado está pronto", "Antes de começar") e fica colado ao texto
// no padrão de título e subtítulo do site (CardHeader).
export function LoginSocial({ titulo }: { titulo: string }) {
  const [dados, setDados] = useState(false);
  const [comunicacoes, setComunicacoes] = useState(false);
  const [entrando, setEntrando] = useState<Provedor | null>(null);
  const [falhou, setFalhou] = useState(false);

  async function entrar(provedor: Provedor) {
    if (!dados) return;
    setEntrando(provedor);
    setFalhou(false);
    try {
      window.localStorage.setItem(CHAVE_CONSENTIMENTO_PENDENTE, JSON.stringify({ dados, comunicacoes }));
    } catch {}
    track("login_solicitado", { provedor, gate: LOGIN_GATE });
    const resultado = await entrarCom(provedor);
    if (!resultado.ok) {
      setEntrando(null);
      setFalhou(true);
    }
  }

  return (
    <div className="familia-login">
      <CardHeader
        as="h1"
        title={titulo}
        description="Entre para salvar seu resultado e continuar de onde parou. Não pedimos senha e não publicamos nada nas suas redes."
      />

      {/* Mesmo checklist da /conversa (Figma: checkbox-group). */}
      <div className="figma-checklist">
        <CheckBoxGroup item={TEXTO_CONSENTIMENTO_DADOS} selected={dados} onChange={setDados} />
        <CheckBoxGroup item={`${TEXTO_CONSENTIMENTO_COMUNICACOES} (opcional)`} selected={comunicacoes} onChange={setComunicacoes} />
      </div>

      <div className="familia-login-botoes">
        {PROVEDORES.map(({ id, rotulo }) => (
          <Button key={id} variante="secondary" tamanho="medium" larguraTotal disabled={!dados} carregando={entrando === id} onClick={() => entrar(id)}>
            <IconeProvedor provedor={id} />
            {rotulo}
          </Button>
        ))}
      </div>

      {falhou && (
        <p className="text-small-regular familia-erro" role="alert">
          Não foi possível abrir o login agora. Tente novamente.
        </p>
      )}
    </div>
  );
}
