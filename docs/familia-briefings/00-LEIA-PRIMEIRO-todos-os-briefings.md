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

---

# Briefing L1: os 8 módulos, com descrição, na LP e no painel

Pré-requisito: nenhum. Não substitui nenhum briefing. Mexe na LP (`/familia`), no painel (`/familia/programa`), nos 8 arquivos de módulo e em `lib/familia/conteudo.ts`.

## O problema

Na LP, a pessoa vê os 5 eixos em "O que você vai aprender" e, logo depois, o preço (`app/familia/page.tsx`, linhas 291 a 321). Em nenhum momento ela vê o que tem em cada uma das 8 semanas antes de decidir pagar.

No painel, a lista "Os 8 módulos" mostra só o rótulo "Módulo N" e o título (`app/familia/programa/PainelCliente.tsx`, linhas 326 a 328). Quem já comprou não sabe o que vem em cada semana, e títulos como "O convite" e "Depois da resposta" não dizem muita coisa para quem ainda não abriu o módulo.

A descrição precisa ser uma só para os dois lugares, guardada junto do módulo, para não ficar um texto na LP e outro no painel.

## O que fazer

### 1. Uma descrição por módulo, no frontmatter

Em cada `content/familia/modulos/modulo-0N.md`, acrescente a linha `descricao` logo abaixo de `titulo`. O texto usa `{{apelido}}` onde cabe: no painel entra o apelido; na LP, sem apelido, `aplicarApelido` troca por "quem você ama". Os textos abaixo já foram conferidos nos dois jeitos.

Não use `#` nem aspas duplas dentro do texto: o leitor do frontmatter (`lib/familia/markdown.ts`, linha 97) corta tudo depois de `#`.

| Arquivo | Linha a acrescentar |
|---|---|
| `modulo-01.md` | `descricao: "Entender por que é tão difícil parar, o que não é culpa sua e o que costuma piorar as coisas em casa."` |
| `modulo-02.md` | `descricao: "Anotar por 7 dias os momentos difíceis e os bons com {{apelido}} e descobrir o que costuma vir antes do uso."` |
| `modulo-03.md` | `descricao: "Trocar as frases que viram briga por outras mais curtas e calmas, e treinar o que dizer quando {{apelido}} nega o problema."` |
| `modulo-04.md` | `descricao: "Descobrir do que {{apelido}} gosta e planejar jeitos simples de valorizar os dias sem uso, com elogios sinceros e sem ironia."` |
| `modulo-05.md` | `descricao: "Deixar um profissional e um horário prontos antes de convidar {{apelido}} para buscar ajuda, e saber o que fazer com cada resposta."` |
| `modulo-06.md` | `descricao: "Parar de cobrir o que é responsabilidade de {{apelido}}, como desculpas no trabalho e dívidas, e proteger o dinheiro da casa, sempre com segurança."` |
| `modulo-07.md` | `descricao: "Dar notas de novo para a sua vida, comparar com as notas do módulo 1 e encontrar pessoas e grupos que acolhem familiares."` |
| `modulo-08.md` | `descricao: "Depois do convite para buscar ajuda, apoiar sem vigiar se vier um sim, tentar outra vez se vier um não e manter a calma se o uso voltar."` |

Como fica na LP, sem apelido (só para conferir, não é texto a mais):
- Módulo 2: "...os momentos difíceis e os bons com quem você ama e descobrir..."
- Módulo 3: "...treinar o que dizer quando quem você ama nega o problema."
- Módulo 4: "Descobrir do que a pessoa gosta e planejar..." (depois de "que", `aplicarApelido` usa "a pessoa", `lib/familia/diagnostico.ts`, linha 236)
- Módulo 5: "...antes de convidar quem você ama para buscar ajuda..."
- Módulo 6: "Parar de cobrir o que é responsabilidade de quem você ama..."

Os títulos dos módulos não mudam.

### 2. LP: nova seção "Os 8 módulos", antes do preço

Entra entre o bloco "Sem julgamento / Sua privacidade" e o banner de oferta, ou seja, logo antes de `<OfertaPrograma variante="lp" />`. Mesmo componente e mesmo estilo dos cards de "O que você vai aprender" (`CardsLp` dentro de `.familia-lp-grade-eixos`), com uma diferença: em cima do título de cada card vai o rótulo "Módulo N", igual ao do painel.

- Título da seção: **"Os 8 módulos"** (com `home-secao-titulo`, como os outros títulos da LP). Use o número de módulos publicados, para o título nunca prometer módulo que não está lá.
- Linha de apoio, logo abaixo do título: **"Um módulo por semana, com uma leitura curta e exercícios para encaixar no dia a dia."**
- Cada card: rótulo "Módulo N", título do módulo e a descrição do item 1.
- Grade: 1 coluna no celular, 4 colunas no desktop (duas fileiras de 4).

### 3. Painel: a descrição embaixo do título de cada módulo

Na lista "Os 8 módulos", cada item passa a ter, nesta ordem: rótulo "Módulo N", título, descrição (com o apelido da pessoa), e o status que já existe ("Concluído em DD/MM", "Em andamento", "Chega em DD/MM" ou o cadeado).

A descrição aparece em todos os estados, inclusive no módulo com cadeado e no guardado pelo modo de segurança, porque saber o que vem não libera nada.

O card "Esta semana" não muda.

## Código

**`lib/familia/conteudo.ts`**
- No tipo `Modulo` (linha 12), acrescente `descricao: string | null`.
- Em `lerModulo` (linha 59), acrescente `descricao: texto(dados.descricao),`.
- Crie, ao lado de `titulosDosModulosPagos` (linha 74), a função `resumosDosModulos()`: lê os 8, filtra os publicados e devolve `Array<{ numero: number; titulo: string; descricao: string }>`, só com os que têm descrição.

**`app/familia/page.tsx`**
- `FamiliaPage` vira `async` e chama `await resumosDosModulos()`. A página continua estática: o conteúdo é lido no build, como no painel.
- Importe `aplicarApelido` de `@/lib/familia/diagnostico`.
- Entre a `</section>` da linha 316 e o comentário da linha 318, acrescente:

```tsx
{modulos.length > 0 && (
  <section className="familia-lp-secao">
    <div className="familia-lp-modulos-cabecalho">
      <h2 className="home-secao-titulo">{`Os ${modulos.length} módulos`}</h2>
      <p className="text-medium-regular">Um módulo por semana, com uma leitura curta e exercícios para encaixar no dia a dia.</p>
    </div>
    <div className="familia-lp-grade familia-lp-grade-4 familia-lp-grade-eixos">
      {modulos.map((modulo) => (
        <CardsLp
          key={modulo.numero}
          icone={<span className="label-small-medium familia-texto-suave">Módulo {modulo.numero}</span>}
          titulo={modulo.titulo}
          texto={aplicarApelido(modulo.descricao, undefined)}
        />
      ))}
    </div>
  </section>
)}
```

- Em `app/familia-lp.css`, crie `.familia-lp-modulos-cabecalho` com `display: flex; flex-direction: column; gap: var(--spacing-8);`, para a linha de apoio ficar colada no título e não com o espaço de 24 da seção. `familia-lp-grade-4` e `familia-lp-grade-eixos` já existem (linhas 95 a 104 e 137 a 139) e não precisam mudar.
- Confira que `familia-texto-suave` (de `app/familia.css`) carrega na LP. Se não carregar, use no rótulo a mesma cor e o mesmo tamanho dela: 14px, medium, cor secundária (briefing 00, item 1).

**`app/familia/programa/page.tsx`**
- No `.map` das linhas 30 a 35, acrescente `descricao: modulo.descricao,`.

**`app/familia/programa/PainelCliente.tsx`**
- No tipo `ModuloDoPainel` (linha 40), acrescente `descricao: string | null`.
- Logo depois do título (linha 328), acrescente:

```tsx
{modulo.descricao && <span className="text-medium-regular familia-texto-suave">{aplicarApelido(modulo.descricao, apelido)}</span>}
```

`aplicarApelido` já está importado (linha 12). O `.painel-modulo` já é flex em coluna, então a descrição fica numa linha própria, sem CSS novo.

## Critério de aceite

- Na LP, a seção "Os 8 módulos" aparece logo antes de "Quanto custa", com os 8 cards no mesmo estilo de "O que você vai aprender", mais o rótulo "Módulo N" em cima do título.
- No desktop, 2 fileiras de 4 cards; no celular, 1 coluna.
- Na LP, nenhuma descrição mostra `{{apelido}}`: onde ele estava, aparece "quem você ama" (ou "a pessoa", depois de "que"), com a preposição certa.
- No painel, cada módulo mostra a descrição com o apelido da pessoa, em todos os estados (aberto, em andamento, concluído, "Chega em", cadeado e guardado).
- O texto vem só do frontmatter de cada módulo. Não existe cópia da descrição em `page.tsx` nem em `PainelCliente.tsx`.
- Módulo sem `descricao` no frontmatter não quebra: na LP ele não aparece na seção, e no painel aparece só com o título.
- A página `/familia` continua sendo gerada no build (estática).
- Sem travessão, sem gênero marcado na pessoa que lê, sem palavra proibida.

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

---

# Briefing N5: a trilha "O que é seu" e o bloco que abre o resultado

Pré-requisito: briefings 00, N1, N2, N3 e N4 aplicados. Substitui a proposta 2.1 de `claude/programa-familia-melhorias-conteudo.md`, que fica como histórico.

**Como executar.** Duas partes, com modelos diferentes, na ordem abaixo.

| Parte | O que é | Modelo | Esforço |
|---|---|---|---|
| **1** | Os 8 blocos de módulo. Markdown puro, nenhuma linha de código. | Sonnet 5.5 | médio |
| **2** | O bloco que abre a página de resultado. Decide estado, ordem de tela e o que aparece em modo segurança. | Opus 5 | alto |

Todo o texto de tela já está escrito aqui. Não reescreva, não complete, não invente microcopy. Nada passou pelo Gemini.

---

## O problema

Das 8 semanas, 6 são sobre {{apelido}} e 2 têm o familiar como assunto. O título da LP promete as duas coisas ("Você não precisa escolher entre ajudar quem você ama e cuidar de você") e o conteúdo entrega uma. Quem compra na segunda recebe explicação e tarefa de observação, e o benefício próprio chega na semana 7.

Além disso, três coisas que só aparecem lendo o código:

**1. O PHQ-4 não é coletado no diagnóstico.** Ele existe só no check-in semanal, que acontece dentro do programa, depois da compra (`docs/familia-briefings/M8b-checkin-semanal.md`, item 3). No diagnóstico o que existe é uma pergunta única, a Q11 `esgotamento`, de 0 a 3 (`lib/familia/diagnostico.ts:173`), e ela serve só para escolher entre dois textos de "Um passo para você" (`lib/familia/resultado.ts:103` e `:133`). Então o bloco novo deste briefing é construído sobre a Q11, que é o dado que existe naquele ponto. Levar o PHQ-4 para o diagnóstico é outra decisão, de outro briefing, e tem custo: são 4 perguntas a mais antes do resultado, em texto de nível 1. O bloco abaixo não depende dessa decisão.

**2. O `caution_mode` nunca liga.** `lib/familia/markdown.ts:38` diz com todas as letras que não existe regra que ligue o modo, então `cautela` vale sempre "nao". Só que o texto de cautela já está escrito e já está no repositório, em quatro lugares: `modulo-03.md:109`, `modulo-04.md:69` e `:73`, `modulo-05.md:22` e `:95`, `modulo-06.md:82` e `:86`. Hoje é texto morto. Este briefing liga o modo, e o item 3 abaixo diz exatamente o que passa a aparecer.

**3. Em modo segurança, a página de resultado manda a pessoa retomar um hobby.** `umPasso` é escolhido só pela Q11 (`lib/familia/resultado.ts:133`), sem olhar o modo. Quem respondeu "tenho esse medo hoje" recebe, logo abaixo do cartão de segurança, "Retome nesta semana algo que você gostava de fazer e deixou de lado". O item 2 abaixo corrige isso.

---

## 1. Os 8 blocos de módulo

Cada módulo passa a ter um bloco fixo chamado **"O que é seu"**, com uma ação de dois minutos e um botão. Markdown comum: título `##`, parágrafos e uma linha `@botao`. O leitor de `lib/familia/markdown.ts` já entende tudo isso, e nenhum componente novo é necessário.

**Onde entra, em cada arquivo de `content/familia/modulos/`:**

| Arquivo | Entra logo antes de | Linha de referência hoje |
|---|---|---|
| `modulo-01.md` | `## Exercício da semana` | 95 |
| `modulo-02.md` | `## Exercício da semana: o diário de 7 dias` | 52 |
| `modulo-03.md` | `## Exercício da semana` | 96 |
| `modulo-04.md` | `## Exercício da semana` | 59 |
| `modulo-05.md` | `## Exercício da semana` | 99 |
| `modulo-06.md` | `## Exercício da semana` | 80 |
| `modulo-07.md` | `## Exercício da semana` | 61 |
| `modulo-08.md` | `## Oito semanas depois` | 122 |

**Duas regras de posição, e elas não são detalhe.**

O bloco vai **sempre depois do último título de conteúdo e antes do exercício**, nunca no topo. O motivo está em `app/familia/programa/modulo/[n]/ModuloCliente.tsx:328`: a tela do módulo bloqueado monta "O que você vai ver nesta semana" com os **dois primeiros títulos `##` de primeiro nível** do arquivo. Subir o bloco troca a vitrine do módulo pago sem ninguém pedir.

No módulo 8 ele fica entre o último `:::exercicio` e `## Oito semanas depois`, porque ali o encerramento é a última palavra da tela e continua sendo.

### Módulo 1

```
## O que é seu

Faz tempo que a pergunta da casa é sobre {{apelido}}: como chegou, de que humor, se dormiu. Quase ninguém pergunta como você andou na semana.

Essa conta existe e tem nome. O sono que encurtou, as contas da casa que passaram a ser só sua responsabilidade, as amizades que foram ficando para depois.

Nesta semana, antes de olhar para o padrão de {{apelido}}, olhe para o seu. Dê uma nota honesta para cada área da sua vida, inclusive as que você prefere não encarar.

Dois minutos, e a nota não precisa ser bonita. Ela serve para você ter de onde sair, não para provar nada a ninguém.

@botao [Dar uma nota para as 8 áreas da sua vida](/familia/programa/escala)
```

### Módulo 2

```
## O que é seu

Durante sete dias você vai anotar o que {{apelido}} fez, o que veio antes e como você reagiu. Repare onde você aparece nessas anotações: quase só na linha da sua reação.

Isso não é falha do diário. É o retrato de como a casa foi ficando, com uma pessoa no centro e as outras em volta, reagindo.

Hoje, dois minutos para reler o que você escreveu. Em vez de procurar o padrão de {{apelido}}, procure o seu: a que horas você fica em alerta, o que você já nem conta para ninguém.

Enxergar isso não tira nada de {{apelido}}. Só devolve você para dentro da história.

@botao [Ver as suas anotações](/familia/programa/diario/anotacoes)
```

### Módulo 3

```
## O que é seu

Falar diferente cansa. Nas primeiras vezes você vai sair da conversa com o coração batendo e com a sensação de ter engolido metade do que queria dizer.

Essa metade não desaparece. Ela fica em você, e costuma voltar à noite, quando a casa silencia.

Então combine uma coisa com você: depois de cada conversa difícil, dois minutos para descarregar. Pode ser anotar aqui o que você não disse, uma volta no quarteirão, ou ligar para alguém e falar de qualquer outro assunto.

Guardar a frase certa é com {{apelido}}. O que você guardou é com você.

@botao [Anotar um momento difícil](/familia/programa/diario)
```

### Módulo 4

