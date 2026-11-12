# Briefing M56: o carrossel de profissionais no lugar do botão

Pré-requisito: briefing 00. Vale para os módulos 5 e 6 e para o painel. Não cria componente novo: usa o `CardProfissionais` que já existe em `components/conversa/CardProfissionais.tsx`.

Decisão tomada: todos os profissionais cadastrados atendem familiares. Não existe campo novo no cadastro e o carrossel não filtra por isso.

## 1. O que entra no lugar do quê

Hoje existem botões "Ver psicólogo parceiro" apontando para `/profissionais`, que é uma página do site principal. Em parte das telas o carrossel é melhor, e em parte não. A regra é o momento da pessoa.

**Vira carrossel** (a pessoa está decidindo com calma):
- Painel, seção "Profissionais" (`PainelCliente.tsx`, linha 204).
- Módulo 5, no fim do módulo, depois do exercício do convite.
- Módulo 6, no fim do módulo, depois do exercício do dinheiro.

**Continua botão** (o momento é pesado ou a pessoa está no meio de uma tarefa):
- `components/familia/ContatosEmergencia.tsx`, linha 101.
- Diário, depois de um relato de segurança (`diario.ts`, `profissionalBotao`).
- Escala, no cartão de nota muito baixa (`EscalaCliente.tsx`, linha 267).
- Modo segurança e modo cautela, onde o briefing M4 troca um card por "Ver psicólogo parceiro".

O motivo de não ser carrossel nesses quatro: rosto, foto e faixa de preço no meio de um momento de risco transformam cuidado em venda. Ali a pessoa precisa de um caminho curto, não de uma vitrine.

## 2. Como chamar o carrossel

Usar a variante `home`, que é a da captura que o fundador enviou: título, seletor de especialidade, faixa de preço em caixa cinza, fileira de cards. Sem descrição, sem o botão de serviços públicos.

```tsx
<CardProfissionais
  profissionais={profissionais}
  variante="home"
  id="familia-profissionais"
  origem="programa-modulo-5"
  titulo="Profissionais que podem atender você"
/>
```

**Um prop novo, `titulo`**, opcional, com o valor de hoje ("Profissionais que podem ajudar") como padrão. Por que: dentro de um programa para familiares, "Profissionais que podem ajudar" deixa a pergunta no ar, ajudar quem. Quem vai sentar na sessão é o familiar, e o título precisa dizer isso sozinho (briefing 00, item 2). Com "Profissionais que podem atender você", a tela não precisa de subtítulo.

A variante `home` hoje não recebe `origem`. Passar `origem` adiante para o `CardProfissionaisCompleto`, como a variante `guia` já faz.

Valores de `origem`, um por tela: `programa-painel`, `programa-modulo-5`, `programa-modulo-6`.

## 3. A mensagem do WhatsApp precisa dizer de onde a pessoa veio

Hoje, em `hrefWhatsappProfissional`: "Olá! Achei o(a) {nome} na Margem e gostaria de agendar uma sessão". Quem vem do programa é familiar, e a sessão é para essa pessoa, não para quem usa. Sem isso, o profissional pode responder achando que vai atender a outra pessoa, ou pedir para falar com ela.

Quando a `origem` começar com `programa-`, o texto passa a ser:

> "Olá! Achei o(a) {nome} na Margem. Estou fazendo o programa para familiares e gostaria de agendar uma sessão para mim."

Não escrever substância nem detalhe da situação: a mensagem sai do número da própria pessoa e ela não escolheu contar isso ainda.

## 4. Dois rótulos errados em `ExercicioSemana.tsx`

- `profissionais_semana` hoje é "Ver psicólogos parceiros com horário nesta semana". Não existe agenda, nem horário, nem disponibilidade no produto. É uma promessa que a tela não cumpre. Trocar por **"Ver psicólogos parceiros"** e deixar a chave apontando para o mesmo lugar de `profissional`, para não quebrar os arquivos de módulo que já usam o nome.
- `profissional` continua **"Ver psicólogos parceiros"**, no plural, porque a lista tem mais de um.

## 5. Concluir o exercício

Hoje o `ACAO_MARCA` conta o item como feito no clique do botão. Onde virar carrossel não existe mais um botão único, então o item conclui quando a pessoa **abre o perfil de um profissional ou toca em "Agendar por WhatsApp"**. Os dois eventos já existem no card: `card_profissional_clicado` e `agendar_whatsapp_clicado`.

Nas telas que continuam com botão, nada muda.

## 6. Critério de aceite

- Painel, módulo 5 e módulo 6 mostram o carrossel com o título "Profissionais que podem atender você", o seletor de especialidade e a faixa de preço.
- Emergência, diário depois de relato de segurança, escala com nota muito baixa e modo segurança continuam com botão, sem foto e sem preço.
- A mensagem do WhatsApp aberta a partir do programa diz que a pessoa está no programa para familiares e que a sessão é para ela.
- `agendar_whatsapp_clicado` e `card_profissional_clicado` chegam com a `origem` da tela, e dá para separar painel, módulo 5 e módulo 6.
- Nenhum texto promete horário, agenda ou disponibilidade.
- Com a lista vazia, o carrossel cai no estado `in-construction` que já existe, e a tela não fica quebrada.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
