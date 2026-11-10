---
numero: 8
titulo: "Depois da resposta"
publicado: true
bloqueado_em_modo_seguranca: true
versao_por_checkin: true   # aceitou | recusou | recaida; se não houver check-in, mostrar o seletor "Como estão as coisas agora?"
audio: ""
video: ""
minutos: 5
---

<!-- [REVISÃO CLÍNICA] Conteúdo v2 de 10/11/2026 (rascunho do Gemini, revisão do Claude).

O check-in ainda não existe: o seletor começa sem nada marcado e a versão aparece quando a pessoa
escolhe. O encerramento aparece sempre.
O treino do "Novo convite" é o do módulo 5 ("convite-para-ajuda"), que ainda não tem arquivo.
Botões que ainda não têm ferramenta ficam como "Marcar como feito":
- valorizar: "Planejar"; meta: "Escolher minha meta"; pausa: "Escolher a data";
  frase: "Escolher minha frase". O "Voltar ao painel" do encerramento é o do rodapé do módulo. -->

:::escolha id=versao
Como estão as coisas agora?

- aceitou: {{apelido}} aceitou ajuda ou já está em tratamento
- recusou: {{apelido}} disse não, por enquanto
- recaida: {{apelido}} voltou a usar depois de ter parado ou diminuído
:::

:::se versao=aceitou
## Apoiar sem vigiar

Que bom que {{apelido}} deu esse passo. É normal a preocupação continuar: o medo não vai embora de uma vez.

Agora, o melhor apoio é estar por perto sem fiscalizar. Perguntar todo dia "foi na consulta?" ou "o que você falou lá?" pode pesar. O que é falado no atendimento é de {{apelido}}.

## Continue valorizando o que é bom

O que você aprendeu continua valendo. Perceba os momentos bons e valorize, do jeito simples de sempre.

Ir à consulta também merece reconhecimento, sem exagero: "Fico feliz que você tá cuidando disso."

## Se o profissional te chamar

Alguns profissionais convidam a família para uma conversa. Se acontecer, aceite: é uma chance de combinar como você pode ajudar.

E se houver um tropeço no caminho, lembre: voltar a usar acontece em muitos processos de mudança. Não apaga o que foi feito.

## Exercício
:::

:::se versao=recusou
## Não é o fim da conversa

Ouvir um não depois de tanta preparação dói. Mas um não hoje não é um não para sempre. Muita gente aceita ajuda depois de algumas tentativas, quando percebe que a porta continua aberta.

O que você mudou em casa continua fazendo efeito, mesmo sem um sim.

## Escolha o seu caminho

Você tem duas escolhas, e as duas são válidas:

- **Preparar um novo convite:** rever o módulo 5, ajustar as frases, ensaiar de novo e esperar a próxima oportunidade.
- **Dar um tempo no assunto:** focar nas suas metas e marcar uma data para pensar de novo.

Enquanto isso, continue valorizando o que é bom e devolvendo o que é da pessoa.

## Exercício
:::

:::se versao=recaida
## Respire antes de reagir

Ver {{apelido}} voltar a usar pode trazer raiva, medo e a sensação de que tudo foi em vão. Não foi. Voltar a usar acontece em muitos processos de mudança, e os dias bons que vieram antes continuam contando.

Sermão e cobrança agora tendem a afastar. O que ajuda é o que você já treinou.

## Volte ao que funciona

Espere um momento sem efeito e use uma frase curta, sem acusar: "Eu sei que tá difícil. Eu continuo aqui. Quer que eu veja um horário com quem te ajudou antes?"

Continue valorizando os momentos sem uso e devolvendo o que é da pessoa. Nada disso precisa recomeçar do zero.

## Procure de novo quem ajudou

Se {{apelido}} tinha um profissional, um grupo ou um serviço, esse é o primeiro lugar para voltar. E se você sentiu que perdeu o chão, busque apoio para você também.

## Exercício
:::

:::exercicio id=valorizar acao=marcar versao=aceitou
**Valorizar:** planeje 2 formas de valorizar momentos bons nesta semana, sem falar do tratamento.
:::

:::exercicio id=meta acao=marcar versao=aceitou
**Voltar para você:** escolha uma meta da sua escala para esta semana.
:::

:::exercicio id=novo_convite acao=simulador,marcar cenario=convite-para-ajuda versao=recusou
**Novo convite:** revise suas frases e ensaie no treino.
:::

:::exercicio id=pausa acao=marcar versao=recusou
**Ou uma pausa:** escolha uma data para voltar ao assunto. Avisamos você quando chegar.
:::

:::exercicio id=frase acao=marcar versao=recaida
**Uma frase:** escolha ou escreva 1 frase para a próxima conversa calma.
:::

:::exercicio id=retomar acao=profissional versao=recaida
**Retomar o apoio:** veja de novo o profissional ou o serviço que ajudou antes.
:::

## Até aqui

Você chegou ao fim de 8 semanas. Talvez as coisas tenham mudado bastante, talvez pouco. De qualquer jeito, você aprendeu a olhar para tudo isso de outro lugar.

Nada aqui é garantido, e mudança raramente anda em linha reta. Mas cada conversa sem briga, cada momento bom valorizado e cada cuidado com você deixou uma porta aberta.

O programa continua disponível para você rever quando quiser. E a Margem continua aqui.

@botao [Ver psicólogo parceiro](/profissionais)