```
## O que é seu

Esta semana pede que você repare no que vai bem com {{apelido}} e diga isso em voz alta. Vale reparar também que ninguém tem feito isso com você.

Quem passa meses no modo de resolver problema perde o costume de notar o que presta no próprio dia. Não é falta de vontade: é o que o cansaço faz com a atenção.

Então, junto com o momento bom de {{apelido}}, anote um que foi seu. Um café que deu tempo de tomar com calma, uma música no caminho, cinco minutos de silêncio.

Dois minutos, uma linha. Casa que só registra o que deu errado vai ficando sem memória de coisa boa.

@botao [Anotar um momento bom](/familia/programa/diario)
```

### Módulo 5

```
## O que é seu

Convidar expõe. Você vai estender a mão sabendo que ela pode ser recusada, e isso mexe com qualquer pessoa.

O que costuma derrubar não é o não em si. É receber o não sem ter para onde ir depois, e passar a noite remoendo a conversa.

Antes de convidar, decida uma coisa só: quem você vai procurar no dia em que a resposta vier, qualquer que ela seja. Uma pessoa, um grupo, um lugar para ir.

Dois minutos para escolher esse nome agora, com a cabeça fria. Um não não te deixa sem chão quando você já combinou onde pisar.

@botao [Escolher quem você pode procurar](/familia/programa/rede)
```

### Módulo 6

```
## O que é seu

Parar de resolver pela outra pessoa libera tempo e dinheiro, e quase ninguém se prepara para isso.

Nas primeiras semanas esse espaço vazio costuma incomodar mais do que a tarefa que você deixou de fazer. Resolver também era um jeito de sentir que você estava fazendo algo.

Por isso, escolha agora para onde esse espaço vai. Não precisa ser grande: dormir no seu horário, um banho sem pressa, uma série que é sua.

Dois minutos para virar isso numa meta pequena desta semana, com dia e hora. Espaço que fica vazio volta a ser ocupado pelo problema.

@botao [Criar a sua meta desta semana](/familia/programa/escala?etapa=meta)
```

### Módulo 7

```
## O que é seu

Este módulo inteiro é seu, e é o mais difícil de começar. Olhar para a própria vida depois de seis semanas olhando para {{apelido}} costuma doer mais do que as pessoas esperam.

A conta do que ficou de lado só aparece quando alguém para para ver: os planos adiados, o corpo, as pessoas que sumiram da sua semana sem briga nenhuma.

Dar as notas de novo serve para isso, e não para se comparar com o módulo 1. Algumas áreas vão ter subido, outras não, e as duas coisas são informação.

Dois minutos para a primeira nota. Depois siga, uma área por vez, sem arredondar para cima.

@botao [Dar notas de novo para as 8 áreas da sua vida](/familia/programa/escala)
```

### Módulo 8

```
## O que é seu

O programa acaba aqui, e a situação de {{apelido}} provavelmente continua em aberto. As duas coisas podem ser verdade ao mesmo tempo.

O que você aprendeu em oito semanas não fica com {{apelido}}, fica com você: o jeito de falar, o que você devolveu, as metas que você cumpriu em semanas difíceis.

O que sustenta isso depois não é força de vontade, é companhia. Quem segue com um grupo, um profissional ou uma pessoa de confiança por perto costuma manter o que construiu por muito mais tempo.

Dois minutos para escolher onde você vai continuar aparecendo depois desta semana. Um grupo de familiares, uma conversa marcada, um nome no celular.

@botao [Ver grupos para familiares](/redes-de-apoio)
```

### Sobre os botões, para ninguém "consertar" depois

Todos os oito destinos já existem. Nenhuma rota nova, nenhum parâmetro inventado:

| Módulo | Destino | Já usado em |
|---|---|---|
| 1 e 7 | `/familia/programa/escala` | painel e exercício dos módulos 1 e 7 |
| 2 | `/familia/programa/diario/anotacoes` | exercício do módulo 2 |
| 3 e 4 | `/familia/programa/diario` | exercícios dos módulos 1 e 2 |
| 5 | `/familia/programa/rede` | exercício do módulo 7 |
| 6 | `/familia/programa/escala?etapa=meta` | painel (`PainelCliente.tsx:306`) |
| 8 | `/redes-de-apoio` | módulos 5 e 7 |

Nos módulos 1 e 7 o botão leva à mesma ferramenta do primeiro card do exercício, e isso é de propósito: nesses dois módulos o bloco é a espinha, e o botão existe para que a pessoa abra a escala pelo motivo certo, que é ela mesma. Em nenhum outro módulo o botão repete a ferramenta da semana.

### Uma linha a mais no módulo 1

A lista "O que vem pela frente" (`modulo-01.md:72`) descreve o programa antigo. Acrescente uma linha ao fim do bloco `:::se seguranca=nao`, depois do item 7:

```
Em todas as oito semanas, uma parte do módulo é sobre você, e não sobre {{apelido}}.
```

No bloco `:::se seguranca=sim` (linha 86), acrescente a mesma linha depois do item 2.

---

## 2. O bloco que abre a página de resultado

**Parte de Opus 5, esforço alto.** É aqui que está a lógica.

### O que muda na tela

A página de resultado passa a ter, como primeira seção depois do topo verde, um bloco chamado **"O que isso está fazendo com você"**. A ordem nova fica assim:

1. Topo (h1 "Seu mapa da situação" e acolhimento), como é hoje
2. **"O que isso está fazendo com você"** (novo)
3. "O que joga a seu favor" e "Ponto de atenção"
4. "Sua primeira conversa", ou "Sua segurança vem primeiro" em modo segurança
5. Avisos
6. Banner de oferta ou "Começar o módulo 1"

**A seção "Um passo para você" deixa de existir como seção própria.** O texto dela (`ResultadoVisao.tsx:116`) passa para dentro do bloco novo, como último parágrafo, sob o rótulo **"O seu passo desta semana"**. Hoje ela aparece depois do roteiro da conversa, solta, e é a única parte da página que fala do familiar. Dentro do bloco novo ela fica no lugar certo, e a página deixa de ganhar uma seção: ela troca de lugar.

**Em modo segurança o passo não aparece.** O passo da pessoa, nesse caso, é o cartão de segurança que vem logo abaixo, e ele já diz o que fazer. É isso que corrige o furo 3 do começo deste briefing.

### Os três modos

```ts
// lib/familia/diagnostico.ts, ao lado de calcularSafetyMode (linha 198).

// Q8 "já aconteceu no passado" ou Q9 "sim, raramente": houve medo ou agressão, e não é hoje.
// Violência passada é o preditor mais forte de violência futura, então o programa fica mais
// cuidadoso, nunca menos. O check-in semanal (briefing M8b, item 5) soma a este valor quando a
// pessoa responde "Sim, e ficou tenso" na ferramenta de adiar.
export function calcularCautela(respostas: Respostas, cautelaDoCheckin = false) {
  if (calcularSafetyMode(respostas)) return false; // segurança vence cautela
  return cautelaDoCheckin || respostas.medo === "passado" || respostas.agressao === "raramente";
}

export type Modo = "normal" | "cautela" | "seguranca";

export function calcularModo(respostas: Respostas, cautelaDoCheckin = false): Modo {
  if (calcularSafetyMode(respostas)) return "seguranca";
  return calcularCautela(respostas, cautelaDoCheckin) ? "cautela" : "normal";
}
```

`safetyMode` continua existindo em `Resultado` exatamente como está (`resultado.ts:13`), porque o painel, o rastreio e o banner de oferta usam esse campo. `modo` entra ao lado, não no lugar.

### O que isso liga nos módulos

O `contexto.cautela` que alimenta os `:::se cautela=sim` passa a vir de `calcularCautela`. Isso acende quatro textos que já estão escritos no repositório e que nunca apareceram. Leia antes de subir, porque a partir daqui eles vão para a tela:

| Onde | O que passa a acontecer em cautela |
|---|---|
| `modulo-03.md:109` | dentro do item "Usar uma frase nova na vida real", entra "Se o clima estiver tenso, deixe para outro dia. Não existe hora certa com medo." |
| `modulo-04.md:69` e `:73` | a ferramenta de adiar sai do exercício e o card vira "Esta parte fica para quando você tiver conversado com um profissional." |
| `modulo-05.md:22` | o módulo do convite abre com o card de cautela e o carrossel de psicólogos |
| `modulo-05.md:95` | antes do exercício, entra "Se você tem receio da reação, faça o convite com outra pessoa por perto ou converse antes com um profissional." |
| `modulo-06.md:86` | o item "Escolher o que devolver" ganha a linha sobre escolher algo que não envolva conversa direta |
| `ModuloCliente.tsx:469` | o carrossel do fim dos módulos 5 e 6 sai, porque já aparece no texto |

Quem marcou "já aconteceu no passado" na Q8 hoje recebe o programa idêntico a quem nunca teve medo em casa. A única diferença atual é o `FAVOR_SEM_VIOLENCIA` não aparecer na lista do resultado (`resultado.ts:88`). Se você preferir que a cautela valha só na página de resultado e não nos módulos, é uma linha: passe `cautela: false` no contexto do módulo. Prefiro não, e o motivo é que todos os seis textos acima são mais cuidadosos, nenhum é mais arriscado.

### Os textos

Entram em `content/familia/resultado-blocos.md`, numa seção nova chamada `## O que isso está fazendo com você`, antes da seção "Um passo para você". **Todos são nível 1** do briefing N2: leia em voz alta antes de subir.

**Cada linha do bloco é um parágrafo na tela.** Use `linhas()` e não `texto()` em `resultado.ts`: `texto()` junta tudo com espaço e entregaria um parágrafo único de seis frases, que é o oposto do que estes blocos precisam ser. Por isso `comoAfeta` é `string[]`, e a tela renderiza um `<p className="text-large">` por item. As linhas em branco dentro do bloco são ignoradas pelo `lerBlocos`, então pode escrever com ou sem elas.

```
[AFETA_NORMAL_LEVE]
Você contou que o cansaço, a ansiedade ou o sono ruim apareceram em alguns dias das últimas duas semanas. É menos do que muita gente que chega aqui carrega, e é um bom lugar para começar.
Vale saber como isso costuma andar: o desgaste de quem convive com o problema sobe devagar, sem aviso, e quase sempre é percebido tarde. Quem acompanha a própria semana percebe antes.
Por isso o programa tem duas partes que andam juntas. Uma é o que você pode fazer com {{apelido}}, e a outra é o que acontece com você, que vale por si, aconteça o que acontecer com {{apelido}}.

[AFETA_NORMAL_PESADO]
Você contou que o cansaço, a ansiedade ou o sono ruim apareceram na maior parte dos dias das últimas duas semanas. Isso não é fraqueza nem exagero: é o que acontece com um corpo que passa meses em estado de alerta.
Quem vive isso costuma achar que vai cuidar de si quando a situação de {{apelido}} melhorar. Na prática funciona ao contrário, porque pouca gente consegue manter a calma numa conversa difícil estando no limite.
Então o seu cuidado não entra no fim da fila. Ele começa nesta semana, junto com o resto.

[AFETA_CAUTELA]
Você contou que já houve medo ou agressão em casa, mesmo que não seja hoje. Isso muda o que vem a seguir, e muda para mais cuidado, não para menos.
O corpo de quem já passou por isso aprende a ficar de guarda, e ficar de guarda cansa até nos dias calmos. Boa parte do que aparece de noite tem essa explicação, e não falta de motivo.
Nas próximas semanas, algumas partes vêm com um aviso antes: mudar o jeito de reagir em casa pode mexer com o clima, e vale conversar com um profissional antes de mexer. O seu plano de segurança fica salvo e disponível a qualquer momento, com ou sem o programa.

[AFETA_SEGURANCA]
Você contou que esse medo existe hoje. Antes de qualquer coisa sobre {{apelido}}, vale dizer o que viver assim faz com uma pessoa.
Viver em alerta cobra do corpo todos os dias: o sono fica raso, a atenção fica presa na porta, o estômago fecha. Isso não é frescura nem falta de amor por {{apelido}}, é o que acontece com qualquer pessoa que não se sente protegida dentro de casa.
E costuma vir com uma conta a mais, que é a vergonha de sentir alívio quando a casa está vazia. Esse alívio não diz nada contra você.
Logo abaixo, o programa começa pela sua segurança, e não por uma conversa. Essa ordem não é um atraso no caminho: ela é o caminho.
```

### Qual texto entra, e com o que embaixo

| Modo | Texto | "O seu passo desta semana" | Extra |
|---|---|---|---|
| normal, Q11 igual a 0 ou 1 | `AFETA_NORMAL_LEVE` | `PASSO_MODERADO` | nada |
| normal, Q11 igual a 2 ou 3 | `AFETA_NORMAL_PESADO` | `PASSO_ESGOTADO` | nada |
| cautela, Q11 igual a 0 ou 1 | `AFETA_CAUTELA` | `PASSO_MODERADO` | botão secundário "Ver o que fazer em caso de risco" para `/familia/seguranca` |
| cautela, Q11 igual a 2 ou 3 | `AFETA_CAUTELA` | `PASSO_ESGOTADO` | o mesmo botão |
| segurança | `AFETA_SEGURANCA` | não aparece | nada, porque o cartão de segurança vem logo abaixo |

A regra da Q11 é a que já existe no código (`esgotado = Number(respostas.esgotamento ?? "0") >= 2`). Nenhum corte novo, nenhuma faixa nova.

---

## Código

**Parte 1, markdown apenas:**
- `content/familia/modulos/modulo-01.md` a `modulo-08.md`: o bloco "O que é seu" na posição da tabela do item 1, e as duas linhas novas em `modulo-01.md`.

**Parte 2:**
- `lib/familia/diagnostico.ts`: `calcularCautela`, `calcularModo` e o tipo `Modo`, ao lado de `calcularSafetyMode` (linha 198).
- `lib/familia/resultado.ts`: `Resultado` ganha `modo: Modo` e `comoAfeta: string[]`, preenchido com `linhas()`. `montarResultado` ganha o modo por parâmetro, no lugar do `safetyMode: boolean` de hoje (linha 99), e continua preenchendo `safetyMode` a partir dele. `umPasso` continua como está na linha 133.
- `content/familia/resultado-blocos.md`: a seção nova com os quatro blocos.
- `app/familia/resultado/ResultadoVisao.tsx`: a seção nova depois do topo (linha 50), e a remoção da seção "Um passo para você" de hoje (linhas 114 a 119), cujo texto passa para dentro da seção nova.
- `app/familia/resultado/exemplo/ExemploCliente.tsx` e `ResultadoCliente.tsx`: passam o modo para `montarResultado`.
- `app/familia/programa/modulo/[n]/ModuloCliente.tsx`: `contexto.cautela` deixa de ser fixo e passa a vir do diagnóstico.
- `lib/familia/markdown.ts`: apagar o comentário das linhas 38 e 39, que diz que a regra não existe.
- `docs/revisao-conteudo.md`: os quatro blocos `AFETA_*` entram na lista "a publicar", como nível 1.
- Teste de `montarResultado` em Node: um caso por modo, conferindo que em segurança o `umPasso` não vai para a tela.

---

## Critério de aceite

- Os 8 módulos têm o bloco "O que é seu", sempre depois do último título de conteúdo e antes do exercício.
- A tela do módulo bloqueado continua mostrando os mesmos dois títulos de antes, em nenhum módulo "O que é seu" aparece ali.
- Os 8 botões abrem as rotas da tabela, e nenhuma rota nova foi criada.
- A página de resultado abre, depois do topo, com "O que isso está fazendo com você".
- Não existe mais uma seção "Um passo para você" solta na página; o passo aparece dentro do bloco novo, com o rótulo "O seu passo desta semana".
- O bloco novo aparece com um parágrafo por linha do arquivo, nunca como um parágrafo único.
- Em modo segurança nenhum passo de autocuidado aparece na página.
- Em modo cautela o bloco traz o botão para `/familia/seguranca`.
- Os `:::se cautela=sim` dos módulos 3, 4, 5 e 6 aparecem para quem marcou "já aconteceu no passado" na Q8 ou "sim, raramente" na Q9.
- Nenhum número de escore, nem as palavras leve, moderado, grave, ansiedade ou depressão, aparece na tela.
- Os quatro blocos `AFETA_*` estão em `docs/revisao-conteudo.md` como nível 1.
- Sem travessão, sem gênero marcado na pessoa que lê, sem palavra proibida.

