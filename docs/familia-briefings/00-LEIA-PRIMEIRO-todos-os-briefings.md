# Briefing 00: padrões de todas as telas do programa Família

Aplique antes dos briefings dos módulos. Vale para resultado, painel, módulos, ferramentas, check-in e checkout. Não mexe na LP.

## 1. Hierarquia de títulos
Hoje os títulos das telas e dos cards têm o mesmo peso do texto. Use os tokens tipográficos do design system da Margem; se não houver, use esta escala:

| Nível | Uso | Tamanho / peso |
|---|---|---|
| Título da tela | 1 por tela (ex.: "Sua meta para esta semana") | 24px, semibold, cor de texto principal |
| Subtítulo de seção | blocos dentro da tela (ex.: "Exercício da semana") | 20px, semibold |
| Título de card | o nome do item (ex.: "andar de skate") | 18px, semibold |
| Rótulo acima do título | contexto curto (ex.: "Sua meta · Vida emocional") | 14px, medium, cor secundária |
| Corpo | textos e instruções | 16px, regular |
| Apoio | dicas, datas | 14px, regular, cor secundária |

No card da meta, por exemplo: rótulo "Sua meta · Vida emocional" (14px, secundária) e, logo abaixo, o texto da meta como título do card (18px, semibold).

## 2. Nenhuma frase depende do contexto
Toda frase precisa fazer sentido lida sozinha. Diga sempre **de quê** e **de quem**.
- Errado: "veja os dias e horários mais comuns, o que mais vem antes e os momentos bons."
- Certo: "Veja em que dias e horários os momentos difíceis com {{apelido}} mais aconteceram, o que costuma acontecer logo antes deles e quais momentos bons vocês tiveram."
Revise todos os textos de exercício, botões, estados vazios e confirmações com essa regra.

## 3. Toda tarefa abre uma ferramenta
Nenhum item de exercício pode ter só "Marcar como feito". Cada item tem um botão principal que abre a ferramenta onde a pessoa faz a tarefa, e a tarefa fica concluída quando ela termina a ferramenta.
- Tarefa que acontece na vida real (usar uma frase, ter uma conversa): o botão abre **"Contar como foi"**, um registro curto (o que fez, como foi). Concluir é salvar esse registro.
- Tarefa de ler um resumo: concluída quando a pessoa abre o resumo.

## 4. Status de concluído: um padrão só
Use em todo o programa o mesmo componente: ícone de check em círculo verde + **"Concluído em DD/MM"** (o modelo é o que já aparece como "Concluído em 10/11"). Remova "Feito em", "Feito ✓ em", "Feito" e variações.
- Item ainda não feito: "Ainda não", em cinza neutro. Nunca vermelho, nunca "atrasado".
- Dias da meta: o próprio dia ganha o check; abaixo, "2 de 3 dias concluídos".

## 5. Concluído não é fim: sempre dá para ver, editar ou refazer
Card concluído mostra o status e, embaixo, ações secundárias (links ou botões secundários):

| Tipo de tarefa | Ações depois de concluída |
|---|---|
| Ferramenta com dados (escala, lista, plano, frase, convite, devolver, 8 passos, cuidado com o dinheiro, rede) | "Ver e editar" · e "Fazer de novo" quando fizer sentido (escala, 8 passos, reescrever frase) |
| Tarefa da vida real ("Contar como foi") | "Ver o que você contou" · "Contar de novo" |
| Treino de conversa | "Ver o retorno do treino" · "Treinar de novo" |
| Resumo | "Ver o resumo de novo" |

Editar não apaga a data de conclusão; refazer cria um novo registro e mantém o anterior no histórico.

## 6. Marcar os dias da meta
- A pessoa marca tocando no próprio dia, no card da meta. Tocar de novo desmarca.
- Pode marcar **hoje e qualquer dia que já passou nesta semana** (esqueceu de marcar ontem, por exemplo). Dia futuro fica desabilitado; ao tocar: "Esse dia ainda não chegou."
- Pode marcar um dia que não estava planejado (fez a mais): o dia ganha o check, e o texto conta: "3 de 3 dias concluídos, 1 a mais".
- Não precisa integrar com calendário.

## 7. Botões do treino de conversa: dizer o que vai ser treinado
"Ensaiar no treino" não diz nada. Todo botão que abre o simulador diz **o que** a pessoa vai treinar:

| Cenário | Botão |
|---|---|
| `primeira-conversa` | "Treinar a primeira conversa" |
| a partir do roteiro do resultado | "Treinar o meu roteiro" |
| `nega-o-problema` | "Treinar quando {{apelido}} nega o problema" |
| uma frase salva | "Treinar esta frase" |
| `elogiar-sem-ironia` | "Treinar um elogio" |
| `convite-para-ajuda` | "Treinar o convite" |
| `pedido-de-dinheiro` | "Treinar como dizer não a um pedido de dinheiro" |
| `pedido-de-desculpa-pro-trabalho` | "Treinar como dizer não a uma desculpa" |

Na tela do simulador, o título segue o mesmo padrão: "Treino: a primeira conversa".

## 8. Conferência antes de entregar cada tela
- Tem título com a hierarquia do item 1?
- Toda frase faz sentido sozinha?
- Todo item de exercício abre uma ferramenta?
- O concluído é o padrão do item 4, com as ações do item 5?
- Botão diz o que acontece ao tocar?
- Sem gênero, sem travessão, sem palavras proibidas.

---

# Briefing 00b: textos do item 2 (texto pronto, é só aplicar)

Complementa o item 2 do briefing 00. O levantamento foi feito no código atual (259 textos visíveis do programa Família). O Gemini revisou cada um pela regra da clareza e o Claude revisou o resultado.
- Troque **só** os textos desta tabela. Todos os outros textos levantados ficam como estão: diagnóstico, contatos de emergência, telas de login, consentimentos, exemplos de meta e o texto corrido dos módulos e do resultado.
- A coluna "onde" traz arquivo e linha do código de 10/11, para achar o texto. Se a linha mudou, procure pelo texto atual.
- Os textos novos dos cards de exercício de cada módulo **não** estão aqui: eles vêm nos briefings M1 a M8.

## 1. Painel do programa (`app/familia/programa/PainelCliente.tsx`)
| ID | Onde | Texto atual | Texto novo |
|---|---|---|---|
| T017 | :16 | Anotar | Anotar no diário |
| T018 | :16 | Minhas frases | Minhas frases prontas |
| T022 | :77 e :129 | Marcar que fiz hoje | (remover o botão; no lugar, texto de apoio abaixo dos dias) Toque no dia para marcar que você cumpriu a meta. |
| T030 | :153 | Fazer minha escala | Dar notas para a minha vida |
| T031 | :153 | Refazer minha escala | Dar notas de novo para a minha vida |
| T033 | :174 | Ainda não | Em andamento |

## 2. Escala e meta (`app/familia/programa/escala/EscalaCliente.tsx` e `lib/familia/escala.ts`)
| ID | Onde | Texto atual | Texto novo |
|---|---|---|---|
| T039 | EscalaCliente:46 | Escolher minha meta | Escolher minha meta da semana |
| T040 | EscalaCliente:47 | Editar minha meta | Editar minha meta da semana |
| T041 | EscalaCliente:66 | antes → agora | módulo 1 → agora |
| T043 | EscalaCliente:182 | Começar | Começar a dar as notas |
| T050 | EscalaCliente:318 | Trocar de área | Escolher outra área |
| T058 | EscalaCliente:408 | Ajustar minha meta | Ajustar minha meta da semana |
| T059 | EscalaCliente:411 | Manter assim | Manter a meta assim |
| T208 | escala.ts:50 | Em quais dias | Em quais dias da semana |
| T217 | escala.ts:62 | Meta salva. Ela fica no seu painel, e a cada dia que você cumprir é só tocar em 'Marcar que fiz hoje'. | Meta salva. Ela fica no seu painel. A cada dia que você cumprir, toque no dia para marcar. |
| T027 | PainelCliente:140 | Editar minha meta | Editar minha meta da semana |

Também na escala (briefing M1, item 3.2 e 3.3): a explicação "Por que 'caminhar 15 minutos na terça e na quinta' funciona, e 'me cuidar mais' não?" e a conferência de 3 itens antes de salvar. O texto completo está no M1.

## 3. Página do módulo (`app/familia/programa/modulo/[n]/ModuloCliente.tsx`)
| ID | Onde | Texto atual | Texto novo |
|---|---|---|---|
| T064 | :179 | Prefere ouvir? | Prefere ouvir este módulo? |
| T065 | :179 | Prefere ouvir? ${minutos} min | Ouvir este módulo (${minutos} min) |

## 4. Treino de conversa (`app/familia/programa/simulador/[cenario]/SimuladorCliente.tsx`)
| ID | Onde | Texto atual | Texto novo |
|---|---|---|---|
| T073 | :32 | Tentar novamente | Tentar carregar o treino de novo |
| T074 | :33 | Desculpe, houve um erro ao carregar suas informações | Não foi possível carregar o treino agora. |
| T084 | :271 | Voltar para o módulo 1 | Voltar para o módulo {{n}} (hoje está fixo em "1": usar o módulo de onde a pessoa veio; se não houver, "Voltar ao painel") |

Título da tela do treino: "Treino: {{nome do cenário}}" (tabela de cenários do briefing 00, item 7).

## 5. Resultado do diagnóstico (`app/familia/resultado/ResultadoVisao.tsx`)
| ID | Onde | Texto atual | Texto novo |
|---|---|---|---|
| T099 | :57 | Quando conversar | Quando conversar com {{apelido}} |
| T100 | :59 | Para começar | Para começar a conversa |
| T101 | :61 | Frases úteis | Frases úteis para a conversa |
| T102 | :69 | Copiar o roteiro | Copiar o roteiro da conversa |
| T104 | :71 | Evite | O que evitar na conversa |
| T105 | :77 | Se a pessoa reagir mal | Se {{apelido}} reagir mal |

Sem apelido, `{{apelido}}` segue a regra de fallback do item 1 ("quem você ama", com a preposição certa).

## 6. Cards de exercício (`components/familia/ExercicioSemana.tsx`, mapa `ROTULO_ACAO`)
Estes são os rótulos padrão por tipo de ação. Quando o briefing do módulo define um botão próprio para o item, vale o do módulo.
| ID | Ação | Texto atual | Texto novo |
|---|---|---|---|
| T139 | marcar | Marcar como feito | Marcar como concluído (só para itens sem ferramenta; a meta é que nenhum item fique assim, ver briefings M1 a M8) |
| T140 | (status) | Feito ✓ em DD/MM | Concluído em DD/MM (com o ícone de check em círculo verde, o mesmo do painel) |
| T141 | diario | Fazer uma anotação | Anotar um momento difícil |
| T142 | momento_bom | Anotar um momento bom | Anotar um momento bom com {{apelido}} |
| T143 | roteiro | Ver meu roteiro | Ver o meu roteiro da conversa |
| T144 | simulador | Ensaiar no treino | Rótulo por cenário (briefing 00, item 7). Sem cenário conhecido: "Treinar a conversa" |
| T149 | escala | Fazer minha escala | Dar notas e criar minha meta |
| T150 | refazer_escala | Refazer minha escala | Dar notas de novo e comparar |
| T151 | escolher_meta | Escolher minha meta | Criar minha meta |
| T152 | (título) | Observar sem reagir | Anotar os momentos difíceis |
| T168 | `lib/familia/conteudo.ts:50` (comentário) | Ensaiar no treino | Atualizar o comentário para o novo rótulo |

## 7. Diário (`lib/familia/diario.ts`)
| ID | Onde | Texto atual | Texto novo |
|---|---|---|---|
| T170 | :17 | O que aconteceu antes | O que aconteceu logo antes |
| T171 | :18 | O que você percebeu | O que você percebeu em {{apelido}} |
| T172 | :19 | Como você reagiu | Como você reagiu nesse momento |
| T173 | :20 | Como foi depois | Como ficaram as coisas depois |
| T174 | :25 | Observe sem reagir | Anotar os momentos difíceis |

As perguntas completas de cada tela do diário estão no briefing M2.

## 8. Dias da meta (leitor de tela) (`components/familia/DiasDaMeta.tsx`)
| ID | Onde | Texto atual | Texto novo |
|---|---|---|---|
| — | :18 | feito | concluído |
| T134 | :18 | não feito | não concluído |
| — | (novo) | — | Ao tocar num dia futuro: "Esse dia ainda não chegou." |
| — | (novo) | — | Abaixo dos dias: "{{feitos}} de {{planejados}} dias concluídos" (e ", 1 a mais" quando houver dia extra) |

## 9. Contatos de emergência (`components/familia/ContatosEmergencia.tsx`)
| ID | Onde | Texto atual | Texto novo |
|---|---|---|---|
| T131 | :57 | Perto de mim | Ver unidades perto de mim |

## 10. Diagnóstico e tela de e-mail
| ID | Onde | Texto atual | Texto novo |
|---|---|---|---|
| T005 | `DiagnosticoCliente.tsx:130` | Apelido (opcional) | Apelido da pessoa (opcional) |
| T013 | `EntrarCliente.tsx:85` | Tentar salvar de novo | Tentar salvar as respostas de novo |

## Conferência
- Rode a busca por "Feito", "Ensaiar", "Marcar que fiz hoje" em `app/familia`, `components/familia`, `lib/familia` e `content/familia`: não pode sobrar nenhum na tela.
- Nenhum texto desta tabela tem travessão, gênero ou palavra proibida.

---

# Briefing 00d: chips e texto livre, uma regra por tipo de resposta

Pré-requisito: briefing 00. Vale para todas as ferramentas do programa. Não mexe no diagnóstico, que é outro fluxo, com perguntas fechadas.

Hoje convivem três comportamentos diferentes para a mesma coisa, e cada um apareceu por conta própria. Os três estão certos, mas falta a regra que diz qual usar. A regra não é de gosto: ela depende do que a resposta vira depois.

## 1. Os três padrões

**Padrão 1, chips fechados.** O conjunto é fechado de verdade e não há o que escrever. Dias da semana, períodos do dia, sim e não, notas de 1 a 10, "como foi para você", "como {{apelido}} reagiu".
Sem campo de texto e sem "Outro".

**Padrão 2, chips de sugestão com campo sempre visível.** A resposta é uma frase da própria pessoa, que ela vai ler de novo ou falar em voz alta. O chip é um atalho para quem travou: tocar nele preenche o campo, e a pessoa edita.
- O campo aparece desde o começo, antes de tocar em qualquer chip.
- O que vale é sempre o conteúdo do campo. O chip não salva nada sozinho.
- **O chip nunca fica marcado.** Em padrão 2 ele é sugestão, não escolha, e marcar faz a pessoa achar que o chip é a resposta. Todos ficam em `secondary`, sempre.
- Acima dos chips, um rótulo de apoio (14px, cor secundária): "Sugestões. Toque para preencher, e depois mude as palavras do seu jeito."
- Não existe "Outro" aqui, porque tudo é outro.

**Padrão 3, chips de categoria com "Outro".** A resposta é uma categoria que o sistema conta ou usa para decidir alguma coisa. O "Outro" é o último chip e abre um campo curto.
- "Outro" nunca é o primeiro chip.
- "Não sei" existe onde é uma resposta honesta.
- O que a pessoa escreve no "Outro" é guardado à parte, nunca no lugar da categoria (item 3).

## 2. Onde cada padrão vale

| Ferramenta e pergunta | Hoje | Padrão | Muda |
|---|---|---|---|
| Diário: o que veio antes, o que pareceu buscar, como você reagiu | 3 | **3** | só o jeito de guardar |
| Diário: campo de texto livre | campo solto | nenhum | não muda |
| Escala: nota de cada área | 1 | **1** | não |
| Escala: a meta da semana | exemplos + campo | **2** | tirar a marcação do chip |
| Escala: dias da meta | 1 | **1** | não |
| Adiar: a pergunta de segurança do clima | 1 | **1** | não |
| Adiar: escolher a situação | chips com "Outro" | **2** | **sim**, vira campo com sugestões |
| Adiar: o que dizer na hora e no dia seguinte | 2 | **2** | tirar a marcação do chip |
| Do que {{apelido}} gosta: os 2 itens | 2 | **2** | corrigir a sobrescrita |
| Valorizar: as formas de valorizar | 2 | **2** | corrigir a sobrescrita e a marcação |
| Valorizar: dias e momentos | 1 | **1** | não |
| Minhas frases: escolher a frase de antes | 3 | **3** | guardar separado |
| Minhas frases: escrever a nova | 2 | **2** | conferir |
| Contar como foi: qual frase você usou | 3 | **3** | guardar separado |
| Contar como foi: como foi para você, como {{apelido}} reagiu | 1 | **1** | não |
| Convite (M5), 8 passos e dinheiro (M6) | a construir | **2** | |
| Check-in semanal e PHQ-4 (M8b) | a construir | **1** | |

