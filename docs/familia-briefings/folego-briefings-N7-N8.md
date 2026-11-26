# Fôlego: briefings N7 e N8

Salvar no repositório como `docs/familia-briefings/N7-N8.md`.

**Sessão 3 do briefing N0.** Escrito no claude.ai, Opus, esforço alto. Nada passou pelo Gemini.

Estes dois briefings são de aplicação na **sessão 5** (Claude Code). Dentro da sessão 5 vale a exceção já registrada no N0: o **N7 é Sonnet 5.5, esforço médio** (é markdown de módulo e um componente novo), e o **N8 é Opus 5, esforço alto** (decide rota, estado, ordem de painel e comportamento em modo segurança).

O que vale sobre o que já existe:

1. Onde este arquivo e qualquer documento anterior tratarem do mesmo texto, **vale este arquivo**.
2. Os exemplos de bloco de voz que aparecem em `claude/programa-familia-melhorias-conteudo.md` eram rascunho de proposta. O texto final dos 16 blocos é o da seção 4 do N7.
3. A ficha 1 da biblioteca que aparece no mesmo documento também era rascunho. O texto final é o da seção 4 do N8.
4. Regra inviolável de sempre: zero travessão, CTA no infinitivo e específico, sem gênero marcado na pessoa que usa o produto, nenhuma palavra proibida, nenhuma promessa de resultado.

---

# Briefing N7: a voz do outro lado

**Sessão 5 · Claude Code · Sonnet 5.5 · esforço médio.** Os 16 blocos estão escritos aqui. Não reescreva, não complete, não gere variação, não invente bloco para módulo nenhum.

## 1. O que entra

Dois blocos curtos por módulo, um par em cada um dos 8 módulos, 16 no total:

- **Do outro lado:** como a reação da família chegava para quem estava usando.
- **Quem já estava aqui:** um familiar contando a semana que a pessoa está vivendo agora.

Os dois são **composição**, feita a partir da curadoria interna. Nenhum é relato de uma pessoa específica, e a etiqueta embaixo de cada bloco é a condição para o bloco existir, não um detalhe jurídico.

Por que existem: o familiar não aplica a técnica porque entendeu a técnica. Ele aplica quando acredita que ela chega diferente do outro lado. E quem passou anos escondendo isso de todo mundo não sai do isolamento lendo explicação.

## 2. Onde cada um entra, na ordem da página do módulo

Ordem final de cima para baixo em `/familia/programa/modulo/[n]`:

1. Topo: "Semana X de 8", título do módulo, tempo de leitura, player de áudio.
2. Card **"O que costuma acontecer nesta semana"** (briefing N4).
3. Bloco **"Quem já estava aqui"**.
4. Conteúdo do módulo.
5. Bloco **"Do outro lado"**, imediatamente antes do exercício.
6. Exercício da semana, em cards.
7. Bloco da trilha **"O que é seu"** (briefing N5), se já estiver implementado.
8. "Próximo módulo chega em DD/MM" e "Voltar ao painel".

Os dois blocos nunca ficam colados um no outro. "Quem já estava aqui" abre, porque é reconhecimento, e vem logo depois da régua de realidade, que trata do mesmo assunto. "Do outro lado" fecha a leitura e empurra para o exercício, porque é o que faz a pessoa acreditar que vale tentar.

## 3. O componente e a etiqueta

Componente novo, `BlocoVoz`, com duas variações. Antes de criar, varrer o Figma (regra 10 do CLAUDE.md): se já existir um componente de citação no Margem System que sirva de base, nasce dele.

Requisitos visuais:

- Precisa ser **visualmente diferente da voz da Margem** no resto da tela, pela mesma razão que o balão do treino é diferente: ninguém pode confundir isso com orientação. Sugestão dentro do design system: card com borda à esquerda e texto em estilo de citação.
- Rótulo acima do texto, no estilo de rótulo que o design system já tem: **"Do outro lado"** ou **"Quem já estava aqui"**.
- Corpo em no mínimo 16px, como o resto das telas do programa.
- **Sem foto, sem avatar, sem ilustração de pessoa, sem nome, sem idade, sem cidade, sem iniciais.** O bloco é composição: inventar identidade transforma composição em depoimento falso.
- Sem aspas decorativas gigantes, sem degradê, sem ícone.

Etiqueta embaixo do texto, dentro do mesmo card, texto exato, sempre visível, nunca em tooltip, nunca atrás de "saiba mais", nunca abreviada:

- Em todo bloco **Do outro lado**:
  > Escrito a partir de conversas com pessoas que passaram por isso. Não é o relato de uma pessoa específica.

- Em todo bloco **Quem já estava aqui**:
  > Escrito a partir de conversas com familiares que passaram por isso. Não é o relato de uma pessoa específica.

