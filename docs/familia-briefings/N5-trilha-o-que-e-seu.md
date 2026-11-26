# Briefing N5: a trilha "O que é seu" e o bloco que abre o resultado

Pré-requisito: briefings 00, N1, N2, N3 e N4 aplicados. Substitui a proposta 2.1 de `claude/programa-familia-melhorias-conteudo.md`, que fica como histórico.

**Como executar.** Duas partes, com modelos diferentes, na ordem abaixo.

| Parte | O que é | Modelo | Esforço |
|---|---|---|---|
| **1** | Os 8 blocos de módulo. Markdown puro, nenhuma linha de código. | Sonnet 5.5 | médio |
| **2** | O bloco que abre a página de resultado. Decide estado, ordem de tela e o que aparece em modo segurança. | Opus 5 | alto |

Todo o texto de tela já está escrito aqui. Não reescreva, não complete, não invente microcopy. Nada passou pelo Gemini.

---

## O problema

Das 8 semanas, 6 são sobre {{apelido}} e 2 têm o familiar como assunto. O título da LP promete as duas coisas ("Você não precisa escolher entre ajudar quem você ama e cuidar de você") e o conteúdo entrega uma. Quem compra na segunda recebe explicação e tarefa de observação, e o benefício próprio chega na semana 7.

Além disso, três coisas que só aparecem lendo o código:

**1. O PHQ-4 não é coletado no diagnóstico.** Ele existe só no check-in semanal, que acontece dentro do programa, depois da compra (`docs/familia-briefings/M8b-checkin-semanal.md`, item 3). No diagnóstico o que existe é uma pergunta única, a Q11 `esgotamento`, de 0 a 3 (`lib/familia/diagnostico.ts:173`), e ela serve só para escolher entre dois textos de "Um passo para você" (`lib/familia/resultado.ts:103` e `:133`). Então o bloco novo deste briefing é construído sobre a Q11, que é o dado que existe naquele ponto. Levar o PHQ-4 para o diagnóstico é outra decisão, de outro briefing, e tem custo: são 4 perguntas a mais antes do resultado, em texto de nível 1. O bloco abaixo não depende dessa decisão.

**2. O `caution_mode` nunca liga.** `lib/familia/markdown.ts:38` diz com todas as letras que não existe regra que ligue o modo, então `cautela` vale sempre "nao". Só que o texto de cautela já está escrito e já está no repositório, em quatro lugares: `modulo-03.md:109`, `modulo-04.md:69` e `:73`, `modulo-05.md:22` e `:95`, `modulo-06.md:82` e `:86`. Hoje é texto morto. Este briefing liga o modo, e o item 3 abaixo diz exatamente o que passa a aparecer.

**3. Em modo segurança, a página de resultado manda a pessoa retomar um hobby.** `umPasso` é escolhido só pela Q11 (`lib/familia/resultado.ts:133`), sem olhar o modo. Quem respondeu "tenho esse medo hoje" recebe, logo abaixo do cartão de segurança, "Retome nesta semana algo que você gostava de fazer e deixou de lado". O item 2 abaixo corrige isso.

---

## 1. Os 8 blocos de módulo

Cada módulo passa a ter um bloco fixo chamado **"O que é seu"**, com uma ação de dois minutos e um botão. Markdown comum: título `##`, parágrafos e uma linha `@botao`. O leitor de `lib/familia/markdown.ts` já entende tudo isso, e nenhum componente novo é necessário.

**Onde entra, em cada arquivo de `content/familia/modulos/`:**

| Arquivo | Entra logo antes de | Linha de referência hoje |
|---|---|---|
| `modulo-01.md` | `## Exercício da semana` | 95 |
| `modulo-02.md` | `## Exercício da semana: o diário de 7 dias` | 52 |
| `modulo-03.md` | `## Exercício da semana` | 96 |
| `modulo-04.md` | `## Exercício da semana` | 59 |
| `modulo-05.md` | `## Exercício da semana` | 99 |
| `modulo-06.md` | `## Exercício da semana` | 80 |
| `modulo-07.md` | `## Exercício da semana` | 61 |
| `modulo-08.md` | `## Oito semanas depois` | 122 |

