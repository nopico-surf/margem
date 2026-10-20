# Apoiar a Margem: o que as telas precisam ter

Especificação do fluxo de apoio para quem vai desenhar. Diz quais telas existem, que campos cada uma tem, que estados precisa cobrir e que regras valem. Não diz como fica: layout, componentes e todo texto de tela são decisão de design.

Antes de desenhar, ler [`instrucoes-design.md`](instrucoes-design.md). As regras da seção 7 do [`CLAUDE.md`](../CLAUDE.md) valem aqui sem exceção.

O backend já existe: `app/api/apoio/pix` gera o Pix, `app/api/apoio/[id]/status` diz se foi pago, `app/api/apoio/webhook` recebe os avisos do Asaas. Os planos e valores estão em `lib/apoio/planos.ts`.

---

## Quem apoia e como

Qualquer pessoa pode apoiar: profissional ou não, cadastrado na Margem ou não.

| Público | Frequência | Valores | Natureza |
|---|---|---|---|
| Psicólogo | sempre mensal | R$ 20, R$ 40 ou R$ 80 | serviço (taxa de manutenção de software), com nota fiscal |
| Médico ou psiquiatra | sempre mensal | R$ 40, R$ 80 ou R$ 160 | serviço, com nota fiscal |
| Pessoa em geral | única ou mensal | aberto, a partir de R$ 5, com atalhos de R$ 10, 25, 50 e 100 | doação, sem nota |

O pagamento é só por Pix. O mensal é Pix Automático: a pessoa autoriza uma vez no app do banco e os meses seguintes saem sozinhos.

### O que cada plano de profissional significa

- **Mínimo:** obrigatório para quem já recebeu pelo menos 3 clientes pela Margem.
- **Intermediário:** obrigatório a partir de um número de clientes ativos (número ainda a definir).
- **Mais alto:** para quem quer o plano de mídia.

Quem tem menos de 3 clientes vindos da Margem continua na plataforma sem pagar, e pode apoiar se quiser.

Hoje essa regra é aplicada na mão: a tela deixa o profissional escolher qualquer um dos três, e quem confere e avisa é o Vitor. A tela pode explicar a regra, mas não bloqueia nada com base nela.

---

## As telas

### 1. Entrada

- Onde fica é decisão de design (header, rodapé, menu, página do profissional).
- Pode haver entradas diferentes por público, por exemplo uma na área de profissionais que já leva direto ao fluxo de profissional.

### 2. Escolha do público

- Três opções: psicólogo, médico ou psiquiatra, pessoa em geral.
- Se a entrada já definiu o público, esta tela é pulada.

### 3a. Plano do profissional

- Três planos, com os valores da tabela acima. Sem campo de outro valor.
- Sempre mensal: não existe opção de pagamento único para profissional.
- Cada plano pode ter nome e explicação (mínimo, intermediário, mídia).

### 3b. Valor da pessoa em geral

- **Frequência:** única ou mensal. Qual vem marcada por padrão é decisão de design.
- **Atalhos:** R$ 10, R$ 25, R$ 50, R$ 100.
- **Outro valor:** campo em reais, até 2 casas decimais, mínimo R$ 5, sem máximo.
- **Abaixo de R$ 5:** avisar na hora, antes de enviar. O mínimo é do Asaas, não da Margem.

### 4. Dados de quem paga

| Campo | Quem preenche | Regra |
|---|---|---|
| Nome completo | todos | obrigatório, até 100 caracteres |
| CPF ou CNPJ | todos | obrigatório, com dígito verificador válido. Aceita o CNPJ novo com letras: o campo precisa aceitar letras quando forem 14 caracteres. No celular, abrir o teclado numérico. |
| E-mail | só profissional | obrigatório. É para onde vai a nota fiscal. A pessoa em geral não vê esse campo. |

