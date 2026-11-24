# Fôlego: briefings N0 a N4

Esta rodada aplica a proposta de `claude/programa-familia-melhorias-conteudo.md`. Dois fatos novos valem sobre tudo o que foi escrito antes:

1. **O programa tem nome: Fôlego.**
2. **Não existe revisão clínica externa.** Toda marca `[REVISÃO CLÍNICA]` nos documentos anteriores deixa de ser um bloqueio e passa a seguir o protocolo do briefing N2.

Textos escritos e revisados aqui, sem passagem pelo Gemini. Onde este arquivo e os documentos anteriores tratarem do mesmo texto, **vale este arquivo**.

Cada briefing abaixo abre com o modelo e o esforço com que ele deve ser executado, para funcionar colado sozinho, sem o mapa na frente.

**Como entregar isso ao Claude Code:** salve este arquivo no repositório, em `docs/familia-briefings/folego-N0-a-N4.md`, e aponte o Claude Code para ele. Os quatro briefings da sessão 1 são um pacote: colar um sozinho faz o Claude Code trabalhar com meia instrução e perguntar coisas que já estão respondidas no briefing seguinte.

---

# Briefing N0: as 6 sessões, na ordem

São 6 sessões: 3 de escrita no claude.ai e 3 no Claude Code. Os números dos briefings seguem a ordem de execução.

| Sessão | O que acontece | Onde | Modelo | Esforço |
|---|---|---|---|---|
| **1** | Aplicar **N1** (nome), **N2** (fim do gate), **N3** (correções) e **N4** (régua, amostra, nome do método). Os quatro já estão escritos neste arquivo. | Claude Code | Sonnet 5.5 | médio |
| **2** | Escrever **N5** (trilha "O que é seu") e **N6** (raiva, luto, vontade de ir embora) | claude.ai | Opus 5.5 | máximo |
| **3** | Escrever **N7** (voz do outro lado) e **N8** (biblioteca do "está acontecendo agora") | claude.ai | Opus 5.5 | alto |
| **4** | Escrever **N9** (internação e substâncias separadas), **N10** (crianças e resto da casa) e **N11** (demanda para o Gemini) | claude.ai | Opus 5.5 | extra alto, com busca na web ligada |
| **5** | Aplicar tudo o que saiu das sessões 2, 3 e 4, de uma vez | Claude Code | Sonnet 5.5 | médio |
| **6** | Rodar o teste de palavras proibidas, gênero e travessão, e conferir os estados no celular | Claude Code | Sonnet 5.5 | médio |

**Exceção da sessão 5:** as duas únicas partes com lógica de verdade são a biblioteca do "agora" no painel e o bloco novo que abre a página de resultado. As duas decidem estado, ordem de tela e o que aparece em modo segurança. Essas duas, **Opus 5, esforço alto**. O resto é markdown de módulo e card, e é Sonnet.

**Exceção da sessão 6:** o teste de palavras não é trabalho de modelo. É um script no repositório, determinístico, que roda sozinho. Modelo nisso erra mais que regex.

## Por que a escrita está agrupada assim

Cada sessão de escrita junta textos do mesmo registro, porque texto do mesmo tipo escrito na mesma conversa sai com a mesma voz.

- **Sessão 2** é o programa falando com a pessoa sobre ela mesma. N5 e N6 se encostam o tempo todo, e separar faria os dois dizerem a mesma coisa com palavras diferentes. Esforço máximo porque o N6 define o teto: "E se eu quiser sair" é o texto de maior risco ético do conjunto.
- **Sessão 3** é texto curto. Blocos de voz e fichas de 30 segundos. Concisão sob restrição é um registro próprio, e é mais difícil que texto longo.
- **Sessão 4** é o que tem lei, prazo, número e serviço público. Precisa de busca ligada e de verificação, e nada ali pode sair de memória. N9 e N10 são nível 1 do briefing N2. O N11 fecha a sessão porque é escrever instrução, não conteúdo.

## Duas regras que economizam dinheiro e retrabalho

**Não divida uma sessão de escrita entre dois modelos.** Se a sessão 2 começar no Opus e o Sonnet terminar os dois últimos blocos, os dois últimos vão soar diferentes. É o tipo de inconsistência que ninguém percebe lendo e todo mundo sente usando.