---

# Briefing N6: raiva, luto e a vontade de ir embora

Pré-requisito: briefings 00, N1, N2, N3, N4 e **N5 aplicado antes deste**, porque os dois mexem no mesmo ponto do módulo 6. Substitui a proposta 2.2 de `claude/programa-familia-melhorias-conteudo.md`.

**Sessão 5 · Claude Code · Sonnet 5.5 · esforço médio.** Markdown nos módulos 2, 6 e 7, mais uma página estática no molde de `app/familia/seguranca/page.tsx`. Todo o texto está escrito aqui. Nada passou pelo Gemini.

**Tudo neste briefing é nível 1** do briefing N2: leia em voz alta antes de subir. Entra inteiro em `docs/revisao-conteudo.md`, na lista "a publicar".

---

## O problema

O programa diz "a culpa não é sua" no módulo 1 e segue para a técnica. Em nenhum dos oito módulos existe uma linha sobre a raiva, sobre a vergonha de sentir raiva, sobre a saudade da pessoa que {{apelido}} era, sobre o alívio quando a casa está vazia, ou sobre o pensamento de ir embora.

São esses os assuntos da cabeça de quem chega. A pessoa lê oito semanas de habilidade de comunicação e não encontra em lugar nenhum a própria terça-feira à noite.

E tem um ponto que não é de adesão, é de ética: **o programa tem um viés silencioso de permanência.** Em nenhum texto se admite que, para parte das famílias, a resposta é se afastar, sair de casa ou parar de sustentar. Um programa que nunca admite a saída é um programa que, no limite, serve a quem usa, e não a quem cuida.

---

## Onde cada bloco encaixa, e por quê

| Bloco | Onde | Por quê |
|---|---|---|
| **Você também tem raiva** | `modulo-02.md`, entre `## As suas reações` (linha 40) e `## As janelas` (linha 46) | É a semana em que a pessoa anota, por sete dias, cada momento difícil. Anotar remexe, e a raiva aparece justamente aí. O módulo 2 também é o mais leve dos oito (3,5 KB contra 6 KB do módulo 6), então tem espaço. |
| **Saudade de quem ainda está aqui** | `modulo-07.md`, entre `## Lugares que acolhem familiares` (linha 43) e `## O que dá sentido aos seus dias` (linha 55) | É a semana de olhar para a própria vida, e a régua de realidade do N4 já avisa que a conta do que ficou de lado costuma doer aí. Nomear a perda antes do bloco sobre o que dá sentido aos dias deixa os dois no lugar certo. |
| **E se eu quiser sair** | Texto inteiro numa página livre, `/familia/decisao`. No `modulo-06.md`, um bloco curto que leva até ela, entre `## Cuidar do dinheiro da casa` (linha 70) e o bloco "O que é seu" do briefing N5 | O módulo 6 é literalmente "sair do papel de quem resolve tudo", então é ali que a distinção entre as duas saídas fica concreta. Mas o módulo 6 tem `bloqueado_em_modo_seguranca: true`: quem respondeu que tem medo hoje nunca abre esse módulo, e é exatamente quem mais precisa deste texto. Por isso o conteúdo vive fora do módulo, numa página livre, sem compra e sem modo. |

**Ordem no módulo 6, para os dois briefings não colidirem:** `## Cuidar do dinheiro da casa`, depois `## E se eu quiser sair` (este briefing), depois `## O que é seu` (briefing N5), depois `## Exercício da semana`.

**Posição e vitrine.** Nenhum dos três blocos pode ficar entre os dois primeiros títulos `##` do arquivo, porque a tela do módulo bloqueado monta "O que você vai ver nesta semana" com esses dois (`app/familia/programa/modulo/[n]/ModuloCliente.tsx:328`). Nas posições acima isso está respeitado. "Você também tem raiva" é a frase mais reconhecível que o programa tem, e ainda assim não vira vitrine de venda: conteúdo pesado não é chamariz.

---

## 1. Você também tem raiva

Entra em `content/familia/modulos/modulo-02.md`.

```
## Você também tem raiva

Tem dia em que você faz tudo certo. E tem dia em que você olha {{apelido}} dormindo e sente uma raiva que assusta.

Quase ninguém fala disso em voz alta. A gente fala do medo, da preocupação, do cansaço. A raiva fica guardada, porque parece feia em quem ama.

Ela não é feia. Ela é a conta de tudo o que foi deixado de lado por causa disso: as noites, o dinheiro, as festas de família, os planos que não aconteceram. Sentir raiva não diz nada sobre o tamanho do seu amor.

O que complica não é sentir. É descarregar na hora e pagar depois com culpa, e recomeçar tudo no dia seguinte.

Entre sentir e descarregar cabe um intervalo, e é esse intervalo que a gente vai treinar. Na próxima vez, antes de responder, saia do ambiente: um copo de água, a varanda, a escada, qualquer coisa que coloque dois minutos entre você e a frase que já está pronta.

Esses dois minutos não resolvem o problema de {{apelido}}. Eles evitam que o resto do dia seja sobre pedir desculpa.

:::se seguranca=sim
Se a raiva dentro de casa já virou medo ou agressão, sair do ambiente não é um intervalo, é segurança. Veja o seu plano antes de qualquer conversa.

[Ver o que fazer em caso de risco](/familia/seguranca)
:::
```

---

## 2. Saudade de quem ainda está aqui

Entra em `content/familia/modulos/modulo-07.md`.

```
## Saudade de quem ainda está aqui

Existe um tipo de saudade que não tem nome e não tem velório: a saudade de alguém que continua ali, do outro lado da mesa.

Você sente falta das conversas que vocês tinham, do jeito que {{apelido}} ria, dos planos que vocês faziam juntos. E, quando sente, parece exagero, porque a pessoa não morreu.

Não é exagero. Perder a convivência com alguém que continua vivo é uma perda de verdade, e ela merece ser chorada.

Dar esse nome costuma aliviar mais do que tentar não pensar. Quem chora a perda para de esperar que o dia seguinte devolva a pessoa de antes, e volta a enxergar quem está ali hoje.

Nada disso quer dizer que {{apelido}} não volte a ser quem era. Quando o uso diminui, parte do que vocês tinham costuma voltar, e parte volta diferente. Chorar agora não é desistir de {{apelido}}.
```

Sem botão: o bloco "O que é seu" do briefing N5, no mesmo módulo, já leva à escala.

---

## 3. E se eu quiser sair

### 3a. O bloco curto, no módulo 6

Entra em `content/familia/modulos/modulo-06.md`.

```
## E se eu quiser sair

Em algum momento, quase toda pessoa que cuida pensa em ir embora. E quase sempre esse pensamento vem com vergonha, como se pensar já fosse traição.

Pensar não é traição. E este programa não existe para te convencer a ficar.

Vale separar duas saídas, porque elas são bem diferentes. Uma é sair da relação. A outra é sair do papel de quem resolve tudo, continuando na relação.

A segunda é o assunto desta semana, e é o que muita gente que chega aqui está procurando sem ter nome para isso.

A primeira é uma decisão sua, e não cabe a este programa opinar sobre ela. O que cabe é deixar escrito, num lugar que você encontra quando precisar, o que ajuda ter na mão antes de decidir qualquer uma das duas.

@botao [Ver o que ter na mão antes de decidir](/familia/decisao)
```

### 3b. A página livre, em `/familia/decisao`

Página estática, no molde de `app/familia/seguranca/page.tsx`: sem compra, sem login, sem modo de segurança, sem diagnóstico. Indexável, como a página de segurança. Título da aba: `Fôlego · Margem`, como manda o briefing N1.

O `{{apelido}}` não existe nesta página, porque ela abre fora do programa, sem diagnóstico carregado. O texto abaixo já está escrito sem a variável.

**Título da página:** E se eu quiser sair
**Descrição, abaixo do título:** Duas saídas diferentes, o que ajuda ter na mão antes de decidir, e onde buscar orientação de graça.

```
Em algum momento, quase toda pessoa que cuida pensa em ir embora. E quase sempre esse pensamento vem com vergonha, como se pensar já fosse traição.

Pensar não é traição. Esta página não existe para te convencer a ficar nem para te convencer a sair.

## Duas saídas, que são bem diferentes

Uma é sair da relação: morar em outro lugar, se separar, se afastar de quem você ama.

A outra é sair do papel de quem resolve tudo, continuando na relação: parar de pagar as contas que não são suas, parar de dar desculpas no trabalho de outra pessoa, deixar de ser a única pessoa que segura a casa.

As duas são escolhas legítimas, e nenhuma das duas é mais corajosa que a outra. Muita gente chega aqui achando que só existe a primeira, e descobre que o que queria era a segunda.

O programa trabalha a segunda, semana por semana, principalmente no módulo 6. A primeira é sua, e ninguém precisa autorizar.

## Antes de decidir qualquer uma das duas

- Escolha um dia calmo. Decisão tomada no pior dia da semana quase sempre é revista no melhor, e o contrário também acontece.
- Converse com uma pessoa de fora antes: alguém de confiança, um profissional, um grupo de familiares.
- Saiba quais dívidas são suas, quais são da outra pessoa e quais são das duas. Isso muda tudo nas duas saídas.
- Guarde os seus documentos e os das crianças num lugar que só você sabe.

## Se for sair da relação

- Onde você vai ficar, mesmo que seja por alguns dias.
- Uma conta no seu nome, para receber o que é seu.
- Cópia dos documentos de todo mundo: identidade, CPF, certidão de nascimento, carteira de vacinação das crianças, comprovante de residência.
- Celular, carregador, chaves, remédios de uso contínuo e algum dinheiro separado.
- Quem vai saber antes, e quando.

Se houver medo da reação, não avise sem ter alguém por perto, e não avise dentro de casa. Nesse caso, a ordem muda: primeiro a sua segurança, depois a conversa.

## Se for sair do papel de resolver tudo

- Escolha uma coisa só para parar de fazer, a mais simples da lista.
- Avise antes, com calma, num momento sem efeito, e sem acusar ninguém.
- Espere piorar antes de melhorar. Nos primeiros dias vem reclamação e a sensação de estar sendo cruel.
- Não volte a discutir o assunto a cada cobrança. Você já avisou uma vez, e isso é suficiente.

O módulo 6 do programa trata disso em detalhe, com as quatro perguntas que ajudam a escolher o que devolver.

## Onde buscar orientação de graça

- **Defensoria Pública da sua cidade:** orienta sobre separação, guarda, pensão e divisão de dívida, sem custo, e pode pedir medida protetiva ao juiz quando há violência.
- **CRAS:** o centro de assistência social do seu bairro, que orienta sobre direitos, benefícios e serviços da cidade.
- **CREAS:** atende famílias e pessoas em situação de violência ou violação de direitos, com escuta, orientação jurídica e apoio para conseguir documentos.
- **Ligue 180:** a Central de Atendimento à Mulher funciona 24 horas, todos os dias, orienta e encaminha para os serviços da rede. Qualquer pessoa pode ligar, inclusive para pedir orientação sobre outra pessoa.
- **190:** se você estiver em perigo agora.

@botao [Ver serviços perto de mim](/redes-de-apoio?tipo=publicas)

## E se você decidir ficar

Ficar também é uma decisão, e vale o mesmo que as outras duas. Ficar por escolha é diferente de ficar por não ver saída, e a diferença entre as duas coisas aparece no dia a dia.

Essa decisão também não é definitiva. Dá para rever em um mês, em seis, em um ano, e rever não é fraqueza: é informação nova chegando.
```

### 3c. O link no painel

O conteúdo vai ser procurado num dia que não é o dia do módulo. Entra um card na seção "Ferramentas" do painel (`app/familia/programa/PainelCliente.tsx:262`), como último item, no mesmo padrão visual dos outros três:

- Título: **E se eu quiser sair**
- Botão secundário: **"Ver o que ter na mão antes de decidir"**, para `/familia/decisao`

Aparece sempre, inclusive em modo de segurança, e não depende de módulo liberado.

### 3d. O link na página de segurança

Em `app/familia/seguranca/page.tsx`, depois dos contatos de emergência, nunca antes deles:

- Link: **"Se você estiver pensando em ir embora"**, para `/familia/decisao`

Quem chega na página de segurança pelo resultado em modo segurança é quem mais precisa achar esse texto, e é quem não vai abrir o módulo 6.

---

## O que não entra neste texto, em nenhuma revisão futura

Esta lista existe para ninguém "melhorar" o bloco depois e quebrar a decisão.

**Nada de linguagem de codependência.** Sem as palavras codependência e codependente, sem "facilitador", sem "amar demais", sem "você se anulou", sem "aprenda a se amar primeiro", sem "solte a mão". A Margem não adota esse vocabulário, e o modelo de estresse e enfrentamento que sustenta esta parte do programa rejeita essa explicação: o papel de quem resolve tudo foi construído pela situação, não por um defeito de quem cuida.

**Nada de recomendação.** O texto oferece critérios, nunca conselho sobre ficar ou sair. Se alguma frase futura começar com "o melhor é", ela está errada.

**Nada de promessa.** Nem de que sair resolve, nem de que ficar melhora.

**Nenhum passo a passo de como internar alguém.** Internação é assunto do briefing N9.

---

## Código

- `content/familia/modulos/modulo-02.md`: o bloco "Você também tem raiva" na posição da tabela.
- `content/familia/modulos/modulo-07.md`: o bloco "Saudade de quem ainda está aqui".
- `content/familia/modulos/modulo-06.md`: o bloco curto "E se eu quiser sair", antes do bloco "O que é seu" do N5.
- `app/familia/decisao/page.tsx`: página nova, estática, texto do item 3b inline, com o comentário `// nivel-1` no topo. Sem `robots: noindex`.
- `app/familia/programa/PainelCliente.tsx`: o card novo no fim da seção "Ferramentas".
- `app/familia/seguranca/page.tsx`: o link do item 3d, depois de `ContatosEmergencia`.
- `docs/revisao-conteudo.md`: os três blocos e a página nova na lista "a publicar", como nível 1.

---

## Critério de aceite

- "Você também tem raiva" está no módulo 2, depois de "As suas reações", e aparece também em modo de segurança, com o parágrafo extra e o link do plano.
- "Saudade de quem ainda está aqui" está no módulo 7, antes de "O que dá sentido aos seus dias".
- No módulo 6, a ordem é: Cuidar do dinheiro da casa, E se eu quiser sair, O que é seu, Exercício da semana.
- Nenhum dos três blocos aparece em "O que você vai ver nesta semana" de nenhum módulo bloqueado.
- `/familia/decisao` abre sem login, sem compra e em modo de segurança, e não quebra sem diagnóstico carregado.
- A página não contém `{{apelido}}`.
- A página separa as duas saídas, tem o checklist das duas e os cinco serviços, e não recomenda nenhum dos dois caminhos.
- O card "E se eu quiser sair" aparece no painel, inclusive em modo de segurança.
- Na página de segurança, o link novo vem depois dos contatos de emergência.
- Nenhuma ocorrência das palavras codependência, codependente ou facilitador em `content/familia` e em `app/familia`.
- Sem travessão, sem gênero marcado na pessoa que lê, sem palavra proibida.

---

# Briefing N9: internação e as substâncias separadas

Pré-requisito: briefings 00, 00d, N1, N2, N3 e N4 aplicados, mais o conteúdo v2 e as ferramentas partes 1 e 2. Não substitui briefing nenhum: acrescenta conteúdo novo.

**Nível 1 do briefing N2.** Nenhum texto daqui sobe sem o fundador ler em voz alta, e cada bloco entra em `/docs/revisao-conteudo.md` na lista "a publicar", com a data e o nível.

**Toda lei, prazo, número e nome de serviço deste briefing foi conferido na fonte em 24/11/2026.** A lista está no fim do arquivo. Nada saiu de memória.