- O profissional pode pagar como pessoa física (CPF) ou pela empresa (CNPJ). A nota sai no nome e no documento informados.
- **Aviso de privacidade:** uma linha dizendo que os dados vão para a empresa que processa o pagamento, com link para `/privacidade`. Não precisa de caixa de aceite: os dados são usados só para fazer o pagamento.
- **Aviso sobre o nome que aparece no banco:** o app do banco mostra "VITOR GAUDIO DESENVOLVIMENTO DE SOFTWARE LTDA", não "Margem". Avisar antes, senão parece golpe. A tela também não pode dar a entender que a Margem é ONG ou entidade sem fins lucrativos.
- **Botão:** gera o Pix. Enquanto espera a resposta, fica em estado carregando e não aceita segundo clique.

**Erros que o servidor devolve nesta etapa** (cada um precisa de um texto):

| Código | Quando | Onde mostrar |
|---|---|---|
| `nome_invalido` | nome vazio ou longo demais | no campo |
| `cpf_cnpj_invalido` | documento com dígito errado | no campo |
| `email_invalido` | profissional sem e-mail ou e-mail sem formato de e-mail | no campo |
| `valor_abaixo_do_minimo` | menos de R$ 5 | no valor (a tela já deveria ter barrado) |
| `dados_recusados` | o Asaas recusou os dados (raro) | geral, pedindo para conferir |
| `pagamento_indisponivel` | Asaas ou banco fora do ar | geral, pedindo para tentar de novo depois |

### 5. QR code do Pix

A tela mais importante do fluxo.

- **No celular:** o código copia e cola em destaque, com botão de copiar e estado de "copiado". Não dá para escanear um QR code na própria tela.
- **No computador:** o QR code em destaque, com o copia e cola como alternativa.
- Mostrar valor e frequência.
- **Mensal:** explicar que no app do banco a pessoa paga o primeiro mês e autoriza os próximos, que saem sozinhos todo mês.
- **Prazo:** o QR code do mensal vale 30 minutos (pode ter contador). O da doação única vale por muito tempo e não precisa de contador.
- **A tela muda sozinha quando o pagamento cai.** O front consulta o status a cada poucos segundos enquanto ela está aberta. O texto de espera não pode narrar o sistema (nada de "verificando", "consultando").

### 6. Sucesso

Dois textos diferentes:

- **Única:** pagamento recebido.
- **Mensal:** apoio ativado, os próximos meses saem sozinhos. Incluir como cancelar (tela 8).

### 7. Não deu certo

| Status | O que aconteceu | O que oferecer |
|---|---|---|
| `expirado` | o QR code do mensal passou dos 30 minutos sem pagamento | gerar outro Pix com os mesmos dados |
| `recusado` | o banco recusou a autorização do mensal | gerar outro Pix com os mesmos dados |

Caso raro: a pessoa pagou o primeiro mês mas o banco não confirmou a autorização dos próximos. Hoje isso chega como `recusado`, igual a uma recusa comum. Ou o texto de recusa cobre os dois casos, ou o backend precisa passar a diferenciar.

### 8. Como cancelar (mensal)

- A pessoa cancela no app do banco, na área de Pix Automático, sem precisar falar com ninguém.
- Pode ser um trecho da tela de sucesso, não precisa ser tela própria.

---

## Status que a tela recebe

`GET /api/apoio/{id}/status` devolve só o status:

| Status | Tela |
|---|---|
| `aguardando` | 5, QR code |
| `pago` | 6, sucesso da única |
| `ativo` | 6, sucesso do mensal |
| `expirado`, `recusado` | 7 |
| `inadimplente`, `cancelado` | não aparecem neste fluxo (acontecem meses depois) |

---

## Decisões em aberto

1. Onde fica a entrada.
2. Nome e explicação de cada plano de profissional, e o número de clientes ativos do intermediário.
3. Se a frequência da pessoa em geral começa em única ou mensal.
4. Todos os textos das telas, avisos e erros acima.
