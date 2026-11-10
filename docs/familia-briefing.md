# Briefing — Programa para Familiares (Margem) — MVP

> Documento para o Claude Code. Nome provisório do produto: **Junto** (trocar em um lugar só: constante `PRODUCT_NAME`).
> Status do conteúdo clínico: **RASCUNHO**. Todo texto marcado com `[REVISÃO CLÍNICA]` precisa ser revisado por psicóloga parceira antes de ir ao ar.

---

## 0. Como usar este briefing (instruções para o Claude Code)

1. Antes de escrever código, explore o repositório da Margem: stack, roteamento, componentes de UI, estilos, autenticação, integração com IA, fluxo de agendamento com profissionais e forma de pagamento já existentes.
2. **Reaproveite os padrões e componentes existentes.** Não crie design system novo, não troque bibliotecas, não adicione dependências grandes sem perguntar.
3. Implemente **por fases** (seção 13). Ao fim de cada fase: rode o projeto, teste no viewport de celular (o público é majoritariamente mobile) e liste o que ficou pendente.
4. Quando algo deste briefing conflitar com o que já existe no código, siga o código e registre a divergência no resumo da fase.
5. Itens marcados `[PENDÊNCIA DO FUNDADOR]` não devem ser inventados: deixe configurável e sinalize.

---

## 1. Contexto e objetivo

A Margem é uma startup de redução de danos (álcool, outras drogas e apostas) com uma rede de psicólogos e psiquiatras parceiros que atendem pela plataforma.

O produto é um **programa digital de 8 semanas para familiares** (mãe, pai, companheiro(a), filho(a) adulto(a), irmão(ã), amigo(a)) de alguém com problema com álcool, outras drogas ou apostas (bets). O familiar aprende, na prática, a:
- cuidar de si mesmo no meio da situação;
- entender o padrão do problema;
- conversar sem brigar;
- reforçar os momentos bons e parar de amortecer as consequências do uso;
- aproveitar as janelas certas para convidar a pessoa a buscar ajuda.

O conteúdo é **baseado em princípios publicados de abordagens de treinamento familiar com evidência científica**. **Nunca usar o nome "CRAFT", "Invitation to Change" ou qualquer marca de terceiros** no produto, no código visível ao usuário ou no marketing.

### Princípio de produto (vindo da pesquisa)
- O benefício mais consistente desses programas, em qualquer formato, é **o bem-estar do familiar** (menos depressão, mais satisfação com a vida, mais capacidade de lidar com o problema).
- A chance de o ente querido aceitar tratamento **sobe muito quando há apoio de profissional**; programas 100% autoguiados têm efeito menor, e em apostas o efeito sobre entrada em tratamento é o mais fraco.
- Portanto: **a promessa principal é o familiar ficar melhor e aprender a agir**; aceitar ajuda é um objetivo, nunca uma garantia. E **os profissionais da Margem são parte central do produto**, não um extra.

---

## 2. Escopo do MVP

### Dentro
- **Login obrigatório apenas por provedores externos** (Google, Apple, Facebook). A Margem não armazena senhas (seção 4.1).
- **Modo discreto** e botão "Sair rápido" (seção 11.1).
- **Áudio narrado** em cada módulo + espaço reservado para vídeo futuro (seção 7).
- Landing page (LP) do programa.
- Diagnóstico grátis (questionário de ~3 min) com triagem de segurança.
- Página de resultado: mapa da situação + roteiro da primeira conversa (**montados com blocos fixos revisados, sem IA**, seção 6) + módulo 1 liberado.
- Checkout via Pix e liberação de acesso.
- Área do programa: lista de módulos, status, liberação semanal.
- Módulos 1 e 2 completos no lançamento; módulos 3 a 8 liberados semanalmente conforme o conteúdo for publicado.
- **Simulador de conversa com IA** (o familiar ensaia, a IA faz o papel do ente querido e depois dá feedback).
- Check-in semanal.
- Gatilhos de indicação de profissional da Margem + "resumo da jornada" que o familiar pode enviar ao profissional (com consentimento).
- Contatos de emergência sempre acessíveis.
- Eventos de analytics (seção 12).

### Fora (não implementar agora)
- App nativo (fazer web responsivo / PWA se o projeto já suportar).
- Grupos online com psicóloga (fase posterior — deixar o modelo de dados preparado para "turmas").
- Comunidade entre usuários.
- Assinatura recorrente.
- Painel do profissional dentro do programa (o profissional recebe o resumo via fluxo de agendamento já existente).

---

## 3. Tom de voz

- Acolhedor, direto, sem julgamento, sem jargão clínico. Frases curtas.
- Nunca culpar o familiar nem o ente querido. Nunca usar rótulos ("viciado", "drogado", "bêbado", "jogador compulsivo") em textos do produto.
- Redução de danos e abstinência são **ambos caminhos possíveis**; quem escolhe é a pessoa, idealmente com um profissional. Nunca desqualificar nenhum dos dois.
- Tratamento por "você". Gênero neutro sempre que possível ("a pessoa", "quem você ama").
- O familiar pode dar um **apelido** para a pessoa no diagnóstico; usar o apelido nos textos personalizados (variável `{{apelido}}`, fallback: "a pessoa que você ama").

---

## 4. Rotas / páginas

Adaptar nomes ao padrão de rotas do projeto.

| Rota | Acesso | Conteúdo |
|---|---|---|
| `/familia` | público | Landing page |
| `/familia/diagnostico` | público | Questionário em etapas (1 pergunta por tela) |
| `/familia/seguranca` | público | Página de segurança (ramificação do diagnóstico e link fixo no rodapé) |
| `/familia/resultado` | após diagnóstico + e-mail | Mapa, roteiro da 1ª conversa, módulo 1, CTA de compra |
| `/familia/checkout` | logado | Escolha do plano e pagamento Pix |
| `/familia/programa` | comprador | Painel: módulos, progresso, próximo check-in, profissionais |
| `/familia/programa/modulo/[n]` | comprador (módulo 1 também para não compradores) | Conteúdo + exercício |
| `/familia/programa/simulador/[cenario]` | comprador (cenário 1 também grátis, limitado) | Simulador |
| `/familia/programa/checkin` | comprador | Check-in semanal |
| `/familia/programa/resumo` | comprador | Resumo da jornada (para enviar ao profissional) |