**O Claude Code não precisa de Opus para quase nada desta rodada,** porque a decisão já está nos briefings. Se ele começar a perguntar o que escrever, o briefing está incompleto: volta para a sessão de escrita em vez de subir o modelo lá.

Nenhum modelo pequeno escreve texto de tela neste produto.

## Os prompts das sessões de escrita

Um por sessão, para colar no começo. Todos pressupõem que este arquivo e os anteriores estão no projeto.

**Sessão 2** · claude.ai · Opus 5.5 · esforço máximo
> Escreva os briefings N5 e N6 do Fôlego, nesta ordem, texto final pronto para o Claude Code.
> N5, trilha "O que é seu": os 8 blocos finais, um por módulo, de 5 a 10 linhas cada, com a ação de dois minutos e o botão de cada um. Mais o bloco novo "O que isso está fazendo com você", que passa a abrir a página de resultado do diagnóstico, nas versões normal, cautela e segurança, usando o resultado do PHQ-4 que já é coletado ali.
> N6: os blocos "Você também tem raiva", "Saudade de quem ainda está aqui" e "E se eu quiser sair", decidindo onde cada um encaixa. No "E se eu quiser sair", separe sair da relação de sair do papel de resolver tudo, dê o checklist do que ter na mão antes de decidir e os serviços públicos, sem recomendar nenhum dos dois caminhos e sem usar linguagem de codependência.
> Não passe nada pelo Gemini.

**Sessão 3** · claude.ai · Opus 5.5 · esforço alto
> Escreva os briefings N7 e N8 do Fôlego, nesta ordem, texto final pronto para o Claude Code.
> N7: 8 blocos "Do outro lado" (como a reação da família chegava para quem estava usando) e 8 blocos "Quem já estava aqui" (um familiar contando a semana que a pessoa está vivendo), um par por módulo. Curtos, sem moral da história no fim, com a etiqueta de composição embaixo de cada um. Defina também a regra de escrita desses blocos para o futuro.
> N8: as 8 fichas da biblioteca do "está acontecendo agora", no formato Agora, O que não fazer hoje, Uma frase, Amanhã. Inclua a ficha da cobrança de dívida de terceiro em casa e a ficha "Eu não aguento hoje". Defina quais ficam abertas sem compra e como elas aparecem no painel sem roubar o lugar do módulo da semana.

**Sessão 4** · claude.ai · Opus 5.5 · esforço extra alto · busca na web ligada
> Escreva os briefings N9, N10 e N11 do Fôlego, nesta ordem, texto final pronto para o Claude Code. Confirme na web toda lei, prazo, número e nome de serviço antes de escrever, e não use nada de memória.
> N9: o bloco sobre internação (o que a lei permite, o que ela não resolve, como avaliar uma clínica, o que fazer no lugar) e os blocos novos de substância, separando crack e cocaína, remédio de farmácia e maconha, que hoje estão todos em "outras drogas". Inclua o conteúdo de segurança que falta para dívida com terceiro e para desaparecimento.
> N10: os blocos "Quando a casa não está junta" e "O que dizer para uma criança", com faixas de idade, as três regras (a criança não é confidente, não é mensageira, a culpa não é dela) e os serviços, incluindo Conselho Tutelar e 100.
> N9 e N10 são nível 1 do briefing N2.
> N11: as demandas para o Gemini escrever o volume de baixo risco (frases F11 a F30 do reescrever frases, mais exemplos de meta por área, mais ideias de lazer por tipo de busca do diário, variações de chip), uma demanda por lote, com as regras de escrita embutidas, pronta para colar no notebook.

---

# Briefing N1: o programa passa a se chamar Fôlego

**Sessão 1 · Claude Code · Sonnet 5.5 · esforço médio.** O texto já está pronto aqui. Não é escrita, é substituição.

**Este briefing não cria tela nem bloco novo.** Ele troca texto que já existe e acrescenta um rótulo. Se algum lugar listado abaixo não existe hoje, pule esse lugar e diga, em vez de construir a tela.

## 1. A regra

O nome do programa é **Fôlego**. Sempre com acento circunflexo, sempre com maiúscula inicial, nunca em caixa alta, nunca "Programa Fôlego da Margem" (redundante). Em código, URL e nome de arquivo: `folego`, sem acento.

