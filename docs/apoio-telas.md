# Apoiar a Margem: fluxo, planos, campos e textos

Especificação do fluxo de apoio e de entrada de profissionais. Diz quais telas existem, que campos cada uma tem, que estados cobre, que textos usa e o que o backend espera. Layout e componentes são decisão de design.

Antes de desenhar, ler [`instrucoes-design.md`](instrucoes-design.md) e [`tom-de-voz.md`](tom-de-voz.md). As regras da seção 7 do [`CLAUDE.md`](../CLAUDE.md) valem aqui sem exceção.

Última atualização: 22/10/2026.

**O Figma é a referência das telas** (Experiência do produto, seção "Fluxo - Serviços publicos e redes de apoio", nó 1534:28280). Onde o Figma e este documento divergirem, vale o Figma. As telas de espera do pagamento, sucesso, código expirado e banco recusou ainda vão ser desenhadas; os textos delas aqui são provisórios.

---

## Os dois caminhos

**Quero fazer parte** (psicólogos, médicos e psiquiatras)

1. Escolhe a profissão.
2. Escolhe o plano base e, se quiser, um opcional para turbinar.
3. Envia o cadastro, já com os planos escolhidos. Nada é pago nesta etapa.
4. O Vitor analisa e aprova ou recusa, na mão.
5. Aprovado, entra na lista de espera, se houver fila.
6. Quando a vaga abre, recebe pelo WhatsApp o link pessoal de pagamento.
7. Paga pelo Pix Automático.
8. O perfil entra no ar sozinho quando o primeiro pagamento é confirmado.
9. Nos 7 dias seguintes ao primeiro pagamento, pode cancelar e receber o valor de volta.

**Quero apoiar** (qualquer pessoa)

- Escolhe o valor (livre, a partir de R$ 5), se é uma vez ou todo mês, e paga pelo Pix.
- Não se identifica como profissional. É doação, sem nota fiscal.

---

## Regras de negócio

- **Manual até o pagamento.** Cadastro, aprovação e fila são manuais (status mudado no editor de tabelas do Supabase). O perfil só entra no ar com o primeiro pagamento, mesmo que a pessoa não autorize o Pix Automático (o Vitor lembra a autorização na mão).
- **Link pessoal.** Só quem tem o link pessoal consegue pagar um plano de profissional. O preço sai do banco, nunca da tela.
- **O mês pago fica no ar inteiro.** Cada pagamento estende `pago_ate` até o mesmo dia do mês seguinte, e o perfil fica no ar até `pago_ate` mais 7 dias de tolerância. Cancelar ou não autorizar o Pix Automático não tira do ar antes disso. Se o mês seguinte não for pago, sai do site sozinho; se o pagamento cair depois, volta.
- **Mensalidade que falha.** O Asaas tenta de novo até 3 vezes em 7 dias, dentro da mesma tolerância.
- **Pagar de novo pelo link.** Faltando 7 dias ou menos para o fim do mês pago, ou depois dele, o link pessoal volta a cobrar. Quem tem o Pix Automático autorizado vê `plano_ja_ativo`, porque o Asaas cobra sozinho.
- **Estorno dos 7 dias.** Feito na mão no Asaas. O sistema marca o apoio como estornado e tira o perfil do ar sozinho.
- **Quem já está na plataforma** continua no ar sem pagar (`gratuito`) e recebe o link na mão, pelo Vitor.
- **Ordem dos perfis** no site e nas orientações nunca depende do plano.
- **Mínimo de R$ 5** por cobrança é regra do Asaas, não da Margem.

---

## Planos de profissional

Sempre mensal, com nota fiscal, por Pix Automático. O valor cobrado é o plano base mais o opcional, se houver. O catálogo está em `lib/apoio/planos.ts`.

**Preço por profissão.** Médico (inclui psiquiatra) paga mais, pela mesma régua do modelo anterior: no plano base, o dobro (a mensalidade pesa um percentual maior da sessão média dele, R$ 200 contra R$ 130); no opcional, o acréscimo que já existia. Médico nunca paga mais pelo mesmo anúncio: quando o opcional dele custa mais, a verba do anúncio dele sobe junto. O Figma mostra os preços de psicólogo; a tela usa os da profissão (`catalogoDaProfissao` no cadastro, a rota do link no link pessoal).

**Plano base** (obrigatório, define as vagas: pessoas em acompanhamento simultâneo que o profissional pode manter no perfil; por enquanto o limite é acompanhado na mão)