### 4.1 Autenticação

- **Somente login social (OAuth):** Google, Apple e Facebook. **Não implementar login por senha.** A Margem não guarda senhas.
- Usar o provedor de autenticação que o projeto já usa, se ele suportar os três. Se não houver, usar um serviço gerenciado que suporte os três (ex.: o Auth do backend já usado no projeto). Não implementar OAuth "na mão".
- Se o site da Margem já tem login (por exemplo, para agendar sessão com profissional), **usar a mesma conta**: o familiar não deve se cadastrar duas vezes para contratar um profissional durante a jornada.
- **Onde exigir o login:** configurável por flag `LOGIN_GATE`:
  - `antes_do_resultado` (**padrão**): a pessoa responde o diagnóstico sem login e precisa entrar para ver o resultado. Respostas ficam em armazenamento local até o login e são vinculadas à conta em seguida.
  - `inicio`: login antes da primeira pergunta.
  Registrar o evento `login_solicitado` e `login_concluido` (com provedor) para comparar as duas opções.
- Dados a solicitar dos provedores: apenas nome e e-mail (escopos mínimos). Não pedir lista de amigos, contatos ou outros dados.
- **Casos a tratar:**
  - Apple com "Ocultar meu e-mail": o e-mail recebido é um endereço de encaminhamento. Ele funciona para envio, desde que o domínio de envio da Margem esteja registrado no serviço de encaminhamento da Apple `[PENDÊNCIA DO FUNDADOR]`.
  - Facebook sem e-mail (conta criada com telefone): pedir o e-mail em um campo após o login, obrigatório para continuar.
  - Mesmo e-mail vindo de provedores diferentes: vincular à mesma conta.
- Sessão persistente no dispositivo (o familiar raramente deve precisar entrar de novo).
- Tela de login com o texto: "Entre para salvar seu resultado e continuar de onde parou. Não pedimos senha e não publicamos nada nas suas redes."

---

## 5. Diagnóstico grátis

Uma pergunta por tela, barra de progresso, botão voltar. Salvar respostas localmente até o e-mail ser informado; depois persistir.

| # | Pergunta | Tipo | Opções / regras |
|---|---|---|---|
| 1 | Quem é essa pessoa pra você? | única | Filho(a) · Companheiro(a) / marido / esposa · Pai / mãe · Irmão(ã) · Amigo(a) · Outro |
| 2 | Como você quer chamar essa pessoa aqui? | texto curto, opcional | Placeholder: "Pode ser um apelido. Não precisa ser o nome real." Máx. 20 caracteres |
| 3 | O que mais te preocupa hoje? | múltipla | Álcool · Outras drogas · Apostas / bets |
| 4 | Há quanto tempo você percebe isso? | única | Menos de 6 meses · 6 meses a 2 anos · Mais de 2 anos |
| 5 | Hoje, {{apelido}}… | única | Não acha que tem um problema · Às vezes reconhece, mas não quer ajuda · Quer mudar, mas não sabe como · Já está em tratamento · Tinha parado e voltou |
| 6 | Quando você tenta conversar sobre isso, normalmente… | múltipla | Vira briga · A pessoa nega · Promete que vai parar · Muda de assunto · Se afasta / some · Ainda não tentei |
| 7 | Vocês moram juntos? | única | Sim · Não |
| 8 | **[SEGURANÇA]** Em algum momento você teve medo de que {{apelido}} machucasse você, alguém da casa ou a si mesmo(a)? | única | Não · Sim, já aconteceu no passado · Sim, tenho esse medo hoje |
| 9 | **[SEGURANÇA]** Já houve agressão física, ameaça ou objetos quebrados durante brigas? | única | Não · Sim, raramente · Sim, com frequência |
| 10 | Isso já afetou o dinheiro da casa? | única | Não · Um pouco · Muito · Não sei |
| 11 | Nas últimas duas semanas, com que frequência você se sentiu esgotado(a), ansioso(a) ou sem dormir direito por causa disso? | única (0–3) | Quase nunca (0) · Alguns dias (1) · Mais da metade dos dias (2) · Quase todos os dias (3) |
| 12 | O que você mais quer agora? | única | Que {{apelido}} aceite ajuda · Parar de brigar · Proteger a família e o dinheiro · Cuidar de mim · Entender o que está acontecendo |
| 13 | Login (Google, Apple ou Facebook) — conforme `LOGIN_GATE` | login social | + checkbox obrigatório de consentimento de uso dos dados + checkbox **opcional e desmarcado** de comunicações (seção 11) |

### Regras de segurança do diagnóstico
- **Q8 = "tenho esse medo hoje" OU Q9 = "com frequência"** → antes do resultado, mostrar `/familia/seguranca` em modo destacado e marcar o perfil com `safety_mode = true`.
- Com `safety_mode = true`:
  - o roteiro da primeira conversa **não é gerado**; no lugar, mostrar orientação para conversar primeiro com um profissional e o plano de segurança;
  - os módulos 5 (consequências naturais) e 7 (convite para ajuda) ficam bloqueados com explicação: mudanças na dinâmica da casa podem aumentar o risco quando há violência — esses passos devem ser feitos com acompanhamento de um profissional;
  - o simulador não oferece cenários de confronto ou de convite.
- O familiar pode revisar essas respostas depois (no check-in), e o modo é recalculado.

### Página de segurança (`/familia/seguranca`) `[REVISÃO CLÍNICA]`
Título: **Sua segurança vem primeiro.**
Texto: "Se você ou alguém da casa está em perigo agora, procure ajuda imediata. Nenhuma técnica de conversa é mais importante do que estar seguro."
Lista (botões de ligar no mobile):
- **190** — Polícia Militar (perigo imediato)
- **180** — Central de Atendimento à Mulher (violência contra a mulher)
- **100** — Disque Direitos Humanos (violência contra criança, adolescente, pessoa idosa ou pessoa com deficiência)
- **192** — SAMU (intoxicação, overdose, emergência médica)
- **188** — CVV (se você ou a pessoa estiver pensando em se machucar ou em suicídio)
- Botão: "Falar com um profissional da Margem" (fluxo de agendamento existente).

Rodapé fixo em todas as páginas do programa: link "Precisa de ajuda agora?" → esta página.