A mudança da ferramenta de adiar corrige uma decisão minha: o briefing do M4 pedia chips com "Outro" para escolher a situação, e pela regra isso é padrão 2. A situação escolhida é um combinado que a pessoa vai ler depois, não uma categoria que alguém conta.

## 3. O "Outro" passa a guardar categoria e texto, separados

Hoje, quando a pessoa escolhe "Outro" e escreve, o texto é guardado **no lugar** da categoria (`DiarioCliente`, linha 159). É isso que quebra o resumo da semana: cada texto diferente vira uma categoria diferente, e uma frase escrita uma vez só pode virar "o mais comum".

Mudança: a categoria continua sendo "Outro", e o texto vai para um campo ao lado, um por pergunta: `antes_outro`, `buscou_outro`, `reagiu_outro`.

Vale fazer agora, não depois. Mudar o formato do dado com gente usando significa migrar anotação de verdade, e anotação de diário não é algo que se possa perder.

**Leitura de linhas antigas:** no carregamento, se um valor não estiver na lista de opções daquela pergunta, ler como "Outro" mais o texto. Nada de script de migração.

**O que isso muda no briefing M2b:**
- O item 1 continua igual, e fica mais correto: três anotações com três textos diferentes agora contam como três "Outro", e "Outro" nunca vira pista, porque o filtro `util` já o descarta.
- O item 4, o cartão com o que a pessoa escreveu, passa a ler os campos `*_outro` direto, em vez de adivinhar quais valores não estão na lista.
- O item 5, a coluna `usou_outro_escrito`, fica trivial: é verdadeiro quando algum `*_outro` tem texto.

**Em "Contar como foi" já está quase certo:** o `ConversaCliente` guarda `frase` e `fraseOutra` separados no estado, e só junta os dois na hora de salvar, na linha 99. Aplicar a mesma separação ali.

## 4. Duas correções de comportamento

**a) O chip não pode apagar o que a pessoa escreveu.**
Em "do que {{apelido}} gosta" e em "valorizar" são 2 campos. Com os dois preenchidos, tocar num chip sobrescreve o segundo, sem aviso (`usarIdeia`, linha 71). A pessoa escreve "andar de skate com ele", toca num chip para ver as opções e perde o que escreveu.

Novo comportamento: o chip só preenche campo vazio. Com todos cheios, ele não faz nada e aparece uma linha de apoio abaixo dos chips: "Os dois campos já estão preenchidos. Apague um para usar esta sugestão."

**b) Depois de preencher, levar a pessoa até o campo.**
Esse é o ponto fraco do padrão 2: a pessoa toca num chip e o texto aparece em outro lugar da tela, às vezes fora da vista. Ao preencher, mover o foco para o campo, com o cursor no fim do texto, e trazer o campo para a área visível. Assim ela vê onde caiu e já pode mudar as palavras.

## 5. Critério de aceite

- Nenhuma tela tem chip marcado e campo de texto ao mesmo tempo para a mesma resposta.
- Em padrão 2, o campo aparece antes de a pessoa tocar em qualquer chip, e os chips nunca ficam em `primary`.
- Em padrão 2 não existe chip "Outro".
- Tocar num chip com todos os campos preenchidos não apaga nada e mostra a linha de apoio.
- Depois de tocar num chip, o foco fica no campo preenchido, no fim do texto.
- No diário, escolher "Outro" e escrever guarda "Outro" na categoria e o texto em `antes_outro`, `buscou_outro` ou `reagiu_outro`.
- Anotação antiga, gravada antes da mudança, abre e aparece no resumo sem erro.
- O resumo da semana nunca mostra uma frase escrita pela pessoa como se fosse a categoria mais comum.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.

---

# Briefing 01: banner de oferta e pagamento

Este briefing é só sobre pagamento. Ele estava na parte 1 (seção O1) e não foi implementado. Faça agora, completo.

## O que é
Um **banner de oferta** (componente `OfertaPrograma`) que explica como funciona o pagamento e leva ao checkout. No checkout, a pessoa escolhe o valor por botões e paga no Pix, **reaproveitando a tela de Pix que já existe nos planos dos profissionais**.

## Visual do banner
- Card com fundo verde-claro da Margem (o mesmo dos cards de destaque), cantos arredondados do design system, largura total da coluna.
- Hierarquia (briefing 00): título 20px semibold · texto 16px · preço em destaque 18px semibold · botão principal verde · link secundário · linha de apoio 14px em cinza.
- No celular: tudo empilhado. Os dois planos viram dois blocos, um embaixo do outro.
- Nunca em modal, pop-up ou barra fixa. No máximo um banner por tela. Some depois da compra. Nunca acima de conteúdo de segurança.
- Ícone: usar um ícone da Margem (não usar cifrão, cartão ou carrinho).

### Onde o banner aparece (4 variações do mesmo componente)

**a) LP, antes da FAQ** (seção nova, no padrão visual de cards da LP; não altera as outras seções)
- Título: **Quanto custa**
- Texto: "O diagnóstico e o módulo 1 são grátis. Para seguir com as 8 semanas, você escolhe quanto pagar, de R$ 47 a R$ 147, uma vez só, no Pix."
- O que inclui (lista curta): 8 módulos, um por semana, também em áudio · diário e escala da sua vida · treino de conversa com IA · plano de segurança · resumo para levar a um profissional.
- Dois mini-cards lado a lado (empilham no celular):
  - **Programa** · "de R$ 47 a R$ 147, você escolhe"
  - **Programa com acompanhamento** · selo "Recomendado" · "R$ 47 + a primeira sessão com um profissional parceiro, no valor social que você escolher"
- Botão principal: **"Começar pelo diagnóstico grátis"** (o caminho natural continua sendo o diagnóstico).
- Link secundário: "Já quero garantir meu acesso" → login → checkout → depois do pagamento, o diagnóstico (o programa precisa dele para se montar).
- Linha pequena: "Nem o valor mínimo cabe agora? Pedir acesso gratuito" · "Você tem 7 dias para desistir e receber o valor de volta."

**b) Resultado do diagnóstico** (posição: depois dos avisos, antes do bloco de emergência, como no item 23.2)
- Título: **Seu programa já está montado**
- Texto: "As próximas 7 semanas foram pensadas para a sua situação com {{apelido}}. Você pode começar o módulo 1 agora, de graça, e decidir depois."
- Lista com os títulos dos módulos 2 a 8 (cadeado discreto, cinza, sem vermelho).
- Botão: **"Escolher meu valor e continuar"** · link "Pedir acesso gratuito".
- Em `safety_mode`: o mini-card **com acompanhamento** vem primeiro e aberto, com o texto "Na sua situação, ter um profissional junto faz ainda mais diferença." O card fica **depois** do card de segurança e do plano de segurança, nunca antes.

**c) Módulo 1** (no fim, depois do exercício e antes de "Concluir o módulo 1")
- Título: **O módulo 2 chega em {{data_modulo_2}}**
- Texto: "Na próxima semana, você vai entender o padrão: quando o uso acontece, o que vem antes e o que vem depois. Para seguir, escolha quanto pagar."
- Botão: **"Escolher meu valor e continuar"** · link "Pedir acesso gratuito".
- Se o módulo 1 ainda não foi concluído, o card aparece igual; a compra não pula a liberação semanal.

**d) Módulo bloqueado** (abrir `/familia/programa/modulo/N` sem compra, ou tocar num módulo com cadeado no painel)
- Título do módulo + "O que você vai aprender" (2 itens, do texto do módulo) + o card com o mesmo texto da variação (b).
- Nunca mostrar a página vazia ou um erro.

### Checkout (`/familia/checkout`)
Uma etapa por tela, no padrão do diagnóstico.

**Etapa 1: escolher o plano**
- Dois cards selecionáveis:
  - **Programa** · o que inclui · "Você escolhe quanto pagar, de R$ 47 a R$ 147."
  - **Programa com acompanhamento** · selo "Recomendado. Nos estudos, os melhores resultados aparecem quando o familiar tem apoio de um profissional." · "Programa por R$ 47 + a primeira sessão com um profissional parceiro."
- Pré-selecionado: **Programa** (exceto em `safety_mode`, em que vem pré-selecionado o com acompanhamento).

**Etapa 2a: escolher o valor (plano Programa)**
- Texto: "Escolha quanto pagar. Quem pode pagar mais ajuda a manter o programa acessível para quem pode pagar menos. O conteúdo é o mesmo em qualquer valor."
- Botões: R$ 47 · R$ 67 · **R$ 97 (sugerido, pré-selecionado)** · R$ 127 · R$ 147. Mínimo 44px.
- Resumo fixo abaixo: "Pagamento único no Pix · 8 semanas de acesso · 7 dias para desistir com reembolso."
- Link: "Nem o valor mínimo cabe agora? Pedir acesso gratuito".

**Etapa 2b: escolher o profissional (plano com acompanhamento)**
- Lista de profissionais parceiros que atendem familiares, filtrada por horário em até 7 dias, no mesmo componente de agendamento que já existe.
- A pessoa escolhe o profissional, o horário e o valor da sessão na faixa social do profissional (como já funciona nas sessões).
- Total somado antes de pagar: "Programa R$ 47 + sessão R$ {{valor_sessao}} = R$ {{total}}".
- Se o fluxo de agendamento com pagamento ainda não estiver integrado: seguir o item 22.2 (paga o programa e vai direto à agenda).

**Etapa 3: Pix (reaproveitar a tela existente)**
- Procure no repositório a tela de pagamento Pix usada nos planos dos profissionais e reaproveite o mesmo componente: QR code, "Copiar código Pix", tempo de expiração e verificação automática do pagamento.
- Troque só os textos: título "Pague com Pix", "Abra o app do seu banco, escolha pagar com Pix e escaneie o código ou cole o código copiado."
- **Discrição no extrato:** o nome e a descrição do Pix aparecem no extrato do banco e podem ser vistos por outras pessoas da casa. Use só **"Margem"** como descrição, sem "família", "álcool", "apostas" ou "programa para familiares".
- Se o Pix expirar: "O código expirou. Gerar um novo" (mantém plano e valor).

**Etapa 4: confirmação**
- "Pagamento confirmado. As 8 semanas estão liberadas para você."
- "O módulo 2 chega em {{data}}. A cada semana, um novo módulo." (a liberação semanal continua valendo).
- Botão: "Voltar ao painel" (ou "Fazer o diagnóstico", se a compra veio direto da LP).
- E-mail de recibo com assunto neutro: "Seu recibo Margem". Sem o nome do programa no assunto.

### Pedir acesso gratuito
- Tela curta: "Ninguém precisa ficar de fora por causa de dinheiro. Conte em uma frase, se quiser, o que está acontecendo. A gente responde em até {{prazo}}." · campo opcional · botão "Pedir acesso gratuito".
- Não pedir comprovante de renda.
- [PENDÊNCIA DO FUNDADOR: quem libera e em quanto tempo]

### Reembolso
- Em "Configurações", link "Desistir e pedir reembolso" (até 7 dias depois da compra): uma tela de confirmação, sem pedir motivo obrigatório (campo opcional "Se quiser, conte o que não funcionou").

### Analytics
`oferta_vista` (variação: lp | resultado | modulo1 | bloqueado), `oferta_clicada`, `checkout_iniciado`, `plano_escolhido`, `valor_escolhido`, `pix_gerado`, `compra_concluida`, `acesso_gratuito_pedido`, `reembolso_pedido`.

### Critério de aceite
- O card nunca aparece em modal, nunca fixo e nunca acima de conteúdo de segurança.
- R$ 97 vem pré-selecionado; dá para escolher outro valor com um toque.
- A tela de Pix é a mesma dos planos de profissionais, com a descrição "Margem".
- "Pedir acesso gratuito" aparece em todas as variações e no checkout.

---

# Briefing 01b: a oferta muda, sem módulo 1 grátis e 14 dias para pedir o dinheiro de volta

Pré-requisito: briefings 00 e 01. Substitui as partes do 01 que falam em módulo 1 grátis e em 7 dias.

## 1. O que muda

- **O módulo 1 deixa de ser grátis.** Tudo que vem depois do resultado é pago.
- **O prazo para desistir passa de 7 para 14 dias**, contados da liberação do acesso.
- **Em lugar nenhum se escreve "cancelar".** O pagamento é Pix, à vista. Não existe assinatura para cancelar: o dinheiro já saiu da conta da pessoa, e o que ela pede é a devolução.

**Continua grátis, para qualquer pessoa, com ou sem compra:** o diagnóstico, o resultado inteiro com o roteiro e as frases, a página de segurança, o plano de segurança, os telefones de emergência e **um treino de conversa**.

## 2. O treino grátis existe no servidor e não tem porta

Hoje a rota do simulador já libera um treino para quem não comprou: `route.ts`, linha 119, recusa só cenário que não é `gratis`, e a linha 121 deixa passar até o limite de `SIMULADOR_GRATIS`. O cenário `primeira-conversa` está marcado `gratis: true`.

Só que a tela do simulador mora em `/familia/programa/simulador/...`, dentro da área do painel, e o único caminho até lá é o módulo 1. O resultado leva para "Começar o módulo 1 (grátis)". Ou seja: o treino grátis está escrito no código e ninguém consegue chegar nele.

Com o módulo 1 virando pago, isso deixa de ser um detalhe: **o treino passa a ser a única coisa que mostra o que o programa faz.** Ler a descrição de um programa não convence ninguém. Conversar com o personagem e receber o retorno, sim.

**Criar a porta, na tela de resultado:**
- Abaixo do roteiro, botão secundário: **"Treinar o meu roteiro"** (briefing 00, item 7).
- Linha de apoio acima dele: "Dá para treinar esta conversa antes, de graça, sem compromisso."
- A tela do simulador precisa abrir para quem não comprou. Hoje a proteção é a rota do painel, então mover a verificação: a página do simulador aceita quem não comprou, e quem decide é a rota da API, que já sabe fazer isso.
- Quando o treino grátis acabar, aparece a mensagem `limite_gratis` que já existe, e logo abaixo o banner de oferta (briefing 01, variação b).

## 3. Os 14 dias, onde aparecem e com que texto

Nunca com contador regressivo. Contador é pressão, e pressão com alguém nesse estado é o contrário do que a Margem é.

| Onde | Texto |
|---|---|
| LP, logo abaixo do preço | "Você tem 14 dias para pedir o dinheiro de volta. Num toque, sem precisar explicar por quê." |
| Banner de oferta | "14 dias para pedir o dinheiro de volta." |
| Ao lado do botão de pagar, no checkout | "Se não for para você, peça o dinheiro de volta em até 14 dias. Num toque, sem precisar explicar por quê." |
| Confirmação depois do Pix | "Seu acesso está liberado. Até {{data}} você pode pedir o dinheiro de volta, num toque, sem precisar explicar por quê." |
| Painel, enquanto o prazo corre | Linha de apoio no rodapé: "Você tem até {{data}} para pedir o dinheiro de volta." |
| FAQ | A resposta atual sobre os 7 dias passa a falar em 14 e deixa de usar "cancelar". |

`{{data}}` é a data do fim do prazo, escrita por extenso curto, como "25 de novembro".

**O que o texto não pode dizer:** que os primeiros 7 dias são cortesia. Os 7 primeiros são o artigo 49 do Código de Defesa do Consumidor, que vale para qualquer compra pela internet. Os 14 são o dobro da lei, e é isso que vale destacar, sem comparar com o mínimo legal na tela.

## 4. O pedido de devolução

Uma tela, curta, em "Configurações do programa", visível só enquanto o prazo corre:
- Título: **Pedir o dinheiro de volta**
- Texto: "Você tem até {{data}}. Não precisa explicar o motivo. Se quiser contar o que não funcionou, ajuda a melhorar o programa, mas é opcional."
- Campo opcional de texto, até 500 caracteres.
- Botão: **"Pedir o dinheiro de volta"**
- Confirmação: "Pedido recebido. O valor volta pelo mesmo Pix em até {{prazo}}." Sem o prazo definido, a frase termina em "O valor volta pelo mesmo Pix."

