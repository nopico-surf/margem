# Briefing M5c: cenário `convite-para-ajuda` (texto pronto, é só aplicar)

Pré-requisito: briefings 00 e M4b, que criou os dois campos opcionais do cenário (`nota_do_personagem` e `foco_do_feedback`) e corrigiu a ordem das substituições. Se o M4b ainda não foi aplicado, aplique antes: este cenário usa os mesmos campos.

Com este arquivo, o botão "Treinar o convite" do módulo 5 deixa de ficar escondido.

Texto da cena e das reações: Gemini escreveu, Claude revisou.

## 1. Criar `content/familia/cenarios/convite-para-ajuda.md`

```markdown
---
id: "convite-para-ajuda"
titulo: "Convidar sem soar como ultimato"
contexto: "Uma noite calma na sala, sem pressa e sem discussão no ar. {{apelido}} está tranquilo, e o familiar já tem uma opção concreta na mão, com dia e horário, para oferecer."
objetivo_do_familiar: "Fazer o convite com uma opção pronta, e aceitar um não sem discussão."
bloqueado_em_modo_seguranca: true
gratis: false
nota_do_personagem: "Nesta cena o familiar vai convidar {{apelido}} a marcar uma conversa com um profissional. Não aceite logo de primeira. Recuse com educação, sem briga, no tom destas falas: 'Eu agradeço a intenção, mas não preciso de ninguém de fora me dizendo o que fazer.', 'Hoje eu não quero marcar nada, prefiro seguir no meu próprio tempo.', 'Eu posso até pensar nisso depois, mas agora não quero falar sobre essa ideia.'. Se o convite for curto, com uma opção concreta e sem cobrança, abra um pouco: pergunte como seria, ou diga que pode pensar. Se vier ameaça, ultimato, choro de cobrança ou lembrança do passado, feche e encerre o assunto."
foco_do_feedback: "Nesta cena, um não é um resultado bom, nunca uma falha. Nunca diga ao familiar que ele deveria ter insistido, e nunca sugira repetir o convite na mesma conversa. Avalie se o convite foi curto, se ofereceu uma opção concreta em vez de uma ideia solta, se falou do sentimento de quem convida em vez de defeito de quem ouve, e se não teve ultimato, chantagem nem passado. Se {{apelido}} disse não e o familiar aceitou sem discutir, diga que isso foi o acerto da conversa e que deixa a porta aberta para outro dia."
---

<!-- Cena e reações escritas com o Gemini e revisadas. As três recusas são educadas de propósito: a recusa com briga é fácil de reconhecer, a educada é a que faz o familiar insistir. Bloqueado no modo segurança pela mesma razão da primeira conversa: com risco de violência, um convite pode virar estopim. -->
```

Mesmo cuidado do M4b com o parser: uma linha por chave, entre aspas duplas, aspas simples por dentro, sem `#`.

## 2. Ligar o cenário

- `app/familia/programa/simulador/[cenario]/page.tsx`: acrescentar `{ cenario: "convite-para-ajuda" }` ao `generateStaticParams`.
- O botão no módulo 5 é **"Treinar o convite"** (briefing 00, item 7). Título da tela: **"Treino: convidar sem soar como ultimato"**.

## 3. Por que o foco do feedback é tão específico

O prompt geral do feedback avalia as 7 habilidades, e uma delas é "oferecer ajuda". Num treino de convite, isso empurra o retorno para premiar quem insiste e para tratar o não como fracasso. É o contrário do método: o convite é de baixo compromisso, nunca ultimato, e aceitar o não é o que mantém a porta aberta para a próxima vez. Sem o `foco_do_feedback`, o treino ensinaria pressão.

## 4. Critério de aceite

- `/familia/programa/simulador/convite-para-ajuda` abre, com o apelido no lugar de `{{apelido}}`.
- O personagem recusa de forma educada na primeira resposta, sem briga.
- Convite curto e com opção concreta: o personagem abre um pouco. Ultimato, chantagem ou passado: o personagem encerra.
- O feedback nunca sugere insistir nem repetir o convite na mesma conversa, e trata o não aceito como acerto.
- Em `safety_mode` o cenário fica bloqueado, como a primeira conversa.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