---

## 6. Resultado (mapa + roteiro) — montado com blocos fixos

**Não usar IA no resultado.** O resultado é montado combinando **blocos de texto fixos**, escritos uma vez e revisados pela psicóloga, conforme as respostas do diagnóstico. Vantagens: texto sempre revisado, custo zero por usuário, resposta instantânea e nenhuma chance de a IA escrever algo fora das regras. (A IA continua sendo usada apenas no simulador, seção 8.)

### Onde ficam os blocos
- Arquivo de conteúdo no repositório: `content/familia/resultado-blocos.md` (ou `.json`/`.yaml`, conforme o padrão do projeto). Cada bloco tem um **ID** (ex.: `[ATENCAO_NAO_RECONHECE]`) e o texto. O texto final dos blocos será entregue separadamente pelo fundador `[PENDÊNCIA DO FUNDADOR]`; enquanto isso, usar os IDs com texto provisório.
- Os textos usam a variável `{{apelido}}` (fallback: "a pessoa que você ama") e, nas frases úteis, `{{exemplo}}` (ver abaixo).
- Um teste automatizado deve garantir que **todos os IDs usados pela lógica existem** no arquivo e que nenhum bloco contém as palavras proibidas da seção 3.

### Regras de montagem

**Problema principal:** a Q3 aceita várias opções. O problema principal é o primeiro marcado. Ele define `QUANDO_*` e `EXEMPLO_*`. Os avisos (`AVISO_*`) e os itens extras de "Evite" aparecem para **todos** os problemas marcados.

**Situação da pessoa (Q5) → `ESTAGIO`:**
| Q5 | ESTAGIO |
|---|---|
| Não acha que tem um problema | `NAO_RECONHECE` |
| Às vezes reconhece, mas não quer ajuda | `RECONHECE_AS_VEZES` |
| Quer mudar, mas não sabe como | `QUER_MUDAR` |
| Já está em tratamento | `EM_TRATAMENTO` |
| Tinha parado e voltou | `RECAIDA` |

**Seções da página:**

| Seção | Blocos usados |
|---|---|
| Acolhimento | `ACOLHIMENTO_TEMPO_CURTO` / `_MEDIO` / `_LONGO` (Q4) + `ACOLHIMENTO_EXTRA_CANSACO` se Q11 ≥ 2 |
| O que joga a seu favor | 3 itens, escolhidos pela ordem de prioridade abaixo |
| Ponto de atenção | `ATENCAO_{ESTAGIO}` |
| Quando conversar | `QUANDO_{PROBLEMA_PRINCIPAL}` |
| Abertura | `ABERTURA_{ESTAGIO}` |
| Frases úteis | `FRASES_{ESTAGIO}` (3 frases), com `{{exemplo}}` = `EXEMPLO_{PROBLEMA_PRINCIPAL}` |
| Evite | `EVITE_GERAL` (3 itens) + `EVITE_EXTRA_{PROBLEMA}` para cada problema marcado |
| Se reagir mal | `REAGIR_{REACAO}`: a primeira reação marcada na Q6, na prioridade: vira briga → nega → se afasta → muda de assunto → promete parar → ainda não tentei |
| Um passo para você | `PASSO_ESGOTADO` se Q11 ≥ 2, senão `PASSO_MODERADO` |
| Avisos | `AVISO_{PROBLEMA}` para cada problema marcado |

**"O que joga a seu favor" — prioridade (pegar os 3 primeiros que se aplicam):**
1. `FAVOR_QUER_MUDAR` (Q5 = quer mudar)
2. `FAVOR_EM_TRATAMENTO` (Q5 = em tratamento)
3. `FAVOR_JA_PAROU_ANTES` (Q5 = tinha parado e voltou)
4. `FAVOR_RECONHECE_AS_VEZES` (Q5 = às vezes reconhece)
5. `FAVOR_PERCEBEU_CEDO` (Q4 = menos de 6 meses)
6. `FAVOR_MORA_JUNTO` (Q7 = sim)
7. `FAVOR_SEM_VIOLENCIA` (Q8 = não **e** Q9 = não)
8. `FAVOR_DINHEIRO_POUCO_AFETADO` (Q10 = não ou um pouco)
9. `FAVOR_ESTA_BUSCANDO` (sempre se aplica; garante que sempre haja 3)

**Modo segurança (`safety_mode = true`):** as seções "Quando conversar", "Abertura", "Frases úteis", "Evite" e "Se reagir mal" são **substituídas** pelo bloco `SEGURANCA_PRIMEIRO`, seguido dos contatos de emergência e do botão de profissional. `FAVOR_SEM_VIOLENCIA` nunca aparece.

### Lista completa de IDs
- Acolhimento: `ACOLHIMENTO_TEMPO_CURTO`, `ACOLHIMENTO_TEMPO_MEDIO`, `ACOLHIMENTO_TEMPO_LONGO`, `ACOLHIMENTO_EXTRA_CANSACO`
- A seu favor: `FAVOR_MORA_JUNTO`, `FAVOR_SEM_VIOLENCIA`, `FAVOR_DINHEIRO_POUCO_AFETADO`, `FAVOR_PERCEBEU_CEDO`, `FAVOR_RECONHECE_AS_VEZES`, `FAVOR_QUER_MUDAR`, `FAVOR_EM_TRATAMENTO`, `FAVOR_JA_PAROU_ANTES`, `FAVOR_ESTA_BUSCANDO`
- Ponto de atenção: `ATENCAO_NAO_RECONHECE`, `ATENCAO_RECONHECE_AS_VEZES`, `ATENCAO_QUER_MUDAR`, `ATENCAO_EM_TRATAMENTO`, `ATENCAO_RECAIDA`
- Quando: `QUANDO_ALCOOL`, `QUANDO_OUTRAS_DROGAS`, `QUANDO_APOSTAS`
- Abertura e frases (um par por estágio): `ABERTURA_*` e `FRASES_*` para `NAO_RECONHECE`, `RECONHECE_AS_VEZES`, `QUER_MUDAR`, `EM_TRATAMENTO`, `RECAIDA`
- Exemplo concreto: `EXEMPLO_ALCOOL`, `EXEMPLO_OUTRAS_DROGAS`, `EXEMPLO_APOSTAS`
- Evite: `EVITE_GERAL`, `EVITE_EXTRA_ALCOOL`, `EVITE_EXTRA_OUTRAS_DROGAS`, `EVITE_EXTRA_APOSTAS`
- Se reagir mal: `REAGIR_VIRA_BRIGA`, `REAGIR_NEGA`, `REAGIR_SE_AFASTA`, `REAGIR_MUDA_DE_ASSUNTO`, `REAGIR_PROMETE_PARAR`, `REAGIR_AINDA_NAO_TENTEI`
- Um passo: `PASSO_ESGOTADO`, `PASSO_MODERADO`
- Avisos: `AVISO_ALCOOL`, `AVISO_OUTRAS_DROGAS`, `AVISO_APOSTAS`
- Segurança: `SEGURANCA_PRIMEIRO`