A etiqueta é string fixa do componente, nunca copiada por bloco. Tamanho mínimo 14px, contraste AA. Se um dia alguém quiser esconder a etiqueta para "não quebrar o fluxo", a resposta é não: sem etiqueta visível, o bloco sai da tela.

## 4. Os 16 blocos, texto final

Nenhum deles usa `{{apelido}}`. É de propósito: a história é de outra casa, e colocar o apelido ali misturaria a casa da pessoa com a composição.

### Módulo 1 · O que está acontecendo (e o que não é culpa sua)

**[QUEM_ESTAVA_M1]**
> Eu entrei achando que ia receber um jeito de fazer ele parar. Na terceira semana eu percebi que não lembrava mais a última vez que eu tinha dormido uma noite inteira. Anotei isso achando que era besteira, e foi a primeira coisa aqui que era sobre mim.

**[OUTRO_LADO_M1]**
> Na minha casa todo mundo sabia a minha hora de chegar e o meu jeito de falar quando eu tinha bebido. Eu sabia que estavam me olhando, e passei a ter mais cuidado para esconder. Eles sabiam o meu horário. Levaram muito tempo para enxergar o que estava embaixo.

### Módulo 2 · Entender o padrão

**[QUEM_ESTAVA_M2]**
> A primeira semana anotando foi horrível. Eu sentia que estava fazendo um relatório do meu filho, escondido, no bloco de notas do celular. Na segunda semana eu olhei para trás e tinha quatro anotações na sexta à noite, todas depois do pagamento. Eu convivia com aquilo há seis anos e nunca tinha visto.

**[OUTRO_LADO_M2]**
> Se alguém me perguntasse, eu diria que era aleatório, que era quando dava. Minha mulher falou uma vez que era sempre depois da ligação do meu irmão. Eu respondi mal e passei a semana irritado com ela. Era sempre depois da ligação do meu irmão.

### Módulo 3 · Conversar sem brigar

**[QUEM_ESTAVA_M3]**
> Eu escrevi a frase num papel e levei três dias para usar, porque toda vez que eu abria a boca saía a antiga. Quando saiu a nova, saiu tremida e eu achei que tinha ficado ridícula. Ele olhou para mim como quem não entendeu e saiu do quarto. Foi a primeira noite em oito meses que a gente não gritou.

**[OUTRO_LADO_M3]**
> Quando minha mãe começava a falar, eu já sabia o caminho inteiro: começava no ontem, passava no ano passado e terminava em quem eu tinha me tornado. Eu parava de ouvir na terceira frase. Não era birra, era defesa. No dia em que ela disse uma coisa só e foi lavar a louça, eu fiquei pensando naquilo a tarde inteira.

### Módulo 4 · Valorizar o que é bom

**[QUEM_ESTAVA_M4]**
> Elogiar me deu uma raiva que eu não esperava. Pensei: ele acabou com a minha semana e eu vou agradecer porque ele lavou uma louça. Falei curto, do jeito que estava escrito, e fui para a cozinha antes de estragar. Na terça ele lavou de novo, sem eu pedir.

**[OUTRO_LADO_M4]**
> Meu pai falou que tinha gostado de almoçar comigo no domingo. Eu passei o resto do dia esperando a segunda parte da frase, aquela que sempre vinha depois do elogio. Não veio. Eu fiquei desconfiado, e voltei no domingo seguinte.

### Módulo 5 · O convite

**[QUEM_ESTAVA_M5]**
> Eu ensaiei quatro vezes e escolhi a quinta de manhã, que é quando ela está mais calma. Minha mão tremia e eu falei rápido demais. Ela disse que não, que ela não precisa disso. Eu respondi que estava tudo bem e que eu continuava aqui. Depois eu chorei no carro, e ainda assim foi a conversa menos pior que a gente teve esse ano.

**[OUTRO_LADO_M5]**
> Minha irmã me chamou para sentar num sábado de manhã e disse que tinha um médico, que já tinha falado com ele, e que ela ia comigo. Eu disse que não precisava, que eu resolvia. Fiquei com o nome daquele médico no bolso da jaqueta umas três semanas. Liguei num dia em que eu acordei mal.

### Módulo 6 · Deixar as consequências acontecerem e resolver problemas

**[QUEM_ESTAVA_M6]**
> Eu decidi que não pagava mais a fatura e avisei antes, sem briga. No dia do vencimento eu fiquei com o celular na mão até as duas da manhã, pronta para resolver. Não resolvi. Acordei com um sentimento horrível de mãe que falhou, e com a fatura ainda no nome dele.

**[OUTRO_LADO_M6]**
> A primeira vez que minha irmã não ligou para o meu trabalho, eu passei dois dias com raiva dela. No terceiro eu entendi que ela não tinha me abandonado, ela só tinha parado de me tapar. Foi a primeira vez que eu senti que eu ia perder alguma coisa de verdade.

