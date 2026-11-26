# Briefing N12: a amostra da LP vira um slider com 5 exemplos

Para: Claude Design rever e desenhar. Depois do design aprovado, o Claude Code implementa a partir deste arquivo e do que o Claude Design devolver.

Pré-requisito: N4 aplicado (o bloco de amostra já existe em `app/familia/page.tsx`, linhas 339 a 352). Este briefing substitui o item 2 do N4 ("Amostra do conteúdo na LP"), inclusive a decisão de deixar o bloco sem botão.

Textos: escritos pelo Claude.

## O problema

Hoje o bloco "O que você vai aprender, na prática" mostra um exemplo só, de apostas e dinheiro. Quem chegou pela bebida ou por outras drogas pode não se reconhecer nele. E o bloco mostra só uma das cinco coisas que o programa ensina: as outras quatro ficam descritas no bloco de cima, sem nenhuma amostra.

Três ajustes no texto atual (`page.tsx`, linhas 346 a 351):

- "Vamos sentar no domingo para olhar as contas juntos?": "juntos" marca gênero em quem fala.
- "Ela é mais eficiente" soa como linguagem de empresa e afirma mais do que dá para garantir.
- "São 8 semanas disso, com as frases da sua casa" fecha o bloco sem dizer qual é o próximo passo, e o bloco não tem botão.

## O objetivo

Quem lê tem que pensar "é exatamente isso que sai lá em casa" e, logo depois, "quero aprender a outra frase". O gancho é o contraste: a frase de antes precisa ser reconhecível na hora, e a frase nova precisa parecer possível de dizer, não frase de consultório.

Um card por habilidade, na mesma ordem do bloco "O que você vai aprender". Os exemplos passam por apostas, bebida e situações que valem para qualquer substância, para ninguém olhar o slider e pensar "isso não é comigo".

## Estrutura do bloco

Mesmo lugar de hoje: entre "O que você vai aprender" e o bloco "Sem julgamento / Sua privacidade". Nada muda nas outras seções.

1. Título da seção: **O que você vai aprender, na prática**
2. Linha de apoio, logo abaixo do título: "A frase nova não é mais bonita nem mais educada. Ela tem mais chance de ser ouvida."
3. Slider com os 5 cards abaixo.
4. Fechamento, abaixo do slider: "Essas são frases de exemplo. As frases da sua casa começam no diagnóstico grátis: em 3 minutos, você recebe um roteiro para a primeira conversa."
5. Botão: o mesmo `ctaDoBloco` dos outros blocos, "Fazer o diagnóstico grátis (3 minutos)", só no desktop, como no resto da LP. No celular, a barra fixa do rodapé já faz esse papel.

### Anatomia de cada card

De cima para baixo, seguindo a hierarquia do briefing 00:

- **Rótulo** (14px, medium, cor secundária): o nome da habilidade, igual ao título do card correspondente em "O que você vai aprender". É o fio que liga os dois blocos.
- **Situação** (título do card, 18px, semibold): em que momento a frase acontece.
- "O que costuma sair" (apoio, 14px) e a frase de antes, em citação cinza secundária (classe atual `familia-lp-amostra-frase`).
- "O que você aprende a dizer" (apoio, 14px) e a frase nova, em citação de destaque (classe atual `familia-lp-amostra-frase-destaque`).
- "Por que é diferente" (apoio, 14px) e a explicação, em corpo 16px.

## Os 5 cards

### Card 1

- Rótulo: Conversar sem brigar
- Situação: Quando o dinheiro da casa some nas apostas
- O que costuma sair: "Você gastou tudo de novo! Vai acabar com a família!"
- O que você aprende a dizer: "Vi que a conta ficou no negativo e fiquei com medo. Topa olhar as contas comigo no domingo, com calma?"
- Por que é diferente: Fala de um fato, diz o que você sente e faz um convite possível. Sem acusação, a pessoa tem menos do que se defender e mais espaço para ouvir.

### Card 2

- Rótulo: Valorizar o que vai bem
- Situação: Quando a pessoa chega para o jantar sem ter bebido
- O que costuma sair: "Nossa, resolveu aparecer? Milagre!"
- O que você aprende a dizer: "Que bom que você jantou com a gente. Gostei muito de hoje."
- Por que é diferente: A ironia faz o momento bom terminar em bronca. Notar o que foi bom, sem pedir nada em troca, faz esse momento valer mais do que o uso.

### Card 3

- Rótulo: Devolver o que é da pessoa
- Situação: Quando a pessoa pede para você dar uma desculpa no trabalho dela
- O que costuma sair: "Tá, eu ligo e falo que você tá doente. Mas é a última vez, hein!"
- O que você aprende a dizer: "Eu não vou mais inventar desculpa pro seu trabalho. Se quiser, fico aqui do lado enquanto você liga."
- Por que é diferente: Quando você resolve tudo, quem você ama não sente o peso do que aconteceu. Dá para devolver sem bronca, sem castigo e sem sair de perto.

### Card 4