### Layout da página de resultado
1. Acolhimento.
2. "O que joga a seu favor" + "Ponto de atenção".
3. Card "Sua primeira conversa" (com botão copiar).
4. "Um passo para você".
5. Botão "Começar o módulo 1 (grátis)".
6. Bloco de oferta (seção 9).
7. Contatos de emergência (link discreto).

---

## 7. Conteúdo dos módulos

Cada módulo tem: **texto curto (5–7 min de leitura)**, **exercício da semana**, **cenário de simulador** (quando houver) e **variações por problema** (blocos exibidos só se o familiar marcou aquele problema na Q3).

Armazenar o conteúdo como **arquivos markdown no repositório** (ex.: `content/familia/modulo-01.md`) com frontmatter:
```yaml
numero: 1
titulo: "..."
publicado: true
cenario_simulador: "primeira-conversa"   # opcional
bloqueado_em_modo_seguranca: false
audio: "audio/familia/modulo-01.mp3"     # opcional
video: ""                                # opcional, vazio no lançamento
```
Assim o fundador escreve e publica os próximos módulos sem mexer em código. Módulo com `publicado: false` aparece como "Chega em DD/MM".

**Mídia:**
- **Áudio:** se `audio` estiver preenchido, mostrar um player simples no topo do módulo ("Prefere ouvir? 5 min"). Lembrar a posição de onde parou. O áudio é a narração do mesmo texto (gravado por psicóloga parceira ou voz sintética `[PENDÊNCIA DO FUNDADOR]`).
- **Vídeo:** se `video` estiver preenchido, mostrar o player de vídeo vertical acima do texto; se vazio, não mostrar nada (sem espaço vazio). Os vídeos entram depois do lançamento, no formato dos reels explicativos da Margem.

---

### MÓDULO 1 — O que está acontecendo (e o que não é culpa sua) `[REVISÃO CLÍNICA]`

**Se você chegou aqui, provavelmente já tentou muita coisa.** Conversar, brigar, esconder dinheiro, ameaçar ir embora, fingir que não viu. E provavelmente está cansado(a). Este programa não vai te pedir para tentar mais forte. Vai te mostrar como tentar diferente.

**O que está acontecendo com {{apelido}}**
Álcool, outras drogas e apostas mexem com o sistema de recompensa do cérebro. Com o tempo, buscar aquilo vira quase automático, mesmo quando a pessoa sabe que está fazendo mal. Isso não é falta de caráter nem falta de amor por você. Também não tira a responsabilidade dela. Mas explica por que "é só parar" quase nunca funciona.

**O que não é culpa sua**
Você não causou isso. Você não consegue controlar sozinho(a) o que a pessoa faz. Mas você tem mais influência do que imagina. A forma como a família reage muda o ambiente em volta da pessoa, e isso pode tornar mais fácil ela escolher mudar.

**Os caminhos possíveis**
Não existe um único jeito certo. Para algumas pessoas, o caminho é parar completamente. Para outras, é reduzir ou usar com menos risco. Quem escolhe o caminho é a própria pessoa, de preferência com ajuda de um profissional. O seu papel não é escolher por ela. É deixar o caminho da mudança mais fácil e mais atraente do que o caminho do uso.

**O que costuma piorar as coisas**
- Sermão e cobrança constante.
- Ameaças que não se cumprem.
- Rótulos e xingamentos.
- Conversar quando a pessoa está sob efeito.
- Cobrir as consequências por ela (pagar dívidas, mentir para o trabalho, limpar a bagunça).

Ninguém faz isso por mal. Quase todo mundo faz, porque é o que parece certo na hora. Nas próximas semanas, você vai aprender alternativas.

**Você também importa**
Familiares de pessoas com esse problema costumam viver com muita ansiedade, tristeza e cansaço. Cuidar de você não é egoísmo: é parte do plano. Um familiar mais inteiro ajuda mais.

**O que vem pela frente**
Em 8 semanas: entender o padrão, conversar sem brigar, reforçar o que é bom, parar de amortecer o problema, cuidar da sua vida, convidar para ajuda no momento certo e lidar com recaídas.

**Exercício da semana**
1. **Um tempo só seu:** escolha 30 minutos nesta semana para algo que te faça bem e que não tenha a ver com {{apelido}}. Marque no app quando fizer.
2. **Observe sem reagir:** quando perceber o uso ou a aposta, em vez de discutir na hora, anote no app o que aconteceu (vamos usar isso no módulo 2).
3. **Se sentir que é a hora:** use o roteiro da primeira conversa, num momento calmo. Antes, ensaie no simulador.

**Variação — álcool:** se {{apelido}} bebe todos os dias ou em grande quantidade, parar de uma vez pode causar sintomas perigosos (tremores, confusão, convulsão). Qualquer plano de parar deve passar por um médico. Os psiquiatras da Margem podem ajudar.
**Variação — outras drogas:** sinais de emergência: dificuldade para respirar, não acordar, convulsão, confusão intensa, dor no peito. Ligue 192 (SAMU).
**Variação — apostas:** nas apostas, a vontade de "recuperar o que perdeu" faz parte do problema. Emprestar dinheiro para "cobrir o rombo" quase sempre alimenta o ciclo. Vamos falar de proteger o dinheiro da casa no módulo 5.

---

### MÓDULO 2 — Entender o padrão `[REVISÃO CLÍNICA]`

**O uso não acontece do nada.** Ele tem um antes, um durante e um depois. Quando você enxerga esse padrão, descobre onde dá para agir — e para de ser pego(a) de surpresa.