A rota **continua sendo `/familia`**. Não renomeie rota, arquivo, tabela ou componente: o ganho é zero e o risco de quebrar é alto.

O nome não ganha logo nem símbolo próprio. Ele é tratamento tipográfico dentro do Margem System, e na primeira aparição de cada tela vem sempre acompanhado de "um programa da Margem".

## 2. Onde o nome aparece

**a) LP, acima do título do hero** (rótulo novo, 14px, cor secundária, no estilo de rótulo que o design system já tem):
> Fôlego · um programa da Margem

O título do hero **não muda**: "Você não precisa escolher entre ajudar quem você ama e cuidar de você."

**b) LP, subtítulo do hero** (substitui o atual):
> O Fôlego é um programa de 8 semanas para quem convive com alguém que tem problema com álcool, outras drogas ou apostas. Você aprende o que dizer, ensaia antes e conta com psicólogos e psiquiatras parceiros da Margem.

**c) Título da aba** (em toda a área do programa, inclusive LP, diagnóstico, resultado e painel):
> Fôlego · Margem

Isso substitui qualquer título atual que contenha "família", "familiares", "álcool", "drogas" ou "apostas". A regra de discrição passa a ser cumprida pelo próprio nome.

**d) Painel.** O título que está lá hoje passa a ser:
> Fôlego

Só isso. **Não crie topo novo e não acrescente "Semana X de 8" aqui.** O contador de semana pertence ao card do módulo atual, dentro do bloco "Esta semana", como a especificação de ferramentas parte 2 já definiu. Se esse bloco ainda não existe, o N1 não é o briefing que o constrói.

**e) Checkout, etapa 1.** São os dois cards de plano, e o nome de cada um passa a ser:
> **Fôlego**
> **Fôlego com acompanhamento**

O selo "20% de desconto" continua só no segundo card, e continua sendo um selo só, sem "Recomendado" ao lado, como está no briefing 01d.

**f) Confirmação do pagamento:**
> O acesso às 8 semanas do Fôlego já está liberado para você.

**g) Assunto do recibo por e-mail:** continua "Seu recibo Margem". Não acrescente o nome do programa.

**h) Descrição do Pix no extrato:** continua "Margem", sozinho. Não use "Fôlego" aqui: o nome é discreto na tela, mas um nome desconhecido no extrato convida pergunta.

## 3. Onde o nome não aparece

- Na frase que a pessoa pode dizer para {{apelido}}. No módulo 5, a opção de abrir continua sendo "Eu tenho feito um programa para lidar melhor com tudo isso", sem o nome. Quem está nessa conversa não precisa dar nome ao que está fazendo.
- Em nenhuma notificação, porque não existem.
- Em nenhum lugar onde hoje esteja escrito "Margem" sozinho. O nome do programa se soma, não substitui a marca.
- Em tela de emergência e no plano de segurança. Ali não entra nome de produto.

## 4. A FAQ

A pergunta "O que é o Fôlego?" não é escrita aqui. Ela já está dentro da FAQ nova, completa, no briefing N3, que é da mesma sessão. Não escreva FAQ neste briefing e não deixe a FAQ de fora: aplique o N3.

## 5. Critério de aceite

- Nenhum título de aba na área do programa contém "família", "familiares", "álcool", "drogas" ou "apostas".
- A rota `/familia` continua funcionando e nenhum arquivo foi renomeado.
- "Fôlego" aparece com acento em toda tela e sem acento em todo identificador de código.
- Nenhuma tela nova foi criada por causa deste briefing.
- A frase do convite do módulo 5 não cita o nome.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.

---

# Briefing N2: a revisão clínica externa deixa de existir

**Sessão 1 · Claude Code · Sonnet 5.5 · esforço médio.** É remoção de marca e criação de um arquivo de controle.

## 1. O que muda

Não haverá psicóloga parceira revisando o conteúdo. A curadoria é interna. Todas as marcas `[REVISÃO CLÍNICA]` dos documentos anteriores deixam de ser bloqueio de publicação.

Isso não vira liberação geral. Vira três níveis, e o nível decide o que acontece antes de o texto ir para produção.

## 2. Os três níveis

