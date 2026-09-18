import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Avatar } from "@/components/ui/Avatar";
import { IconeAgendarWhatsapp, IconeSeta, IconeSetaResultado } from "@/components/icons";
import { escalaDeEspaco, lerEstilosDeTexto, lerTokens, rampasDeCor } from "@/lib/tokens-css";
import "./galeria.css";

// Galeria de componentes. Só dev: o instrucoes-design.md manda que todo componente apareça aqui,
// com todos os estados, antes de entrar numa tela.
//
// Ela mostra o que existe. Não é lugar de criar componente novo, e não tem cópia própria de token:
// a cor, o espaço e os estilos de texto são lidos dos arquivos gerados, a cada carregamento.

export const dynamic = "force-dynamic";

type PropsDeBotao = {
  variante?: "primary" | "secondary" | "transparent";
  tamanho?: "x-small" | "small" | "medium";
  redondo?: boolean;
  larguraTotal?: boolean;
};

type Combinacao = { titulo: string; usadaEm: string; props: PropsDeBotao; conteudo: ReactNode };

// As 8 combinações que aparecem em tela hoje, com o texto e o ícone que cada uma usa de verdade.
// O Figma tem 246 variantes; o resto não está em uso, então não está aqui.
const COMBINACOES: Combinacao[] = [
  {
    titulo: "primary / x-small / redondo",
    usadaEm: "FiltroEspecialidade, opção selecionada",
    props: { variante: "primary", tamanho: "x-small", redondo: true },
    conteudo: "Psicologos",
  },
  {
    titulo: "secondary / x-small / redondo",
    usadaEm: "FiltroEspecialidade, opção não selecionada",
    props: { variante: "secondary", tamanho: "x-small", redondo: true },
    conteudo: "Psiquiatras",
  },
  {
    titulo: "secondary / small / redondo",
    usadaEm: "ActionButton, que vira link quando tem href, e SectionJump",
    props: { variante: "secondary", tamanho: "small", redondo: true },
    conteudo: "Saiba mais",
  },
  {
    titulo: "transparent / small / canto 12",
    usadaEm: "BotaoTopicos",
    props: { variante: "transparent", tamanho: "small" },
    conteudo: (
      <>
        Se preferir, veja os tópicos <IconeSeta />
      </>
    ),
  },
  {
    titulo: "transparent / small / redondo / largura total",
    usadaEm: "BotaoServicosPublicos",
    props: { variante: "transparent", tamanho: "small", redondo: true, larguraTotal: true },
    conteudo: (
      <>
        Se preferir, veja os serviços públicos <IconeSetaResultado />
      </>
    ),
  },
  {
    titulo: "primary / small / canto 12 / largura total",
    usadaEm: "BotaoAgendar, que já nasce desabilitado",
    props: { variante: "primary", tamanho: "small", larguraTotal: true },
    conteudo: (
      <>
        <IconeAgendarWhatsapp />
        Agendar por WhatsApp
      </>
    ),
  },
  {
    titulo: "primary / medium / canto 12 / largura total",
    usadaEm: "BotaoContinuar no onboarding e na proteção de dados",
    props: { variante: "primary", tamanho: "medium", larguraTotal: true },
    conteudo: "Continuar",
  },
  {
    titulo: "primary / medium / canto 12",
    usadaEm: "BotaoContinuar dentro do ResponseError",
    props: { variante: "primary", tamanho: "medium" },
    conteudo: "Tentar novamente",
  },
];

// Os 6 estados do Figma. Três dependem do ponteiro, e a galeria força pelo atributo que o
// botao.css conhece. Os outros três são prop do componente ou o próprio repouso.
const ESTADOS = ["default", "hover", "pressed", "focus", "disabled", "loading"] as const;
type Estado = (typeof ESTADOS)[number];

function forcado(estado: Estado) {
  return estado === "hover" || estado === "pressed" || estado === "focus" ? estado : undefined;
}

const ESTADOS_DE_CHECKBOX = ["default", "checked", "focus"] as const;

// As duas variantes do `avatar` no Figma, e só elas.
//
// Não há um terceiro palco para "foto que não carrega". O componente tem um onError que troca para
// o fallback, mas ele só pega enquanto a página está viva: se a imagem falha antes do React
// hidratar, o handler ainda não está no elemento e o navegador fica com o ícone de imagem quebrada.
// Um palco que mostrasse isso como estado do componente estaria mentindo.
const ESTADOS_DE_AVATAR: Array<{ nome: string; src?: string; nota: string }> = [
  { nome: "photo", src: "/assets/professional-avatar.png", nota: "foto do cadastro" },
  { nome: "fallback", nota: "sem foto cadastrada, e para onde o onError leva" },
];

