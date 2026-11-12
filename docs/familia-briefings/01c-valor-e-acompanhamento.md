# Briefing 01c: explicar o "você escolhe o valor" e abrir a escolha no plano com acompanhamento

Pré-requisito: briefings 01 e 01b. Mexe no bloco "Quanto custa" da LP, no checkout e em `lib/familia/oferta.ts`.

## 1. O bloco "Quanto custa" não explica nada hoje

Hoje está assim: "R$ 47 a R$ 147. Você escolhe o valor. Uma vez só, no Pix."

Três perguntas ficam sem resposta, e cada uma trava uma pessoa diferente:
- **Por que tem faixa?** Sem explicação, a pessoa supõe que R$ 147 traz mais coisa. Quem pode pagar pouco acha que vai receber menos.
- **Preciso justificar?** Sem dizer que não, escolher o menor valor vira constrangimento. Quem está pedindo ajuda por causa de alguém que ama não precisa de mais uma situação assim.
- **É mensalidade?** "Uma vez só" resolve pela metade. A palavra mensalidade precisa aparecer negada.

As três respostas não cabem no bloco: viram um parágrafo que ninguém lê. O bloco fica curto, e a explicação vai para um lightbox atrás de "Saiba mais".

**Texto novo do bloco, como fica na LP:**

> **Quanto custa**
> **R$ 47 a R$ 147**
> Você escolhe quanto pagar. Uma vez só, no Pix, com 14 dias para pedir o dinheiro de volta.
> [Saiba mais]

"Saiba mais" é um link em texto, na cor de destaque do bloco, logo abaixo da linha de apoio. Abre o lightbox e não leva para outra página.

**Conteúdo do lightbox:**

> **Como funciona o valor**
>
> O programa é o mesmo em qualquer valor que você escolher: os 8 módulos, as ferramentas e os treinos de conversa. Nada fica de fora se você pagar menos.
>
> Você escolhe dentro da faixa, sem precisar justificar.
>
> Quem pode pagar mais ajuda a manter o programa aberto para quem está sem nada agora.
>
> É um pagamento só, no Pix. Não tem mensalidade e ninguém vai cobrar você de novo depois.
>
> Se não for para você, peça o dinheiro de volta em até 14 dias. Num toque, sem precisar explicar por quê.
>
> [Botão: Fechar]

Fecha no botão, no X e tocando fora. Com o teclado, o Esc fecha e o foco volta para o "Saiba mais".

O pedido de acesso gratuito **não aparece na LP**, nem no bloco nem no lightbox. Ele continua só no rodapé do checkout, como está no briefing 01.

## 2. No plano com acompanhamento a pessoa também escolhe

Hoje o plano "com acompanhamento" trava o programa em R$ 47 (`VALOR_PROGRAMA_COM_ACOMPANHAMENTO`). A pessoa escolhe o valor da sessão, mas não o do programa. Isso é incoerente: a escolha do valor é a regra da casa, e some justo no plano mais caro.

**Novo comportamento:** no plano com acompanhamento, a pessoa escolhe o valor do programa na mesma régua de 5 botões, só que ela **começa 20% mais barata e vai até o valor cheio**:

| Plano | Botões do valor do programa |
|---|---|
| Só o programa | R$ 47 · R$ 67 · **R$ 97** · R$ 127 · R$ 147 |
| Com acompanhamento | **R$ 37** · R$ 67 · **R$ 97** · R$ 127 · R$ 147 |

O recomendado continua sendo R$ 97, no mesmo lugar e marcado do mesmo jeito nos dois planos.

O que muda é só a entrada: quem leva a sessão junto encontra uma porta 20% mais barata para o programa, e quem quiser pagar o valor cheio continua podendo.

**Texto ao lado do primeiro botão, só no plano com acompanhamento:**
> "Levando a primeira sessão junto, o programa começa 20% mais barato."

O valor da sessão continua como está: cinco atalhos de R$ 60 a R$ 200, mais "Outro valor" dentro da faixa.

O total mostrado continua sendo a soma, com as duas linhas separadas:
> Programa: R$ 37
> Primeira sessão: R$ 95
> **Total: R$ 132, num Pix só**

## 3. Código

**`lib/familia/oferta.ts`**
- Trocar `VALOR_PROGRAMA_COM_ACOMPANHAMENTO = 47` por uma lista:
  ```ts
  // Com acompanhamento, a régua começa 20% mais barata (R$ 37 no lugar de R$ 47) e vai até o
  // valor cheio. O recomendado continua R$ 97 nos dois planos.
  export const VALORES_PROGRAMA_COM_ACOMPANHAMENTO = [37, 67, 97, 127, 147] as const;
  ```
- `validarCompra`, no ramo `acompanhamento`: hoje ignora o valor do programa e fixa 47. Passa a conferir o valor recebido contra `VALORES_PROGRAMA_COM_ACOMPANHAMENTO`, do mesmo jeito que o ramo `programa` faz com `VALORES_PROGRAMA`. Sem isso, a tela escolhe e o servidor cobra outra coisa.
- `montarCompra` passa a receber o valor do programa também no plano com acompanhamento.

**Checkout:** a régua de valores do programa aparece nos dois planos. Ao trocar de plano, se o valor escolhido não existir na régua do outro plano (R$ 47 e R$ 37 são os únicos casos), cair no recomendado, R$ 97, em vez de deixar sem seleção.

## 4. Critério de aceite

- O bloco "Quanto custa" tem no máximo uma linha de apoio, e o resto da explicação está no lightbox do "Saiba mais".
- O lightbox fecha no botão, no X, tocando fora e no Esc, e devolve o foco para o "Saiba mais".
- O acesso gratuito não aparece na LP, e continua no rodapé do checkout.
- No plano com acompanhamento dá para escolher o valor do programa, começando em R$ 37.
- R$ 97 aparece como recomendado nos dois planos, marcado igual.
- O servidor recusa um valor de programa que não esteja na régua do plano enviado.
- O total mostra programa e sessão em linhas separadas, com um Pix só.
- Trocar de plano nunca deixa o checkout sem valor selecionado.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
