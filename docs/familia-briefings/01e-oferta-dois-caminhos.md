# Briefing 01e: a oferta mostra os dois caminhos, na LP e no resultado

**Claude Code · Sonnet 5.5 · esforço médio.** Os textos de tela já estão prontos aqui. Não escreva texto novo. Textos escritos e revisados direto no briefing, sem passagem pelo Gemini, como no N0 a N4.

Pré-requisito: briefings 01, 01b, 01c, 01d e N1 aplicados. Este briefing **substitui** os textos das variações a (LP) e b (resultado) do 01d, e a regra de preço do plano com acompanhamento do 01d, item 1. As variações c (fim do treino) e d (módulo bloqueado) continuam como estão, salvo a correção do apelido no item 1 abaixo.

Design de referência: canvas "Ofertas do Fôlego" (https://claude.ai/artifact/8Pz5zcnfysHpNWRMDa2cK4), com LP e resultado, no desktop e no celular. O Tweak `seguranca` do resultado mostra o modo de segurança.

## O problema

1. **O apelido não passa por `aplicarApelido`.** Em `components/familia/OfertaPrograma.tsx`, linhas 66, 67 e 70, os textos do resultado e do treino montam a frase com `${apelido}` cru. Sem apelido, a frase termina em "com ." em vez de cair em "quem você ama". Com o apelido "a", sai "com a.", que foi o que apareceu na tela.
2. **O resultado promete o que não existe.** "As 8 semanas foram pensadas para a sua situação" (linha 66) é falso: os módulos vêm de `content/familia/modulos/*.md` (`lib/familia/conteudo.ts`, `titulosDosModulosPagos`) e são iguais para todo mundo. O que é da pessoa é o mapa e o roteiro do resultado.
3. **O caminho com profissional some depois do diagnóstico.** A LP mostra os dois planos (linhas 128 a 147). A variação `resultado` mostra só o programa, justo no momento em que a pessoa está mais engajada.
4. **Os dois mini-cards da LP parecem opções para tocar, e não são.** Nada diz que o plano e o valor se escolhem no checkout. O botão "Já quero garantir meu acesso" (linha 170) não diz o que acontece ao tocar, e "garantir" puxa pressão de compra.
5. **O preço do acompanhamento está incompleto.** "A partir de R$ 37" não diz até quanto vai, e o card não mostra a faixa da sessão nem quanto custa no total.
6. **"Pedir acesso gratuito" não existe em nenhuma tela.** O 01d pede o link no resultado e no checkout, e a FAQ da LP promete que "na hora de pagar existe a opção de pedir acesso gratuito". A página `/familia/acesso-gratuito` existe, mas nenhum link leva até ela.
7. **Cadeados.** A lista dos módulos no resultado tem 8 `GlifoLock` seguidos (linha 153). Lido de cima para baixo, é uma lista do que está proibido, não do que vem pela frente.
8. **O nome muda entre telas.** A LP chama os planos de "Programa de 8 semanas" e "Programa com acompanhamento", e o checkout chama de "Fôlego" e "Fôlego com acompanhamento" (N1, item e).

## O que fazer

### Regras de preço que valem a partir daqui

- **Fôlego:** "R$ 47 a R$ 147".
- **Fôlego com acompanhamento:** "R$ 37 a R$ 147" pelo programa, mais a sessão de R$ 60 a R$ 200. Substitui o "A partir de R$ 37" do 01d. O começo da faixa é 20% menor, e o fim continua igual.
- O desconto é no programa, nunca na sessão. O selo diz isso.
- O total mínimo do acompanhamento é R$ 97 (R$ 37 + R$ 60). Calcule a partir das constantes, nunca escreva o número fixo.
- Preço e 14 dias, uma vez por tela.

### Os dois jeitos (bloco novo, usado na LP e no resultado)

**Só exibição. Nada aqui é selecionável.** O plano e o valor continuam sendo escolhidos no checkout, nas etapas `plano` e `valor`, como hoje. Os dois cards servem para a pessoa comparar antes de tocar no botão.

- Dois cards lado a lado no desktop, empilhados no celular, em `colors-neutral-50`, sem borda, sem radio, sem estado selecionado, sem hover e sem `onClick`. Nada que pareça botão.
- Acima dos cards, título (`header-small`) e uma linha de apoio (`text-medium-regular`, `colors-alpha-88`) dizendo onde a escolha acontece.
- Conteúdo de cada card, nesta ordem: nome (`header-small`), preço (`header-medium`, `colors-neutral-950`), uma frase (`text-medium-regular`, `colors-alpha-88`). No acompanhamento, o selo fica ao lado do nome, e a frase do total vem por último, em `text-medium-semibold`.
- "R$" e o número nunca quebram de linha separados (espaço não separável).
- No modo de segurança, nada muda nos cards. O checkout já pré-seleciona o acompanhamento.

**Título:** Os dois jeitos de fazer o Fôlego
**Apoio:** Você escolhe o jeito e o valor na próxima tela.

**Card 1**
> **Fôlego**
> R$ 47 a R$ 147
> Você faz as 8 semanas por conta própria, um módulo por semana.

**Card 2**
> **Fôlego com acompanhamento** · selo: **20% de desconto no programa**
> R$ 37 a R$ 147
> Inclui a primeira sessão com um psicólogo parceiro da Margem, e você escolhe quanto paga por ela, de R$ 60 a R$ 200.
> **O total começa em R$ 97, pago num Pix só.**

### Variação a: LP, bloco "Quanto custa"

Ordem, de cima para baixo:

1. Faixa verde, como hoje: rótulo "Quanto custa", preço "R$ 47 a R$ 147", e a linha de apoio nova:
   > Você escolhe quanto pagar, e o valor sugerido é R$ 97. Uma vez só, no Pix, com 14 dias para pedir o dinheiro de volta.
2. Logo abaixo, o link que abre o lightbox "Como funciona o valor" (o lightbox não muda). O texto "Saiba mais" sai, e entra:
   > Ver como funciona o valor
3. Corpo branco: "O que está incluído", a lista de 4 itens como está hoje, e logo abaixo da lista:
   > O conteúdo é o mesmo em qualquer valor.
4. Os dois jeitos.
5. Botão principal: **"Escolher meu valor e continuar"**. Leva para `/familia/checkout?origem=lp`, que abre na etapa `plano`, como hoje.
6. Botão secundário: **"Começar pelo diagnóstico grátis"**, como hoje.
7. Linha de rodapé, como hoje: "Você pode fazer o diagnóstico e experimentar um treino de conversa de graça, antes de decidir."

Na LP não entra "Pedir acesso gratuito" (01c).

### Variação b: resultado do diagnóstico

A posição não muda (depois dos avisos e, no modo de segurança, depois do cartão de segurança). Ordem:

1. Faixa verde com o título:
   > Os próximos passos com {{apelido}}
2. Texto:
   > Você já tem o mapa da situação e o roteiro da primeira conversa com {{apelido}}. Nas 8 semanas do Fôlego, você aprende e treina o que dizer e o que fazer, um módulo por semana.
3. Caixa em `colors-neutral-50` com o título "O que vem nas 8 semanas do Fôlego" e os 8 módulos em lista numerada. Cada número num círculo branco com borda `colors-neutral-200` e o número em `colors-brand-primary-800`. **Sem cadeado.** Duas colunas no desktop, uma no celular.
4. "O que está incluído", a mesma lista de 4 itens da LP e, logo abaixo, a mesma frase: "O conteúdo é o mesmo em qualquer valor."
5. Só em modo de segurança: a frase que já existe, "Na sua situação, ter um profissional junto faz ainda mais diferença.", num bloco em `colors-brand-primary-50`, logo acima dos dois jeitos.
6. Os dois jeitos.
7. Botão principal: **"Escolher meu valor e continuar"**. Leva para `/familia/checkout?origem=resultado`, que abre na etapa `plano`, como hoje.
8. Botão secundário: **"Treinar o meu roteiro"**, como hoje.
9. Rodapé:
   > Você escolhe quanto pagar, e o valor sugerido é R$ 97. Uma vez só, no Pix, com 14 dias para pedir o dinheiro de volta.
10. Link pequeno, logo abaixo do rodapé: **"Nem o menor valor cabe agora? Pedir acesso gratuito"**, para `/familia/acesso-gratuito`.

### Checkout

O fluxo não muda: plano, depois valor. Duas mudanças pequenas:

1. **Card "Fôlego com acompanhamento" da etapa 1:** a faixa passa de "A partir de R$ 37 + sessão" para "R$ 37 a R$ 147 + sessão".
2. **Link de acesso gratuito**, na etapa `valor`, abaixo da nota do pagamento, nos dois planos: **"Nem o menor valor cabe agora? Pedir acesso gratuito"**, para `/familia/acesso-gratuito`.

## Código

**`components/familia/OfertaPrograma.tsx`**
- Importar `aplicarApelido` de `@/lib/familia/diagnostico`. Os textos das variações `resultado` e `treino` passam a ser escritos com `{{apelido}}` e passam por `aplicarApelido(texto, apelido)` na renderização. Nenhum texto monta apelido com template string.
- Todo número dos textos (R$ 47, R$ 147, R$ 37, R$ 97 sugerido, R$ 60, R$ 200, o total mínimo e os 14 dias) vem de `lib/familia/oferta.ts`, nunca escrito à mão. No canvas, o apelido de exemplo é "Lu".
- Trocar `ITENS_LP` por `ITENS_INCLUIDOS`, usado pela LP e pelo resultado.
- Criar o bloco dos dois jeitos (no mesmo arquivo ou em `components/familia/DoisJeitos.tsx`), sem estado e sem handler. Os preços saem de `lib/familia/oferta.ts`: `VALORES_PROGRAMA`, `VALORES_PROGRAMA_COM_ACOMPANHAMENTO`, `SESSAO_MINIMA`, `SESSAO_MAXIMA`, `VALOR_SUGERIDO`. O total mínimo é `VALORES_PROGRAMA_COM_ACOMPANHAMENTO[0] + SESSAO_MINIMA`.
- Variação `lp`: tirar `oferta-programa-planos` (linhas 128 a 147) e o botão "Já quero garantir meu acesso". Entram os dois jeitos e o botão novo, para `/familia/checkout?origem=lp`.
- Variação `resultado`: tirar o `GlifoLock` da lista. Entram o número em círculo, "O que está incluído", os dois jeitos e o link de acesso gratuito. A frase de segurança sobe para antes dos dois jeitos.
- Variações `treino` e `bloqueado`: só a correção do apelido.
- Analytics: o `oferta_clicada` do botão principal usa `acao: "escolher_valor"` também na LP (a ação `garantir_acesso` sai).
- CSS: apagar as classes `oferta-programa-planos`, `oferta-programa-plano`, `oferta-programa-plano-nome` e `oferta-programa-plano-cabecalho` se ficarem sem uso. Usar os tokens do Margem System, sem valor cru.

**`app/familia/checkout/CheckoutCliente.tsx`**
- Linha 368: `faixa={{ valor: \`R$ ${VALORES_PROGRAMA_COM_ACOMPANHAMENTO[0]} a R$ ${MAXIMO_PROGRAMA}\`, depois: " + sessão" }}`, sem o `antes`.
- Etapa `valor`: o link de acesso gratuito.

**`app/familia/acesso-gratuito/AcessoGratuitoCliente.tsx`:** não muda. Confira se a página funciona para quem chega pelos links novos (com login e sem acesso liberado).

## Critério de aceite

- Com apelido vazio, o resultado e o fim do treino dizem "quem você ama", com a preposição certa. Nenhuma frase termina em "com ." ou "com a.".
- Em nenhuma tela sobra "foram pensadas para a sua situação" nem "Seu programa já está montado".
- A lista de módulos do resultado não tem cadeado.
- LP e resultado mostram os dois jeitos, e nada nos dois cards é clicável, selecionável ou focável pelo teclado.
- O botão principal leva ao checkout, que abre na etapa de plano como hoje. O valor só se escolhe no checkout.
- O acompanhamento aparece como "R$ 37 a R$ 147" na LP, no resultado e no checkout, e o total mínimo vem das constantes.
- "Pedir acesso gratuito" aparece no resultado e no checkout, e não aparece na LP.
- Nenhum botão diz "Já quero garantir meu acesso".
- Os nomes dos planos são "Fôlego" e "Fôlego com acompanhamento" na LP, no resultado e no checkout.
- Preço e 14 dias aparecem uma vez por tela.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
