# Componentes da Margem

Levantado em 18/09/2026, varrendo os quatro arquivos do Figma e o código.
O Figma é a fonte de verdade sobre o que existe. O código é a fonte de verdade sobre o que está implementado.

---

## 1. Onde fica cada coisa

| Arquivo | File key | O que tem |
|---|---|---|
| **Margem System** | `9YYcL4yrp6oB65cJFbLPRf` | O design system. 260 variáveis, 21 estilos de texto, 3 de efeito, 30 páginas de componente. |
| **Experiência do produto** | `h1TYaQfUXC8FdbWkY6tkLd` | Telas montadas e os componentes da home. |
| **Ícones** | `PPrJDgaNCTx52XSQSVcopK` | Biblioteca Material Symbols inteira, 2.669 componentes. Não é da Margem. |
| **Emojis** | `biLPoOkfG2vQJTP4DqdaX9` | 8 emojis usados no produto. |

---

## 2. Como nomear

### Componente

Português, minúsculo, com hífen, **sem acento**. Sem acento porque o nome precisa virar arquivo e classe no código sem tradução.

```
card-profissional        certo
Card profissional        errado
card_profissional        errado
cards-instituições       errado, acento
Component 1              errado, é nome de cópia
Frame 143                errado, é nome de cópia
Além disso você pode ver errado, é copy da tela, não nome de componente
```

Primitivo genérico de UI continua em inglês, porque é vocabulário de interface e não de domínio da Margem: `button`, `badge`, `alert`, `divider`, `checkbox`, `input-text`, `text-area`, `avatar`, `header`, `loader`, `filter`, `logo`, `scroll-bar`.

Componente que carrega domínio da Margem vai em português: `card-profissional`, `cards-servicos-publicos`, `passos-reais`, `proximos-passos`, `menu-contatos`, `feedback-utilidade-pergunta`.

O prefixo `_` marca componente base, que existe para ser composto e não para ser usado direto na tela.

### Propriedade e variante

Propriedade em minúscula, uma palavra quando der. Valor em minúscula, com hífen.

```
state=default            certo
size=x-small             certo
Property 1=Default       errado, Property 1 é o nome que o Figma dá quando ninguém nomeou
state=Variant2           errado, é valor auto-gerado
State=Default            errado, maiúscula
```

Nomes de propriedade em uso hoje: `state`, `size`, `color`, `style`, `shape`, `mode`, `variant`, `function`, `padding`, `alignment`, `radius-full`, `interaction`, `servico`, `instituicao`.

Valores de estado padronizados: `default`, `hover`, `pressed`, `focus`, `disabled`, `loading`, `error`, `filled`, `selected`, `checked`, `sticky`, `complete`.

### Ícone

**Nunca inventar nome de ícone.** O nome vem do arquivo Ícones, que é a biblioteca Material Symbols e usa `snake_case` em inglês: `account_circle`, `arrow_circle_down`, `question_answer`.

Essa biblioteca não é nossa e **não deve ser renomeada**. Renomear quebra a possibilidade de reimportar ou atualizar a partir do Material.

O erro que o código cometeu foi nomear ícone por **onde ele aparece** em vez de **o que ele é**. Foi isso que gerou arquivo duplicado. Ver a seção 6.

---

## 3. Margem System, página por página

30 páginas de conteúdo, fora `Cover`, `Tokens` e `Playground`.

