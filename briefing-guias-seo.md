# Briefing: guias de SEO da Margem (/guias)

Este arquivo tem duas partes: as instruções de implementação e, logo abaixo, o conteúdo final das quatro páginas. O texto já foi revisado e aprovado. Implementar exatamente como está.

---

## Parte 1. Instruções

### Objetivo

Criar quatro páginas de conteúdo pra trazer tráfego orgânico do Google pra rede de profissionais a valor social da Margem. Quem busca "terapia barata" ou "psiquiatra barato" já quer ver gente e valor, então cada página mostra os profissionais dentro dela, num carrossel, em vez de só um botão.

### Exceções ao CLAUDE.md autorizadas pelo Vitor (valem só pra esta tarefa)

1. **Regras de copy da seção 7 não se aplicam a estas páginas.** Elas usam subtítulos (H2) escritos como perguntas e termos de busca como "dependência química" e "alcoolismo". Isso é intencional, pra SEO. Não reescrever, não corrigir, não suavizar nada do texto.
2. **Reaproveitar o que já existe no código, sem varredura no Figma.** Usar o card de profissional e o carrossel que já existem no site, além de layout, header, footer e tokens visuais. Não criar componente novo quando já existir um equivalente. Se o carrossel atual não aceitar filtro por tipo de profissional, adaptar o existente em vez de criar outro.

Continuam valendo: mostrar o plano em até 10 linhas e esperar o ok antes de escrever código; um arquivo por vez; zero invenção de texto; nenhuma chave sensível no cliente.

### Rotas

| Página | Rota |
| --- | --- |
| Terapia barata | /guias/terapia-barata |
| Psiquiatra barato | /guias/psiquiatra-barato |
| Álcool e outras drogas | /guias/psicologo-alcool-e-drogas |
| Como conferir o registro | /guias/como-saber-se-o-psicologo-e-registrado |

Uma rota dinâmica `app/guias/[slug]/page.tsx`, com `generateStaticParams`, renderizada no servidor. O texto precisa estar no HTML entregue, sem depender de JavaScript, pro Google ler.

O conteúdo fica num arquivo de dados (por exemplo `lib/guias.ts`), não espalhado em JSX.

### Ordem dos blocos em cada página

1. **Espaço da imagem no topo** (ver abaixo)
2. H1
3. Primeiro parágrafo
4. `[CARROSSEL TOPO]` quando a página tiver
5. Seções com H2 de verdade (`<h2>`), não texto em negrito
6. `[CARROSSEL FIM]` quando a página tiver
7. Perguntas frequentes, visíveis na página

Os marcadores `[CARROSSEL TOPO]`, `[CARROSSEL FIM]` e `[IMAGEM TOPO]` no conteúdo abaixo mostram onde cada coisa entra. Eles não são texto.

### Espaço da imagem no topo

- Uma área no topo de cada página, antes do H1, reservada pra uma imagem que o Vitor ainda vai mandar. Não é pra página ficar só texto.
- Proporção fixa, pra não pular o layout quando a imagem carregar: 16:9 no desktop e 4:3 no mobile.
- Usar `next/image`. Caminho esperado: `/public/guias/<slug>.webp`.
- Enquanto a imagem não existir, manter o espaço com o fundo neutro dos tokens que já existem. Não colocar ilustração, foto de banco de imagem nem texto no lugar.
- O texto alternativo (`alt`) fica num campo do arquivo de dados, vazio por enquanto. O Vitor preenche junto com a imagem.
- Quando a imagem existir, usar a mesma como imagem de Open Graph da página.

### Carrossel de profissionais

| Página | Carrossel topo | Carrossel fim | Quem aparece |
| --- | --- | --- | --- |
| Terapia barata | sim | sim | psicólogos |
| Psiquiatra barato | sim | sim | psiquiatras |
| Álcool e outras drogas | sim | sim | psicólogos e psiquiatras |
| Como conferir o registro | não | não | nenhum |

