# Briefing L1: os 8 módulos, com descrição, na LP e no painel

Pré-requisito: nenhum. Não substitui nenhum briefing. Mexe na LP (`/familia`), no painel (`/familia/programa`), nos 8 arquivos de módulo e em `lib/familia/conteudo.ts`.

## O problema

Na LP, a pessoa vê os 5 eixos em "O que você vai aprender" e, logo depois, o preço (`app/familia/page.tsx`, linhas 291 a 321). Em nenhum momento ela vê o que tem em cada uma das 8 semanas antes de decidir pagar.

No painel, a lista "Os 8 módulos" mostra só o rótulo "Módulo N" e o título (`app/familia/programa/PainelCliente.tsx`, linhas 326 a 328). Quem já comprou não sabe o que vem em cada semana, e títulos como "O convite" e "Depois da resposta" não dizem muita coisa para quem ainda não abriu o módulo.

A descrição precisa ser uma só para os dois lugares, guardada junto do módulo, para não ficar um texto na LP e outro no painel.

## O que fazer

### 1. Uma descrição por módulo, no frontmatter

Em cada `content/familia/modulos/modulo-0N.md`, acrescente a linha `descricao` logo abaixo de `titulo`. O texto usa `{{apelido}}` onde cabe: no painel entra o apelido; na LP, sem apelido, `aplicarApelido` troca por "quem você ama". Os textos abaixo já foram conferidos nos dois jeitos.

Não use `#` nem aspas duplas dentro do texto: o leitor do frontmatter (`lib/familia/markdown.ts`, linha 97) corta tudo depois de `#`.

| Arquivo | Linha a acrescentar |
|---|---|
| `modulo-01.md` | `descricao: "Entender por que é tão difícil parar, o que não é culpa sua e o que costuma piorar as coisas em casa."` |
| `modulo-02.md` | `descricao: "Anotar por 7 dias os momentos difíceis e os bons com {{apelido}} e descobrir o que costuma vir antes do uso."` |
| `modulo-03.md` | `descricao: "Trocar as frases que viram briga por outras mais curtas e calmas, e treinar o que dizer quando {{apelido}} nega o problema."` |
| `modulo-04.md` | `descricao: "Descobrir do que {{apelido}} gosta e planejar jeitos simples de valorizar os dias sem uso, com elogios sinceros e sem ironia."` |
| `modulo-05.md` | `descricao: "Deixar um profissional e um horário prontos antes de convidar {{apelido}} para buscar ajuda, e saber o que fazer com cada resposta."` |
| `modulo-06.md` | `descricao: "Parar de cobrir o que é responsabilidade de {{apelido}}, como desculpas no trabalho e dívidas, e proteger o dinheiro da casa, sempre com segurança."` |
| `modulo-07.md` | `descricao: "Dar notas de novo para a sua vida, comparar com as notas do módulo 1 e encontrar pessoas e grupos que acolhem familiares."` |
| `modulo-08.md` | `descricao: "Depois do convite para buscar ajuda, apoiar sem vigiar se vier um sim, tentar outra vez se vier um não e manter a calma se o uso voltar."` |

Como fica na LP, sem apelido (só para conferir, não é texto a mais):
- Módulo 2: "...os momentos difíceis e os bons com quem você ama e descobrir..."
- Módulo 3: "...treinar o que dizer quando quem você ama nega o problema."
- Módulo 4: "Descobrir do que a pessoa gosta e planejar..." (depois de "que", `aplicarApelido` usa "a pessoa", `lib/familia/diagnostico.ts`, linha 236)
- Módulo 5: "...antes de convidar quem você ama para buscar ajuda..."
- Módulo 6: "Parar de cobrir o que é responsabilidade de quem você ama..."

Os títulos dos módulos não mudam.

### 2. LP: nova seção "Os 8 módulos", antes do preço

Entra entre o bloco "Sem julgamento / Sua privacidade" e o banner de oferta, ou seja, logo antes de `<OfertaPrograma variante="lp" />`. Mesmo componente e mesmo estilo dos cards de "O que você vai aprender" (`CardsLp` dentro de `.familia-lp-grade-eixos`), com uma diferença: em cima do título de cada card vai o rótulo "Módulo N", igual ao do painel.

- Título da seção: **"Os 8 módulos"** (com `home-secao-titulo`, como os outros títulos da LP). Use o número de módulos publicados, para o título nunca prometer módulo que não está lá.
- Linha de apoio, logo abaixo do título: **"Um módulo por semana, com uma leitura curta e exercícios para encaixar no dia a dia."**
- Cada card: rótulo "Módulo N", título do módulo e a descrição do item 1.
- Grade: 1 coluna no celular, 4 colunas no desktop (duas fileiras de 4).

