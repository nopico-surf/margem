# CLAUDE.md — Margem (v0)

Este arquivo fica na raiz do repositório. É a primeira coisa que você lê antes de escrever qualquer linha.

---

## 1. O que estamos construindo

Uma plataforma web onde alguém que usa álcool ou outras drogas, ou alguém próximo dessa pessoa, chega, descreve o que está vivendo e recebe na mesma tela: acolhimento, orientação prática, um checklist do que dá pra fazer agora e contatos reais de quem pode ajudar.

A Margem é ponte, não substituto. Não é clínica, não é terapia, não é chat de conversa contínua. Ela conecta a serviços públicos, grupos de apoio e profissionais que já existem.

Consequência prática disso: nenhuma tela pode dar a entender que a Margem resolve sozinha, e nenhuma tela pode prometer resultado.

---

## 2. Front e back moram no mesmo repositório

**Next.js (App Router), hospedado na Vercel. O backend são Route Handlers dentro do mesmo projeto.**

Não existe serviço Python, não existe Fastify separado, não existe fila, não existe worker. O motor de regras determinístico foi descartado, e era ele que justificava um backend próprio. O que sobrou é: ler do Supabase, chamar o Gemini quando não tem resposta salva, montar o JSON, devolver.

Tudo que toca chave de API ou banco roda server-side. A chave do Gemini e a service role do Supabase nunca chegam ao browser.

Estrutura esperada:

```
/app
  page.tsx                    boas-vindas (step 1 e step 2)
  /conversa/page.tsx          cards + campo aberto + resposta
  /privacidade/page.tsx       política completa, texto longo
  /ui/page.tsx                galeria de componentes (só dev)
  /api/orientacao/route.ts    o endpoint que importa
/components
  /icons                      um componente por ícone, nunca SVG inline duplicado
/lib
  supabase.ts
  gemini.ts
  cache.ts
  risco.ts
  normalizar.ts
/docs
  tom-de-voz.md
  spec-visual.md
  prompt-gemini.md
```

---

## 3. O fluxo, do começo ao fim

**Primeira visita.** Step 1 (Sobre a Margem): pulável, com card de emergência visível contendo CVV 188, SAMU 192, Polícia 190 e Disque Social 121. Step 2 (Sobre dados): não pulável, com um único checkbox de consentimento que cobre tudo (armazenamento local, IA, analytics, compartilhamento anonimizado com governo e pesquisa). Esse step traz também o aviso de que, pra quem é menor de 18, conversar com um responsável pode ser importante. Sem pedir declaração de idade, sem bloqueio, sem avisar ninguém.

O consentimento grava em `localStorage` e em `sessoes.consentimento_lgpd`. Quem já consentiu não vê essa tela de novo.

**Tela principal.** Seis cards que representam estados emocionais distintos, mais um sétimo para familiares e pessoas próximas. Em paralelo, um campo de texto livre. A pessoa escolhe qualquer um dos caminhos, não é um funil.

**Se clicou num card.** A resposta já está no banco (`cards_predefinidos` → `respostas`). Zero chamada de IA, zero token. Renderiza direto.

**Se escreveu no campo livre.** Normaliza o texto (minúsculas, sem acento, sem pontuação), gera a `chave_busca`, procura em `respostas.chave_busca`.
- Achou equivalente: cache hit. Devolve a resposta salva. Zero token.
- Não achou: uma chamada ao Gemini. Salva a resposta nova com `origem = gerada_gemini`. Devolve.

**Sempre, em paralelo.** Checagem dos `termos_risco` contra o texto original. Se bater, **não desvia o fluxo e não abre tela separada**: apenas reordena a resposta, subindo os contatos de emergência pro topo junto com a mensagem de escalação já escrita no banco. Essa detecção é nossa, hardcoded, e nunca é responsabilidade do Gemini.

**Montagem da resposta.** A plataforma junta o que veio do Gemini (ou do cache) com profissionais, instituições, serviços públicos e telefones buscados no nosso banco por `categoria_resposta_relevante`. Quem decide o que exibir e em que ordem somos nós, não a IA.

**Registro.** Grava `historico_interacoes` (com `foi_cache_hit`) e `auditoria_sessoes`. Tudo anônimo, por UUID de sessão, sem login.

**Perguntas de acompanhamento.** O Gemini já devolve três perguntas com opções multiselect. Construir o campo no contrato e o componente, mas deixar **desligado por feature flag** no v0.

---

## 4. Contrato do Gemini

O Gemini gera **seis coisas e só seis**: `acolhimento`, `orientacao`, `pilula_espiritual`, `checklist_agora`, `checklist_proximo`, `perguntas_aprofundamento`.

Ele **nunca** gera telefone, endereço, nome de profissional, nome de instituição ou número de emergência. Se qualquer um desses aparecer no texto gerado, é bug: descarta e cai no fallback pré-escrito.

Saída esperada:

