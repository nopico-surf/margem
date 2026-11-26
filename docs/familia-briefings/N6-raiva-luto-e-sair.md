# Briefing N6: raiva, luto e a vontade de ir embora

Pré-requisito: briefings 00, N1, N2, N3, N4 e **N5 aplicado antes deste**, porque os dois mexem no mesmo ponto do módulo 6. Substitui a proposta 2.2 de `claude/programa-familia-melhorias-conteudo.md`.

**Sessão 5 · Claude Code · Sonnet 5.5 · esforço médio.** Markdown nos módulos 2, 6 e 7, mais uma página estática no molde de `app/familia/seguranca/page.tsx`. Todo o texto está escrito aqui. Nada passou pelo Gemini.

**Tudo neste briefing é nível 1** do briefing N2: leia em voz alta antes de subir. Entra inteiro em `docs/revisao-conteudo.md`, na lista "a publicar".

---

## O problema

O programa diz "a culpa não é sua" no módulo 1 e segue para a técnica. Em nenhum dos oito módulos existe uma linha sobre a raiva, sobre a vergonha de sentir raiva, sobre a saudade da pessoa que {{apelido}} era, sobre o alívio quando a casa está vazia, ou sobre o pensamento de ir embora.

São esses os assuntos da cabeça de quem chega. A pessoa lê oito semanas de habilidade de comunicação e não encontra em lugar nenhum a própria terça-feira à noite.

E tem um ponto que não é de adesão, é de ética: **o programa tem um viés silencioso de permanência.** Em nenhum texto se admite que, para parte das famílias, a resposta é se afastar, sair de casa ou parar de sustentar. Um programa que nunca admite a saída é um programa que, no limite, serve a quem usa, e não a quem cuida.

---

## Onde cada bloco encaixa, e por quê

| Bloco | Onde | Por quê |
|---|---|---|
| **Você também tem raiva** | `modulo-02.md`, entre `## As suas reações` (linha 40) e `## As janelas` (linha 46) | É a semana em que a pessoa anota, por sete dias, cada momento difícil. Anotar remexe, e a raiva aparece justamente aí. O módulo 2 também é o mais leve dos oito (3,5 KB contra 6 KB do módulo 6), então tem espaço. |
| **Saudade de quem ainda está aqui** | `modulo-07.md`, entre `## Lugares que acolhem familiares` (linha 43) e `## O que dá sentido aos seus dias` (linha 55) | É a semana de olhar para a própria vida, e a régua de realidade do N4 já avisa que a conta do que ficou de lado costuma doer aí. Nomear a perda antes do bloco sobre o que dá sentido aos dias deixa os dois no lugar certo. |
| **E se eu quiser sair** | Texto inteiro numa página livre, `/familia/decisao`. No `modulo-06.md`, um bloco curto que leva até ela, entre `## Cuidar do dinheiro da casa` (linha 70) e o bloco "O que é seu" do briefing N5 | O módulo 6 é literalmente "sair do papel de quem resolve tudo", então é ali que a distinção entre as duas saídas fica concreta. Mas o módulo 6 tem `bloqueado_em_modo_seguranca: true`: quem respondeu que tem medo hoje nunca abre esse módulo, e é exatamente quem mais precisa deste texto. Por isso o conteúdo vive fora do módulo, numa página livre, sem compra e sem modo. |

**Ordem no módulo 6, para os dois briefings não colidirem:** `## Cuidar do dinheiro da casa`, depois `## E se eu quiser sair` (este briefing), depois `## O que é seu` (briefing N5), depois `## Exercício da semana`.

**Posição e vitrine.** Nenhum dos três blocos pode ficar entre os dois primeiros títulos `##` do arquivo, porque a tela do módulo bloqueado monta "O que você vai ver nesta semana" com esses dois (`app/familia/programa/modulo/[n]/ModuloCliente.tsx:328`). Nas posições acima isso está respeitado. "Você também tem raiva" é a frase mais reconhecível que o programa tem, e ainda assim não vira vitrine de venda: conteúdo pesado não é chamariz.