| Página | Componentes | Propriedades |
|---|---|---|
| Template de resultados | `template-resultados` | |
| Contatos | `menu-contatos`, `contato-email` | `size` = small, medium |
| Alert | `alert` | `interaction` = none, with; mais 10 propriedades de conteúdo |
| Logo | `logo` | `color` = white, green, neutral, neon |
| Input text | `input-text` | `state` = default, error, filled, focus, hover, success, texting; `size` = small, medium |
| Badge | `badge` | `color` = secondary, primary, neutral |
| Button core | `button` | `function`, `size`, `state`, `variant`, `mode`, `radius-full`, `padding`. **246 variantes** |
| Button select | `button-select` | `state` = selected, default |
| Specific buttons | 12 botões prontos: `button-telefone`, `button-whatsapp`, `button-grupos-online`, `button-grupos-presenciais`, `button-site`, `button-saiba-mais`, `button-email`, `button-perto-de-mim`, `button-telegram`, `button-libras`, `button-ligar-agora`, `button-chat` | |
| Title + Subtitle | `card-header` | `size`, `padding`, `alignment` |
| Cards de resultados | `card-base`, `card-servico-publico`, `card-cvv`, `card-cvv-danger`, `card-caps-ad`, `card-cras`, `card-direitos-humanos`, `card-orientacao-sobre-drogas`, `card-sus`, `card-ubs`, `_card-samu`, `_card-policia-militar`, `_card-policia-civil`, `_card-alcoolicos-anonimos`, `_card-narcoticos-anonimos`, `_cards-individuais-instituicoes`, `cards-instituicoes-completo`, `_cards-instituicoes-completo`, `cards-servicos-publicos`, `_cards-servicos-publicos`, `_loading-cards-resultados` | `state` = default, loading; `servico`; `instituicao` |
| Card profissional | `card-profissionais`, `_card-profissional`, `_card-profissionais`, `_card-profissional-state3` | `state` = default, loading |
| Card background | `card-background`, `card-bg`, `_conteudo-aqui` | `style`, `padding`, `radius-full` |
| Checklist | `passos-reais`, `proximos-passos`, `_passos-reais`, `_proximos-passos` | `state` = default, loading |
| Avatar | `avatar` | `type` = photo, fallback. `photo` é a foto real da pessoa; `fallback` é o ícone de pessoa, usado quando não há foto cadastrada |
| Button group | `button-group` | `state` = default, danger; mais 12 booleanos de ação |
| Icon button | `icon-button`, `icon-button-group`, `icon-container`, `group-icon-telefone`, `group-icon-whatsapp`, `group-icon-grupos-presenciais` | |
| Checkbox | `checkbox`, `checkbox-group`, `checkbox-default` | `state` = default, checked, selected; `padding` |
| Divider | `divider` | `style` = opaque, solid |
| Loader | `loader`, `skeleton-bone`, `screen-loading`, `loader-content` | `size` = x-small, small, medium, large, giant; `shape` = line, block, circle |
| Filter | `filter` | `state`, `mode` = dark, light |
| Header | `header` | `state` = default, sticky |
| Message | `message` | `state` = default, focused, filled |
| Text message | `messages`, `bloco-mais-opcoes`, `mensagem-texto`, `texto-resposta` | `state` = loading, complete, error |
| Informações úteis | `feedback-utilidade-pergunta`, `feedback-utilidade-agradecimento`, `feedback-utilidade-comentario` | |
| Text area | `text-area` | `state` = default, hover, focus, texting, filled |
| Scroll bar | `scroll-bar` | |
| Menu | vazia | |

### Experiência do produto, página Componentes

Seções: Profissionais, Checklist, Cards de resultados, Cards home, Header home.

`Cards home` são os cards da tela `/inicio`. A seção se chamava `Cards pro dor`.

Componentes: `card-home`, `card-home-group`, `header-home`, `_card-profissionais-completo`, `_passos-reais`, `_proximos-passos`, `_cards-servicos-publicos`, `_cards-instituicoes-completo`, `cards-instituicoes-completo`.

### Emojis

`pensando-chat-mensagem`, `emergencia-sirene`, `cerebro-emocional`, `aperto-de-mao`, `broto-crescimento-renascendo`, `poker-face`, `ampulheta-tempo`, `coracao-enfaixado`.

---

## 4. Código, o que existe hoje

57 componentes em 6 pastas.

