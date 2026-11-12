"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CardPlano } from "@/components/apoio/CardPlano";
import { DadosPixModal } from "@/components/apoio/DadosPixModal";
import { FormularioDadosPix } from "@/components/apoio/FormularioDadosPix";
import { TelaPix } from "@/components/apoio/TelaPix";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { CardProfissionais } from "@/components/conversa/CardProfissionais";
import type { ProfissionalCadastrado } from "@/lib/supabase";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { IconeConfirmado, IconeEditar } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { PainelInferior } from "@/components/ui/PainelInferior";
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
  VALOR_SUGERIDO,
  VALORES_PROGRAMA,
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

const MINIMO_PROGRAMA = VALORES_PROGRAMA[0];
const MAXIMO_PROGRAMA = VALORES_PROGRAMA[VALORES_PROGRAMA.length - 1];

type Etapa ="carregando" | "plano" | "valor" | "sessao" | "resumo" | "dados" | "pix" | "expirado" | "confirmado";

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
  // Voltou pelo lápis do resumo: a escolha leva de volta ao resumo, sem passar pela outra tela.
  const [editando, setEditando] = useState(false);
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

  // A barra do Continuar e a do Gerar Pix entram subindo quando o resumo e a tela de dados abrem, como no /plano.
  useEffect(() => {
    if (etapa !== "dados" && etapa !== "resumo") {
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

  // Lápis do resumo: volta à escolha e, ao continuar, retorna ao resumo.
  function editar(tela: "valor" | "sessao") {
    setEditando(true);
    irPara(tela);
  }

  function continuarDoValor() {
    if (editando || plano === "programa") irPara("resumo");
    else irPara("sessao");
    setEditando(false);
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
      <div className="plano-pagina familia-checkout" aria-busy="true">
        <ContainerConteudo id="familia-carregando">
          <Loader />
        </ContainerConteudo>
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
  const podeVoltar = etapa === "plano" || etapa === "valor" || etapa === "sessao" || etapa === "resumo" || etapa === "dados";
  const continuarDoResumo = () => irPara("dados");
  const linkGratuito = (
    <p className="plano-nota">
      Nem o menor valor cabe agora?{" "}
      <Button variante="transparent" tamanho="small" semPadding href="/familia/acesso-gratuito?origem=checkout">
        Pedir acesso gratuito
      </Button>
    </p>
  );

  return (
    <div className="plano-pagina familia-checkout" data-etapa={etapa}>
      {podeVoltar && (
        <div className="familia-checkout-topo">
          <button className="familia-voltar" type="button" aria-label="Voltar para a etapa anterior" onClick={voltar}>
            <GlifoArrowBack size={24} />
          </button>
        </div>
      )}

      {etapa === "plano" && (
        <ContainerConteudo id="familia-plano">
          <CardHeader as="h1" title="Como você quer começar" />
          <div className="plano-cards">
            <CardPlano
              arranjo="opcional"
              nome="Programa de 8 semanas"
              descricao="Você escolhe quanto pode pagar."
              faixa={{ valor: `R$ ${MINIMO_PROGRAMA} a R$ ${MAXIMO_PROGRAMA}` }}
              onSelecionar={() => escolherPlano("programa")}
            />
            <CardPlano
              arranjo="opcional"
              nome="Programa com acompanhamento"
              selo="20% de desconto"
              descricao="Tudo do programa de 8 semanas, mais:"
              complemento="a primeira sessão com um psicólogo parceiro, no valor que você escolher"
              faixa={{ antes: "A partir de ", valor: `R$ ${valoresDoPrograma("acompanhamento")[0]}`, depois: " + sessão" }}
              destaque
              onSelecionar={() => escolherPlano("acompanhamento")}
            />
          </div>
          {linkGratuito}
        </ContainerConteudo>
      )}

      {etapa === "valor" && (
        <ContainerConteudo id="familia-valor">
          <CardHeader
            as="h1"
            title="Quanto você quer pagar"
            description="O conteúdo do programa é igual em qualquer valor que você escolher. Quem pode pagar mais ajuda a manter o programa aberto para quem não pode pagar agora."
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
          {plano === "acompanhamento" && <p className="plano-nota">Ao incluir a primeira sessão, o valor do programa começa 20% menor.</p>}
          {plano === "programa" && (
            <p className="plano-nota">Pagamento único no Pix · 8 semanas de acesso · {DIAS_PARA_DESISTIR} dias para pedir o dinheiro de volta.</p>
          )}
          <Button tamanho="medium" larguraTotal onClick={continuarDoValor}>
            Continuar para o pagamento
          </Button>
          {linkGratuito}
        </ContainerConteudo>
      )}

      {etapa === "sessao" && (
        <ContainerConteudo id="familia-sessao">
          <CardHeader
            as="h1"
            title="Quanto você quer pagar na sessão"
            description="A sessão é igual em qualquer valor que você escolher: o mesmo tempo e o mesmo cuidado do psicólogo parceiro. Quem pode pagar mais ajuda a manter os atendimentos abertos para quem não pode pagar agora."
          />
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
          <Button tamanho="medium" larguraTotal disabled={sessao === null} onClick={() => { setEditando(false); irPara("resumo"); }}>
            Continuar para o pagamento
          </Button>
          {linkGratuito}
        </ContainerConteudo>
      )}

      {/* Resumo antes do pagamento: o mesmo cartão do "Planos selecionados" do /plano, com o lápis em cada linha. */}
      {etapa === "resumo" && (
        <ContainerConteudo id="familia-resumo">
          <CardHeader as="h1" title="Resumo do pagamento" description="Confira os valores antes de continuar" />
          <section className="plano-resumo">
            <div className="plano-resumo-itens">
              <div className="plano-resumo-linha">
                <span>Programa de 8 semanas</span>
                <span className="plano-resumo-valor">
                  R$ {compra.valorPrograma}
                  <button type="button" aria-label="Trocar o valor do programa" onClick={() => editar("valor")}>
                    <IconeEditar />
                  </button>
                </span>
              </div>
              {compra.valorSessao !== null && (
                <div className="plano-resumo-linha">
                  <span>Primeira sessão</span>
                  <span className="plano-resumo-valor">
                    R$ {compra.valorSessao}
                    <button type="button" aria-label="Trocar o valor da sessão" onClick={() => editar("sessao")}>
                      <IconeEditar />
                    </button>
                  </span>
                </div>
              )}
            </div>
            <div className="plano-resumo-total">
              <span>Valor total</span>
              <strong>R$ {compra.total}</strong>
            </div>
          </section>
          <div className="plano-resumo-acoes">
            <p className="plano-nota">Pagamento único no Pix · 8 semanas de acesso · {DIAS_PARA_DESISTIR} dias para pedir o dinheiro de volta.</p>
            <Button tamanho="medium" onClick={continuarDoResumo}>
              Continuar para o pagamento
            </Button>
          </div>
        </ContainerConteudo>
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
        <ContainerConteudo id="familia-confirmado">
          <div className="plano-confirmacao">
            <IconeConfirmado />
            <h1>Pagamento confirmado</h1>
          </div>
          <div className="familia-confirmado-textos">
            <p className="text-medium-regular">O acesso às 8 semanas do programa já está liberado para você.</p>
            <p className="text-medium-regular">
              {modulo2Em ? `O módulo 2 chega em ${diaMes(modulo2Em.toISOString())}, e um` : "Um"} módulo novo fica disponível a cada semana.
            </p>
            {devolucaoAte && (
              <p className="text-medium-regular">Até {devolucaoAte} você pode pedir o seu dinheiro de volta, num toque, sem precisar explicar o motivo.</p>
            )}
            {plano === "acompanhamento" && (
              <p className="text-medium-regular">
                A gente avisa quem você escolheu para a sua primeira sessão. Essa pessoa entra em contato com você pelo WhatsApp para combinar o horário.
              </p>
            )}
          </div>
          <div className="familia-acoes">
            {temDiagnostico ? (
              <Button tamanho="medium" larguraTotal href="/familia/programa">
                Ir para o meu programa
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
        </ContainerConteudo>
      )}

      {etapa === "resumo" && <PainelInferior variante="continuar" visivel={painelVisivel} texto="Continuar para o pagamento" onContinuar={continuarDoResumo} />}
      {etapa === "dados" && <PainelInferior variante="pix" visivel={painelVisivel && !dadosAbertos} texto={textoDoValor} onGerar={() => void gerarPix()} />}
    </div>
  );
}
