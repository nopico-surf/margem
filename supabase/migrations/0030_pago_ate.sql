-- O mês pago fica no ar inteiro (decisão de 22/10/2026). Cada pagamento confirmado do profissional
-- estende pago_ate até o mesmo dia do mês seguinte; o site mostra o perfil enquanto pago_ate mais 7 dias
-- de tolerância não passou (lib/supabase.ts). Quem pagou o primeiro mês sem autorizar o Pix Automático
-- entra no ar do mesmo jeito. Estorno zera pago_ate e tira do ar na hora.

alter table profissionais_cadastrados add column pago_ate timestamptz;
