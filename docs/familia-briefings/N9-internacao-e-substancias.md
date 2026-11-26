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
