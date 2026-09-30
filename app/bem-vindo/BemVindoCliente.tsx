"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { Footer } from "@/components/layout/Footer";
import { CardsLp } from "@/components/bem-vindo/CardsLp";
import { CardPublico } from "@/components/bem-vindo/CardPublico";
import { Stepper } from "@/components/bem-vindo/Stepper";
import { Button } from "@/components/ui/Button";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { GlifoGroups, GlifoHealing, GlifoLock, GlifoVerifiedUser, GlifoWork } from "@/components/icons/glifos";
import { conceder, jaConsentiu, jaRecusou, recusar } from "@/lib/consentimento";
import { track } from "@/lib/mixpanel";
import type { BotaoContinuar } from "@/lib/experimento";

const COR_DO_ICONE = "var(--colors-brand-primary-600)";

// Depois que o painel de dados e cookies sai, a barra de Continuar espera 1s pra subir.
const ESPERA_DA_BARRA = 1000;

export default function BemVindoCliente({ botao }: { botao: BotaoContinuar }) {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [cookiesVisivel, setCookiesVisivel] = useState(false);
  const [barraVisivel, setBarraVisivel] = useState(false);
  const esperaDaBarra = useRef<ReturnType<typeof setTimeout>>(undefined);
  const exposicaoRegistrada = useRef(false);

  // Só depois de montar, pra o painel entrar subindo em vez de já nascer no lugar. Quem já respondeu
  // (aceitou, ou recusou nesta aba, e voltou de /privacidade, por exemplo) não vê o painel de novo,
  // só a barra de Continuar.
  useEffect(() => {
    if (jaConsentiu() || jaRecusou()) {
      registrarExposicao();
      setBarraVisivel(true);
    } else setCookiesVisivel(true);
    return () => clearTimeout(esperaDaBarra.current);
  }, []);

  // Exposição ao teste A/B do botão: depois de a pessoa responder ao painel, aceitando ou não (a
  // medição anônima continua na recusa), uma vez por carga da página.
  function registrarExposicao() {
    if (exposicaoRegistrada.current || !botao.experimento || !botao.variante) return;
    exposicaoRegistrada.current = true;
    track("$experiment_started", { "Experiment name": botao.experimento, "Variant name": botao.variante });
  }

  function fecharCookies() {
    setCookiesVisivel(false);
    esperaDaBarra.current = setTimeout(() => setBarraVisivel(true), ESPERA_DA_BARRA);
  }

  function aceitarPersonalizacao() {
    conceder({ rota: "/bem-vindo", gatilho: "abertura" });
    registrarExposicao();
    fecharCookies();
  }

  function navegarSemPersonalizacao() {
    recusar({ rota: "/bem-vindo", gatilho: "abertura" });
    registrarExposicao();
    fecharCookies();
  }

  function verDados() {
    track("politica_dados_aberta");
    router.push("/privacidade");
  }

  function continuar() {
    track("boas_vindas_continuar", { texto_botao: botao.texto });
    router.push("/inicio");
  }

  function abrirMenu() {
    setMenuAberto(true);
    track("menu_clicado", { rota: "/bem-vindo" });
  }

  function fecharMenu() {
    setMenuAberto(false);
    track("menu_fechado", { rota: "/bem-vindo" });
  }

  return (
    <main className="bv-pagina" data-com-barra={barraVisivel ? "true" : "false"}>
      <section className="bv-hero">
        <Header onOpenMenu={abrirMenu} />
        <SideMenu open={menuAberto} onClose={fecharMenu} rota="/bem-vindo" />

        <div className="bv-hero-topo">
          <div className="bv-hero-foto">
            <Image src="/assets/dois-amigos-abracando.webp" alt="" fill sizes="(min-width: 48em) 50vw, 100vw" preload />
          </div>

          <div className="bv-hero-coluna">
            <div className="bv-hero-texto">
              <h1 className="bv-hero-titulo">Apoio e escuta sobre álcool e outras drogas</h1>
              <p className="bv-hero-descricao">
                Não precisa querer parar nem saber explicar. A gente aproxima você de informação, apoio e caminhos para o
                seu momento
              </p>
            </div>

            <div className="bv-hero-cards">
              <CardsLp
                icone={<GlifoVerifiedUser color={COR_DO_ICONE} />}
                titulo="Sem julgamento"
                texto="Conte do seu jeito"
              />
              <CardsLp icone={<GlifoLock color={COR_DO_ICONE} />} titulo="Você fica anônimo" texto="Sem nome ou e-mail" />
            </div>

            <div className="bv-continuar">
              <Button tamanho="medium" larguraTotal onClick={continuar}>
                {botao.texto}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="bv-conteudo">
        <section className="bv-secao">
          <h2 className="bv-secao-titulo">Para quem é a Margem</h2>
          <div className="bv-publico">
            <CardPublico
              foto="/assets/homem-regata-verde.webp"
              titulo="Para você"
              texto="Que quer entender melhor o próprio uso"
            />
            <CardPublico
              foto="/assets/maos-sobre-mesa.webp"
              posicaoDaFoto="center 60%"
              titulo="Por perto"
              texto="Para quem apoia alguém em uso"
            />
          </div>
          <div className="bv-continuar">
            <Button tamanho="medium" larguraTotal onClick={continuar}>
              {botao.texto}
            </Button>
          </div>
        </section>

        <section className="bv-secao">
          <h2 className="bv-secao-titulo">Como funciona</h2>
          <div className="passos-grade">
            <Stepper numero={1} titulo="Conte ou escolha um tópico" texto="Digite livremente ou selecione opções prontas" />
            <Stepper numero={2} titulo="A gente organiza" texto="Uma orientação clara pensada para o seu momento" />
            <Stepper
              numero={3}
              titulo="Você escolhe o caminho"
              texto="A gente conecta possibilidades. A decisão é sua"
              ultimo
            />

            <div className="passos-cards">
              <div className="passos-ramo">
                <CardsLp
                  icone={<GlifoHealing color={COR_DO_ICONE} />}
                  titulo="Serviços públicos"
                  texto="Atendimento gratuito no sistema de saúde"
                />
              </div>
              <div className="passos-ramo">
                <CardsLp
                  icone={<GlifoWork color={COR_DO_ICONE} />}
                  titulo="Profissionais"
                  texto="Psicólogos e psiquiatras especializados"
                />
              </div>
              <div className="passos-ramo">
                <CardsLp
                  icone={<GlifoGroups color={COR_DO_ICONE} />}
                  titulo="Redes de apoio"
                  texto="Encontros presenciais e online"
                />
              </div>
            </div>

            <div className="bv-continuar passos-continuar">
              <Button tamanho="medium" larguraTotal onClick={continuar}>
                {botao.texto}
              </Button>
            </div>
          </div>
        </section>

        <section className="bv-importante">
          <h2 className="bv-importante-titulo">Importante</h2>
          <p className="bv-aviso">
            A Margem não faz atendimento e não substitui profissional ou serviço público. Se você tem menos de 18 anos,
            conversar com seus responsáveis pode ajudar
          </p>
          <Button variante="transparent" tamanho="x-small" className="bv-importante-dados" onClick={verDados}>
            Ver como a gente cuida dos seus dados
          </Button>
        </section>
      </div>

      <div className="bv-rodape">
        <Footer />
      </div>

      <PainelInferior
        variante="cookies"
        visivel={cookiesVisivel}
        onAceitar={aceitarPersonalizacao}
        onRecusar={navegarSemPersonalizacao}
        onVerDados={verDados}
      />
      <PainelInferior variante="continuar" visivel={barraVisivel} onContinuar={continuar} texto={botao.texto} />
    </main>
  );
}