**Sessão 5 · Claude Code · Sonnet 5.5, esforço médio, para o markdown; Opus 5, esforço alto, para os itens 1, 2 e 3 do "Código".**

Todo o texto de tela deste briefing está escrito aqui. Não reescreva, não complete, não invente microcopy.

## O problema

Quatro furos, confirmados no repositório em 24/11/2026.

**1. Internação não existe no produto.** `grep -ril "interna" content/familia` devolve zero. É a pergunta número um de familiar brasileiro, e quem pesquisa isso encontra clínica vendendo remoção, às vezes na mesma ligação em que pediu informação. Hoje a Margem não tem uma linha para proteger essa pessoa.

**2. "Outras drogas" é um balde só.** A variação por substância existe em três arquivos e trata crack, cocaína, calmante e maconha como a mesma coisa:

| Arquivo | Bloco | O que diz hoje |
|---|---|---|
| `content/familia/modulos/modulo-01.md` | `:::se problema=outras_drogas` | "As drogas mexem com o sistema de recompensa do cérebro." |
| `content/familia/modulos/modulo-05.md` | `:::se problema=outras_drogas` | "O medo de exposição ou de problema com a lei costuma pesar." |
| `content/familia/modulos/modulo-06.md` | `:::se problema=outras_drogas` | "Cobrir compromissos cancelados, dar dinheiro sem saber para onde vai." |

`grep -ril "crack\|cocaína\|maconha\|remédio\|calmante" content/familia` devolve zero nos três casos. E, em `lib/familia/resultado.ts`, a função `avisos` tem card para álcool diário e para apostas, e **nenhum** para outras drogas: o comentário da função diz com todas as letras "outras drogas: sem card".

**3. O dado da substância não existe.** `lib/familia/diagnostico.ts` tem `export type Problema = "alcool" | "outras_drogas" | "apostas"` e nada abaixo disso. Sem um campo novo, nenhum texto pode variar por substância. O caminho já está aberto: a Q3b `frequencia_alcool` é uma pergunta condicional que só aparece para quem marcou álcool, com `condicao: (respostas) => Boolean(respostas.problemas?.includes("alcool"))`, limpeza no fim de `sanitizarRespostas` e card de aviso próprio. A Q3c deste briefing é a mesma coisa, para outras drogas.

**4. Falta o conteúdo de segurança de dívida com terceiro e de desaparecimento.** `grep -ril "desapare" content/familia` devolve zero. E a especificação do C7 (ferramentas parte 2) lista, para quem marcou outras drogas, o chip **"Resolver problemas com pessoas a quem {{apelido}} deve"** entre as coisas que o familiar deve escolher parar de fazer, como exercício da semana. Isso está errado e é perigoso: negociar com quem cobra dívida de droga não é uma tarefa que a família devolve numa semana, é segurança da casa inteira. O C7 ainda não foi construído (o `modulo-06.md` tem `acao=marcar` nos três exercícios), então dá para corrigir antes de existir.

## O que fazer

### 1. Q3c do diagnóstico: qual substância

Pergunta condicional nova, depois da Q3b (`frequencia_alcool`) e antes da Q4 (`tempo`). Só aparece para quem marcou "Outras drogas" na Q3. Múltipla escolha, porque é comum ser mais de uma.

> **Quais dessas te preocupam mais?**
>
> - Crack ou cocaína
> - Remédio de farmácia (calmante, remédio para dormir, remédio para dor)
> - Maconha
> - Outra
> - Não sei

Texto de apoio abaixo da pergunta: "Isso muda o que o programa te mostra. Pode marcar mais de uma."

Valores: `crack_cocaina`, `remedio`, `maconha`, `outra`, `nao_sei`.

### 2. A página sobre internação

Página livre nova em `/familia/internacao`, no mesmo padrão da `/familia/decisao` que o briefing N6 criou: página estática, texto inline, sem login e sem compra. **Aberta para qualquer pessoa, sempre**, pelo mesmo critério da página de segurança: é conteúdo que protege a família de ser explorada num dia de desespero. Link no módulo 5 e na página de segurança.

Como a página abre sem diagnóstico carregado, ela não usa `{{apelido}}` em lugar nenhum, igual à `/familia/decisao`.

Texto final:

> # Internação: o que a lei permite e o que ela não resolve
>
> Se existe risco à vida agora, isso é emergência: ligue 192. O resto desta página pode esperar uma hora.
>
> ## Os tipos que existem
>
> A Lei 10.216, de 2001, prevê três tipos de internação em saúde mental. **Voluntária**, quando a própria pessoa aceita e declara isso por escrito. **Involuntária**, sem o consentimento da pessoa, a pedido de um familiar ou do responsável legal. **Compulsória**, determinada por um juiz.
>
> Para álcool e outras drogas existe uma lei específica, a Lei 13.840, de 2019, que mudou a Lei 11.343, de 2006. Ela trata de dois tipos, voluntária e involuntária, e dá o detalhe que mais importa para a sua decisão.
>
> ## O que a lei exige numa internação involuntária
>
> - Quem formaliza é o **médico responsável**, registrado no CRM do estado onde fica o serviço. A decisão não é da família.
> - O médico só pode indicar depois de avaliar o tipo de droga, o padrão de uso e a **impossibilidade comprovada** de outro caminho de tratamento.
> - Só pode acontecer em **unidade de saúde ou hospital geral**, com equipe de várias áreas.
> - Dura o tempo necessário à desintoxicação, com **prazo máximo de 90 dias**, e o fim é determinado pelo médico responsável.
> - A família ou o representante legal **pode pedir ao médico a interrupção a qualquer momento**.
> - Toda internação e toda alta são informadas em até **72 horas** ao Ministério Público, à Defensoria Pública e aos órgãos de fiscalização.
> - Qualquer internação só é indicada quando os recursos fora do hospital não deram conta.
>
> Em resumo: a decisão é médica, tem prazo, é fiscalizada e pode ser interrompida. Quem te oferecer qualquer coisa diferente disso está oferecendo o que a lei não permite.
>
> ## Comunidade terapêutica não interna
>
> A lei proíbe qualquer modalidade de internação nas comunidades terapêuticas acolhedoras. O que existe ali é **acolhimento**: a pessoa aceita e assina, passa por avaliação médica antes de entrar, e o isolamento físico é proibido. Quem precisa de cuidado médico contínuo não pode ser acolhido ali, e sim encaminhado para a rede de saúde.
>
> ## O que a internação não resolve
>
> Desintoxicar é tirar a substância do corpo. O que decide o resto é o depois: para qual casa a pessoa volta, com quais horários, com quais companhias e com qual acompanhamento. Internação sem esse depois costuma comprar tempo, não mudança.
>
> E ela acontece sem o acordo da pessoa. Isso quase sempre custa confiança entre vocês dois, que é justamente o que o resto do programa está construindo. Não é um argumento contra: é uma conta para você fazer com os olhos abertos.
>
> ## Antes de fechar com qualquer clínica, pergunte e anote
>
> 1. **Isso é serviço de saúde ou comunidade terapêutica?** São coisas diferentes, com regras diferentes. Comunidade terapêutica não interna.
> 2. **A licença sanitária está atualizada?** A regra da Anvisa para esses serviços exige que ela fique visível ao público. Peça para ver.
> 3. **Quem é o responsável técnico?** Nome e registro no conselho da profissão. A regra exige um de nível superior e um substituto com a mesma qualificação.
> 4. **Quem é o médico responsável?** Nome e CRM. Sem isso não existe internação dentro da lei.
> 5. **Quanto custa, por escrito, com tudo incluído?** Preço só no telefone, com pressa para fechar hoje, é sinal.
> 6. **Como funciona a visita e o contato?** Quem atende quando você ligar, em que horário, quantas vezes por semana você pode ver a pessoa.
> 7. **A pessoa pode sair?** Privar alguém de liberdade é crime no Brasil (artigo 148 do Código Penal), e a pena é maior quando isso acontece por meio de internação em casa de saúde ou hospital.
> 8. **Tem remédio guardado sem receita?** A regra da Anvisa proíbe estoque de medicamento sem prescrição médica.
>
> Se alguma resposta vier atravessada, ou se oferecerem uma equipe para buscar a pessoa à força, isso já é a resposta.
>
> ## O que costuma ajudar mais, e é de graça
>
> - **CAPS AD da sua cidade:** avalia, acompanha e, quando a internação é necessária, encaminha pela rede pública, inclusive para hospital geral. Em muitos lugares dá para ir direto, sem encaminhamento.
> - **CAPS AD III:** onde existe, tem leito de acolhimento noturno, para desintoxicação, observação e proteção, com permanência de até 14 dias dentro de 30. É o caminho mais perto de "internação curta" que a rede pública oferece, sem sair da cidade e sem custo.
> - **UBS:** a porta de entrada do SUS, que também encaminha.
> - **Meu SUS Digital:** atendimento on-line gratuito em saúde mental.
> - **188, CVV:** para você, a qualquer hora, de graça.
>
> @botao [Ver serviços perto de mim](/redes-de-apoio?tipo=publicas)
>
> ## Se uma clínica estiver maltratando alguém
>
> A Vigilância Sanitária do município fiscaliza o funcionamento. O Ministério Público do seu estado recebe denúncia. O 100 recebe denúncia de violação de direitos humanos, 24 horas, de graça, e pode ser anônima.
>
> [Ver meu plano de segurança](/familia/seguranca)

### 3. Os três blocos de substância

Entram nos módulos como `:::se substancia=...`, **dentro** do bloco `:::se problema=outras_drogas` que já existe. Quem marcou mais de uma substância vê mais de um bloco, na ordem em que estão no arquivo. Quem marcou "Outra" ou "Não sei" continua vendo só o texto geral de outras drogas, que não muda.

#### 3.1 Crack e cocaína

**Módulo 1, dentro de `:::se problema=outras_drogas`:**

> ### Quando é crack ou cocaína
>
> O uso costuma vir em ciclos de muitas horas, e não em doses espaçadas pelo dia. É por isso que, de fora, parece que a pessoa desaparece: enquanto dura o ciclo, nada mais existe.
>
> Depois vem a descida, e ela é pesada. Nessas horas aparece tristeza funda, irritação e muito sono, e é comum a pessoa dizer coisas duras sobre si mesma. Se {{apelido}} falar em se machucar ou em acabar com a própria vida, isso não é hora de conversa sobre uso: veja o seu plano de segurança e, se precisar, ligue 188.
>
> Depois de muitas horas de uso também pode aparecer desconfiança forte, do tipo que faz a pessoa achar que está sendo vigiada ou perseguida. Isso é efeito, não é a pessoa mentindo para você. Discutir ali não funciona, e contrariar aumenta.
>
> Duas coisas aparecem quase sempre nessas casas: dinheiro e objetos que somem, e dívida com gente de fora. As duas têm conteúdo próprio aqui, porque nenhuma delas se resolve com conversa.
>
> [Ver o que fazer quando alguém vem cobrar em casa](/familia/divida)
> [Ver o que fazer quando {{apelido}} desaparece](/familia/desaparecimento)

**Bloco de emergência, no mesmo lugar, logo abaixo. Nível 1:**

> ### Quando ligar 192
>
> A cocaína aperta os vasos e sobrecarrega o coração, e isso acontece também com gente jovem e sem problema de saúde antes. Ligue 192 se aparecer dor no peito, falta de ar, batimento muito acelerado, convulsão, pele muito quente com confusão, fala enrolada, ou fraqueza de um lado do corpo.
>
> Não existe antídoto para cocaína e crack. O caminho é o 192, e não esperar para ver.
>
> Misturar com álcool é mais perigoso do que cada um separado: o corpo forma uma terceira substância, que dura mais tempo e pesa mais no coração.
>
> Enquanto a ajuda não chega: não deixe a pessoa sem companhia, afrouxe a roupa, ambiente fresco e sem barulho, e não dê nada para comer ou beber.

**Módulo 5, dentro de `:::se problema=outras_drogas`:**

> ### No convite, quando é crack ou cocaína
>
> Aqui o medo que mais pesa é o de problema com a lei. Vale deixar claro que o atendimento é sigiloso, que o profissional não comunica nada a ninguém, e que procurar ajuda não expõe {{apelido}} a nada.
>
> Uma coisa que circula errado e vale corrigir: a decisão do Supremo de 2024 sobre porte para uso próprio vale para maconha, e não para cocaína e crack.
>
> O melhor momento para convidar é no dia seguinte ao ciclo, quando a descida já passou e o arrependimento ainda está fresco. Durante o uso, nenhuma conversa vale.

**Módulo 6, dentro de `:::se problema=outras_drogas`:**

> ### Guardar o que é seu, sem virar uma delegacia
>
> Guardar documentos, cartões, chaves e dinheiro em um lugar que só você sabe é cuidado, e você não precisa de autorização de ninguém para isso.
>
> O que faz diferença é como você conta. Diga uma vez, num momento calmo, que você passou a guardar as suas coisas em outro lugar, e não entre em lista do que sumiu nem em interrogatório. Lista vira briga, e briga não traz nada de volta.
>
> Revistar quarto, mochila e celular todos os dias desgasta você e não muda o uso. Se você precisa saber de algo para decidir alguma coisa concreta, pergunte direto. Se não for para decidir nada, não procure.

#### 3.2 Remédio de farmácia

**Módulo 1, dentro de `:::se problema=outras_drogas`:**

> ### Quando é remédio de farmácia
>
> Esta é a que a família demora mais a enxergar, e com motivo: tem receita, tem médico, tem caixa na gaveta. Um uso que começou certo pode virar problema sem ninguém mudar de farmácia.
>
> Os mais comuns são os calmantes e os remédios para dormir, como clonazepam, alprazolam e diazepam, e os remédios para dor ou para tosse que têm opioide, como codeína e tramadol.
>
> O que costuma indicar que passou do ponto: a dose que o médico passou já não faz efeito, a caixa acaba antes do fim do mês, aparecem receitas de mais de um médico, ou a pessoa fica mal quando a farmácia não tem. Essas receitas têm regra: o calmante e o remédio para dormir dessa lista são vendidos com a Notificação de Receita B, aquele papel azul, que vale 30 dias e cobre no máximo 60 dias de tratamento.

**Bloco de aviso, no mesmo lugar. Nível 1:**

> ### Parar de uma vez pode ser perigoso
>
> Interromper calmante ou remédio para dormir de repente, ou reduzir rápido demais, pode causar abstinência grave, incluindo convulsão, com risco de vida. Esse é o aviso mais forte que existe na bula desses remédios.
>
> Então não esconda a caixa, não corte a dose e não jogue nada fora para ajudar. A retirada é feita devagar, com médico, ao longo de semanas, e a dose vai diminuindo em etapas.
>
> O que você pode fazer é pedir uma consulta e contar o que você vê, levando a lista de tudo o que {{apelido}} toma. Quem decide a dose é quem prescreve.
>
> Ligue 192 se a respiração ficar lenta ou difícil, se a pessoa não acordar quando você chamar, se os lábios ou as pontas dos dedos ficarem arroxeados, ou se houver confusão forte. Esse risco aumenta muito quando esses remédios são tomados junto com álcool, ou quando um calmante é tomado junto com um remédio para dor com opioide.

**Módulo 5, dentro de `:::se problema=outras_drogas`:**

> ### No convite, quando é remédio de farmácia
>
> Aqui você tem uma vantagem que as outras casas não têm: já existe um médico na história. O convite mais fácil de aceitar é o de ir junto.
>
> "Quer que eu vá com você na próxima consulta?" costuma passar melhor do que qualquer frase sobre uso. Dentro da consulta, quem fala é {{apelido}}, e você só conta o que viu, se perguntarem.
>
> Se a receita vem de vários médicos, vale levar isso para um só, de preferência um psiquiatra. Não para dedurar: porque ninguém consegue ajustar o que não sabe que existe.

**Módulo 6, dentro de `:::se problema=outras_drogas`:**