```json
{
  "acolhimento": "string",
  "orientacao": "string",
  "pilula_espiritual": "string",
  "checklist_agora": ["string"],
  "checklist_proximo": ["string"],
  "perguntas_aprofundamento": [
    { "pergunta": "string", "opcoes": ["string"] }
  ]
}
```

O que a plataforma acrescenta antes de renderizar:

```json
{
  "telefones": [],
  "profissionais": [],
  "instituicoes": [],
  "servicos_publicos": [],
  "emergencia_no_topo": false
}
```

O system prompt vive em `/docs/prompt-gemini.md`, com o documento de Tom de Voz embutido por inteiro (não por URL, o ambiente não busca link externo). Ler de arquivo, nunca hardcodar dentro do route handler.

Validar o JSON antes de renderizar. Resposta malformada ou timeout não pode quebrar a tela: cai numa resposta genérica pré-escrita, que já existe no banco.

---

## 5. Cache

Determinístico e nosso. A IA não decide nada sobre reuso.

No v0: normalizar o texto e comparar `chave_busca`. Sem embeddings, sem similaridade semântica, sem fuzzy matching. Se a correspondência ficar grosseira demais, refinamos depois com dado real de uso, não por antecipação.

---

## 6. Banco (Supabase / Postgres)

- `sessoes`: id (UUID anônimo), timestamp_criacao, localizacao_usuario (opcional), consentimento_lgpd, timestamp_encerramento
- `historico_interacoes`: sessao_id, tipo (campo_aberto | card | pergunta_aprofundamento), texto_original, resposta_id, foi_cache_hit, timestamp
- `respostas`: origem (gerada_gemini | escrita_manual), chave_busca (indexada), acolhimento, orientacao, pilula_espiritual, checklist_agora (JSON), checklist_proximo (JSON), perguntas_aprofundamento (JSON), revisado_por_clinica, criado_em
- `cards_predefinidos`: titulo, resposta_id, ordem
- `profissionais_cadastrados`: nome, especialidade, telefone, email, localizacao, status, categoria_resposta_relevante
- `instituicoes_apoio`: nome, descricao, tipo, contatos (JSON), categoria_resposta_relevante
- `servicos_publicos`: nome, descricao, tipo, endereco, telefone, google_maps_link, categoria_resposta_relevante
- `telefones_uteis`: tipo, numero, descricao, categoria_resposta_relevante
- `termos_risco`: termo, tipo_emergencia, numero_contato, mensagem_escalacao
- `auditoria_sessoes`: sessao_id, acao, timestamp

Retenção indefinida. Nenhum dado pessoal identificável é coletado.

---

## 7. Regras invioláveis

Não são preferência de estilo. São critério de aceite.

- **Zero travessão** (`—`) em qualquer texto de interface. Sinaliza texto gerado por IA.
- **CTA sempre no infinitivo e sempre específico.** "Ver psicólogo parceiro", nunca "Ver profissional", nunca "Clique aqui", nunca "Saiba mais" solto.
- **Copy conversacional não tem título de seção.** Prosa corrida, uma pessoa falando com outra.
- **Conteúdo é aditivo, nunca filtrante.** Responder uma pergunta acrescenta conteúdo na tela. Nada desaparece com base no que a pessoa respondeu.
- **Nunca exibir que o sistema consulta banco, documento ou IA.** Sem "estou buscando", sem "de acordo com nossa base", sem spinner narrado.
- **WhatsApp usa ícone distinto do telefone.**
- **Sem notificação push.** É gatilho de recaída documentado.
- **Sem bloqueio por idade.** Quem usa e é adolescente é exatamente quem precisa de acesso.
- **Pessoa antes da situação.** "Pessoas que fazem uso", nunca "usuários de drogas", nunca "viciado" ou "dependente" como rótulo.
- **Nada que culpe** ("é só procurar ajuda", "basta se organizar") e nada que prometa o que não dá pra garantir.

---

## 8. O que não construir no v0

Se aparecer alguma dessas, o escopo vazou:

- motor de regras, rapidfuzz, fuzzy matching, dicionário de gírias
- Google Maps API (é link de redirect com parâmetros, e só)
- Gemini como classificador
- login, conta, histórico de longo prazo
- embeddings ou busca semântica
- dashboard de qualquer tipo
- backend separado do Next.js

A página "Arquitetura Técnica do Motor da Margem" no Notion ainda descreve o motor de regras antigo. Está desatualizada. Este arquivo vale mais.

---

## 9. Variáveis de ambiente

```
GEMINI_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_MIXPANEL_TOKEN
```

Só as `NEXT_PUBLIC_` podem aparecer no cliente. `.env.local` fora do git desde o primeiro commit.