**Duas regras de posição, e elas não são detalhe.**

O bloco vai **sempre depois do último título de conteúdo e antes do exercício**, nunca no topo. O motivo está em `app/familia/programa/modulo/[n]/ModuloCliente.tsx:328`: a tela do módulo bloqueado monta "O que você vai ver nesta semana" com os **dois primeiros títulos `##` de primeiro nível** do arquivo. Subir o bloco troca a vitrine do módulo pago sem ninguém pedir.

No módulo 8 ele fica entre o último `:::exercicio` e `## Oito semanas depois`, porque ali o encerramento é a última palavra da tela e continua sendo.

### Módulo 1

```
## O que é seu

Faz tempo que a pergunta da casa é sobre {{apelido}}: como chegou, de que humor, se dormiu. Quase ninguém pergunta como você andou na semana.

Essa conta existe e tem nome. O sono que encurtou, as contas da casa que passaram a ser só sua responsabilidade, as amizades que foram ficando para depois.

Nesta semana, antes de olhar para o padrão de {{apelido}}, olhe para o seu. Dê uma nota honesta para cada área da sua vida, inclusive as que você prefere não encarar.

Dois minutos, e a nota não precisa ser bonita. Ela serve para você ter de onde sair, não para provar nada a ninguém.

@botao [Dar uma nota para as 8 áreas da sua vida](/familia/programa/escala)
```

### Módulo 2

```
## O que é seu

Durante sete dias você vai anotar o que {{apelido}} fez, o que veio antes e como você reagiu. Repare onde você aparece nessas anotações: quase só na linha da sua reação.

Isso não é falha do diário. É o retrato de como a casa foi ficando, com uma pessoa no centro e as outras em volta, reagindo.

Hoje, dois minutos para reler o que você escreveu. Em vez de procurar o padrão de {{apelido}}, procure o seu: a que horas você fica em alerta, o que você já nem conta para ninguém.

Enxergar isso não tira nada de {{apelido}}. Só devolve você para dentro da história.

@botao [Ver as suas anotações](/familia/programa/diario/anotacoes)
```

### Módulo 3

```
## O que é seu

Falar diferente cansa. Nas primeiras vezes você vai sair da conversa com o coração batendo e com a sensação de ter engolido metade do que queria dizer.

Essa metade não desaparece. Ela fica em você, e costuma voltar à noite, quando a casa silencia.

Então combine uma coisa com você: depois de cada conversa difícil, dois minutos para descarregar. Pode ser anotar aqui o que você não disse, uma volta no quarteirão, ou ligar para alguém e falar de qualquer outro assunto.

Guardar a frase certa é com {{apelido}}. O que você guardou é com você.

@botao [Anotar um momento difícil](/familia/programa/diario)
```

### Módulo 4

```
## O que é seu

Esta semana pede que você repare no que vai bem com {{apelido}} e diga isso em voz alta. Vale reparar também que ninguém tem feito isso com você.

Quem passa meses no modo de resolver problema perde o costume de notar o que presta no próprio dia. Não é falta de vontade: é o que o cansaço faz com a atenção.

Então, junto com o momento bom de {{apelido}}, anote um que foi seu. Um café que deu tempo de tomar com calma, uma música no caminho, cinco minutos de silêncio.

Dois minutos, uma linha. Casa que só registra o que deu errado vai ficando sem memória de coisa boa.

@botao [Anotar um momento bom](/familia/programa/diario)
```

### Módulo 5