**Nível 1, bloqueado até o fundador ler em voz alta.** Nenhum desses textos sobe sem leitura explícita. São os textos em que um erro de palavra muda o desfecho:
- Tudo na página de segurança e no plano de segurança.
- `ALERTA_AUTOLESAO`, `HISTORICO_AUTOLESAO` e a pergunta de segurança do check-in.
- `AVISO_ALCOOL_DIARIO` e `AVISO_ALCOOL_NAO_SEI`.
- Qualquer texto novo sobre criança, internação, dívida com terceiro ou violência.
- O enunciado e as perguntas do PHQ-4.
- As fichas 2, 4 e 6 da biblioteca do "agora" (briefing N8).

**Nível 2, sobe e é lido depois.** Conteúdo de módulo, ferramentas, blocos de voz, régua de realidade, textos de exercício. Vai para produção e entra numa lista de leitura. Se algo estiver errado, corrige na semana.

**Nível 3, sobe sem leitura.** Rótulo de botão, título de card, mensagem de confirmação, estado vazio, texto de erro.

## 3. O que substitui o gate, na prática

Um arquivo `/docs/revisao-conteudo.md` no repositório, com três listas: **a publicar**, **publicado e não lido** e **lido**. Cada item com a data e o nível. Quem escreve coloca na primeira lista; quem lê move para a terceira.

Não é cerimônia. É o único jeito de, dentro de três meses, saber qual texto de saúde ninguém conferiu.

## 4. O que fazer com as marcas que já estão no código e nos arquivos de conteúdo

- Remover toda ocorrência de `[REVISÃO CLÍNICA]` dos arquivos de `content/familia/`.
- Trocar, em comentário de código, por `// nivel-1`, `// nivel-2` ou `// nivel-3`, conforme a lista acima.
- `[PENDÊNCIA DO FUNDADOR]` continua existindo e continua sendo bloqueio: é decisão, não revisão.

## 5. Uma pendência que este briefing fecha

A FAQ falava em acesso ao conteúdo por `{{prazo_acesso}}`, com pendência aberta. **Decisão: sem prazo.** O pagamento é Pix à vista, não existe assinatura, e limitar o acesso depois cobraria duas vezes pela mesma coisa. A FAQ nova do N3 já está escrita com isso. Se um dia houver custo que justifique prazo, isso volta como decisão nova, não como pendência.

## 6. Critério de aceite

- Nenhum arquivo de `content/familia/` contém `[REVISÃO CLÍNICA]`.
- `/docs/revisao-conteudo.md` existe com os textos de nível 1 na lista "a publicar".
- Nenhum texto de nível 1 está em produção sem estar na lista "lido".

---

# Briefing N3: as correções que já estão escritas erradas

**Sessão 1 · Claude Code · Sonnet 5.5 · esforço médio.** A FAQ nova está escrita por inteiro aqui. Não reescreva nada, não complete nada, não invente microcopy.

Isso não é conteúdo novo. É o que a documentação atual produz se ninguém mexer. Seis itens.

## 1. A FAQ da LP: substitui a FAQ inteira

A FAQ atual promete módulo 1 grátis, 7 dias para desistir, agenda com horários e sessão inclusa. As quatro coisas estão erradas depois dos briefings 01b, 01c, 01d e M56. Abaixo, a FAQ nova, completa. O visual não muda (acordeão, 5 blocos com subtítulo).

### Sobre o Fôlego

**O que é o Fôlego?**
É um programa de 8 semanas da Margem para quem convive com alguém que tem problema com álcool, outras drogas ou apostas. Uma leitura curta por semana, também em áudio, com ferramentas para usar no dia a dia e um treino onde você ensaia as conversas difíceis antes de ter que fazer de verdade.

**Isso é terapia?**
Não. É um programa de apoio e aprendizado, com coisas práticas para fazer a cada semana. Se você ou quem você ama quiser atendimento, a Margem tem psicólogos e psiquiatras parceiros, e o programa te ajuda a chegar até eles.

**Isso funciona mesmo?**
O Fôlego junta duas abordagens estudadas há décadas, e elas prometem coisas diferentes. Uma trabalha o que a família pode fazer para que a mudança fique mais atraente: nos estudos, quando o familiar teve apoio de um terapeuta, cerca de 2 em cada 3 pessoas acabaram buscando tratamento. A outra trabalha você, por direito próprio, e o que ela melhora é medido em você: menos sobrecarga, menos ansiedade, mais apoio por perto, aconteça o que acontecer com quem você ama.
Com material sem acompanhamento, os números são menores nas duas. Por isso a gente recomenda combinar o programa com um profissional.
Se você quiser procurar por conta própria: a primeira abordagem se chama treinamento de reforço comunitário e familiar, conhecida pela sigla CRAFT. A segunda é o método de cinco passos para familiares, construído sobre o modelo de estresse, tensão, enfrentamento e apoio.

