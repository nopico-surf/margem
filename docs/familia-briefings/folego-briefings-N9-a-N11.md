# Fôlego: briefings N9, N10 e N11

Sessão 4 das 6 do briefing N0. Escritos no claude.ai, com busca na web ligada.

**Esta sessão vem antes da sessão 3.** As sessões 2 (N5 e N6) já estão escritas e no repositório. A 3 (N7 e N8) ainda não, então todo ponto deste arquivo que dependeria do N8 está marcado como tarefa de depois, e nada aqui espera por ele.

**Pré-requisito:** `claude/folego-briefings-N0-a-N4.md` (N0 a N4), conteúdo v2, ferramentas partes 1 e 2, briefings M1, M5, M6 e 00d. Este arquivo não substitui nenhum briefing anterior: N9 e N10 acrescentam conteúdo novo, N11 acrescenta demandas de escrita.

**N9 e N10 são nível 1 do briefing N2.** Nenhum texto deles sobe sem o fundador ler em voz alta. Os dois entram em `/docs/revisao-conteudo.md` na lista "a publicar", com a data e o nível.

**Toda lei, prazo, número e nome de serviço deste arquivo foi conferido na fonte em 24/11/2026.** A lista de fontes está no fim do arquivo, com o que precisa ser conferido de novo e quando. Nada aqui saiu de memória.

**Uma mudança no N0.** O N0 previa duas exceções de modelo na sessão 5. Agora são três: a Q3c do diagnóstico, a condição `substancia` do markdown e as páginas livres novas decidem estado e ordem de tela, então essa parte é **Opus 5, esforço alto**. O resto continua Sonnet 5.5, esforço médio.

**Como colar no Claude Code.** O N9 inteiro numa conversa, o N10 em outra, nessa ordem, porque o N10 segue o padrão de página livre que o N9 estabelece. Cada um dos dois tem o seu próprio "O problema", "O que fazer", "Código" e "Critério de aceite", e funciona sem o outro na frente. O N11 não vai para o Claude Code.

**Sobre o Gemini.** A regra geral do projeto é que o Gemini escreve o texto de tela e o Claude revisa. N9 e N10 são a exceção já registrada no N0: texto de nível 1, escrito e revisado aqui, sem passar pelo Gemini. O N11 existe justamente para devolver ao Gemini o volume de baixo risco, que é onde ele ajuda sem risco de dano.

---

# Briefing N9: internação e as substâncias separadas

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

# Briefing N10: a casa inteira, e o que dizer para uma criança

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

# Briefing N11: as demandas para o Gemini escrever o volume de baixo risco

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

---

# Fontes, conferidas em 24/11/2026

Tudo o que é lei, prazo, número ou nome de serviço neste arquivo foi lido na fonte nesta data. Nada saiu de memória.

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

**Criança**
- ECA, Lei 8.069/1990, arts. 131 a 136, e Resolução Conanda nº 139/2010: ao menos um Conselho Tutelar por município e as atribuições do art. 136. O horário de funcionamento e o regime de plantão são fixados por lei municipal, e a escala de plantão fora do horário comercial foi conferida em material de município, não em norma federal: é por isso que o texto da página diz "definidos por lei municipal".
- Lei 13.431/2017, art. 4º: expor a criança, direta ou indiretamente, a crime violento contra membro da família é violência psicológica, em especial quando a torna testemunha.
- Lei 14.344/2022, arts. 11, 13 e 16: atendimento pela autoridade policial, encaminhamento ao Conselho Tutelar e medidas protetivas de urgência pedidas pelo Ministério Público, pela autoridade policial, pelo Conselho Tutelar ou por quem atua em favor da criança, com decisão do juiz em 24 horas.
- Lei 14.713/2023: altera o art. 1.584, § 2º, do Código Civil, afastando a guarda compartilhada quando há elementos que evidenciem risco de violência doméstica ou familiar, e acrescenta o art. 699-A ao Código de Processo Civil.
- NACoA, os sete Cs, de Jerry Moe, e o material "Language with Kids": não causei, não controlo, não curo, e posso cuidar de mim contando o que sinto, fazendo escolhas boas e me valorizando. Também a orientação de separar a pessoa da doença e de falar com adolescente sobre risco familiar e sobre o que diminui esse risco.
- Disque 100: gratuito, 24 horas todos os dias, aceita denúncia anônima, não exige prova, dá protocolo e não substitui emergência. Canais oficiais do Ministério dos Direitos Humanos e da Cidadania: telefone 100, WhatsApp (61) 99611-0100, Telegram, atendimento em Libras e chat da Ouvidoria. Os canais no `ContatosEmergencia.tsx` conferem com a fonte oficial.
- Al-Anon do Brasil, al-anon.org.br: o Alateen faz parte dos Grupos Familiares Al-Anon, a busca de grupos está na página de grupos, e a sede atende em (11) 3331-8799 e (11) 3222-2099, das 12h às 18h.
- CVV: 188, nacional, 24 horas, sem custo de ligação, por convênio com o Ministério da Saúde, mais chat e e-mail em cvv.org.br.

## O que precisa ser conferido de novo, e quando

- **Antes de publicar.** Qualquer número de telefone e qualquer endereço de site deste arquivo, uma última vez. Serviço público muda canal sem avisar.
- **A cada 6 meses, ou quando o Congresso mexer na Lei de Drogas.** A tese do STF sobre porte de maconha vale até o Congresso legislar sobre o assunto, e a própria decisão diz isso. Se sair lei nova, o bloco da maconha no módulo 1 muda no mesmo dia.
- **A cada 6 meses.** A RDC 29/2011 e a Portaria 344/1998 são normas antigas e vivas, e a Anvisa mexe nos anexos com frequência. O que muda primeiro é a lista de substância e o tipo de receita.
- **Quando a biblioteca do "agora" (N8) subir.** Conferir se as fichas 3 e 6 apontam para `/familia/desaparecimento` e `/familia/divida`.
- **Se o guia `/blog/internacao-involuntaria` já existir em `lib/guias.ts`.** Não copie texto entre o blog e a página do Fôlego, e não faça um apontar para o outro. São públicos diferentes, e texto duplicado em dois lugares diverge em um mês.
