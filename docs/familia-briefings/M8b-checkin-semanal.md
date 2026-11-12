# Briefing M8b: check-in semanal, PHQ-4 e as pendências que sobraram

Pré-requisito: briefing 00. Este briefing fecha o que ficou de fora do M7 e do M8.

**Decisão do fundador:** o check-in sai do "depois". Ele é construído agora, **dentro do app, sem e-mail nenhum**. O PHQ-4 entra, com aviso explícito de que não é diagnóstico. A validação clínica virá de um psiquiatra, depois.

Por que não dá para adiar: o check-in é onde o programa descobre que algo deu errado em casa. A resposta "ficou tenso", da ferramenta de adiar do módulo 4, é o que liga o `caution_mode`. Enquanto o check-in não existe, `caution_mode` fica `false` para sempre e todas as perguntas de check-in já especificadas nos módulos 4, 5 e 6 não levam a lugar nenhum.

## 1. Onde o check-in aparece

Card no topo do painel, acima de tudo, quando houver um pendente:
- Título: **Seu check-in da semana**
- Apoio: "2 minutos"
- Botão: **"Fazer meu check-in"**

Fica pendente a cada 7 dias desde o último respondido, contados a partir do dia em que a pessoa começou o programa. Nunca aparece em vermelho e nunca diz "atrasado" (briefing 00, item 4). Sem e-mail, sem notificação: o card é o lembrete.

Rota: `/familia/programa/checkin`.

## 2. As telas, em ordem

Uma pergunta por tela, com barra "Passo X de 5".

**Tela 1: a sua meta**
Mostra o que já está salvo, sem perguntar nada: "Nesta semana você marcou {{feitos}} de {{planejados}} dias da sua meta." Botão "Continuar".
Com 0 dias marcados: "Nesta semana você não marcou nenhum dia da sua meta, e isso acontece. A semana nova começa agora."

**Tela 2: as ferramentas que a pessoa usou**
Só aparecem as perguntas das ferramentas que ela realmente abriu. Os textos já estão nos briefings dos módulos:
- Valorizar (M4): "Você conseguiu valorizar um momento bom nesta semana?" e, se sim, "Como {{apelido}} reagiu?"
- Adiar (M4): "Precisou adiar algum programa nesta semana?" · Não precisou · Sim, e foi tranquilo · **Sim, e ficou tenso**
- Convite (M5): "Você chegou a fazer o convite?" e, se sim, qual foi a resposta. Esta resposta é a que pré-marca o seletor do módulo 8.
- Problema em andamento (M6) e cuidado com o dinheiro (M6): as perguntas dos respectivos briefings.

Nenhuma é obrigatória. "Pular esta pergunta" sempre disponível.

**Tela 3: como você está**
Esta é a tela do PHQ-4. Especificação completa no item 3.

**Tela 4: segurança**
Pergunta própria, sempre, depois do PHQ-4. Especificação no item 4.

**Tela 5: devolutiva**
O que o programa diz de volta. Item 5.

## 3. PHQ-4

São 4 perguntas sobre as duas últimas semanas, 4 opções cada.

**Texto de abertura da tela, obrigatório e visível antes da primeira pergunta:**

> **Como você está**
> Estas 4 perguntas são as mesmas que muitos serviços de saúde usam para entender como alguém está se sentindo. Elas não dão diagnóstico, e o que você responder aqui não diz que você tem ou não tem alguma coisa. Servem para o programa saber como falar com você nesta semana, e para você acompanhar como está se sentindo ao longo do tempo. Quem pode dizer o que está acontecendo é um profissional, numa conversa.

**Enunciado:** "Nas últimas 2 semanas, com que frequência você se sentiu incomodado por:"

1. Sentir-se nervoso, ansioso ou tenso
2. Não conseguir parar ou controlar as preocupações
3. Sentir-se para baixo, deprimido ou sem esperança
4. Ter pouco interesse ou prazer em fazer as coisas

**Opções, iguais nas quatro:** Nenhuma vez (0) · Vários dias (1) · Mais da metade dos dias (2) · Quase todos os dias (3)

**O que o produto NUNCA mostra:** o número do escore, a palavra "leve", "moderado" ou "grave", e qualquer rótulo como "ansiedade" ou "depressão". O escore existe só por dentro, para escolher a devolutiva.

**Faixas, por dentro** (escore total de 0 a 12):
- 0 a 2: devolutiva comum.
- 3 a 5: devolutiva comum, mais uma linha sobre cuidar de si e o atalho para o módulo 7.
- 6 a 8: sugerir conversa com profissional, com o carrossel (briefing M56) logo abaixo.
- 9 a 12: a mesma sugestão, em tom mais direto, com o carrossel e com a indicação do CAPS e da UBS pelo SUS.