### Módulo 7 · A sua vida e a sua rede

**[QUEM_ESTAVA_M7]**
> Eu voltei a jogar vôlei na terça. Combinei comigo que não ia olhar o celular durante o jogo, e olhei duas vezes. Voltei para casa e estava tudo do mesmo jeito que eu deixei, nem melhor nem pior. Eu dormi bem naquela noite.

**[OUTRO_LADO_M7]**
> Minha mãe voltou para o coral na quinta. Eu descobri que me incomodava não ser mais o assunto da casa, e isso é feio de admitir. Também foi a primeira quinta-feira em muito tempo que eu não tive ninguém para brigar quando chegou a noite.

### Módulo 8 · Depois da resposta

**[QUEM_ESTAVA_M8]**
> Terminei as oito semanas com ele morando aqui, bebendo nos fins de semana e trabalhando a semana toda. Não é o final que eu queria quando comecei. A casa não grita mais, e no sábado à noite eu não fico sentada esperando a porta.

**[OUTRO_LADO_M8]**
> Eu voltei a beber no terceiro mês, e eu acho que lá em casa já estavam esperando. O que eu lembro é que ninguém disse "eu avisei". Minha filha falou que tinha sido uma semana ruim e perguntou o que eu ia fazer na segunda. Eu voltei para o grupo na segunda.

## 5. Como os blocos se comportam nos estados

- **`safety_mode`:** nenhum bloco **Do outro lado** aparece, em módulo nenhum, inclusive nos liberados (1, 2 e 7). Numa casa com risco de agressão, a voz de quem usava pode ser lida como pedido para entender, suportar e ficar, e não é isso que o programa vai dizer para quem está com medo. Os blocos **Quem já estava aqui** continuam aparecendo.
- **`caution_mode`:** os dois aparecem normalmente.
- Nenhum bloco de voz aparece na página de segurança, no plano de segurança, no resultado do diagnóstico, na LP, no checkout ou nas fichas do briefing N8.
- Os blocos **não rotacionam e não são sorteados**. Cada módulo tem um par fixo, igual em toda visita, porque a pessoa relê o módulo durante a semana e texto que muda sozinho faz ela duvidar do que leu.
- Não são dubláveis no player de áudio com outra voz nem anunciados como "depoimento" em nenhum rótulo.

## 6. A regra de escrita desses blocos, para o futuro

Isto vale para todo bloco de voz novo, de qualquer pessoa que escrever, e substitui a necessidade de combinar caso a caso. Vai para `docs/familia-briefings/regra-blocos-de-voz.md`, junto com os 16 textos acima como referência.

**1. De onde o bloco pode nascer.** Da curadoria interna: a leitura clínica, a assistência social e a experiência de quem passou pelo uso e de quem conviveu com alguém em uso. Nunca, em nenhuma hipótese, de conteúdo de pessoa usuária do produto: nada do diário, do campo livre, do treino de conversa, de e-mail, de mensagem, de comentário ou de pesquisa. Também não vale usar a história real de uma pessoa específica, mesmo com autorização dela, **neste formato**: a etiqueta diz que é composição, e composição com história real de uma pessoa é mentira na etiqueta. História real autorizada, se um dia houver, é outro formato, com outro rótulo e outra decisão.

**2. Tamanho.** De 3 a 5 frases, até 70 palavras. Tem que caber na tela do celular sem rolar.

**3. Forma.** Primeira pessoa, passado. Uma cena concreta, com dia da semana, hora, objeto ou lugar. Uma coisa que a pessoa sentiu ou fez. E **termina num fato**, não numa conclusão.

**4. A última frase é a regra mais importante.** Ela não pode começar com "foi aí que eu entendi", "aprendi que", "hoje eu sei", "no fundo", "a verdade é que". Quem conta, conta. Quem explica é o programa, em outro parágrafo. Se o bloco só funciona com a última frase explicando o bloco, o bloco está mal escrito.

**5. O que nunca entra.** Moral da história. Conselho. Promessa, garantia e final feliz. Telefone, número, nome de serviço, de clínica, de remédio ou de substância com quantidade. Detalhe de como se usa. Detalhe de violência. Diagnóstico e palavra de diagnóstico. Linguagem de codependência. Religião e vocabulário de programa de 12 passos. Palavra proibida da lista. Travessão. `{{apelido}}`. Nome, idade, cidade, profissão específica, foto, iniciais. Elogio ao programa ("esse programa salvou minha vida") em qualquer forma: isso é depoimento de cliente, é exatamente o que a etiqueta nega, e queima a confiança da marca de um jeito difícil de recuperar.

