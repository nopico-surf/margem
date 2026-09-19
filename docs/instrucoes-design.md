# Instruções de design da Margem

Este é o ponto de entrada para criar tela nova, do design ao código.
Se você é uma IA e vai desenhar ou implementar qualquer coisa na Margem, lê este arquivo inteiro antes.

Ele não repete o que já está escrito em outro lugar. Ele diz a ordem, as regras que não se negociam e onde está cada coisa.

---

## Os quatro documentos

| Arquivo | Para quê |
|---|---|
| **este arquivo** | ordem de trabalho e regras que não se negociam |
| [`tom-de-voz.md`](tom-de-voz.md) | todo texto que aparece na tela. Botão, erro, estado vazio, título, rótulo de campo |
| [`spec-visual.md`](spec-visual.md) | tokens: cor, espaço, raio, tipografia, e a ponte para o CSS |
| [`componentes.md`](componentes.md) | o que já existe no Figma e no código, e como um mapeia no outro |

Mais o [`CLAUDE.md`](../CLAUDE.md) na raiz, que manda em arquitetura, fluxo e escopo. As regras invioláveis da seção 7 dele valem aqui também, sem exceção.

---

## A ordem de trabalho

Não pular etapa. A maior parte do retrabalho neste projeto veio de pular a 1.

### 1. Varrer o Figma antes de escrever qualquer coisa

O Figma é a fonte de verdade sobre o que existe. O código não é: ele foi escrito sem esse cuidado e tem componente duplicado, nome que não corresponde e coisa que nunca foi desenhada.

Arquivos:

| Arquivo | File key |
|---|---|
| Margem System | `9YYcL4yrp6oB65cJFbLPRf` |
| Experiência do produto | `h1TYaQfUXC8FdbWkY6tkLd` |
| Ícones | `PPrJDgaNCTx52XSQSVcopK` |
| Emojis | `biLPoOkfG2vQJTP4DqdaX9` |

Procurar, nesta ordem:

1. **O componente já existe?** Com esse nome ou com outro. Olhar `componentes.md` primeiro, que já tem o índice, e confirmar no Figma.
2. **Dá para compor com o que já existe** em vez de criar do zero?
3. **Como o Figma aninha?** O que fica dentro do quê. O componente em React replica a árvore do Figma, não o contrário.
4. **O ícone já aparece em outra tela?** Se já, reaproveitar o mesmo asset e o mesmo componente em `/components/icons`.

### 2. Mostrar o plano, em até 10 linhas, e esperar o ok

O plano precisa dizer o que a varredura achou: quais componentes do Figma serão reaproveitados, quais serão criados e por que não havia equivalente. Sem isso o plano está incompleto.

### 3. Reaproveitar antes de criar

Antes de escrever markup, estilo, comportamento ou componente novo, procurar equivalentes já existentes no Figma e no código. Reutilizar ou compor os equivalentes sempre que atenderem ao caso, preservando seus tokens, estados, propriedades e regras de posicionamento. Só criar algo novo quando não houver equivalente ou quando a referência definir uma diferença estrutural real. Não duplicar componentes, estilos, ícones, tokens ou comportamentos sem justificar a necessidade.

Sempre pedir autorização antes de criar um componente novo no código. A solicitação deve explicar quais equivalentes foram procurados, por que não podem ser reutilizados e qual será o escopo do novo componente. Sem autorização, reutilizar ou compor os componentes existentes e não criar outro.

Todo componente novo aparece em `/ui` com todos os estados antes de ser usado numa tela.

Elementos que pertencem ao fluxo normal da página devem permanecer no fluxo normal. Não usar `fixed`, `sticky` ou sobreposição ao conteúdo sem uma definição explícita no Figma.

### 4. Só então a tela

---

## Regras que não se negociam

### Sobre texto

Tudo em [`tom-de-voz.md`](tom-de-voz.md). O mínimo:

- **Zero travessão.** Nenhum, em nenhum texto de interface.
- **Botão e link no infinitivo, verbo mais complemento.** "Encontrar apoio", nunca "Saiba mais", nunca "Clique aqui", nunca "Confirmar" sozinho.
- **Copy conversacional não tem título de seção.** Prosa corrida, uma pessoa falando com outra.
- **Pessoa antes da situação.** "Pessoas que fazem uso", nunca "usuários de drogas", nunca "viciado" ou "dependente" como rótulo.
- **Nada que culpe, nada que prometa** o que não dá para garantir.
- **Nunca dizer que o sistema está consultando** banco, documento ou IA. Sem "estou buscando", sem "de acordo com nossa base".
- **Estado de carregamento descreve a ação**: "Buscando serviços", não "Aguarde".
- **Erro explica e indica o próximo passo**, sem culpar quem está lendo.

### Sobre texto que você não recebeu

Se a referência não traz o texto de um estado, **pergunta**. Não inventa microcopy plausível. "Não vejo o texto do estado de erro na referência, qual é?" é a resposta certa.

Isso vale inclusive quando a referência é o Figma: se um componente não define um estado, esse estado fica pendente de definição, não é motivo para criar um do zero.

### Sobre token