**O antes: gatilhos**
- **De fora:** lugares, horários, dias da semana, certas pessoas, dinheiro na mão.
- **De dentro:** estresse, tédio, solidão, ansiedade, raiva, vontade de comemorar.

**O que a pessoa "ganha" com isso**
Toda repetição tem uma função: relaxar, se divertir, se enturmar, fugir de um problema, sentir emoção. Entender a função não é concordar. É descobrir **o que a pessoa precisa** — e que talvez outra coisa possa oferecer.

**O depois: consequências**
O que acontece depois para ela? E para você? Quem arca com as consequências? Às vezes, sem perceber, a família amortece tudo e o problema fica "barato" para quem tem o problema.

**As suas reações**
Algumas reações, sem querer, facilitam o uso (resolver tudo por ela, pagar a conta, inventar desculpa). Outras empurram a pessoa para longe (brigar na hora, humilhar, expor). Não é para se culpar: é para enxergar.

**As janelas**
Existem momentos em que a pessoa está mais aberta: depois de uma consequência ruim, num momento de arrependimento, ou simplesmente num dia bom e calmo. Esses momentos são ouro. Você vai aprender a reconhecê-los.

**Exercício da semana: o diário de 7 dias**
Registre no app, sempre que puder (leva 1 minuto):
- Quando (dia e hora).
- O que aconteceu antes.
- O que você percebeu (sem precisar confirmar nada nem vigiar).
- Como você reagiu.
- Como foi depois.
- **Também registre os momentos bons**, quando a pessoa estava presente, sem uso, de bom humor. Eles são tão importantes quanto os outros.

No fim da semana, o app mostra um resumo: dias e horários mais comuns, gatilhos mais citados e momentos bons.

**Variação — álcool:** gatilhos comuns: fim do expediente, fim de semana, encontros, futebol, estresse no trabalho.
**Variação — outras drogas:** gatilhos comuns: festas, certas companhias, ficar sozinho(a), dinheiro recebido.
**Variação — apostas:** gatilhos comuns: dia de pagamento, jogos de futebol, madrugada, notificações no celular, uma perda recente.

**Implementação do diário:** formulário simples com os campos acima (todos opcionais, texto curto ou seleção), timestamp automático. Resumo semanal por agregação simples (sem IA no MVP).

---

### MÓDULOS 3 a 8 — estrutura (conteúdo a escrever) `[REVISÃO CLÍNICA]`

| Nº | Título | Objetivo | Exercício | Cenário do simulador | Modo segurança |
|---|---|---|---|---|---|
| 3 | Conversar sem brigar | Ensinar as 7 habilidades de comunicação (abaixo) | Reescrever 3 frases que costumam virar briga | `nega-o-problema` | liberado |
| 4 | Valorizar o que é bom | Reforçar momentos sem uso: atenção, companhia, gestos | Planejar 2 "recompensas" para momentos bons | `elogiar-sem-ironia` | liberado |
| 5 | Parar de amortecer | Deixar consequências naturais acontecerem (sem punir); não reforçar durante o uso. Em apostas: proteger o dinheiro da casa | Escolher 1 coisa que você vai parar de cobrir | `pedido-de-dinheiro` (apostas) / `pedido-de-desculpa-pro-trabalho` | **bloqueado** |
| 6 | A sua vida | Autocuidado e felicidade do familiar, independente da pessoa | Plano de 3 atividades suas | — | liberado |
| 7 | O convite | Reconhecer janelas e convidar para ajuda; deixar a opção pronta (profissional da Margem já escolhido) | Preparar o convite e o "plano B" se ela disser não | `convite-para-ajuda` | **bloqueado** |
| 8 | Recaídas e continuidade | Recaída como parte do processo; o que fazer depois | Plano para a próxima recaída | `depois-da-recaida` | liberado |

**As 7 habilidades de comunicação (base do módulo 3 e da rubrica do simulador):**
1. Ser breve.
2. Ser positivo(a): dizer o que quer, não só o que não quer.
3. Falar de comportamentos específicos, não da pessoa ("quando você chegou às 3h", não "você é irresponsável").
4. Nomear o próprio sentimento ("eu fico preocupado(a)").
5. Mostrar compreensão ("eu sei que tem sido difícil pra você").
6. Assumir uma parte ("talvez eu tenha cobrado demais").
7. Oferecer ajuda ("posso ir com você?").

---

## 8. Simulador de conversa

O diferencial do produto. Treinar com role-play é o centro desses programas; aqui a IA ocupa o papel de quem contracena.

### Funcionamento
1. O familiar escolhe (ou o módulo indica) um **cenário**.
2. Antes de começar, escolhe como {{apelido}} costuma reagir (pré-preenchido com a Q6): nega, se irrita, muda de assunto, promete parar, se fecha.
3. Conversa de até **8 mensagens do familiar** (configurável). A IA responde como {{apelido}}.
4. Ao final (ou quando o familiar clicar "terminar"), a IA sai do personagem e devolve **feedback estruturado**.
5. O familiar pode refazer (limite: **5 simulações por dia por usuário**, configurável, para controlar custo).
6. Usuários não compradores: **1 simulação grátis** do cenário `primeira-conversa`.

### Cenários (MVP: implementar `primeira-conversa` e `nega-o-problema`; os outros entram com os módulos)
Cada cenário é um arquivo de configuração: `id`, `titulo`, `contexto` (o que está acontecendo na cena), `objetivo_do_familiar`, `bloqueado_em_modo_seguranca`.

- `primeira-conversa`: momento calmo em casa; objetivo: abrir o assunto sem briga.
- `nega-o-problema`: a pessoa diz que "está tudo sob controle"; objetivo: manter a calma e falar do próprio sentimento.

