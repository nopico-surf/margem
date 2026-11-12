# Briefing 01d: todos os textos da oferta, em todos os lugares

Pré-requisitos: briefings 00, 01, 01b e 01c. **Este briefing substitui os textos das variações a, b, c, d e do checkout do briefing 01.** O resto do 01 (visual do card, tela de Pix, analytics) continua valendo.

Com o 01b, o módulo 1 deixou de ser grátis e o prazo virou 14 dias. Isso derruba quase todo texto escrito no 01, porque ele prometia módulo 1 grátis. Aqui está tudo reescrito e fechado, sem nada para o Claude Code inventar. Todos os textos de tela passaram pelo Gemini e foram revisados depois.

## 1. Regras de preço, válidas em qualquer tela

- **Programa sozinho:** escrever sempre **"R$ 47 a R$ 147"**. Nunca "a partir de R$ 47".
- **Com acompanhamento:** escrever sempre **"A partir de R$ 37"**, com o selo **"20% de desconto"** ao lado do nome do plano.
- O selo é só um: nesse card não existe também o selo "Recomendado". A recomendação vira frase, com o motivo junto, porque "recomendado" sozinho é opinião sem argumento, e o desconto é informação nova.
- **O desconto é no programa, nunca na sessão.** Onde couber, a frase inteira: "20% de desconto no programa".
- Preço e os 14 dias andam juntos: onde aparece preço, aparece o prazo, **uma vez por tela**.
- Total sempre em linhas separadas, nunca só o número somado.

## 2. Onde a oferta aparece agora

| Lugar | Quem vê | Variação |
|---|---|---|
| LP, bloco "Quanto custa", antes da FAQ | qualquer pessoa | **a** |
| Resultado do diagnóstico | quem fez o diagnóstico e não comprou | **b** |
| Fim do treino grátis | quem usou o treino e não comprou | **c** |
| `/familia/programa/...` sem compra | quem tenta entrar direto | **d** |
| Checkout | quem clicou em comprar | etapas 1 a 4 |

A variação "módulo 1" do briefing 01 **deixa de existir**: não há mais módulo 1 grátis para ter banner no fim. No lugar dela entra a variação c, o fim do treino grátis.

## 3. Variação a: bloco "Quanto custa" na LP

Topo do bloco, o texto curto com o lightbox: está no briefing 01c, item 1. Abaixo dele, no mesmo bloco:

**O que está incluído** (lista curta, com ícone da Margem):
- 8 módulos, um por semana, também em áudio
- Diário e escala da sua vida
- Treino de conversa, para ensaiar antes de falar
- Plano de segurança

(O "resumo para levar a um profissional" sai da lista. Ele ainda não existe, e prometer na LP o que a tela não entrega é o mesmo erro do "horário nesta semana".)

**Dois mini-cards, lado a lado, empilhados no celular:**

> **Programa de 8 semanas**
> R$ 47 a R$ 147, e você escolhe quanto pode pagar.

> **Programa com acompanhamento** · selo: **20% de desconto**
> A partir de R$ 37 pelo programa, mais a primeira sessão com um profissional parceiro, no valor que você escolher.
> Com um profissional junto, você não precisa decidir sem ajuda o que fazer em casa.

**Botão principal:** "Começar pelo diagnóstico grátis"
**Link secundário:** "Já quero garantir meu acesso"
**Linha de apoio, abaixo dos botões:** "Você pode fazer o diagnóstico e experimentar um treino de conversa de graça, antes de decidir."

## 4. Variação b: resultado do diagnóstico

Posição: depois dos avisos, antes do bloco de emergência. Em `safety_mode`, depois do card de segurança e do plano de segurança, nunca antes.

> **Seu programa já está montado**
> As 8 semanas foram pensadas para a sua situação com {{apelido}}.
> Antes de decidir, você pode treinar de graça a sua primeira conversa com {{apelido}}.

Lista com os títulos dos 8 módulos, cadeado discreto em cinza, sem vermelho e sem "bloqueado".

**Botão principal:** "Escolher meu valor e continuar"
**Botão secundário:** "Treinar o meu roteiro" (o treino grátis do briefing 01b, item 2)
**Linha de apoio:** "R$ 47 a R$ 147, você escolhe. Uma vez só, no Pix, com 14 dias para pedir o dinheiro de volta."
**Link pequeno:** "Pedir acesso gratuito"

Em `safety_mode`, acrescentar acima dos botões: "Na sua situação, ter um profissional junto faz ainda mais diferença." e deixar o plano com acompanhamento pré-selecionado no checkout.

## 5. Variação c: fim do treino grátis

Aparece abaixo da mensagem `limite_gratis`, que já existe.