export default async function GaleriaDeComponentes() {
  if (process.env.NODE_ENV === "production") notFound();

  const { tokens, porNome } = await lerTokens();
  const estilosDeTexto = await lerEstilosDeTexto(porNome);
  const rampas = rampasDeCor(tokens);
  const espacos = escalaDeEspaco(tokens);

  return (
    <main className="galeria">
      <header className="galeria-topo">
        <h1 className="header-large">Galeria de componentes</h1>
        <p className="text-medium-regular">
          Página de desenvolvimento. Mostra o que já existe em código, com os estados que o CSS
          define. Cor, espaço e estilo de texto vêm de app/tokens.css e app/estilos-de-texto.css,
          lidos a cada carregamento.
        </p>
      </header>

      <section className="galeria-secao">
        <h2 className="header-medium">Button</h2>
        <p className="text-small-regular galeria-nota">
          {COMBINACOES.length} combinações em uso, {ESTADOS.length} estados cada.
        </p>

        {COMBINACOES.map((combinacao) => (
          <article className="galeria-combinacao" key={combinacao.titulo}>
            <h3 className="label-small-medium">{combinacao.titulo}</h3>
            <p className="label-xx-small galeria-nota">{combinacao.usadaEm}</p>
            <div className="galeria-estados">
              {ESTADOS.map((estado) => (
                <div className="galeria-estado" key={estado} data-estado-forcado={forcado(estado)}>
                  <div className="galeria-palco">
                    <Button
                      {...combinacao.props}
                      disabled={estado === "disabled"}
                      carregando={estado === "loading"}
                    >
                      {combinacao.conteudo}
                    </Button>
                  </div>
                  <span className="label-xx-small galeria-nome">{estado}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="galeria-secao">
        <h2 className="header-medium">Checkbox</h2>
        <p className="text-small-regular galeria-nota">
          Os estados que o CSS define hoje. Hover e desabilitado não existem no componente.
        </p>
        <div className="galeria-estados">
          {ESTADOS_DE_CHECKBOX.map((estado) => (
            <div
              className="galeria-estado"
              key={estado}
              data-estado-forcado={estado === "focus" ? "focus" : undefined}
            >
              <label className="galeria-palco galeria-palco-checkbox">
                <Checkbox selected={estado === "checked"} />
              </label>
              <span className="label-xx-small galeria-nome">{estado}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="galeria-secao">
        <h2 className="header-medium">Avatar</h2>
        <p className="text-small-regular galeria-nota">
          As duas variantes do Figma. Quem escolhe entre elas é o dado, não quem chama o componente.
        </p>
        <div className="galeria-estados">
          {ESTADOS_DE_AVATAR.map((estado) => (
            <div className="galeria-estado" key={estado.nome}>
              <div className="galeria-palco">
                <Avatar className="galeria-avatar" src={estado.src} />
              </div>
              <span className="label-xx-small galeria-nome">{estado.nome}</span>
              <span className="label-xx-small galeria-nota">{estado.nota}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="galeria-secao">
        <h2 className="header-medium">Estilos de texto</h2>
        <p className="text-small-regular galeria-nota">
          {estilosDeTexto.length} estilos, lidos de app/estilos-de-texto.css. Cada linha está
          renderizada no próprio estilo, e ao lado estão os tokens que ele compõe.
        </p>
        {estilosDeTexto.map((estilo) => (
          <article className="galeria-estilo" key={estilo.classe}>
            <p className={estilo.classe}>{estilo.classe}</p>
            <ul className="label-xx-small galeria-nota galeria-declaracoes">
              {estilo.declaracoes.map((declaracao) => (
                <li key={declaracao.propriedade}>
                  {declaracao.propriedade}: {declaracao.token ?? declaracao.valor}
                  {declaracao.token ? ` (${declaracao.valor})` : ""}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="galeria-secao">
        <h2 className="header-medium">Cor</h2>
        <p className="text-small-regular galeria-nota">
          {rampas.length} rampas, lidas de app/tokens.css.
        </p>
        {rampas.map((rampa) => (
          <article className="galeria-rampa" key={rampa.grupo}>
            <h3 className="label-small-medium">{rampa.grupo}</h3>
            <div className="galeria-amostras">
              {rampa.tokens.map((token) => (
                <div className="galeria-amostra" key={token.nome}>
                  <span className="galeria-cor" style={{ background: `var(${token.nome})` }} />
                  <span className="label-xx-small galeria-nome">
                    {token.nome.replace("--colors-", "")}
                  </span>
                  <span className="label-xx-small galeria-nota">{token.valor}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="galeria-secao">
        <h2 className="header-medium">Espaço</h2>
        <p className="text-small-regular galeria-nota">
          {espacos.length} degraus, lidos de app/tokens.css. A barra tem a largura do próprio token.
        </p>
        <div className="galeria-espacos">
          {espacos.map((token) => (
            <div className="galeria-espaco" key={token.nome}>
              <span className="label-xx-small galeria-nome">
                {token.nome.replace("--spacing-", "")}
              </span>
              <span className="galeria-barra" style={{ width: `var(${token.nome})` }} />
              <span className="label-xx-small galeria-nota">{token.valor}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
