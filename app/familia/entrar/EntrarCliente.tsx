"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginSocial } from "@/components/familia/LoginSocial";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { provedorAtual } from "@/lib/familia/auth-cliente";
import { concluirEntrada, temSessao, type DepoisDoLogin, type Informado } from "@/lib/familia/fluxo-cliente";
import { mascararWhatsapp, normalizarWhatsapp } from "@/lib/familia/whatsapp";
import { CardHeader } from "@/components/conversa/CardHeader";
import { track } from "@/lib/mixpanel";

type Estado = "verificando" | "login" | "dados" | "email" | "erro";

// Textos da tela de dados (primeiro login). Rascunho a confirmar.
const DADOS_TITULO = "Confirme seus dados";
const DADOS_DESCRICAO = "A gente usa seu WhatsApp só pra te mandar o acesso ao programa e os lembretes, com mensagem discreta.";
const DADOS_BOTAO = "Salvar dados e continuar";
const WHATSAPP_ERRO = "Confira o número, com DDD e 9 dígitos.";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tela de login (Q13 do diagnóstico) e volta do provedor. Com sessão aberta, segue direto.
export function EntrarCliente({ retorno = false }: { retorno?: boolean }) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>("verificando");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappTocado, setWhatsappTocado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  function tratar(resultado: DepoisDoLogin) {
    if (resultado.tipo === "ir") router.replace(resultado.destino);
    else if (resultado.tipo === "precisa_dados") {
      setNome(resultado.sugestao.nome);
      setEmail(resultado.sugestao.email);
      setEstado("dados");
    } else if (resultado.tipo === "precisa_email") setEstado("email");
    else if (resultado.tipo === "erro") setEstado("erro");
    else setEstado("login");
  }

  async function seguir(informado?: Informado) {
    setSalvando(true);
    const resultado = await concluirEntrada(informado);
    // Sem o número: só avisa que a pessoa informou.
    if (informado?.whatsapp && resultado.tipo === "ir") track("whatsapp_informado");
    tratar(resultado);
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

  if (estado === "dados") {
    const whatsappValido = normalizarWhatsapp(whatsapp) !== null;
    const completo = nome.trim() !== "" && EMAIL_VALIDO.test(email.trim()) && whatsappValido;
    return (
      <section className="familia-secao">
        <CardHeader as="h1" title={DADOS_TITULO} description={DADOS_DESCRICAO} />
        <InputText id="familia-nome" rotulo="Nome" autoComplete="given-name" maxLength={40} value={nome} onChange={setNome} />
        <InputText id="familia-email" rotulo="E-mail" tipo="email" inputMode="email" autoComplete="email" value={email} onChange={setEmail} />
        <InputText
          id="familia-whatsapp"
          rotulo="WhatsApp"
          inputMode="tel"
          autoComplete="tel-national"
          value={whatsapp}
          onChange={(valor) => setWhatsapp(mascararWhatsapp(valor))}
          onBlur={() => setWhatsappTocado(true)}
          erro={whatsappTocado && whatsapp !== "" && !whatsappValido ? WHATSAPP_ERRO : undefined}
        />
        <Button
          tamanho="medium"
          larguraTotal
          disabled={!completo}
          carregando={salvando}
          onClick={() => seguir({ nome: nome.trim(), email: email.trim(), whatsapp })}
        >
          {DADOS_BOTAO}
        </Button>
      </section>
    );
  }

  if (estado === "email") {
    const valido = EMAIL_VALIDO.test(email.trim());
    return (
      <section className="familia-secao">
        <CardHeader
          as="h1"
          title="Qual é o seu e-mail?"
          description="Sua conta não mandou um e-mail. A gente usa ele só pra te mandar o acesso ao programa, com assunto discreto."
        />
        <InputText id="familia-email" rotulo="E-mail" tipo="email" inputMode="email" autoComplete="email" value={email} onChange={setEmail} />
        <Button tamanho="medium" larguraTotal disabled={!valido} carregando={salvando} onClick={() => seguir({ email: email.trim() })}>
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