**Já tentei de tudo. O que tem de diferente aqui?**
Aqui você não vai ouvir conselho genérico. Você aprende o que dizer, quando dizer e o que fazer quando a conversa esquenta, e ensaia antes num treino de conversa. E boa parte do programa é sobre você: o que muda em casa quando você muda o jeito de reagir, e o que muda em você no caminho.

**O que eu consigo ver antes de pagar?**
O diagnóstico, o resultado inteiro com o roteiro e as frases para a sua situação, e um treino de conversa completo, com retorno no fim. A página de segurança, o plano de segurança e os telefones de emergência são abertos para qualquer pessoa, sempre, com ou sem compra.

**Eu não tenho tempo. Dá para fazer?**
Dá. Cada semana tem uma leitura de 5 a 7 minutos, que você também pode ouvir, e alguns exercícios para encaixar no dia a dia. Você faz no seu ritmo, pelo celular.

**Já existe grupo de apoio de graça. Por que fazer o Fôlego?**
Grupos de familiares ajudam muito, e o próprio programa indica onde encontrar. A diferença é que aqui o foco é prático e montado para a sua situação: o que dizer, como ensaiar e o que fazer em casa. Dá para fazer os dois.

**O que acontece depois das 8 semanas?**
O conteúdo continua disponível para você rever quando precisar, sem prazo. Os profissionais parceiros continuam por perto.

### Sobre quem você ama

**E se a pessoa não quiser saber de nada?**
É para essa situação que o programa existe. Ninguém consegue obrigar outra pessoa a mudar, e ninguém pode garantir que ela vai aceitar ajuda. Mas o jeito como a família reage pode deixar a mudança mais atraente, e você aprende a fazer isso.

**Garante que a pessoa vai aceitar ajuda?**
Não, e desconfie de quem garante. O que o programa faz é aumentar as chances e te ajudar a ficar melhor, qualquer que seja a decisão da pessoa. Nos estudos, os melhores resultados aparecem quando o familiar tem apoio de um profissional.

**A culpa é minha?**
Não, a culpa não é sua. Você não causou isso e não controla o que a pessoa faz. Mas você tem mais influência do que imagina, e é isso que o programa trabalha.

**A pessoa precisa saber que eu estou fazendo?**
Não. Você faz no seu tempo, de forma discreta. Mais para a frente, se fizer sentido, contar que você está fazendo um programa pode até despertar curiosidade, mas quem decide é você.

**Não moramos juntos. Serve para mim?**
Serve. O programa é para quem convive ou se preocupa com alguém: mãe, pai, parceiro ou parceira, filho ou filha, irmão, amigo. As conversas e o cuidado com você funcionam mesmo à distância.

**A pessoa já está em tratamento, ou voltou a usar depois de parar. Faz sentido?**
Faz. Você aprende a apoiar sem vigiar, a valorizar o que vai bem e a lidar com uma volta ao uso sem culpa e sem briga.

**O objetivo é a pessoa parar de vez?**
Não necessariamente. Parar de vez e diminuir os riscos do uso são caminhos válidos. Quem escolhe é a própria pessoa, de preferência com um profissional.

**Funciona para apostas?**
Sim. O programa tem conteúdo específico para apostas, inclusive sobre proteger o dinheiro da casa. Com uma diferença que vale dizer: a parte que trabalha o convite para tratamento tem menos estudo em apostas do que em álcool e outras drogas. A parte que cuida de você foi estudada também com familiares de quem aposta. De qualquer jeito, em apostas o apoio de um profissional faz ainda mais diferença.

### Treino de conversa e profissionais

**Como funciona o treino de conversa?**
Você conversa, por texto ou por voz, com um personagem que reage como alguém que ainda não quer mudar. No fim, recebe um retorno sobre o que funcionou e o que tentar da próxima vez. É um treino: não é a pessoa real e não é um profissional.