| Pasta | Componentes |
|---|---|
| `components/app` | CardHome, CardHomeGroup, CardHomeHeader, HomeHero, IdentityBadge, KeyboardDiagnostics, MessageInput |
| `components/bem-vindo` | EmergencyPanel |
| `components/conversa` | ActionRow, CardBackground, CardHeader, CardProfissionais, CardProfissionaisCompleto, CardRecurso, CardsInstituicoes, CardsServicosPublicos, CheckBoxGroup, ChecklistSection, FiltroEspecialidade, MoreOptions, ResourceActions, ResponseCopy, ResponseError, ResponseLoading, ResultMessages, ResultPage, UserMessage |
| `components/intro` | IntroBubble, IntroCopy, IntroHeader, IntroShell |
| `components/layout` | Footer, Header, MenuContatos, SideMenu |
| `components/protecao-de-dados` | ConsentCard, DadosPrivacidadeModal, LinkPoliticaDados, ModalFooter, ModalHeader, ModalSection |
| `components/ui` | **Button** (o botão), e os que hoje são só um atalho para ele: ActionButton, BotaoAgendar, BotaoContinuar, BotaoFecharMenu, BotaoMenu, BotaoServicosPublicos, BotaoTopicos, Checkbox, ContatoLink, SectionJump |
| raiz | GoogleTagManager, MixpanelPageView |

Convenção do código: `PascalCase.tsx`, mistura de português e inglês sem critério (`CardProfissionais` ao lado de `ResponseLoading`, `BotaoMenu` ao lado de `ActionButton`).

---

## 5. Ponte Figma para código

| Figma | Código | Situação |
|---|---|---|
| `card-header` | `conversa/CardHeader` | Corresponde |
| `container-conteudo` (era `card-bg`), `card-background` | `conversa/ContainerConteudo` | Dois sets no Figma, um componente no código. Nome alinhado em 18/09/2026 |
| `card-profissionais`, `_card-profissional` | `conversa/CardProfissionais`, `CardProfissionaisCompleto` | Quatro nomes no Figma, dois no código, nenhum par óbvio |
| `cards-instituicoes-completo` | `conversa/CardsInstituicoes` | Corresponde |
| `cards-servicos-publicos` | `conversa/CardsServicosPublicos` | Corresponde |
| `checkbox` | `ui/Checkbox` | Corresponde |
| `avatar` | `ui/Avatar` | Corresponde desde 18/09/2026. Morava dentro de `icons/index.tsx`, que é arquivo de glifo, e saiu de lá: tem estado de erro, então é componente |
| `checkbox-group` | `conversa/CheckBoxGroup` | Corresponde. O código escreve `CheckBox`, o Figma escreve `checkbox` |
| `passos-reais`, `proximos-passos` | `conversa/SecaoPassos` | Dois no Figma, um no código, por decisão: o desenho é o mesmo e só o conteúdo muda. Qual dos dois é vem da prop `passo`, não mais de comparar o título com uma string |
| `filter` | `conversa/FiltroEspecialidade` | Nome não corresponde |
| `bloco-mais-opcoes` | `conversa/BlocoMaisOpcoes` | Corresponde desde 18/09/2026 |
| `messages` | `conversa/Messages` | Corresponde desde 18/09/2026 |
| `loader`, `skeleton-bone`, `screen-loading`, `loader-content` | `conversa/ResponseLoading`, mais os `span.figma-skeleton` soltos em 5 componentes | Quatro no Figma, e no código um componente mais um punhado de spans sem dono. Não são a mesma coisa: o `loader` das três estrelas é só a espera do primeiro texto do Gemini, e os `skeleton-bone` desenham os outros blocos da mesma página. **Pendente**, ver a seção 9 |
| `header` | `layout/Header` | Corresponde. Eram dois no código até 18/09/2026, ver abaixo |
| `menu-contatos` | `layout/MenuContatos` | Corresponde |
| `card-home`, `card-home-group`, `header-home` | `app/CardHome`, `CardHomeGroup`, `CardHomeHeader` | Corresponde |
| `input-text`, `text-area` | `app/MessageInput` | Dois no Figma, um no código |

