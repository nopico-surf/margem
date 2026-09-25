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
import { conceder, jaConsentiu } from "@/lib/consentimento";
import { track } from "@/lib/mixpanel";

const COR_DO_ICONE = "var(--colors-brand-primary-600)";

// Depois que o painel de dados e cookies sai, a barra de Continuar espera 1s pra subir.
const ESPERA_DA_BARRA = 1000;

export default function BemVindoPage() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [cookiesVisivel, setCookiesVisivel] = useState(false);
  const [barraVisivel, setBarraVisivel] = useState(false);
  const esperaDaBarra = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Só depois de montar, pra o painel entrar subindo em vez de já nascer no lugar. Quem já aceitou
  // (e voltou de /privacidade, por exemplo) não vê o painel de novo, só a barra de Continuar.
  useEffect(() => {
    if (jaConsentiu()) setBarraVisivel(true);
    else setCookiesVisivel(true);
    return () => clearTimeout(esperaDaBarra.current);
  }, []);

  function fecharCookies() {
    setCookiesVisivel(false);
    esperaDaBarra.current = setTimeout(() => setBarraVisivel(true), ESPERA_DA_BARRA);
  }

  function aceitar() {
    conceder();
    fecharCookies();
  }

  function verDados() {
    track("politica_dados_aberta");
    router.push("/privacidade");
  }

  function continuar() {
    track("boas_vindas_continuar");
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
        <SideMenu open={menuAberto} onClose={fecharMenu} />

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
                Continuar
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
              texto="Para quem está próximo de alguém em uso"
            />
          </div>
          <div className="bv-continuar">
            <Button tamanho="medium" larguraTotal onClick={continuar}>
              Continuar
            </Button>
          </div>
        </section>

        <section className="bv-secao">
          <h2 className="bv-secao-titulo">Como funciona</h2>
          <div className="passos-grade">
            <Stepper numero={1} titulo="Você conta ou seleciona" texto="Do jeito que conseguir, sem precisar ter certeza" />
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
                  titulo="Grupos de apoio"
                  texto="Encontros de escuta e apoio para você e familiares"
                />
              </div>
            </div>

            <div className="passos-lateral">
              <div className="bv-continuar">
                <Button tamanho="medium" larguraTotal onClick={continuar}>
                  Continuar
                </Button>
              </div>
              <div className="bv-lateral-texto">
                <p className="bv-aviso">
                  A Margem não faz atendimento e não substitui profissional ou serviço público. Se você tem menos de 18
                  anos, conversar com seus responsáveis pode ajudar
                </p>
                <Button variante="transparent" className="bv-lateral-dados" onClick={verDados}>
                  Ver como a gente cuida dos seus dados
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="bv-rodape">
        <Footer />
        <Button variante="transparent" className="bv-rodape-dados" onClick={verDados}>
          Ver como a gente cuida dos seus dados
        </Button>
      </div>

      <PainelInferior
        variante="cookies"
        visivel={cookiesVisivel}
        onAceitar={aceitar}
        onRecusar={fecharCookies}
        onVerDados={verDados}
      />
      <PainelInferior variante="continuar" visivel={barraVisivel} onContinuar={continuar} />
    </main>
  );
}