**6. Equilíbrio de desfechos, contado no conjunto, não por bloco.** Nos 8 blocos **Quem já estava aqui**, no máximo 3 podem terminar com algo melhorando, e pelo menos 2 terminam com nada mudando. Nos 8 **Do outro lado**, pelo menos 2 terminam sem a pessoa se mover. Os 16 textos acima já estão nessa conta. Se um bloco novo substituir outro, refazer a conta antes de publicar: uma coleção em que tudo melhora é propaganda, e o leitor sente antes de saber dizer por quê.

**7. Gênero.** A pessoa que narra pode ter gênero, porque é outra pessoa contando a vida dela, e tirar isso deixa o texto falso. A pessoa que usa o produto e o `{{apelido}}` continuam sem gênero marcado, em todo o resto da tela. Por isso o teste de gênero ganha uma **segunda exceção**, além do PHQ-4: os blocos de voz. A exceção é declarada no teste com o caminho dos arquivos e vale só para o conteúdo dentro de `BlocoVoz`, nunca para o texto em volta.

**8. Quantidade.** Exatamente um par por módulo. Bloco novo **substitui**, nunca acumula. Nenhum módulo tem dois "Do outro lado".

**9. Revisão, pelo protocolo do N2.** Bloco de voz é nível 2 por padrão: sobe e é lido depois. Sobe para nível 1, e espera leitura em voz alta antes de publicar, se o bloco encostar em criança, violência, internação, dívida com terceiro, morte, ou em voltar a usar com risco.

**10. Checklist antes de publicar um bloco novo.** Cinco perguntas, todas com resposta sim:
- Dá para ler em 20 segundos?
- A última frase é um fato, e não uma lição?
- Alguém poderia ler isso como promessa de que vai dar certo? (aqui a resposta tem que ser não)
- A etiqueta está visível, inteira, embaixo do bloco?
- Nada ali veio de texto escrito por pessoa usuária do produto?

## 7. Arquivos e chaves

- Os 16 textos vão nos próprios arquivos de módulo, `content/familia/modulo-0N.md`, nas chaves `[QUEM_ESTAVA_MN]` e `[OUTRO_LADO_MN]`, nas posições 3 e 5 da ordem da seção 2.
- As duas strings de etiqueta ficam no componente, em um lugar só.
- Comentário de nível no código: `// nivel-2` em todos os 16, pelo N2.
- Incluir os 16 na lista "publicado e não lido" de `/docs/revisao-conteudo.md`, com a data.

## 8. Critério de aceite do N7

- Os 8 módulos têm exatamente um "Quem já estava aqui" e um "Do outro lado", nas posições 3 e 5.
- Toda ocorrência de `BlocoVoz` mostra a etiqueta inteira, visível sem interação, em no mínimo 14px.
- Nenhum bloco de voz tem foto, avatar, nome, idade ou iniciais.
- Nenhum bloco de voz contém `{{apelido}}`, travessão, telefone, nome de serviço ou palavra proibida.
- Em `safety_mode`, nenhum "Do outro lado" aparece, inclusive nos módulos 1, 2 e 7, inclusive por URL direta.
- O texto do bloco é visualmente distinto da voz da Margem na mesma tela.
- O teste de gênero tem a exceção dos blocos de voz escrita com o caminho dos arquivos.
- `docs/familia-briefings/regra-blocos-de-voz.md` existe com a seção 6 deste briefing.

---

# Briefing N8: a biblioteca do "está acontecendo agora"

**Sessão 5 · Claude Code · Opus 5, esforço alto.** Esta é uma das duas partes da rodada com lógica de verdade: decide rota, acesso, estado e ordem de painel. As 8 fichas estão escritas aqui e são texto final.

## 1. Por que existe

O programa anda em semanas. A crise anda em horas. Hoje, quem abre o produto às 23h com alguém pedindo dinheiro na porta do quarto encontra um módulo de 6 minutos, um diário e, se tiver relatado medo, o plano de segurança. É o único momento em que a Margem está desenhada para o seu melhor público e não entrega nada para aquele minuto.

A biblioteca são 8 fichas lidas em 30 segundos, fora da ordem dos módulos, para o minuto em que a coisa está acontecendo.

## 2. Rota, arquivos e acesso

- Lista: `/familia/agora`. Ficha: `/familia/agora/[slug]`.
- Conteúdo em `content/familia/agora/NN-slug.md`, um arquivo por ficha, com frontmatter: `slug`, `titulo`, `titulo_aberto`, `ordem`, `nivel`, `prioridade_seguranca` (booleano).
- **Aberta para qualquer pessoa, sem compra e sem login**, mesmo critério da página de segurança. Indexável.
- Título da aba, como em toda a área: "Fôlego · Margem". O assunto não aparece no título da aba nem na URL de forma que denuncie: os slugs são neutros (`pedindo-dinheiro`, `chegou-alterado`, `nao-responde`, `passando-mal`, `perdeu-tudo`, `cobranca-em-casa`, `descobriu-o-programa`, `nao-aguento-hoje`).
- "Sair rápido" presente em toda ficha.
- `{{apelido}}` só existe para quem respondeu o diagnóstico. Sem apelido, o sistema usa **"a pessoa"** no corpo do texto e o `titulo_aberto` no título. Os dois títulos estão escritos na seção 4, um por ficha. Não gerar o segundo título por substituição automática.

