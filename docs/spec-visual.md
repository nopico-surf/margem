# Spec visual da Margem

Fonte de verdade: Figma `Margem System`, arquivo `9YYcL4yrp6oB65cJFbLPRf`, coleção de variáveis **Estilos**.
Última sincronização: 18/09/2026, depois da normalização de taxonomia.

O Figma manda no que existe. Este arquivo é a leitura do Figma em formato consultável, mais a ponte para o CSS.
Se os dois divergirem, o Figma vence.

---

## 1. Como os tokens são nomeados

Padrão único, sem exceção: **`grupo/grupo-variante`**, tudo em minúscula, separado por hífen, em inglês.

```
spacing/spacing-16        certo
spacing/16                errado, perde o prefixo
spacing/spacing 16        errado, espaço
Spacing/Spacing-16        errado, maiúscula
espacamento/espacamento-16 errado, token é inglês
```

Grupo e prefixo do filho são sempre a mesma palavra. Isso é o que permite ler o nome fora do contexto da pasta.

Nunca aceitar nome com sufixo numerado do Figma (`token 2`, `token 3`). Isso é nome de cópia, não de token. Se aparecer, é porque alguém duplicou uma variável e não nomeou.

---

## 2. Modos

A coleção tem dois modos: **Mobile** e **Desktop**. Quase todo token tem o mesmo valor nos dois. Quem varia é a escala primitiva `numbers/*`, e por consequência tudo que é alias dela: `font-size/*` e `line-height/*`.

### Armadilha registrada

Os primitivos `numbers/*` **não valem o número do próprio nome no Desktop**. Foi por isso que eles deixaram de se chamar `numbers/16` e passaram a se chamar `numbers/scale-16`: o nome antigo mentia.

| Token | Mobile | Desktop |
|---|---|---|
| `numbers/scale-01` a `scale-15` | -4, -2, -1, -0.5, 0, 0.5, 1, 1.5, 2, 4, 6, 8, 10, 12, 14 | iguais ao Mobile |
| `numbers/scale-16` | 16 | **24** |
| `numbers/scale-17` | 18 | **20** |
| `numbers/scale-18` | 20 | **24** |
| `numbers/scale-19` | 24 | **28** |
| `numbers/scale-20` | 28 | **40** |
| `numbers/scale-21` | 32 | **56** |
| `numbers/scale-22` | 40 | **48** |
| `numbers/scale-23` | 48 | **56** |
| `numbers/scale-24` | 56 | **64** |
| `numbers/scale-25` | 64 | **72** |
| `numbers/scale-26` | 80 | **88** |
| `numbers/scale-27` | 96 | **104** |
| `numbers/scale-28` | 104 | 104 |
| `numbers/scale-29` | 128 | 128 |

Os valores não foram alterados, só o nome. Mexer nos valores muda tamanho de fonte e espaçamento em toda tela Desktop que consome os alias, então isso continua pendente de decisão.

**Nunca usar `numbers/*` direto numa tela.** Ele é primitivo. A tela usa `spacing/*`, `size/*`, `font-size/*`, `radius/*`.

---

## 3. Cores

Todas escopadas para preenchimento, texto, traço e efeito. Nenhuma cor aparece em picker de espaçamento.

### Brand primary

| Token | Hex |
|---|---|
| `colors/brand-primary/brand-primary-50` | `#eefdf5` |
| `colors/brand-primary/brand-primary-100` | `#d3f8e4` |
| `colors/brand-primary/brand-primary-200` | `#a7f0cc` |
| `colors/brand-primary/brand-primary-300` | `#7ce5b0` |
| `colors/brand-primary/brand-primary-400` | `#4dd497` |
| `colors/brand-primary/brand-primary-500` | `#1fb87c` |
| `colors/brand-primary/brand-primary-600` | `#089162` |
| `colors/brand-primary/brand-primary-700` | `#067550` |
| `colors/brand-primary/brand-primary-800` | `#055c40` |
| `colors/brand-primary/brand-primary-900` | `#03422c` |
| `colors/brand-primary/brand-primary-950` | `#012a1c` |