> ### Sobre comprar o remédio
>
> Em muitas casas é a família que vai à farmácia. Parar de comprar parece o passo óbvio, e aqui ele não é: com esses remédios, a falta repentina tem risco próprio.
>
> O caminho é outro. Marque a consulta, conte o que está acontecendo e peça um plano de retirada com data. Enquanto esse plano não existir, continuar comprando não é você amortecendo nada, é segurança.
>
> O que dá para devolver desde já é o resto: a corrida atrás de receita, a ligação para o médico, a desculpa para quem pergunta.

#### 3.3 Maconha

**Módulo 1, dentro de `:::se problema=outras_drogas`:**

> ### Quando é maconha
>
> Nas casas que chegam aqui por maconha, a família costuma ficar entre duas pontas: "isso é natural, não faz nada" e "ele vai ficar louco". As duas travam a conversa, e a verdade mora no meio.
>
> O que se sabe: a maior parte de quem usa não desenvolve problema, e existe problema sim. Parar depois de um tempo de uso diário costuma dar irritação, sono ruim e menos apetite, por alguns dias, sem risco de vida. Não existe remédio com eficácia comprovada para ajudar a parar, então o caminho é acompanhamento.
>
> Dois pontos merecem atenção de verdade. Em quem tem esquizofrenia, a maconha pode piorar ou desencadear a psicose. E existe uma síndrome em quem usa muito e há muito tempo, com crises de vômito e dor na barriga que aliviam no banho quente e só passam de vez com a parada do uso. Quem vive isso passa anos achando que é problema de estômago.
>
> Para conversar, deixe a droga de lado e fale do que é concreto na vida de vocês: as faltas, o dinheiro, o sono, as brigas, o que ficou para trás. Discussão sobre a maconha em si não vai a lugar nenhum.

**Módulo 1, bloco curto logo abaixo:**

> ### Sobre a lei
>
> Em junho de 2024, o Supremo decidiu que ter até 40 gramas de maconha, ou seis plantas fêmeas, para uso próprio não é crime, e manteve essa decisão em 2025.
>
> Isso não quer dizer que está liberado. A droga continua sendo apreendida e a pessoa pode receber advertência e medidas educativas. A quantidade é uma presunção, e a autoridade pode tratar o caso como tráfico se houver outros sinais, como balança e registro de venda.
>
> Vale saber disso por um motivo prático: medo de prisão costuma ser o que tranca a conversa dentro de casa.

**Módulo 5, dentro de `:::se problema=outras_drogas`:**

> ### No convite, quando é maconha
>
> O "não preciso de ajuda, isso não faz nada" é a resposta mais comum aqui, e brigar com ela não funciona.
>
> Então não convide para tratar maconha. Convide para resolver o que incomoda {{apelido}}: o sono, a falta de ânimo, a ansiedade, a briga em casa, a prova que não saiu. Essas portas são verdadeiras e elas levam ao mesmo lugar.
>
> Se aparecer vômito repetido, crise de pânico forte ou fala desconexa que não passa, isso é atendimento agora: UPA ou 192.

### 4. Os avisos no resultado do diagnóstico

Hoje a função `avisos`, em `lib/familia/resultado.ts`, não devolve nada para outras drogas. Passa a devolver, pela Q3c, pela mesma lógica da Q3b do álcool. Textos novos em `content/familia/resultado-blocos.md`, na seção "Avisos":

> `[AVISO_REMEDIO]`
> Você contou que a preocupação envolve remédio de farmácia. Antes de qualquer plano, saiba de uma coisa: calmante e remédio para dormir não podem ser interrompidos de uma vez, porque a retirada repentina pode causar convulsão. Essa conversa é com um médico, e o programa te ajuda a chegar até lá.

> `[AVISO_CRACK_COCAINA]`
> Você contou que a preocupação envolve crack ou cocaína. Duas coisas que valem desde já: dor no peito, convulsão ou confusão forte depois do uso são emergência, e o número é 192. E dívida com gente de fora não é assunto para a família negociar.

Regra: `AVISO_REMEDIO` leva o botão "Ver psiquiatra parceiro", igual ao `AVISO_ALCOOL_DIARIO`. `AVISO_CRACK_COCAINA` leva o link "Ver o que fazer quando alguém vem cobrar em casa", para `/familia/divida`. Maconha, "Outra" e "Não sei" não geram card: o conteúdo delas não tem risco imediato, e card demais apaga o que importa.

### 5. Dívida com terceiro

Página livre nova em `/familia/divida`, no mesmo padrão da `/familia/decisao`: estática, texto inline, sem login, sem compra, sem `{{apelido}}`. É também a página para onde a ficha 6 da biblioteca do "agora" vai apontar quando o briefing N8 existir. Nível 1.

> # Se alguém vem cobrar uma dívida na sua casa
>
> Se tem alguém ameaçando você ou sua casa agora, ligue 190. Esta página é para depois disso, ou para antes que aconteça.
>
> ## A primeira coisa, porque ela muda tudo
>
> A dívida de uma pessoa adulta é dela. Ninguém da família responde por ela, e existe uma única exceção: quem assinou como fiador ou avalista.
>
> Isso vale mesmo quando vocês moram juntos, mesmo quando é seu filho, mesmo quando a cobrança acontece no seu portão.
>
> ## Cobrança com ameaça é crime, mesmo quando a dívida existe
>
> Ameaçar alguém é crime (artigo 147 do Código Penal). Exigir dinheiro mediante ameaça é extorsão (artigo 158). Usar ameaça ou constrangimento para cobrar uma dívida também é crime pelo Código de Defesa do Consumidor (artigo 71). E emprestar dinheiro com juros muito acima do permitido é o crime de usura, previsto na Lei 1.521, de 1951.
>
> Uma coisa importante para você não travar na hora de pedir ajuda: quem pegou o dinheiro emprestado não comete crime por estar devendo. Procurar a polícia não coloca a pessoa que deve em risco jurídico por causa da dívida.
>
> ## Na hora, na porta
>
> - Não abra a porta. Converse pela janela ou pelo interfone, ou não converse.
> - Não negocie, não combine valor, não assine nada e não entregue dinheiro.
> - Não diga onde a pessoa está nem para onde foi.
> - Se tiver criança em casa, leve para o quarto mais longe da porta antes de responder qualquer coisa.
>
> Uma frase, dita uma vez: "Essa dívida não é minha e eu não vou tratar dela. Pode procurar a pessoa."
>
> ## Depois
>
> - **Registre boletim de ocorrência**, na delegacia ou pela delegacia eletrônica do seu estado. Ameaça de cobrança é fato para registrar, e o registro é o que faz existir uma história se acontecer de novo.
> - **Guarde tudo:** mensagens, áudios, prints, e uma anotação com dia, hora e o que foi dito. Não apague nada.
> - **A Defensoria Pública da sua cidade orienta de graça**, inclusive sobre o que fazer se alguém assinou algo.
> - Se a sua casa virou o endereço da cobrança, pense em passar alguns dias em outro lugar. Leve documentos e remédios, e avise a escola das crianças sobre quem pode buscar.
>
> ## O que não fazer
>
> Pagar para "resolver de uma vez" raramente encerra, e costuma marcar a sua casa como o lugar onde a cobrança funciona. Procurar quem cobra para negociar te coloca na história. E mandar a pessoa que deve negociar com você do lado também.
>
> Se essa dívida precisa de uma decisão, ela merece cabeça fria, um dia depois, e de preferência com orientação da Defensoria. Nunca na porta, nunca à noite.
>
> [Ver meu plano de segurança](/familia/seguranca)

**Correção no C7 (ferramentas parte 2).** Tirar o chip "Resolver problemas com pessoas a quem {{apelido}} deve" da lista de outras drogas. No lugar, um card fixo abaixo da lista, sem ser escolhível:

> **Dívida com gente de fora não entra aqui.** Negociar com quem cobra não é uma tarefa que você devolve numa semana: é segurança da casa. Veja o que fazer.
> [Ver o que fazer quando alguém vem cobrar em casa](/familia/divida)

### 6. Desaparecimento

Página livre nova em `/familia/desaparecimento`, no mesmo padrão da `/familia/decisao`: estática, texto inline, sem login, sem compra, sem `{{apelido}}`. É também a página para onde a ficha 3 da biblioteca do "agora" vai apontar quando o briefing N8 existir. Nível 1.

> # Se a pessoa não aparece e não responde
>
> ## Não existe prazo de espera
>
> Você não precisa esperar 24 horas, nem 48, nem nada. A Política Nacional de Busca de Pessoas Desaparecidas, da Lei 13.812, de 2019, manda registrar na hora, e a polícia tem o dever de fazer o registro, que entra no Cadastro Nacional de Pessoas Desaparecidas no mesmo momento.
>
> Se alguém disser para você voltar depois, diga isso com essas palavras: não existe prazo mínimo para registrar desaparecimento.
>
> Procure a delegacia mais perto. Se for criança ou adolescente, o desaparecimento também é comunicado ao Conselho Tutelar, e isso é a lei, não é denúncia contra você.
>
> ## O que levar para o registro
>
> - Uma foto recente, de preferência de corpo inteiro e uma do rosto.
> - A roupa que a pessoa vestia e o que levava.
> - Altura, peso aproximado, tatuagens, cicatrizes, óculos, dentes.
> - Documentos e o número do telefone, com a operadora.
> - Lugares que costuma frequentar, com quem falou por último e a que horas.
> - Se toma algum remédio ou tem alguma condição de saúde que precise de cuidado.
>
> ## Enquanto isso
>
> - Ligue para os hospitais e as UPAs da região, e também para o IML. É a parte mais difícil da lista, e é a que mais encontra gente.
> - Procure os serviços de rua da cidade e deixe uma foto e um telefone: o Consultório na Rua, o Centro POP, e o serviço de abordagem social. Onde não existe Centro POP, o CREAS atende.
> - O aplicativo Sinesp Cidadão recebe informação sobre localização de pessoas desaparecidas, e o portal gov.br tem a consulta pública do cadastro.
> - Peça para duas ou três pessoas dividirem as ligações com você. Fazer isso por muitas horas sem ninguém do lado tira a sua capacidade de decidir.
>
> ## Quando a pessoa voltar
>
> Avise a delegacia. A lei pede que você informe o reaparecimento, e isso tira o nome do cadastro.
>
> E guarde a conversa para outro dia. Primeiro comida, banho e dormir. Sermão na porta é o jeito mais rápido de a próxima saída acontecer sem aviso.
>
> ## Você também precisa de cuidado
>
> A mesma lei prevê atendimento psicossocial para a família de quem desapareceu. O CRAS e o CREAS da sua cidade são a porta. E o 188 atende a qualquer hora, de graça, inclusive de madrugada, que é quando isso costuma pesar mais.

## Código

**1. `lib/familia/diagnostico.ts`**

- Novo tipo: `export type Substancia = "crack_cocaina" | "remedio" | "maconha" | "outra" | "nao_sei";`
- Novo campo em `Respostas`, logo abaixo de `frequencia_alcool`, com comentário no mesmo padrão: `// Q3c: só pra quem marcou outras drogas.` e `substancias?: Substancia[];`
- Nova pergunta em `PERGUNTAS`, entre `frequencia_alcool` e `tempo`, com `tipo: "multipla"` e `condicao: (respostas) => Boolean(respostas.problemas?.includes("outras_drogas"))`.
- No fim de `sanitizarRespostas`, junto da linha que já existe para o álcool: `if (!resultado.problemas?.includes("outras_drogas")) delete resultado.substancias;`
- Novo `ROTULO_SUBSTANCIA`, no padrão do `ROTULO_PROBLEMA`.
- A pergunta é condicional e de múltipla escolha. `respondida` já trata as duas coisas, então não precisa de mudança: confira com um teste que o diagnóstico fecha sem a Q3c quando outras drogas não está marcada.

**2. `lib/familia/markdown.ts`**

- `Contexto` ganha `substancias: string[]`.
- `condicoesBatem` ganha a chave `substancia`, tratada exatamente como `problema` (lista, com `!` negando): `if (chave === "substancia") return negado ? !contexto.substancias.includes(esperado) : contexto.substancias.includes(esperado);`
- Atualizar o comentário que documenta as condições, acrescentando a linha de `substancia`, no mesmo formato das outras.

**3. `lib/familia/exercicio-cliente.ts`**

- O tipo local `Diagnostico` ganha `substancias?: string[]`.
- `contextoDo` passa a devolver `substancias: diagnostico.substancias ?? []`.

**4. `app/familia/programa/modulo/[n]/ModuloCliente.tsx`**

- O tipo `Diagnostico` da linha 28 ganha `substancias?: Substancia[]`, e o valor segue para `contextoDo`. O que vem da API é a linha `respostas` do diagnóstico, então o campo novo chega junto; confira no servidor local com um diagnóstico novo e um antigo.
- Diagnóstico antigo, gravado antes desta mudança, não tem o campo. Nesse caso `substancias` fica vazio e os blocos novos não aparecem, sem erro. Não escreva script de migração.

**5. `lib/familia/resultado.ts`**

- Em `avisos`, dentro do `for`, acrescentar o ramo de outras drogas:
  - `substancias` inclui `remedio`: card `AVISO_REMEDIO`, com `psiquiatra: true`.
  - `substancias` inclui `crack_cocaina`: card `AVISO_CRACK_COCAINA`.
  - `maconha`, `outra` e `nao_sei`: nenhum card.
- Atualizar o comentário da função, que hoje diz "outras drogas: sem card".
- O tipo `Resultado["avisos"]` tem `problema: Problema`. Os dois cards novos entram com `problema: "outras_drogas"`, então o tipo não muda.

**6. Três páginas livres novas**

Mesmo padrão da `app/familia/decisao/page.tsx`, criada pelo briefing N6. Não crie rota dinâmica e não invente padrão novo:

- `app/familia/internacao/page.tsx`
- `app/familia/divida/page.tsx`
- `app/familia/desaparecimento/page.tsx`

Em cada uma:

- Página estática, texto inline, com o comentário `// nivel-1` no topo.
- Sem `robots: noindex`, igual à `/familia/decisao`. Quem procura isso de madrugada precisa achar.
- Sem login, sem compra, funcionando em modo de segurança e sem diagnóstico carregado.
- Nenhuma ocorrência de `{{apelido}}`, porque a página abre para quem nunca respondeu o diagnóstico.
- Título da aba: "Fôlego · Margem", como manda o N1.
- Nenhuma delas entra no painel agora. O lugar natural desse conteúdo no painel é a biblioteca do "agora" do briefing N8, que ainda não foi escrito, e duas portas para a mesma coisa viram duas verdades.

**7. Links**

- `content/familia/modulos/modulo-05.md`, no fim do bloco "Se não houver horário rápido": `[Ver o que a lei permite sobre internação](/familia/internacao)`.
- `app/familia/seguranca/page.tsx`: três links no fim da página, depois dos contatos, antes do carrossel de profissionais.
- Fichas 3 e 6 da biblioteca do "agora": o briefing N8 ainda não foi escrito, então isso não é tarefa desta sessão. Quando ele subir, o campo "Amanhã" das duas fichas aponta para `/familia/divida` e `/familia/desaparecimento`.

## Critério de aceite

- A Q3c aparece para quem marca outras drogas e não aparece para quem não marca, e o diagnóstico fecha nos dois casos.
- `substancias` não é gravado quando outras drogas não está marcado.
- Um diagnóstico com `crack_cocaina` mostra, no módulo 1, o bloco de crack e cocaína e o bloco de quando ligar 192, e não mostra os de remédio e maconha.
- Um diagnóstico com duas substâncias mostra os dois blocos, na ordem do arquivo.
- Diagnóstico antigo, sem o campo, abre os módulos sem erro e sem bloco de substância.
- O resultado mostra `AVISO_REMEDIO` com o botão do psiquiatra, e `AVISO_CRACK_COCAINA` com o link da dívida. Maconha não gera card.
- `/familia/internacao`, `/familia/divida` e `/familia/desaparecimento` abrem sem login e sem compra, em aba anônima, e não quebram sem diagnóstico carregado.
- Nenhuma das três contém `{{apelido}}`.
- As três páginas abrem no celular sem rolagem lateral e lidas em voz alta fazem sentido sem contexto nenhum.
- A especificação do C7 não tem mais o chip "Resolver problemas com pessoas a quem {{apelido}} deve".
- `grep -rln "Internação" app/familia` encontra a página nova, e nenhum texto do produto ensina a internar alguém à força.
- Os três textos de nível 1 (internação, dívida, desaparecimento) e os dois avisos novos estão em `/docs/revisao-conteudo.md`, na lista "a publicar".
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.