### O header: o que acontece quando um componente vira dois

Serve de exemplo do custo de duplicar. O Figma tem um `header`. O código tinha `HeaderHome` e `HeaderResultado`, com classes de CSS separadas. Resultado: a distância entre o hambúrguer e a borda direita da tela era **10px na home e 16px na conversa**, e ninguém tinha mexido nisso de propósito.

A causa: `.menu-button`, usada só na home, nunca zerou o `padding` que o navegador dá a todo `<button>`. Como o ícone tem os mesmos 24px do botão, ele vazava 6px para fora. O header da home ficava torto, 16 de um lado e 10 do outro, e ao trocar de tela tudo deslizava.

Viraram um `Header` só, com `padding: 12px 12px 12px 16px`, ou seja 16 na esquerda e 12 na direita, e o `padding: 0` que faltava no botão. O que varia entre as telas é o fundo, que na home vem de `.app-shell > .app-header` porque lá o header fica sobre o hero, e o logo, que na tela de resultado é link para o início.

O menu lateral, que era do `HeaderResultado`, passou para a página, igual já era na `/inicio`.

O ícone do hambúrguer também tinha duas cores para o mesmo desenho, `#012A1C` na home e `#171B18` na conversa. Ficou `#171B18` nas duas, e o `BotaoMenu` perdeu a prop `variante`, que existia só para isso. `IconeMenuResultado` deixou de existir.

### Botões, reconciliados em 18/09/2026

O Figma tem um `button` com 246 variantes. O código tinha sete componentes, cada um com o estilo escrito num CSS diferente, e nenhum com hover, foco, pressionado ou carregando.

**Não foram implementadas as 246 variantes.** Varrendo os dois arquivos do Figma, só **8 combinações** aparecem em tela, e todas são `mode=light` e `padding=true`. O `components/ui/Button.tsx` tem só os eixos que aparecem:

| eixo | valores em uso |
|---|---|
| `variante` | primary, secondary, transparent |
| `tamanho` | x-small (6/10, 12px), small (10/12, 14px), medium (14/16, 16px) |
| `redondo` | canto 999 ou 12 |
| `larguraTotal` | ocupa a linha inteira |

`function=danger` e `mode=dark` existem no Figma e não aparecem em tela nenhuma, então não existem no código. Quando aparecerem, acrescenta.

**Os estados vieram do Figma**, e confirmam que entre eles muda só cor, com o foco acrescentando um stroke:

| estado | primary | secondary | transparent |
|---|---|---|---|
| default | brand-800 / branco | alpha-8 / brand-800 | sem fundo / brand-800 |
| hover | brand-900 / branco | alpha-16 / brand-800 | alpha-8 / brand-900 |
| pressed | neutral-950 / branco | alpha-24 / brand-800 | alpha-16 / brand-950 |
| focus | neutral-950 / branco | alpha-8 / brand-800 | sem fundo / brand-800 |
| disabled | alpha-8 / alpha-24 | alpha-8 / alpha-24 | alpha-8 / alpha-24 |
| loading | alpha-8, conteúdo oculto | idem | idem |

O foco ganha 2px de `brand-secondary-400` **por fora**. `outline` não ocupa espaço em CSS, ao contrário de `border`, então não empurra nada. O único lugar onde isso importava era a fileira de ações, que rola na horizontal com `overflow-y: hidden` e cortaria o stroke: ela ganhou 2px de padding vertical e a mesma margem negativa, que se cancelam.

**Uma mudança visual, deliberada.** O desabilitado do botão de onboarding era `neutral-50 / alpha-32` e o do agendar era `alpha-8 / alpha-24`: dois tratamentos para a mesma coisa. Ficou o do Figma, `alpha-8 / alpha-24`, nos dois.