### Brand secondary

O grupo dizia `brand secondary` e as variáveis diziam `brand-lime`. Agora os dois dizem `brand-secondary`. Se o time chama de lime na conversa, tudo bem, mas o token é `brand-secondary`.

| Token | Hex |
|---|---|
| `colors/brand-secondary/brand-secondary-50` | `#f9ffe8` |
| `colors/brand-secondary/brand-secondary-100` | `#f1ffc9` |
| `colors/brand-secondary/brand-secondary-200` | `#e2ff97` |
| `colors/brand-secondary/brand-secondary-300` | `#cdff66` |
| `colors/brand-secondary/brand-secondary-400` | `#afff46` |
| `colors/brand-secondary/brand-secondary-500` | `#93e62e` |
| `colors/brand-secondary/brand-secondary-600` | `#74c01c` |
| `colors/brand-secondary/brand-secondary-700` | `#589712` |
| `colors/brand-secondary/brand-secondary-800` | `#40720d` |
| `colors/brand-secondary/brand-secondary-900` | `#2c4e09` |
| `colors/brand-secondary/brand-secondary-950` | `#1a3005` |

### Neutral

| Token | Hex |
|---|---|
| `colors/neutral/neutral-0` | `#ffffff` |
| `colors/neutral/neutral-50` | `#f4f6f4` |
| `colors/neutral/neutral-100` | `#e9ecea` |
| `colors/neutral/neutral-200` | `#dee3e0` |
| `colors/neutral/neutral-300` | `#d3dad6` |
| `colors/neutral/neutral-400` | `#aeb4b0` |
| `colors/neutral/neutral-500` | `#89908b` |
| `colors/neutral/neutral-600` | `#6c746f` |
| `colors/neutral/neutral-700` | `#515854` |
| `colors/neutral/neutral-800` | `#373d39` |
| `colors/neutral/neutral-900` | `#242925` |
| `colors/neutral/neutral-950` | `#171b18` |

### Status

O grupo `warming` era typo e virou `status-warning`.

| Escala | 50 | 200 | 500 | 600 | 950 |
|---|---|---|---|---|---|
| `colors/status-success/status-success-*` | `#e8f7f0` | `#a8e4c9` | `#2ea87d` | `#087f5b` | `#022a1c` |
| `colors/status-warning/status-warning-*` | `#fff7e6` | `#f9dd9c` | `#c3872f` | `#a96819` | `#382208` |
| `colors/status-error/status-error-*` | `#fff1f0` | `#ffc4bd` | `#d65c50` | `#b42318` | `#3d0e0a` |
| `colors/status-info/status-info-*` | `#eaf7f7` | `#b0e0df` | `#349396` | `#176b78` | `#08262b` |

Cada escala tem os 11 degraus completos: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.

### Alpha

Grupo antes chamado `colors/opacidade/opaca-*`, agora `colors/alpha/alpha-*`. É uma rampa de transparência sobre **`colors/neutral/neutral-950`**, que é `#171b18`, em 12 degraus: 0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88.

Cada variável é um alias para a cor base mais uma opacidade, e não um hex colado. É o jeito certo: mudar `neutral-950` reflete na rampa inteira.

**Corrigido em 18/09/2026.** O modo Desktop tinha `#012a1c` (que é `brand-primary-950`) colado à mão, com a opacidade assada dentro do valor, enquanto o Mobile já usava o alias correto. Os dois modos agora seguem `neutral-950`, o que também alinha com o código, que sempre usou `rgb(23 27 24 / N%)`.

**Uma coisa fora do padrão:** `alpha-0` não segue a rampa. Ele aponta para `colors/neutral/neutral-0` (branco) com 80% de opacidade, quando o nome sugere 0% sobre a mesma base dos outros. Não foi alterado, porque mexer no valor mexe em tela. Vale conferir para que ele serve.

---

## 4. Espaçamento e tamanho

`spacing/*` tem escopo de gap. `size/*` tem escopo de largura e altura. São escalas diferentes de propósito, não sinônimos.