- Na página de álcool e outras drogas: se já existir no banco algum campo que indique que o profissional atende demanda de álcool e outras drogas, filtrar por ele. Se não existir, mostrar todos. Não criar campo novo no banco.
- Os profissionais vêm do mesmo lugar de onde a página de profissionais já busca hoje, com a mesma regra de quem aparece (status aprovado/ativo).
- Logo abaixo de cada carrossel, um link de texto pra lista completa, com estes textos exatos:
  - psicólogos: "Ver todos os psicólogos a valor social"
  - psiquiatras: "Ver todos os psiquiatras a valor social"
  - O link leva pra página de profissionais que já existe, com o filtro do tipo aplicado se a página já aceitar filtro.
- Se o carrossel atual já trata bem poucos itens, usar como está. Se não, me avisar no plano em vez de inventar um tratamento.

### Links e botões que não são carrossel

- Na página de álcool e outras drogas, o botão "Contar o que está acontecendo" leva pra tela de orientação da Margem (`/conversa` ou a rota equivalente que existir).
- Na página "Como conferir o registro", no fim, dois botões com os textos "Ver psicólogos a valor social" e "Ver psiquiatras a valor social", levando pra página de profissionais com o filtro do tipo.
- Os links internos entre os guias estão marcados no próprio texto, no formato markdown `[texto](/rota)`.

### SEO técnico

- `generateMetadata` em cada página com o title, a meta description e a URL canônica da tabela de cada página.
- JSON-LD do tipo `FAQPage` com as perguntas e respostas do bloco de perguntas frequentes de cada página, iguais ao texto visível.
- Incluir as quatro rotas no sitemap (`app/sitemap.ts`). Se o sitemap ainda não existir, criar. Incluir também as páginas de perfil dos profissionais, se forem públicas.
- Conferir o `robots.txt` e garantir que `/guias` está liberado.
- No footer, adicionar quatro links com estes textos exatos: "Terapia barata", "Psiquiatra barato", "Ajuda com álcool e drogas", "Como conferir o registro".

### Mixpanel

Quando alguém abrir um perfil de profissional a partir de um guia, registrar de qual guia a pessoa veio. Reaproveitar o evento que já existe pra abertura de perfil e só acrescentar a propriedade `origem` com o slug do guia. Não criar evento novo se já existir um.

### O que não fazer

- Não reescrever, completar ou "melhorar" nenhum texto.
- Não exibir as tabelas de metadados na página. Elas servem pro `generateMetadata`.
- Não criar estado de erro, loading ou vazio com texto inventado. Se o carrossel precisar de um texto pra quando não houver profissional, perguntar ao Vitor.
- Não instalar biblioteca nova de carrossel ou de SEO.

---

## Parte 2. Conteúdo das páginas

---

# Página 1: Terapia barata

| Campo | Conteúdo |
| --- | --- |
| Slug | terapia-barata |
| Title | Terapia barata: psicólogo online a partir de R$ 60 \| Margem |
| Meta description | Sessão com psicólogo registrado no CRP, de R$ 60 a 200, a valor social. Você escolhe quanto paga dentro da faixa. Veja como funciona. |
| H1 | Terapia barata com psicólogo registrado: como funciona o valor social |
| Carrossel | psicólogos |

[IMAGEM TOPO]

# Terapia barata com psicólogo registrado: como funciona o valor social

Cuidar da cabeça não deveria ser luxo. Mesmo assim, o valor das sessões é um dos motivos mais comuns pra muita gente adiar esse cuidado. Não é falta de vontade, é conta que não fecha. Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e quem decide quanto paga dentro dessa faixa é você.

[CARROSSEL TOPO: psicólogos + link "Ver todos os psicólogos a valor social"]

## O que é terapia a valor social?

Valor social é um valor reduzido que o profissional escolhe oferecer pra que mais gente consiga fazer terapia. O atendimento não muda: mesma formação, mesmo registro no Conselho Regional de Psicologia, mesmo sigilo. O que muda é quanto você paga.

## Quanto custa uma sessão de terapia na Margem?

De R$ 60 a R$ 200 por sessão. Você olha pro seu mês e escolhe um valor dentro dessa faixa. Se o orçamento apertar mais pra frente, dá pra conversar com o profissional sobre isso.

## Terapia barata é pior?

