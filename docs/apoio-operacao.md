# Apoiar a Margem: ir para o ar e operar

O que fazer fora do código para o pagamento funcionar em produção, e a rotina manual do dia a dia com os profissionais. O fluxo e as telas estão em [`apoio-telas.md`](apoio-telas.md).

Última atualização: 22/10/2026.

---

## Ir para o ar (uma vez)

Fazer só quando as telas estiverem prontas.

### 1. Token do webhook

No terminal da sua máquina, gerar um token novo (não reaproveitar o do `.env.local`):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Ele vai em dois lugares (passos 2 e 3) e nunca passa pelo chat.

### 2. Variáveis na Vercel

Projeto na Vercel, Settings, Environment Variables, ambiente Production, as duas marcadas como Sensitive:

| Nome | Valor |
|---|---|
| `ASAAS_API_KEY` | chave de produção do Asaas (www.asaas.com, Integrações, Chaves de API). Começa com `$aact_prod_`. Na Vercel vai como está, sem barra antes do `$` (a barra só existe no `.env.local`). |
| `ASAAS_WEBHOOK_TOKEN` | o token do passo 1 |

Depois de salvar, fazer um novo deploy para as variáveis valerem.

O site descobre se é sandbox ou produção pelo começo da chave. O `.env.local` continua com a chave do sandbox.

### 3. Webhook no Asaas de produção

www.asaas.com, Integrações, Webhooks, novo webhook:

| Campo | Valor |
|---|---|
| URL | `https://www.somosmargem.com.br/api/apoio/webhook` |
| Token de autenticação | o token do passo 1 |
| Versão da API | v3 |
| Fila | ativada |
| E-mail para avisos de falha | o seu |
| Eventos | todos de cobranças e todos de Pix Automático |

Se o webhook falhar 15 vezes seguidas, o Asaas pausa a fila. O e-mail de aviso serve para perceber isso.

### 4. Limite de tentativas na Vercel

Vercel, Firewall, nova regra de rate limit para estes caminhos:

- `/api/apoio/pix`
- `/api/apoio/link`
- `/api/profissionais/cadastro`

Sugestão: 10 requisições por minuto por IP, respondendo 429 acima disso.

Ficam de fora:

- `/api/apoio/webhook`, porque o Asaas pode mandar vários eventos juntos.
- `/api/apoio/{id}/status`, porque a tela do Pix consulta o status a cada poucos segundos.

### 5. Nota fiscal

- No painel de produção, cadastrar os dados fiscais da LTDA (Notas fiscais, Configurações): e-mail, Simples Nacional e acesso à prefeitura de São Paulo.
- Pegar com o contador o código do serviço "manutenção de software".
- Com esse código, falta ligar a nota automática nas assinaturas dos profissionais. É uma mudança pequena no backend.

### 6. Trocar a chave do sandbox

A chave do sandbox passou pelo chat em 20/10/2026. Gerar outra no painel do sandbox e atualizar o `.env.local`, com a barra antes do `$`.

### 7. Primeiro teste real

1. Doação única de R$ 5, com os seus dados.
2. Plano Prata sem opcional (R$ 19,99), com um cadastro de teste seu, pelo link pessoal.
3. Conferir se o perfil de teste entrou no ar e se o painel do Asaas mostra os dois pagamentos.
4. Estornar o plano no Asaas e conferir se o perfil saiu do ar e se o Pix Automático foi encerrado.
5. Apagar o cadastro de teste.

Esse teste confirma o que o sandbox não deixou testar: a ativação real do Pix Automático e os avisos do Asaas chegando no site.

---

## Rotina com os profissionais

As mudanças são feitas no editor de tabelas do Supabase (`profissionais_cadastrados`) ou com os SQL abaixo, no SQL Editor. Trocar `{id}` pelo id do profissional.

### Ver quem pediu para entrar

```sql
select id, nome, especialidade, abordagem, especialidade_rotulo, rqe, registro_profissional, plano_base_escolhido, opcional_escolhido, telefone, email, cadastrado_em
from profissionais_cadastrados
where status = 'em_analise'
order by cadastrado_em;
```

### Aprovar e colocar na lista de espera