Guardar em `familia_pedidos_devolucao`, no mesmo formato de `familia_pedidos_gratuidade`: `user_id`, `texto` opcional, data. O texto nunca vai para log nem para o Mixpanel. A devolução no Asaas é feita à mão pelo fundador.

Depois do pedido, o acesso continua até a devolução ser feita. Nada é bloqueado na hora.

## 5. Mudanças no código

**`lib/familia/oferta.ts`**
- `DIAS_PARA_DESISTIR = 14`.
- Acrescentar, no padrão que o arquivo já usa para pendências:
  ```ts
  // [PENDÊNCIA DO FUNDADOR] Em quanto tempo a devolução cai, ex.: "2 dias úteis". Nulo: a frase
  // "O valor volta pelo mesmo Pix em até..." aparece sem o prazo.
  export const PRAZO_DEVOLUCAO: string | null = null;
  ```
- `PRAZO_GRATUIDADE` e o pedido de acesso gratuito **continuam**. O pedido fica no rodapé do checkout, pequeno. Ele não custa nada enquanto ninguém pede, porque é manual, e é o que impede o programa de ter uma porta só.

**`app/familia/resultado/ResultadoVisao.tsx`**
- Sai "Começar o módulo 1 (grátis)".
- Entra o botão principal da oferta (briefing 01, variação b) e, abaixo do roteiro, o "Treinar o meu roteiro" do item 2.

**Liberação dos módulos:** o módulo 1 passa a exigir compra, como os outros. O `dataDoModulo` não muda: o módulo 1 abre na compra, e o 2 chega 7 dias depois do 1 concluído.

**`podeDesistir`** já lê a constante, então passa a valer 14 sozinho.

## 6. O que não pode ficar atrás do muro

Ao tirar a camada gratuita é fácil murar sem querer. Precisam continuar abertos, sem login e sem compra: o diagnóstico, o resultado, a página de segurança, o plano de segurança e os telefones de emergência. Se alguma dessas telas pedir compra depois da mudança, é erro.

## 7. Critério de aceite

- Quem não comprou abre o resultado inteiro e consegue fazer um treino de conversa, até o fim, com retorno.
- No segundo treino aparece a mensagem de limite e o banner de oferta.
- Nenhuma tela diz "cancelar" nem "assinatura".
- O texto dos 14 dias aparece nos cinco lugares da tabela, e em nenhum deles tem contador regressivo.
- A tela de pedir o dinheiro de volta só aparece dentro do prazo, e some depois.
- Pedir a devolução não bloqueia o acesso na hora.
- O pedido de acesso gratuito continua existindo no rodapé do checkout.
- Diagnóstico, resultado, segurança, plano de segurança e telefones abrem sem compra.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.

---

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

---

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

---

# Briefing M1: módulo 1 (correções sobre o que já está no código)

Pré-requisito: briefing 00 (padrões). Este briefing corrige a escala, a meta e os cards do exercício do módulo 1.
Textos: Gemini escreveu, Claude revisou.

## 1. Cards do exercício (substituem os atuais)
Cada card: título (18px semibold), instrução (16px), botão principal. Concluído e ações depois: padrão do briefing 00.

**Card 1: Como está a sua vida**
Instrução: "Dê uma nota de 1 a 10 para 8 áreas da sua vida, como sono, amizades e dinheiro. Depois, crie uma meta pequena para a área que mais precisa de cuidado nesta semana."
Botão: **"Dar notas e criar minha meta"**
Depois de concluído: "Ver e editar minha meta" · "Fazer a escala de novo"

**Card 2: Anotar os momentos difíceis**
Instrução: "Quando acontecer um momento difícil com {{apelido}}, em vez de discutir na hora, anote aqui o que aconteceu. Leva 1 minuto, e no módulo 2 essas anotações mostram o padrão."
Botão: **"Anotar um momento difícil"** (abre o diário já no "momento difícil")
Abaixo do botão: contador "{{n}} anotações nesta semana" (0 não aparece).
Concluído: com 1 anotação ou mais. Depois: "Anotar outro momento" · "Ver minhas anotações"

**Card 3: A primeira conversa (opcional)**
Instrução: "Se surgir um momento calmo com {{apelido}}, use o roteiro que você recebeu no diagnóstico. Antes, se quiser, treine aqui. Depois, conte como foi."
Botões: **"Treinar o meu roteiro"** (secundário) · **"Contar como foi a conversa"** (principal)
Concluído: ao salvar "Contar como foi". Depois: "Ver o que você contou" · "Contar de novo"
`safety_mode`: este card é trocado por "Seu plano de segurança" (texto do conteúdo v2) com o botão "Fazer meu plano de segurança".

## 2. "Contar como foi a conversa" (ferramenta nova, usada nos módulos 1, 3 e 5)
Uma tela, rolagem curta:
- Título: **Como foi a conversa com {{apelido}}**
- "Qual frase você usou?" · chips com as frases salvas (roteiro do diagnóstico e "Minhas frases") + "Outra" (campo curto) + "Não lembro"
- "Como foi para você?" (escolha única):
  - Consegui falar com calma
  - Fiquei com o coração acelerado, mas falei o principal
  - Esquentou, e eu encerrei a conversa
  - Travei e preferi deixar para outro dia
- "Como {{apelido}} reagiu?" (escolha única): Ouviu sem interromper · Mostrou abertura ou concordou · Negou que tem um problema · Mudou de assunto ou levou na brincadeira · Se irritou
- Botão: **"Salvar"**
- Retorno depois de salvar, conforme "Como foi para você?":
  - Consegui falar com calma → "Que bom. Falar com calma já muda o clima da conversa, qualquer que tenha sido a resposta."
  - Falei o principal → "Ficar com o coração acelerado numa conversa assim é normal. Você falou o principal, e isso conta."
  - Esquentou, e eu encerrei → "Encerrar quando esquenta é uma escolha certa: protege você e deixa a porta aberta para outra conversa."
  - Travei → "Travar acontece. Fica para outro dia, e um treino antes pode ajudar." [Botão: "Treinar o meu roteiro"]
- Se "Se irritou" + qualquer medo relatado antes, mostrar o link do plano de segurança.

## 3. Escala e meta: correções
**3.1 Hierarquia**: título de cada tela da escala e da meta com o nível "Título da tela" (24px). Nome da área em cada tela de nota como título; a dica, como corpo.

**3.2 Por que uma meta concreta funciona** (substitui o primeiro item da orientação da meta). Mostrar antes dos exemplos:
> **Por que "caminhar 15 minutos na terça e na quinta" funciona, e "me cuidar mais" não?**
> Porque no fim da semana você consegue responder com um sim ou um não: fiz ou não fiz. A meta já diz o que fazer e quando, então você não precisa decidir de novo todo dia. E cada vez que você cumpre, conta como uma conquista.
> "Me cuidar mais" não tem fim: sempre dá para achar que foi pouco, e isso cansa.

**3.3 Conferir a meta antes de salvar** (3 itens marcáveis, não obrigatórios, logo acima de "Salvar minha meta"):
- No fim da semana, dá para responder se você fez ou não?
- Cabe na sua semana de verdade, mesmo num dia puxado?
- Depende só de você, e não de {{apelido}}?
Se algum ficar desmarcado: "Quer ajustar? Uma meta menor e mais clara costuma funcionar melhor." (não impede salvar)

**3.4 Marcar os dias** (regra do briefing 00, item 6): tocar no próprio dia marca e desmarca; hoje e dias passados da semana podem ser marcados; dia futuro mostra "Esse dia ainda não chegou."; dia extra também conta. Abaixo dos dias: "{{feitos}} de {{planejados}} dias concluídos". Remover o texto "Feito em 10/11" do card; a data aparece ao tocar num dia marcado ("Concluído em 10/11").

**3.5 Card da meta no painel**: rótulo "Sua meta · {{area}}" (14px, secundária) e o texto da meta como título do card (18px semibold). Ações: "Editar minha meta" (link). No check-in de fim de semana, segue o fluxo já especificado.

## 4. Critério de aceite
- Os 3 cards abrem uma ferramenta; nenhum tem só "Marcar como feito".
- A explicação da meta concreta aparece antes dos exemplos.
- Dá para marcar ontem e hoje; amanhã não.
- Todo concluído do módulo usa "✓ Concluído em DD/MM".

---

# Briefing M2: módulo 2 + diário + resumo da semana (ferramenta ainda não implementada)

Pré-requisito: briefing 00 (padrões). Hoje os itens do módulo 2 só têm "Marcar como feito" e as anotações não existem. Este briefing traz a ferramenta completa. Textos: Gemini escreveu, Claude revisou.

## 1. Cards do exercício do módulo 2 (substituem os atuais)
**Card 1: Anotar os momentos difíceis**
Instrução: "Durante 7 dias, anote aqui cada momento difícil com {{apelido}}: quando foi, o que veio antes e como você reagiu. Leva 1 minuto por anotação."
Botão: **"Anotar um momento difícil"** · contador "{{n}} anotações nesta semana"
Concluído: com 3 anotações ou mais (antes disso: "{{n}} de 3 anotações"). Depois: "Anotar outro momento" · "Ver minhas anotações"

**Card 2: Anotar os momentos bons**
Instrução: "Anote também quando houver um momento bom com {{apelido}}, como um almoço tranquilo ou uma conversa leve. Esses momentos são tão importantes quanto os difíceis."
Botão: **"Anotar um momento bom"**
Concluído: com 1 anotação ou mais. Depois: "Anotar outro momento bom" · "Ver minhas anotações"

**Card 3: Ver o resumo da semana**
Instrução: "Veja em que dias e horários os momentos difíceis com {{apelido}} mais aconteceram, o que costuma acontecer logo antes deles e quais momentos bons vocês tiveram."
Botão: **"Ver o resumo da minha semana"**
Com menos de 3 anotações, o botão continua ativo e o resumo mostra o estado de "poucas anotações". Concluído: ao abrir o resumo com 3 anotações ou mais. Depois: "Ver o resumo de novo".

## 2. Ferramenta: diário e resumo

**Onde aparece:** módulo 1 (exercício 2, "Observar sem reagir"), módulo 2 (diário de 7 dias), botão fixo "Anotar" no painel durante todo o programa. O resumo aparece no fim do módulo 2 e no painel a partir da 2ª semana.
**Por que existe:** entender o padrão (o que vem antes, o que a pessoa parece buscar, o que vem depois e como a família reage) é a base do método. É dali que saem as janelas para conversar (módulo 5), o que valorizar (módulo 4) e o que deixar de amortecer (módulo 6).
**Regra de ouro:** anotar tem que levar **até 1 minuto**. Tudo é tocável, nenhum campo é obrigatório, o campo livre é opcional.

### Primeira vez: abertura
[DIARIO_INTRO] "Anotar ajuda a enxergar o padrão: quando acontece, o que vem antes e o que vem depois. Leva 1 minuto. Não é para vigiar {{apelido}}, é para você entender o que dá para mudar."
Botão: "Fazer minha primeira anotação". (Mostrar só na primeira vez; depois, ir direto para a escolha.)

### Tela 1: o que anotar
[DIARIO_TIPO_PERGUNTA] "O que você quer anotar sobre {{apelido}}?"
Dois cards grandes, lado a lado: **"Um momento difícil"** · **"Um momento bom"**
Abaixo, em texto pequeno: "Os momentos bons valem tanto quanto os difíceis."

### Momento difícil: telas 2 a 7 (uma por tela, com "Pular" em todas)
Chips de múltipla escolha, mínimo 44px de altura, quebrando linha. "Outro" abre um campo curto.

**2. Quando** [DIARIO_QUANDO] "Quando foi esse momento?" · data e hora atuais preenchidas, com atalhos "Agora" · "Hoje mais cedo" · "Ontem à noite" · "Escolher dia e hora".

**3. O que veio antes** [DIARIO_ANTES] "O que aconteceu logo antes desse momento difícil?"
Gerais: Estresse ou cansaço · Discussão ou clima pesado em casa · Notícia ruim ou preocupação · Tédio ou tempo livre · Encontro, festa ou comemoração · Dinheiro recebido · Dia ou horário em que costuma acontecer · Não sei · Outro
Extras por problema (só para quem marcou):
- Álcool: Fim do expediente · Fim de semana ou véspera de feriado · Jogo de futebol ou encontro com quem bebe
- Outras drogas: Muito tempo no quarto, longe de todo mundo · Mensagem ou ligação de alguém específico · Saída à noite com certas companhias
- Apostas: Celular na mão sem nada para fazer · Vontade de recuperar uma perda · Notificação ou propaganda de aposta

**4. O que você percebeu** [DIARIO_PERCEBEU] "O que você percebeu em {{apelido}}?" · ajuda abaixo: "Só o que você viu. Não precisa confirmar nada."
Fala ou tom de voz diferente · Humor mudou de repente · Irritação ou agitação · Muito silêncio ou isolamento · Sono ou cansaço fora do normal · Desequilíbrio ou desatenção · Celular o tempo todo · Cheiro de bebida (só álcool) · Outro

**5. O que parece ter buscado** [DIARIO_BUSCOU] "O que você acha que {{apelido}} buscou com isso?" · ajuda: "É um palpite seu. Ajuda a pensar no que poderia trazer isso de outro jeito."
Relaxar · Se divertir · Se enturmar · Fugir de um problema · Sentir emoção · Conseguir dormir · Não sei

**6. Como você reagiu** [DIARIO_REAGIU] "E você, como reagiu nesse momento?" · ajuda: "Sem julgamento. Toda reação faz sentido na hora."
Briguei ou discuti · Tentei convencer a parar · Fiquei em silêncio · Fingi que não vi · Resolvi por {{apelido}} · Conversei com calma · Saí de perto para me proteger · Outro

**7. Como foi depois** [DIARIO_DEPOIS] "Como ficaram as coisas em casa depois?"
Clima pesado em casa · {{apelido}} foi dormir ou se fechou · Pediu desculpas ou mostrou arrependimento · Ninguém tocou no assunto · Conversamos com calma depois · Eu fiquei com raiva, medo ou sem energia · Outro

**8. Campo livre (opcional)** [DIARIO_LIVRE] "Quer acrescentar algo?" · dica: "Uma frase basta. Só você vê."
Botão: **"Salvar anotação"**

[DIARIO_SALVO] "Anotado. Cada anotação ajuda a ver quando os momentos difíceis com {{apelido}} costumam acontecer."

**Regra de segurança:** se a pessoa marcar "Saí de perto para me proteger", mostrar logo depois de salvar: "Você contou que precisou sair de perto para se proteger. A sua segurança vem primeiro." [Botão: "Ver meu plano de segurança"] [Botão secundário: "Ver psicólogo parceiro"]. Se isso acontecer 2 vezes em 14 dias, ligar `caution_mode` (mesma regra das ameaças no check-in, item 14.6).

**Regra de "momento bom" (janela):** se a pessoa marcar "Pediu desculpas ou mostrou arrependimento" e o módulo 3 já estiver concluído, mostrar o card de janela (`CARD_JANELA`) e liberar o módulo 5 antecipado.

### Momento bom: telas 2 a 4
**2. Quando** (igual ao difícil)
**3. O que aconteceu** [DIARIO_BOM_O_QUE] "O que aconteceu de bom com {{apelido}}?"
Conversamos sobre algo leve · Comemos juntos sem pressa · Saímos de casa juntos · Vimos algo juntos · Rimos juntos · {{apelido}} ajudou em casa · {{apelido}} cumpriu um combinado · Um momento de paz, sem nada demais · Outro
**4. Como você se sentiu** [DIARIO_BOM_COMO_SENTIU] "Como você se sentiu nesse momento?" Alívio · Esperança · Alegria · Calma · Saudade de dias assim
Botão: **"Salvar momento bom"**
[DIARIO_BOM_SALVO] "Guardado. No módulo 4, você vai aprender a valorizar momentos assim."