---

## 1. Você também tem raiva

Entra em `content/familia/modulos/modulo-02.md`.

```
## Você também tem raiva

Tem dia em que você faz tudo certo. E tem dia em que você olha {{apelido}} dormindo e sente uma raiva que assusta.

Quase ninguém fala disso em voz alta. A gente fala do medo, da preocupação, do cansaço. A raiva fica guardada, porque parece feia em quem ama.

Ela não é feia. Ela é a conta de tudo o que foi deixado de lado por causa disso: as noites, o dinheiro, as festas de família, os planos que não aconteceram. Sentir raiva não diz nada sobre o tamanho do seu amor.

O que complica não é sentir. É descarregar na hora e pagar depois com culpa, e recomeçar tudo no dia seguinte.

Entre sentir e descarregar cabe um intervalo, e é esse intervalo que a gente vai treinar. Na próxima vez, antes de responder, saia do ambiente: um copo de água, a varanda, a escada, qualquer coisa que coloque dois minutos entre você e a frase que já está pronta.

Esses dois minutos não resolvem o problema de {{apelido}}. Eles evitam que o resto do dia seja sobre pedir desculpa.

:::se seguranca=sim
Se a raiva dentro de casa já virou medo ou agressão, sair do ambiente não é um intervalo, é segurança. Veja o seu plano antes de qualquer conversa.

[Ver o que fazer em caso de risco](/familia/seguranca)
:::
```

---

## 2. Saudade de quem ainda está aqui

Entra em `content/familia/modulos/modulo-07.md`.

```
## Saudade de quem ainda está aqui

Existe um tipo de saudade que não tem nome e não tem velório: a saudade de alguém que continua ali, do outro lado da mesa.

Você sente falta das conversas que vocês tinham, do jeito que {{apelido}} ria, dos planos que vocês faziam juntos. E, quando sente, parece exagero, porque a pessoa não morreu.

Não é exagero. Perder a convivência com alguém que continua vivo é uma perda de verdade, e ela merece ser chorada.

Dar esse nome costuma aliviar mais do que tentar não pensar. Quem chora a perda para de esperar que o dia seguinte devolva a pessoa de antes, e volta a enxergar quem está ali hoje.

Nada disso quer dizer que {{apelido}} não volte a ser quem era. Quando o uso diminui, parte do que vocês tinham costuma voltar, e parte volta diferente. Chorar agora não é desistir de {{apelido}}.
```

Sem botão: o bloco "O que é seu" do briefing N5, no mesmo módulo, já leva à escala.

---

## 3. E se eu quiser sair

### 3a. O bloco curto, no módulo 6

Entra em `content/familia/modulos/modulo-06.md`.

```
## E se eu quiser sair

Em algum momento, quase toda pessoa que cuida pensa em ir embora. E quase sempre esse pensamento vem com vergonha, como se pensar já fosse traição.

Pensar não é traição. E este programa não existe para te convencer a ficar.

Vale separar duas saídas, porque elas são bem diferentes. Uma é sair da relação. A outra é sair do papel de quem resolve tudo, continuando na relação.

A segunda é o assunto desta semana, e é o que muita gente que chega aqui está procurando sem ter nome para isso.

A primeira é uma decisão sua, e não cabe a este programa opinar sobre ela. O que cabe é deixar escrito, num lugar que você encontra quando precisar, o que ajuda ter na mão antes de decidir qualquer uma das duas.

@botao [Ver o que ter na mão antes de decidir](/familia/decisao)
```

### 3b. A página livre, em `/familia/decisao`

Página estática, no molde de `app/familia/seguranca/page.tsx`: sem compra, sem login, sem modo de segurança, sem diagnóstico. Indexável, como a página de segurança. Título da aba: `Fôlego · Margem`, como manda o briefing N1.

