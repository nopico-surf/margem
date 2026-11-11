---
numero: 1
titulo: "O que está acontecendo (e o que não é culpa sua)"
publicado: true
cenario_simulador: "primeira-conversa"
bloqueado_em_modo_seguranca: false
audio: ""
video: ""
minutos: 6
---

<!-- [REVISÃO CLÍNICA] Conteúdo v2 de 10/11/2026 (rascunho do Gemini, revisão do Claude).

O título e o "Tempo de leitura" saem do frontmatter (cabeçalho do módulo).
Blocos ":::se problema=..." aparecem pra cada problema marcado na Q3.
Itens ":::exercicio" viram cards com botão (components/familia/ExercicioSemana.tsx).
Os três cards do exercício abrem uma ferramenta (briefing M1, 10/11/2026): escala e meta, diário e "Como foi a conversa":
- conversa (modo segurança): "Fazer meu plano de segurança"; por enquanto leva à página de segurança.
Rodapé "Próximo módulo chega em DD/MM": espera a liberação semanal (Fase 2). -->

## Se você chegou até aqui

Provavelmente já tentou muita coisa. Conversar com calma, brigar, esconder dinheiro, ameaçar ir embora, fingir que não viu.

E o cansaço já pesa. Este programa não vai te pedir para se esforçar mais. Vai te mostrar um jeito diferente.

## Por que é tão difícil parar

:::se problema=alcool
O álcool mexe com o sistema de recompensa do cérebro. Com o tempo, beber vira uma resposta quase automática ao cansaço, ao estresse ou ao fim do dia, mesmo quando {{apelido}} percebe o estrago.
:::

:::se problema=outras_drogas
As drogas mexem com o sistema de recompensa do cérebro. Com o tempo, a vontade de usar começa a falar mais alto do que a vontade de parar, mesmo quando {{apelido}} percebe o estrago.
:::

:::se problema=apostas
As apostas mexem com o sistema de recompensa do cérebro, a cada ganho e também a cada perda. Com o tempo, a ideia de que a próxima aposta vai resolver tudo vira um ciclo difícil de quebrar, mesmo quando {{apelido}} percebe o estrago.
:::

Isso não é falta de caráter nem falta de amor por você. Também não tira a responsabilidade de {{apelido}}. Mas explica por que só força de vontade quase nunca dá conta.

## O que não é culpa sua

Você não causou isso. E não consegue controlar o que outra pessoa faz.

Mas você tem mais influência do que imagina. O jeito como a família reage muda o ambiente em volta de {{apelido}}, e isso pode deixar a mudança mais atraente.

## Os caminhos possíveis

Não existe um único jeito certo. Para algumas pessoas, o caminho é parar de vez. Para outras, é diminuir ou usar com menos risco.

Quem escolhe é a própria pessoa, de preferência com um profissional. O seu papel não é escolher por {{apelido}}. É deixar o caminho da mudança mais fácil do que o caminho do uso.

## O que costuma piorar as coisas

- Sermão e cobrança o tempo todo.
- Ameaças que não se cumprem.
- Rótulos e xingamentos.
- Conversar durante o uso ou logo depois.
- Resolver tudo pela pessoa: pagar dívidas, dar desculpas no trabalho, arrumar a bagunça.

Ninguém faz isso por mal. Quase todo mundo faz, porque é o que parece certo na hora. Nas próximas semanas, você vai aprender outros caminhos.

## Você também importa

Quem convive com isso costuma viver com ansiedade, tristeza e cansaço. Cuidar de você não é egoísmo: é parte do plano.

A sua vida tem valor por si só, qualquer que seja a decisão de {{apelido}}. E, de quebra, com mais fôlego fica mais fácil ajudar.

## O que vem pela frente

:::se seguranca=nao
Em 8 semanas, um passo por vez:

1. Entender o padrão.
2. Conversar sem brigar.
3. Valorizar o que é bom.
4. Preparar o convite para ajuda.
5. Deixar as consequências acontecerem e resolver problemas.
6. Cuidar da sua vida e da sua rede.
7. Saber o que fazer depois da resposta.
:::

:::se seguranca=sim
Em 8 semanas, um passo por vez:

1. Entender o padrão.
2. Cuidar da sua vida e da sua rede.

Algumas partes ficam guardadas até você conversar com um profissional, para tudo acontecer com segurança.
:::

## Exercício da semana

:::exercicio id=escala acao=escala
**Como está a sua vida**

Dê uma nota de 1 a 10 para 8 áreas da sua vida, como sono, amizades e dinheiro. Depois, crie uma meta pequena para a área que mais precisa de cuidado nesta semana.
:::

:::exercicio id=observe acao=diario
**Anotar os momentos difíceis**

Quando acontecer um momento difícil com {{apelido}}, em vez de discutir na hora, anote aqui o que aconteceu. Leva 1 minuto, e no módulo 2 essas anotações mostram o padrão.
:::

:::exercicio id=conversa acao=treinar_roteiro,contar_conversa seguranca=nao
**A primeira conversa (opcional)**

Se surgir um momento calmo com {{apelido}}, use o roteiro que você recebeu no diagnóstico. Antes, se quiser, treine aqui. Depois, conte como foi.
:::

:::exercicio id=conversa acao=plano_seguranca seguranca=sim
**Seu plano de segurança**

Antes de qualquer conversa difícil, monte um plano para os momentos de risco.
:::