| Plano | Código | Vagas | Psicólogo | Médico ou psiquiatra |
|---|---|---|---|---|
| Prata | `prata` | 3 | R$ 19,99 por mês | R$ 39,99 por mês |
| Ouro | `ouro` | 8 | R$ 39,99 por mês | R$ 79,99 por mês |
| Diamante | `diamante` | ilimitadas | R$ 89,99 por mês | R$ 179,99 por mês |

**Opcional** ("Turbine sua presença", no máximo um, sem combinar)

| Opcional | Código | O que entrega | Psicólogo | Médico ou psiquiatra |
|---|---|---|---|---|
| Destaque | `destaque` | Um story fixo nos destaques do Instagram da Margem, com link para o seu perfil, e presença no carrossel mensal de quem atende pela Margem | + R$ 159,99 por mês | + R$ 289,99 por mês |
| Divulgação | `divulgacao` | Tudo do destaque, mais 1 conteúdo por mês no Instagram da Margem, em collab, impulsionado com anúncio pago | + R$ 369,99 por mês | + R$ 599,99 por mês |
| Divulgação Plus | `divulgacao_plus` | Tudo do divulgação, mais 2 conteúdos por mês, em collab, impulsionados com anúncio pago | + R$ 559,99 por mês | + R$ 879,99 por mês |

Exemplo: Prata + Destaque = R$ 179,99 por mês para psicólogo e R$ 329,98 para médico.

## Apoio de qualquer pessoa

| Frequência | Valores | Natureza |
|---|---|---|
| Uma vez ou todo mês | aberto, a partir de R$ 5, com atalhos de R$ 10, 25, 50 e 100 | doação, sem nota |

---

## Telas e textos

O que muda conforme o caso fica entre chaves. Botões e links no infinitivo, verbo + complemento. Carregamento dentro de botão mantém o texto e mostra o andamento só no visual.

### 1. Entrada

| Onde | Caminho | Texto |
|---|---|---|
| Rodapé de todas as páginas | Quero apoiar | Link: Apoiar a Margem. Leva à tela 3b. |
| Fim da página /profissionais | Quero fazer parte | Você é psicólogo, psicóloga, médico ou psiquiatra e quer atender pessoas pela Margem? · Botão: Cadastrar como profissional. Leva à tela 2. |

### 2. Profissão (só "Quero fazer parte")

| Elemento | Texto |
|---|---|
| Título | Qual é a sua profissão? |
| Opção 1 | Psicólogo ou psicóloga · Planos mensais com nota fiscal |
| Opção 2 | Médico ou psiquiatra · Planos mensais com nota fiscal |

### 3a. Plano base, turbinar e resumo

Textos e layout no Figma. Telas, na ordem:

1. **Escolha seu plano** (Prata, Ouro, Diamante). O subtítulo "Você escolhe o plano agora e só paga após a aprovação na plataforma" aparece só no fluxo de cadastro; para quem chega pelo link pessoal, não aparece.
2. **Turbine sua presença** (Destaque, Divulgação, Divulgação Plus), com "Continuar sem turbinar".
3. **Planos selecionados** (só no cadastro): plano base, opcional e valor total, com o aviso de que o link de pagamento chega quando o perfil for aprovado.

Quem chega pelo link pessoal vai da tela 2 direto para os dados do Pix (tela 4), com os planos escolhidos no cadastro já marcados e podendo trocar.

### 3c. Cadastro do profissional

| Elemento | Texto |
|---|---|
| Título | Quer atender pela Margem? |
| Plano escolhido | Plano {nome}, R$ {valor} por mês · Link: Trocar de plano |
| Apoio | Cada cadastro passa por uma análise. Se for aprovado, você entra na lista de espera e a gente chama quando abrir vaga na sua especialidade. Nada é cobrado agora. |
| Privacidade | Esses dados são usados para analisar seu cadastro e montar seu perfil. · Link: Ver como a gente cuida dos seus dados |
| Botão | Enviar cadastro |
| Sucesso | Título: Cadastro recebido · Texto: A gente analisa e responde pelo WhatsApp. |
| Erro | Não foi possível enviar seu cadastro agora. Tente de novo daqui a alguns minutos. |

**Campos**