- **Nunca escrever valor cru numa tela.** Sem `#055c40`, sem `16px`, sem `border-radius: 12px`. Sempre o token.
- **Nunca usar `numbers/*` direto.** É primitivo. A tela usa `spacing/*`, `size/*`, `font-size/*`, `radius/*`.
- **O nome do CSS é o nome do Figma**, trocando barra por hífen. `colors/brand-primary/brand-primary-500` vira `--colors-brand-primary-500`. Não encurtar para `--brand-500`: é exatamente isso que quebra a correspondência entre os dois lados.
- Se o token que você precisa não existe, **para e pergunta**. Não cria variável nova no CSS por conta própria, e não cria no Figma sem combinar.

### Sobre nome

Esta é a regra que existe para o trabalho de 18/09/2026 não ser desfeito na próxima sessão.

- **Token:** inglês, `grupo/grupo-variante`, minúsculo com hífen.
- **Componente de domínio:** português, minúsculo com hífen, sem acento.
- **Primitivo genérico de UI:** inglês (`button`, `badge`, `alert`, `divider`, `checkbox`, `input-text`, `avatar`, `header`, `loader`).
- **Propriedade e variante:** minúsculo com hífen. `state=default`, `size=x-small`.
- **Ícone:** o nome vem do arquivo Ícones, que usa o nome do Material Symbols em `snake_case`. **Não inventar nome de ícone.**

Nunca aceitar nome que o Figma gerou sozinho: `Component 1`, `Frame 143`, `Property 1`, `Variant2`, `token 2`. Isso é nome de cópia. Se apareceu, alguém duplicou e não nomeou.

Nunca nomear pelo lugar onde a coisa aparece. `whatsapp.svg`, não `whatsapp-menu.svg`. Foi o que gerou três cópias do mesmo arquivo em `/public/icons`.

### Sobre asset do Figma

**Nunca usar URL de asset do Figma no código.** Os links `https://www.figma.com/api/mcp/asset/...` expiram em 7 dias. Todo ícone, imagem ou SVG é baixado e salvo em `/public/icons` ou `/public/assets`, e referenciado pelo caminho local. Antes de salvar, checar se o mesmo arquivo já existe lá.

### Sobre a tela

- **WhatsApp usa ícone distinto do telefone.**
- **Conteúdo é aditivo, nunca filtrante.** Responder uma pergunta acrescenta conteúdo. Nada desaparece com base no que a pessoa respondeu.
- **Tela aberta dentro de um fluxo respeita o container do fluxo.** Modal e página acionados a partir do onboarding mantêm as margens e a largura máxima do `IntroShell`, sem ocupar a viewport inteira.
- **Sem notificação push.** É gatilho de recaída documentado.
- **Sem bloqueio por idade.**
- Mobile primeiro. A coleção de variáveis tem modo Mobile e Desktop, e o Desktop não é só o Mobile esticado: a escala primitiva muda de valor.

---

## Antes de dizer que terminou

- [ ] Todo texto passou pelo checklist da seção 15 do `tom-de-voz.md`
- [ ] Nenhum travessão
- [ ] Todo botão e link no infinitivo
- [ ] Nenhum valor cru de cor, espaço ou raio
- [ ] Nenhum nome auto-gerado do Figma
- [ ] Nenhum ícone com nome inventado, nenhum asset duplicado
- [ ] Nenhuma URL de asset do Figma no código
- [ ] Nenhum texto inventado para preencher estado que a referência não define
- [ ] O componente existe em `/ui` com todos os estados antes de entrar na tela

---

## Armadilhas já conhecidas

Coisas que custaram tempo antes e vão custar de novo.

1. **Em 18/09/2026, `numbers/scale-16` valia 16 no Mobile e 24 no Desktop, e continua assim.** Toda a escala de 16 a 96 diverge por modo: só o nome foi corrigido, o valor não. Ver a tabela na seção 2 do `spec-visual.md`.
2. **Em 18/09/2026, o código tinha 7 componentes de botão contra o `button` único do Figma, com 246 variantes.** Reconciliado nesse mesmo dia: `ActionButton`, `BotaoAgendar`, `BotaoContinuar`, `BotaoServicosPublicos` e `BotaoTopicos` agora são atalhos finos para `components/ui/Button.tsx`; `BotaoFecharMenu` e `BotaoMenu` continuam à parte porque no Figma são o componente `icon-button`, outro componente. Antes de criar um botão novo, ler a seção 5 do `componentes.md`.
3. **A rampa `colors/alpha/*` tinha cor base diferente nos dois lados até 18/09/2026** (o Figma usava `#012a1c` colado no modo Desktop; o código sempre usou `#171b18`). Resolvido nesse dia: os dois modos do Figma passaram a seguir `neutral-950`, que é `#171b18`, alinhando com o código.
4. **Urbanist não era pendência real.** Em 18/09/2026 confirmou-se que a fonte sempre esteve no projeto, carregada em `app/layout.tsx` junto com Inter. A dúvida anterior foi erro de leitura na primeira varredura.
5. **Até 18/09/2026, havia um único `:root` de 20 variáveis contra 260 no Figma**, minificado em uma linha de `app/globals.css`, mais 13 arquivos de override, sem fonte única de token. Resolvido nesse mesmo dia: `app/tokens.css` gera as 259 variáveis do Figma como fonte única, e os 13 arquivos de override viraram 10, um por tela. Ver `spec-visual.md` seção 10.
6. **Na API do Figma, o estilo da Inter é `"Semi Bold"` com espaço**, não `"SemiBold"`.
7. **Em 18/09/2026, todo onboarding e toda a parte de proteção de dados existiam só no código**, sem componente no Figma.
