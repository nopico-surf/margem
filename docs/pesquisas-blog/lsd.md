# Pesquisa: "lsd"

Data: 11/11/2026. Google Brasil (`hl=pt-BR&gl=br`), sem login. A primeira página trouxe 8 resultados orgânicos (7 páginas e o primeiro vídeo do bloco de vídeos); o 9º e o 10º vieram da segunda (`&start=10`). Recarregada minutos depois, a primeira página veio com outra ordem e outros resultados ("Pesquisadores avaliam os efeitos do LSD", "1943: Era descoberto o LSD", "O uso de LSD e a Saúde Mental"): vale o retrato da primeira leitura, registrado abaixo.
Guia resultante: `/blog/lsd` (`lib/guias.ts`).
Formato dos títulos: perguntas (o anterior, clonazepam, usou afirmativos).

## Google Trends (passo 0)

Brasil, últimos 12 meses, pesquisa na Web, termo de referência `como parar de beber`. A primeira abertura do Trends voltou com erro 429; depois de abrir a página inicial do Trends, a comparação carregou, mas o gráfico não desenhou a tabela. As médias foram lidas da mesma resposta que o Trends usa pra montar o gráfico (`/trends/api/explore` + `widgetdata/multiline`), dentro da página do Trends, como na pesquisa de clonazepam.

| Lote | Referência | Candidata: média (razão) |
|---|---|---|
| 1 | 32 | como parar de usar crack: 0 (0) · como ajudar alguém que usa drogas: 0 (0) · recaída: 61 (1,91) · internação involuntária: 18 (0,56) |
| 2 | 45 | alcoólicos anônimos: 49 (1,09) · comunidade terapêutica: 68 (1,51) · overdose o que fazer: 0 (0) · pode beber tomando remédio: 9 (0,20) |
| 3 | 21 | cocaína e álcool: 1 (0,05) · filho usando drogas: 0 (0) · como saber se sou alcoólatra: 0 (0) · cannabis medicinal: 34 (1,62) |
| 4 | 9 | **lsd: 69 (7,67)** · ansiedade e álcool: 0 (0) |

Venceu `lsd`, com folga (a segunda foi recaída, 1,91). As frases com média 0 não tiveram variação testada: nenhuma variação curta chegaria perto de 7,67 sem virar palavra solta.

## 10 primeiros resultados

