# Pesquisa: "cannabis medicinal"

Data: 13/11/2026. Google Brasil (`hl=pt-BR&gl=br`), sem login. A primeira página trouxe 8 resultados orgânicos (sem contar o bloco de lugares no mapa e o de imagens); o 9º e o 10º vieram da segunda (`&start=10`).
Guia resultante: `/blog/cannabis-medicinal` (`lib/guias.ts`).
Formato dos títulos: afirmativo (o anterior, lsd, usou perguntas).

## Google Trends (passo 0)

Brasil, últimos 12 meses, pesquisa na Web, termo de referência `como parar de beber`. A primeira abertura do Trends voltou com erro 429; depois de abrir a página inicial do Trends e esperar alguns segundos, as comparações carregaram. No lote 1 a linha "Média" apareceu na tabela do gráfico. Nos outros, a página abriu no layout estreito, sem a linha "Média": a média foi calculada a partir da tabela semanal do próprio gráfico (53 semanas), que no lote 1 bateu com a "Média" mostrada.

| Lote | Referência | Candidata: média (razão) |
|---|---|---|
| 1 | 33 | como parar de usar crack: 0 (0) · como ajudar alguém que usa drogas: 0 (0) · recaída: 61 (1,85) · internação involuntária: 17 (0,52) |
| 2 | 45,6 | alcoólicos anônimos: 48,7 (1,07) · comunidade terapêutica: 69,3 (1,52) · overdose o que fazer: 0,7 (0,02) · pode beber tomando remédio: 8,3 (0,18) |
| 3 | 21,5 | cocaína e álcool: 1,1 (0,05) · filho usando drogas: 0,2 (0,01) · como saber se sou alcoólatra: 0 (0) · **cannabis medicinal: 35,3 (1,64)** |
| 4 | 46,7 | ansiedade e álcool: 2,1 (0,04) · variações das frases com média 0: crack como parar 0,1 · sou alcoólatra 0,2 · ajudar quem usa drogas 0 |
| 5 | 21,5 | recaída drogas: 0,2 (0,01) · recaída álcool: 0 (0) · cannabis medicinal: 35,3 (1,64) · comunidade terapêutica: 32,8 (1,53) |

`recaída` teve a maior razão (1,85), mas a primeira página do Google pra essa palavra é quase toda música (Henrique & Juliano, Menos é Mais), recaída amorosa e uma notícia de celebridade: o volume do Trends vem disso, não de quem procura ajuda. O lote 5 testou as variações com o sentido da Margem (`recaída drogas`, `recaída álcool`) e as duas deram praticamente zero. Por isso `recaída` não foi escolhida. Venceu a segunda maior razão, `cannabis medicinal` (1,64), à frente de `comunidade terapêutica` (1,52 e 1,53). Sugestão pra próxima revisão da lista: trocar a candidata `recaída` por uma frase com o sentido de drogas que tenha volume, ou tirar da lista.

## 10 primeiros resultados