| Campo | Quem vê | Tipo | Rótulo e ajuda |
|---|---|---|---|
| Nome completo | todos | texto | Nome completo |
| Registro | todos | texto | CRP (psicólogo) ou CRM (médico) |
| Abordagem | só psicólogo | lista suspensa | Abordagem · Ajuda: Aparece no seu perfil |
| Especialidade | só médico | lista suspensa | Especialidade · Ajuda: Aparece no seu perfil |
| Outra abordagem / especialidade | quando escolhe "Outra" | texto | Qual abordagem? / Qual especialidade? |
| RQE | médico, menos "Clínico geral, sem especialidade registrada" | texto | RQE · Ajuda: Registro de Qualificação de Especialista. Pelas regras do CFM, a especialidade só pode aparecer no seu perfil com o RQE. |
| WhatsApp | todos | telefone | WhatsApp · Ajuda: É por aqui que a gente responde sobre o seu cadastro |
| E-mail | todos | e-mail | E-mail · Ajuda: Para onde vai a nota fiscal, quando o plano começar |

**Lista de abordagens (psicólogo):** Terapia Cognitivo Comportamental · Psicanálise · Análise do Comportamento · Terapia de Aceitação e Compromisso (ACT) · Terapia Comportamental Dialética (DBT) · Gestalt-terapia · Abordagem Centrada na Pessoa · Fenomenológico-existencial · Psicologia Analítica (junguiana) · Terapia Sistêmica · Psicodrama · Outra

**Lista de especialidades (médico):** Psiquiatria · Medicina de Família e Comunidade · Clínica Médica · Neurologia · Medicina Preventiva e Social · Clínico geral, sem especialidade registrada · Outra

A abordagem é gravada em `abordagem` e a especialidade em `especialidade_rotulo`, que o site já usa. Os nomes da lista batem com os que já estão no banco.

### Mensagens que o Vitor envia pelo WhatsApp

| Momento | Texto |
|---|---|
| Aprovado, com fila | Oi, {nome}! Seu cadastro na Margem foi aprovado e você está na lista de espera. Quando abrir vaga na sua especialidade, eu te mando o link para pagar o plano {nome do plano}. |
| Não aprovado | Oi, {nome}. Obrigado pelo interesse na Margem. Neste momento, seu cadastro não entrou na rede. {motivo, se fizer sentido} |
| Vaga aberta (ou aprovado sem fila) | Oi, {nome}! Abriu vaga na Margem. Por este link você paga o plano {nome do plano} pelo Pix. Seu perfil entra no ar quando o pagamento for confirmado, e se quiser cancelar em até 7 dias, a gente devolve o valor. {link} |

O link pessoal abre a tela 4 já com o plano escolhido no cadastro.

### 3b. Valor (só "Quero apoiar")

| Elemento | Texto |
|---|---|
| Título | Quanto você quer apoiar? |
| Apoio | O apoio ajuda a manter a Margem gratuita para quem procura cuidado e informação. A Margem é uma empresa, não uma ONG, por isso o apoio não gera nota fiscal nem recibo para o imposto de renda. |
| Frequência | Uma vez · Todo mês (começa marcado em Uma vez) |
| Atalhos | R$ 10 · R$ 25 · R$ 50 · R$ 100 |
| Outro valor | Rótulo: Outro valor · Ajuda: A partir de R$ 5 · Valor em reais, até 2 casas decimais, sem máximo |
| Botão | Apoiar com R$ {valor} · no mensal: Apoiar com R$ {valor} por mês |

### 4. Dados para o Pix

| Elemento | Texto |
|---|---|
| Título | Seus dados para o Pix |
| Nome | Rótulo: Nome completo · Ajuda (só profissional): A nota fiscal sai nesse nome. · Até 100 caracteres. |
| CPF ou CNPJ | Rótulo: CPF ou CNPJ · Ajuda: O Pix precisa do CPF ou CNPJ de quem paga. Ele vai só para a empresa que processa o pagamento e não fica guardado na Margem. · Profissional, a ajuda continua: Pode ser o CNPJ da sua empresa, e a nota sai nesse documento. · Aceita o CNPJ novo com letras; no celular, abrir o teclado numérico. |
| E-mail (só profissional) | Rótulo: E-mail · Ajuda: Para onde vai a nota fiscal todo mês. Vem preenchido com o e-mail do cadastro. |
| Nome no banco | No app do banco, o Pix aparece no nome de VITOR GAUDIO DESENVOLVIMENTO DE SOFTWARE LTDA, a empresa responsável pela Margem. |
| Privacidade | Link: Ver como a gente cuida dos seus dados |
| Botão | Gerar Pix (não aceita segundo clique enquanto carrega) |

**Erros**

