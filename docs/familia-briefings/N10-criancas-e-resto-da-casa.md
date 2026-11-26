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