---

# Fontes, conferidas em 24/11/2026

**Internação**
- Lei 11.343/2006, art. 23-A e art. 26-A, com as mudanças da Lei 13.840/2019, em planalto.gov.br: tipos de internação, laudo e CRM, 90 dias, interrupção a pedido da família, comunicação em 72 horas ao Ministério Público e à Defensoria Pública, proibição de internação em comunidade terapêutica acolhedora, acolhimento voluntário por escrito, avaliação médica prévia e proibição de isolamento físico.
- Lei 10.216/2001, art. 6º e art. 8º, em planalto.gov.br e na publicação da Câmara: as três modalidades e as 72 horas.
- RDC Anvisa nº 29, de 30/06/2011: licença sanitária visível, responsável técnico de nível superior com substituto, proibição de estoque de medicamento sem prescrição, proibição de admitir quem precisa de serviço de saúde que a instituição não oferece.
- Código Penal, art. 148, caput e § 1º, II: privar alguém de liberdade é crime, com pena maior quando praticado mediante internação em casa de saúde ou hospital.
- Portaria GM/MS nº 130/2012 e a tabela de procedimentos do SUS: leito de acolhimento noturno do CAPS AD III, até 14 dias em 30.

**Substâncias**
- MSD Manuals, versão para profissionais, verbetes de cocaína e de canábis: efeitos agudos, infarto, AVC, convulsão, hipertermia, psicose em quem tem esquizofrenia, abstinência de maconha e síndrome do vômito cíclico.
- Cocaetileno, formado na mistura de cocaína com álcool, com ação mais longa e mais cardiotóxica.
- Portaria SVS/MS nº 344/1998 e materiais de vigilância sanitária estadual: Notificação de Receita B, azul, válida 30 dias, quantidade para no máximo 60 dias de tratamento.
- FDA, comunicado de segurança de 31/08/2016: aviso em caixa sobre opioide com benzodiazepínico ou outro depressor, inclusive álcool, com sonolência extrema, depressão respiratória, coma e morte. E o aviso da FDA sobre interrupção abrupta de benzodiazepínico, com abstinência grave e convulsão potencialmente fatal.
- UNA-SUS, Segunda Opinião Formativa sobre retirada de benzodiazepínico: retirada gradual ao longo de semanas.
- Cochrane, revisão de medicamentos para dependência de maconha, evidência atualizada até maio de 2024: nenhum medicamento com eficácia estabelecida.
- STF, RE 635.659, tese de repercussão geral de 26/06/2024, mantida em fevereiro de 2025: até 40 gramas de cannabis ou seis plantas fêmeas para consumo pessoal não é infração penal, com apreensão e sanções administrativas, e a quantidade é presunção relativa.

**Dívida com terceiro**
- Código Penal, art. 147 (ameaça) e art. 158 (extorsão).
- Lei 8.078/1990, art. 71: usar ameaça ou constrangimento na cobrança de dívida é crime.
- Lei 1.521/1951, art. 4º: usura.
- Código Civil, arts. 818 a 839, e a doutrina sobre aval: só responde pela dívida de outra pessoa quem assinou como fiador ou avalista.

**Desaparecimento**
- Lei 13.812/2019, arts. 5º, 8º e 15, em planalto.gov.br: Cadastro Nacional de Pessoas Desaparecidas com banco público de livre acesso, registro imediato, comunicação ao Conselho Tutelar quando é criança ou adolescente, aviso de reaparecimento e atendimento psicossocial à família.
- Ministério da Justiça e Segurança Pública, cartilha da Política Nacional de Busca de Pessoas Desaparecidas: não há tempo mínimo para considerar uma pessoa desaparecida, e as instituições de segurança têm o dever de registrar.
- Serviços gov.br "Consultar pessoa desaparecida" e "Informar localização de desaparecido no aplicativo Sinesp Cidadão".
- Serviços do SUAS: Centro POP, Serviço Especializado de Abordagem Social, CREAS onde não há Centro POP, e Consultório na Rua na saúde.

## O que conferir antes de publicar

- Todo número de telefone e todo endereço de site deste arquivo, uma última vez. Serviço público muda canal sem avisar.
- A cada 6 meses, ou quando o Congresso mexer na Lei de Drogas. A tese do STF sobre porte de maconha vale até o Congresso legislar, e a própria decisão diz isso. Se sair lei nova, o bloco da maconha muda no mesmo dia.
- A cada 6 meses, a RDC 29/2011 e a Portaria 344/1998. São normas antigas e vivas, e a Anvisa mexe nos anexos com frequência. O que muda primeiro é a lista de substância e o tipo de receita.
- Quando a biblioteca do "agora" do briefing N8 subir, conferir se as fichas 3 e 6 apontam para `/familia/desaparecimento` e `/familia/divida`.
- Se o guia `/blog/internacao-involuntaria` já existir em `lib/guias.ts`, não copie texto entre o blog e a página do Fôlego, e não faça um apontar para o outro. São públicos diferentes, e texto duplicado em dois lugares diverge em um mês.

---

# Briefing N10: a casa inteira, e o que dizer para uma criança

Pré-requisito: briefings 00, 00d, N1 a N4, e o N9 aplicado, porque a página livre deste briefing segue o mesmo padrão das três de lá e da `/familia/decisao` do N6.

**Nível 1 do briefing N2.** Nenhum texto daqui sobe sem o fundador ler em voz alta, e cada bloco entra em `/docs/revisao-conteudo.md` na lista "a publicar", com a data e o nível.

**Toda lei, prazo, número e nome de serviço deste briefing foi conferido na fonte em 24/11/2026.** A lista está no fim do arquivo. Nada saiu de memória.

**Sessão 5 · Claude Code · Sonnet 5.5 · esforço médio.** É markdown de módulo, uma linha no resultado e uma página livre nova, no mesmo padrão das três do N9. Todo o texto está escrito aqui.

## O problema

**1. A criança não existe no produto.** `grep -ril "criança" content/familia` devolve zero. A única aparição em toda a documentação é como exemplo de problema na tela 0 do C8: "As crianças perguntam o que está acontecendo". O programa inteiro pressupõe um adulto falando sobre outro adulto, e boa parte do público real não é isso: é a avó que cria o neto, a irmã mais velha que segura a casa, o pai que está tentando proteger duas crianças de uma vez.

**2. O Conselho Tutelar não aparece em lugar nenhum.** `grep -ril "Conselho" content/familia` devolve zero. O 100 existe, e está correto, em `components/familia/ContatosEmergencia.tsx`, com o telefone, o WhatsApp (61) 99611-0100, o Telegram e o atendimento em Libras, todos conferidos hoje na fonte oficial. Mas ele só aparece na página de segurança, sem nenhum texto que explique para quê.

**3. O módulo 6 quebra quando a casa não está junta.** Se o familiar para de pagar as dívidas de {{apelido}} e a avó continua pagando escondido, nada muda, e a briga passa a ser entre os dois adultos. Nenhum texto do programa trata disso, e é o ponto de falha silenciosa mais comum do método.

## O que fazer

### 1. Bloco "Quando a casa não está junta"

Entra em `content/familia/modulos/modulo-06.md`, depois de "Cuidar do dinheiro da casa" e antes de "Exercício da semana".

> ## Quando a casa não está junta
>
> Tem uma parte deste módulo que depende de outras pessoas, e vale dizer isso com clareza. Se você parar de cobrir e alguém da casa continuar cobrindo, pouca coisa muda, e a briga sai do problema e passa para dentro da família.
>
> Não é tarefa sua convencer mais ninguém. O que ajuda é uma conversa, com uma pessoa, sem reunião de família.
>
> Escolha quem mais faz o que você decidiu parar de fazer. Fale com essa pessoa a sós, num momento calmo, e sem explicar que você está fazendo um programa.
>
> Uma frase que costuma funcionar:
>
> "Eu decidi parar de pagar as contas de {{apelido}}. Não é castigo, e eu não vou te pedir para fazer igual. Eu só queria te contar antes de você saber por fora."
>
> ### Se a outra pessoa não topar
>
> Você ainda pode seguir, com menos efeito, e ainda vale a pena. Diga qual é o seu limite, não o dela: "isso é o que eu vou fazer, o que você faz é com você".
>
> Depois, não cobre, não vigie, não conte quanto a outra pessoa deu e não peça para ninguém escolher um lado. Cobrança entre adultos da casa rende meses de desgaste e nenhum resultado.
>
> ### Quando alguém na casa ironiza os momentos bons
>
> Acontece: você elogia, e alguém completa com "até que enfim" ou com um riso. Isso apaga o elogio.
>
> Não corrija na frente de {{apelido}}. Depois, faça um pedido concreto e pequeno: "quando ele estiver bem, não precisa elogiar, mas não comenta, tá?".
>
> ### Se a outra pessoa também bebe ou usa
>
> Aí o combinado não vai existir, e insistir só machuca você. Trabalhe o que depende de você, proteja o seu dinheiro e os seus documentos, e leve essa parte para um profissional.
>
> ### Onde buscar ajuda para a casa
>
> O CRAS orienta a família sobre direitos, benefícios e serviços da cidade, de graça. O CREAS atende famílias quando há violação de direitos. O CAPS da sua cidade também acolhe familiares. Se houver violência, 190 agora, e o 180 orienta sobre medida protetiva.
>
> @botao [Ver serviços perto de mim](/redes-de-apoio?tipo=publicas)

### 2. A página "O que dizer para uma criança"

Página livre nova em `/familia/criancas`, no mesmo padrão da `/familia/decisao` e das três páginas do N9: estática, texto inline, sem login, sem compra, sem `{{apelido}}`. Criança em casa é segurança, e por isso esta página não fica atrás de pagamento.

Texto final:

> # O que dizer para uma criança
>
> Se a criança está em risco agora, ligue 190. Se houve ou está havendo violência contra ela, o Conselho Tutelar da sua cidade e o 100 atendem, e o fim desta página explica como.
>
> ## Antes de começar, uma troca
>
> Os exemplos desta página falam do pai e da bebida, porque um exemplo precisa escolher alguém. Troque por mãe, filho, irmão, avó, ou o nome que a criança usa, e troque "bebida" pelo que acontece na sua casa.
>
> ## Ela já sabe que tem algo errado
>
> Crianças percebem clima, cheiro, voz diferente e porta batendo. O que o silêncio faz não é proteger: é deixar a criança montando a própria explicação do que está acontecendo.
>
> E crianças explicam com culpa. A versão que elas montam quase sempre tem elas no meio: foi porque eu briguei, foi porque eu dei trabalho, foi porque eu não fiz o suficiente.
>
> Então a conversa não é para contar uma novidade. É para trocar a versão que ela já tem por uma verdadeira, do tamanho dela.
>
> ## As três regras
>
> ### 1. A culpa não é dela
>
> Diga isso com estas palavras, e diga mais de uma vez, em dias diferentes: "isso não é culpa sua, e não é tarefa sua resolver".
>
> Vale dizer também as duas coisas que vêm junto: ela não causou, e ela não consegue fazer parar. Nenhuma criança fica bem enquanto acha que o jeito dela de se comportar decide se o pai bebe hoje.
>
> E vale dizer o que ela pode fazer: contar como está se sentindo para você ou para outro adulto de confiança, e continuar com a vida dela, a escola, os amigos, o que ela gosta.
>
> ### 2. A criança não é confidente
>
> O que você sente, você conta para um adulto. Chorar na frente dela pode acontecer, e não tem problema: o que não pode é ela virar a pessoa que te consola.
>
> Se escapar um desabafo, dá para consertar depois: "ontem eu falei de um jeito que não era pra você carregar, desculpa".
>
> ### 3. A criança não é mensageira e não é vigia
>
> Ela não avisa quando o pai chegou, não conta quanto ele bebeu, não esconde garrafa, não liga para você do banheiro, não cobra nada de ninguém.
>
> Se hoje ela já faz alguma dessas coisas, tire a tarefa dela com nome: "isso não é trabalho de criança, isso é meu".
>
> ## A verdade do tamanho dela
>
> ### Até 3 anos
>
> Não se explica, se previne. O que protege nessa idade é rotina igual todos os dias: as mesmas pessoas, o mesmo horário de dormir, a mesma comida no mesmo lugar.
>
> Se houver grito ou coisa quebrada, tire a criança do ambiente antes de qualquer outra coisa.
>
> ### 4 a 6 anos
>
> Frases curtas e concretas, uma por vez: "o papai está doente de um jeito que mexe com o jeito dele falar e andar. Tem gente cuidando disso. Você não tem culpa, e você vai ter quem cuida de você."
>
> Responda a pergunta que ela fez, e não a próxima. Repetir a mesma resposta muitas vezes é normal nessa idade, e cada repetição acalma.
>
> ### 7 a 11 anos
>
> Aqui ela já compara a casa dela com a casa dos amigos, e já sente vergonha. Dá para nomear: "é um problema com a bebida, e é uma doença. Ele não consegue parar com força de vontade, e é por isso que existe tratamento."
>
> O que mais acalma nessa idade é saber o que muda na vida dela: quem busca na escola, com quem ela fica, o que fazer se o pai chegar alterado. Combine um adulto de plantão, com nome e telefone, e deixe o número anotado com ela.
>
> ### 12 a 14 anos
>
> Provavelmente ela sabe mais do que você imagina, e já guardou segredo por você. Ouça antes de explicar: pergunte o que ela já percebeu e o que ela acha que está acontecendo.
>
> Dê informação de verdade, inclusive a parte difícil. Se ela perguntar se vai ficar assim também, a resposta honesta é que ter alguém na família com esse problema aumenta um pouco o risco dela, e que saber disso cedo ajuda a se cuidar: aprender sobre o assunto, pedir ajuda para pessoas seguras e cuidar de si são as coisas que diminuem esse risco.
>
> ### 15 a 17 anos
>
> Trate como quase adulto, sem dar tarefa de adulto. Conte o nome do problema, o que a família está fazendo e o que ainda não está resolvido.
>
> Depois faça uma pergunta e aguente o silêncio: "o que você precisa?". E ofereça alguém de fora para conversar, porque nessa idade falar com os pais sobre os pais é quase impossível.
>
> ### Em qualquer idade
>
> Separe a pessoa do problema: "o pai que você ama e a doença que ele tem não são a mesma coisa". E deixe a porta aberta, com uma frase que ela possa usar depois: "você pode falar disso comigo quando quiser, inclusive quando eu estiver de mau humor".
>
> ## O que não dizer
>
> - "Não conta pra ninguém." O segredo é o que mais machuca, e é o que deixa a criança sem socorro.
> - "Agora você é o homem da casa." Isso entrega uma função que não é dela.
> - "Se você se comportar, o papai melhora." Isso amarra o problema ao comportamento dela.
> - Falar mal de quem usa. Ela ama as duas pessoas, e vai ter que escolher entre defender e concordar.
> - Prometer que não vai acontecer de novo. Prometa o que você controla: que você vai contar a verdade e que ela vai estar cuidada.
>
> ## Quando é hora de pedir ajuda para a criança
>
> Alguns sinais pedem ajuda de fora, e pedir não é entregar sua família para ninguém:
>
> - faltar à escola, dormir na aula, cair muito de rendimento;
> - ficar sem comida, sem remédio, sem alguém responsável por ela;
> - ver violência dentro de casa, mesmo quando não é contra ela;
> - ficar com quem está sob efeito, sem outro adulto por perto, ou ser levada para lugar de uso ou de cobrança;
> - dor de barriga e dor de cabeça sem causa, voltar a fazer xixi na cama, medo de dormir;
> - se machucar, ou dizer que não quer mais viver. Nesse caso, procure atendimento hoje, e o 188 atende você a qualquer hora.
>
> A lei trata como violência psicológica expor a criança, direta ou indiretamente, a crime violento contra alguém da família, principalmente quando isso faz dela testemunha. Isso está na Lei 13.431, de 2017, e serve para você saber que o que ela está vendo conta, e não é exagero seu.
>
> ## Os serviços, e para que serve cada um
>
> - **Conselho Tutelar da sua cidade:** existe pelo menos um em cada município e atende casos de direito de criança ou adolescente ameaçado ou violado. O horário e o plantão são definidos por lei municipal, e em muitas cidades existe atendimento fora do horário comercial. Qualquer pessoa pode levar um caso, inclusive você, pela própria família. Ele pode pedir medidas de proteção e acionar a polícia e o Ministério Público.
> - **100, Disque Direitos Humanos:** recebe denúncia de violação de direitos de criança e adolescente, 24 horas, todos os dias, de graça. Pode ser anônima, não precisa de prova, e você recebe um número de protocolo para acompanhar. O 100 não substitui emergência: perigo agora é 190.
> - **Escola:** muitas vezes já percebeu antes de você contar. Uma conversa com a coordenação costuma render olhar atento e paciência com a criança, e não castigo.
> - **UBS e equipe de saúde da família:** porta de entrada do SUS, inclusive para a criança.
> - **CAPS infantojuvenil, o CAPSi:** atende criança e adolescente em sofrimento mental, de graça, e em algumas cidades também atende questões de uso de substância.
> - **CRAS e CREAS:** o CRAS orienta a família, o CREAS atende quando há direito violado.
> - **Defensoria Pública:** de graça, para guarda, pensão e medida de proteção.
> - **Alateen:** faz parte dos Grupos Familiares Al-Anon e é para jovens cuja vida foi afetada pela bebida de alguém. O site do Al-Anon do Brasil tem a busca de grupos, e vale conferir se existe um perto, porque não existe grupo em toda cidade.
>
> ## Se a casa está em separação
>
> Se houver elementos que mostrem risco de violência doméstica ou familiar, não cabe guarda compartilhada: a lei mudou nisso em 2023, e nesse caso a guarda fica com quem não é responsável pelo risco. Nas ações de guarda, o juiz pergunta às partes e ao Ministério Público sobre risco de violência antes da audiência.
>
> Existem medidas protetivas específicas para criança e adolescente desde 2022. Elas podem ser pedidas pelo Ministério Público, pela autoridade policial, pelo Conselho Tutelar ou por quem atua em favor da criança, e o juiz decide em até 24 horas.
>
> A Defensoria Pública da sua cidade cuida disso de graça. Você não precisa de advogado particular para proteger uma criança.
>
> ## Uma coisa sobre a Margem
>
> A Margem não comunica nada a ninguém, não acompanha a sua família e não entra em contato com escola, conselho ou polícia. Quem decide o que fazer com isto que você leu é você.

