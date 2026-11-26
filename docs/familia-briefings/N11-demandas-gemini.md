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