O `{{apelido}}` não existe nesta página, porque ela abre fora do programa, sem diagnóstico carregado. O texto abaixo já está escrito sem a variável.

**Título da página:** E se eu quiser sair
**Descrição, abaixo do título:** Duas saídas diferentes, o que ajuda ter na mão antes de decidir, e onde buscar orientação de graça.

```
Em algum momento, quase toda pessoa que cuida pensa em ir embora. E quase sempre esse pensamento vem com vergonha, como se pensar já fosse traição.

Pensar não é traição. Esta página não existe para te convencer a ficar nem para te convencer a sair.

## Duas saídas, que são bem diferentes

Uma é sair da relação: morar em outro lugar, se separar, se afastar de quem você ama.

A outra é sair do papel de quem resolve tudo, continuando na relação: parar de pagar as contas que não são suas, parar de dar desculpas no trabalho de outra pessoa, deixar de ser a única pessoa que segura a casa.

As duas são escolhas legítimas, e nenhuma das duas é mais corajosa que a outra. Muita gente chega aqui achando que só existe a primeira, e descobre que o que queria era a segunda.

O programa trabalha a segunda, semana por semana, principalmente no módulo 6. A primeira é sua, e ninguém precisa autorizar.

## Antes de decidir qualquer uma das duas

- Escolha um dia calmo. Decisão tomada no pior dia da semana quase sempre é revista no melhor, e o contrário também acontece.
- Converse com uma pessoa de fora antes: alguém de confiança, um profissional, um grupo de familiares.
- Saiba quais dívidas são suas, quais são da outra pessoa e quais são das duas. Isso muda tudo nas duas saídas.
- Guarde os seus documentos e os das crianças num lugar que só você sabe.

## Se for sair da relação

- Onde você vai ficar, mesmo que seja por alguns dias.
- Uma conta no seu nome, para receber o que é seu.
- Cópia dos documentos de todo mundo: identidade, CPF, certidão de nascimento, carteira de vacinação das crianças, comprovante de residência.
- Celular, carregador, chaves, remédios de uso contínuo e algum dinheiro separado.
- Quem vai saber antes, e quando.

Se houver medo da reação, não avise sem ter alguém por perto, e não avise dentro de casa. Nesse caso, a ordem muda: primeiro a sua segurança, depois a conversa.

## Se for sair do papel de resolver tudo

- Escolha uma coisa só para parar de fazer, a mais simples da lista.
- Avise antes, com calma, num momento sem efeito, e sem acusar ninguém.
- Espere piorar antes de melhorar. Nos primeiros dias vem reclamação e a sensação de estar sendo cruel.
- Não volte a discutir o assunto a cada cobrança. Você já avisou uma vez, e isso é suficiente.

O módulo 6 do programa trata disso em detalhe, com as quatro perguntas que ajudam a escolher o que devolver.

## Onde buscar orientação de graça

- **Defensoria Pública da sua cidade:** orienta sobre separação, guarda, pensão e divisão de dívida, sem custo, e pode pedir medida protetiva ao juiz quando há violência.
- **CRAS:** o centro de assistência social do seu bairro, que orienta sobre direitos, benefícios e serviços da cidade.
- **CREAS:** atende famílias e pessoas em situação de violência ou violação de direitos, com escuta, orientação jurídica e apoio para conseguir documentos.
- **Ligue 180:** a Central de Atendimento à Mulher funciona 24 horas, todos os dias, orienta e encaminha para os serviços da rede. Qualquer pessoa pode ligar, inclusive para pedir orientação sobre outra pessoa.
- **190:** se você estiver em perigo agora.

@botao [Ver serviços perto de mim](/redes-de-apoio?tipo=publicas)

## E se você decidir ficar

Ficar também é uma decisão, e vale o mesmo que as outras duas. Ficar por escolha é diferente de ficar por não ver saída, e a diferença entre as duas coisas aparece no dia a dia.

Essa decisão também não é definitiva. Dá para rever em um mês, em seis, em um ano, e rever não é fraqueza: é informação nova chegando.
```

