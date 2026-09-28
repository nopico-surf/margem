-- Permite desativar um profissional sem excluir (some das buscas por categoria, continua no banco).
-- Separado de status (que hoje só guarda pago/gratuito) pra não perder essa informação ao desativar.
-- Mesmo padrão de instituicoes_apoio e servicos_publicos.

alter table profissionais_cadastrados add column ativo boolean not null default true;