## 3. O formato, fixo e igual em todas

Com adrenalina alta ninguém aprende layout novo. A ordem é sempre esta, e nenhuma ficha ganha campo novo:

1. Título.
2. **Agora**, com no máximo 3 itens em lista.
3. **O que não fazer hoje**, em prosa curta.
4. **Uma frase**, em estilo de citação, com botão de copiar.
5. **Amanhã**, com **um** botão só.

Mais, fora dos cinco campos:
- Botões de emergência no rodapé da ficha, reaproveitando o card de emergência que já existe na home e na página de segurança. Nunca um componente novo, nunca número digitado só nesta tela.
- Em `safety_mode` e `caution_mode`, link "Ver meu plano de segurança" acima do rodapé.
- No fim, no máximo 3 links para outras fichas, em texto, sem card e sem carrossel.

E o que a ficha **não** tem: imagem, ilustração, barra de progresso, "marcar como feito", prévia de outra ficha no topo, nada de venda (seção 5), nenhum campo para escrever, nenhuma pergunta de triagem, nenhum modal de abertura.

## 4. As 8 fichas, texto final

### Ficha 1 · `pedindo-dinheiro` · nível 2
**Título:** {{apelido}} está pedindo dinheiro agora
**Título sem apelido:** Quem você ama está pedindo dinheiro agora

> **Agora**
> - Você não precisa decidir em 30 segundos. "Eu te respondo em uma hora" é uma resposta.
> - Se for para comida, remédio ou transporte, pague direto, no lugar de entregar o dinheiro.
> - Se você sentir que a situação pode virar, a sua segurança vem antes do dinheiro. Dê o que precisar para a noite acabar em paz e cuide do resto amanhã, com cabeça fria. Isso não é fracasso, é cálculo.
>
> **O que não fazer hoje**
> Discutir o valor, negociar, lembrar as vezes anteriores, pedir promessa em troca. Nada disso vai ser cumprido hoje, e tudo isso vira briga.
>
> **Uma frase**
> "Hoje eu não vou dar. Não é por raiva. A gente conversa amanhã."
> Diga uma vez. Não explique três vezes: explicação demais soa como porta entreaberta.
>
> **Amanhã**
> Anote o que veio antes do pedido. Pedido de dinheiro quase sempre tem dia e hora.
> `com programa:` [Botão: "Anotar um momento difícil"]
> `sem programa:` [Botão: "Ver psicólogo parceiro"]

### Ficha 2 · `chegou-alterado` · nível 1
**Título:** {{apelido}} chegou alterado e está gritando
**Título sem apelido:** A pessoa chegou alterada e está gritando

> **Agora**
> - Saia da discussão antes de tentar ganhar a discussão. Vá para outro ambiente, de preferência um com saída fácil.
> - Fique com o celular e a chave em mãos. Se houver criança em casa, leve a criança com você.
> - Se houver empurrão, ameaça ou coisa quebrada, ligue para o 190. Você não precisa esperar uma agressão para ligar.
>
> **O que não fazer hoje**
> Não discuta, não explique, não tente provar nada e não fale do uso agora. O que for combinado com a pessoa alterada não vale amanhã. E não fique entre a pessoa e a porta.
>
> **Uma frase**
> "Eu não vou conversar sobre isso agora. Amanhã a gente fala."
> Diga uma vez e saia do ambiente.
>
> **Amanhã**
> Uma noite assim costuma repetir. Ter combinado antes para onde você vai, com quem você fala e o que você leva muda o que acontece na próxima.
> [Botão: "Fazer meu plano de segurança"]

### Ficha 3 · `nao-responde` · nível 1
**Título:** {{apelido}} desapareceu e não responde
**Título sem apelido:** A pessoa desapareceu e não responde