### Resumo da semana (fim do módulo 2 e painel)
- [RESUMO_TITULO] **O que a sua semana mostrou**
- [RESUMO_INTRO] "Este resumo junta as anotações que você fez nos últimos 7 dias sobre os momentos com {{apelido}}. Não é diagnóstico: é um retrato da sua semana."
- **Com menos de 3 anotações** [RESUMO_POUCAS]: "Você fez menos de 3 anotações nesta semana, e tudo bem. Com mais algumas, dá para ver quando os momentos difíceis com {{apelido}} costumam acontecer." [Botão: "Fazer uma anotação"]
- **Com 3 ou mais:** cards curtos, um por pista (só mostrar a pista se houver dado):
  - [RESUMO_QUANDO] "Os momentos difíceis com {{apelido}} aconteceram mais {{dia_mais_comum}}, {{periodo_mais_comum}}." (ex.: "nas sextas, à noite")
  - [RESUMO_ANTES] "O que mais aconteceu logo antes desses momentos difíceis: {{antes_mais_comum}}."
  - [RESUMO_BUSCOU] "Pelas suas anotações, o que {{apelido}} mais pareceu buscar com o uso foi: {{buscou_mais_comum}}. No módulo 4, você vai pensar em outras formas de trazer isso."
  - [RESUMO_REACAO] "Nesses momentos, a sua reação mais comum foi: {{reacao_mais_comum}}. {{frase_modulo}}" com o mapa:
    - Briguei / Tentei convencer → "No módulo 3, você aprende a conversar sem que vire briga."
    - Resolvi por {{apelido}} → "No módulo 6, você vê o que dá para devolver para a pessoa."
    - Fiquei em silêncio / Fingi que não vi → "No módulo 4, você vê como agir na hora sem brigar e sem fingir."
    - Conversei com calma → "Isso é exatamente o que o programa trabalha. Continue."
    - Saí de perto para me proteger → "Sair de perto foi uma escolha segura. Veja o seu plano de segurança." [link]
  - [RESUMO_BONS] três versões: **1:** "Você anotou 1 momento bom com {{apelido}} nesta semana." **2+:** "Você anotou {{n_bons}} momentos bons com {{apelido}} nesta semana." **0:** "Você ainda não anotou nenhum momento bom com {{apelido}}. Eles costumam passar despercebidos: vale prestar atenção nesta semana."
  - [RESUMO_PISTA] "Essas pistas mostram em que dias e horários é melhor se preparar, e em quais momentos uma conversa com {{apelido}} tem mais chance de ir bem."
- Botão: "Ver todas as minhas anotações" (lista cronológica; cada anotação com "Editar" e "Apagar").

### Dados
`diario_entrada`: id, usuario_id, tipo (dificil|bom), quando, antes[], percebeu[], buscou[], reagiu[], depois[], bom_o_que[], bom_sentiu[], texto_livre, criado_em.
Agregação semanal simples (contagem), sem IA. Texto livre nunca entra no "Resumo para o profissional" sem marcação explícita do familiar.

### Critério de aceite
- Anotar um momento difícil só com toques leva menos de 1 minuto.
- Qualquer campo pode ser pulado.
- "Saí de perto para me proteger" sempre mostra o card de segurança.
- O resumo nunca mostra pista sem dado e nunca usa "(s)".

---

# Briefing M2b: o resumo da semana não pode inventar padrão

Pré-requisito: briefing 00. Corrige `lib/familia/diario.ts` (`resumirSemana`, `maisComum`) e `app/familia/programa/diario/resumo/ResumoCliente.tsx`. Nenhuma IA entra nesta tela: o resumo continua sendo contagem feita no navegador.

## Os três problemas

1. **Padrão de uma vez só.** `maisComum` devolve o valor mais frequente mesmo quando ele apareceu uma única vez. Com 3 anotações, a tela afirma "o que mais aconteceu logo antes" com base em uma ocorrência.
2. **Empate escondido.** No empate, o laço do `maisComum` fica com o primeiro valor que encontrou e não avisa. Duas coisas igualmente comuns viram uma só, escolhida por ordem de inserção.
3. **Tela que fala de pistas que não existem.** Com 3 anotações ou mais, `poucas` é falso e a frase final aparece sempre: "Essas pistas mostram em que dias e horários...". Se a pessoa marcou "Outro" sem escrever, ou "Não sei", todas as pistas ficam nulas e essa frase fica sozinha. Se as 3 anotações forem de momento bom, nem o dia e o horário saem, porque eles vêm só das anotações difíceis. A pessoa abre "O que a sua semana mostrou" e encontra uma tela que promete pistas e não tem nenhuma.

## 1. Uma regra só para toda pista

Trocar `maisComum` por uma função que devolve o valor com a contagem, e aplicar a mesma regra a **dia, período, o que veio antes, o que a pessoa pareceu buscar e a reação**:

- A pista existe apenas quando o valor mais frequente apareceu em **2 anotações ou mais**. Com 1, a pista não existe e o cartão não aparece.
- Se até **2 valores** empatarem no topo, os dois aparecem na frase.
- Se **3 ou mais** empatarem, a pista não existe: está espalhado demais para ser padrão.

Sugestão de assinatura: `pistaMaisComum(valores: string[], minimo = 2): { valores: string[]; total: number } | null`. O filtro `util`, que tira "Não sei" e "Outro" sem texto, continua como está.

Dia e período continuam contados em separado. Um pode qualificar e o outro não.

## 2. Frases por caso (texto pronto)

**Quando aconteceram** (`DIA_NO_RESUMO` já traz a preposição: "nas sextas", "aos sábados"):
- Dia e período: "Os momentos difíceis com {{apelido}} aconteceram mais {dia}, {periodo}."
- Dias empatados: "Os momentos difíceis com {{apelido}} aconteceram mais {dia1} e {dia2}, {periodo}."
- Só o dia: "Os momentos difíceis com {{apelido}} aconteceram mais {dia}."
- Só o período: "Os momentos difíceis com {{apelido}} aconteceram mais {periodo}, em dias variados."
- Nenhum dos dois: sem cartão.

**O que veio antes**
- Um valor: mantém a frase atual.
- Dois empatados: "Logo antes dos momentos difíceis, duas coisas apareceram o mesmo número de vezes: {a} e {b}."

**O que a pessoa pareceu buscar**
- Um valor: mantém a frase atual.
- Dois empatados: "Pelas suas anotações, {{apelido}} pareceu buscar duas coisas com o uso, nas mesmas vezes: {a} e {b}. No módulo 4, você vai pensar em outras formas de trazer isso."

**A sua reação mais comum**
- Um valor: mantém a frase atual, com a frase de apoio do `FRASE_DA_REACAO`.
- Dois empatados: "Nesses momentos, as suas reações mais comuns foram: {a} e {b}."
- A frase de apoio, no empate, é a da reação que tem `seguranca: true`. Se nenhuma das duas tiver, não mostra frase de apoio.
- O botão do plano de segurança aparece se **qualquer uma** das reações empatadas tiver `seguranca: true`. A segurança erra para o lado de mostrar.

## 3. Quando não sobrou nenhuma pista

Com 3 anotações ou mais e nenhuma pista, a frase final sai e entra este cartão, antes do botão de ver as anotações:

> "Nesta semana nada se repetiu nas suas anotações: cada momento foi diferente do outro. Isso também diz algo, e quer dizer que ainda não dá para apontar um padrão. Com mais uma ou duas semanas de anotações, ele costuma aparecer."

O cartão dos momentos bons continua aparecendo, porque ele conta e não interpreta.

A frase final também muda de forma:
- Com a pista de dia ou período: mantém a frase atual.
- Com pistas, mas sem dia nem período: "Essas pistas ajudam a ver o que costuma vir antes dos momentos difíceis com {{apelido}}."
- Sem nenhuma pista: a frase não aparece.

Abrir o resumo com 3 anotações ou mais continua concluindo o item "Ver o resumo da semana" do módulo 2, mesmo sem pista nenhuma. A pessoa fez a tarefa.

## 4. O que a pessoa escreveu no "Outro"

O texto digitado no "Outro" é guardado no lugar da palavra "Outro" (`DiarioCliente`, linha 159). Ele entra na contagem, e por isso hoje pode virar "o mais comum" com uma ocorrência. Com a regra do item 1 isso para de acontecer, mas o que ela escreveu não pode simplesmente desaparecer da tela.

Cartão novo, depois das pistas, só quando houver pelo menos uma frase escrita:
- Título: **O que você escreveu com as suas palavras**
- Texto: "Nesta semana você escreveu isto nos campos de 'Outro'. Não entra na contagem acima porque cada coisa apareceu de um jeito diferente."
- Até 3 frases, da mais recente para a mais antiga, exatamente como a pessoa escreveu, sem nada no lugar de maiúscula ou ponto.

Como reconhecer o que foi escrito: é qualquer valor de `antes`, `buscou` ou `reagiu` que não está na lista de opções daquela pergunta e não é "Outro" nem "Não sei". O campo `texto_livre` fica fora deste cartão: ele aparece em "Ver todas as minhas anotações".

## 5. As duas contagens que vão decidir o resto

A pergunta aberta é se vale usar IA para agrupar sinônimos do texto livre ("chegou alterado" e "chegou gritando da rua" são a mesma coisa). Isso só se paga se as pessoas usarem muito o texto livre, e hoje ninguém sabe. Então, por enquanto, só medir:

- Acrescentar à linha da anotação, em `familia_diario`, a coluna booleana `usou_outro_escrito`.
- Preencher no servidor, em `POST /api/familia/diario`, comparando os valores recebidos com as listas de opções de cada pergunta: verdadeiro quando pelo menos um valor foi escrito pela pessoa.
- Nada de conteúdo novo é guardado: a anotação já é gravada hoje. É um booleano sobre uma linha que já existe.

Com isso, duas ou três semanas de uso real respondem a pergunta com número, e não com palpite.

## 6. Critério de aceite

- Uma anotação só, com qualquer campo preenchido: nenhuma pista aparece. A tela mostra o estado do item 3.
- Três anotações de momento bom e nenhuma difícil: o cartão dos momentos bons aparece, o do item 3 aparece, e a frase final não aparece.
- Três anotações difíceis com tudo em "Outro" sem escrever: nenhuma pista, cartão do item 3, e o item do módulo 2 fica concluído.
- Três anotações difíceis com "Outro" escrito diferente em cada uma: nenhuma pista inventada, e as frases dela aparecem no cartão do item 4.
- Duas anotações na sexta à noite e uma na segunda de manhã: a pista de quando aparece, com sexta e à noite.
- Empate entre uma reação com `seguranca: true` e outra sem: as duas na frase, a frase de apoio da que tem segurança, e o botão do plano de segurança visível.
- Nenhuma frase da tela fala de pista quando não existe pista.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.

---

# Briefing M3: módulo 3, conversar sem brigar

Pré-requisito: briefing 00 (padrões: hierarquia, clareza, ferramenta para toda tarefa, "Concluído em DD/MM", ver/editar/refazer, botões de treino). Se a parte 2 já foi colada, este briefing substitui o que ela diz sobre este módulo. Textos: Gemini escreveu, Claude revisou.

## 1. Cards do exercício (substituem os atuais)
**Card 1: Reescrever frases que viram briga**
Instrução: "Escolha 3 frases que costumam virar briga em casa e troque cada uma por uma versão nova, mais calma."
Botão: **"Reescrever minhas frases"** · progresso "{{n}} de 3 frases"
Concluído: com 3 frases. Depois: "Ver minhas frases" · "Reescrever outra frase"

**Card 2: Treinar quando {{apelido}} nega o problema**
Instrução: "Pratique aqui o que dizer quando {{apelido}} diz que não tem problema nenhum. É um treino com um personagem, antes da conversa de verdade."
Botão: **"Treinar quando {{apelido}} nega o problema"**
Concluído: ao terminar um treino. Depois: "Ver o retorno do treino" · "Treinar de novo"

**Card 3: Usar uma frase nova na vida real**
Instrução: "Escolha um momento calmo e use uma das suas frases novas numa conversa com {{apelido}}. Depois, conte aqui como foi."
Botão: **"Contar como foi a conversa"** (abre "Contar como foi", briefing M1, item 2)
Concluído: ao salvar. Depois: "Ver o que você contou" · "Contar de novo"
`caution_mode`: acrescentar "Se o clima estiver tenso, deixe para outro dia. Não existe hora certa com medo."

## 2. Ferramentas
## C3. Reescrever minhas frases

**Onde aparece:** módulo 3, exercício 1. As frases salvas ficam em "Minhas frases" no painel, com os botões "Copiar" e "Treinar esta frase".
**Por que existe:** saber as 7 habilidades não basta. O que muda a conversa é ter, pronta, a sua frase nova para as situações que se repetem na sua casa.
**Sem IA:** a conferência é feita pela própria pessoa, com uma lista simples. A IA só entra se a pessoa tocar em "Treinar esta frase".

### Tela 1: abertura
[REESCREVER_INTRO] "Toda casa tem aquelas frases que, quando saem, já viram briga. Aqui você troca 3 delas por versões novas. Não precisa ficar perfeito: precisa soar como você."
Contador: "0 de 3 frases".

### Tela 2: escolher a frase de antes
[REESCREVER_ESCOLHA] "Qual destas frases costuma aparecer aí?" · lista tocável das 10 frases abaixo (só a "antes") + opção **"Escrever a minha"** (campo curto).
Ajuda abaixo da lista: "Não precisa ser igual. Escolha a mais parecida, ou escreva a sua."

### Tela 3: ver um exemplo e escrever a sua
- No topo, a frase de antes (riscada de leve, cinza).
- Card "Um jeito novo de dizer" com a versão de exemplo e as habilidades que ela usa em chips (ex.: `breve` `fato concreto` `sentimento`). Tocar num chip mostra 1 linha explicando a habilidade.
- Se a pessoa escreveu a própria frase de antes (sem exemplo pronto), mostrar no lugar: "Pense: o que aconteceu de concreto? O que você sentiu? O que você queria que acontecesse?"
- Campo [REESCREVER_CAMPO]: rótulo "A sua frase nova" · dica "Com as suas palavras. Uma frase que você conseguiria falar sem perder o fôlego." · botão "Usar o exemplo como base" (copia o exemplo para o campo, editável).

### Tela 4: conferir
[REESCREVER_CONFERIR_TITULO] "Antes de salvar, confira" · 6 itens marcáveis (não obrigatórios):
1. Dá para falar numa respiração só?
2. Fala de um momento concreto, sem "você sempre" ou "você nunca"?
3. Diz o que você sente ("eu fico com medo", "eu fico triste")?
4. Diz o que você gostaria que acontecesse, e não só o que te incomoda?
5. Ficou sem "mas" depois de uma parte boa? O "mas" apaga o que veio antes ("eu te amo, mas..." soa como bronca).
6. Tem uma oferta de ajuda ou um pedaço que é seu ("acho que eu falei num tom duro")?
Abaixo: "Três itens marcados já fazem uma frase muito melhor."
Se marcar menos de 3: "Quer ajustar mais um pouco?" [Botão: "Ajustar a frase"] [Link: "Salvar assim mesmo"]
Botão principal: **"Salvar minha frase"**

[REESCREVER_SALVA] "Frase salva. Que tal falar em voz alta uma vez no treino, para ver como ela soa?" [Botão: "Treinar esta frase"] (abre o simulador com o cenário do módulo e a frase pronta para usar) [Botão secundário: "Reescrever a próxima"]
[REESCREVER_TODAS] (3 frases) "Pronto: você tem 3 frases novas para as situações que mais se repetem aí. Elas ficam em 'Minhas frases', no painel." + marca o exercício como feito.

