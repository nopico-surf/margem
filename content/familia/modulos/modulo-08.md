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

O check-in ainda não existe. O seletor começa marcado pelo "Contar como foi o convite" do módulo 5
(Sim: aceitou; Não: recusou); com "Vou pensar" ou sem resposta, começa sem nada marcado e a versão
aparece quando a pessoa escolhe. O encerramento aparece sempre.
Cards do exercício (briefing M8, 11/11/2026), todos abrindo uma ferramenta:
- aceitou: "Planejar como valorizar" (C4) e "Criar minha meta" (C1), com ?modulo=8;
- recusou: "Rever meu convite" (C6 com o que já foi salvo; conclui ao salvar o passo 5) ou "Escolher a
  data" no próprio card (padrão 4 semanas). Fazer um marca o outro como "Não se aplica". O "Treinar o
  convite" é o do módulo 5 ("convite-para-ajuda"), que ainda não tem arquivo, então não aparece. O aviso
  por e-mail na data ainda não existe: a data só fica salva;
- recaida: "Escolher minha frase" ("Minhas frases", C3; conclui ao copiar uma frase ou salvar uma nova) e
  "Ver o profissional ou serviço de antes" (o salvo no convite; sem nada salvo, "Ver psicólogo parceiro").
Encerramento (C12): "Oito semanas depois", o resumo (@resumo) e os botões. O "Voltar ao painel" é o do
rodapé do módulo. Fica de fora até existir o resumo da jornada: "Baixar o resumo para o profissional". -->

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

:::exercicio id=valorizar acao=valorizar_m8 versao=aceitou
**Valorizar sem vigiar:** Planeje 2 jeitos de valorizar os momentos bons de {{apelido}} nesta semana, sem perguntar do tratamento.
:::

:::exercicio id=meta acao=meta_m8 versao=aceitou
**A sua meta desta semana:** Volte a cuidar de você: crie uma meta para a área da sua vida que mais precisa de cuidado.
:::

:::exercicio id=novo_convite acao=rever_convite,simulador cenario=convite-para-ajuda versao=recusou
**Preparar um novo convite:** Reveja a sua frase, treine de novo e espere a próxima hora certa.
:::

:::exercicio id=pausa acao=pausa versao=recusou
**Ou dar um tempo no assunto:** Escolha uma data para pensar de novo no convite. Até lá, o foco é você.
:::

:::exercicio id=frase acao=escolher_frase versao=recaida
**Uma frase para a próxima conversa:** Escolha ou escreva uma frase curta, sem acusar, para quando surgir um momento calmo com {{apelido}}.
:::

:::exercicio id=retomar acao=retomar versao=recaida
**Retomar o apoio:** Procure de novo o profissional ou o serviço que ajudou {{apelido}} antes, e também apoio para você.
:::

## Oito semanas depois

Você chegou ao fim das 8 semanas. Talvez muita coisa tenha mudado, talvez pouca. De qualquer jeito, você aprendeu a olhar para tudo isso de outro lugar, e a se incluir nessa história. Mudança raramente anda em linha reta, e nada aqui é garantido. Mas cada conversa sem briga e cada cuidado com você deixaram uma porta aberta.

@resumo

@botao [Ver psicólogo parceiro](/profissionais)