Fora isso, medido antes e depois em cada tela: padding, raio, cor, fonte e tamanho idênticos. A única diferença é o botão de tópicos, 1px mais baixo, porque ele não tinha `line-height` declarado e agora usa o da escala.

Sumiram do CSS as classes `.figma-result-action`, `.figma-result-jump`, `.figma-public-link`, `.figma-schedule-button`, `.intro-button` e as regras de `.figma-filter-row button`.

**Toque no mobile.** O Chrome do Android pinta um retângulo azul por cima do elemento tocado, o `-webkit-tap-highlight-color`. Ele existe para cobrir a falta de hover no touch; com o `:active` vindo do Figma, virou redundante e ainda ignorava o raio do canto. Foi desligado no `.btn`.

Junto veio o irmão do mesmo problema: no touch o `:hover` gruda no elemento depois do toque, porque o dedo não tem como sair de cima. As três regras de hover ficaram dentro de `@media (hover: hover)`, então no touch o botão vai direto do default para o pressionado. Conferido no emulador Android: `(hover: hover)` retorna false lá e true no desktop.

Onde ainda não existe estado, como o `BotaoMenu` e os cards da home, o realce continua, porque ali ele é a única resposta ao toque. Mas deixou de ser o azul do navegador: passou a usar `--colors-alpha-56`, aplicado em `button`, `a`, `label`, `summary` e `[role="button"]` no `globals.css`. O `.btn` sobrepõe com transparente, porque tem os estados dele.

**Fora do Button:** `BotaoMenu` e `BotaoFecharMenu`, que são só ícone e no Figma são o componente `icon-button`, outro componente.

### Existe no Figma e não no código

`alert`, `badge`, `divider`, `logo`, `scroll-bar`, `icon-button`, `icon-button-group`, `button-group`, `button-select`, `contato-email`, `message`, `template-resultados`, `card-base`, `card-cvv-danger`, `_card-samu`, `_card-policia-militar`, `_card-policia-civil`, `feedback-utilidade-pergunta`, `feedback-utilidade-agradecimento`, `feedback-utilidade-comentario`, e os 12 botões de `Specific buttons`.

### Existe no código e não no Figma

`IdentityBadge`, `KeyboardDiagnostics`, `HomeHero`, `EmergencyPanel`, `IntroBubble`, `IntroCopy`, `IntroHeader`, `IntroShell`, `Footer`, `SideMenu`, `ConsentCard`, `DadosPrivacidadeModal`, `LinkPoliticaDados`, `ModalFooter`, `ModalHeader`, `ModalSection`, `ActionRow`, `CardRecurso`, `ResourceActions`, `ResponseCopy`, `ResponseError`, `ResultPage`, `UserMessage`, `SectionJump`, `ContatoLink`.

Todo o fluxo de onboarding e de proteção de dados existe só no código.

---

## 6. Ícones

### Regra

O nome do ícone vem do Figma, e o Figma usa o nome do Material Symbols. **Não criar nome novo.** Quando precisar de um ícone, procurar o glifo no arquivo Ícones e usar o nome dele.

O arquivo salvo em `/public/icons` deve se chamar como **o ícone é**, nunca como **onde ele aparece**.

```
whatsapp.svg             certo
whatsapp-menu.svg        errado, nomeia pelo lugar
whatsapp-rodape.svg      errado, mesmo desenho, segundo arquivo
whatsapp-card-profissional.svg  errado, mesmo desenho, terceiro arquivo
```

Tamanho é propriedade de uso, não identidade: um mesmo SVG serve a 16 e a 20 px.

Cada SVG exportado carrega o nome do glifo de origem embutido, no atributo `id` do primeiro grupo. Foi assim que o mapa abaixo foi levantado. Atenção: esse nome embutido é um retrato do momento da exportação, não a verdade atual. `caminho-1.svg` ainda trazia `broto_crescimento_resnacendo`, com o typo corrigido no Figma em 18/09/2026.