### As 10 frases (antes → exemplo novo)
| ID | Frase de antes | Exemplo novo | Habilidades |
|---|---|---|---|
| F1 | "Você nunca ajuda em nada nesta casa." | "A casa tá pesando pra mim esta semana. Você pode lavar a louça hoje?" | sentimento · pedido · breve |
| F2 | "Nossa, resolveu aparecer? Milagre!" | "Que bom que você veio jantar. Eu gosto muito quando a gente come junto." | breve · valorizar · sentimento |
| F3 | "Você não tem responsabilidade nenhuma." | "Ontem você perdeu o compromisso das 9h, e isso me deu medo. Se quiser, eu te lembro na próxima." | fato · sentimento · ajuda |
| F4 | "Tá escondendo alguma coisa de novo, né?" | "Quando você chega tarde sem avisar, eu fico com medo. Me manda uma mensagem quando atrasar?" | fato · sentimento · pedido |
| F5 | "Você gastou tudo de novo! Vai acabar com a família!" | "Vi que a conta ficou no negativo e fiquei com medo. Vamos sentar no domingo para olhar as contas juntos?" | fato · sentimento · ajuda |
| F6 | "Se continuar assim, eu vou embora." | "Eu tô no meu limite com essas brigas. Queria muito ter dias mais tranquilos com você." | sentimento · pedido · breve |
| F7 | "Olha todo mundo da sua idade trabalhando, e você aí." | "Eu sei que tá difícil achar o seu caminho. Se quiser, eu te ajudo a procurar alguma coisa." | compreensão · ajuda · breve |
| F8 | "Você estragou o fim de semana de novo." | "Eu fiquei triste de não sair no sábado. Queria muito passear com você no próximo." | sentimento · pedido · breve |
| F9 | "Onde você tava? Com quem? Quanto gastou?" | "Eu me preocupei ontem à noite. E acho que exagerei mandando tanta mensagem." | sentimento · parte · breve |
| F10 | "Eu não aguento mais ver você se destruindo." | "Eu te amo e fico com medo de te ver assim. Tô aqui se você quiser conversar." | sentimento · ajuda · breve |

### Dados
`frase_reescrita`: id, usuario_id, frase_antes_id (F1..F10 | null), frase_antes_texto, frase_nova, conferencia [1..6 marcados], criada_em.

---

# Briefing M4: módulo 4, valorizar o que é bom

Pré-requisito: briefing 00 (padrões: hierarquia, clareza, ferramenta para toda tarefa, "Concluído em DD/MM", ver/editar/refazer, botões de treino). Se a parte 2 já foi colada, este briefing substitui o que ela diz sobre este módulo. Textos: Gemini escreveu, Claude revisou.

## 1. Cards do exercício (substituem os atuais)
**Card 1: Do que {{apelido}} gosta**
Instrução: "Liste 2 coisas que {{apelido}} gosta de fazer sem usar. Elas vão servir para oferecer algo bom nos dias e horários mais difíceis."
Botão: **"Fazer a lista do que {{apelido}} gosta"**
Concluído: com 1 item ou mais. Depois: "Ver e editar a lista"

**Card 2: Planejar como valorizar os momentos bons**
Instrução: "Escolha 2 jeitos de mostrar a {{apelido}} que você percebeu um momento bom, sem uso, nesta semana."
Botões: **"Planejar como valorizar"** (principal) · "Treinar um elogio" (secundário)
Concluído: ao salvar o plano. Depois: "Ver e editar o plano"

**Card 3: Quando o combinado fica para outro dia**
Instrução: "Decida o que você vai dizer se um programa combinado com {{apelido}} precisar ficar para outro dia por causa do uso. Com calma, sem bronca."
Botão: **"Escolher o que dizer"**
Concluído: ao salvar. Depois: "Ver e editar"
`caution_mode` e `safety_mode`: o card 3 não aparece; no lugar: "Esta parte fica para quando você tiver conversado com um profissional." [Botão: "Ver psicólogo parceiro"]

## 2. Ferramentas
## C4. O que {{apelido}} gosta de fazer + Planejar como valorizar

**Onde aparece:** módulo 4, exercícios 1 e 2. O plano fica no painel ("Esta semana") e volta no check-in.
**Por que existe:** as pessoas tendem a repetir o que traz algo bom. O método pede que a família torne os momentos sem uso mais gostosos e ofereça outras formas de conseguir o que o uso parece trazer, de preferência nos dias e horários de risco que o diário mostrou.

### Ferramenta A: o que {{apelido}} gosta de fazer
**Tela 1**
- Título: **Do que {{apelido}} gosta**
- [GOSTA_INTRO] "Pense em 2 coisas que {{apelido}} gosta de fazer sem usar. Ter isso à mão ajuda a oferecer algo bom justamente nos dias mais difíceis."
- Se o diário tiver dados: card "Pelo seu diário, {{apelido}} parece buscar **{{buscou_mais_comum}}**, e os momentos difíceis aparecem mais **{{dia_mais_comum}}, {{periodo_mais_comum}}**. Pense em algo que traga isso de outro jeito, nesse horário." Se não tiver: "Se ainda não anotou no diário, tudo bem. Pense no que {{apelido}} curtia antes."
- Chips de ideias, agrupados pela busca do diário (a mais marcada primeiro aberta; as outras recolhidas em "Ver mais ideias"):

| Busca | Ideias |
|---|---|
| Relaxar | Ouvir uma música calma juntos · Um banho demorado · Sentar na varanda ou na calçada para ver o movimento · Um chá ou café no fim da tarde · Uma massagem nos ombros |
| Se divertir | Ver um filme de comédia juntos · Uma partida de baralho ou dominó · Ver vídeos engraçados juntos · Olhar fotos de momentos bons · Cozinhar uma receita nova |
| Se enturmar | Chamar amigos ou parentes para um café em casa · Um passeio na praça do bairro · Ver um jogo de futebol com a família · Um lanche com gente querida · Uma ligação de vídeo com alguém de quem {{apelido}} gosta |
| Alívio de um problema | Uma caminhada ao ar livre · Ajudar a colocar o problema no papel · Resolver juntos uma pendência pequena · Um tempo em silêncio, sem cobrança · Conversar sobre outra coisa |
| Sentir emoção | Assistir a um jogo importante do time · Um esporte ou exercício juntos · Um passeio a um lugar novo · Montar ou consertar algo juntos · Ver um filme de ação ou suspense |
| Conseguir dormir | Quarto escuro e silencioso · Um som de chuva para dormir · Um leite ou chá quente antes de deitar · Deixar o celular longe na hora de deitar · Uma rotina tranquila no fim da noite |

- Campo [GOSTA_CAMPO] (2 campos, um por item): rótulo "Do que {{apelido}} gosta" · dica "Algo concreto e fácil de fazer no dia a dia. Toque numa ideia ou escreva a sua."
- Botão: **"Salvar minha lista"** (habilitado com 1 item; o 2º é recomendado: "Que tal mais uma?").

### Ferramenta B: planejar como valorizar
**Tela 1**
- Título: **Como você vai valorizar nesta semana**
- [VALORIZAR_INTRO] "Quando {{apelido}} estiver bem e sem usar, mostre que você percebeu. Logo na hora, com algo simples e de que a pessoa goste."
- [VALORIZAR_OPCOES] chips (escolher 2): Dar atenção e ouvir sem interromper · Fazer companhia numa atividade simples · Fazer a comida preferida · Um passeio sem pressa · Um elogio sincero · Um abraço · Colocar a música preferida · Agradecer uma ajuda em casa · Fazer uma das coisas da lista "do que {{apelido}} gosta" · Deixar descansar sem cobrança
- Se escolher "Um elogio sincero", abrir o card de elogios:
  - [ELOGIOS_EXEMPLO] **Funcionam:** "Gostei muito da sua ajuda na cozinha hoje." · "Foi muito bom conversar com você com calma." · "Adorei passear com você." · "Ficou ótimo o que você fez." · "Valeu por ter avisado." · "Fiquei feliz de ver você em casa hoje."
  - [ELOGIOS_EVITAR] **Soam como cobrança:**
    - "Até que enfim, hein." Traz o passado de volta e diminui o gesto de agora.
    - "Você devia ser assim todo dia." Vira cobrança para amanhã.
    - "Nem parece você." Soa como ironia e apaga o que foi bom.
    - "Olha só, até que você se esforçou." Mostra que você não acreditava.
  - Botão secundário: "Treinar um elogio" (cenário `elogiar-sem-ironia`).
- [VALORIZAR_QUANDO] rótulo "Quando" · dica "Se der, escolha os dias e horários em que os momentos difíceis costumam aparecer (o diário mostra). É ali que um momento bom faz mais diferença." · chips de dias da semana + manhã/tarde/noite.
- Botão: **"Salvar meu plano"**
- Confirmação: "Plano salvo. Quando você valorizar um momento bom, toque no dia, no card do painel."

### No painel e no check-in
- Card "Valorizar o que é bom": as 2 formas escolhidas e os 7 dias da semana, com a mesma regra de marcar dias da meta (briefing 00, item 6).
- Check-in: "Você conseguiu valorizar um momento bom nesta semana?" · Sim · Ainda não · Se sim: "Como {{apelido}} reagiu?" · Gostou · Nem percebeu · Estranhou · Reagiu mal. Para "Estranhou": "É comum estranhar no começo. Continue, sem exagero." Para "Reagiu mal": "Às vezes a pessoa desconfia da mudança. Vale manter, com naturalidade. Se a reação te deixou com medo, veja o seu plano de segurança." [link]

### Dados
`lista_gosta`: itens[2], busca_relacionada. `plano_valorizar`: formas[2], dias[], periodos[], feitos[datas]. `checkin_valorizar`: fez, reacao.

### Critério de aceite
- As ideias abertas primeiro são as da busca mais marcada no diário.
- Elogios a evitar sempre aparecem junto com os exemplos.
- Nenhuma ideia envolve bebida, dinheiro ou aposta.


## C5. Quando houver uso: o combinado fica para outro dia

**Onde aparece:** módulo 4, exercício 3.
**Por que existe:** valorizar os momentos sem uso funciona melhor quando, durante o uso, aquilo que é bom (atenção, companhia, o programa combinado) não acontece. Sem castigo, sem bronca: o programa só fica para outro dia, e a explicação vem depois, num momento sem efeito.
**Segurança primeiro:** a ferramenta começa por uma pergunta de segurança. Em `caution_mode` e `safety_mode`, ela não aparece (ver regras do módulo 4).

### Tela 1: pergunta de segurança
- [ADIAR_CLIMA_PERGUNTA] "Se você adiar um programa porque {{apelido}} usou, isso pode deixar o clima tenso ou perigoso em casa?" · **Sim** · **Não** · **Não sei**
- [ADIAR_CLIMA_SIM] (Sim ou Não sei): "Então deixe esta parte para depois. Nesta semana, foque em valorizar os momentos bons, e converse com um profissional antes de dar este passo." [Botão: "Ver psicólogo parceiro"] [Botão secundário: "Voltar ao módulo"]. O exercício fica como "Deixado para depois", em cinza neutro, sem contar como pendente.

### Tela 2: escolher a situação
- Título: **Quando o combinado fica para outro dia**
- [ADIAR_INTRO] "Se vocês combinaram algo bom e {{apelido}} chegar depois de usar, o programa fica para outro dia. Com calma, sem bronca e sem discussão."
- [ADIAR_SITUACOES] chips (escolher 1) + "Outro": Ver um filme juntos · Um jantar especial · Um passeio · Um café da tarde juntos · Uma visita a alguém da família · Um jogo ou partida juntos
- Se a pessoa já salvou o plano de valorizar (C4), mostrar primeiro as formas escolhidas lá: "Uma das coisas que você planejou para valorizar pode ser a escolhida aqui."

### Tela 3: o que dizer na hora e depois
- **Na hora** [ADIAR_NA_HORA] (tocar para escolher 1, editável):
  "Hoje não vai dar. A gente vê outro dia." · "Tudo bem, fica pra outra hora." · "Vamos deixar pra amanhã." · "Hoje eu vou fazer outra coisa. Outro dia a gente vê."
  Dica abaixo: "Diga uma vez, com voz calma, e vá fazer outra coisa. Sem sermão e sem cara feia."
- **No dia seguinte, num momento sem efeito** [ADIAR_DEPOIS] (escolher 1, editável):
  "Ontem eu não quis ver o filme porque você tinha usado. Eu gosto muito quando a gente fica junto sem isso." · "Eu adiei ontem porque queria você de verdade comigo. Bora tentar no sábado?" · "Eu adoro quando a gente aproveita junto. Por isso eu deixei pra outro dia."
  Para álcool, trocar "tinha usado" por "tinha bebido"; para apostas, "porque você estava apostando".
- Botão: **"Salvar"** · Confirmação: "Combinado. Se acontecer, você já sabe o que dizer."

### Check-in
"Precisou adiar algum programa nesta semana?" · Não precisou · Sim, e foi tranquilo · Sim, e ficou tenso. "Ficou tenso" → "Que bom que você contou. Se o clima ficou tenso, deixe esta parte de lado por enquanto e veja o seu plano de segurança." [link] + ligar `caution_mode`.

---

# Briefing M4b: cenário `elogiar-sem-ironia` (texto pronto, é só aplicar)

Pré-requisito: briefing 00. Completa o briefing M4. Hoje o botão "Treinar um elogio", no card de elogios da ferramenta "planejar como valorizar", fica escondido porque o arquivo do cenário não existe. Este briefing cria o cenário e corrige dois problemas que aparecem junto com ele.

Texto da cena e das reações: Gemini escreveu, Claude revisou.

## 1. Criar `content/familia/cenarios/elogiar-sem-ironia.md`

Conteúdo exato do arquivo:

```markdown
---
id: "elogiar-sem-ironia"
titulo: "Elogiar sem soar como cobrança"
contexto: "Um fim de tarde calmo em casa. {{apelido}} acabou de ajudar a arrumar a cozinha, e o clima está tranquilo. O familiar quer dizer que percebeu, sem que isso soe como cobrança."
objetivo_do_familiar: "Elogiar uma coisa específica, sem cobrança e sem ironia."
bloqueado_em_modo_seguranca: false
gratis: false
nota_do_personagem: "Nesta cena ninguém está acusando nem cobrando nada: o familiar quer elogiar algo que {{apelido}} acabou de fazer. Comece desconfiando do elogio, como alguém que já ouviu ironia antes, no tom destas falas: 'Você tá falando de verdade ou tá debochando de mim?', 'Hum, já vai vir cobrança depois desse comentário?', 'Ué, o que você tá querendo pedir com esse papo?'. Se o elogio for curto, específico e sem lembrar o passado, vá relaxando e aceite. Se vier com cobrança, com comparação com antes ou com ironia, se feche."
foco_do_feedback: "Nesta cena, avalie principalmente ser breve, ser positivo, falar de um comportamento específico e nomear o próprio sentimento. Não sugira oferecer ajuda nem abrir o assunto do uso: aqui o objetivo é reconhecer uma coisa boa, nada além disso. Diga se o elogio trouxe o passado de volta, cobrou algo para o futuro ou soou como ironia."
---

<!-- Cena e reações escritas com o Gemini e revisadas. O personagem desconfia do elogio em vez de negar um problema, porque aqui não há acusação nenhuma no ar. O feedback não pede "oferecer ajuda": num elogio, isso viraria proposta. -->
```

Cuidado com o parser: `separarFrontmatter` (em `lib/familia/markdown.ts`) lê uma linha por chave, não aceita bloco de várias linhas e corta tudo que vem depois de `#`. Por isso cada valor fica numa linha só, entre aspas duplas, com aspas simples por dentro e sem nenhum `#`.

`bloqueado_em_modo_seguranca` é `false` de propósito: elogiar um momento bom é a parte do método que continua valendo mesmo quando existe risco. O que sai no modo segurança é a parte de adiar o combinado, não o elogio.

## 2. Dois campos novos no cenário: `nota_do_personagem` e `foco_do_feedback`

Por que existem. O `content/familia/prompts/personagem.md` é um prompt único para todos os cenários, e ele manda o personagem começar "com defesa, desconforto ou negação". Aqui não há nada a negar: o familiar só vai elogiar. E o `feedback.md` avalia as 7 habilidades, inclusive "oferecer ajuda", que num elogio vira uma proposta fora de hora. Sem um ajuste por cenário, o treino do elogio sai errado nas duas pontas.

Os dois campos são opcionais. Cenário sem eles (`primeira-conversa` e `nega-o-problema`) continua funcionando exatamente como hoje.

**a) `lib/familia/conteudo.ts`**
- No type `Cenario`, acrescentar `notaDoPersonagem: string` e `focoDoFeedback: string`.
- No retorno de `lerCenario`, acrescentar `notaDoPersonagem: texto(dados.nota_do_personagem) ?? ""` e `focoDoFeedback: texto(dados.foco_do_feedback) ?? ""`.

**b) `app/api/familia/simulador/route.ts`**
- `promptDoPersonagem` passa a receber o cenário inteiro, no lugar de só o contexto. Quando `notaDoPersonagem` não estiver vazia, acrescentar ao fim do prompt, depois de uma linha em branco: `Ajuste para esta cena:` e a nota.
- Nas duas chamadas de `gerarFeedback`, a de desenvolvimento (linha 71) e a real (linha 177): quando `focoDoFeedback` não estiver vazio, acrescentar ao fim do prompt do feedback, depois de uma linha em branco: `Foco desta cena:` e o texto.