```
## O que é seu

Convidar expõe. Você vai estender a mão sabendo que ela pode ser recusada, e isso mexe com qualquer pessoa.

O que costuma derrubar não é o não em si. É receber o não sem ter para onde ir depois, e passar a noite remoendo a conversa.

Antes de convidar, decida uma coisa só: quem você vai procurar no dia em que a resposta vier, qualquer que ela seja. Uma pessoa, um grupo, um lugar para ir.

Dois minutos para escolher esse nome agora, com a cabeça fria. Um não não te deixa sem chão quando você já combinou onde pisar.

@botao [Escolher quem você pode procurar](/familia/programa/rede)
```

### Módulo 6

```
## O que é seu

Parar de resolver pela outra pessoa libera tempo e dinheiro, e quase ninguém se prepara para isso.

Nas primeiras semanas esse espaço vazio costuma incomodar mais do que a tarefa que você deixou de fazer. Resolver também era um jeito de sentir que você estava fazendo algo.

Por isso, escolha agora para onde esse espaço vai. Não precisa ser grande: dormir no seu horário, um banho sem pressa, uma série que é sua.

Dois minutos para virar isso numa meta pequena desta semana, com dia e hora. Espaço que fica vazio volta a ser ocupado pelo problema.

@botao [Criar a sua meta desta semana](/familia/programa/escala?etapa=meta)
```

### Módulo 7

```
## O que é seu

Este módulo inteiro é seu, e é o mais difícil de começar. Olhar para a própria vida depois de seis semanas olhando para {{apelido}} costuma doer mais do que as pessoas esperam.

A conta do que ficou de lado só aparece quando alguém para para ver: os planos adiados, o corpo, as pessoas que sumiram da sua semana sem briga nenhuma.

Dar as notas de novo serve para isso, e não para se comparar com o módulo 1. Algumas áreas vão ter subido, outras não, e as duas coisas são informação.

Dois minutos para a primeira nota. Depois siga, uma área por vez, sem arredondar para cima.

@botao [Dar notas de novo para as 8 áreas da sua vida](/familia/programa/escala)
```

### Módulo 8

```
## O que é seu

O programa acaba aqui, e a situação de {{apelido}} provavelmente continua em aberto. As duas coisas podem ser verdade ao mesmo tempo.

O que você aprendeu em oito semanas não fica com {{apelido}}, fica com você: o jeito de falar, o que você devolveu, as metas que você cumpriu em semanas difíceis.

O que sustenta isso depois não é força de vontade, é companhia. Quem segue com um grupo, um profissional ou uma pessoa de confiança por perto costuma manter o que construiu por muito mais tempo.

Dois minutos para escolher onde você vai continuar aparecendo depois desta semana. Um grupo de familiares, uma conversa marcada, um nome no celular.

@botao [Ver grupos para familiares](/redes-de-apoio)
```

### Sobre os botões, para ninguém "consertar" depois

Todos os oito destinos já existem. Nenhuma rota nova, nenhum parâmetro inventado:

| Módulo | Destino | Já usado em |
|---|---|---|
| 1 e 7 | `/familia/programa/escala` | painel e exercício dos módulos 1 e 7 |
| 2 | `/familia/programa/diario/anotacoes` | exercício do módulo 2 |
| 3 e 4 | `/familia/programa/diario` | exercícios dos módulos 1 e 2 |
| 5 | `/familia/programa/rede` | exercício do módulo 7 |
| 6 | `/familia/programa/escala?etapa=meta` | painel (`PainelCliente.tsx:306`) |
| 8 | `/redes-de-apoio` | módulos 5 e 7 |

Nos módulos 1 e 7 o botão leva à mesma ferramenta do primeiro card do exercício, e isso é de propósito: nesses dois módulos o bloco é a espinha, e o botão existe para que a pessoa abra a escala pelo motivo certo, que é ela mesma. Em nenhum outro módulo o botão repete a ferramenta da semana.

### Uma linha a mais no módulo 1

A lista "O que vem pela frente" (`modulo-01.md:72`) descreve o programa antigo. Acrescente uma linha ao fim do bloco `:::se seguranca=nao`, depois do item 7:

```
Em todas as oito semanas, uma parte do módulo é sobre você, e não sobre {{apelido}}.
```