Não por ser mais barata. O que pesa no resultado é a formação de quem atende e o vínculo que vocês constroem. Antes de entrar na Margem, cada profissional passa por uma aprovação. E você pode conferir o registro de qualquer psicólogo sozinho, em poucos minutos. [Ver como conferir o registro de um psicólogo](/guias/como-saber-se-o-psicologo-e-registrado)

## Terapia online funciona?

Funciona. Estudos que juntaram dezenas de pesquisas encontraram resultados muito parecidos entre terapia por vídeo e terapia presencial, principalmente em ansiedade e depressão. No Brasil, o atendimento psicológico online é regulamentado pelo Conselho Federal de Psicologia, e o profissional precisa ter registro ativo no CRP.

Uma dica prática: se em casa não tem um canto com privacidade, muita gente faz a sessão no carro, numa praça mais vazia ou andando com fone de ouvido. O importante é você conseguir falar sem medo de ser ouvido.

## Com que frequência eu faria terapia?

Muita gente começa com uma sessão por semana. Isso se combina com o profissional, de acordo com o que você está vivendo e com o que cabe no bolso. Não existe um número certo de sessões que valha pra todo mundo.

## E se eu também precisar de psiquiatra?

Às vezes faz sentido ter os dois juntos: o psicólogo cuida da conversa e do que está por baixo do que você sente, o psiquiatra avalia se um remédio pode ajudar. A Margem também tem psiquiatras a valor social. [Ver psiquiatras a valor social](/guias/psiquiatra-barato)

## E se nem o valor social couber agora?

Acontece, e não diz nada sobre você. Pelo SUS, a porta de entrada é a Unidade Básica de Saúde do seu bairro, e o CAPS atende sem precisar de encaminhamento. Muitas faculdades de psicologia também têm clínicas-escola, com atendimento feito por estudantes supervisionados por professores. A fila costuma ser longa, mas é um caminho real.

Se você está num momento muito difícil e precisa conversar agora, o CVV atende 24 horas pelo 188.

[CARROSSEL FIM: psicólogos + link "Ver todos os psicólogos a valor social"]

## Perguntas frequentes

**Quanto custa terapia barata na Margem?**
De R$ 60 a R$ 200 por sessão, e você escolhe o valor dentro dessa faixa.

**Psicólogo a valor social tem registro no CRP?**
Tem. Valor social muda o valor da sessão, não a formação nem o registro. Você pode conferir o registro de qualquer psicólogo no Cadastro Nacional do Conselho Federal de Psicologia.

**Terapia online é confiável?**
É regulamentada pelo Conselho Federal de Psicologia e, segundo pesquisas, tem resultados parecidos com a presencial em muitas situações, como ansiedade e depressão.

**Dá pra fazer terapia pelo SUS?**
Dá. A porta de entrada é a Unidade Básica de Saúde, e o CAPS atende sem encaminhamento. A espera costuma ser maior.

---

# Página 2: Psiquiatra barato

| Campo | Conteúdo |
| --- | --- |
| Slug | psiquiatra-barato |
| Title | Psiquiatra barato: consulta online a partir de R$ 110 \| Margem |
| Meta description | Consulta com psiquiatra, de R$ 110 a 290, online e com receita digital, a valor social. Veja como funciona e como conferir o CRM do médico. |
| H1 | Psiquiatra barato: consulta com médico registrado no CRM, a valor social |
| Carrossel | psiquiatras |

[IMAGEM TOPO]

# Psiquiatra barato: consulta com médico registrado no CRM, a valor social

Uma consulta com psiquiatra particular pesa no bolso de muita gente, e a espera pelo SUS pode demorar. No meio disso, muita gente fica sem cuidado justamente quando mais precisa. Na Margem, a consulta com psiquiatra custa de R$ 110 a R$ 290.

[CARROSSEL TOPO: psiquiatras + link "Ver todos os psiquiatras a valor social"]

## O que faz um psiquiatra?

O psiquiatra é um médico especializado em saúde mental. Ele avalia o que você está vivendo, pode fazer um diagnóstico e, se fizer sentido, receitar e acompanhar um remédio. O psicólogo não receita remédio, e por isso os dois costumam trabalhar bem juntos.

## Quando vale procurar um psiquiatra?

