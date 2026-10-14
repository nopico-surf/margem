export type TipoContato = "whatsapp" | "instagram" | "email";

// Os mesmos três contatos aparecem no menu lateral e no rodapé. O que muda entre os dois é só
// o asset do ícone, que cada tela escolhe.
export const CONTATOS: Array<{ tipo: TipoContato; href: string; texto: string; externo: boolean }> = [
  { tipo: "whatsapp", href: "https://wa.me/5511968996977", texto: "11 9 6899 6977", externo: true },
  { tipo: "instagram", href: "https://instagram.com/somos_margem_", texto: "somos_margem_", externo: true },
  { tipo: "email", href: "mailto:vitor@somosmargem.com.br", texto: "vitor@somosmargem.com.br", externo: false },
];

// Botão "Fazer parte" do rodapé. Os parâmetros utm_ identificam a origem do clique nos relatórios
// do GA; o evento `grupo_facebook_clicado` no dataLayer (Footer.tsx) é o que o GTM registra.
export const LINK_GRUPO_FACEBOOK =
  "https://www.facebook.com/share/g/1C6RLXy11o/?utm_source=margem&utm_medium=rodape&utm_campaign=grupo_facebook";

// Banner "Sugira uma rede de apoio" da /redes-de-apoio: o mesmo WhatsApp, com o texto da anotação do
// Figma (Experiência do produto, 1478:43714). O `*` é o negrito do WhatsApp; no Figma está como `**`.
export const LINK_WHATSAPP_SUGESTAO_REDE = `https://wa.me/5511968996977?text=${encodeURIComponent(
  [
    "Olá! Quero sugerir uma rede de apoio para incluir na Margem.",
    "• *Nome da rede:*",
    "• *Perfil nas redes sociais ou site:*",
    "• *Cidade/Estado ou Online:*",
    "• *O que ela faz:*",
  ].join("\n"),
)}`;

// Banner e atalho "Cannabis medicinal" da home: o mesmo WhatsApp, já com a mensagem escrita.
export const LINK_WHATSAPP_CANNABIS = `https://wa.me/5511968996977?text=${encodeURIComponent(
  "Acessei a Margem e quero saber mais sobre Cannabis Medicinal",
)}`;