No bloco `:::se seguranca=sim` (linha 86), acrescente a mesma linha depois do item 2.

---

## 2. O bloco que abre a página de resultado

**Parte de Opus 5, esforço alto.** É aqui que está a lógica.

### O que muda na tela

A página de resultado passa a ter, como primeira seção depois do topo verde, um bloco chamado **"O que isso está fazendo com você"**. A ordem nova fica assim:

1. Topo (h1 "Seu mapa da situação" e acolhimento), como é hoje
2. **"O que isso está fazendo com você"** (novo)
3. "O que joga a seu favor" e "Ponto de atenção"
4. "Sua primeira conversa", ou "Sua segurança vem primeiro" em modo segurança
5. Avisos
6. Banner de oferta ou "Começar o módulo 1"

**A seção "Um passo para você" deixa de existir como seção própria.** O texto dela (`ResultadoVisao.tsx:116`) passa para dentro do bloco novo, como último parágrafo, sob o rótulo **"O seu passo desta semana"**. Hoje ela aparece depois do roteiro da conversa, solta, e é a única parte da página que fala do familiar. Dentro do bloco novo ela fica no lugar certo, e a página deixa de ganhar uma seção: ela troca de lugar.

**Em modo segurança o passo não aparece.** O passo da pessoa, nesse caso, é o cartão de segurança que vem logo abaixo, e ele já diz o que fazer. É isso que corrige o furo 3 do começo deste briefing.

### Os três modos

```ts
// lib/familia/diagnostico.ts, ao lado de calcularSafetyMode (linha 198).

// Q8 "já aconteceu no passado" ou Q9 "sim, raramente": houve medo ou agressão, e não é hoje.
// Violência passada é o preditor mais forte de violência futura, então o programa fica mais
// cuidadoso, nunca menos. O check-in semanal (briefing M8b, item 5) soma a este valor quando a
// pessoa responde "Sim, e ficou tenso" na ferramenta de adiar.
export function calcularCautela(respostas: Respostas, cautelaDoCheckin = false) {
  if (calcularSafetyMode(respostas)) return false; // segurança vence cautela
  return cautelaDoCheckin || respostas.medo === "passado" || respostas.agressao === "raramente";
}

export type Modo = "normal" | "cautela" | "seguranca";

export function calcularModo(respostas: Respostas, cautelaDoCheckin = false): Modo {
  if (calcularSafetyMode(respostas)) return "seguranca";
  return calcularCautela(respostas, cautelaDoCheckin) ? "cautela" : "normal";
}
```

`safetyMode` continua existindo em `Resultado` exatamente como está (`resultado.ts:13`), porque o painel, o rastreio e o banner de oferta usam esse campo. `modo` entra ao lado, não no lugar.

### O que isso liga nos módulos

O `contexto.cautela` que alimenta os `:::se cautela=sim` passa a vir de `calcularCautela`. Isso acende quatro textos que já estão escritos no repositório e que nunca apareceram. Leia antes de subir, porque a partir daqui eles vão para a tela:

| Onde | O que passa a acontecer em cautela |
|---|---|
| `modulo-03.md:109` | dentro do item "Usar uma frase nova na vida real", entra "Se o clima estiver tenso, deixe para outro dia. Não existe hora certa com medo." |
| `modulo-04.md:69` e `:73` | a ferramenta de adiar sai do exercício e o card vira "Esta parte fica para quando você tiver conversado com um profissional." |
| `modulo-05.md:22` | o módulo do convite abre com o card de cautela e o carrossel de psicólogos |
| `modulo-05.md:95` | antes do exercício, entra "Se você tem receio da reação, faça o convite com outra pessoa por perto ou converse antes com um profissional." |
| `modulo-06.md:86` | o item "Escolher o que devolver" ganha a linha sobre escolher algo que não envolva conversa direta |
| `ModuloCliente.tsx:469` | o carrossel do fim dos módulos 5 e 6 sai, porque já aparece no texto |

