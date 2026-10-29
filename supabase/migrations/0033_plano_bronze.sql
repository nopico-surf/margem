-- Plano base Bronze (Figma, Experiência do produto, 1534:28281): 1 vaga, gratuito, para psicólogo e
-- médico. Preço e vagas ficam em lib/apoio/planos.ts. Sem opcional não há Pix: quem chega pelo link
-- pessoal e escolhe só o Bronze entra no ar como gratuito; com um opcional, paga só o opcional.

alter type plano_base add value if not exists 'bronze' before 'prata';
