"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginSocial } from "@/components/familia/LoginSocial";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { provedorAtual } from "@/lib/familia/auth-cliente";
import { concluirEntrada, temSessao, type DepoisDoLogin } from "@/lib/familia/fluxo-cliente";
import { CardHeader } from "@/components/conversa/CardHeader";
import { track } from "@/lib/mixpanel";

type Estado = "verificando" | "login" | "email" | "erro";

// Tela de login (Q13 do diagnóstico) e volta do provedor. Com sessão aberta, segue direto.
export function EntrarCliente({ retorno = false }: { retorno?: boolean }) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>("verificando");
  const [email, setEmail] = useState("");
  const [salvando, setSalvando] = useState(false);

  function tratar(resultado: DepoisDoLogin) {
    if (resultado.tipo === "ir") router.replace(resultado.destino);
    else if (resultado.tipo === "precisa_email") setEstado("email");
    else if (resultado.tipo === "erro") setEstado("erro");
    else setEstado("login");
  }

  async function seguir(emailInformado?: string) {
    setSalvando(true);
    tratar(await concluirEntrada(emailInformado));
    setSalvando(false);
  }

  useEffect(() => {
    let ativo = true;
    (async () => {
      const logado = await temSessao();
      if (!ativo) return;
      if (!logado) {
        setEstado("login");
        return;
      }
      if (retorno) track("login_concluido", { provedor: (await provedorAtual()) ?? "desconhecido" });
      tratar(await concluirEntrada());
    })();
    return () => {
      ativo = false;
    };
    // tratar e o router não mudam o que a verificação faz.
  }, [retorno]);

  if (estado === "verificando") {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  if (estado === "email") {
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return (
      <section className="familia-secao">
        <CardHeader
          as="h1"
          title="Qual é o seu e-mail?"
          description="Sua conta não mandou um e-mail. A gente usa ele só pra te mandar o acesso ao programa, com assunto discreto."
        />
        <InputText id="familia-email" rotulo="E-mail" tipo="email" inputMode="email" autoComplete="email" value={email} onChange={setEmail} />
        <Button tamanho="medium" larguraTotal disabled={!valido} carregando={salvando} onClick={() => seguir(email.trim())}>
          Salvar e-mail e continuar
        </Button>
      </section>
    );
  }

  if (estado === "erro") {
    return (
      <section className="familia-secao">
        <p className="text-medium-regular" role="alert">
          Não foi possível salvar suas respostas agora. Tente novamente.
        </p>
        <Button tamanho="medium" larguraTotal carregando={salvando} onClick={() => seguir()}>
          Tentar salvar as respostas de novo
        </Button>
      </section>
    );
  }

  return (
    <section className="familia-secao">
      <LoginSocial titulo="Seu resultado está pronto" />
    </section>
  );
}