| `spacing/spacing-*` | 0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128 |
|---|---|
| `size/size-*` | 0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96 |

O número no nome é o valor em px, e nessas duas escalas ele é verdade nos dois modos.

### Layout

| Token | Valor |
|---|---|
| `layout/page-padding-mobile` | 16 |
| `layout/page-padding-tablet` | 24 |
| `layout/page-padding-desktop` | 32 |
| `layout/grid-gutter-mobile` | 16 |
| `layout/grid-gutter-tablet` | 24 |
| `layout/grid-gutter-desktop` | 32 |
| `layout/content-max-width-sm` a `-3xl` | 640, 768, 1024, 1280, 1440, 1920 |
| `layout/layout-page-background` | `#ffffff` |

`layout/layout-page-background` era uma variável chamada `layout/Color`, sem função declarada, com escopo aberto em todas as propriedades. Foi renomeada e escopada para preenchimento de frame, mas **continua pendente de revisão**: pode ser lixo de rascunho e não token de verdade.

---

## 5. Raio, borda, opacidade

| `radius/*` | none 0, xs 2, sm 4, md 8, lg 12, xl 16, 2xl 24, 3xl 32, full 999 |
|---|---|
| `border/border-width-*` | none 0, hairline 0.5, thin 1, medium 2, large 3, strong 4 |
| `opacity/opacity-*` | invisible 0, hover 0.08, pressed 0.16, disabled 0.5, muted 0.64, overlay 0.64, visible 1 |

`border-width-hairline` se chamava `border-width-none 2` e valia 0.5, ou seja, um "nenhum" que não era nenhum.

`radius/radius-button` existe e **vale 0**. É token semântico no meio dos primitivos e o valor contradiz o desenho dos botões. Pendente: confirmar se deve valer `radius-full` ou se deve ser apagado.

`opacity-muted` e `opacity-overlay` têm o mesmo valor, 0.64. Pendente: são a mesma coisa com dois nomes, ou um dos dois está errado?

---

## 6. Controles

| Grupo | Valores |
|---|---|
| `control-icon/control-icon-*` | xs 12, sm 16, md 20, lg 24, xl 32, 2xl 40, 3xl 56, 4xl 72, 5xl 86 |
| `control-avatar/control-avatar-*` | xs 24, sm 32, md 40, lg 48, xl 64 |
| `control-height/control-height-*` | sm 32, md 40, lg 48, xl 56 |

`control-icon` tinha cinco variáveis chamadas `control-icon-xl` numeradas de 2 a 5. Viraram `2xl` a `5xl`.
`control-height` estava sem escopo nenhum, o que fazia com que não aparecesse em picker algum. Agora tem escopo de largura e altura.

---

## 7. Tipografia

### Famílias

| Token | Valor |
|---|---|
| `font-family/font-family-title` | urbanist |
| `font-family/font-family-text` | inter |

As duas existem no código. São carregadas em [`app/layout.tsx`](../app/layout.tsx) via `next/font/google` e expostas como `--font-inter` e `--font-urbanist`.

Urbanist é a fonte de título e aparece no h1 da home, nos títulos dos cards de caminho, nos h2 e h3 do modal de dados, nos títulos das seções do resultado e no menu lateral. Inter é o texto.

### Pesos

`font-weight/font-weight-*`: thin 100, extra-light 200, light 300, regular 400, medium 500, semi-bold 600, bold 700, extra-bold 800, black 900.

Os nomes eram capitalizados e sem prefixo (`font weight/Semi Bold`). Atenção ao escrever código para a API do Figma: o estilo da fonte Inter é `"Semi Bold"` com espaço, não `"SemiBold"`.

### Tamanhos

Alias de `numbers/*`, então variam por modo.