Quando o que você sente está atrapalhando o sono, o trabalho, os estudos ou as relações há semanas. Quando a terapia sozinha não está dando conta. Quando o uso de álcool ou outras drogas ficou difícil de controlar. Ou quando você já toma um remédio e precisa de alguém acompanhando. Não precisa esperar chegar no limite.

## Preciso de encaminhamento pra consultar com psiquiatra?

No atendimento particular, não. Você pode marcar direto. Encaminhamento é o caminho do SUS, que explicamos mais abaixo.

## Consulta online com psiquiatra funciona?

Funciona e é permitida pelo Conselho Federal de Medicina, inclusive na primeira consulta. Em alguns casos o médico pode indicar um encontro presencial ao longo do tratamento.

## Psiquiatra online pode passar receita?

Pode. A receita digital tem a mesma validade da receita em papel e vem com assinatura eletrônica. Pra alguns remédios controlados, vale confirmar com a farmácia como ela recebe a receita antes de ir.

## Como é a primeira consulta?

A primeira costuma ser a mais longa. O médico vai querer entender sua história, como você está dormindo, comendo, trabalhando, se usa álcool ou outras drogas, e o que já tentou. Não existe resposta errada. Quanto mais sincera a conversa, melhor ele consegue te ajudar. Depois, os retornos dependem do tratamento.

## E o custo do remédio?

Se o remédio pesar no bolso, fale isso na consulta. Muitas vezes existe uma opção mais barata ou disponível na farmácia da Unidade Básica de Saúde. E nunca pare um remédio de uma vez sem conversar com o médico, porque alguns precisam ser reduzidos aos poucos.

Remédio não muda quem você é. Quando bem indicado, ele pode abrir espaço pra você voltar a se reconhecer.

## Psiquiatra e psicólogo juntos

Em muitas situações, o melhor resultado vem dos dois juntos: o remédio ajuda a estabilizar, a terapia ajuda a entender e mudar o que está por baixo. [Ver psicólogos a valor social](/guias/terapia-barata)

## Como saber se o psiquiatra é especialista?

Todo médico tem registro no CRM. Quem é especialista em psiquiatria também tem um número de RQE, que aparece na busca pública do Conselho Federal de Medicina. [Ver como conferir o CRM de um psiquiatra](/guias/como-saber-se-o-psicologo-e-registrado)

## Dá pra consultar com psiquiatra pelo SUS?

Dá. O caminho começa na Unidade Básica de Saúde: o médico da unidade avalia e, se precisar, encaminha pra psiquiatra ou pro CAPS. O CAPS também atende sem encaminhamento, indo direto na unidade. A espera costuma ser maior.

Em crise, procure uma UPA ou ligue para o SAMU no 192. Se precisa conversar agora, o CVV atende 24 horas pelo 188.

[CARROSSEL FIM: psiquiatras + link "Ver todos os psiquiatras a valor social"]

## Perguntas frequentes

**Quanto custa uma consulta com psiquiatra barato na Margem?**
De R$ 110 a R$ 290 por consulta.

**Precisa de encaminhamento pra ir ao psiquiatra?**
No particular, não. No SUS, o caminho começa na Unidade Básica de Saúde ou no CAPS.

**Psiquiatra online pode receitar remédio?**
Pode. A receita digital tem a mesma validade da receita em papel.

**Qual a diferença entre psiquiatra e psicólogo?**
O psiquiatra é médico e pode receitar remédio. O psicólogo conduz a terapia e não receita.

**Como saber se o psiquiatra é especialista?**
Pela busca pública do Conselho Federal de Medicina, que mostra o CRM e o RQE de especialista.

---

# Página 3: Álcool e outras drogas

| Campo | Conteúdo |
| --- | --- |
| Slug | psicologo-alcool-e-drogas |
| Title | Dependência química e álcool: terapia a valor social \| Margem |
| Meta description | Psicólogo e psiquiatra pra quem quer mudar a relação com álcool e outras drogas, a valor social e com sigilo. Sem julgamento e sem internação. |
| H1 | Psicólogo e psiquiatra para álcool e drogas, a valor social |
| Carrossel | psicólogos e psiquiatras (filtrar por álcool e outras drogas só se o campo já existir) |

