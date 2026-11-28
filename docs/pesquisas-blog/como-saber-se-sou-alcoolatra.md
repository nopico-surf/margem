# Pesquisa: "sou alcoólatra" (pauta "como saber se sou alcoólatra")

Data: 28/11/2026. Google Brasil (`google.com.br`, `hl=pt-BR&gl=br`, com o `uule` de São Paulo), sem login, no navegador do app. Localização mostrada no rodapé: "Brasil · 88063, Florianópolis - SC - Do seu endereço IP". O `uule` de São Paulo foi ignorado, como nas pesquisas anteriores, mas o país é o Brasil e os resultados vieram em português, de sites brasileiros.
A primeira página trouxe 8 resultados da web (um deles vídeo do YouTube). A segunda página (`&start=10`) só tinha um resultado no tema (a página inicial dos Alcoólicos Anônimos); o resto era sobre a palavra "sou" (Banco do Brasil, IFSULDEMINAS, prefeitura). A tabela fica com 9.
A palavra-chave pesquisada foi a variação `sou alcoólatra`, que foi a que teve dado no Trends. A frase da pauta, `como saber se sou alcoólatra`, aparece como título de 3 dos 9 resultados.
Guia resultante: `/blog/como-saber-se-sou-alcoolatra` (`lib/guias.ts`).
Formato dos títulos: perguntas (o anterior, overdose, usou afirmativos).

## Google Trends (passo 0)

Brasil, últimos 12 meses, pesquisa na Web, termo de referência `como parar de beber`. A primeira abertura deu erro 429; depois de abrir a página inicial do Trends, a segunda tentativa carregou normal.

| Lote | Referência | Candidata: média (razão) |
|---|---|---|
| 1 | 54 | como parar de usar crack: 0 (0) · como ajudar alguém que usa drogas: 0 (0) · recaída drogas: 0 (0) · como saber se sou alcoólatra: 0 (0) |
| 2 | 33 | parar de usar crack (variação): 0 (0) · ajudar dependente químico (variação): 0 (0) · recaída (variação, palavra solta): 62 (1,88) · **sou alcoólatra (variação): 1 (0,03)** |
| 3 | 54 | sou alcoolatra, sem acento (variação): 0 (0) · como saber se sou alcoolatra, sem acento (variação): 0 (0) · recaida alcool (variação): 0 (0) · como sair do crack (variação): 0 (0) |
| 4 (desempate, sem referência) | n/a | **sou alcoólatra: 6** · como saber se sou alcoólatra: 0 · recaída drogas: 0 · como parar de usar crack: 0 · como ajudar alguém que usa drogas: 0 |

`recaída` sozinha não conta: é a palavra solta que a skill manda não comparar (junta "recaída com o ex", recaída de doença etc.), e todas as variações de recaída ligadas a álcool e drogas deram 0. Fora ela, `sou alcoólatra` foi a única variação com média acima de zero contra a referência (0,03), e ganhou o lote sem referência. Por isso a pauta `como saber se sou alcoólatra` foi a escolhida.

Consultas relacionadas de `alcoólatra` (em ascensão): como ajudar uma pessoa alcoólatra (+80%), quem bebe todo final de semana é alcoólatra (+60%), amigo alcoólatra (+50%), o que é alcoólatra (+40%). As duas sobre ajudar alguém entraram como candidatas em `docs/pautas-blog.md`; as outras duas viraram perguntas deste guia.

## 10 primeiros resultados