Guardar as 4 respostas e a data, sempre. Isso permite mostrar no futuro como a pessoa foi ao longo das semanas, em palavras, nunca em gráfico de pontuação.

## 4. A pergunta de segurança é separada, e isso é importante

O PHQ-4 **não tem pergunta sobre suicídio**. Ele é a versão curta, com 2 itens de ansiedade e 2 de humor, e o item de risco só existe na versão longa. Quem conta com ele para detectar risco fica sem detectar.

Por isso, uma pergunta própria, sempre, depois do PHQ-4 e independente do escore:

> "Nesta semana, você teve pensamentos de se machucar ou de não querer mais viver?"
> · Não · Sim, e passaram rápido · Sim, e voltaram várias vezes

- **Não:** segue para a devolutiva.
- **Qualquer "Sim":** o fluxo para aqui. Nada de mais perguntas, nada de devolutiva comum. A tela passa a ser a de acolhimento com o CVV 188 e o caminho do plano de segurança, com o mesmo texto que o programa já usa no `ALERTA_AUTOLESAO`. Liga `self_harm_alert`. "Sim, e voltaram várias vezes" liga também `self_harm_history`.

O check-in conta como respondido mesmo quando para aqui. A pessoa não precisa responder de novo depois.

## 5. A devolutiva, e o `caution_mode`

A devolutiva junta, em 3 frases no máximo: o que ela fez na semana, uma coisa que valeu, e o que vem no módulo da semana que vem. Sem nota, sem porcentagem, sem comparação com outras pessoas.

**"Sim, e ficou tenso", na pergunta de adiar, tem prioridade sobre o resto da devolutiva.** Mostra: "Que bom que você contou. Se o clima ficou tenso, deixe essa parte de lado por enquanto e veja o seu plano de segurança." com o link, e liga o `caution_mode`.

O que o `caution_mode` muda já está escrito nos briefings M4 e M5: a ferramenta de adiar não aparece, o card 3 do módulo 4 é trocado, e o cenário do convite fica bloqueado.

## 6. O "dar um tempo" não precisa de e-mail

O M8 previa um e-mail na data combinada. Troque por um card no painel, que aparece no dia:
- Título: **Hoje é a data que você combinou**
- Texto: "Você marcou hoje para ver como estão as coisas depois do tempo que vocês combinaram."
- Botão: **"Ver o que eu anotei"**

Mesma coisa para o plano B do módulo 5, que também estava esperando e-mail.

## 7. O que continua fora, de propósito

- **E-mail semanal e qualquer notificação.** O projeto não tem serviço de e-mail configurado, e o card no painel resolve.
- **"Baixar o resumo para o profissional".** O resumo do programa inteiro ainda não existe. O botão não aparece.

## 8. Os links dos grupos

Confirmados como oficiais:
- Al-Anon: `https://al-anon.org.br`
- Nar-Anon: `https://www.naranon.org.br`
- Meu SUS Digital: `https://meususdigital.saude.gov.br`
- Amor-Exigente: `https://amorexigente.org`

**Jogadores Anônimos sai da lista de grupos para familiares.** JA é a irmandade de quem aposta, não da família. Mandar um familiar para lá é mandar a pessoa para a sala errada. A irmandade de familiares é a Gam-Anon, e não foi possível confirmar grupos dela no Brasil.

No lugar, para apostas, o texto passa a ser:
> "Para famílias de quem aposta ainda não existe um grupo com encontros em todo o país. O Amor-Exigente recebe famílias de qualquer compulsão, inclusive apostas, e o CAPS da sua cidade atende de graça. Se quem aposta quiser um grupo, Jogadores Anônimos é o caminho, e é para a pessoa que aposta, não para você."

O link de JA pode ficar nessa frase, marcado como para a pessoa que aposta.

## 9. Critério de aceite

- O card do check-in aparece no painel a cada 7 dias e some ao ser respondido.
- Só aparecem as perguntas das ferramentas que a pessoa abriu.
- A tela do PHQ-4 mostra o aviso de que não é diagnóstico antes da primeira pergunta.
- Em nenhum lugar da tela aparece número de escore, "leve", "moderado", "grave", "ansiedade" ou "depressão".
- A pergunta de segurança aparece sempre, independente do escore do PHQ-4.
- Qualquer "Sim" na pergunta de segurança interrompe o fluxo, mostra o CVV e liga `self_harm_alert`.
- "Sim, e ficou tenso" liga o `caution_mode`, e a ferramenta de adiar some na semana seguinte.
- Nenhuma tela do check-in manda e-mail nem pede permissão de notificação.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