| # | Resultado | Tipo | O que cobre | Onde fere o tom da Margem |
|---|---|---|---|---|
| 1 | [Hospital Sírio-Libanês: Cannabis medicinal, o que é, para que serve e como funciona](https://hospitalsiriolibanes.org.br/blog/cannabis-medicinal/o-que-e-cannabis-medicinal) (23/10/2026) | Hospital privado | Diferença do uso recreativo (tabela), CBD e THC, sistema endocanabinoide, indicações com e sem evidência forte, formas de uso, linha do tempo da Anvisa até a RDC 1.015/2026, passo a passo do acesso, efeitos colaterais, FAQ. | Completo e cuidadoso, mas termina no núcleo do próprio hospital. Não fala de valor nem de acesso pelo SUS fora de SP. |
| 2 | [NIH/PMC: Medicinal Cannabis, history, pharmacology and implications for the acute care setting](https://pmc.ncbi.nlm.nih.gov/articles/PMC5312634/) (2017) | Artigo científico (EUA) | História, farmacologia, evidência por condição, regras dos EUA em hospital. | Técnico, em inglês traduzido, e a parte legal é dos EUA. |
| 3 | [HCX FMUSP: O que é e para que serve a cannabis medicinal?](https://hcxfmusp.org.br/portal/indicacao-cannabis-medicinal/) | Centro de ensino do HC da USP | "Zona verde" e "zona cinza" de indicações, quem pode prescrever (médicos e dentistas). Termina vendendo curso pra médicos. | Fala com médico, não com quem procura tratamento. |
| 4 | [Click Cannabis](https://clickcannabis.com/) | Empresa de telemedicina e importação (venda) | Consulta online por R$ 50, receita, autorização da Anvisa e importação em quatro etapas, depoimentos. | Promessa ("transforme sua saúde"), depoimentos de melhora em poucos dias. |
| 5 | [Mayo Clinic: Medical marijuana](https://www.mayoclinic.org/healthy-lifestyle/consumer-health/in-depth/medical-marijuana/art-20137855) | Portal de saúde (EUA, traduzido) | Condições aceitas nos estados americanos, efeitos colaterais (coração, memória, dependência, psicose, abstinência, gravidez), formas de uso. | Lei dos EUA, não serve pro Brasil. |
| 6 | [Droga Raia: Canabidiol](https://www.drogaraia.com.br/search?w=canabidiol) | Farmácia (loja) | Lista de produtos com "receita obrigatória"; no trecho do Google, um frasco de R$ 997 por R$ 598,20. | Loja. Mostra o tamanho do valor, mas não explica nada. |
| 7 | [gov.br: Solicitar autorização para importar produtos derivados de Cannabis](https://www.gov.br/pt-br/servicos/solicitar-autorizacao-para-importacao-excepcional-de-produtos-a-base-de-canabidiol) | Governo (Anvisa) | RDC 660/2022, autorização vale dois anos, a Anvisa não fornece o produto, conta gov.br bronze, prata ou ouro. | Nenhum: seco, mas correto. |
| 8 | [Dr. Paulo Casali: Cannabis medicinal, benefícios e funções](https://paulocasali.com.br/funcao-da-cannabis-medicinal-e-seus-beneficios/) | Blog de médico | Benefícios por condição (Alzheimer, Parkinson, dor, ansiedade, sono), efeitos colaterais, FAQ. | Exagera a evidência ("pode retardar a progressão" do Alzheimer, "opção eficaz"). |
| 9 | [DCI Unifesp: Cannabis medicinal, entre o estigma e o potencial terapêutico](https://dci.unifesp.br/assessoria-de-imprensa-e-jornalismo/materias-especiais/especial-cannabis-medicinal) | Universidade (reportagem) | Ciência da planta, CBD e THC, estigma, barreiras legais e desinformação. | Longo e voltado a quem já se interessa pelo tema. |
| 10 | Alcohol and Drug Foundation (Austrália): produtos de cannabis medicinal (3/8/2026) | ONG de álcool e drogas (traduzido) | Pelo trecho do Google: eficaz pra algumas pessoas com dor crônica, espasticidade na esclerose múltipla, náusea. O endereço tentado deu 404; registrado pelo trecho. | Não avaliado. |

Fontes de conferência fora dos 10: [Anvisa, perguntas e respostas da RDC 1.015/2026](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/anvisa-publica-perguntas-e-respostas-sobre-a-autorizacao-sanitaria-de-produtos-de-cannabis) (vigência desde 4/5/2026), [Anvisa, RDC 1.023/2026](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/anvisa-alinha-normas-a-regras-de-cannabis-aprovada-em-janeiro), [g1, 28/01/2026](https://g1.globo.com/saude/noticia/2026/01/28/entenda-como-e-e-como-fica-a-producao-de-cannabis-medicinal-no-pais-com-novas-regras-da-anvisa.ghtml) (cultivo só pra pessoas jurídicas, THC acima de 0,2% também pra doenças debilitantes graves, vias bucal, sublingual e dermatológica, manipulação com prescrição individual) e trechos do Google do texto da RDC 1.015 (THC acima de 0,2% contraindicado pra menores de 18 anos, gestantes e lactantes) e do CFF (manipulação de canabidiol isolado depende de regulamentação).

Na segunda página, fora dos 10: Cleveland Clinic, Wecann Academy (lista de produtos aprovados), Migalhas (acesso gratuito pelo SUS pela Justiça), Scielo (dor), Wikipédia, APEPI, post de Instagram sobre um projeto de lei de distribuição pelo SUS (não usado: não dava pra saber de qual casa legislativa), Cofen.

## Visão geral de IA

Apareceu. Definição (uso terapêutico de CBD e THC prescrito por médicos ou dentistas) e lista de usos: epilepsias refratárias infantis (Lennox-Gastaut e Dravet), dores crônicas e neuropáticas, espasmos da esclerose múltipla.

## Pessoas também perguntam

- O que é cannabis medicinal e para que serve?
- Quem pode comprar cannabis medicinal?
- O canabidiol é vendido em farmácias?
- Qual o risco de tomar canabidiol?

## Outras pessoas pesquisaram

Cannabis medicinal gotas; onde comprar; para que serve; brasil; valor; benefícios; sono; consulta.

## Lacunas que a Margem cobre

- Ninguém fala do valor como barreira, nem dos caminhos sem pagar: SUS em alguns estados, Justiça com a Defensoria Pública, associações de pacientes.
- Ninguém separa com clareza tratamento com cannabis de usar maconha por conta própria pra ansiedade ou insônia, nem fala de quem já usa maconha e quer saber se "é medicinal".
- Pouca gente fala dos riscos do THC (psicose em quem tem predisposição, dependência, direção) e de interação com outros remédios em linguagem simples.
- Ninguém alerta sobre óleo e goma vendidos sem registro em site e rede social.
- Quase nenhum resultado está atualizado com a RDC 1.015/2026 (só o Sírio-Libanês cita).
- Cultivo em casa aparece pouco: a Anvisa não liberou pra pessoa física, e a autorização pela Justiça é caso a caso.
- Nenhum resultado fala de sigilo, de contar ao médico sobre outras substâncias ou de onde buscar apoio sem julgamento quando o uso de maconha pesa.