**A inteligência artificial fala com quem eu amo?**
Não. A IA só aparece no treino de conversa, com você. Ela segue regras para não sair do método, sem dar diagnóstico nem orientação médica.

**Alguém lê o que eu escrevo no treino?**
Para cuidar da qualidade e da segurança, uma pequena parte das conversas pode ser revisada pela equipe, sem o seu nome e sem o apelido da pessoa. Esse aviso aparece antes do primeiro treino, e você pode apagar seus dados quando quiser. [PENDÊNCIA DO FUNDADOR + revisão jurídica]

**Como falo com um profissional?**
Pelo próprio programa, você vê os psicólogos e psiquiatras parceiros da Margem e fala direto com quem escolher, pelo WhatsApp, para combinar o atendimento. Pode ser para você ou para quem você ama, quando a pessoa topar. As sessões são pagas à parte, direto com o profissional, no valor social que você escolher dentro da faixa dele.

### Preço e pagamento

**Quanto custa?**
Você escolhe quanto pagar, entre R$ 47 e R$ 147, em pagamento único no Pix. O valor sugerido é R$ 97, e o conteúdo é o mesmo em qualquer valor.

**O que é o Fôlego com acompanhamento?**
É o programa com a primeira sessão de um profissional parceiro combinada junto. Levando a sessão, o programa começa 20% mais barato, a partir de R$ 37, e a sessão é escolhida e paga por você, no valor da faixa social do profissional. O total aparece somado antes de pagar, num Pix só. É o jeito que mais ajuda, segundo os estudos.

**E se eu não puder pagar agora?**
Ninguém precisa ficar de fora por causa de dinheiro. Na hora de pagar existe a opção de pedir acesso gratuito, sem comprovar renda e sem precisar explicar muito.

**E se eu me arrepender?**
Você tem 14 dias para pedir o seu dinheiro de volta, num toque, sem precisar explicar por quê.

### Privacidade e segurança

**Alguém vai ver isso no meu celular?**
O programa se chama Fôlego justamente para não denunciar o assunto na tela. Você também pode usar o modo discreto e o botão "Sair rápido", que fecha a página na hora. E pode apagar tudo quando quiser.

**O que vocês fazem com os meus dados?**
Seus dados não são compartilhados sem a sua autorização. O login é pelo Google, Apple ou Facebook, e a Margem não guarda senha. Você não precisa dizer o nome de ninguém: escolhe um apelido para a pessoa.

**E se eu tiver medo dentro de casa?**
A sua segurança vem antes de tudo. Se houver violência ou medo, o programa muda: o foco vira um plano de segurança e os contatos de emergência, e algumas partes ficam guardadas até você conversar com um profissional. Se estiver em perigo agora, ligue 190. [Link: "Ver o que fazer em caso de risco"]

**Nota de implementação.** A pergunta sobre acesso gratuito fica na FAQ em texto, **sem link e sem botão**, porque o briefing 01c mantém o pedido só no rodapé do checkout. A FAQ informa que existe; a porta continua sendo uma só.

## 2. Tirar toda promessa de agenda e de horário

O produto não tem agenda, horário nem disponibilidade. O briefing M56 já proibiu prometer isso, e a promessa sobreviveu em vários lugares. Corrigir todos:

| Onde | Está | Fica |
|---|---|---|
| FAQ, "Como falo com um profissional?" | "você vê os psicólogos e psiquiatras parceiros e os horários disponíveis" | o texto novo do item 1 |
| Módulo 5, "Primeiro, deixe a ajuda pronta" | "escolha um profissional e veja um horário possível em até 3 dias" | "escolha agora um profissional e deixe salvo. Quando {{apelido}} disser sim, você já sabe para quem mandar mensagem, no mesmo dia." |
| Módulo 5, exercício, item 1 | "Ver psicólogos parceiros com horário nesta semana" | "Ver psicólogos parceiros" |
| C6, passo 1 | lista filtrada por horário em até 3 dias, card com "próximo horário" | sem filtro de horário; o card mostra foto, nome, abordagem e faixa de valor |
| C6, passo 1, texto | "veja um horário possível nos próximos dias" | "deixe um profissional salvo agora, para não ter que procurar depois" |
| Módulo 5, "Se não houver horário rápido" | título condicionado a horário | "Se você preferir o serviço público", e o bloco de CAPS AD, UBS e Meu SUS Digital aparece sempre, não só quando falta horário |
| Briefing 01, etapa 2b | "filtrada por horário em até 7 dias" | sem filtro |
| Módulo 5, FRASES_QUER_MUDAR | botão "Ver psicólogos parceiros com horário nesta semana" | "Ver psicólogos parceiros" |