> **Agora**
> - Ligue para duas ou três pessoas que podem saber onde ela está. Você não precisa contar a história toda para perguntar.
> - Anote o que você já sabe: quando foi a última vez que vocês falaram, o que ela estava vestindo, se levou documento, dinheiro ou carro.
> - Registrar o desaparecimento é um direito seu, e quem orienta como fazer na sua cidade é a delegacia mais próxima.
>
> **O que não fazer hoje**
> Não mande mensagem de hora em hora, não ameace por mensagem e não cobre explicação por escrito. Publicar a foto dela em grupo de bairro expõe a pessoa para muita gente que não conhece ela: pense duas vezes antes.
>
> **Uma frase**
> "Quando você puder, me manda só um sinal de que você está bem. Eu não vou cobrar nada."
>
> **Amanhã**
> Se ela voltar, hoje não é dia de conversa longa. Se não voltar, o que você anotou agora é o que a delegacia vai pedir.
> [Botão: "Ver o que fazer em caso de risco"]

### Ficha 4 · `passando-mal` · nível 1
**Título:** {{apelido}} está passando mal
**Título sem apelido:** A pessoa está passando mal

> **Agora**
> - Ligue para o 192 agora. Diga o endereço primeiro, depois o que está acontecendo.
> - Fique perto. Se a pessoa estiver muito sonolenta ou sem acordar direito, e vomitando, vire o corpo dela de lado.
> - Diga ao atendente o que ela usou e o quanto, se você souber. Isso muda o que a equipe faz nos primeiros minutos.
>
> **O que não fazer hoje**
> Não deixe a pessoa dormindo sozinha para ver se melhora. Não provoque vômito, não dê café, banho frio, comida nem remédio. E não espere ela concordar com a ligação.
>
> **Uma frase**
> Para o atendente, quando ele responder: "Eu não consigo acordar ela direito. O endereço é..."
>
> **Amanhã**
> Hoje você só precisa chegar até o atendimento. Quando o dia estiver um pouco melhor, vale conversar com um profissional sobre o que fazer numa próxima vez.
> [Botão: "Ver psicólogo parceiro"]

### Ficha 5 · `perdeu-tudo` · nível 2
**Título:** {{apelido}} perdeu tudo hoje e está desesperado
**Título sem apelido:** A pessoa perdeu tudo hoje e está desesperada

> **Agora**
> - Fique perto e deixe ela falar. Hoje não é dia de cobrar nada.
> - Não cubra o prejuízo hoje. Decidir sobre dinheiro agora é decidir no pior momento possível.
> - Desespero depois de uma perda grande é um momento de risco. Se ela falar em se machucar ou em desaparecer, fique por perto e ligue para o 188.
>
> **O que não fazer hoje**
> Não pague, não empreste, não negocie com ninguém no lugar dela e não diga "eu avisei". Nada de conta, senha, dívida ou promessa hoje.
>
> **Uma frase**
> "Hoje a gente só atravessa o dia. Amanhã a gente olha isso junto."
>
> **Amanhã**
> Proteger o dinheiro da casa é uma conversa de cabeça fria, com o que der para separar, e não uma decisão de hoje à noite.
> `com programa:` [Botão: "Cuidar do dinheiro da casa"]
> `sem programa:` [Botão: "Ver psicólogo parceiro"]

### Ficha 6 · `cobranca-em-casa` · nível 1
**Título:** Alguém veio cobrar uma dívida de {{apelido}} aqui em casa
**Título sem apelido:** Alguém veio cobrar uma dívida aqui em casa

> **Agora**
> - Não abra a porta e não deixe ninguém entrar. Cobrança não precisa acontecer dentro da sua casa.
> - Se houver ameaça, se a pessoa não for embora ou se tiver criança em casa, ligue para o 190. Isso vale mesmo que a dívida exista.
> - Anote hoje: dia, hora, o que foi dito e quantas pessoas eram. Se houver mensagem ou áudio, guarde.
>
> **O que não fazer hoje**
> Não pague para a cobrança parar, não assuma a dívida no seu nome, não assine nada e não combine prazo. Dívida de outra pessoa não é assunto para você resolver na porta de casa.
>
> **Uma frase**
> "Eu não vou tratar disso aqui na minha casa."
> Diga uma vez, feche a porta e não continue pela janela.
>
> **Amanhã**
> Quem orienta sobre dívida, cobrança e ameaça, de graça, é a Defensoria Pública da sua cidade. Se houve ameaça, o que você anotou e o registro de ocorrência são o que dá chão para qualquer coisa depois.
> [Botão: "Ver o que fazer em caso de risco"]

### Ficha 7 · `descobriu-o-programa` · nível 2
**Título:** {{apelido}} descobriu que eu estou fazendo este programa
**Título sem apelido:** A pessoa descobriu que eu estou fazendo este programa

