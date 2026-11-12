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