[IMAGEM TOPO]

# Psicólogo e psiquiatra para álcool e drogas, a valor social

Se você está aqui, alguma coisa no seu uso de álcool ou de outras drogas, ou no de alguém que você ama, está pedindo atenção. Isso não faz de ninguém uma pessoa fraca. Muita gente usa pra aliviar algo que dói, cansa ou falta, e funciona por um tempo, até começar a cobrar caro. Na Margem, você encontra psicólogos e psiquiatras a valor social que conversam sobre isso sem julgamento.

[CARROSSEL TOPO: psicólogos e psiquiatras + links "Ver todos os psicólogos a valor social" e "Ver todos os psiquiatras a valor social"]

## Psicólogo ajuda quem tem dependência química?

Ajuda. A terapia não começa perguntando como parar, e sim o que o uso está resolvendo na sua vida. Quando isso fica claro, dá pra buscar outros jeitos de cuidar daquilo que está por baixo. Parar sem mexer no que está por baixo costuma levar de volta ao mesmo lugar.

## Preciso parar de usar pra começar?

Não. Você pode começar do jeito que está. Pra algumas pessoas, o caminho é parar de vez. Pra outras, é usar menos e com menos risco, o que se chama redução de danos. Os dois são caminhos de cuidado, e quem escolhe é você, junto com o profissional.

## Quando procurar um psiquiatra?

Quando o uso vem junto com ansiedade, tristeza ou insônia que não passam. Quando você já tentou diminuir e não conseguiu. E principalmente se você bebe muito há bastante tempo e quer parar: parar o álcool de uma vez, nessa situação, pode ser perigoso pro corpo. Com acompanhamento médico, isso fica mais seguro.

## Vou ser internado se procurar ajuda?

Não. Conversar com psicólogo ou psiquiatra não leva a internação. A lei brasileira trata internação como exceção, e na grande maioria das vezes o cuidado acontece com você seguindo a sua vida, trabalhando, morando onde mora.

## O que eu contar fica entre a gente?

Fica. Psicólogos e médicos têm sigilo profissional garantido pelos seus códigos de ética. Eles não avisam polícia, família nem trabalho sobre o que você conta. As exceções são raras e envolvem risco sério à vida.

## Quanto custa?

Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e a consulta com psiquiatra, de R$ 110 a R$ 290. Tudo online.

## Estou aqui por alguém que eu amo. E agora?

Acompanhar alguém que faz uso cansa e assusta. Você também merece cuidado, e não precisa esperar a outra pessoa aceitar ajuda pra buscar o seu. Uma terapia pra você pode ajudar a entender o que está ao seu alcance e o que não está.

## Grupos de apoio também ajudam

Alcoólicos Anônimos e Narcóticos Anônimos têm reuniões presenciais e online, sem custo. Pra familiares, existem o Al-Anon e o Nar-Anon. Muita gente combina grupo e terapia. Pelo SUS, o CAPS AD é especializado em álcool e outras drogas e atende sem encaminhamento.

Ninguém precisa ter a resposta inteira pra dar o primeiro passo.

Em emergência, como sinais de intoxicação grave, ligue para o SAMU no 192. Se precisa conversar agora, o CVV atende 24 horas pelo 188.

Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem.

[BOTÃO: "Contar o que está acontecendo" leva pra tela de orientação]

[CARROSSEL FIM: psicólogos e psiquiatras + links "Ver todos os psicólogos a valor social" e "Ver todos os psiquiatras a valor social"]

## Perguntas frequentes

**Psicólogo trata dependência química?**
Trata. A terapia ajuda a entender o que o uso resolve na sua vida e a buscar outros jeitos de lidar com isso.

**Preciso parar de beber ou usar pra começar a terapia?**
Não. Dá pra começar do jeito que você está, buscando parar ou usar com menos risco.

**Procurar psiquiatra para alcoolismo leva a internação?**
Não. Internação é exceção, e a maior parte do cuidado acontece sem sair da sua rotina.

**O psicólogo conta pra alguém sobre o meu uso de drogas?**
Não. Psicólogos e médicos têm sigilo profissional. As exceções são raras e envolvem risco sério à vida.