**Cuidado com `vercel env pull`.** Variáveis marcadas como *Sensitive* no dashboard da Vercel (é o caso de `GEMINI_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY`) não são baixadas com o valor real: o comando escreve o literal `"[SENSITIVE]"` no `.env.local`. Isso não dá erro visível na hora, só quebra depois em runtime (ex: clique num card cai no fallback do Gemini com chave inválida, ou a service role key retorna 401 do Supabase). Depois de rodar `vercel env pull`, sempre conferir se `GEMINI_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY` não ficaram como `[SENSITIVE]`; se ficaram, colar o valor real manualmente (Supabase: Project Settings → API → `service_role`; Gemini: Google AI Studio → API keys).

---

## 10. Como trabalhar comigo

- Antes de escrever código de uma feature nova, me mostrar o plano em até 10 linhas e esperar meu ok.
- **Zero invenção quando eu mando referência.** Quando eu mando uma referência (link do Figma, print, texto exato que eu escrevi), o que está nela é o teto e o chão: implementar exatamente aquilo, nem mais nem menos.
  - Não criar botão, campo, CTA, texto, ícone, estado ou seção que não esteja na referência, mesmo que pareça óbvio, mesmo que "toda tela parecida tem isso".
  - Não completar texto que eu mandei incompleto, não trocar palavra por sinônimo, não adicionar frase de transição, não inventar microcopy de placeholder ou de erro que eu não escrevi.
  - Se a referência não cobre uma parte da tela, ou parece faltar algo (ex: não dá pra saber o texto de um estado de erro), **parar e perguntar antes de implementar essa parte**, nunca preencher o vazio com um chute plausível. "Não vejo o texto do estado de erro na referência, qual é?" é a resposta certa. Inventar um texto de erro plausível não é.
  - Isso vale mesmo quando a referência é o Figma: se um componente do Figma não define um estado (hover, erro, vazio), esse estado fica pendente de definição, não é motivo pra criar um do zero.
- **Antes de criar qualquer componente, varrer o Figma, não o código.** O código já existente foi criado sem esse cuidado e não é confiável como mapa do que já existe ou de como as coisas se encaixam. A fonte de verdade sobre o que já foi desenhado, como os componentes se aninham e onde cada ícone aparece é o arquivo Figma da Margem, consultado via MCP do Figma. Nessa ordem, antes de escrever qualquer componente novo:
  1. **Existe ou não existe.** Procurar no Figma se o componente pedido já foi desenhado, com esse nome ou outro, e se pode nascer da composição de componentes que já estão lá em vez de um novo do zero.
  2. **Hierarquia de aninhamento.** Ler a estrutura de frames e componentes do Figma (o que fica dentro do quê: ícone dentro de botão, botão dentro de card, card dentro de lista) antes de decidir como o componente em React vai ser dividido. A árvore do Figma é o mapa; o componente em código replica essa árvore, não o contrário.
  3. **Ícone repetido entre páginas.** Antes de criar ou exportar um ícone, checar nas diferentes páginas/telas do Figma se aquele ícone já aparece em outro lugar, mesmo com nome diferente no arquivo. Se já existe, reaproveitar o mesmo asset e criar (ou reusar) um único componente em `/components/icons`, nunca duplicar.
  4. **Relatar a varredura.** O plano de até 10 linhas do item anterior inclui o resultado disso: quais componentes do Figma serão reaproveitados, quais serão criados e por que não havia equivalente lá. Se a varredura no Figma não foi feita, o plano está incompleto.
  5. Só depois de mapear o Figma é que vale olhar o código existente, e só pra ver o que já foi implementado daquilo que o Figma mostra, nunca como fonte primária de "o que existe".
- **Componentes primeiro, telas depois.** Todo componente aparece em `/ui` com todos os estados (hover, focus, disabled, carregando, erro) antes de ser usado numa tela.
- A spec visual é `/docs/spec-visual.md`. O Figma é a fonte de verdade sobre o que existe e como se estrutura; o código é a fonte de verdade sobre como está implementado hoje.
- Um arquivo por vez, diff pequeno, sem refatoração não pedida.
- Se algo que eu pedir contradisser este documento, apontar a contradição antes de implementar.
- Não criar abstração pra caso que ainda não apareceu.

---

## 11. Definição de pronto do v0

- [x] Boas-vindas em dois steps, com consentimento gravado e não repetido
- [x] Seis cards renderizando resposta do banco sem chamar IA (v0; 7º "para familiares" pode vir depois)
- [x] Campo livre funcionando com cache hit e cache miss
- [x] Uma chamada ao Gemini no miss, com resposta salva no banco
- [ ] Detecção de termo de risco reordenando a resposta
- [x] Bloco de contatos montado a partir do nosso banco (profissionais, serviços públicos, instituições dinâmicas)
- [ ] Link de redirect pro Google Maps funcionando
- [ ] `/privacidade` publicada
- [ ] `/ui` com todos os componentes e estados
- [x] Nenhuma chave sensível no bundle do cliente (Service Role Key roda server-side)
- [ ] Fallback testado: Gemini fora do ar não quebra a tela

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