### Mapa de glifo

17 dos 18 nomes embutidos foram conferidos e existem mesmo no arquivo Ícones.

| Glifo no Figma | Categoria | Arquivos nossos |
|---|---|---|
| `email` | Communication | `acao-email`, `email-menu`, `email-rodape` |
| `zap` | Social | `acao-whatsapp`, `whatsapp-menu`, `whatsapp-rodape` |
| `double_arrow_down` | Navigation | `seta`, `seta-resultado` |
| `instagram` | Social | `instagram-menu`, `instagram-rodape` |
| `menu` | Navigation | `menu`, `menu-resultado` |
| `close` | Navigation | `fechar-menu`, `fechar-modal` |
| `check_box` | Toggle | `checkbox`, `checkbox-selecionado` |
| `info` | Action | `info` |
| `question_answer` | Action | `acao-chat` |
| `pan_tool` | Action | `acao-libras` |
| `link` | Content | `acao-link` |
| `place` | Maps | `acao-local` |
| `phone` | Communication | `acao-telefone` |
| `message_flye` | AV | `acao-telegram` |
| `security` | Hardware | `seguranca` |
| `arrow_forward_ios` | Navigation | `seta-card` |
| **`what_sapp`, que não existe no Figma** | | `agendar-whatsapp` |

`zap` é o WhatsApp. O glifo `what_sapp` de `agendar-whatsapp.svg` é o mesmo desenho do `zap`, mudando só a cor: `zap` é `#055C40` e `what_sapp` é branco, para uso sobre fundo escuro. Não é ícone diferente, é cor que deveria estar no CSS.

### Os emojis da home

Os seis ícones dos cards da `/inicio` são emojis do arquivo Emojis, e agora levam o nome do componente de lá:

| Antes | Agora | Card |
|---|---|---|
| `caminho-1.svg` | `broto-crescimento-renascendo.svg` | Quero mudar o uso |
| `caminho-2.svg` | `emergencia-sirene.svg` | Estou fisicamente mal |
| `caminho-3.svg` | `cerebro-emocional.svg` | Estou emocionalmente mal |
| `caminho-4.svg` | `aperto-de-mao.svg` | Quero ajudar alguém próximo |
| `caminho-5.svg` | `coracao-enfaixado.svg` | Fiz uso e quero ajuda |
| `caminho-6.svg` | `poker-face.svg` | Estou com vontade de usar |

Dos 8 emojis do Figma, `pensando-chat-mensagem` e `ampulheta-tempo` não estão em uso.

### O que já foi feito

De 41 arquivos para 33.

Apagados por não ter uso nenhum no código: `loader-1.svg`, `loader-2.svg`, `loader-3.svg`, `whatsapp-card-profissional.svg`, `info-card-profissional.svg`, `seta-opcoes-adicionais.svg`. Os `loader-*` eram três cópias idênticas, e o loader da tela é SVG inline em `components/icons/index.tsx`, não `<img>`.

Apagados por serem cópia byte a byte: `logo-margem-modal.svg` e `logo-margem-resultado.svg`. `LogoMargem`, `LogoMargemResultado` e `LogoMargemModal` agora apontam para o mesmo arquivo.

### A unificação, feita em 18/09/2026

Os arquivos duplicados eram literalmente o mesmo desenho. `acao-email` e `email-rodape` têm path idêntico e diferem só em `fill`. `email-menu` é o mesmo desenho reescrito na escala 20/16: `14.6667` vira `18.3333`, `8` vira `10`. O mesmo padrão em WhatsApp, Instagram, menu, close, seta e checkbox.

Os 17 arquivos viraram **7 componentes** em `components/icons/glifos.tsx`, com cor, opacidade e tamanho como parâmetro. `/public/icons` foi de 33 para 16 arquivos.