| Código | Onde | Texto |
|---|---|---|
| `nome_invalido` | no campo | Escreva seu nome completo, com até 100 caracteres. |
| `cpf_cnpj_invalido` | no campo | Não conseguimos conferir esse CPF ou CNPJ. Confira os números e tente de novo. |
| `email_invalido` | no campo | Não conseguimos reconhecer esse e-mail. Confira se ele está completo, com @. |
| `valor_abaixo_do_minimo` | no valor | Pelo Pix, o valor mínimo é R$ 5,00. |
| `dados_recusados` | geral | O sistema de pagamento não aceitou esses dados. Confira o nome e o CPF ou CNPJ e tente de novo. |
| `pagamento_indisponivel` | geral | Não foi possível gerar o Pix agora, porque o sistema de pagamento está fora do ar. Tente de novo daqui a alguns minutos. |
| `link_invalido` | página inteira | Esse link de pagamento não está mais valendo. Fale com a gente pelo WhatsApp para receber um novo. · Botão: Falar com a Margem no WhatsApp |
| `plano_ja_ativo` | página inteira | Seu plano já está ativo. · Botão: Voltar para o início |

### 5. Pix

| Elemento | Texto |
|---|---|
| Título | Seu Pix está pronto |
| Valor | R$ {valor}, uma vez · no mensal: R$ {valor} por mês |
| Celular | Copie o código e cole no app do seu banco, na opção Pix Copia e Cola. · Botão: Copiar código Pix · depois do toque: Código copiado |
| Computador | Abra o app do seu banco, escolha pagar com Pix e aponte a câmera para o QR code. · Link: Copiar código Pix |
| Mensal | No app do banco, você paga o primeiro mês e autoriza os próximos. Depois disso, o valor sai sozinho todo mês, e você pode cancelar quando quiser. |
| Prazo (só mensal) | Este código vale por 30 minutos. · Contador: Vale por mais {mm:ss} |
| Espera | Pode deixar esta tela aberta. Quando o pagamento chegar, ela muda sozinha. |

No celular, o código copia e cola fica em destaque (não dá para escanear a própria tela). No computador, o QR code. A tela consulta o status a cada poucos segundos enquanto está aberta.

### 6. Pagamento confirmado

| Caso | Título | Texto | Botão |
|---|---|---|---|
| Uma vez | Apoio recebido | Seus R$ {valor} chegaram. Obrigado por ajudar a manter a Margem gratuita para quem procura apoio. | Voltar para o início |
| Todo mês, pessoa | Apoio mensal ativado | O primeiro mês chegou, e os próximos saem sozinhos pelo Pix Automático. | Voltar para o início |
| Profissional | Plano {nome} ativado | Seu perfil já está no ar na Margem. Os próximos meses saem sozinhos pelo Pix Automático, e a nota fiscal chega no seu e-mail. Se quiser cancelar em até 7 dias, a gente devolve o valor. {Destaque e Divulgação:} Nos próximos dias, a gente chama você no WhatsApp para combinar o seu story. | Voltar para o início |

### 7. Não deu certo

| Status | Título | Texto | Botões |
|---|---|---|---|
| `expirado` | Esse código expirou | O código do Pix mensal vale por 30 minutos. Seus dados continuam preenchidos, e você pode gerar outro. | Gerar novamente |
| `recusado` | O banco não confirmou o Pix Automático | Isso pode acontecer quando a autorização não é concluída no app do banco. Se o primeiro mês já saiu da sua conta, fale com a gente antes de gerar outro Pix, para não pagar duas vezes. | Gerar novo Pix · Falar com a Margem no WhatsApp |

### 8. Como cancelar (trecho da tela 6, só no mensal)

| Elemento | Texto |
|---|---|
| Título | Como cancelar |
| Texto | Você pode cancelar quando quiser no app do seu banco, na área de Pix Automático. Não precisa falar com ninguém. |
| Só profissional, nos primeiros 7 dias | Para receber o valor de volta, fale com a gente pelo WhatsApp. Cancelar só no banco interrompe os próximos meses, mas não devolve o que já foi pago. |

---

## Backend