| Token | Mobile | Desktop |
|---|---|---|
| `font-size/font-size-3xs` | 8 | 8 |
| `font-size/font-size-2xs` | 10 | 10 |
| `font-size/font-size-xs` | 12 | 12 |
| `font-size/font-size-sm` | 14 | 14 |
| `font-size/font-size-md` | 16 | 24 |
| `font-size/font-size-lg` | 18 | 24 |
| `font-size/font-size-xl` | 20 | 28 |
| `font-size/font-size-2xl` | 24 | 40 |
| `font-size/font-size-3xl` | 32 | 48 |
| `font-size/font-size-4xl` | 48 | 64 |
| `font-size/font-size-5xl` | 56 | 72 |
| `font-size/font-size-6xl` | 64 | 88 |
| `font-size/font-size-7xl` | 80 | 104 |
| `font-size/font-size-8xl` | 96 | 104 |
| `font-size/font-size-9xl` | 104 | 128 |

`8xl` e `9xl` se chamavam `font-size-7xl 2` e `font-size-7xl 3`.

### Altura de linha

Eram 16 variáveis com nomes semânticos quebrados: havia quatro chamadas `line-height-none` valendo 8, 10, 12 e 14, e uma chamada `line-height-relaxed 7` que era a menor do grupo "relaxed". Viraram uma escala ordenada por valor, do menor para o maior:

`line-height/line-height-*`: 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, 8xl, 9xl, 10xl.

Valores Mobile, em ordem: 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96.

### Espaçamento entre letras

`letter-spacing/letter-spacing-*`: minus-4, minus-2, 0, 0-25, 0-5, 1, 2, 4.

Estavam com nove escopos, incluindo raio de canto e opacidade, o que poluía todo picker do arquivo. Agora têm só `LETTER_SPACING`.

Atenção: `letter-spacing-1` vale 1 no Mobile e **0** no Desktop. Provável engano, mas o valor não foi tocado. Pendente.

### Estilos de texto

21 estilos, em três famílias:

- `Label/`: XX-Small, X-Small, Small-regular, Small-medium, Medium-regular, Medium-medium, Medium-bold, Large-medium
- `Header/`: X-Small, Small, Medium, Large, X-Large
- `Text/`: Note, X-Small, Small-regular, Small-bold, Medium-regular, Medium-semibold, Medium-bold, Large

Esses ainda usam capitalização e barra, padrão diferente do das variáveis. Não foram renomeados: mexer em estilo de texto reescreve o estilo aplicado em cada nó que o usa, e isso é um segundo trabalho, com risco próprio. Fica pendente.

### Estilos de efeito

Três: `background blur`, `drop shadow`, `glass`.

---

## 8. Ponte do Figma para o CSS

Toda variável do Figma vira uma custom property com o mesmo nome, trocando barra por hífen:

```
colors/brand-primary/brand-primary-500   ->   --colors-brand-primary-500
spacing/spacing-16                       ->   --spacing-16
radius/radius-lg                         ->   --radius-lg
font-size/font-size-md                   ->   --font-size-md
```

Regra: **não inventar nome curto no CSS**. `--brand-500` parece mais limpo e é exatamente o que quebra a correspondência com o Figma. O nome comprido é o preço de conseguir procurar um token nos dois lados com a mesma string.

---

## 9. Divergências conhecidas entre Figma e código

Levantadas em 18/09/2026 contra o `:root` de `app/globals.css`. Nenhuma foi corrigida ainda: corrigir mexe em runtime e é trabalho separado.

| Figma | Código hoje | Situação |
|---|---|---|
| `colors/neutral/neutral-0, 50, 100, 950` | `--neutral-0, --neutral-50, --neutral-100, --neutral-950` | Valores batem. Só o nome é curto demais. |
| `colors/brand-primary/brand-primary-50, 100, 300, 800` | `--brand-50, --brand-100, --brand-300, --brand-800` | Valores batem. Falta `primary` no nome. |
| `colors/status-success/status-success-200` | `--success-200` | Valor bate. Falta `status` no nome. |
| `colors/alpha/alpha-16` | `--colors-opacidade-opaca-16: rgb(23 27 24 / 16%)` | Base bate: os dois são `neutral-950`. Só o nome do CSS é que ficou em português. |
| `colors/alpha/alpha-88` | `--neutral-950-88` | Base bate. Nome inventado no CSS. |
| `spacing/spacing-4, 8, 12, 16, 24` | `--space-4, --space-8, --space-12, --space-16, --space-24` | Valores batem. Prefixo `space` contra `spacing`. |
| `radius/radius-lg` (12), `radius-xl` (16) | `--radius-lg`, `--radius-xl` | Batem, nome e valor. |
| `border/border-width-thin` (1) | `--border-width-1` | Valor bate. Nome usa o número em vez do degrau. |
| `font-family/font-family-title` = urbanist | `--font-urbanist` | Bate. Carregada em `app/layout.tsx`. |