**Por que inline e não `currentColor` num arquivo.** SVG carregado em `<img src>` é documento isolado: CSS da página não entra, então `currentColor` não funciona. Para a cor virar parâmetro, o SVG tem que estar no HTML.

**A armadilha que isso abriu.** Trocar `<img>` por `<svg>` derruba toda regra de CSS escrita como `.alguma-coisa img`. Eram 13 regras em 7 arquivos, e a mais séria era `.side-menu-close img { filter: brightness(0) invert(1) }`, o truque que deixava o X do menu branco. Sem ela, o X voltou a preto. Todas as regras foram estendidas para cobrir `svg`, e o branco do X agora vem de `var(--neutral-0)` via prop, sem filtro.

Ao mexer em ícone, conferir se existe regra de CSS mirando `img` naquele componente.

### O WhatsApp

O componente se chamava `zap` no arquivo Ícones, o que não dizia a ninguém que aquilo era o WhatsApp. Foi renomeado no Figma para `whatsapp`, categoria Social. Código e Figma batem, sem exceção.

### Estado final

`/public/icons` tem **7 arquivos**, contra 41 no começo:

- `logo-margem.svg`, que é marca e não ícone
- os 6 emojis dos cards da home, que são ilustração colorida e não dá para recolorir

**Todo o resto é glifo inline**: 16 componentes em `components/icons/glifos.tsx`, com o nome do componente do Figma em PascalCase, e cor, opacidade e tamanho como parâmetro.

`components/icons/index.tsx` é a ponte: `glifos.tsx` tem o desenho sem cor, e cada export do index diz onde o ícone aparece e com que cor e tamanho.

`ICONES_ACAO` passou a mapear componente em vez de URL, mantendo as chaves, que vêm do banco. `URLS_DE_ICONE`, usada no preload da tela de resultado, ficou com dois itens: o logo e o avatar padrão. Glifo inline já vem no HTML e não tem o que pré-carregar.

---

## 7. O que foi corrigido em 18/09/2026

- 178 variáveis renomeadas, escopos ajustados.
- 11 páginas do design system renomeadas.
- 63 componentes renomeados.
- 40 component sets tiveram propriedade e variante padronizadas.
- 19 variantes de `card-background` com o typo `relaxad` e a propriedade `full radius` corrigidas.
- 4 emojis renomeados, incluindo dois typos.
- 6 componentes do arquivo Experiência do produto renomeados.
- `avatar` passou de `state` = default, avatar para `type` = photo, fallback.
- Seção `Cards pro dor` virou `Cards home`.
- `_card-profissional-state3` e `checkbox-default`, as duas variantes soltas fora do set, foram apagadas.
- `card-bg` virou `container-conteudo`, porque ele não é fundo de card: é o container que envolve cards e textos, e é ele que carrega o slot.
- No código, 8 SVGs apagados e 6 renomeados pelo nome do emoji no Figma. Type-check limpo, home conferida no browser, sem erro no console.

---

## 8. Componentes que parecem rascunho e não são

Registrado para ninguém apagar por engano:

- **`_conteudo-aqui`** é o slot. Ele existe para que um card possa ter o miolo variável. É o valor padrão do `INSTANCE_SWAP` do container.
- **`mensagem-texto`** aparece dentro da `/inicio`. O conteúdo em `asdsaasd` é só texto de preenchimento, o componente é real.
- **`texto-resposta`** é o componente que simula a mensagem de texto e seus estados: erro, loading e default. Os 1596 px de altura são do estado mais longo.

---

### Card profissional, o mapeamento pedido

Levantado sem mexer no código. O Figma tem quatro nomes, o código tem dois, e o par não é óbvio
porque o código pegou emprestado o nome errado.