**c) Corrigir a ordem das substituições em `promptDoPersonagem`.** Hoje `{{contexto_do_cenario}}` é o último `replaceAll` da cadeia, então `{{apelido}}` escrito dentro do contexto de um cenário entra no prompt sem ser substituído, porque a substituição do apelido já tinha passado. Mover o `replaceAll("{{contexto_do_cenario}}", ...)` e a nova nota para **antes** do `replaceAll("{{apelido}}", ...)`. O mesmo vale para o `foco_do_feedback`: juntar o texto ao prompt primeiro e substituir o apelido depois.

Na tela isso já funciona: o `SimuladorCliente` passa o contexto por `aplicarApelido`.

**d) `app/familia/programa/simulador/[cenario]/page.tsx`**
O `generateStaticParams` tem a lista fixa dos cenários. Acrescentar `{ cenario: "elogiar-sem-ironia" }`, senão a página responde 404.

## 3. O botão, no M4

Com o arquivo criado, o botão secundário "Treinar um elogio" passa a aparecer no card de elogios. Rótulo exato, do briefing 00, item 7: **"Treinar um elogio"**. Título da tela do treino: **"Treino: elogiar sem soar como cobrança"**.

## 4. Critério de aceite

- `/familia/programa/simulador/elogiar-sem-ironia` abre, com o título e a cena na tela, e o apelido já aparece no lugar de `{{apelido}}`.
- A primeira resposta do personagem desconfia do elogio e não fala de uso nem de problema.
- Elogio curto, específico e sem lembrar o passado: o personagem relaxa. Elogio com cobrança, comparação com antes ou ironia: o personagem se fecha.
- O feedback não sugere oferecer ajuda nem abrir o assunto do uso.
- `primeira-conversa` e `nega-o-problema` continuam com o mesmo prompt de antes, sem nada acrescentado.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.

---

# Briefing M5: módulo 5, o convite

Pré-requisito: briefing 00 (padrões: hierarquia, clareza, ferramenta para toda tarefa, "Concluído em DD/MM", ver/editar/refazer, botões de treino). Se a parte 2 já foi colada, este briefing substitui o que ela diz sobre este módulo. Textos: Gemini escreveu, Claude revisou.

## 1. Cards do exercício (substituem os atuais)
**Card 1: Preparar o convite**
Instrução: "Em 5 passos, deixe pronto o convite para {{apelido}} conversar com um psicólogo: o profissional, a hora certa, a frase, o treino e o plano se a resposta for não."
Botões: **"Preparar meu convite"** (principal, mostra "Passo X de 5") · "Treinar o convite" (secundário, ativo depois do passo 3)
Concluído: ao terminar o passo 5. Depois: "Ver e editar meu convite"

**Card 2: Contar como foi o convite**
Instrução: "Quando você fizer o convite, conte aqui qual foi a resposta de {{apelido}}. Isso define os próximos passos do programa."
Botão: **"Contar como foi o convite"** · opções: Aceitou · Disse que vai pensar · Disse não · (cada uma com o retorno e a frase do passo 5 do convite; "Aceitou" mostra "Agendar com {{profissional_salvo}}")
Concluído: ao salvar. Depois: "Ver o que você contou" · "Contar de novo"
`caution_mode`: no topo do módulo, o `CARD_CAUTELA`.

## 2. Ferramentas
## C6. Preparar o convite + plano B

**Onde aparece:** módulo 5 (exercícios 1 a 3). O profissional salvo e a frase ficam no painel em "Meu convite", sempre a um toque, para a hora em que a janela aparecer.
**Por que existe:** pelo método, o convite funciona melhor quando a ajuda já está pronta (profissional escolhido, horário em poucos dias), quando acontece numa janela e quando é pequeno e sem compromisso. E o familiar precisa saber de antemão o que fazer com um sim, um "vou pensar" ou um não.
**Formato:** 5 passos, um por tela, com barra "Passo X de 5". Dá para sair e voltar; o progresso fica salvo.

### Abertura
[CONVITE_INTRO] "Convidar fica mais leve quando você já chega com tudo pronto. Vamos montar isso juntos, passo a passo, no seu tempo."

### Passo 1: deixar a ajuda pronta
- Título [CONVITE_PASSO1]: **Deixe a ajuda pronta antes de convidar**
- Texto: "Quando {{apelido}} diz 'tá bom, eu vou', essa vontade pode durar pouco. Por isso, escolha agora um profissional e veja um horário possível nos próximos dias."
- Lista de psicólogos parceiros que atendem a pessoa que usa (não só familiares), filtrada por horário em até 3 dias, no componente de agenda que já existe. Cada card: foto, nome, abordagem, faixa de valor, próximo horário.
- Botão em cada card: **"Deixar salvo para o convite"** (não agenda nada; só salva). Pode salvar até 2.
- Texto de apoio: "{{apelido}} também pode escolher outro profissional depois. O importante é ter uma opção pronta."
- Se não houver nenhum com horário em até 3 dias, mostrar o bloco "Se não houver horário rápido" do módulo 5 (CAPS AD, UBS, Meu SUS Digital) com o botão "Ver serviços perto de mim" (integração Google Maps que a Margem já usa) e permitir salvar um serviço no lugar do profissional.
- Botão: "Continuar"

### Passo 2: reconhecer a hora certa
- Título: **A hora certa**
- Dois cards:
  - [CONVITE_SINAIS] **Pode ser uma boa hora quando {{apelido}}:**
    pergunta o que você anda fazendo de diferente · mostra arrependimento depois de um episódio · está de bom humor, sem pressa · desabafa sobre algo que está pesando · reconhece que as coisas estão difíceis · puxa conversa com calma
  - [CONVITE_NAO_E_HORA] **Melhor esperar quando:**
    {{apelido}} está sob efeito ou acabou de usar · vocês estão no meio de uma discussão · há irritação ou muito cansaço · tem muita gente por perto
- Texto: "Se o diário mostrou um dia ou horário mais calmo, ele pode ser uma boa janela: {{momento_bom_mais_comum}}." (só com dados do diário)
- Botão: "Entendi"

### Passo 3: montar a sua frase
- Título: **A sua frase de convite**
- Texto: "Escolha uma opção de cada parte. A frase vai se formando embaixo, e você pode editar do seu jeito."
- **Parte 1, para abrir** [PARTE_ABRIR] (chips, escolher 1):
  "Eu gosto muito de você." · "Eu gosto de quando a gente conversa assim." · "Eu sei que as coisas não andam fáceis." · "Eu tenho feito um programa para lidar melhor com tudo isso."
- **Parte 2, o que você sente** [PARTE_SENTIR]:
  "E eu fico com medo de te ver assim." · "E isso tem pesado pra mim também." · "E eu sinto falta de te ver bem." · "E eu queria muito te ver mais leve."
- **Parte 3, a oferta** [PARTE_OFERECER]:
  "Topa conversar uma vez com um psicólogo, só pra ver como é?" · "Achei uma psicóloga que atende nesta semana. Quer que eu marque?" · "Quem escolhe o profissional e o que conversar é você. Posso ver um horário?" · "Se quiser, eu vou junto até lá."
  (Na oferta com "psicóloga", usar o gênero do profissional salvo no passo 1: "um psicólogo" / "uma psicóloga". Se não salvou, usar "alguém".)
- Prévia da frase montada, editável, com contador: "Tente que caiba numa respiração."
- `caution_mode`: não mostrar a opção "Eu tenho feito um programa..." (item 17).
- Botão: **"Salvar minha frase"**

### Passo 4: treinar o convite
- Título: **Ensaie antes**
- Texto: "Falar em voz alta uma vez muda muito. No treino, {{apelido}} pode aceitar, pedir um tempo ou dizer não, e você pratica as três."
- Botão: **"Treinar o convite"** (cenário `convite-para-ajuda`, com a frase do passo 3 carregada) · link "Pular por agora"

### Passo 5: e se a resposta for...
Três cards, cada um com o que fazer e uma frase pronta:
- **Sim** [CONVITE_RESPOSTA_SIM]: "Aja no mesmo dia, enquanto a vontade está viva. Mande a mensagem para o profissional salvo e combine o horário com {{apelido}}." [Botão: "Agendar com {{profissional_salvo}}"]
- **"Vou pensar"** [CONVITE_RESPOSTA_PENSAR]: "Respeitar o tempo da pessoa tira a pressão. Deixe a porta aberta, sem cobrar." · Frase: "Tudo bem, pensa com calma. Tô aqui se quiser ajuda."
- **Não** [CONVITE_RESPOSTA_NAO]: "Um não hoje não é um não para sempre. Agradeça por ter ouvido e não insista agora." · Frase: "Tudo bem. Valeu por me ouvir. A gente fala disso outra hora."
- Depois: **"Se a resposta for não, qual vai ser o seu plano?"** [PLANO_B_OPCOES]
  - **Convidar de novo depois:** "Você espera a próxima janela, revê a frase e ensaia de novo."
  - **Focar nas suas metas por um tempo:** "Você dá um tempo no assunto e escolhe uma data para pensar de novo." → seletor de data (padrão: 4 semanas) e aviso por e-mail discreto nessa data.
- Botão: **"Salvar meu plano"**

### Depois do convite (painel e check-in)
- Card "Meu convite" no painel: profissional salvo, frase, plano B. Botão "Aconteceu? Contar como foi".
- "Contar como foi": Sim · Vou pensar · Não · Ainda não convidei. Cada resposta grava o estado que escolhe a versão do módulo 8 (aceitou | recusou) e, no "Sim", oferece agendar na hora.

### Dados
`convite`: profissionais_salvos[], frase, plano_b (convidar_de_novo | focar_metas), data_retorno, resultado (sim | pensar | nao | null), data_resultado.

### Critério de aceite
- Dá para chegar ao passo 5 com um profissional salvo, uma frase pronta e um plano B em menos de 5 minutos.
- O botão "Agendar" do "Sim" leva ao profissional salvo, sem nova busca.

---

# Briefing M5c: cenário `convite-para-ajuda` (texto pronto, é só aplicar)

Pré-requisito: briefings 00 e M4b, que criou os dois campos opcionais do cenário (`nota_do_personagem` e `foco_do_feedback`) e corrigiu a ordem das substituições. Se o M4b ainda não foi aplicado, aplique antes: este cenário usa os mesmos campos.

Com este arquivo, o botão "Treinar o convite" do módulo 5 deixa de ficar escondido.

Texto da cena e das reações: Gemini escreveu, Claude revisou.

## 1. Criar `content/familia/cenarios/convite-para-ajuda.md`

```markdown
---
id: "convite-para-ajuda"
titulo: "Convidar sem soar como ultimato"
contexto: "Uma noite calma na sala, sem pressa e sem discussão no ar. {{apelido}} está tranquilo, e o familiar já tem uma opção concreta na mão, com dia e horário, para oferecer."
objetivo_do_familiar: "Fazer o convite com uma opção pronta, e aceitar um não sem discussão."
bloqueado_em_modo_seguranca: true
gratis: false
nota_do_personagem: "Nesta cena o familiar vai convidar {{apelido}} a marcar uma conversa com um profissional. Não aceite logo de primeira. Recuse com educação, sem briga, no tom destas falas: 'Eu agradeço a intenção, mas não preciso de ninguém de fora me dizendo o que fazer.', 'Hoje eu não quero marcar nada, prefiro seguir no meu próprio tempo.', 'Eu posso até pensar nisso depois, mas agora não quero falar sobre essa ideia.'. Se o convite for curto, com uma opção concreta e sem cobrança, abra um pouco: pergunte como seria, ou diga que pode pensar. Se vier ameaça, ultimato, choro de cobrança ou lembrança do passado, feche e encerre o assunto."
foco_do_feedback: "Nesta cena, um não é um resultado bom, nunca uma falha. Nunca diga ao familiar que ele deveria ter insistido, e nunca sugira repetir o convite na mesma conversa. Avalie se o convite foi curto, se ofereceu uma opção concreta em vez de uma ideia solta, se falou do sentimento de quem convida em vez de defeito de quem ouve, e se não teve ultimato, chantagem nem passado. Se {{apelido}} disse não e o familiar aceitou sem discutir, diga que isso foi o acerto da conversa e que deixa a porta aberta para outro dia."
---

<!-- Cena e reações escritas com o Gemini e revisadas. As três recusas são educadas de propósito: a recusa com briga é fácil de reconhecer, a educada é a que faz o familiar insistir. Bloqueado no modo segurança pela mesma razão da primeira conversa: com risco de violência, um convite pode virar estopim. -->
```

Mesmo cuidado do M4b com o parser: uma linha por chave, entre aspas duplas, aspas simples por dentro, sem `#`.

## 2. Ligar o cenário

- `app/familia/programa/simulador/[cenario]/page.tsx`: acrescentar `{ cenario: "convite-para-ajuda" }` ao `generateStaticParams`.
- O botão no módulo 5 é **"Treinar o convite"** (briefing 00, item 7). Título da tela: **"Treino: convidar sem soar como ultimato"**.

## 3. Por que o foco do feedback é tão específico

O prompt geral do feedback avalia as 7 habilidades, e uma delas é "oferecer ajuda". Num treino de convite, isso empurra o retorno para premiar quem insiste e para tratar o não como fracasso. É o contrário do método: o convite é de baixo compromisso, nunca ultimato, e aceitar o não é o que mantém a porta aberta para a próxima vez. Sem o `foco_do_feedback`, o treino ensinaria pressão.

## 4. Critério de aceite

- `/familia/programa/simulador/convite-para-ajuda` abre, com o apelido no lugar de `{{apelido}}`.
- O personagem recusa de forma educada na primeira resposta, sem briga.
- Convite curto e com opção concreta: o personagem abre um pouco. Ultimato, chantagem ou passado: o personagem encerra.
- O feedback nunca sugere insistir nem repetir o convite na mesma conversa, e trata o não aceito como acerto.
- Em `safety_mode` o cenário fica bloqueado, como a primeira conversa.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.

---

# Briefing M56: o carrossel de profissionais no lugar do botão

Pré-requisito: briefing 00. Vale para os módulos 5 e 6 e para o painel. Não cria componente novo: usa o `CardProfissionais` que já existe em `components/conversa/CardProfissionais.tsx`.

Decisão tomada: todos os profissionais cadastrados atendem familiares. Não existe campo novo no cadastro e o carrossel não filtra por isso.

## 1. O que entra no lugar do quê

Hoje existem botões "Ver psicólogo parceiro" apontando para `/profissionais`, que é uma página do site principal. Em parte das telas o carrossel é melhor, e em parte não. A regra é o momento da pessoa.

**Vira carrossel** (a pessoa está decidindo com calma):
- Painel, seção "Profissionais" (`PainelCliente.tsx`, linha 204).
- Módulo 5, no fim do módulo, depois do exercício do convite.
- Módulo 6, no fim do módulo, depois do exercício do dinheiro.

**Continua botão** (o momento é pesado ou a pessoa está no meio de uma tarefa):
- `components/familia/ContatosEmergencia.tsx`, linha 101.
- Diário, depois de um relato de segurança (`diario.ts`, `profissionalBotao`).
- Escala, no cartão de nota muito baixa (`EscalaCliente.tsx`, linha 267).
- Modo segurança e modo cautela, onde o briefing M4 troca um card por "Ver psicólogo parceiro".

O motivo de não ser carrossel nesses quatro: rosto, foto e faixa de preço no meio de um momento de risco transformam cuidado em venda. Ali a pessoa precisa de um caminho curto, não de uma vitrine.

## 2. Como chamar o carrossel

Usar a variante `home`, que é a da captura que o fundador enviou: título, seletor de especialidade, faixa de preço em caixa cinza, fileira de cards. Sem descrição, sem o botão de serviços públicos.

```tsx
<CardProfissionais
  profissionais={profissionais}
  variante="home"
  id="familia-profissionais"
  origem="programa-modulo-5"
  titulo="Profissionais que podem atender você"
/>
```

**Um prop novo, `titulo`**, opcional, com o valor de hoje ("Profissionais que podem ajudar") como padrão. Por que: dentro de um programa para familiares, "Profissionais que podem ajudar" deixa a pergunta no ar, ajudar quem. Quem vai sentar na sessão é o familiar, e o título precisa dizer isso sozinho (briefing 00, item 2). Com "Profissionais que podem atender você", a tela não precisa de subtítulo.