### 3. Painel: a descrição embaixo do título de cada módulo

Na lista "Os 8 módulos", cada item passa a ter, nesta ordem: rótulo "Módulo N", título, descrição (com o apelido da pessoa), e o status que já existe ("Concluído em DD/MM", "Em andamento", "Chega em DD/MM" ou o cadeado).

A descrição aparece em todos os estados, inclusive no módulo com cadeado e no guardado pelo modo de segurança, porque saber o que vem não libera nada.

O card "Esta semana" não muda.

## Código

**`lib/familia/conteudo.ts`**
- No tipo `Modulo` (linha 12), acrescente `descricao: string | null`.
- Em `lerModulo` (linha 59), acrescente `descricao: texto(dados.descricao),`.
- Crie, ao lado de `titulosDosModulosPagos` (linha 74), a função `resumosDosModulos()`: lê os 8, filtra os publicados e devolve `Array<{ numero: number; titulo: string; descricao: string }>`, só com os que têm descrição.

**`app/familia/page.tsx`**
- `FamiliaPage` vira `async` e chama `await resumosDosModulos()`. A página continua estática: o conteúdo é lido no build, como no painel.
- Importe `aplicarApelido` de `@/lib/familia/diagnostico`.
- Entre a `</section>` da linha 316 e o comentário da linha 318, acrescente:

```tsx
{modulos.length > 0 && (
  <section className="familia-lp-secao">
    <div className="familia-lp-modulos-cabecalho">
      <h2 className="home-secao-titulo">{`Os ${modulos.length} módulos`}</h2>
      <p className="text-medium-regular">Um módulo por semana, com uma leitura curta e exercícios para encaixar no dia a dia.</p>
    </div>
    <div className="familia-lp-grade familia-lp-grade-4 familia-lp-grade-eixos">
      {modulos.map((modulo) => (
        <CardsLp
          key={modulo.numero}
          icone={<span className="label-small-medium familia-texto-suave">Módulo {modulo.numero}</span>}
          titulo={modulo.titulo}
          texto={aplicarApelido(modulo.descricao, undefined)}
        />
      ))}
    </div>
  </section>
)}
```

- Em `app/familia-lp.css`, crie `.familia-lp-modulos-cabecalho` com `display: flex; flex-direction: column; gap: var(--spacing-8);`, para a linha de apoio ficar colada no título e não com o espaço de 24 da seção. `familia-lp-grade-4` e `familia-lp-grade-eixos` já existem (linhas 95 a 104 e 137 a 139) e não precisam mudar.
- Confira que `familia-texto-suave` (de `app/familia.css`) carrega na LP. Se não carregar, use no rótulo a mesma cor e o mesmo tamanho dela: 14px, medium, cor secundária (briefing 00, item 1).

**`app/familia/programa/page.tsx`**
- No `.map` das linhas 30 a 35, acrescente `descricao: modulo.descricao,`.

**`app/familia/programa/PainelCliente.tsx`**
- No tipo `ModuloDoPainel` (linha 40), acrescente `descricao: string | null`.
- Logo depois do título (linha 328), acrescente:

```tsx
{modulo.descricao && <span className="text-medium-regular familia-texto-suave">{aplicarApelido(modulo.descricao, apelido)}</span>}
```

`aplicarApelido` já está importado (linha 12). O `.painel-modulo` já é flex em coluna, então a descrição fica numa linha própria, sem CSS novo.

## Critério de aceite

- Na LP, a seção "Os 8 módulos" aparece logo antes de "Quanto custa", com os 8 cards no mesmo estilo de "O que você vai aprender", mais o rótulo "Módulo N" em cima do título.
- No desktop, 2 fileiras de 4 cards; no celular, 1 coluna.
- Na LP, nenhuma descrição mostra `{{apelido}}`: onde ele estava, aparece "quem você ama" (ou "a pessoa", depois de "que"), com a preposição certa.
- No painel, cada módulo mostra a descrição com o apelido da pessoa, em todos os estados (aberto, em andamento, concluído, "Chega em", cadeado e guardado).
- O texto vem só do frontmatter de cada módulo. Não existe cópia da descrição em `page.tsx` nem em `PainelCliente.tsx`.
- Módulo sem `descricao` no frontmatter não quebra: na LP ele não aparece na seção, e no painel aparece só com o título.
- A página `/familia` continua sendo gerada no build (estática).
- Sem travessão, sem gênero marcado na pessoa que lê, sem palavra proibida.