| Figma | Onde | O que é | Código |
|---|---|---|---|
| `card-profissionais` | Margem System, página Card profissional | A seção inteira: título, filtro, lista de cards e o link para os serviços públicos | `conversa/CardProfissionais` |
| `_card-profissional` | Margem System, mesma página | O card de uma pessoa só. O `_` marca base, feito para ser composto | `conversa/CardProfissionaisCompleto` |
| `_card-profissionais` | Margem System, mesma página | Base da seção | sem par |
| `_card-profissionais-completo` | Experiência do produto, página Componentes | A seção montada | sem par |

**De onde veio a confusão.** O único "completo" do Figma é `_card-profissionais-completo`, que é a
**seção**. O código chamou de `CardProfissionaisCompleto` o **card de uma pessoa**, que no Figma é
`_card-profissional`, no singular e sem "completo". Os dois componentes do código estão, portanto,
com os nomes trocados de nível: um é a seção chamada pelo nome da seção, o outro é o card chamado
pelo nome da seção.

**Mais uma diferença.** No Figma o `state` = default, loading vive nos dois. No código só a seção
tem `isLoading`: o esqueleto do card é escrito solto dentro de `CardProfissionais`, e
`CardProfissionaisCompleto` não tem estado de carregando nenhum.

Nada disso foi mexido nesta sessão, como combinado.

---

## 9. Pendências

Em 18/09/2026, o trabalho de ícone, taxonomia e reconciliação de botão está fechado. O que sobra aqui é o resto do mapeamento Figma/código.

- [ ] **O que existe no Figma e não no código, e vice-versa.** Ver as duas listas no fim da seção 5. Todo o onboarding e toda a proteção de dados existem só no código, sem componente desenhado (estado em 18/09/2026).
- [ ] **`icon-button`.** `BotaoMenu` e `BotaoFecharMenu` continuam dois componentes com CSS próprio.
  A unificação ficou parada porque o `icon-button` do Figma é componente solto, não component set:
  não tem eixo de variante para dar nome aos dois visuais, e inventar um seria nomear pelo lugar.
- [ ] **Loader e skeleton.** Quatro nomes no Figma para o que no código é `ResponseLoading` mais
  spans `.figma-skeleton` soltos em `CardProfissionais`, `SecaoPassos`, `BlocoMaisOpcoes`,
  `CardsInstituicoes` e `CardsServicosPublicos`. Cada componente tem o esqueleto dele, então não é
  um componente só: é um mapeamento a fazer com o Figma aberto, componente por componente.
- [ ] **`onError` do avatar não pega antes da hidratação.** Se a foto cadastrada falha enquanto o
  React ainda não assumiu a página, o handler não está no elemento e o navegador mostra o ícone de
  imagem quebrada em vez do fallback. Comportamento antigo, preservado nesta sessão.
- [ ] **`/public/assets/professional-avatar.png` não é referenciado por nenhuma tela.** Só a galeria
  `/ui` usa, para mostrar a variante `photo`.
- [ ] `filter`: set mal modelado, 4 valores de `state` cruzados com 2 de `mode` em só 4 variantes. **Ignorado: o componente não está em uso.**

**O avatar foi de 92px para `--size-96`.** Era o único valor fora da escala, que vai de 80 para 96
sem parar em 92, e estava cru em três declarações de `resultado.css`. Mudança visual de 4px,
deliberada: o card do profissional ficou 4px mais alto. O esqueleto (`.figma-skeleton-avatar`) foi
junto, senão a tela saltaria ao terminar de carregar. O Figma será ajustado para 96 também.

Resolvidos em 18/09/2026: cores do `badge` confirmadas; `card-bg` renomeado para `container-conteudo`; variantes do `avatar` nomeadas `photo` e `fallback`; seção `Cards pro dor` virou `Cards home`; `zap` virou `whatsapp`; unificação dos SVGs concluída, de 41 arquivos para 7; os 7 componentes de botão do código reconciliados com o set `button` do Figma, sem alterar o visual (ver seção 5).