A variante `home` hoje não recebe `origem`. Passar `origem` adiante para o `CardProfissionaisCompleto`, como a variante `guia` já faz.

Valores de `origem`, um por tela: `programa-painel`, `programa-modulo-5`, `programa-modulo-6`.

## 3. A mensagem do WhatsApp precisa dizer de onde a pessoa veio

Hoje, em `hrefWhatsappProfissional`: "Olá! Achei o(a) {nome} na Margem e gostaria de agendar uma sessão". Quem vem do programa é familiar, e a sessão é para essa pessoa, não para quem usa. Sem isso, o profissional pode responder achando que vai atender a outra pessoa, ou pedir para falar com ela.

Quando a `origem` começar com `programa-`, o texto passa a ser:

> "Olá! Achei o(a) {nome} na Margem. Estou fazendo o programa para familiares e gostaria de agendar uma sessão para mim."

Não escrever substância nem detalhe da situação: a mensagem sai do número da própria pessoa e ela não escolheu contar isso ainda.

## 4. Dois rótulos errados em `ExercicioSemana.tsx`

- `profissionais_semana` hoje é "Ver psicólogos parceiros com horário nesta semana". Não existe agenda, nem horário, nem disponibilidade no produto. É uma promessa que a tela não cumpre. Trocar por **"Ver psicólogos parceiros"** e deixar a chave apontando para o mesmo lugar de `profissional`, para não quebrar os arquivos de módulo que já usam o nome.
- `profissional` continua **"Ver psicólogos parceiros"**, no plural, porque a lista tem mais de um.

## 5. Concluir o exercício

Hoje o `ACAO_MARCA` conta o item como feito no clique do botão. Onde virar carrossel não existe mais um botão único, então o item conclui quando a pessoa **abre o perfil de um profissional ou toca em "Agendar por WhatsApp"**. Os dois eventos já existem no card: `card_profissional_clicado` e `agendar_whatsapp_clicado`.

Nas telas que continuam com botão, nada muda.

## 6. Critério de aceite

- Painel, módulo 5 e módulo 6 mostram o carrossel com o título "Profissionais que podem atender você", o seletor de especialidade e a faixa de preço.
- Emergência, diário depois de relato de segurança, escala com nota muito baixa e modo segurança continuam com botão, sem foto e sem preço.
- A mensagem do WhatsApp aberta a partir do programa diz que a pessoa está no programa para familiares e que a sessão é para ela.
- `agendar_whatsapp_clicado` e `card_profissional_clicado` chegam com a `origem` da tela, e dá para separar painel, módulo 5 e módulo 6.
- Nenhum texto promete horário, agenda ou disponibilidade.
- Com a lista vazia, o carrossel cai no estado `in-construction` que já existe, e a tela não fica quebrada.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.

---

# Briefing M6: módulo 6, consequências, problemas e dinheiro

Pré-requisito: briefing 00 (padrões: hierarquia, clareza, ferramenta para toda tarefa, "Concluído em DD/MM", ver/editar/refazer, botões de treino). Se a parte 2 já foi colada, este briefing substitui o que ela diz sobre este módulo. Textos: os textos das ferramentas foram escritos pelo Gemini e revisados pelo Claude; as listas de "devolver" e os exemplos dos 8 passos e estes cards foram escritos pelo Claude (o Gemini recusou ou saiu do assunto). [REVISÃO CLÍNICA]

## 1. Cards do exercício (substituem os atuais)
**Card 1: Devolver o que é de {{apelido}}**
Instrução: "Escolha uma coisa que você faz hoje por {{apelido}} e que é responsabilidade de {{apelido}}, como dar desculpas no trabalho. Você vai deixar de fazer só essa, com segurança."
Botão: **"Escolher o que devolver"**
Concluído: ao salvar o aviso. Depois: "Ver e editar" · "Escolher outra"

**Card 2: Resolver um problema em 8 passos**
Instrução: "Escolha um problema pequeno da sua semana, como ficar sem dormir esperando {{apelido}} chegar, e resolva em 8 passos simples."
Botão: **"Resolver um problema"**
Concluído: ao salvar o plano (o passo 8 volta no check-in). Depois: "Ver meu plano" · "Resolver outro problema"

**Card 3: Cuidar do dinheiro da casa**
Instrução: "Escolha uma medida para proteger o dinheiro da casa nesta semana, como separar uma conta só sua."
Botão: **"Escolher uma medida"**
Concluído: quando a pessoa marca a medida como feita no painel ("Concluir esta medida"). Depois: "Escolher outra medida"
`caution_mode`: no topo do módulo, o `CARD_CAUTELA`.

## 2. Ferramentas
## C7. Devolver o que é da pessoa

**Onde aparece:** módulo 6, exercício 1. A escolha fica no painel e volta no check-in.
**Por que existe:** quando a família resolve as consequências do uso, a pessoa não sente o peso do que aconteceu. O método pede para escolher **uma** coisa para deixar de amortecer, passando por 4 critérios, e avisar antes, com calma.

### Tela 1: o que você faz hoje
- Título: **O que você faz hoje que é de {{apelido}}**
- [DEVOLVER_INTRO] "Resolver pela pessoa quase sempre nasce do amor: proteger, evitar vergonha, evitar briga. Aqui você escolhe uma coisa só para devolver, com segurança."
- Chips (múltipla escolha), mostrando primeiro os do problema marcado:
  - Gerais: Dar desculpas no trabalho ou na faculdade · Inventar desculpas para a família ou amigos · Arrumar a bagunça depois de um episódio · Acordar {{apelido}} para não perder compromisso depois de uma noite de uso · Cancelar ou remarcar compromissos de {{apelido}} · Buscar {{apelido}} onde estiver, a qualquer hora
  - Álcool: Esconder as garrafas para ninguém ver · Cuidar de tudo no dia seguinte como se nada tivesse acontecido
  - Outras drogas: Dar dinheiro sem saber para onde vai · Resolver problemas com pessoas a quem {{apelido}} deve
  - Apostas: Pagar dívidas de aposta · Transferir dinheiro para cobrir o saldo · Negociar com credores no lugar de {{apelido}} · Explicar para a família para onde foi o dinheiro
  - Outro (campo curto)
- Botão: "Continuar"

### Tela 2: escolher uma e passar pelas 4 perguntas
- "Qual delas você quer devolver primeiro?" (escolha única entre as marcadas)
- [DEVOLVER_PERGUNTAS], cada uma com Sim / Não e 1 linha de ajuda:
  1. **Tem relação direta com o uso?** "Por exemplo: a desculpa no trabalho depois de uma noite de uso. Lavar a louça do dia a dia não entra aqui."
  2. **É fácil para você deixar de fazer?** "Comece pelo mais simples. Ninguém precisa começar pelo mais difícil."
  3. **Não cria um problema maior para você ou para a casa?** "Deixar de pagar a luz, por exemplo, pesa em todo mundo."
  4. **É seguro para todos?** "Saúde e segurança vêm sempre primeiro. Se houver risco, não é por aqui."
- [DEVOLVER_ALGUM_NAO] (qualquer "Não"): "Essa ainda não é a melhor para começar, e tudo bem. Escolha outra da lista." [Botão: "Escolher outra"]. Se a 4ª for "Não": acrescentar "Se você tem medo da reação, converse antes com um profissional." [Botão: "Ver psicólogo parceiro"]
- Com 4 "Sim": botão **"Vou devolver esta"**

### Tela 3: avisar com calma
- Título: **Avise antes, num momento tranquilo**
- Texto: "Escolha um momento sem efeito e sem briga. Uma frase curta, sem acusar."
- [DEVOLVER_AVISO] 3 frases para tocar e editar:
  - "A partir de agora, eu não vou mais ligar pro seu trabalho quando você faltar. Não é castigo. Eu só não quero mais fazer isso."
  - "Eu não vou mais pagar essa conta. Eu te amo, e isso é seu para resolver."
  - "Eu não vou mais inventar desculpa pra família. Se perguntarem, eu vou dizer que é melhor falar com você."
- Campo "A sua frase" (pré-preenchido pela escolha, editável).
- [DEVOLVER_DEPOIS] card: "Nos primeiros dias, é comum vir reclamação. Cumpra com calma e não volte a discutir o assunto. Se {{apelido}} passar mal, ajude e, se for preciso, ligue 192."
- Botão: **"Salvar"** · Confirmação: "Combinado com você. No check-in, a gente vê como foi."
- `caution_mode`: acima do botão, o `CARD_CAUTELA`.

### Check-in
"Você conseguiu devolver {{item}}?" · Sim · Em parte · Ainda não · Se sim/em parte: "Como foi?" · Tranquilo · Teve reclamação · Ficou tenso. "Ficou tenso" → link para o plano de segurança e sugestão de profissional.

---

## C8. Resolver um problema em 8 passos

**Onde aparece:** módulo 6, exercício 2. Fica disponível no painel em "Ferramentas" para usar quantas vezes quiser.
**Por que existe:** quando tudo parece um problema só, nada anda. O método ensina a quebrar em algo pequeno e seguir passos simples até virar uma tarefa da semana.
**Formato:** um passo por tela, barra "Passo X de 8". Em cada tela: título, pergunta, campo, e um card recolhível **"Ver o exemplo"** com o mesmo problema-exemplo do início ao fim, para a pessoa ver como fica.

### Tela 0: escolher o problema
- Título: **Um problema por vez**
- Texto: "Escolha algo pequeno e concreto, que acontece de verdade aí. Quanto menor, mais fácil de resolver."
- Exemplos tocáveis [PROBLEMAS_EXEMPLO]:
  - Fico sem dormir esperando {{apelido}} chegar no fim de semana
  - {{apelido}} me pede dinheiro e eu não sei dizer não
  - Os almoços de família viram tensão por causa do assunto
  - Não sei o que responder quando perguntam de {{apelido}}
  - As crianças perguntam o que está acontecendo
  - Eu não tenho mais tempo para mim
  - A gente briga sempre no mesmo horário
  - Eu chego do trabalho e já fico em alerta
- Campo "Ou escreva o seu".

### Telas 1 a 8
| Passo | Título | Pergunta | Exemplo (card "Ver o exemplo") |
|---|---|---|---|
| 1 | Deixar o problema do seu tamanho | "Qual parte disso está ao seu alcance mudar?" · dica: "Foque no que depende de você." | "Fico sem dormir esperando {{apelido}} chegar no fim de semana." (não "{{apelido}} sai demais") |
| 2 | Todas as ideias | "Que ideias vêm à cabeça? Vale tudo, sem julgar." | Pedir uma mensagem quando estiver saindo · ir dormir no meu horário · usar protetor de ouvido · deixar a chave num lugar combinado · passar a noite olhando o celular |
| 3 | Tirar o que não serve | "Quais dessas são impossíveis ou cansam demais?" (a pessoa risca tocando) | Riscar: passar a noite olhando o celular |
| 4 | Escolher uma | "Qual dá para testar nesta semana?" | Combinar uma mensagem e ir dormir no meu horário |
| 5 | O que pode atrapalhar | "O que pode dar errado?" | {{apelido}} esquecer de mandar a mensagem e eu passar a noite em claro |
| 6 | Se atrapalhar | "O que você faz se acontecer?" | Ir dormir mesmo assim, com o celular no silencioso e som só para ligação |
| 7 | Virar tarefa | "Quando você começa? Dia e hora." (seletor) | Sábado, 22h: deito, chegue quando chegar |
| 8 | Avaliar depois | (aparece no check-in) "Como foi? O que você ajustaria?" | Domingo de manhã: dormi melhor? o que ajustar? |

- Fim: card "Seu plano" com o problema, a ideia escolhida, o plano B e a data. Botão **"Salvar e colocar no painel"**. O passo 8 vira uma pergunta automática no check-in seguinte.

---

## C9. Cuidar do dinheiro da casa

**Onde aparece:** módulo 6, exercício 3 (para todos; para quem marcou apostas, aparece primeiro e com o bloco extra).
**Formato:** lista de medidas em cards recolhíveis. A pessoa escolhe 1 para esta semana.

- Título: **Cuidar do dinheiro da casa**
- [DINHEIRO_INTRO] "Proteger o dinheiro da casa é cuidado, não desconfiança. Escolha uma medida para esta semana."
- [DINHEIRO_MEDIDAS] (cada card: título + como fazer + botão "Escolher esta"):
  1. **Separar o seu dinheiro.** "Tenha uma conta só sua para receber e pagar o que é seu. Muitos bancos digitais abrem conta pelo celular, sem custo."
  2. **Rever os cartões compartilhados.** "Diminua limites, tire cartões adicionais ou troque senhas que outras pessoas conhecem. Faça isso pelo app do banco."
  3. **Pagar primeiro o essencial.** "Quando o dinheiro entrar, pague antes aluguel, luz, água e comida. O resto vem depois."
  4. **Anotar o que está pendente.** "Coloque no papel as contas e dívidas da casa, com valor e vencimento. Ver tudo junto ajuda a decidir."
  5. **Não emprestar para cobrir perdas.** "Emprestar para cobrir o que foi gasto com o uso ou com apostas costuma alimentar o ciclo. Se for preciso decidir sobre uma dívida grande, use os 8 passos ou fale com um profissional."
  6. **Buscar orientação gratuita.** "O Procon e a Defensoria Pública da sua cidade ajudam a entender e a renegociar dívidas, de graça." [Botão: "Ver serviços perto de mim"]
- Bloco extra para apostas: a autoexclusão (texto do módulo 6) com o botão "Ver como funciona a autoexclusão" (abre a página oficial do gov.br).
- Confirmação: "Medida escolhida. Ela fica no painel até você marcar como feita."

---

# Briefing M7: módulo 7, a sua vida e a sua rede

Pré-requisito: briefing 00 (padrões: hierarquia, clareza, ferramenta para toda tarefa, "Concluído em DD/MM", ver/editar/refazer, botões de treino). Se a parte 2 já foi colada, este briefing substitui o que ela diz sobre este módulo. Textos: ferramentas pelo Gemini, revisão do Claude; cards escritos pelo Claude.

## 1. Cards do exercício (substituem os atuais)
**Card 1: Como está a sua vida agora**
Instrução: "Dê notas de novo para as 8 áreas da sua vida e veja, lado a lado, as notas de agora e as do módulo 1."
Botão: **"Dar notas de novo e comparar"**
Concluído: ao terminar. Depois: "Ver a comparação" · "Fazer de novo"

**Card 2: A sua meta desta semana**
Instrução: "Crie a meta desta semana para a área da sua vida que mais precisa de cuidado agora."
Botão: **"Criar minha meta"** (abre a meta já com a área de nota mais baixa da escala nova)
Concluído: ao salvar. Depois: "Ver e editar minha meta"

**Card 3: Não carregar tudo sem ajuda**
Instrução: "Mande uma mensagem para alguém de confiança ou conheça um grupo de apoio para familiares. Um passo só já ajuda."
Botão: **"Escolher meu apoio"**
Concluído: ao tocar em "Contar que mandei" ou "Contar que fui". Depois: "Ver meu apoio" · "Dar outro passo"

A ferramenta de escala e meta é a do módulo 1 (briefing M1), no modo "refazer e comparar".

## 2. Ferramentas
## C10. A sua rede de apoio

**Onde aparece:** módulo 7, exercício 3. Fica em "Ferramentas" no painel.
**Por que existe:** quem cuida costuma se isolar por vergonha. Ter uma ou duas pessoas de confiança e conhecer um grupo de familiares alivia o peso e ajuda a pensar.

### Tela 1: alguém de confiança
- Título: **Quem pode estar com você**
- [REDE_INTRO] "Dividir o peso com alguém de confiança alivia e ajuda a pensar com mais clareza. Não precisa contar tudo."
- [REDE_QUEM] campo (até 2 nomes ou apelidos, só você vê) · dica: "Alguém que escuta sem julgar: da família, uma amizade antiga, alguém que já passou por algo parecido."
- [REDE_MENSAGENS] "Uma mensagem para começar" · 4 cards com botão **"Copiar mensagem"** (copia para a área de transferência; a Margem não envia nada):
  - "Oi! Lembrei de você. Quando der, me chama pra gente conversar um pouco?"
  - "As coisas estão pesadas por aqui. Topa um café ou uma ligação esta semana?"
  - "Tô precisando desabafar um pouco. Você tem um tempinho nos próximos dias?"
  - "Bateu saudade. Vamos marcar alguma coisa? Ia me fazer bem."