> **Agora**
> - Não minta. Uma frase simples e verdadeira resolve melhor do que explicação longa.
> - Não mostre a tela, não leia trecho em voz alta e não entre na discussão do que está escrito aqui.
> - Se a reação assustar você, encerre a conversa por hoje. Essa não é uma conversa para ter com a casa quente.
>
> **O que não fazer hoje**
> Não prometa parar o programa para acalmar o clima. Não prometa mostrar tudo depois. E não discuta se você tinha ou não o direito de fazer isso: você tinha.
>
> **Uma frase**
> "Eu estou fazendo um programa para lidar melhor com tudo isso. É sobre mim também."
>
> **Amanhã**
> Dá para continuar com mais discrição. O modo discreto deixa o programa sem assunto na tela, e o "Sair rápido" fecha a página na hora.
> [Botão: "Abrir configurações"]

`Nota de implementação:` o botão aponta para a tela onde o modo discreto já é configurado. Se essa tela ainda não existir, mostre o texto **sem botão** e registre a pendência em /docs/revisao-conteudo.md. Não crie tela nem microcopy novos para fechar esse buraco.

### Ficha 8 · `nao-aguento-hoje` · nível 1
**Título:** Eu não aguento hoje
**Título sem apelido:** o mesmo, esta ficha não usa apelido

> **Agora**
> - Hoje não tem tarefa. Nada do programa precisa ser feito agora.
> - Faça uma coisa pelo corpo: beba água, coma alguma coisa, deite vinte minutos. Nessa ordem, se der.
> - Diga para uma pessoa, em uma frase, que hoje está difícil. Não precisa contar a história toda.
>
> Se estiver passando pela sua cabeça se machucar, ligue para o 188 agora. Atende a qualquer hora e é de graça.
> [Botão: "Ligar para o 188"]
>
> **O que não fazer hoje**
> Não decida nada grande hoje. Não tenha a conversa difícil, não mande a mensagem longa, não resolva dinheiro. Dia sem fôlego é dia de decisão ruim.
>
> **Uma frase**
> Esta é para você, não para ninguém: "Hoje eu só preciso atravessar o dia."
>
> **Amanhã**
> Se amanhã estiver parecido com hoje, isso já não é cansaço de um dia. Uma conversa com um profissional de psicologia, só para você, é o passo que mais ajuda daqui.
> [Botão: "Ver psicólogo parceiro"]

`Nota de implementação:` a linha do 188 fica **fora** dos três itens do "Agora", logo abaixo deles, com o mesmo estilo dos botões de emergência que já existem. Vermelho só no botão, como manda a regra de cor.

## 5. O que fica aberto, o que não fica, e por que não tem venda dentro da ficha

**As 8 fichas ficam abertas, para todo mundo, sem compra e sem login.** Não existe versão reduzida, não existe primeira ficha grátis, não existe cadastro para ler.

Três motivos, na ordem de peso:
1. Cobrar para alguém saber o que fazer quando a pessoa que ela ama está passando mal é indefensável, e é o oposto do que a Margem diz que é.
2. É o conteúdo que o familiar procura às 2h da manhã e o que ele compartilha com outro familiar. Fechado, não cumpre nenhuma das duas funções.
3. Aberto, resolve o descasamento entre o ritmo do produto (semanas) e o ritmo da vida de quem usa (horas), que é o furo que motivou a biblioteca.

**O que continua fechado** são as ferramentas do programa que algumas fichas citam no campo "Amanhã": o diário, a resolução de problemas, o cuidado com o dinheiro. Por isso cada ficha tem, quando faz diferença, duas versões do botão de "Amanhã": uma para quem tem o programa e outra para quem não tem, já escritas na seção 4. Para quem não tem, o botão nunca aponta para o checkout: aponta para o que também é aberto (segurança, plano de segurança, psicólogo parceiro).

**Nenhuma ficha vende nada.** Sem card de oferta, sem "faça o programa", sem selo de desconto, sem convite para o diagnóstico. A pessoa está no pior minuto da semana dela, e produto que aproveita esse minuto para vender perde o direito de ser levado a sério num assunto de saúde. A única menção ao programa fica no **fim da página de lista** `/familia/agora`, uma linha, uma vez:

> Estas fichas são para o momento em que a coisa está acontecendo. Para o resto, existe um programa de 8 semanas.
> [Botão: "Ver o programa"]

**Uma consequência que vale aceitar de propósito:** as fichas não entram na LP como item do que está incluído, e não aparecem na FAQ como benefício. Elas não são a parte grátis do produto, são conteúdo da Margem. Quem comprou não pode ter a sensação de que o melhor conteúdo é o que está de graça, e a forma de evitar isso é não anunciar as fichas como vantagem comercial em lugar nenhum.

## 6. Como aparece no painel sem roubar o lugar do módulo da semana

O painel tem uma hierarquia que funciona e que não muda: check-in pendente, alerta de segurança, depois a semana atual. A biblioteca **não** vira bloco grande, **não** vira card com prévia e **não** sobe para o topo no estado normal.

Ordem nova do painel `/familia/programa`, que substitui a lista do briefing das ferramentas, parte 2:

