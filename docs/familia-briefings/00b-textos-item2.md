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