```sql
update profissionais_cadastrados set status = 'lista_espera', aprovado_em = now() where id = '{id}';
```

### Recusar

```sql
update profissionais_cadastrados set status = 'recusado', observacao_interna = '{motivo}' where id = '{id}';
```

### Abriu vaga: mandar o link

```sql
update profissionais_cadastrados set status = 'aguardando_pagamento' where id = '{id}';
select nome, telefone, 'https://www.somosmargem.com.br/plano#' || token_apoio as link
from profissionais_cadastrados where id = '{id}';
```

O link é `https://www.somosmargem.com.br/plano#` seguido do `token_apoio`. O código vai depois do `#` para não chegar ao servidor nem às ferramentas de medição (a página `/plano` não carrega Mixpanel nem GTM). Cada profissional tem um código só, criado sozinho no cadastro; o link vale enquanto o status for `aguardando_pagamento` ou `gratuito`, sem prazo. Com o plano já pago, ele mostra "Seu plano já está ativo".

Para quem já está no ar sem pagar (`gratuito`), o link funciona sem mudar o status. O perfil continua no ar até o primeiro pagamento e depois vira `ativo`. Os links de todos de uma vez:

```sql
select nome, telefone, 'https://www.somosmargem.com.br/plano#' || token_apoio as link
from profissionais_cadastrados where status = 'gratuito' and ativo order by nome;
```

Para conferir as telas sem pagar, em desenvolvimento: `https://localhost:3000/plano#previa-{tela}`, com `{tela}` entre `base`, `opcional`, `resumo`, `dados`, `pix`, `expirado`, `recusado`, `pago_sem_autorizacao`, `tudo_feito`, `link_invalido` e `plano_ja_ativo`.

### Depois do pagamento

Quando o pagamento cai, o perfil entra no ar sozinho, mesmo que a pessoa não tenha autorizado o Pix Automático. Cada pagamento estende `pago_ate` até o mesmo dia do mês seguinte, e o perfil fica no ar até `pago_ate` mais 7 dias. Cancelar ou não autorizar o Pix Automático não tira ninguém do ar antes disso; só o estorno tira na hora.

Faltando 7 dias ou menos para o fim do mês pago, o mesmo link pessoal volta a cobrar. Quem tem o Pix Automático autorizado não precisa: o Asaas cobra sozinho.

### Régua: quem pagou e não autorizou o Pix Automático

Essas pessoas saem do ar quando o mês pago acaba, a menos que paguem de novo pelo link ou autorizem. Para lembrar cada uma:

```sql
select p.nome, p.telefone, p.pago_ate, p.pago_ate + interval '7 days' as sai_do_ar_em
from profissionais_cadastrados p
where p.pago_ate is not null
  and not exists (
    select 1 from apoios a
    where a.profissional_id = p.id and a.status in ('ativo', 'inadimplente')
  )
order by p.pago_ate;
```

### Estorno nos 7 dias

No painel do Asaas, estornar a cobrança. O sistema marca o apoio como estornado, tira o perfil do ar e encerra o Pix Automático.

O prazo conta a partir de `ativado_em`:

```sql
select nome, ativado_em, ativado_em + interval '7 days' as estorno_ate from profissionais_cadastrados where id = '{id}';
```

### Pausar um perfil (férias, por exemplo)

```sql
update profissionais_cadastrados set ativo = false where id = '{id}';
```

Para voltar, `ativo = true`. A pausa não mexe na cobrança: se for longa, combinar com o profissional e cancelar no Asaas.

### Quem está em atraso

Mês do Pix Automático recusado (sem saldo, por exemplo). O Asaas tenta de novo até 3 vezes em 7 dias; o perfil fica no ar até `pago_ate` mais 7 dias.

```sql
select nome, inadimplente_desde, pago_ate, pago_ate + interval '7 days' as sai_do_ar_em
from profissionais_cadastrados
where status = 'inadimplente';
```

### Quem pagou o quê

O painel do Asaas é a referência. No banco:

```sql
select p.nome, a.plano_base, a.plano_opcional, a.valor, a.status, a.ultimo_pagamento_em
from apoios a join profissionais_cadastrados p on p.id = a.profissional_id
order by a.criado_em desc;
```