### Prompt do sistema — personagem `[REVISÃO CLÍNICA]`
```
Você está em um treino de conversa para um familiar. Você interpreta {{apelido}},
uma pessoa com problema com {{problemas}}. Relação com o familiar: {{relacao}}.
Como essa pessoa costuma reagir: {{reacoes}}. Cena: {{contexto_do_cenario}}.

Regras do personagem:
- Reaja de forma realista e humana: com defesa, desconforto ou negação no começo,
  mas mude aos poucos SE o familiar usar boa comunicação (frases curtas, positivas,
  falando de sentimentos próprios, sem rótulo, oferecendo ajuda).
- Se o familiar acusar, rotular ou fizer sermão, reaja como uma pessoa real reagiria:
  fique mais defensivo(a) ou se feche.
- Nunca seja cruel, nunca use xingamentos pesados, nunca descreva violência,
  nunca descreva uso de substâncias em detalhe.
- Mensagens curtas (1 a 3 frases), linguagem coloquial brasileira.
- Não saia do personagem, EXCETO nas situações de segurança abaixo.

Segurança (tem prioridade sobre tudo):
- Se o familiar escrever algo que indique perigo real (violência acontecendo, ameaça,
  medo de agressão, ideia de suicídio sua ou da pessoa, overdose, emergência médica),
  SAIA do personagem imediatamente e responda apenas com:
  {"tipo":"seguranca","mensagem":"..."} — mensagem acolhedora e curta indicando
  que a segurança vem primeiro. O app mostrará os contatos de emergência.
```

### Prompt do sistema — feedback `[REVISÃO CLÍNICA]`
```
Saia do personagem. Avalie a conversa do familiar com base nas 7 habilidades:
ser breve; ser positivo; falar de comportamento específico; nomear o próprio sentimento;
mostrar compreensão; assumir uma parte; oferecer ajuda. Avalie também se evitou
rótulos, sermão e ameaças.
Tom: encorajador, específico, sem nota numérica. Responda SOMENTE com JSON:
{
  "o_que_funcionou": ["2-3 pontos, citando frases do familiar"],
  "o_que_tentar_diferente": ["1-2 pontos, com uma frase reescrita como exemplo"],
  "frase_para_levar": "uma frase pronta que o familiar pode usar na vida real"
}
```

### Regras técnicas
- **Não armazenar a transcrição** além da sessão por padrão. Guardar apenas: cenário, data, número de turnos e o JSON de feedback.
- Detecção de segurança em duas camadas: (1) a própria resposta da IA (`tipo: "seguranca"`); (2) checagem simples de palavras-chave na mensagem do familiar antes de enviar à IA (lista configurável: "me bateu", "vai me matar", "se matar", "suicídio", "overdose", "não acorda", "ameaçou", etc.). Qualquer gatilho → mostrar o card de segurança e pausar a simulação.
- Mostrar no topo do simulador: "Isto é um treino com IA. A IA não é {{apelido}} e não substitui um profissional."

---

## 9. Oferta e checkout

### Planos `[PENDÊNCIA DO FUNDADOR: preços finais]`
| Plano | O que inclui | Preço inicial sugerido |
|---|---|---|
| **Programa** | 8 módulos, simulador, check-ins, resumo da jornada | R$ 97 (pagamento único) |
| **Programa com acompanhamento** | Tudo do Programa + crédito para sessões com profissional parceiro da Margem escolhido pelo familiar | R$ 97 + valor do pacote de sessões (configurável) |

- Exibir o plano com acompanhamento como **recomendado**, com o texto: "Programas com apoio de um profissional costumam ter resultados melhores."
- Pagamento: **Pix**. Usar o gateway que o projeto já usar; se não houver, implementar a interface de pagamento atrás de um adaptador e deixar `[PENDÊNCIA DO FUNDADOR: escolher provedor de Pix com webhook]`.
- Liberação automática do acesso ao confirmar o pagamento (webhook).
- E-mail de boas-vindas com link de acesso.
- Texto visível: "Você tem 7 dias para desistir e receber o valor de volta." + fluxo simples de solicitação de reembolso (pode ser um botão que envia e-mail para a Margem no MVP).

### Liberação semanal
- Módulos 1 e 2: liberados na compra.
- Módulo n (n ≥ 3): liberado 7 dias após a liberação do módulo n−1 **e** somente se `publicado: true`.
- Se o módulo ainda não estiver publicado, mostrar "Chega em DD/MM" e avisar por e-mail quando liberar.

---

## 10. Check-in semanal e ligação com os profissionais

### Check-in (7 dias após a compra e depois semanalmente; lembrete por e-mail)
1. Você conseguiu fazer o exercício da semana? (Sim · Em parte · Não deu)
2. Houve alguma conversa com {{apelido}}? Como foi? (Não houve · Melhor que antes · Igual · Pior)
3. {{apelido}} demonstrou alguma abertura para buscar ajuda? (Sim · Talvez · Não)
4. Nas últimas duas semanas, com que frequência você se sentiu esgotado(a), ansioso(a) ou sem dormir direito? (0–3, igual à Q11)
5. **[SEGURANÇA]** Você teve medo de que {{apelido}} machucasse alguém ou a si mesmo(a)? (Não · Sim) → "Sim" recalcula `safety_mode` e mostra a página de segurança.
6. Algo mais que queira registrar? (texto opcional)

### Gatilhos para sugerir profissional (card no painel + e-mail)
| Gatilho | Card |
|---|---|
| Q4 do check-in ≥ 2 em **dois check-ins seguidos**, ou Q11 do diagnóstico = 3 | "Você tem carregado muito. Que tal uma conversa com um(a) psicólogo(a) só para você?" → psicólogos parceiros |
| Q3 do check-in = "Sim" | "Essa é uma janela. Deixe a ajuda pronta para {{apelido}}." → profissionais parceiros, com explicação de quando procurar psiquiatra (uso diário de álcool, mistura de substâncias, sintomas ao tentar parar) ou psicólogo |
| Conversa "Pior" em dois check-ins seguidos | "Às vezes a conversa empaca. Um profissional pode te ajudar a destravar." |
| `safety_mode = true` | Card fixo: plano de segurança + profissional |

O botão **"Falar com um profissional"** fica sempre visível no painel e leva ao fluxo de agendamento já existente da Margem (filtrar por profissionais que atendem familiares, se o cadastro permitir; senão, lista completa).

### Resumo da jornada (`/familia/programa/resumo`)
Texto gerado **sem IA** (template) a partir do diagnóstico, dos check-ins e do resumo do diário:
- Relação, problema(s), tempo, estágio atual.
- Como as conversas costumam ir.
- Padrões do diário (dias, horários, gatilhos mais citados).
- Evolução do bem-estar do familiar (série dos check-ins).
- Módulos concluídos.
- **Não incluir** transcrições do simulador nem textos livres, a menos que o familiar marque para incluir.