| Rota | Para quê | Estado |
|---|---|---|
| `POST /api/apoio/pix` | gera o Pix. Pessoa: `frequencia`, `valor`, `nome`, `cpfCnpj`. Profissional: `token` do link, `planoBase` e `opcional` (`null` = sem turbinar; ausentes, valem os do cadastro), `nome`, `cpfCnpj`, `email`. Devolve `apoioId` e `qrCode` (`payload`, `imagemBase64`, `expiraEm`). | pronta |
| `POST /api/apoio/link` | com `{ token }`, devolve `nome`, `profissao`, `planoBaseEscolhido`, `opcionalEscolhido`, o catálogo da profissão do cadastro (`planosBase` e `planosOpcionais`, preço em centavos e vagas) e o `email` do cadastro, para a tela 4 do profissional. Erros: `link_invalido` (404), `plano_ja_ativo` (409). | pronta |
| `GET /api/apoio/{id}/status` | status do apoio, para a tela 5 saber quando mudar | pronta |
| `POST /api/apoio/webhook` | avisos do Asaas; atualiza o apoio e o profissional ligado a ele | pronta |
| `POST /api/profissionais/cadastro` | grava o cadastro como `em_analise`, sem publicar nada. Corpo: `profissao` (`psicologo` ou `medico`), `planoBase`, `opcional` (`null` ou ausente = sem turbinar), `nome`, `registro`, `whatsapp`, `email`; psicólogo manda `abordagem` (e `abordagemOutra` quando escolhe Outra); médico manda `especialidade` (e `especialidadeOutra`) e `rqe`. Devolve `{ ok: true }`, inclusive quando o e-mail ou o registro já têm cadastro (o formulário não revela quem está na Margem). | pronta |

**Erros do cadastro (tela 3c)**

| Código | Onde | Texto |
|---|---|---|
| `nome_invalido` | no campo | Escreva seu nome completo, com até 100 caracteres. |
| `registro_invalido` | no campo | Confira o número do seu registro. |
| `abordagem_invalida` | no campo | Escolha uma abordagem da lista. Se a sua não estiver lá, escolha Outra e escreva qual é. |
| `especialidade_invalida` | no campo | Escolha uma especialidade da lista. Se a sua não estiver lá, escolha Outra e escreva qual é. |
| `rqe_invalido` | no campo | Escreva o número do seu RQE. Sem ele, a especialidade não pode aparecer no seu perfil. |
| `whatsapp_invalido` | no campo | Confira o número do WhatsApp, com DDD. |
| `email_invalido` | no campo | Não conseguimos reconhecer esse e-mail. Confira se ele está completo, com @. |
| `profissao_invalida`, `plano_invalido` | geral | Escolha sua profissão e um plano para enviar o cadastro. |
| `cadastro_indisponivel` | geral | Não foi possível enviar seu cadastro agora. Tente de novo daqui a alguns minutos. |

O WhatsApp do profissional fica em `telefone`, que nunca vai para o site. O botão "Agendar por WhatsApp" do perfil leva ao WhatsApp da Margem, como nos perfis que já existem.

O link pessoal que o Vitor manda é a página do profissional com o código no fim (o código está em `profissionais_cadastrados.token_apoio`). O endereço da página é decisão de design.

**Status que a tela recebe**

| Status | Tela |
|---|---|
| `aguardando` | 5 |
| `pago` | 6, uma vez |
| `ativo` | 6, mensal |
| `expirado`, `recusado` | 7 |
| `inadimplente`, `cancelado`, `estornado` | não aparecem neste fluxo (acontecem depois) |

**Status do profissional** (`profissionais_cadastrados.status`)

| Status | Quando | Aparece no site |
|---|---|---|
| `em_analise` | enviou o cadastro | não |
| `recusado` | não aprovado | não |
| `lista_espera` | aprovado, sem vaga | não |
| `aguardando_pagamento` | recebeu o link | não |
| `ativo` | pagou (com ou sem Pix Automático autorizado) | enquanto `pago_ate` mais 7 dias não passou |
| `gratuito` | já estava antes da cobrança | sim |
| `inadimplente` | mês do Pix Automático recusado | enquanto `pago_ate` mais 7 dias não passou |
| `cancelado` | estornado, ou cancelado na mão | não |

A coluna `ativo` continua como pausa manual (férias, por exemplo): com ela desligada, o perfil não aparece em nenhum status.

---

## Pendências fora do código

- Avisar os profissionais que receberam a mensagem "sem taxas ou comissões" antes da primeira cobrança.
- Validar o modelo com advogado de direito médico ou com orientação do CRP e do CRM. Cobrar a partir de número de contatos recebidos esbarra no Código de Ética do psicólogo (art. 2º, alínea p) e na Resolução CFM 2.460/2026.
- Um perfil atual mostra "Cannabis Medicinal e Saúde mental" como especialidade, que não é especialidade do CFM (Resolução CFM 2.336/2023).
- Nota fiscal automática: cadastrar os dados fiscais da LTDA no Asaas e pegar com o contador o código do serviço.

**Gerar novamente.** Quando o código expira, a tela chama `POST /api/apoio/pix` de novo com os mesmos dados (guardados na própria tela) e mostra o QR code novo. O apoio antigo fica como `expirado`; não há cobrança dupla.