- Rótulo: Cuidar de quem cuida
- Situação: Quando te chamam para sair e dá medo de deixar a casa
- O que costuma sair: "Não vou, não. E se acontecer alguma coisa enquanto eu estiver fora?"
- O que você aprende a dizer: "Vou, sim. Fico até as 22h e deixo o celular ligado."
- Por que é diferente: Ficar de plantão o tempo todo não impede o que você teme, e vai te esgotando. Uma pausa pequena por semana é por onde dá para começar a recuperar o fôlego.

### Card 5

- Rótulo: Convidar na hora certa
- Situação: Quando você quer que a pessoa procure ajuda
- O que costuma sair: "Você precisa se tratar! Olha o seu estado!"
- O que você aprende a dizer: "Ontem eu fiquei com medo de te ver daquele jeito. Se um dia você quiser conversar com alguém, eu já tenho um contato."
- Por que é diferente: No meio do uso ou de uma briga, o convite soa como ataque. Num momento calmo, com a ajuda já pronta, a porta fica aberta, mesmo que a resposta hoje seja não.

## Comportamento do slider

- **Celular:** rolagem lateral com snap, um card por vez, com 16 a 24px do próximo card aparecendo na borda para mostrar que tem mais. É o mesmo padrão das fileiras "O que te preocupa hoje?" e "Como funciona", que já usam `ActionRow`.
- **Desktop:** setas de anterior e próximo, e indicador de posição. O Claude Design decide se mostra um card centralizado ou um card e meio, desde que nenhuma frase fique cortada.
- **Indicador:** pontos e o texto "1 de 5".
- **Sem rolagem automática e sem loop.** Card com texto longo não pode trocar antes de a pessoa terminar de ler, e o fim do slider leva ao fechamento e ao botão.
- **Mesma altura em todos os cards** (a do mais longo), para a página não pular ao trocar.
- Começa sempre no card 1. No primeiro card, a seta de anterior fica desabilitada; no último, a de próximo.
- Sem ícone de bebida, dinheiro ou aposta, pela regra que já existe na LP. Sem ilustração nos cards: o texto é o conteúdo.
- Com `prefers-reduced-motion`, a troca de card é imediata, sem animação.

## Acessibilidade

- Seção com `aria-roledescription="carrossel"` e `aria-label="Exemplos de frases"`.
- Cada card com `role="group"`, `aria-roledescription="exemplo"` e `aria-label` no formato "Exemplo 1 de 5: Conversar sem brigar".
- Setas com rótulo: "Ver o exemplo anterior" e "Ver o próximo exemplo".
- Com o foco no slider, as setas esquerda e direita do teclado trocam o card.
- Área de toque das setas com no mínimo 44px.

## O que o Claude Design devolve

- Celular (390px) e desktop (1280px), no Margem System.
- Três estados: primeiro card, card do meio e último card.
- O bloco em contexto: o fim de "O que você vai aprender", o slider e o começo de "Sem julgamento", para conferir o ritmo entre este botão e o do bloco de baixo.
- Se algum texto não couber ou não funcionar no card, a sugestão vem marcada à parte, sem mudar o texto direto no layout.

## Código (para o Claude Code, depois do design aprovado)

- Em `app/familia/page.tsx`, trocar as linhas 339 a 352 pelo slider. Os textos ficam numa constante `AMOSTRAS` no mesmo arquivo, como já acontece com `EIXOS` e `PASSOS`.
- O rótulo de cada card vem de `EIXOS[i].titulo` (mesma ordem), para os dois blocos nunca saírem de sincronia.
- O slider é um componente cliente novo, `components/familia/AmostraSlider.tsx`. O resto da LP continua estático.
- Reaproveitar `ActionRow` para o arrasto no desktop, com `origem="familia_amostra"`.
- Registrar `track("amostra_exemplo_visto", { exemplo: 1 a 5 })` quando cada card aparece, para saber até onde as pessoas vão no slider.
- Depois do fechamento, renderizar `{ctaDoBloco}`, como nos outros blocos.
- Atualizar o comentário da linha 339: o bloco agora tem botão e segue o briefing N12.

## [PENDÊNCIA DO FUNDADOR]

A frase F5 da ferramenta de reescrever frases (ferramentas, parte 1) também usa "juntos". Decidir se ela passa a ser igual à frase nova do card 1, para a LP e o programa mostrarem a mesma frase.

## Critério de aceite

- O bloco continua entre "O que você vai aprender" e "Sem julgamento".
- Título, linha de apoio, os 5 cards e o fechamento com o texto exato deste briefing.
- Cada card tem rótulo, situação, frase de antes, frase nova e "Por que é diferente", nessa ordem.
- O rótulo de cada card é igual ao título do card correspondente em "O que você vai aprender".
- Sem rolagem automática, sem loop, todos os cards com a mesma altura.
- Celular: rola de lado com snap e mostra a borda do próximo card. Desktop: setas e "1 de 5".
- Botão "Fazer o diagnóstico grátis (3 minutos)" depois do fechamento, só no desktop.
- O leitor de tela anuncia "Exemplo 1 de 5: Conversar sem brigar", e as setas têm rótulo.
- Sem ícone de bebida, dinheiro ou aposta.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