**Quanto custa terapia para dependência química na Margem?**
De R$ 60 a R$ 200 por sessão com psicólogo e de R$ 110 a R$ 290 por consulta com psiquiatra.

---

# Página 4: Como conferir o registro

| Campo | Conteúdo |
| --- | --- |
| Slug | como-saber-se-o-psicologo-e-registrado |
| Title | Como consultar o CRP do psicólogo e o CRM do psiquiatra \| Margem |
| Meta description | Antes de começar terapia ou consulta online, confira se o profissional é registrado. Leva poucos minutos e é de graça no site dos conselhos. |
| H1 | Como saber se o psicólogo ou o psiquiatra é registrado |
| Carrossel | nenhum |

[IMAGEM TOPO]

# Como saber se o psicólogo ou o psiquiatra é registrado

Quando o atendimento é barato e online, é normal bater a dúvida: será que essa pessoa é profissional mesmo? Desconfiar é um jeito de se cuidar. A boa notícia é que dá pra conferir sozinho, de graça, em poucos minutos.

## Como consultar o CRP de um psicólogo

1. Entrar no Cadastro Nacional de Profissionais de Psicologia, do Conselho Federal de Psicologia, em cadastro.cfp.org.br
2. Buscar pelo nome completo, pelo número do CRP ou pelo CPF
3. Conferir se o nome aparece com a inscrição ativa

O número do CRP tem a região antes da barra, como CRP 06/12345. Se quiser, dá pra conferir também no site do Conselho Regional do estado onde a pessoa é registrada.

## Como consultar o CRM de um psiquiatra

1. Entrar no site do Conselho Federal de Medicina e abrir a Busca por médicos
2. Buscar pelo nome ou pelo número do CRM e o estado
3. Conferir se o registro está ativo e se aparece a especialidade em psiquiatria com número de RQE

Todo médico precisa de CRM. O RQE é o registro de especialista. Um médico só pode se apresentar como psiquiatra se tiver o RQE em psiquiatria.

## Psicólogo online precisa de autorização especial?

Não mais. Desde 2024, a regra do Conselho Federal de Psicologia acabou com o cadastro separado pra atender online, chamado e-Psi. Hoje basta o psicólogo ter inscrição ativa no CRP.

## Psiquiatra pode atender online?

Pode. O Conselho Federal de Medicina permite a consulta online, inclusive a primeira, e a receita digital tem a mesma validade da de papel.

## Coach, terapeuta e psicanalista são a mesma coisa que psicólogo?

Não. Coach e terapeuta holístico não são profissões de saúde regulamentadas como a psicologia e a medicina. A psicanálise também não é uma profissão regulamentada por conselho próprio: um psicanalista pode ou não ser psicólogo ou médico. Se alguém se apresenta como psicólogo, precisa ter CRP. Se diz que é psiquiatra, precisa ter CRM e RQE.

## Sinais de alerta

- Não informa o número de registro ou fica desconfortável quando você pergunta
- Promete cura rápida ou resultado garantido
- Pede que você fale da sua vida num lugar sem privacidade, como grupo de mensagem
- Receita remédio sem ser médico

## E na Margem?

Antes de entrar na Margem, cada profissional passa por aprovação. Mesmo assim, você tem todo o direito de conferir o registro de quem vai te atender, e a gente incentiva isso.

[BOTÕES: "Ver psicólogos a valor social" e "Ver psiquiatras a valor social", levando pra página de profissionais com o filtro do tipo]

## Perguntas frequentes

**Como saber se um psicólogo é registrado?**
Pelo Cadastro Nacional do Conselho Federal de Psicologia, buscando pelo nome, pelo número do CRP ou pelo CPF.

**Como consultar o CRM de um médico?**
Na Busca por médicos do site do Conselho Federal de Medicina, pelo nome ou pelo número do CRM.

**O que é RQE?**
É o registro que mostra que o médico é especialista, como em psiquiatria.

**Psicólogo precisa de e-Psi pra atender online?**
Não. Desde 2024, basta inscrição ativa no CRP.

**Coach é psicólogo?**
Não. Coach não é uma profissão de saúde regulamentada.
