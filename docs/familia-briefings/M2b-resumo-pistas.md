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