### 3. Uma linha no resultado, em modo segurança

No fim do bloco `[SEGURANCA]` de `content/familia/resultado-blocos.md`, acrescentar:

> Se tem criança ou adolescente morando com vocês, ela também está dentro disso, mesmo que não seja com ela a briga.
> [Ver o que dizer para uma criança](/familia/criancas)

### 4. Links

- `content/familia/modulos/modulo-06.md`, no fim do bloco "Quando a casa não está junta": `[Ver o que dizer para uma criança](/familia/criancas)`.
- `app/familia/seguranca/page.tsx`: o quarto link da lista criada no N9.
- Tela 0 do C8, nos problemas de exemplo: o item "As crianças perguntam o que está acontecendo" ganha, abaixo da lista, a linha "Se o seu problema é esse, comece por aqui" com o link da página.

## Código

- `app/familia/criancas/page.tsx`: página nova, estática, texto inline, com `// nivel-1` no topo, no mesmo padrão da `/familia/decisao` e das três páginas do N9. Sem `robots: noindex`.
- `content/familia/modulos/modulo-06.md`: bloco novo, sem condição. Aparece para todo mundo, inclusive para quem não tem criança em casa, porque a parte "quando a casa não está junta" vale para qualquer casa com mais de um adulto.
- `content/familia/resultado-blocos.md`: a linha nova no `[SEGURANCA]`.
- `docs/revisao-conteudo.md`: a página nova e o bloco do módulo 6 na lista "a publicar", como nível 1.
- **Não existe pergunta nova no diagnóstico neste briefing.** Chegamos a considerar perguntar se há criança na casa, para mostrar o conteúdo só a quem tem. A decisão é não perguntar: a página é aberta, o link está em três lugares, e uma pergunta a mais no diagnóstico custa conversão sem melhorar a proteção.
- O C8 ainda não foi construído (o `modulo-06.md` tem `acao=marcar`). A mudança da tela 0 é na especificação, para quando ele for construído.

## Critério de aceite

- `/familia/criancas` abre sem login e sem compra, em aba anônima, não quebra sem diagnóstico carregado e não contém `{{apelido}}`.
- O módulo 6 mostra "Quando a casa não está junta" para qualquer diagnóstico, antes do exercício.
- O resultado em modo segurança mostra a linha nova e o link funciona.
- `grep -rln "Conselho Tutelar" app/familia` encontra a página nova, e em nenhum texto a Margem aparece como quem comunica ou acompanha o caso.
- Nenhum texto desta página promete resultado, e nenhum diz para a criança guardar segredo.
- Lida em voz alta, a parte das faixas de idade funciona para quem tem uma criança de 5 anos e para quem tem uma de 16, sem parecer escrita para outra família.
- A página e o bloco do módulo 6 estão em `/docs/revisao-conteudo.md`, na lista "a publicar", como nível 1.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.

---

# Fontes, conferidas em 24/11/2026

**Criança**
- ECA, Lei 8.069/1990, arts. 131 a 136, e Resolução Conanda nº 139/2010: ao menos um Conselho Tutelar por município e as atribuições do art. 136. O horário de funcionamento e o regime de plantão são fixados por lei municipal, e a escala de plantão fora do horário comercial foi conferida em material de município, não em norma federal: é por isso que o texto da página diz "definidos por lei municipal".
- Lei 13.431/2017, art. 4º: expor a criança, direta ou indiretamente, a crime violento contra membro da família é violência psicológica, em especial quando a torna testemunha.
- Lei 14.344/2022, arts. 11, 13 e 16: atendimento pela autoridade policial, encaminhamento ao Conselho Tutelar e medidas protetivas de urgência pedidas pelo Ministério Público, pela autoridade policial, pelo Conselho Tutelar ou por quem atua em favor da criança, com decisão do juiz em 24 horas.
- Lei 14.713/2023: altera o art. 1.584, § 2º, do Código Civil, afastando a guarda compartilhada quando há elementos que evidenciem risco de violência doméstica ou familiar, e acrescenta o art. 699-A ao Código de Processo Civil.
- NACoA, os sete Cs, de Jerry Moe, e o material "Language with Kids": não causei, não controlo, não curo, e posso cuidar de mim contando o que sinto, fazendo escolhas boas e me valorizando. Também a orientação de separar a pessoa da doença e de falar com adolescente sobre risco familiar e sobre o que diminui esse risco.
- Disque 100: gratuito, 24 horas todos os dias, aceita denúncia anônima, não exige prova, dá protocolo e não substitui emergência. Canais oficiais do Ministério dos Direitos Humanos e da Cidadania: telefone 100, WhatsApp (61) 99611-0100, Telegram, atendimento em Libras e chat da Ouvidoria. Os canais no `ContatosEmergencia.tsx` conferem com a fonte oficial.
- Al-Anon do Brasil, al-anon.org.br: o Alateen faz parte dos Grupos Familiares Al-Anon, a busca de grupos está na página de grupos, e a sede atende em (11) 3331-8799 e (11) 3222-2099, das 12h às 18h.
- CVV: 188, nacional, 24 horas, sem custo de ligação, por convênio com o Ministério da Saúde, mais chat e e-mail em cvv.org.br.

## O que conferir antes de publicar

- Todo número de telefone e todo endereço de site deste arquivo, uma última vez. Serviço público muda canal sem avisar.

---

# Briefing N11: as demandas para o Gemini escrever o volume de baixo risco

Pré-requisito: ferramentas partes 1 e 2, briefing 00d, e o N9 aplicado antes do lote 5.

**Sessão 4 · claude.ai · este briefing não é para o Claude Code.** É para o fundador colar no notebook "familiar" do Gemini, um lote por conversa. O que volta do Gemini é rascunho: a revisão é do Claude, e só depois disso o texto entra em briefing para o Claude Code.

## Por que separar assim

O que o Gemini escreve aqui é tudo o que é volume e baixo risco: frase de exemplo, meta pequena, ideia de lazer, rótulo de chip. Errar nesses textos custa um item fraco numa lista. Errar num texto de internação, de dívida, de criança ou de segurança pode mudar o desfecho de uma noite, e é por isso que N9 e N10 não passam por aqui.

## Como rodar

1. Uma conversa nova por lote, no notebook "familiar". Lote grande na mesma conversa faz o modelo repetir o que já escreveu.
2. Cole o lote inteiro, inclusive as regras. Elas estão dentro de cada lote de propósito, para o lote funcionar sozinho, meses depois, sem este arquivo na frente.
3. Se a resposta vier vazia, cortada ou fora do formato, abra conversa nova e cole de novo. Não peça para continuar.
4. Guarde a resposta crua antes de mexer, para a revisão poder comparar.
5. Na revisão, o Claude diz quais itens mudou e por quê, e quantos descartou.

## Lote 1: frases F11 a F30 do "reescrever minhas frases"

```
Você escreve para a Margem, uma plataforma brasileira que acolhe pessoas com problema
com álcool, outras drogas ou apostas, e as famílias dessas pessoas. Quem vai ler é um
familiar com muito cansaço, no celular, num dia difícil.

TAREFA
Escrever 20 pares de frases, numerados de F11 a F30. Cada par tem:
- a frase "de antes": o que costuma sair na hora da raiva, dentro de casa, no Brasil;
- a frase "nova": a mesma intenção dita de um jeito que não vira briga;
- três etiquetas de habilidade, escolhidas APENAS nesta lista de oito:
  sentimento, pedido, fato, breve, valorizar, ajuda, compreensão, parte.
  ("parte" é quando a pessoa reconhece a parte dela: "acho que eu falei num tom duro".)

JÁ EXISTEM ESTES DEZ. NÃO REPITA O TEMA DE NENHUM DELES:
1. "Você nunca ajuda em nada nesta casa." / "A casa tá pesando pra mim esta semana. Você pode lavar a louça hoje?"
2. "Nossa, resolveu aparecer? Milagre!" / "Que bom que você veio jantar. Eu gosto muito quando a gente come junto."
3. "Você não tem responsabilidade nenhuma." / "Ontem você perdeu o compromisso das 9h, e isso me deu medo. Se quiser, eu te lembro na próxima."
4. "Tá escondendo alguma coisa de novo, né?" / "Quando você chega tarde sem avisar, eu fico com medo. Me manda uma mensagem quando atrasar?"
5. "Você gastou tudo de novo! Vai acabar com a família!" / "Vi que a conta ficou no negativo e fiquei com medo. Vamos sentar no domingo para olhar as contas juntos?"
6. "Se continuar assim, eu vou embora." / "Eu tô no meu limite com essas brigas. Queria muito ter dias mais tranquilos com você."
7. "Olha todo mundo da sua idade trabalhando, e você aí." / "Eu sei que tá difícil achar o seu caminho. Se quiser, eu te ajudo a procurar alguma coisa."
8. "Você estragou o fim de semana de novo." / "Eu fiquei triste de não sair no sábado. Queria muito passear com você no próximo."
9. "Onde você tava? Com quem? Quanto gastou?" / "Eu me preocupei ontem à noite. E acho que exagerei mandando tanta mensagem."
10. "Eu não aguento mais ver você se destruindo." / "Eu te amo e fico com medo de te ver assim. Tô aqui se você quiser conversar."

OS 20 NOVOS DEVEM COBRIR, UM TEMA CADA, NESTA ORDEM:
F11 pedido de dinheiro na hora
F12 promessa que não foi cumprida
F13 mentira descoberta
F14 voltar a usar depois de um tempo bem
F15 chegar em casa sob efeito na frente das crianças
F16 querer dirigir depois de beber
F17 parente de fora dando palpite na frente de todos
F18 vergonha do que os vizinhos ou a família vão pensar
F19 faltar no trabalho de novo
F20 celular na mão de madrugada
F21 festa de família chegando
F22 remédio da farmácia acabando antes do fim do mês
F23 tratamento começado e abandonado
F24 aniversário ou data importante esquecida
F25 pedir o carro emprestado
F26 sumir por um dia sem avisar
F27 saúde piorando e exame não feito
F28 pedir para parar por amor a alguém da casa
F29 dividir a conta da casa que não fecha
F30 silêncio de dias dentro de casa

REGRAS DE ESCRITA, TODAS OBRIGATÓRIAS
- Português do Brasil falado, como gente fala em casa. Sem "vossa", sem gíria regional forte,
  sem palavra difícil.
- A frase nova tem que caber numa respiração. No máximo 20 palavras.
- Sem travessão em lugar nenhum. Use vírgula ou ponto.
- Sem nenhuma palavra que marque gênero de quem lê. Nada de "sozinho", "preocupada",
  "cansado". Se precisar, mude a frase.
- Palavras proibidas, em qualquer lugar: viciado, viciada, alcoólatra, bêbado, bêbada,
  drogado, drogada, jogador compulsivo, dependente, jornada, transformar, empoderar,
  resgatar, "é só", "basta".
- A frase nova não promete resultado e não cobra promessa em troca.
- A frase nova não pode ter "mas" depois de uma parte boa. "Eu te amo, mas..." soa como bronca.
- A frase nova nunca usa "você sempre" nem "você nunca".
- Onde entraria o nome da pessoa que usa, escreva exatamente {{apelido}}.
- Nenhuma frase pode citar programa, aplicativo, terapia ou método.

CALIBRAÇÃO
Boa: "Vi que o dinheiro do mês acabou antes. Me ajuda a olhar as contas no sábado?"
  (fato, pedido possível, curta.)
Boa: "Fiquei com medo quando você pegou a chave do carro. Eu te levo onde você precisar."
  (sentimento, oferta concreta, sem acusação.)
Ruim: "Eu entendo que você esteja passando por um momento difícil, mas você precisa
  entender que suas atitudes afetam toda a família." (longa, "mas", sermão.)
Ruim: "Se você me ama, você para." (chantagem, e não é pedido.)

FORMATO DA RESPOSTA
Uma tabela com quatro colunas: ID, Frase de antes, Frase nova, Habilidades.
Nada antes da tabela e nada depois. Sem introdução, sem comentário, sem explicação.
```

**O que o Claude confere depois:** tema repetido com F1 a F10, frase nova com mais de 20 palavras, "mas" no meio, gênero marcado, etiqueta fora das oito, palavra proibida, e se a frase nova resolve de verdade a intenção da frase de antes. Descarte sem pena: 20 pares bons valem mais que 30 medianos.

## Lote 2: mais exemplos de meta por área