### 3c. O link no painel

O conteúdo vai ser procurado num dia que não é o dia do módulo. Entra um card na seção "Ferramentas" do painel (`app/familia/programa/PainelCliente.tsx:262`), como último item, no mesmo padrão visual dos outros três:

- Título: **E se eu quiser sair**
- Botão secundário: **"Ver o que ter na mão antes de decidir"**, para `/familia/decisao`

Aparece sempre, inclusive em modo de segurança, e não depende de módulo liberado.

### 3d. O link na página de segurança

Em `app/familia/seguranca/page.tsx`, depois dos contatos de emergência, nunca antes deles:

- Link: **"Se você estiver pensando em ir embora"**, para `/familia/decisao`

Quem chega na página de segurança pelo resultado em modo segurança é quem mais precisa achar esse texto, e é quem não vai abrir o módulo 6.

---

## O que não entra neste texto, em nenhuma revisão futura

Esta lista existe para ninguém "melhorar" o bloco depois e quebrar a decisão.

**Nada de linguagem de codependência.** Sem as palavras codependência e codependente, sem "facilitador", sem "amar demais", sem "você se anulou", sem "aprenda a se amar primeiro", sem "solte a mão". A Margem não adota esse vocabulário, e o modelo de estresse e enfrentamento que sustenta esta parte do programa rejeita essa explicação: o papel de quem resolve tudo foi construído pela situação, não por um defeito de quem cuida.

**Nada de recomendação.** O texto oferece critérios, nunca conselho sobre ficar ou sair. Se alguma frase futura começar com "o melhor é", ela está errada.

**Nada de promessa.** Nem de que sair resolve, nem de que ficar melhora.

**Nenhum passo a passo de como internar alguém.** Internação é assunto do briefing N9.

---

## Código

- `content/familia/modulos/modulo-02.md`: o bloco "Você também tem raiva" na posição da tabela.
- `content/familia/modulos/modulo-07.md`: o bloco "Saudade de quem ainda está aqui".
- `content/familia/modulos/modulo-06.md`: o bloco curto "E se eu quiser sair", antes do bloco "O que é seu" do N5.
- `app/familia/decisao/page.tsx`: página nova, estática, texto do item 3b inline, com o comentário `// nivel-1` no topo. Sem `robots: noindex`.
- `app/familia/programa/PainelCliente.tsx`: o card novo no fim da seção "Ferramentas".
- `app/familia/seguranca/page.tsx`: o link do item 3d, depois de `ContatosEmergencia`.
- `docs/revisao-conteudo.md`: os três blocos e a página nova na lista "a publicar", como nível 1.

---

## Critério de aceite

- "Você também tem raiva" está no módulo 2, depois de "As suas reações", e aparece também em modo de segurança, com o parágrafo extra e o link do plano.
- "Saudade de quem ainda está aqui" está no módulo 7, antes de "O que dá sentido aos seus dias".
- No módulo 6, a ordem é: Cuidar do dinheiro da casa, E se eu quiser sair, O que é seu, Exercício da semana.
- Nenhum dos três blocos aparece em "O que você vai ver nesta semana" de nenhum módulo bloqueado.
- `/familia/decisao` abre sem login, sem compra e em modo de segurança, e não quebra sem diagnóstico carregado.
- A página não contém `{{apelido}}`.
- A página separa as duas saídas, tem o checklist das duas e os cinco serviços, e não recomenda nenhum dos dois caminhos.
- O card "E se eu quiser sair" aparece no painel, inclusive em modo de segurança.
- Na página de segurança, o link novo vem depois dos contatos de emergência.
- Nenhuma ocorrência das palavras codependência, codependente ou facilitador em `content/familia` e em `app/familia`.
- Sem travessão, sem gênero marcado na pessoa que lê, sem palavra proibida.
