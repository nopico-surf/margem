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