O familiar **revisa o texto e decide** se envia: botão "Enviar para o profissional" (anexar ao agendamento, se o fluxo existente aceitar observações) ou "Copiar".

---

## 11. Dados, privacidade e consentimento

O produto lida com **dados de saúde de uma terceira pessoa** (o ente querido) e dados emocionais do familiar. Tratar tudo como dado sensível (LGPD).

- **Minimização:** não pedir nome real, CPF, telefone ou endereço do ente querido. Apenas apelido opcional.
- **Consentimento de uso dos dados** no login (checkbox obrigatório, texto `[PENDÊNCIA DO FUNDADOR: validar com assessoria jurídica]`): "Concordo que a Margem armazene minhas respostas para personalizar o programa. Não vou informar dados que identifiquem a pessoa que eu amo."
- **Consentimento de comunicações (mala direta)** — checkbox **separado, opcional e desmarcado por padrão**: "Quero receber conteúdos e novidades da Margem por e-mail." Registrar data, hora e texto aceito. Todo e-mail de marketing com link de descadastro de um clique. E-mails transacionais (acesso, liberação de módulo, check-in, recibo) não dependem desse consentimento.
- **Exclusão automática de marketing para `safety_mode = true`:** quem sinalizou risco de violência não recebe e-mails de marketing, mesmo que tenha marcado o consentimento, enquanto o modo estiver ativo.
- Exportar a lista de contatos com consentimento para a ferramenta de e-mail marketing que o fundador escolher `[PENDÊNCIA DO FUNDADOR]`, levando junto apenas: nome, e-mail, data do consentimento e segmento genérico (ex.: "programa família — comprador / não comprador"). **Nunca exportar** respostas do diagnóstico, problema marcado, check-ins ou diário.
- Simulador: transcrição não armazenada por padrão (seção 8).
- Resumo da jornada só é compartilhado com o profissional por ação explícita do familiar.
- Opção "Apagar meus dados" no painel (exclusão real).
- Criptografia e controles de acesso conforme o que já existe no projeto. Nada desses dados em URLs, query strings ou logs.
- Não enviar e-mail ou outros identificadores para o provedor de IA; enviar apenas as respostas necessárias.

### 11.1 Discrição (o programa pode ser descoberto pela pessoa com o problema)
- **Assuntos e remetente de e-mail neutros**, sempre: ex. "Margem: seu acesso", "Margem: novo conteúdo disponível". Nunca usar no assunto ou na prévia palavras como bets, apostas, drogas, álcool, dependência, vício ou o apelido do ente querido.
- **Notificações** (se houver) com texto neutro, sem conteúdo do programa.
- **Botão "Sair rápido"** fixo em todas as telas do programa (e também acionável pela tecla Esc): substitui a página atual por um site comum (ex.: previsão do tempo) e evita que o botão "voltar" do navegador retorne ao programa.
- Título da aba do navegador neutro dentro da área do programa (ex.: "Margem").

---

## 12. Analytics (substitui a pesquisa prévia)

Registrar no sistema de eventos existente (ou em uma tabela simples):

`lp_visualizada` · `diagnostico_iniciado` · `diagnostico_concluido` · `seguranca_acionada` · `resultado_visualizado` · `roteiro_copiado` · `modulo1_iniciado` · `simulador_iniciado` · `simulador_concluido` · `checkout_iniciado` · `compra_concluida` (com plano) · `reembolso_solicitado` · `modulo_concluido` (n) · `diario_registro` · `checkin_enviado` · `card_profissional_exibido` · `profissional_clicado` · `agendamento_concluido` · `resumo_enviado` · `abertura_para_ajuda` (Q3 = Sim)

Painel simples (pode ser uma página admin protegida ou consulta SQL documentada) com o funil:
**LP → diagnóstico concluído → resultado → compra (por plano) → módulo 3 concluído → agendamento com profissional**, além da evolução média do bem-estar (Q4) e do % de "abertura para ajuda".

---

## 13. Fases de entrega e critérios de aceite

### Fase 1 — Captação (grátis)
LP, diagnóstico, login social (Google, Apple, Facebook) com `LOGIN_GATE`, consentimentos (dados + comunicações), página de segurança, resultado montado com blocos fixos, módulo 1 com áudio, simulador limitado (1 grátis, cenário `primeira-conversa`), modo discreto e "Sair rápido", eventos.
**Aceite:**
- Não existe nenhum fluxo de cadastro ou login por senha.
- Login com os três provedores funciona no celular (incluindo Safari no iPhone).
- Respostas do diagnóstico feitas antes do login são vinculadas à conta depois do login.
- Checkbox de comunicações vem desmarcado e é independente do consentimento de dados.
- Diagnóstico completo em celular em menos de 3 minutos.
- Respostas de segurança acionam a página de segurança e o `safety_mode`.
- Teste automatizado: para cada combinação de Q3 (problema principal), Q5, Q6 e `safety_mode`, a página de resultado é montada sem bloco faltando.
- Simulador sai do personagem quando há palavra de risco.
- Nenhum bloco contém as palavras proibidas da seção 3 (teste automatizado sobre o arquivo de blocos).

### Fase 2 — Venda e programa
Checkout Pix, webhook, liberação, painel do programa, módulo 2 + diário, liberação semanal via markdown, e-mails de boas-vindas e de liberação, reembolso.
**Aceite:**
- Pagamento confirmado libera acesso sem intervenção manual.
- Publicar um novo `modulo-03.md` com `publicado: true` o libera no prazo certo.
- Módulos 5 e 7 bloqueados para `safety_mode = true`.

### Fase 3 — Profissionais e acompanhamento
Check-in semanal + lembretes, gatilhos de profissional, botão fixo de profissional, resumo da jornada, plano "com acompanhamento", cenário `nega-o-problema`.
**Aceite:**
- Cada gatilho da tabela da seção 10 exibe o card correto.
- O resumo nunca inclui transcrição nem texto livre sem marcação explícita.
- "Apagar meus dados" remove tudo do familiar.

### Fase 4 — Admin
Painel de métricas (seção 12).

---

## 14. Landing page — texto `[revisar tom]`