```
Você escreve para a Margem, uma plataforma brasileira que acolhe famílias de pessoas com
problema com álcool, outras drogas ou apostas. Quem vai ler é um familiar com muito
cansaço, que vai escolher uma meta pequena para a própria semana.

TAREFA
Escrever 4 exemplos novos de meta para cada uma das 8 áreas abaixo, 32 no total. Cada
exemplo é um chip tocável: a pessoa toca e ele preenche o campo "o que você vai fazer",
que continua editável.

AS 8 ÁREAS E OS 4 EXEMPLOS QUE JÁ EXISTEM EM CADA. NÃO REPITA NENHUM:
Sono e saúde: Beber um copo de água ao acordar, em 3 dias | Deitar 30 minutos mais cedo, em 2 noites | Fazer uma refeição sem celular, em 3 dias | Caminhar 15 minutos, em 2 dias
Família: Mandar uma mensagem carinhosa para um parente, 1 vez | Conversar 10 minutos sobre um assunto leve com alguém da casa, em 2 dias | Fazer uma refeição em família sem falar do problema, 1 vez | Ver um filme com alguém da família no fim de semana
Amizades e vida social: Mandar um "oi, sumi" para alguém de quem sinto falta, 1 vez | Ligar 10 minutos para uma pessoa amiga, 1 vez | Tomar um café com alguém, 1 vez | Marcar um encontro no fim de semana
Lazer: Ouvir 3 músicas de que eu gosto, 1 dia | Ver um episódio de uma série só por prazer, 1 vez | Ler 5 páginas de um livro, em 2 dias | Reservar 1 hora no fim de semana para algo de que eu gosto
Trabalho ou estudo: Fazer uma pausa de 5 minutos para respirar no trabalho, em 2 dias | Organizar meu espaço no começo de 1 dia | Parar de trabalhar no horário, em 2 dias | Listar as 3 prioridades da semana na segunda
Dinheiro: Anotar o que eu gastei em 1 dia | Conferir meu saldo antes de uma compra, 1 vez | Listar as contas essenciais do mês, 1 vez | Separar um valor pequeno só meu, 1 vez
Vida emocional: Fazer 3 respirações lentas quando a ansiedade subir, em 2 dias | Escrever 3 coisas boas do dia, 1 vez | Ficar 10 minutos em silêncio, só para mim, em 2 dias | Contar para alguém de confiança como eu estou, 1 vez
Sentido, do seu jeito: Olhar o céu ou uma planta por 5 minutos, em 2 dias | Um momento de reflexão ou oração ao acordar, em 3 dias | Escrever uma frase que me faz bem, 1 vez | 15 minutos de leitura ou silêncio no fim de semana

REGRAS, TODAS OBRIGATÓRIAS
- Dá para saber se a pessoa fez. "Caminhar 15 minutos" serve, "me cuidar mais" não serve.
- Cabe num dia ruim. Se precisa de 1 hora livre, de dinheiro ou de boa vontade de outra
  pessoa, não serve.
- Depende só de quem lê. Nada que precise da pessoa que usa, nem de ninguém da casa.
- Custo zero ou quase zero. Nada de academia, curso, viagem, terapia paga, compra.
- Tem quantidade no fim, no mesmo formato dos exemplos: "em 2 dias", "em 3 dias", "1 vez",
  "no fim de semana".
- No máximo 60 caracteres por exemplo, contando a quantidade.
- Sem travessão. Sem palavra que marque gênero de quem lê.
- Palavras proibidas: viciado, viciada, alcoólatra, bêbado, bêbada, drogado, drogada,
  jogador compulsivo, dependente, jornada, transformar, empoderar, resgatar, "é só", "basta".
- Nada que envolva bebida, aposta ou dinheiro apostado, nem em "Lazer".
- Nada de meta sobre a pessoa que usa. Esta lista é sobre a vida de quem lê.
- Nada religioso de uma religião só. "Sentido, do seu jeito" aceita oração e aceita silêncio.

CALIBRAÇÃO
Boa: "Tomar banho sem pressa, em 2 dias" (concreta, pequena, de graça, só depende de quem lê.)
Boa: "Levar a marmita em vez de pular o almoço, em 3 dias" (observável e cabe num dia corrido.)
Ruim: "Ter mais paciência" (ninguém sabe se fez.)
Ruim: "Marcar uma consulta com a nutricionista" (custa dinheiro e depende de agenda de terceiro.)

FORMATO DA RESPOSTA
Uma tabela com duas colunas: Área, Exemplo. Uma linha por exemplo, 32 linhas.
Nada antes e nada depois da tabela.
```

**O que o Claude confere depois:** meta que depende de outra pessoa, meta com custo, meta sem quantidade, meta acima de 60 caracteres, e repetição disfarçada de um dos 32 que já existem.

## Lote 3: mais ideias de lazer por tipo de busca do diário

```
Você escreve para a Margem, uma plataforma brasileira que acolhe famílias de pessoas com
problema com álcool, outras drogas ou apostas. Quem vai ler é um familiar que está
montando uma lista do que a pessoa que usa gosta de fazer, para ter algo bom à mão
justamente nos horários mais difíceis.

TAREFA
Escrever 5 ideias novas para cada uma das 6 buscas abaixo, 30 no total. Cada ideia é um
chip tocável que preenche um campo editável. A ideia é algo que pode trazer, de outro
jeito, aquilo que o uso parece trazer.

AS 6 BUSCAS E AS 5 IDEIAS QUE JÁ EXISTEM EM CADA. NÃO REPITA NENHUMA:
Relaxar: Ouvir uma música calma juntos | Um banho demorado | Sentar na varanda ou na calçada para ver o movimento | Um chá ou café no fim da tarde | Uma massagem nos ombros
Se divertir: Ver um filme de comédia juntos | Uma partida de baralho ou dominó | Ver vídeos engraçados juntos | Olhar fotos de momentos bons | Cozinhar uma receita nova
Se enturmar: Chamar amigos ou parentes para um café em casa | Um passeio na praça do bairro | Ver um jogo de futebol com a família | Um lanche com gente querida | Uma ligação de vídeo com alguém de quem {{apelido}} gosta
Alívio de um problema: Uma caminhada ao ar livre | Ajudar a colocar o problema no papel | Resolver juntos uma pendência pequena | Um tempo em silêncio, sem cobrança | Conversar sobre outra coisa
Sentir emoção: Assistir a um jogo importante do time | Um esporte ou exercício juntos | Um passeio a um lugar novo | Montar ou consertar algo juntos | Ver um filme de ação ou suspense
Conseguir dormir: Quarto escuro e silencioso | Um som de chuva para dormir | Um leite ou chá quente antes de deitar | Deixar o celular longe na hora de deitar | Uma rotina tranquila no fim da noite

REGRAS, TODAS OBRIGATÓRIAS
- Nada que envolva bebida, dinheiro, aposta, sorteio ou jogo de apostar. Nem como piada.
- Custo zero ou quase zero, e possível em casa, na rua da casa ou no bairro.
- Possível num dia comum, sem planejar com antecedência, sem carro e sem marcar com ninguém
  de fora, com exceção da busca "Se enturmar".
- Entre 3 e 8 palavras por ideia.
- Serve para gente de qualquer idade e de qualquer cidade do Brasil, inclusive cidade
  pequena.
- Sem travessão. Sem palavra que marque gênero.
- Palavras proibidas: viciado, viciada, alcoólatra, bêbado, bêbada, drogado, drogada,
  jogador compulsivo, dependente, jornada, transformar, empoderar, resgatar, "é só", "basta".
- Onde entraria o nome da pessoa que usa, escreva exatamente {{apelido}}.
- Não escreva frase de instrução nem explicação. A ideia é um rótulo curto.
- Metade das ideias de cada busca deve ser coisa de fazer junto, e metade coisa que a
  própria pessoa faz sozinha, porque nem todo dia dá para estar perto.

CALIBRAÇÃO
Boa, em Relaxar: "Regar as plantas no fim do dia" (curta, de graça, cabe em qualquer casa.)
Boa, em Conseguir dormir: "Ventilador ligado, luz apagada" (concreta e sem custo.)
Ruim: "Fazer uma viagem de fim de semana" (custa, precisa planejar.)
Ruim: "Tomar um chopp assistindo ao jogo" (envolve bebida.)

FORMATO DA RESPOSTA
Uma tabela com duas colunas: Busca, Ideia. Uma linha por ideia, 30 linhas.
Nada antes e nada depois da tabela.
```

**O que o Claude confere depois:** qualquer coisa com bebida, dinheiro ou aposta sai na hora, pelo critério de aceite do C4. Depois: custo escondido, ideia que só existe em cidade grande, ideia com mais de 8 palavras, e o equilíbrio entre junto e sozinho.

## Lote 4: variações de chip do diário

```
Você escreve para a Margem, uma plataforma brasileira que acolhe famílias de pessoas com
problema com álcool, outras drogas ou apostas. Quem vai ler é um familiar anotando, em
menos de um minuto, um momento difícil que acabou de acontecer em casa.

CONTEXTO QUE MUDA TUDO NESTA TAREFA
Estes chips não são frases: são CATEGORIAS. O sistema conta quantas vezes cada uma foi
marcada e, no fim da semana, mostra a mais comum como pista. Uma categoria que acontece
uma vez só na vida de uma família não serve para nada: ela nunca vira pista. Então cada
chip precisa ser geral o suficiente para se repetir em semanas diferentes, e específico o
suficiente para dizer alguma coisa.

TAREFA
Escrever no máximo 4 chips novos para cada uma das 5 perguntas abaixo, 20 no total.
Menos de 4 é aceitável se você não tiver 4 boas: escreva só as boas.

AS 5 PERGUNTAS E OS CHIPS QUE JÁ EXISTEM. NÃO REPITA NENHUM:
1. "O que aconteceu pouco antes?": Estresse ou cansaço | Discussão ou clima pesado em casa | Notícia ruim ou preocupação | Tédio ou tempo livre | Encontro, festa ou comemoração | Dinheiro recebido | Dia ou horário em que costuma acontecer | Não sei
2. "O que você percebeu?": Fala ou tom de voz diferente | Humor mudou de repente | Irritação ou agitação | Muito silêncio ou isolamento | Sono ou cansaço fora do normal | Desequilíbrio ou desatenção | Celular o tempo todo
3. "O que você acha que a pessoa buscou com isso?": Relaxar | Se divertir | Se enturmar | Fugir de um problema | Sentir emoção | Conseguir dormir | Não sei
4. "E você, como reagiu?": Briguei ou discuti | Tentei convencer a parar | Fiquei em silêncio | Fingi que não vi | Resolvi por ela | Conversei com calma | Saí de perto para me proteger
5. "Como ficou depois?": Clima pesado em casa | Foi dormir ou se fechou | Pediu desculpas ou mostrou arrependimento | Ninguém tocou no assunto | Conversamos com calma depois | Eu fiquei com raiva, medo ou sem energia

REGRAS, TODAS OBRIGATÓRIAS
- Entre 2 e 6 palavras por chip.
- Cada chip tem que ser uma coisa que pode acontecer em muitas semanas diferentes.
- Dois chips da mesma pergunta não podem se sobrepor. Se um familiar ficaria em dúvida
  sobre qual marcar, um dos dois está errado.
- Nada que peça interpretação de dentro da cabeça da outra pessoa, exceto na pergunta 3,
  que já é declarada como palpite.
- Na pergunta 4, nenhum chip pode julgar quem lê. "Perdi a paciência" serve,
  "explodi sem motivo" não serve.
- Sem travessão. Sem palavra que marque gênero de quem lê nem da outra pessoa.
- Palavras proibidas: viciado, viciada, alcoólatra, bêbado, bêbada, drogado, drogada,
  jogador compulsivo, dependente, jornada, transformar, empoderar, resgatar, "é só", "basta".
- Não escreva "Outro" nem "Não sei": eles já existem e ficam sempre no fim.
- Nada específico de uma substância só: isso vai em outro lote.

CALIBRAÇÃO
Boa, na pergunta 1: "Cobrança ou conta vencida" (repete, e é diferente de "notícia ruim".)
Boa, na pergunta 5: "Saiu de casa e demorou" (observável e conta uma coisa nova.)
Ruim: "Lembrou da infância" (não dá para saber, e quase não repete.)
Ruim: "Ficou nervoso" (se sobrepõe a "Irritação ou agitação".)

FORMATO DA RESPOSTA
Uma tabela com duas colunas: Pergunta (o número), Chip. Nada antes e nada depois.
```

**O que o Claude confere depois:** sobreposição com chip existente, chip que não repete, julgamento na pergunta 4, e o total. O limite de 4 por pergunta não é estético: categoria demais dilui a contagem e o resumo da semana para de achar "o mais comum", que é exatamente o que o briefing M2b entrega. Se um chip novo for bom mas raro, ele fica de fora.

## Lote 5, depois do N9: chips por substância

Só rode este lote depois de o N9 estar aplicado, porque ele depende do campo `substancias` existir. Os chips entram nos extras por problema que o diário já tem, do mesmo jeito que hoje existem extras para álcool, outras drogas e apostas.

```
Você escreve para a Margem, uma plataforma brasileira que acolhe famílias de pessoas com
problema com álcool, outras drogas ou apostas. Quem vai ler é um familiar anotando um
momento difícil em menos de um minuto.

CONTEXTO
Estes chips são categorias que o sistema conta para mostrar o padrão da semana. Eles
aparecem só para quem marcou aquela substância específica no começo do programa.

TAREFA
Escrever 3 chips para "O que aconteceu pouco antes?" e 3 chips para "O que você percebeu?"
para cada uma destas três situações, 18 no total:
A. crack ou cocaína
B. remédio de farmácia, como calmante, remédio para dormir e remédio para dor
C. maconha

EXEMPLOS DO QUE JÁ EXISTE, PARA OUTROS CASOS. NÃO REPITA:
Álcool, antes: Fim do expediente | Fim de semana ou véspera de feriado | Jogo de futebol ou encontro com quem bebe
Outras drogas, antes: Muito tempo no quarto, longe de todo mundo | Mensagem ou ligação de alguém específico | Saída à noite com certas companhias
Apostas, antes: Celular na mão sem nada para fazer | Vontade de recuperar uma perda | Notificação ou propaganda de aposta

REGRAS, TODAS OBRIGATÓRIAS
- Entre 2 e 6 palavras por chip.
- Só o que um familiar vê de fora, sem revistar nada e sem perguntar nada.
- Cada chip tem que poder se repetir em semanas diferentes.
- Nada que ensine a reconhecer, comprar, guardar ou usar qualquer substância.
- Nada que descreva quantidade, preço, ponto de venda, nome de boca de fumo, nem o jeito
  de usar.
- Nada que soe como ficha policial. O familiar está anotando a própria casa.
- Sem travessão. Sem palavra que marque gênero.
- Palavras proibidas: viciado, viciada, alcoólatra, bêbado, bêbada, drogado, drogada,
  jogador compulsivo, dependente, jornada, transformar, empoderar, resgatar, "é só", "basta".

CALIBRAÇÃO
Boa, em B, antes: "Receita vencendo ou caixa acabando" (visível, repete, sem julgar.)
Boa, em C, percebeu: "Olhos vermelhos e muita fome" (visível de fora e comum.)
Ruim: "Comprou 10 reais de pedra" (quantidade e preço, e isso não é dado para anotar.)
Ruim: "Pupilas dilatadas e nariz escorrendo" (vira exame médico dentro de casa.)

FORMATO DA RESPOSTA
Uma tabela com três colunas: Situação (A, B ou C), Pergunta, Chip. 18 linhas.
Nada antes e nada depois.
```

**O que o Claude confere depois:** qualquer chip que ensine algo sobre a substância sai, mesmo que seja verdade. A pergunta que resolve: se este chip aparecesse num post público, ele informaria quem quer usar? Se sim, ele não entra.

## Critério de aceite do N11

- Cada lote funciona colado sozinho numa conversa nova, sem este arquivo na frente.
- Cada lote tem: papel, tarefa, o que já existe, regras, calibração com dois exemplos bons e dois ruins, e formato de saída exato.
- Nenhum lote pede texto de tela de risco: internação, dívida, desaparecimento, criança, violência, autolesão e segurança não aparecem em nenhum lote.
- Nenhum lote cita o nome do método.
- A lista de palavras proibidas está dentro de cada lote, por extenso.
- Depois de cada lote, a revisão do Claude diz o que mudou, o que descartou e por quê.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida, inclusive dentro dos lotes.