- Botão "Contar que mandei" → status "Concluído em DD/MM", com "Ver minhas mensagens" e "Mandar outra".

### Tela 2: um grupo para familiares
- [REDE_GRUPOS_INTRO] "Existem grupos de familiares que passam pelo mesmo. Na primeira vez, você pode só ouvir e ver como é."
- Cards (mostrar primeiro os do problema marcado), cada um com 1 linha e o botão **"Ver reuniões"** (abre o site oficial do grupo em nova aba):
  - **Al-Anon:** para familiares e amigos de quem bebe. Reuniões presenciais e on-line.
  - **Nar-Anon:** para familiares e amigos de quem usa outras drogas.
  - **Amor-Exigente:** grupos de apoio para famílias, em muitas cidades.
  - **CAPS AD:** serviço do SUS que também acolhe familiares. [Botão: "Ver serviços perto de mim"]
  - **CRAS:** orienta sobre direitos e serviços na sua cidade. [Botão: "Ver serviços perto de mim"]
  - Apostas: **Meu SUS Digital** (atendimento on-line gratuito em saúde mental para quem tem problema com apostas e para familiares) e **Jogadores Anônimos** (para a pessoa que aposta).
- [PENDÊNCIA DO FUNDADOR: confirmar os links oficiais de cada grupo antes de publicar]

---

---

# Briefing M8: módulo 8, depois da resposta, e check-in semanal

Pré-requisito: briefing 00 (padrões: hierarquia, clareza, ferramenta para toda tarefa, "Concluído em DD/MM", ver/editar/refazer, botões de treino). Se a parte 2 já foi colada, este briefing substitui o que ela diz sobre este módulo. Textos: ferramentas pelo Gemini, revisão do Claude; cards escritos pelo Claude.

## 1. Cards do exercício (substituem os atuais)
**Versão: {{apelido}} aceitou ajuda ou já está em tratamento**
- Card 1: **Valorizar sem vigiar** · "Planeje 2 jeitos de valorizar os momentos bons de {{apelido}} nesta semana, sem perguntar do tratamento." · Botão: **"Planejar como valorizar"**
- Card 2: **A sua meta desta semana** · "Volte a cuidar de você: crie uma meta para a área da sua vida que mais precisa de cuidado." · Botão: **"Criar minha meta"**

**Versão: {{apelido}} disse não, por enquanto**
- Card 1: **Preparar um novo convite** · "Reveja a sua frase, treine de novo e espere a próxima hora certa." · Botões: **"Rever meu convite"** · "Treinar o convite"
- Card 2: **Ou dar um tempo no assunto** · "Escolha uma data para pensar de novo no convite. Até lá, o foco é você." · Botão: **"Escolher a data"** (padrão: 4 semanas; aviso por e-mail discreto)
- A pessoa faz um dos dois. Fazer um marca o outro como "Não se aplica".

**Versão: {{apelido}} voltou a usar depois de ter parado ou diminuído**
- Card 1: **Uma frase para a próxima conversa** · "Escolha ou escreva uma frase curta, sem acusar, para quando surgir um momento calmo com {{apelido}}." · Botão: **"Escolher minha frase"**
- Card 2: **Retomar o apoio** · "Procure de novo o profissional ou o serviço que ajudou {{apelido}} antes, e também apoio para você." · Botão: **"Ver o profissional ou serviço de antes"** (se não houver, "Ver psicólogo parceiro")

Todos os cards: concluído e ações do briefing 00.

## 2. Ferramentas
## C12. Módulo 8 e encerramento: o que é interativo

- **Seletor no topo** (pré-marcado pela tela 8 do check-in, editável): as 3 versões.
- **Versão "aceitou":** botão "Planejar" abre C4 (valorizar); botão "Escolher minha meta" abre C1.
- **Versão "disse não":** escolha entre "Preparar um novo convite" (abre C6 com o que já foi salvo, para revisar) e "Dar um tempo no assunto" (seletor de data, padrão 4 semanas, com aviso por e-mail discreto).
- **Versão "voltou a usar":** "Escolher minha frase" abre "Minhas frases" (C3) com a opção de escrever uma nova; "Ver psicólogo parceiro" leva primeiro ao profissional que a pessoa já tinha salvo ou agendado.
- **Encerramento** (depois do exercício):
  - [FIM_TITULO] **Oito semanas depois**
  - [FIM_TEXTO] "Você chegou ao fim das 8 semanas. Talvez muita coisa tenha mudado, talvez pouca. De qualquer jeito, você aprendeu a olhar para tudo isso de outro lugar, e a se incluir nessa história. Mudança raramente anda em linha reta, e nada aqui é garantido. Mas cada conversa sem briga e cada cuidado com você deixaram uma porta aberta."
  - Resumo visual curto: notas da escala (módulo 1 → módulo 7, se houver), número de anotações no diário, frases salvas.
  - Botões: "Voltar ao painel" · "Ver psicólogo parceiro" · "Baixar o resumo para o profissional" (só se o familiar quiser).


## C11. Check-in da semana

**Quando:** a cada 7 dias depois da compra (e no dia do novo módulo), por e-mail discreto ("Seu check-in da semana na Margem") e card no topo do painel. Leva cerca de 2 minutos. Um bloco por tela, no padrão do diagnóstico. Todas as perguntas, exceto segurança, podem ser puladas.
- [CHECKIN_INTRO] "Dois minutos para olhar a sua semana. Isso ajuda o programa a acompanhar você."

**Ordem das telas**
1. **Segurança** (sempre, não pode pular; item 14.6): agressão nesta semana · medo de que {{apelido}} machuque alguém · {{apelido}} falou em se machucar · ameaças ou objetos quebrados. Recalcula os estados.
2. **A sua semana** [CHECKIN_SEMANA] "Como foi a sua semana?" · Mais leve · Com altos e baixos · Pesada · Muito difícil · Prefiro não dizer
3. **Bem-estar** (a cada 2 semanas): PHQ-4 com o texto oficial (item 16).
4. **A sua meta** (C1): fiz / fiz em parte / não deu → próxima meta.
5. **O exercício do módulo** (o que estiver ativo: valorizar, devolver, 8 passos, convite...), com a pergunta de cada ferramenta.
6. **Conversa** [CHECKIN_CONVERSA] "Você conversou com {{apelido}} usando algo do programa?" · Sim, e foi tranquilo · Tentei, e esquentou · Preferi só ouvir · Ainda não deu
   - "Tentei, e esquentou" → "Faz parte. No módulo 3, a parte 'Quando o clima esquenta' ajuda." (link) e, se houver medo, o plano de segurança.
7. **Abertura** [CHECKIN_ABERTURA] "{{apelido}} mostrou alguma abertura para buscar ajuda?" · Sim, perguntou ou topou conversar · Talvez, sem fechar a porta · Não, por enquanto
   - "Sim" → card de janela (`CARD_JANELA`); se o módulo 3 já foi concluído, libera o módulo 5.
8. **Situação agora** (só a partir da semana 6, para escolher a versão do módulo 8): {{apelido}} aceitou ajuda ou está em tratamento · Disse não, por enquanto · Voltou a usar depois de ter parado ou diminuído · Nada mudou
- [CHECKIN_FIM] "Que bom que você tirou esse tempo para você. Cada semana conta."

---

---

# Briefing M8b: check-in semanal, PHQ-4 e as pendências que sobraram

Pré-requisito: briefing 00. Este briefing fecha o que ficou de fora do M7 e do M8.

**Decisão do fundador:** o check-in sai do "depois". Ele é construído agora, **dentro do app, sem e-mail nenhum**. O PHQ-4 entra, com aviso explícito de que não é diagnóstico. A validação clínica virá de um psiquiatra, depois.

Por que não dá para adiar: o check-in é onde o programa descobre que algo deu errado em casa. A resposta "ficou tenso", da ferramenta de adiar do módulo 4, é o que liga o `caution_mode`. Enquanto o check-in não existe, `caution_mode` fica `false` para sempre e todas as perguntas de check-in já especificadas nos módulos 4, 5 e 6 não levam a lugar nenhum.

## 1. Onde o check-in aparece

Card no topo do painel, acima de tudo, quando houver um pendente:
- Título: **Seu check-in da semana**
- Apoio: "2 minutos"
- Botão: **"Fazer meu check-in"**

Fica pendente a cada 7 dias desde o último respondido, contados a partir do dia em que a pessoa começou o programa. Nunca aparece em vermelho e nunca diz "atrasado" (briefing 00, item 4). Sem e-mail, sem notificação: o card é o lembrete.

Rota: `/familia/programa/checkin`.

## 2. As telas, em ordem

Uma pergunta por tela, com barra "Passo X de 5".

**Tela 1: a sua meta**
Mostra o que já está salvo, sem perguntar nada: "Nesta semana você marcou {{feitos}} de {{planejados}} dias da sua meta." Botão "Continuar".
Com 0 dias marcados: "Nesta semana você não marcou nenhum dia da sua meta, e isso acontece. A semana nova começa agora."

**Tela 2: as ferramentas que a pessoa usou**
Só aparecem as perguntas das ferramentas que ela realmente abriu. Os textos já estão nos briefings dos módulos:
- Valorizar (M4): "Você conseguiu valorizar um momento bom nesta semana?" e, se sim, "Como {{apelido}} reagiu?"
- Adiar (M4): "Precisou adiar algum programa nesta semana?" · Não precisou · Sim, e foi tranquilo · **Sim, e ficou tenso**
- Convite (M5): "Você chegou a fazer o convite?" e, se sim, qual foi a resposta. Esta resposta é a que pré-marca o seletor do módulo 8.
- Problema em andamento (M6) e cuidado com o dinheiro (M6): as perguntas dos respectivos briefings.

Nenhuma é obrigatória. "Pular esta pergunta" sempre disponível.

**Tela 3: como você está**
Esta é a tela do PHQ-4. Especificação completa no item 3.

**Tela 4: segurança**
Pergunta própria, sempre, depois do PHQ-4. Especificação no item 4.

**Tela 5: devolutiva**
O que o programa diz de volta. Item 5.

## 3. PHQ-4

São 4 perguntas sobre as duas últimas semanas, 4 opções cada.

**Texto de abertura da tela, obrigatório e visível antes da primeira pergunta:**

> **Como você está**
> Estas 4 perguntas são as mesmas que muitos serviços de saúde usam para entender como alguém está se sentindo. Elas não dão diagnóstico, e o que você responder aqui não diz que você tem ou não tem alguma coisa. Servem para o programa saber como falar com você nesta semana, e para você acompanhar como está se sentindo ao longo do tempo. Quem pode dizer o que está acontecendo é um profissional, numa conversa.

**Enunciado:** "Nas últimas 2 semanas, com que frequência você se sentiu incomodado por:"

1. Sentir-se nervoso, ansioso ou tenso
2. Não conseguir parar ou controlar as preocupações
3. Sentir-se para baixo, deprimido ou sem esperança
4. Ter pouco interesse ou prazer em fazer as coisas

**Opções, iguais nas quatro:** Nenhuma vez (0) · Vários dias (1) · Mais da metade dos dias (2) · Quase todos os dias (3)

**O que o produto NUNCA mostra:** o número do escore, a palavra "leve", "moderado" ou "grave", e qualquer rótulo como "ansiedade" ou "depressão". O escore existe só por dentro, para escolher a devolutiva.

**Faixas, por dentro** (escore total de 0 a 12):
- 0 a 2: devolutiva comum.
- 3 a 5: devolutiva comum, mais uma linha sobre cuidar de si e o atalho para o módulo 7.
- 6 a 8: sugerir conversa com profissional, com o carrossel (briefing M56) logo abaixo.
- 9 a 12: a mesma sugestão, em tom mais direto, com o carrossel e com a indicação do CAPS e da UBS pelo SUS.

Guardar as 4 respostas e a data, sempre. Isso permite mostrar no futuro como a pessoa foi ao longo das semanas, em palavras, nunca em gráfico de pontuação.

## 4. A pergunta de segurança é separada, e isso é importante

O PHQ-4 **não tem pergunta sobre suicídio**. Ele é a versão curta, com 2 itens de ansiedade e 2 de humor, e o item de risco só existe na versão longa. Quem conta com ele para detectar risco fica sem detectar.

Por isso, uma pergunta própria, sempre, depois do PHQ-4 e independente do escore:

> "Nesta semana, você teve pensamentos de se machucar ou de não querer mais viver?"
> · Não · Sim, e passaram rápido · Sim, e voltaram várias vezes

- **Não:** segue para a devolutiva.
- **Qualquer "Sim":** o fluxo para aqui. Nada de mais perguntas, nada de devolutiva comum. A tela passa a ser a de acolhimento com o CVV 188 e o caminho do plano de segurança, com o mesmo texto que o programa já usa no `ALERTA_AUTOLESAO`. Liga `self_harm_alert`. "Sim, e voltaram várias vezes" liga também `self_harm_history`.

O check-in conta como respondido mesmo quando para aqui. A pessoa não precisa responder de novo depois.

## 5. A devolutiva, e o `caution_mode`

A devolutiva junta, em 3 frases no máximo: o que ela fez na semana, uma coisa que valeu, e o que vem no módulo da semana que vem. Sem nota, sem porcentagem, sem comparação com outras pessoas.

**"Sim, e ficou tenso", na pergunta de adiar, tem prioridade sobre o resto da devolutiva.** Mostra: "Que bom que você contou. Se o clima ficou tenso, deixe essa parte de lado por enquanto e veja o seu plano de segurança." com o link, e liga o `caution_mode`.

O que o `caution_mode` muda já está escrito nos briefings M4 e M5: a ferramenta de adiar não aparece, o card 3 do módulo 4 é trocado, e o cenário do convite fica bloqueado.

## 6. O "dar um tempo" não precisa de e-mail

O M8 previa um e-mail na data combinada. Troque por um card no painel, que aparece no dia:
- Título: **Hoje é a data que você combinou**
- Texto: "Você marcou hoje para ver como estão as coisas depois do tempo que vocês combinaram."
- Botão: **"Ver o que eu anotei"**

Mesma coisa para o plano B do módulo 5, que também estava esperando e-mail.

## 7. O que continua fora, de propósito

- **E-mail semanal e qualquer notificação.** O projeto não tem serviço de e-mail configurado, e o card no painel resolve.
- **"Baixar o resumo para o profissional".** O resumo do programa inteiro ainda não existe. O botão não aparece.

## 8. Os links dos grupos

Confirmados como oficiais:
- Al-Anon: `https://al-anon.org.br`
- Nar-Anon: `https://www.naranon.org.br`
- Meu SUS Digital: `https://meususdigital.saude.gov.br`
- Amor-Exigente: `https://amorexigente.org`

**Jogadores Anônimos sai da lista de grupos para familiares.** JA é a irmandade de quem aposta, não da família. Mandar um familiar para lá é mandar a pessoa para a sala errada. A irmandade de familiares é a Gam-Anon, e não foi possível confirmar grupos dela no Brasil.

No lugar, para apostas, o texto passa a ser:
> "Para famílias de quem aposta ainda não existe um grupo com encontros em todo o país. O Amor-Exigente recebe famílias de qualquer compulsão, inclusive apostas, e o CAPS da sua cidade atende de graça. Se quem aposta quiser um grupo, Jogadores Anônimos é o caminho, e é para a pessoa que aposta, não para você."

O link de JA pode ficar nessa frase, marcado como para a pessoa que aposta.

## 9. Critério de aceite

- O card do check-in aparece no painel a cada 7 dias e some ao ser respondido.
- Só aparecem as perguntas das ferramentas que a pessoa abriu.
- A tela do PHQ-4 mostra o aviso de que não é diagnóstico antes da primeira pergunta.
- Em nenhum lugar da tela aparece número de escore, "leve", "moderado", "grave", "ansiedade" ou "depressão".
- A pergunta de segurança aparece sempre, independente do escore do PHQ-4.
- Qualquer "Sim" na pergunta de segurança interrompe o fluxo, mostra o CVV e liga `self_harm_alert`.
- "Sim, e ficou tenso" liga o `caution_mode`, e a ferramenta de adiar some na semana seguinte.
- Nenhuma tela do check-in manda e-mail nem pede permissão de notificação.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