Quem marcou "já aconteceu no passado" na Q8 hoje recebe o programa idêntico a quem nunca teve medo em casa. A única diferença atual é o `FAVOR_SEM_VIOLENCIA` não aparecer na lista do resultado (`resultado.ts:88`). Se você preferir que a cautela valha só na página de resultado e não nos módulos, é uma linha: passe `cautela: false` no contexto do módulo. Prefiro não, e o motivo é que todos os seis textos acima são mais cuidadosos, nenhum é mais arriscado.

### Os textos

Entram em `content/familia/resultado-blocos.md`, numa seção nova chamada `## O que isso está fazendo com você`, antes da seção "Um passo para você". **Todos são nível 1** do briefing N2: leia em voz alta antes de subir.

**Cada linha do bloco é um parágrafo na tela.** Use `linhas()` e não `texto()` em `resultado.ts`: `texto()` junta tudo com espaço e entregaria um parágrafo único de seis frases, que é o oposto do que estes blocos precisam ser. Por isso `comoAfeta` é `string[]`, e a tela renderiza um `<p className="text-large">` por item. As linhas em branco dentro do bloco são ignoradas pelo `lerBlocos`, então pode escrever com ou sem elas.

```
[AFETA_NORMAL_LEVE]
Você contou que o cansaço, a ansiedade ou o sono ruim apareceram em alguns dias das últimas duas semanas. É menos do que muita gente que chega aqui carrega, e é um bom lugar para começar.
Vale saber como isso costuma andar: o desgaste de quem convive com o problema sobe devagar, sem aviso, e quase sempre é percebido tarde. Quem acompanha a própria semana percebe antes.
Por isso o programa tem duas partes que andam juntas. Uma é o que você pode fazer com {{apelido}}, e a outra é o que acontece com você, que vale por si, aconteça o que acontecer com {{apelido}}.

[AFETA_NORMAL_PESADO]
Você contou que o cansaço, a ansiedade ou o sono ruim apareceram na maior parte dos dias das últimas duas semanas. Isso não é fraqueza nem exagero: é o que acontece com um corpo que passa meses em estado de alerta.
Quem vive isso costuma achar que vai cuidar de si quando a situação de {{apelido}} melhorar. Na prática funciona ao contrário, porque pouca gente consegue manter a calma numa conversa difícil estando no limite.
Então o seu cuidado não entra no fim da fila. Ele começa nesta semana, junto com o resto.

[AFETA_CAUTELA]
Você contou que já houve medo ou agressão em casa, mesmo que não seja hoje. Isso muda o que vem a seguir, e muda para mais cuidado, não para menos.
O corpo de quem já passou por isso aprende a ficar de guarda, e ficar de guarda cansa até nos dias calmos. Boa parte do que aparece de noite tem essa explicação, e não falta de motivo.
Nas próximas semanas, algumas partes vêm com um aviso antes: mudar o jeito de reagir em casa pode mexer com o clima, e vale conversar com um profissional antes de mexer. O seu plano de segurança fica salvo e disponível a qualquer momento, com ou sem o programa.

[AFETA_SEGURANCA]
Você contou que esse medo existe hoje. Antes de qualquer coisa sobre {{apelido}}, vale dizer o que viver assim faz com uma pessoa.
Viver em alerta cobra do corpo todos os dias: o sono fica raso, a atenção fica presa na porta, o estômago fecha. Isso não é frescura nem falta de amor por {{apelido}}, é o que acontece com qualquer pessoa que não se sente protegida dentro de casa.
E costuma vir com uma conta a mais, que é a vergonha de sentir alívio quando a casa está vazia. Esse alívio não diz nada contra você.
Logo abaixo, o programa começa pela sua segurança, e não por uma conversa. Essa ordem não é um atraso no caminho: ela é o caminho.
```

### Qual texto entra, e com o que embaixo

