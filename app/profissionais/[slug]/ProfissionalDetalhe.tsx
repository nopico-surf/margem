"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { CardFormacoes } from "@/components/conversa/CardFormacoes";
import { especialidadeLabel, hrefWhatsappProfissional, registroLabel } from "@/components/conversa/CardProfissionaisCompleto";
import { Avatar } from "@/components/ui/Avatar";
import { ValorSessaoPsicologos } from "@/components/ui/ValorSessaoPsicologos";
import { BotaoAgendar } from "@/components/ui/BotaoAgendar";
import { track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";

// Figma: Margem System, frames 668:924 (mobile), 670:2049 (tablet) e 670:1273 (desktop). É o mesmo
// conteúdo dos cards de /profissionais, reorganizado. Sem nenhum componente novo.

// Mobile: o menu é sólido e continua o fundo da foto. A cor sai da borda de cima da foto, logo abaixo
// do menu, em 12 colunas (mediana de 5 vizinhas, para cabelo ou chapéu que encoste no topo não virar
// mancha). As fotos são arquivos do próprio site, então o canvas consegue lê-las. Se não conseguir,
// vale a cor que o CSS já tem.
const COLUNAS = 12;
const FAIXA_LIDA = 10;

function mediana(pixels: Uint8ClampedArray, coluna: number, canal: number) {
  const vizinhas: number[] = [];
  for (let n = coluna - 2; n <= coluna + 2; n++) {
    vizinhas.push(pixels[Math.max(0, Math.min(COLUNAS - 1, n)) * 4 + canal]);
  }
  return vizinhas.sort((a, b) => a - b)[2];
}

function gradienteDoTopo(foto: HTMLImageElement, menu: HTMLElement): string | null {
  if (!foto.naturalWidth || !foto.naturalHeight) return null;
  try {
    const caixa = foto.getBoundingClientRect();
    const abaixoDoMenu = Math.max(0, menu.getBoundingClientRect().bottom - caixa.top);
    const k = Math.max(caixa.width / foto.naturalWidth, caixa.height / foto.naturalHeight); // object-fit: cover
    const desvioX = (caixa.width - foto.naturalWidth * k) / 2;
    const desvioY = (caixa.height - foto.naturalHeight * k) / 2;
    const sy = Math.min(foto.naturalHeight - 1, Math.max(0, (abaixoDoMenu - desvioY) / k));
    const sh = Math.max(1, Math.min(foto.naturalHeight - sy, FAIXA_LIDA / k));

    const larga = document.createElement("canvas");
    larga.width = 96;
    larga.height = 8;
    const ctxLarga = larga.getContext("2d", { willReadFrequently: true });
    const estreita = document.createElement("canvas");
    estreita.width = COLUNAS;
    estreita.height = 1;
    const ctxEstreita = estreita.getContext("2d", { willReadFrequently: true });
    if (!ctxLarga || !ctxEstreita) return null;

    ctxLarga.imageSmoothingQuality = "high";
    ctxEstreita.imageSmoothingQuality = "high";
    ctxLarga.drawImage(foto, -desvioX / k, sy, caixa.width / k, sh, 0, 0, larga.width, larga.height);
    ctxEstreita.drawImage(larga, 0, 0, larga.width, larga.height, 0, 0, COLUNAS, 1);

    const pixels = ctxEstreita.getImageData(0, 0, COLUNAS, 1).data;
    const paradas = Array.from({ length: COLUNAS }, (_, i) => {
      const cor = [0, 1, 2].map((canal) => mediana(pixels, i, canal)).join(",");
      return `rgb(${cor}) ${((i / (COLUNAS - 1)) * 100).toFixed(1)}%`;
    });
    return `linear-gradient(to right, ${paradas.join(", ")})`;
  } catch {
    return null;
  }
}

export function ProfissionalDetalhe({ profissional }: { profissional: ProfissionalCadastrado }) {
  const pathname = usePathname();
  const router = useRouter();
  const paginaRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const pagina = paginaRef.current;
    const foto = pagina?.querySelector<HTMLImageElement>(".profissional-foto");
    const menu = pagina?.querySelector<HTMLElement>(".app-header");
    if (!pagina || !foto || !menu) return;

    const tablet = window.matchMedia("(min-width: 48em)");
    const pintar = () => {
      const gradiente = tablet.matches ? null : gradienteDoTopo(foto, menu);
      if (gradiente) pagina.style.setProperty("--profissional-cor-topo", gradiente);
      else pagina.style.removeProperty("--profissional-cor-topo");
    };

    // ResizeObserver e não `resize` da janela: ele dispara depois do layout, já com o tamanho novo da foto.
    const observador = new ResizeObserver(pintar);
    observador.observe(foto);
    pintar();
    foto.addEventListener("load", pintar);
    tablet.addEventListener("change", pintar);
    return () => {
      observador.disconnect();
      foto.removeEventListener("load", pintar);
      tablet.removeEventListener("change", pintar);
    };
  }, []);

  // Volta para a tela anterior. Se a pessoa abriu esta página direto (link, aba nova), não há tela
  // anterior do site e a seta leva para /inicio. A Navigation API só conta telas do próprio site;
  // `history.length` também conta a aba em branco, por isso fica só como reserva.
  function voltar() {
    const navegacao = (window as Window & { navigation?: { canGoBack: boolean } }).navigation;
    const temTelaAnterior = navegacao ? navegacao.canGoBack : window.history.length > 1;
    track("voltar_clicado", { rota: pathname, destino: temTelaAnterior ? "tela_anterior" : "inicio" });
    if (temTelaAnterior) router.back();
    else router.push("/inicio");
  }

  const whatsappHref = hrefWhatsappProfissional(profissional);
  const formacoes = profissional.formacoes ?? [];

  function agendar() {
    track("agendar_whatsapp_clicado", {
      rota: pathname,
      tipo_recurso: "profissional",
      profissional_id: profissional.id,
      recurso_nome: profissional.nome,
      especialidade: profissional.especialidade,
      posicao: null,
    });
  }

  function botaoAgendar(className: string) {
    return (
      <div className={className}>
        <BotaoAgendar tamanho="medium" label="Agendar por WhatsApp" href={whatsappHref} disabled={!whatsappHref} onClick={agendar} />
      </div>
    );
  }

  return (
    <main ref={paginaRef} className="figma-result-page profissional-pagina">
      <Header
        onOpenMenu={() => {
          setMenuOpen(true);
          track("menu_clicado", { rota: pathname });
        }}
        hrefDoLogo="/inicio"
        onLogoClick={() => track("logo_clicado", { rota: pathname })}
        onVoltar={voltar}
      />
      <SideMenu
        open={menuOpen}
        rota={pathname}
        onClose={() => {
          setMenuOpen(false);
          track("menu_fechado", { rota: pathname });
        }}
      />

      <div className="profissional-conteudo">
        <div className="profissional-topo">
          <div className="profissional-foto-moldura">
            <Avatar className="profissional-foto" src={profissional.foto_url} />
          </div>

          <article className="profissional-card">
            <div className="profissional-identidade">
              <h1 className="profissional-nome">{profissional.nome}</h1>
              <p className="profissional-especialidade">{especialidadeLabel[profissional.especialidade]}</p>
              <div className="profissional-registro">
                <span>{profissional.registro_profissional && `${registroLabel[profissional.especialidade]}: ${profissional.registro_profissional}`}</span>
                <span>
                  {profissional.anos_experiencia != null &&
                    `${profissional.anos_experiencia} ${profissional.anos_experiencia === 1 ? "ano" : "anos"} de experiência`}
                </span>
              </div>
            </div>

            {profissional.especialidade === "psicologo" && (
              <ValorSessaoPsicologos />
            )}

            {profissional.tags.length > 0 && (
              <div className="figma-badges profissional-tags">
                {profissional.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}

            {botaoAgendar("profissional-agendar-card")}
          </article>
        </div>

        {(profissional.bio || profissional.abordagem || formacoes.length > 0) && (
          <div className="profissional-sobre">
            {profissional.bio && <CardHeader variante="cartao" title="Sobre mim" description={profissional.bio} />}
            {profissional.abordagem && <CardHeader variante="cartao" title="Minha abordagem" description={profissional.abordagem} />}
            <CardFormacoes formacoes={formacoes} />
          </div>
        )}
      </div>

      <Footer />

      {botaoAgendar("profissional-agendar-barra")}
    </main>
  );
}