> **Esse foi o seu treino de graça**
> No programa, você treina outras conversas com {{apelido}}. Você ensaia o que dizer quando {{apelido}} nega o problema, como recusar um pedido de dinheiro, como elogiar sem soar como cobrança, e como fazer o convite para aceitar ajuda.

**Botão principal:** "Escolher meu valor e continuar"
**Linha de apoio:** "R$ 47 a R$ 147, você escolhe. Uma vez só, no Pix, com 14 dias para pedir o dinheiro de volta."
**Link pequeno:** "Pedir acesso gratuito"

## 6. Variação d: tentou entrar sem comprar

Nunca mostrar página vazia nem erro. A tela mostra o título do módulo, dois itens de "O que você vai ver nesta semana" (tirados do próprio módulo) e o card:

> **Esta semana faz parte do programa**
> O conteúdo desta semana abre com a compra. Os 8 módulos chegam um por semana, e as ferramentas ficam disponíveis para você.

**Botão principal:** "Escolher meu valor e continuar"
**Linha de apoio:** a mesma da variação c.
**Link pequeno:** "Pedir acesso gratuito"

## 7. Checkout

### Etapa 1: escolher o plano

> **Como você quer começar**

Dois cards selecionáveis, o mesmo texto dos mini-cards da LP, mais, no card com acompanhamento:
> "Nos estudos deste método, quem faz o programa com apoio profissional tem mais chance de avançar do que quem segue sem acompanhamento."

Pré-selecionado: **Programa**. Em `safety_mode`: **com acompanhamento**.

### Etapa 2: escolher o valor

> **Quanto você quer pagar**
> O conteúdo do programa é igual em qualquer valor que você escolher. Quem pode pagar mais ajuda a manter o programa aberto para quem não pode pagar agora.

Botões, conforme o plano escolhido na etapa 1 (briefing 01c, item 2):
- Programa: R$ 47 · R$ 67 · **R$ 97** · R$ 127 · R$ 147
- Com acompanhamento: **R$ 37** · R$ 67 · **R$ 97** · R$ 127 · R$ 147

R$ 97 vem pré-selecionado nos dois. Botão de no mínimo 44px.

Só no plano com acompanhamento, ao lado do primeiro botão:
> "Ao incluir a primeira sessão, o valor do programa começa 20% menor."

No plano com acompanhamento, logo abaixo, a escolha do valor da sessão: cinco atalhos de R$ 60 a R$ 200, mais "Outro valor" dentro da faixa.

**Resumo fixo, no rodapé da etapa:**
- Só o programa: "Pagamento único no Pix · 8 semanas de acesso · 14 dias para pedir o dinheiro de volta."
- Com acompanhamento, as três linhas separadas:
  > Programa: R$ {{valor}}
  > Primeira sessão: R$ {{sessao}}
  > **Total: R$ {{total}}, num Pix só**

**Link no rodapé:** "Nem o menor valor cabe agora? Pedir acesso gratuito"

### Etapa 3: Pix

Sem mudança: é a tela que já existe nos planos dos profissionais, com a descrição **"Margem"** no extrato, sem "família", "álcool", "apostas" nem "programa".

### Etapa 4: confirmação

> **Pagamento confirmado**
> O acesso às 8 semanas do programa já está liberado para você.
> O módulo 2 chega em {{data}}, e um módulo novo fica disponível a cada semana.
> Até {{data_limite}} você pode pedir o seu dinheiro de volta, num toque, sem precisar explicar o motivo.

**Botão:** "Ir para o meu programa", ou "Fazer o diagnóstico" quando a compra veio direto da LP, porque o programa precisa do diagnóstico para se montar.

No plano com acompanhamento, acrescentar: "A gente avisa quem você escolheu para a sua primeira sessão. Essa pessoa entra em contato com você pelo WhatsApp para combinar o horário."

Recibo por e-mail com assunto neutro: "Seu recibo Margem".

## 8. Analytics

Mantém os eventos do briefing 01, com duas correções:
- `oferta_vista` passa a ter as variações `lp`, `resultado`, `treino`, `bloqueado`. A variação `modulo1` sai.
- `valor_escolhido` passa a mandar também o plano, porque agora o mesmo valor pode vir dos dois.

## 9. Critério de aceite

- Em nenhuma tela sobra texto dizendo que o módulo 1 é grátis.
- Em nenhuma tela sobra "7 dias" nem a palavra "cancelar".
- O selo "20% de desconto" aparece só no plano com acompanhamento, e em nenhum lugar o desconto é dito como se fosse na sessão.
- O card com acompanhamento tem um selo só.
- Onde tem preço, tem os 14 dias, uma vez por tela.
- "Pedir acesso gratuito" aparece nas variações b, c, d e no checkout, e **não** aparece na LP.
- A lista do que está incluído não cita o resumo para o profissional.
- No resultado, o botão de treinar aparece para quem não comprou e funciona até o fim.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
