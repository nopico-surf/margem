# Briefing 01: banner de oferta e pagamento

Este briefing é só sobre pagamento. Ele estava na parte 1 (seção O1) e não foi implementado. Faça agora, completo.

## O que é
Um **banner de oferta** (componente `OfertaPrograma`) que explica como funciona o pagamento e leva ao checkout. No checkout, a pessoa escolhe o valor por botões e paga no Pix, **reaproveitando a tela de Pix que já existe nos planos dos profissionais**.

## Visual do banner
- Card com fundo verde-claro da Margem (o mesmo dos cards de destaque), cantos arredondados do design system, largura total da coluna.
- Hierarquia (briefing 00): título 20px semibold · texto 16px · preço em destaque 18px semibold · botão principal verde · link secundário · linha de apoio 14px em cinza.
- No celular: tudo empilhado. Os dois planos viram dois blocos, um embaixo do outro.
- Nunca em modal, pop-up ou barra fixa. No máximo um banner por tela. Some depois da compra. Nunca acima de conteúdo de segurança.
- Ícone: usar um ícone da Margem (não usar cifrão, cartão ou carrinho).

### Onde o banner aparece (4 variações do mesmo componente)

**a) LP, antes da FAQ** (seção nova, no padrão visual de cards da LP; não altera as outras seções)
- Título: **Quanto custa**
- Texto: "O diagnóstico e o módulo 1 são grátis. Para seguir com as 8 semanas, você escolhe quanto pagar, de R$ 47 a R$ 147, uma vez só, no Pix."
- O que inclui (lista curta): 8 módulos, um por semana, também em áudio · diário e escala da sua vida · treino de conversa com IA · plano de segurança · resumo para levar a um profissional.
- Dois mini-cards lado a lado (empilham no celular):
  - **Programa** · "de R$ 47 a R$ 147, você escolhe"
  - **Programa com acompanhamento** · selo "Recomendado" · "R$ 47 + a primeira sessão com um profissional parceiro, no valor social que você escolher"
- Botão principal: **"Começar pelo diagnóstico grátis"** (o caminho natural continua sendo o diagnóstico).
- Link secundário: "Já quero garantir meu acesso" → login → checkout → depois do pagamento, o diagnóstico (o programa precisa dele para se montar).
- Linha pequena: "Nem o valor mínimo cabe agora? Pedir acesso gratuito" · "Você tem 7 dias para desistir e receber o valor de volta."

**b) Resultado do diagnóstico** (posição: depois dos avisos, antes do bloco de emergência, como no item 23.2)
- Título: **Seu programa já está montado**
- Texto: "As próximas 7 semanas foram pensadas para a sua situação com {{apelido}}. Você pode começar o módulo 1 agora, de graça, e decidir depois."
- Lista com os títulos dos módulos 2 a 8 (cadeado discreto, cinza, sem vermelho).
- Botão: **"Escolher meu valor e continuar"** · link "Pedir acesso gratuito".
- Em `safety_mode`: o mini-card **com acompanhamento** vem primeiro e aberto, com o texto "Na sua situação, ter um profissional junto faz ainda mais diferença." O card fica **depois** do card de segurança e do plano de segurança, nunca antes.

**c) Módulo 1** (no fim, depois do exercício e antes de "Concluir o módulo 1")
- Título: **O módulo 2 chega em {{data_modulo_2}}**
- Texto: "Na próxima semana, você vai entender o padrão: quando o uso acontece, o que vem antes e o que vem depois. Para seguir, escolha quanto pagar."
- Botão: **"Escolher meu valor e continuar"** · link "Pedir acesso gratuito".
- Se o módulo 1 ainda não foi concluído, o card aparece igual; a compra não pula a liberação semanal.

**d) Módulo bloqueado** (abrir `/familia/programa/modulo/N` sem compra, ou tocar num módulo com cadeado no painel)
- Título do módulo + "O que você vai aprender" (2 itens, do texto do módulo) + o card com o mesmo texto da variação (b).
- Nunca mostrar a página vazia ou um erro.

### Checkout (`/familia/checkout`)
Uma etapa por tela, no padrão do diagnóstico.