| # | Resultado | Tipo | O que cobre | Onde fere o tom da Margem |
|---|---|---|---|---|
| 1 | [Wikipédia: LSD](https://pt.wikipedia.org/wiki/LSD) | Enciclopédia | Origem e história, regulamentação e pesquisa, dose, overdose, efeitos, farmacocinética, flashback, psicose, química, produção, formas. | Técnico. Nada pra quem vai usar ou está passando mal. |
| 2 | [Brasil Escola: LSD, origem, efeitos e malefícios à saúde](https://brasilescola.uol.com.br/drogas/lsd.htm) | Portal escolar | Como surgiu, como é usado, o que causa, complicações, se causa dependência, se pode ser vendido. | "Malefícios", tom de aula. |
| 3 | Neurociência Descomplicada: "Como age o LSD no cérebro?" | Vídeo (YouTube) | Não transcrito. Pelo título: ação no cérebro. O bloco trouxe também BBC News Brasil (primeira "viagem" de LSD) e o mesmo canal sobre LSD e depressão. | Não avaliado. |
| 4 | Revista Intertox: "O uso de dietilamida do ácido lisérgico (LSD) e outras drogas..." (2024) | Artigo científico | Uso de psicodélicos em contextos socioculturais. | Acadêmico. |
| 5 | [Tua Saúde: LSD, efeitos, sequelas e como age no corpo](https://www.tuasaude.com/lsd/) | Portal de saúde | Como é consumido, como age, quanto tempo leva pra fazer efeito, efeitos no cérebro e no corpo, sequelas, por que não causa dependência. | "Sequelas" no título, sem redução de danos. |
| 6 | [The Balance: LSD, efeitos, duração, riscos e quando buscar ajuda](https://thebalance.clinic/pt/recursos/dependencia/drogas/lsd/) | Clínica de internação privada (venda) | Resumo, efeitos, duração, bad trip e sinais de emergência, efeitos persistentes, tolerância e uso problemático, tratamento, perguntas frequentes. | Página dentro de "dependência", empurra internação residencial privada. |
| 7 | Instituto Alma Viva: "Perfil Medicinal do LSD em Distúrbios Psiquiátricos" | Instituto (pesquisa com psicodélicos) | Histórico do LSD como droga experimental e pesquisa em saúde mental. | Foco só no uso terapêutico. |
| 8 | [Unicamp VivaMais: LSD (ácido lisérgico)](https://vivamais.cecom.unicamp.br/produto/lsd-acido-lisergico/) | Universidade (saúde do estudante) | Texto curto: perturbador do sistema nervoso, risco pela perturbação psíquica, flashback, lista de efeitos. Fonte: CEBRID. | Alarmista ("prejuízos psíquicos", "comportamentos agressivos"), sem caminho de cuidado. |
| 9 | É de Lei: folder de LSD (PDF, redução de danos) | ONG de redução de danos | Cuidados, contraindicações, "direito de saber o que está usando", lei. O link do PDF dava 404 na leitura; registrado pelo trecho do Google. | Nenhum: é a referência de tom mais próxima da Margem. |
| 10 | [Manual MSD: Alucinógenos (LSD, psilocibina, mescalina)](https://www.msdmanuals.com/pt/profissional/t%C3%B3picos-especiais/drogas-il%C3%ADcitas-e-intoxicantes/alucin%C3%B3genos) | Manual médico (profissional) | Início em 30 a 60 minutos, tolerância rápida, sem abstinência física, efeitos físicos, overdose rara com hipertermia, psicose persistente, TPAP e flashback, tratamento de suporte em ambiente calmo. | "Usuários", técnico. |

Na segunda página, fora dos 10: Central de Recuperação ("alucinógeno de alta periculosidade"), Veja Saúde, repositório da UFSC (possibilidade terapêutica), Hospital Santa Mônica ("tratamento para dependentes de LSD"), clínica de recuperação de SP (bad trip e riscos), reportagem do Domingo Espetacular no Facebook.

## Visão geral de IA

Apareceu. Definição (dietilamida do ácido lisérgico, "ácido" ou "doce"), descoberta por Albert Hofmann em 1938 e efeitos em 1943, origem no fungo do centeio, uso por via oral em papel, gotas, açúcar ou gelatina, ação nos receptores de serotonina 5-HT2A, efeito em 20 a 60 minutos com duração de 8 a 12 horas, efeitos perceptivos e físicos, bad trip e psicose em pessoas predispostas, sem dependência física clássica mas com tolerância rápida, ilegal e estudado em pesquisa pra ansiedade e depressão.

## Pessoas também perguntam

- Qual é o efeito da LSD?
- Por que o LSD é proibido?
- Por que o LSD não vicia?
- Qual a diferença entre LSD e MD?

## Outras pessoas pesquisaram

Lsd efeitos; lsd papel; lsd para que serve; lsd é injetável; lsd comprimido; lsd nome; lsd sigla; lsd mata; lsd vicia.

## Lacunas que a Margem cobre

- Só o É de Lei fala de redução de danos. Ninguém mais diz o que fazer antes de usar (lugar, companhia, não misturar), nem como cuidar de alguém numa bad trip.
- Ninguém fala do papel falso: o selo vendido como LSD pode ser NBOMe, que é bem mais perigoso. Nem do sinal de alerta do gosto amargo ou da língua dormente.
- As misturas perigosas (lítio, tramadol, outros estimulantes) aparecem pouco ou em linguagem técnica.
- "LSD vicia?" e "LSD mata?" são respondidos com alarme ou com "não vicia" seco. Falta dizer as duas coisas: não causa abstinência física, mas o uso pode pesar, e os riscos maiores vêm de acidentes, mistura e saúde mental.
- Ninguém diz com clareza quem tem mais risco (história pessoal ou de família de psicose ou bipolaridade).
- Ninguém fala de quem está perto (família, amigo na festa) nem de onde buscar apoio sem julgamento (CAPS AD, UBS, psicólogo, psiquiatra). A única saída oferecida é clínica privada.
- A lei aparece como "ilegal" e só. Falta explicar o que a Lei de Drogas prevê pra uso pessoal.