Rodar busca por "horário", "disponibilidade" e "agenda" em `app/familia`, `components/familia`, `lib/familia` e `content/familia`. Nenhum texto de tela pode prometer nenhum dos três.

## 3. PHQ-4: existe um texto só, e é o oficial

Hoje há dois textos incompatíveis na documentação. Vale o oficial, com uma única mudança: o aviso de que não é diagnóstico, que o briefing M8b escreveu bem, fica.

**Texto da tela, na ordem:**

> **Como você está**
> Estas 4 perguntas são as mesmas que muitos serviços de saúde usam para entender como alguém está se sentindo. Elas não dão diagnóstico, e o que você responder aqui não diz que você tem ou não tem alguma coisa. Servem para o programa saber como falar com você nesta semana, e para você acompanhar como está se sentindo ao longo do tempo. Quem pode dizer o que está acontecendo é um profissional, numa conversa.

Enunciado e perguntas, exatamente assim, sem reescrever nada:

> Durante as últimas 2 semanas, com que frequência você foi incomodado/a por qualquer um dos problemas abaixo?
> 1. Sentir-se nervoso/a, ansioso/a ou muito tenso/a
> 2. Não ser capaz de impedir ou de controlar as preocupações
> 3. Pouco interesse ou pouco prazer em fazer as coisas
> 4. Se sentir "para baixo", deprimido/a ou sem perspectiva

Opções: Nenhuma vez (0) · Vários dias (1) · Mais da metade dos dias (2) · Quase todos os dias (3)

Em letra pequena, abaixo: "Desenvolvido pelos Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke e colegas."

**As marcas "/a" ficam.** São parte do texto oficial e por isso o PHQ-4 é a única exceção do teste de gênero. Deixar isso escrito no teste, com o caminho do arquivo, para ninguém "corrigir" depois.

O que não aparece na tela continua valendo: nenhum número de escore, nenhuma das palavras leve, moderado, grave, ansiedade ou depressão. As faixas e as devolutivas do M8b continuam como estão.

## 4. Jogadores Anônimos sai da lista de grupos para familiares

Ainda está no módulo 7 do conteúdo v2. Trocar pelo texto que o M8b já escreveu:

> Para famílias de quem aposta ainda não existe um grupo com encontros em todo o país. O Amor-Exigente recebe famílias de qualquer compulsão, inclusive apostas, e o CAPS da sua cidade atende de graça. Se quem aposta quiser um grupo, Jogadores Anônimos é o caminho, e é para a pessoa que aposta, não para você.

## 5. "Baixar o resumo para o profissional" sai do encerramento

O resumo não existe. Tirar o botão do encerramento do módulo 8 (C12) e qualquer menção a ele em lista do que está incluído.

## 6. Os profissionais são parceiros, não são da Margem

A Margem é ponte, não clínica. Trocar "psicólogos e psiquiatras da Margem" por "psicólogos e psiquiatras parceiros da Margem" no subtítulo do hero e no "Como funciona 4" da LP. Em todo o resto do produto, a palavra já é parceiro.

## 7. Critério de aceite

- Nenhuma tela diz que o módulo 1 é grátis, nem "7 dias", nem "cancelar", nem "assinatura".
- Nenhuma tela promete horário, agenda ou disponibilidade de profissional.
- Existe um único texto de PHQ-4 no repositório, e ele é o oficial, com as marcas "/a".
- O teste de gênero tem a exceção do PHQ-4 escrita com o caminho do arquivo.
- Jogadores Anônimos não aparece como grupo para familiares em lugar nenhum.
- Nenhum botão oferece o resumo para o profissional.
- A FAQ nova está no ar inteira, com 5 blocos.

---

# Briefing N4: régua de realidade, amostra na LP e nome do método

**Sessão 1 · Claude Code · Sonnet 5.5 · esforço médio.** Os 8 textos e o bloco da LP estão escritos aqui. Use exatamente como estão.

## 1. A régua de realidade: uma linha por módulo