**Etapa 1: escolher o plano**
- Dois cards selecionáveis:
  - **Programa** · o que inclui · "Você escolhe quanto pagar, de R$ 47 a R$ 147."
  - **Programa com acompanhamento** · selo "Recomendado. Nos estudos, os melhores resultados aparecem quando o familiar tem apoio de um profissional." · "Programa por R$ 47 + a primeira sessão com um profissional parceiro."
- Pré-selecionado: **Programa** (exceto em `safety_mode`, em que vem pré-selecionado o com acompanhamento).

**Etapa 2a: escolher o valor (plano Programa)**
- Texto: "Escolha quanto pagar. Quem pode pagar mais ajuda a manter o programa acessível para quem pode pagar menos. O conteúdo é o mesmo em qualquer valor."
- Botões: R$ 47 · R$ 67 · **R$ 97 (sugerido, pré-selecionado)** · R$ 127 · R$ 147. Mínimo 44px.
- Resumo fixo abaixo: "Pagamento único no Pix · 8 semanas de acesso · 7 dias para desistir com reembolso."
- Link: "Nem o valor mínimo cabe agora? Pedir acesso gratuito".

**Etapa 2b: escolher o profissional (plano com acompanhamento)**
- Lista de profissionais parceiros que atendem familiares, filtrada por horário em até 7 dias, no mesmo componente de agendamento que já existe.
- A pessoa escolhe o profissional, o horário e o valor da sessão na faixa social do profissional (como já funciona nas sessões).
- Total somado antes de pagar: "Programa R$ 47 + sessão R$ {{valor_sessao}} = R$ {{total}}".
- Se o fluxo de agendamento com pagamento ainda não estiver integrado: seguir o item 22.2 (paga o programa e vai direto à agenda).

**Etapa 3: Pix (reaproveitar a tela existente)**
- Procure no repositório a tela de pagamento Pix usada nos planos dos profissionais e reaproveite o mesmo componente: QR code, "Copiar código Pix", tempo de expiração e verificação automática do pagamento.
- Troque só os textos: título "Pague com Pix", "Abra o app do seu banco, escolha pagar com Pix e escaneie o código ou cole o código copiado."
- **Discrição no extrato:** o nome e a descrição do Pix aparecem no extrato do banco e podem ser vistos por outras pessoas da casa. Use só **"Margem"** como descrição, sem "família", "álcool", "apostas" ou "programa para familiares".
- Se o Pix expirar: "O código expirou. Gerar um novo" (mantém plano e valor).

**Etapa 4: confirmação**
- "Pagamento confirmado. As 8 semanas estão liberadas para você."
- "O módulo 2 chega em {{data}}. A cada semana, um novo módulo." (a liberação semanal continua valendo).
- Botão: "Voltar ao painel" (ou "Fazer o diagnóstico", se a compra veio direto da LP).
- E-mail de recibo com assunto neutro: "Seu recibo Margem". Sem o nome do programa no assunto.

### Pedir acesso gratuito
- Tela curta: "Ninguém precisa ficar de fora por causa de dinheiro. Conte em uma frase, se quiser, o que está acontecendo. A gente responde em até {{prazo}}." · campo opcional · botão "Pedir acesso gratuito".
- Não pedir comprovante de renda.
- [PENDÊNCIA DO FUNDADOR: quem libera e em quanto tempo]

### Reembolso
- Em "Configurações", link "Desistir e pedir reembolso" (até 7 dias depois da compra): uma tela de confirmação, sem pedir motivo obrigatório (campo opcional "Se quiser, conte o que não funcionou").

### Analytics
`oferta_vista` (variação: lp | resultado | modulo1 | bloqueado), `oferta_clicada`, `checkout_iniciado`, `plano_escolhido`, `valor_escolhido`, `pix_gerado`, `compra_concluida`, `acesso_gratuito_pedido`, `reembolso_pedido`.

### Critério de aceite
- O card nunca aparece em modal, nunca fixo e nunca acima de conteúdo de segurança.
- R$ 97 vem pré-selecionado; dá para escolher outro valor com um toque.
- A tela de Pix é a mesma dos planos de profissionais, com a descrição "Margem".
- "Pedir acesso gratuito" aparece em todas as variações e no checkout.
