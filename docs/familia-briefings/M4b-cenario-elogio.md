# Briefing M4b: cenário `elogiar-sem-ironia` (texto pronto, é só aplicar)

Pré-requisito: briefing 00. Completa o briefing M4. Hoje o botão "Treinar um elogio", no card de elogios da ferramenta "planejar como valorizar", fica escondido porque o arquivo do cenário não existe. Este briefing cria o cenário e corrige dois problemas que aparecem junto com ele.

Texto da cena e das reações: Gemini escreveu, Claude revisou.

## 1. Criar `content/familia/cenarios/elogiar-sem-ironia.md`

Conteúdo exato do arquivo:

```markdown
---
id: "elogiar-sem-ironia"
titulo: "Elogiar sem soar como cobrança"
contexto: "Um fim de tarde calmo em casa. {{apelido}} acabou de ajudar a arrumar a cozinha, e o clima está tranquilo. O familiar quer dizer que percebeu, sem que isso soe como cobrança."
objetivo_do_familiar: "Elogiar uma coisa específica, sem cobrança e sem ironia."
bloqueado_em_modo_seguranca: false
gratis: false
nota_do_personagem: "Nesta cena ninguém está acusando nem cobrando nada: o familiar quer elogiar algo que {{apelido}} acabou de fazer. Comece desconfiando do elogio, como alguém que já ouviu ironia antes, no tom destas falas: 'Você tá falando de verdade ou tá debochando de mim?', 'Hum, já vai vir cobrança depois desse comentário?', 'Ué, o que você tá querendo pedir com esse papo?'. Se o elogio for curto, específico e sem lembrar o passado, vá relaxando e aceite. Se vier com cobrança, com comparação com antes ou com ironia, se feche."
foco_do_feedback: "Nesta cena, avalie principalmente ser breve, ser positivo, falar de um comportamento específico e nomear o próprio sentimento. Não sugira oferecer ajuda nem abrir o assunto do uso: aqui o objetivo é reconhecer uma coisa boa, nada além disso. Diga se o elogio trouxe o passado de volta, cobrou algo para o futuro ou soou como ironia."
---

<!-- Cena e reações escritas com o Gemini e revisadas. O personagem desconfia do elogio em vez de negar um problema, porque aqui não há acusação nenhuma no ar. O feedback não pede "oferecer ajuda": num elogio, isso viraria proposta. -->
```

Cuidado com o parser: `separarFrontmatter` (em `lib/familia/markdown.ts`) lê uma linha por chave, não aceita bloco de várias linhas e corta tudo que vem depois de `#`. Por isso cada valor fica numa linha só, entre aspas duplas, com aspas simples por dentro e sem nenhum `#`.

`bloqueado_em_modo_seguranca` é `false` de propósito: elogiar um momento bom é a parte do método que continua valendo mesmo quando existe risco. O que sai no modo segurança é a parte de adiar o combinado, não o elogio.

## 2. Dois campos novos no cenário: `nota_do_personagem` e `foco_do_feedback`

Por que existem. O `content/familia/prompts/personagem.md` é um prompt único para todos os cenários, e ele manda o personagem começar "com defesa, desconforto ou negação". Aqui não há nada a negar: o familiar só vai elogiar. E o `feedback.md` avalia as 7 habilidades, inclusive "oferecer ajuda", que num elogio vira uma proposta fora de hora. Sem um ajuste por cenário, o treino do elogio sai errado nas duas pontas.

Os dois campos são opcionais. Cenário sem eles (`primeira-conversa` e `nega-o-problema`) continua funcionando exatamente como hoje.

**a) `lib/familia/conteudo.ts`**
- No type `Cenario`, acrescentar `notaDoPersonagem: string` e `focoDoFeedback: string`.
- No retorno de `lerCenario`, acrescentar `notaDoPersonagem: texto(dados.nota_do_personagem) ?? ""` e `focoDoFeedback: texto(dados.foco_do_feedback) ?? ""`.

**b) `app/api/familia/simulador/route.ts`**
- `promptDoPersonagem` passa a receber o cenário inteiro, no lugar de só o contexto. Quando `notaDoPersonagem` não estiver vazia, acrescentar ao fim do prompt, depois de uma linha em branco: `Ajuste para esta cena:` e a nota.
- Nas duas chamadas de `gerarFeedback`, a de desenvolvimento (linha 71) e a real (linha 177): quando `focoDoFeedback` não estiver vazio, acrescentar ao fim do prompt do feedback, depois de uma linha em branco: `Foco desta cena:` e o texto.

**c) Corrigir a ordem das substituições em `promptDoPersonagem`.** Hoje `{{contexto_do_cenario}}` é o último `replaceAll` da cadeia, então `{{apelido}}` escrito dentro do contexto de um cenário entra no prompt sem ser substituído, porque a substituição do apelido já tinha passado. Mover o `replaceAll("{{contexto_do_cenario}}", ...)` e a nova nota para **antes** do `replaceAll("{{apelido}}", ...)`. O mesmo vale para o `foco_do_feedback`: juntar o texto ao prompt primeiro e substituir o apelido depois.

Na tela isso já funciona: o `SimuladorCliente` passa o contexto por `aplicarApelido`.

**d) `app/familia/programa/simulador/[cenario]/page.tsx`**
O `generateStaticParams` tem a lista fixa dos cenários. Acrescentar `{ cenario: "elogiar-sem-ironia" }`, senão a página responde 404.

## 3. O botão, no M4

Com o arquivo criado, o botão secundário "Treinar um elogio" passa a aparecer no card de elogios. Rótulo exato, do briefing 00, item 7: **"Treinar um elogio"**. Título da tela do treino: **"Treino: elogiar sem soar como cobrança"**.

## 4. Critério de aceite

- `/familia/programa/simulador/elogiar-sem-ironia` abre, com o título e a cena na tela, e o apelido já aparece no lugar de `{{apelido}}`.
- A primeira resposta do personagem desconfia do elogio e não fala de uso nem de problema.
- Elogio curto, específico e sem lembrar o passado: o personagem relaxa. Elogio com cobrança, comparação com antes ou ironia: o personagem se fecha.
- O feedback não sugere oferecer ajuda nem abrir o assunto do uso.
- `primeira-conversa` e `nega-o-problema` continuam com o mesmo prompt de antes, sem nada acrescentado.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