**Título:** Você não precisa escolher entre ajudar quem você ama e cuidar de você.
**Subtítulo:** Um programa de 8 semanas para quem convive com alguém que tem problema com álcool, outras drogas ou apostas. Com treino de conversa com IA e profissionais da Margem ao seu lado.
**CTA:** Fazer o diagnóstico grátis (3 minutos)

**Para quem é** (chips clicáveis que pré-preenchem a Q3): Álcool · Outras drogas · Apostas / bets

**Como funciona**
1. **Diagnóstico grátis:** você conta a situação e recebe na hora um mapa e um roteiro para a primeira conversa.
2. **Um passo por semana:** conteúdos curtos, exercícios práticos e um diário para entender o padrão.
3. **Treine antes de falar:** ensaie conversas difíceis com a IA e receba dicas do que funcionou.
4. **Profissionais por perto:** quando precisar, fale com psicólogos e psiquiatras da Margem, para você ou para quem você ama.

**O que você vai aprender**
- Conversar sem brigar.
- Entender quando e por que o uso acontece.
- Parar de amortecer o problema sem abandonar a pessoa.
- Cuidar da sua vida no meio disso.
- Reconhecer a hora certa de convidar para ajuda.

**Sem julgamento.** Aqui ninguém é "viciado" e ninguém é culpado. Parar ou reduzir: o caminho é de cada um.

**Sua privacidade:** você não precisa dizer o nome de ninguém. Seus dados não são compartilhados sem a sua autorização.

**Perguntas frequentes**
- *Isso é tratamento?* Não. É um programa de apoio e aprendizado para familiares. Para tratamento, a Margem tem profissionais parceiros.
- *Garante que a pessoa vai aceitar ajuda?* Não. Ninguém pode garantir isso. O programa te ajuda a ficar melhor e a aumentar as chances de a pessoa querer mudar.
- *E se houver violência em casa?* Sua segurança vem primeiro. Veja os contatos de emergência [link].
- *Funciona para apostas?* Sim, com conteúdo específico, inclusive sobre proteger o dinheiro da casa.
- *Posso desistir?* Sim, em até 7 dias, com reembolso.

**Rodapé:** "Precisa de ajuda agora?" → `/familia/seguranca`

---

## 15. Pendências do fundador

- [ ] Nome final do produto.
- [ ] Texto final dos blocos do resultado (seção 6), escrito seguindo o manual da seção 16 e revisado pela psicóloga.
- [ ] Preços finais e composição do plano "com acompanhamento".
- [ ] Provedor de Pix com webhook (se o projeto ainda não tiver).
- [ ] Criar os apps de login: projeto OAuth no Google Cloud, conta Apple Developer (Sign in with Apple) e app na Meta (Facebook Login), com domínios e URLs de retorno da Margem.
- [ ] Registrar o domínio de envio de e-mail no serviço de encaminhamento da Apple (para usuários com "Ocultar meu e-mail").
- [ ] Escolher a ferramenta de e-mail marketing.
- [ ] Gravação ou voz sintética dos áudios dos módulos.
- [ ] Revisão clínica de todos os itens `[REVISÃO CLÍNICA]` por psicóloga parceira.
- [ ] Texto de consentimento e política de privacidade revisados juridicamente.
- [ ] Lista de profissionais parceiros que aceitam atender familiares.
- [ ] Conteúdo dos módulos 3 a 8 (um por semana, no ritmo da primeira turma).

---

## 16. Manual de escrita (para todo conteúdo fixo do programa)

Todo texto fixo (blocos do resultado, módulos, e-mails do programa) segue estes princípios. Eles também estão no prompt do simulador. **Não citar nomes de métodos, autores ou pesquisas no texto final.**

**O método**
1. A família tem influência real. O objetivo não é convencer a pessoa numa conversa, e sim mudar o ambiente para que mudar fique mais atraente do que continuar. Uma conversa boa é a que termina sem briga e deixa a porta aberta.
2. Comunicação positiva: toda frase pronta usa pelo menos 3 das 7 habilidades (ser breve; ser positivo; falar de um comportamento específico, nunca da pessoa; nomear o próprio sentimento; mostrar compreensão; assumir uma pequena parte; oferecer ajuda concreta).
3. Momento certo: só conversar com a pessoa sóbria e calma. As melhores janelas: logo depois de uma consequência ruim que ela mesma sentiu, num momento de arrependimento, ou num momento bom e tranquilo. Nunca durante ou logo depois do uso.
4. Reforçar o que é bom (presença, atenção, carinho nos momentos sem uso); não dar atenção intensa durante o uso; não punir, apenas deixar de amortecer as consequências.
5. Convite para ajuda de baixo compromisso: algo pequeno e experimental ("conversar uma vez com alguém"), nunca ultimato; o familiar se oferece para ir junto ou já tem uma opção pronta.
6. O familiar também importa: cuidar de si é parte do plano, independente do que a pessoa decidir.
7. Segurança vem antes de tudo: com risco de violência, nada de confronto; o foco vira segurança e apoio profissional.

**Postura da Margem:** redução de danos e abstinência são caminhos válidos; quem escolhe é a pessoa, de preferência com um profissional. Sem julgamento, sem culpa, sem moralismo.

**Linguagem**
- Português do Brasil, coloquial e caloroso, frases curtas, "você".
- Frases prontas devem soar como algo que uma pessoa real falaria em voz alta, numa respiração. Nada de linguagem de terapeuta ou de folheto.
- Nos blocos combináveis: sem gênero de quem responde nem da pessoa ("eu me preocupo", não "preocupada"); sem a relação ("filho", "amor"); usar `{{apelido}}`.
- Proibido: "viciado", "alcoólatra", "bêbado", "drogado", "jogador compulsivo", "dependente".
- Nunca prometer que a pessoa vai aceitar ajuda, parar ou melhorar. Sem diagnóstico, sem remédios, sem orientação médica (exceto os avisos de segurança).

**Checagem antes de publicar**
- Cada frase pronta usa pelo menos 3 das 7 habilidades?
- Alguma frase fala da pessoa ("você é", "você sempre") em vez de um comportamento?
- Alguma frase soa como ultimato ou promessa?
- Apareceu alguma palavra proibida?
- Uma pessoa cansada teria coragem de falar isso em voz alta?