| Modo | Texto | "O seu passo desta semana" | Extra |
|---|---|---|---|
| normal, Q11 igual a 0 ou 1 | `AFETA_NORMAL_LEVE` | `PASSO_MODERADO` | nada |
| normal, Q11 igual a 2 ou 3 | `AFETA_NORMAL_PESADO` | `PASSO_ESGOTADO` | nada |
| cautela, Q11 igual a 0 ou 1 | `AFETA_CAUTELA` | `PASSO_MODERADO` | botão secundário "Ver o que fazer em caso de risco" para `/familia/seguranca` |
| cautela, Q11 igual a 2 ou 3 | `AFETA_CAUTELA` | `PASSO_ESGOTADO` | o mesmo botão |
| segurança | `AFETA_SEGURANCA` | não aparece | nada, porque o cartão de segurança vem logo abaixo |

A regra da Q11 é a que já existe no código (`esgotado = Number(respostas.esgotamento ?? "0") >= 2`). Nenhum corte novo, nenhuma faixa nova.

---

## Código

**Parte 1, markdown apenas:**
- `content/familia/modulos/modulo-01.md` a `modulo-08.md`: o bloco "O que é seu" na posição da tabela do item 1, e as duas linhas novas em `modulo-01.md`.

**Parte 2:**
- `lib/familia/diagnostico.ts`: `calcularCautela`, `calcularModo` e o tipo `Modo`, ao lado de `calcularSafetyMode` (linha 198).
- `lib/familia/resultado.ts`: `Resultado` ganha `modo: Modo` e `comoAfeta: string[]`, preenchido com `linhas()`. `montarResultado` ganha o modo por parâmetro, no lugar do `safetyMode: boolean` de hoje (linha 99), e continua preenchendo `safetyMode` a partir dele. `umPasso` continua como está na linha 133.
- `content/familia/resultado-blocos.md`: a seção nova com os quatro blocos.
- `app/familia/resultado/ResultadoVisao.tsx`: a seção nova depois do topo (linha 50), e a remoção da seção "Um passo para você" de hoje (linhas 114 a 119), cujo texto passa para dentro da seção nova.
- `app/familia/resultado/exemplo/ExemploCliente.tsx` e `ResultadoCliente.tsx`: passam o modo para `montarResultado`.
- `app/familia/programa/modulo/[n]/ModuloCliente.tsx`: `contexto.cautela` deixa de ser fixo e passa a vir do diagnóstico.
- `lib/familia/markdown.ts`: apagar o comentário das linhas 38 e 39, que diz que a regra não existe.
- `docs/revisao-conteudo.md`: os quatro blocos `AFETA_*` entram na lista "a publicar", como nível 1.
- Teste de `montarResultado` em Node: um caso por modo, conferindo que em segurança o `umPasso` não vai para a tela.

---

## Critério de aceite

- Os 8 módulos têm o bloco "O que é seu", sempre depois do último título de conteúdo e antes do exercício.
- A tela do módulo bloqueado continua mostrando os mesmos dois títulos de antes, em nenhum módulo "O que é seu" aparece ali.
- Os 8 botões abrem as rotas da tabela, e nenhuma rota nova foi criada.
- A página de resultado abre, depois do topo, com "O que isso está fazendo com você".
- Não existe mais uma seção "Um passo para você" solta na página; o passo aparece dentro do bloco novo, com o rótulo "O seu passo desta semana".
- O bloco novo aparece com um parágrafo por linha do arquivo, nunca como um parágrafo único.
- Em modo segurança nenhum passo de autocuidado aparece na página.
- Em modo cautela o bloco traz o botão para `/familia/seguranca`.
- Os `:::se cautela=sim` dos módulos 3, 4, 5 e 6 aparecem para quem marcou "já aconteceu no passado" na Q8 ou "sim, raramente" na Q9.
- Nenhum número de escore, nem as palavras leve, moderado, grave, ansiedade ou depressão, aparece na tela.
- Os quatro blocos `AFETA_*` estão em `docs/revisao-conteudo.md` como nível 1.
- Sem travessão, sem gênero marcado na pessoa que lê, sem palavra proibida.
