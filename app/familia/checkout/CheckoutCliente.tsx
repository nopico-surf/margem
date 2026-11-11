"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CardPlano } from "@/components/apoio/CardPlano";
import { DadosPixModal } from "@/components/apoio/DadosPixModal";
import { FormularioDadosPix } from "@/components/apoio/FormularioDadosPix";
import { TelaPix } from "@/components/apoio/TelaPix";
import { CardHeader } from "@/components/conversa/CardHeader";
import { CardProfissionais } from "@/components/conversa/CardProfissionais";
import type { ProfissionalCadastrado } from "@/lib/supabase";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { IconeConfirmado } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { ValorSessaoPsicologos } from "@/components/ui/ValorSessaoPsicologos";
import {
  CAMPO_DO_ERRO,
  ERRO_DADOS_RECUSADOS,
  ERRO_DO_CAMPO,
  ERRO_PAGAMENTO_INDISPONIVEL,
  ERROS_DE_CAMPO,
  campoValido,
  usePix,
  type Campo,
  type QrCodeDaRota,
} from "@/lib/apoio/pix-cliente";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { devAtivo, statusDoPixDev } from "@/lib/familia/dev";
import { diaMes } from "@/lib/familia/escala";
import { guardarDestinoDepoisDoLogin } from "@/lib/familia/fluxo-cliente";
import { useEtapaNaUrl } from "@/lib/familia/useEtapaNaUrl";
import {
  SESSAO_MAXIMA,
  SESSAO_MINIMA,
  VALOR_PROGRAMA_COM_ACOMPANHAMENTO,
  VALOR_SUGERIDO,
  VALORES_SESSAO,
  DIAS_PARA_DESISTIR,
  dataDoModulo,
  fimDoPrazo,
  montarCompra,
  valorDaSessaoValido,
  valoresDoPrograma,
  type PlanoFamilia,
} from "@/lib/familia/oferta";
import { track } from "@/lib/mixpanel";

// Checkout do programa para familiares (briefing 01): plano, valor (ou valor da sessão, no plano com
// acompanhamento), dados para o Pix, Pix e confirmação. Os cards de plano são o CardPlano do /plano; a
// tela de dados, a do QR e o comportamento do Pix (contador, status, copiar, código vencido) são os do
// /plano (FormularioDadosPix, TelaPix, lib/apoio/pix-cliente.ts), com os textos do briefing.
//
// Nome e CPF ficam só na memória da aba, pra "Gerar um novo" reaproveitar. No Mixpanel entram a etapa,
// o plano e os valores escolhidos, nunca nome, CPF ou e-mail. Nada daqui vai pro dataLayer (Meta).

type Etapa = "carregando" | "plano" | "valor" | "sessao" | "dados" | "pix" | "expirado" | "confirmado";

const ITENS_DO_PROGRAMA = [
  "8 módulos, um por semana, também em áudio",
  "Diário e escala da sua vida",
  "Treino de conversa com IA",
  "Plano de segurança",
  "Resumo para levar a um profissional",
];