Nenhum texto do programa prepara a pessoa para o que de fato acontece nas primeiras semanas. Prescrever a decepção reduz desistência, pela mesma lógica que o programa já usa quando diz que voltar a usar faz parte.

Bloco novo, fixo, logo abaixo do tempo de leitura, em card claro, com o título **"O que costuma acontecer nesta semana"**. Um por módulo, texto final:

**Módulo 1**
> Nesta semana você vai só olhar, e isso incomoda. Depois de tanto tempo tentando resolver, observar sem reagir parece pouco, parece até errado. Não é. Quase ninguém consegue mudar o que não enxerga direito, e você está no começo de enxergar.

**Módulo 2**
> Anotar momentos difíceis dá uma sensação estranha de estar fazendo uma ficha de alguém que você ama. Vai passar. Em uns dias as anotações começam a se repetir, e é essa repetição que vira o seu mapa.

**Módulo 3**
> Na primeira vez que você falar diferente, {{apelido}} pode desconfiar e até debochar: "tá falando bonito agora". Isso não quer dizer que não funcionou. Quer dizer que ele notou. Quem muda o jeito de falar depois de anos chama atenção. Siga, sem explicar o que você está fazendo.

**Módulo 4**
> Elogiar vai parecer falso na primeira vez, para você e para {{apelido}}. É o que acontece quando um elogio chega numa casa que andava só cobrando. Diga curto, uma coisa só, e vá fazer outra coisa. Na terceira vez já não soa estranho.

**Módulo 5**
> Esta é a semana em que mais gente trava, e o motivo não é falta de preparo: é medo do não. Vale lembrar que um não hoje não fecha a porta, e que muita gente aceita ajuda depois de algumas tentativas. O convite não é uma prova que você passa ou não.

**Módulo 6**
> Parar de resolver pela pessoa costuma piorar antes de melhorar. Nos primeiros dias vem reclamação, drama e a sensação de que você está sendo cruel justamente com quem você mais quer proteger. Cumpra com calma e não volte a discutir. A vida fazendo o seu trabalho é mais convincente do que qualquer coisa que você diga.

**Módulo 7**
> Olhar para a sua vida depois de seis semanas olhando para {{apelido}} pode doer mais do que você espera. Às vezes a conta de tudo o que você deixou de lado só aparece quando você para para ver. Aparecer é o começo de recuperar.

**Módulo 8**
> Chegar ao fim de um programa com a situação ainda em aberto é frustrante, e provavelmente é o que vai acontecer. Oito semanas mudam o jeito da casa funcionar, raramente mudam o desfecho. O que você construiu continua valendo depois que o programa acaba.

## 2. Amostra do conteúdo na LP

A LP descreve o programa cinco vezes e não mostra nada dele. Entra um bloco novo, no padrão visual de cards da LP, **entre "O que você vai aprender" e o bloco "Quanto custa"**. Sem mudar nada das outras seções.

> **O que você vai aprender, na prática**
>
> O que costuma sair:
> *"Você gastou tudo de novo! Vai acabar com a família!"*
>
> O que você vai aprender a dizer:
> *"Vi que a conta ficou no negativo e fiquei com medo. Vamos sentar no domingo para olhar as contas juntos?"*
>
> A segunda frase não é mais educada. Ela é mais eficiente, e tem motivo para cada pedaço dela: fala de um fato, diz o que você sente e pede algo possível, sem acusar ninguém.
>
> São 8 semanas disso, com as frases da sua casa.

Visual: as duas frases com estilo de citação, a primeira em cinza secundário, a segunda em destaque. Sem botão: o bloco serve para mostrar, e o botão do bloco de preço vem logo depois. Sem ícone de bebida, dinheiro ou aposta, pela regra que já existe.

## 3. Nomear o método

Já está dentro da resposta "Isso funciona mesmo?" da FAQ nova, no briefing N3. Uma vez só, em nenhum outro lugar.

## 4. Critério de aceite

- Os 8 módulos abrem com o card "O que costuma acontecer nesta semana".
- O bloco de amostra está na LP, com as duas frases, entre "O que você vai aprender" e "Quanto custa".
- O bloco de amostra não tem botão nem ícone de bebida, dinheiro ou aposta.
- A FAQ nomeia as duas abordagens uma vez, só na resposta "Isso funciona mesmo?".
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