1. Card de check-in, quando houver pendente.
2. Alertas fixos, quando houver: `ALERTA_AUTOLESAO`, plano de segurança (`safety_mode` / `caution_mode`).
3. **Esta semana**: módulo atual mais os cards ativos das ferramentas.
4. Botão "Anotar" (C2).
5. **Está acontecendo agora** `novo`.
6. Minhas frases.
7. Ferramentas.
8. Os 8 módulos.
9. Profissionais.
10. Rodapé: "Precisa de ajuda agora?" (vermelho, só este link), **"Está acontecendo agora"** (cor neutra), configurações, "Sair rápido".

O item 5 é **uma linha, não um card**: o texto "Está acontecendo agora?" e o link "Ver o que fazer". Sem ícone grande, sem cor de alerta, sem prévia de ficha, sem contador, sem selo de "novo", sem badge.

**A exceção por estado:** em `safety_mode` e em `caution_mode`, a linha do item 5 **sobe para logo abaixo do item 2**, antes de "Esta semana", e na página de lista as fichas 2, 4, 6, 3 e 8 aparecem primeiro, nessa ordem (é o que `prioridade_seguranca` marca no frontmatter). Em quem relatou medo ou agressão, a chance de o problema ser agora é maior do que a chance de ser a leitura da semana, e aí a ordem da tela tem que mudar. No estado normal, a semana vem antes.

Onde mais a biblioteca aparece, e só nestes lugares:
- Em `/familia/seguranca`, um link no fim da página.
- No fim de cada ficha, no máximo 3 links para outras fichas.
- Em nenhuma página de módulo. O módulo é leitura de 6 minutos e não compete com o campo de crise.

O que a biblioteca nunca faz: abrir sozinha, aparecer em modal, interromper a leitura do módulo, contar como progresso do programa, gerar notificação (o produto não tem notificação, e o motivo está no CLAUDE.md).

## 7. Registro e privacidade

- Evento `agora_ficha_aberta`, com o slug e se a pessoa tem programa. Nenhum texto, nenhuma pergunta, nenhum dado novo sobre a casa.
- A ficha não cria sessão, não exige consentimento novo além do que já existe e não grava nada que a pessoa escreva, porque ela não escreve nada ali.

## 8. Nível de revisão, pelo protocolo do N2

O N2 marcou as fichas 2, 4 e 6 como nível 1. **Este briefing estende a lista:** nível 1 também para a 3 (desaparecimento, polícia e registro) e para a 8 (exaustão, com a linha do 188). As cinco esperam leitura em voz alta antes de ir para produção. Fichas 1, 5 e 7 são nível 2: sobem e são lidas depois.

As fichas 3 e 6 encostam no conteúdo que o **briefing N9** vai escrever com verificação na web (desaparecimento e dívida com terceiro). Por isso o botão de "Amanhã" das duas aponta, por enquanto, para `/familia/seguranca`, por um identificador de link isolado (`LINK_DESAPARECIMENTO` e `LINK_DIVIDA_TERCEIRO`). Quando o N9 entrar, muda o destino em um lugar só, sem reescrever ficha. **Nenhuma das duas ganha prazo, artigo de lei, nome de delegacia especializada ou número novo nesta rodada.**

## 9. Critério de aceite do N8

- `/familia/agora` e as 8 fichas abrem sem login e sem compra, inclusive em aba anônima.
- Sem apelido salvo, o título usado é o `titulo_aberto` e o corpo diz "a pessoa". Nenhuma tela mostra `{{apelido}}` cru.
- Toda ficha tem os 4 campos, na mesma ordem, e nenhuma tem campo a mais.
- Toda ficha tem exatamente um botão em "Amanhã" (duas versões onde o briefing prevê, nunca as duas ao mesmo tempo na tela).
- Nenhuma ficha contém oferta, preço, desconto, convite ao diagnóstico ou link para o checkout.
- A única menção ao programa está no fim de `/familia/agora`, uma vez.
- Os botões de emergência das fichas reaproveitam o componente que já existe, com no mínimo 44px e rótulo específico ("Ligar para o 190"), e vermelho só nos botões de emergência.
- No painel em estado normal, "Está acontecendo agora" é uma linha no item 5, e "Esta semana" continua acima dela.
- Em `safety_mode` e `caution_mode`, a linha aparece acima de "Esta semana" e a lista começa pelas fichas 2, 4, 6, 3 e 8.
- Nenhuma ficha aparece dentro de página de módulo, em modal ou como notificação.
- Fichas 2, 3, 4, 6 e 8 estão na lista "a publicar" de `/docs/revisao-conteudo.md` como nível 1, e não estão em produção antes de passarem para "lido".
- Teste de palavras proibidas, gênero e travessão passa em todo o conteúdo novo das duas rodadas.