// `profissionais`: carrossel de psicólogos da confirmação do plano com acompanhamento.
export function CheckoutCliente({ profissionais }: { profissionais: ProfissionalCadastrado[] }) {
  const router = useRouter();
  // Cada etapa tem endereço próprio (?tela=valor, ?tela=dados...). O Pix desfaz as etapas do
  // formulário no histórico: voltar não reabre um Pix já gerado.
  const { etapa, irPara, trocar, concluir, voltar: voltarEtapa, podeVoltar: temEtapaAnterior } = useEtapaNaUrl<Etapa>("carregando", (e) =>
    e === "carregando" || e === "plano" ? null : e,
  );
  const [plano, setPlano] = useState<PlanoFamilia>("programa");
  const [valor, setValor] = useState<number>(VALOR_SUGERIDO);
  const [sessao, setSessao] = useState<number | null>(null);
  const [outroValorAberto, setOutroValorAberto] = useState(false);
  const [outroValor, setOutroValor] = useState("");
  const [erroOutroValor, setErroOutroValor] = useState("");
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [errosDeCampo, setErrosDeCampo] = useState<Partial<Record<Campo, string>>>({});
  const [erroGeral, setErroGeral] = useState("");
  const [gerando, setGerando] = useState(false);
  const [dadosAbertos, setDadosAbertos] = useState(false);
  const [painelVisivel, setPainelVisivel] = useState(false);
  const [temDiagnostico, setTemDiagnostico] = useState(true);
  const [modulo2Em, setModulo2Em] = useState<Date | null>(null);
  const [devolucaoAte, setDevolucaoAte] = useState<string | null>(null);
  const gerandoRef = useRef(false);
  const pixGerados = useRef(0);

  const compra = montarCompra(plano, valor, sessao);

  const { pix, segundosRestantes, codigoCopiado, mostrarPix, copiarCodigo } = usePix({
    naTela: etapa === "pix",
    consultando: etapa === "pix",
    consultar: devAtivo() ? async (id) => statusDoPixDev(id) : undefined,
    onExpirou: () => {
      trocar("expirado");
      track("pix_expirado", { plano });
    },
    onStatus: ({ status, pago }) => {
      if (pago || status === "pago") {
        trocar("confirmado");
        track("compra_concluida", { plano, valor_total: compra.total, valor_programa: compra.valorPrograma, valor_sessao: compra.valorSessao });
      } else if (status === "expirado") trocar("expirado");
    },
  });

  // Abre no plano. Sem sessão vai pro login e volta pra cá; com acesso já liberado, pro painel.
  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/perfil");
      if (!resposta || resposta.status === 401) {
        guardarDestinoDepoisDoLogin("/familia/checkout");
        return router.replace("/familia/entrar");
      }
      if (!resposta.ok) return trocar("plano");
      const perfil = (await resposta.json()) as { temPerfil: boolean; safetyMode: boolean; acessoLiberado: boolean; temDiagnostico: boolean };
      if (!perfil.temPerfil) {
        guardarDestinoDepoisDoLogin("/familia/checkout");
        return router.replace("/familia/entrar");
      }
      if (perfil.acessoLiberado) return router.replace("/familia/programa");
      setTemDiagnostico(perfil.temDiagnostico);
      // Em modo de segurança, o plano com acompanhamento vem pré-selecionado (briefing 01, etapa 1).
      if (perfil.safetyMode) setPlano("acompanhamento");
      trocar("plano");
      track("checkout_iniciado", { safety_mode: perfil.safetyMode, tem_diagnostico: perfil.temDiagnostico });
    })();
  }, [router]);

  // Cada troca de tela começa do topo, e cada etapa vista vai pro funil.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (etapa !== "carregando") track("checkout_etapa_vista", { etapa, plano });
    // O plano entra como propriedade, mas o evento é da troca de etapa.
  }, [etapa]);

  // A barra do Gerar Pix entra subindo quando a tela de dados abre, como no /plano.
  useEffect(() => {
    if (etapa !== "dados") {
      setPainelVisivel(false);
      return;
    }
    const quadro = requestAnimationFrame(() => setPainelVisivel(true));
    return () => cancelAnimationFrame(quadro);
  }, [etapa]);

  // Na confirmação, a data do módulo 2 (7 dias depois da conclusão do módulo 1) e o último dia pra pedir
  // o dinheiro de volta (briefing 01b), contado de quando o Pix caiu. Se o perfil ainda não trouxer a
  // compra, conta de agora: o acesso acabou de ser liberado.
  useEffect(() => {
    if (etapa !== "confirmado") return;
    setDevolucaoAte(fimDoPrazo(new Date().toISOString()));
    (async () => {
      const [resposta, perfil] = await Promise.all([chamarApi("/api/familia/progresso"), chamarApi("/api/familia/perfil")]);
      if (perfil?.ok) {
        const { compra: comprada } = (await perfil.json()) as { compra: { pagoEm: string } | null };
        if (comprada?.pagoEm) setDevolucaoAte(fimDoPrazo(comprada.pagoEm));
      }
      if (!resposta?.ok) return;
      const { modulos } = (await resposta.json()) as { modulos: Record<string, { concluido_em: string | null }> };
      setModulo2Em(dataDoModulo(2, modulos[1]?.concluido_em ?? null));
    })();
  }, [etapa]);

  function escolherPlano(escolhido: PlanoFamilia) {
    setPlano(escolhido);
    // R$ 47 só existe na régua do programa e R$ 37 só na do acompanhamento: trocando de plano, o valor
    // que não existe na régua nova cai no recomendado, nunca fica sem seleção (briefing 01c).
    if (!valoresDoPrograma(escolhido).includes(valor)) setValor(VALOR_SUGERIDO);
    track("plano_escolhido", { plano: escolhido });
    // Os dois planos escolhem o valor do programa; o com acompanhamento segue depois pra sessão.
    irPara("valor");
  }

  function escolherValor(escolhido: number) {
    setValor(escolhido);
    track("valor_escolhido", { plano, valor: escolhido, sugerido: escolhido === VALOR_SUGERIDO });
  }

  function escolherSessao(escolhido: number) {
    setSessao(escolhido);
    setOutroValorAberto(false);
    setOutroValor("");
    setErroOutroValor("");
    track("valor_escolhido", { plano: "acompanhamento", valor_sessao: escolhido, outro_valor: false });
  }

  function abrirOutroValor() {
    setOutroValorAberto(true);
    setSessao(null);
    track("outro_valor_aberto", { plano: "acompanhamento" });
  }

  function mudarOutroValor(texto: string) {
    const numeros = texto.replace(/\D/g, "").slice(0, 3);
    setOutroValor(numeros);
    setErroOutroValor("");
    const numero = Number(numeros);
    setSessao(valorDaSessaoValido(numero) ? numero : null);
  }

  function conferirOutroValor() {
    if (outroValor === "" || valorDaSessaoValido(Number(outroValor))) {
      if (outroValor !== "") track("valor_escolhido", { plano: "acompanhamento", valor_sessao: Number(outroValor), outro_valor: true });
      return;
    }
    setErroOutroValor(`Escolha um valor entre R$ ${SESSAO_MINIMA} e R$ ${SESSAO_MAXIMA}.`);
  }

  function voltar() {
    track("checkout_voltou", { de: etapa });
    if (temEtapaAnterior) voltarEtapa();
    else router.back();
  }

  function mudarCampo(campo: Campo, texto: string) {
    if (campo === "nome") setNome(texto);
    // Só números, como no /plano.
    if (campo === "cpfCnpj") setCpfCnpj(texto.replace(/\D/g, "").slice(0, 14));
    if (errosDeCampo[campo]) setErrosDeCampo((erros) => ({ ...erros, [campo]: undefined }));
    if (erroGeral) setErroGeral("");
  }

  function conferirCampo(campo: Campo) {
    const texto = campo === "nome" ? nome : cpfCnpj;
    if (texto.trim() === "" || campoValido(campo, texto)) return;
    setErrosDeCampo((erros) => ({ ...erros, [campo]: ERRO_DO_CAMPO[campo] }));
  }

  async function gerarPix() {
    if (gerandoRef.current) return;
    // O botão nunca fica desabilitado: com campo vazio ou inválido, o toque mostra os erros na hora.
    const invalidos = (["nome", "cpfCnpj"] as const).filter((campo) => !campoValido(campo, campo === "nome" ? nome : cpfCnpj));
    if (invalidos.length > 0) {
      setErrosDeCampo(Object.fromEntries(invalidos.map((campo) => [campo, ERRO_DO_CAMPO[campo]])));
      trocar("dados");
      return;
    }

    gerandoRef.current = true;
    setGerando(true);
    setErrosDeCampo({});
    setErroGeral("");
    const deNovo = etapa === "expirado";
    try {
      const resposta = await chamarApi("/api/familia/pix", {
        method: "POST",
        body: JSON.stringify({ plano, valor: compra.valorPrograma, valorSessao: compra.valorSessao, nome, cpfCnpj }),
      });
      if (!resposta || resposta.status === 401) {
        guardarDestinoDepoisDoLogin("/familia/checkout");
        router.replace("/familia/entrar");
        return;
      }
      const corpo = (await resposta.json().catch(() => null)) as { apoioId?: string; qrCode?: QrCodeDaRota; error?: string } | null;
      if (resposta.ok && corpo?.apoioId && corpo.qrCode) {
        mostrarPix(corpo.apoioId, corpo.qrCode);
        pixGerados.current += 1;
        track(deNovo ? "pix_gerado_de_novo" : "pix_gerado", { plano, valor_total: compra.total, vez: pixGerados.current });
        concluir("pix");
        return;
      }
      const codigo = corpo?.error;
      track("pix_falhou", { motivo: codigo ?? "desconhecido" });
      if (codigo && codigo in ERROS_DE_CAMPO) {
        const chave = codigo as keyof typeof ERROS_DE_CAMPO;
        setErrosDeCampo({ [CAMPO_DO_ERRO[chave]]: ERROS_DE_CAMPO[chave] });
        trocar("dados");
      } else if (codigo === "acesso_ja_liberado") {
        router.replace("/familia/programa");
      } else if (codigo === "valor_invalido") {
        trocar("plano");
      } else {
        setErroGeral(codigo === "dados_recusados" ? ERRO_DADOS_RECUSADOS : ERRO_PAGAMENTO_INDISPONIVEL);
        trocar("dados");
      }
    } catch {
      setErroGeral(ERRO_PAGAMENTO_INDISPONIVEL);
      trocar("dados");
    } finally {
      gerandoRef.current = false;
      setGerando(false);
    }
  }

  async function copiar() {
    if (await copiarCodigo()) track("pix_copiado", { plano });
  }

  function abrirPorQue() {
    setDadosAbertos(true);
    track("dados_por_que_pedimos_aberto", { origem: "familia_checkout" });
  }

  if (etapa === "carregando" || gerando) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  // "Por que pedimos esses dados?" abre como no /plano: página própria por cima do fluxo.
  if (dadosAbertos) {
    return (
      <div className="dados-page">
        <DadosPixModal semNotaFiscal onClose={() => setDadosAbertos(false)} />
      </div>
    );
  }

  const textoDoValor = `Valor total: R$ ${compra.total}`;
  const podeVoltar = etapa === "plano" || etapa === "valor" || etapa === "sessao" || etapa === "dados";
  const linkGratuito = (
    <p className="plano-nota">
      Nem o valor mínimo cabe agora?{" "}
      <Button variante="transparent" tamanho="small" semPadding href="/familia/acesso-gratuito?origem=checkout">
        Pedir acesso gratuito
      </Button>
    </p>
  );

  return (
    <div className="familia-checkout" data-etapa={etapa}>
      {podeVoltar && (
        <div className="familia-checkout-topo">
          <button className="familia-voltar" type="button" aria-label="Voltar para a etapa anterior" onClick={voltar}>
            <GlifoArrowBack size={24} />
          </button>
        </div>
      )}

      {etapa === "plano" && (
        <section className="familia-secao">
          <div className="plano-cards">
            <CardPlano
              arranjo="opcional"
              nome="Programa"
              itens={ITENS_DO_PROGRAMA}
              descricao="Você escolhe quanto pagar, de R$ 47 a R$ 147."
              selecionado={plano === "programa"}
              onSelecionar={() => escolherPlano("programa")}
            />
            <CardPlano
              arranjo="opcional"
              nome="Programa com acompanhamento"
              selo="Recomendado"
              descricao="Nos estudos, os melhores resultados aparecem quando o familiar tem apoio de um profissional."
              complemento="Programa por R$ 47 + a primeira sessão com um profissional parceiro."
              selecionado={plano === "acompanhamento"}
              onSelecionar={() => escolherPlano("acompanhamento")}
            />
          </div>
          {linkGratuito}
        </section>
      )}

      {etapa === "valor" && (
        <section className="familia-secao">
          <CardHeader
            as="h1"
            title="Escolha quanto pagar"
            description="Quem pode pagar mais ajuda a manter o programa acessível para quem pode pagar menos. O conteúdo é o mesmo em qualquer valor."
          />
          <div className="familia-chips familia-valores" role="group" aria-label="Valor do programa">
            {valoresDoPrograma(plano).map((opcao) => (
              <Button
                key={opcao}
                tamanho="medium"
                redondo
                variante={valor === opcao ? "primary" : "secondary"}
                aria-label={opcao === VALOR_SUGERIDO ? `R$ ${opcao}, sugerido` : `R$ ${opcao}`}
                onClick={() => escolherValor(opcao)}
              >
                R$ {opcao}
                {opcao === VALOR_SUGERIDO && <small> (sugerido)</small>}
              </Button>
            ))}
          </div>
          {plano === "acompanhamento" && <p className="plano-nota">Levando a primeira sessão junto, o programa começa 20% mais barato.</p>}
          <p className="plano-nota">Pagamento único no Pix · 8 semanas de acesso · {DIAS_PARA_DESISTIR} dias para pedir o dinheiro de volta.</p>
          <Button tamanho="medium" larguraTotal onClick={() => irPara(plano === "programa" ? "dados" : "sessao")}>
            Continuar para o pagamento
          </Button>
          {linkGratuito}
        </section>
      )}

      {etapa === "sessao" && (
        <section className="familia-secao">
          <ValorSessaoPsicologos especialidade="psicologo" />
          <div className="familia-chips familia-valores" role="group" aria-label="Valor da sessão">
            {VALORES_SESSAO.map((opcao) => (
              <Button
                key={opcao}
                tamanho="medium"
                redondo
                variante={!outroValorAberto && sessao === opcao ? "primary" : "secondary"}
                onClick={() => escolherSessao(opcao)}
              >
                R$ {opcao}
              </Button>
            ))}
            <Button tamanho="medium" redondo variante="transparent" onClick={abrirOutroValor}>
              Outro valor
            </Button>
          </div>
          {outroValorAberto && (
            <InputText
              id="familia-outro-valor"
              rotulo="Outro valor"
              value={outroValor}
              onChange={mudarOutroValor}
              onBlur={conferirOutroValor}
              erro={erroOutroValor || undefined}
              descricao={`De R$ ${SESSAO_MINIMA} a R$ ${SESSAO_MAXIMA}`}
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
            />
          )}
          {sessao !== null && (
            <div className="text-large">
              <p>Programa: R$ {compra.valorPrograma}</p>
              <p>Primeira sessão: R$ {sessao}</p>
              <p>
                <strong>Total: R$ {compra.total}, num Pix só</strong>
              </p>
            </div>
          )}
          <Button tamanho="medium" larguraTotal disabled={sessao === null} onClick={() => irPara("dados")}>
            Continuar para o pagamento
          </Button>
          {linkGratuito}
        </section>
      )}

      {etapa === "dados" && (
        <FormularioDadosPix
          id="familia-dados"
          campos={["nome", "cpfCnpj"]}
          valores={{ nome, cpfCnpj, email: "" }}
          erros={errosDeCampo}
          erroGeral={erroGeral}
          textoDoValor={textoDoValor}
          onMudar={mudarCampo}
          onConferir={conferirCampo}
          onGerar={() => void gerarPix()}
          onPorQue={abrirPorQue}
          nota={`Se não for para você, peça o dinheiro de volta em até ${DIAS_PARA_DESISTIR} dias. Num toque, sem precisar explicar por quê.`}
        />
      )}

      {(etapa === "pix" || etapa === "expirado") && pix && (
        <TelaPix
          id="familia-pix"
          pix={pix}
          titulo="Pague com Pix"
          descricao="Abra o app do seu banco, escolha pagar com Pix e escaneie o código ou cole o código copiado."
          segundosRestantes={segundosRestantes}
          vencido={etapa === "expirado" ? { titulo: "O código expirou", botao: "Gerar um novo" } : null}
          codigoCopiado={codigoCopiado}
          onCopiar={() => void copiar()}
          onGerarOutro={() => void gerarPix()}
          gerando={gerando}
        />
      )}

      {etapa === "confirmado" && (
        <section className="familia-secao">
          <div className="plano-confirmacao">
            <IconeConfirmado />
            <h1>Pagamento confirmado.</h1>
          </div>
          {devolucaoAte && (
            <p className="text-large">
              Seu acesso está liberado. Até {devolucaoAte} você pode pedir o dinheiro de volta, num toque, sem precisar explicar por quê.
            </p>
          )}
          <p className="text-large">
            {modulo2Em ? `O módulo 2 chega em ${diaMes(modulo2Em.toISOString())}. ` : ""}A cada semana, um novo módulo.
          </p>
          <div className="familia-acoes">
            {temDiagnostico ? (
              <Button tamanho="medium" larguraTotal href="/familia/programa">
                Voltar ao painel
              </Button>
            ) : (
              <Button tamanho="medium" larguraTotal href="/familia/diagnostico">
                Fazer o diagnóstico
              </Button>
            )}
          </div>
          {/* Plano com acompanhamento: a primeira sessão já está paga e segue o valor dos psicólogos. */}
          {plano === "acompanhamento" && (
            <CardProfissionais
              profissionais={profissionais}
              variante="home"
              especialidades={["psicologo"]}
              id="familia-profissionais"
              origem="programa-checkout"
              titulo="Profissionais que podem atender você"
            />
          )}
        </section>
      )}

      {etapa === "dados" && <PainelInferior variante="pix" visivel={painelVisivel && !dadosAbertos} texto={textoDoValor} onGerar={() => void gerarPix()} />}
    </div>
  );
}