| # | Resultado | Tipo | O que cobre | Onde fere o tom da Margem |
|---|---|---|---|---|
| 1 | [Hospital Santa Mônica: 8 sintomas do alcoolismo: como identificar os sinais e quando procurar ajuda](https://hospitalsantamonica.com.br/8-sintomas-do-alcoolismo-que-indicam-que-e-hora-de-procurar-ajuda/) (2018, revisado em jul. 2026) | Hospital psiquiátrico particular (blog) | Transtorno por uso de álcool, cenário brasileiro, como o álcool age no cérebro, fatores de risco, 8 sinais (perda de controle, tolerância, fissura, abstinência, prejuízos na família, trabalho, dinheiro e saúde, mudança de comportamento, esconder, continuar mesmo sabendo), alcoolismo funcional, diagnóstico. | "Doença crônica", "recuperação", texto muito longo antes de chegar nos sinais. Empurra pro tratamento especializado da casa. Nada de redução de danos. |
| 2 | [Grupo Recanto: Como saber se sou alcoólatra? Principais sinais e tratamentos](https://www.gruporecanto.com.br/blog/como-saber-se-sou-alcoolatra/) | Clínica de internação (blog) | Sinais (querer beber o tempo todo, falta de apetite, humor, cansaço, tolerância, agressividade), quantas cervejas por dia é alcoolismo, tratamento leve e grave, cuidados depois. | Sinais misturados com sintomas físicos vagos. "Como a Recanto pode te ajudar": vende internação. |
| 3 | [Alcoólicos Anônimos: A.A. é para você?](https://www.aa.org.br/a-a-e-para-voce/) | Grupo de apoio mútuo | As 12 perguntas do AA (4 ou mais "sim" indicam problema sério), contato por WhatsApp e telefone. | "Portadores da doença do alcoolismo", "nunca poderíamos beber normalmente": abstinência como único caminho. |
| 4 | [Einstein: Alcoolismo (glossário de saúde)](https://www.einstein.br/n/glossario-de-saude/alcoolismo) | Hospital (portal de saúde) | Definição (vontade incontrolável, dificuldade de parar, tolerância, abstinência), sintomas, causas, diagnóstico, tratamento, impacto, prevenção. | Neutro e técnico. Fala sobre a pessoa, não com ela. |
| 5 | [Portal Drauzio Varella: Como reconhecer os sinais do alcoolismo?](https://drauziovarella.uol.com.br/) (mar. 2026) | Portal de saúde | Pelo trecho: fissura, mentir ou esconder o consumo, guardar garrafas, irritação quando o assunto aparece. | Não lido: o navegador do app não tinha permissão pra abrir o domínio nesta execução automática. |
| 6 | [Medprev: Como saber se sou alcoólatra?](https://medprev.online/blog/como-saber-se-sou-alcoolatra/) (mar. 2026, revisado por psicólogo) | Rede de consultas populares (blog) | Diz que "alcoólatra" é termo estigmatizante e prefere "alcoolista"; beber socialmente, consumo moderado, consumo de risco, 8 sinais, quando buscar ajuda, FAQ (exagerar é alcoolismo? quem bebe uma vez por semana? parar sozinho?). | "Dependente" como rótulo, apesar da ressalva do termo. Bom na distinção entre beber socialmente, consumo de risco e dependência. |
| 7 | Vídeo: "Como saber se sou alcoólatra?" (YouTube, canal Dr Julio Pereira, neurocirurgião, 2024, 3:03) | Vídeo | Sinais da dependência e como o tratamento atua. Também citado na visão de IA. | Não transcrito. |
| 8 | [BVS Atenção Primária: Como identificar um paciente alcoólatra?](https://aps-repo.bvs.br/aps/como-identificar-um-paciente-alcoolatra/) | Governo / biblioteca de saúde (pergunta de profissional) | Diagnóstico feito por profissional com instrumentos: CAGE, AUDIT, ASSIST; critérios de dependência da CID (compulsão, perda de controle, abstinência, tolerância, abandono de outros prazeres, continuar apesar dos danos). | Escrito pra profissional: "usuário abusivo", "vício", "denúncia dos familiares". |
| 9 | [Alcoólicos Anônimos do Brasil (página inicial)](https://www.aa.org.br) (2ª página) | Grupo de apoio mútuo | Reuniões, história, contato. | Mesmo do item 3. |

## Visão geral de IA

Carregou. Começa acolhendo ("reconhecer isso já é um passo importante"), diz que alcoolismo é condição de saúde e não falha moral, aponta CAPS AD, psiquiatra ou clínico, AA, cuidado com parar de uma vez se bebe muito (tremor, confusão, convulsão pedem atendimento), primeiros passos (UBS ou CAPS, evitar gatilhos, levar alguém de confiança). Termina pedindo detalhes do consumo.

## As pessoas também perguntam

- O que corta a vontade de beber?
- Qual a média de vida de um alcoólatra?
- Quais são as 3 fases do alcoolismo?
- Quais são os 5 sinais de alcoolismo?

## Outras pessoas pesquisaram

Teste para saber se sou alcoólatra · Perfil de um alcoólatra · Sou alcoólatra o que fazer · A mente de um alcoólatra · Quem bebe todo final de semana é alcoólatra · Beber todos os dias é considerado alcoólatra · Pessoa alcoólica · Alcoolismo tratamento

## Lacunas (onde a Margem pode responder melhor)

- **Falar com quem pergunta.** Quase todos falam sobre "o alcoólatra" em terceira pessoa. Quem digita "sou alcoólatra" está se perguntando sobre si, muitas vezes com vergonha. O guia fala com essa pessoa e começa dizendo que perguntar já é olhar com cuidado pra si.
- **O rótulo.** Só a Medprev comenta que a palavra pesa. O guia explica o termo dos profissionais (transtorno por uso de álcool, leve, moderado ou grave) e diz que mais útil que o rótulo é olhar pros sinais, sem fugir da palavra que a pessoa usou.
- **Não é tudo ou nada.** Os textos tratam como "é ou não é alcoólatra". Ninguém explica que existe um meio do caminho (beber muito numa ocasião, consumo de risco) que pede atenção mesmo sem dependência, nem responde direto "quem bebe todo fim de semana" e "quem bebe todo dia".
- **Teste com honestidade.** As perguntas do AA e o CAGE aparecem soltos ou só pra profissional. O guia mostra o CAGE em linguagem simples, diz que é triagem e não diagnóstico, e aponta o AUDIT, da OMS.
- **Redução de danos e autonomia.** Ninguém diz que a pessoa pode decidir diminuir em vez de parar, nem fala de cuidados enquanto ela decide.
- **Segurança.** Poucos ligam a descoberta ao cuidado com a abstinência: quem bebe muito todo dia não deve parar de uma vez sem orientação.
- **Valor e sigilo.** Ninguém fala de quanto custa conversar com alguém, de que isso não leva a internação nem de sigilo. As clínicas vendem internação.