Fora isso: o `:root` do código tem **20 variáveis**, contra 260 no Figma, e vive minificado em uma única linha de `app/globals.css`, acompanhado de 13 arquivos CSS de override (`home-overrides.css`, `figma-result-alignment.css`, `interaction-overrides.css` e outros). Não existe fonte única de token no código.

---

## 10. Pendências desta spec

### Resolvidas em 18/09/2026

- A rampa `colors/alpha/*` agora segue `neutral-950` nos dois modos. O Desktop tinha `#012a1c` colado à mão.
- `letter-spacing-1` valia 0 no Desktop e voltou a valer 1.
- Urbanist não era pendência: a fonte sempre esteve no projeto. Foi erro de leitura na primeira varredura.

### Em aberto

**`numbers/*` mentem o valor no Desktop.** `numbers/scale-16` vale 16 no Mobile e 24 no Desktop. Só o nome foi corrigido; o valor não foi tocado, porque mexer nele muda tamanho de fonte e espaçamento em toda tela Desktop. Ver a tabela da seção 2.

**`radius/radius-button` vale 0.** Esse token existe para dizer qual é o raio do canto de um botão. Valendo 0, ele diz "botão tem canto reto", e os botões da Margem são arredondados. Então ou alguém criou e esqueceu de preencher, ou ele deveria apontar para `radius-full` (999) ou `radius-md` (8). Quem usar esse token hoje vai desenhar um botão quadrado. Precisa de uma decisão de design: qual é o raio do botão?

**`opacity-muted` e `opacity-overlay` valem os dois 0.64.** São dois nomes para o mesmo número, e servem a coisas diferentes: `muted` é texto apagado, `overlay` é o véu escuro atrás de um modal. Como o valor é igual, ninguém sabe qual usar, e no dia em que o véu precisar ficar mais escuro alguém vai mudar o token errado e apagar texto pela tela toda. Precisa de decisão: ou são a mesma coisa e um dos dois sai, ou são diferentes e um dos valores muda.

**Os 21 estilos de texto** ainda usam o padrão antigo (`Label/Small-medium`, com maiúscula e barra), diferente do das variáveis. Renomear reescreve o estilo aplicado em cada nó que o usa, então é um trabalho com risco próprio e pede plano de migração.

**Os 13 arquivos de CSS de override.** Hoje o estilo do projeto está espalhado assim:

```
app/globals.css              as ~20 variaveis de token, minificadas em uma linha
app/flow.css                 home, campo de mensagem, cards de caminho
app/home-overrides.css       correcoes em cima do flow.css
app/figma-result-page.css    a tela de resultado inteira, minificada
app/figma-result-alignment.css  correcoes em cima da anterior
app/interaction-overrides.css   correcoes em cima das anteriores
app/viewport-overrides.css
app/hero-radius.css
app/onboarding.css
app/message-input.css
app/side-menu.css
app/footer.css
app/response-loader.css
app/dados-privacidade-modal.css
```

O problema não é ter vários arquivos, é o nome deles: `-overrides` e `-alignment` são arquivos que existem para corrigir o arquivo anterior. Quando alguém muda um valor no `flow.css`, não tem como saber se o `home-overrides.css` vai sobrescrever. E as 20 variáveis do `globals.css` são um pedaço arbitrário das 260 do Figma, copiadas à mão, sem nenhum processo que garanta que continuam iguais.

Consolidar quer dizer: uma fonte única de token gerada a partir do Figma, e os arquivos de tela organizados por tela, sem camada de correção em cima de correção.
