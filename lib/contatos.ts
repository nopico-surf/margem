export type TipoContato = "whatsapp" | "instagram" | "email";

// Os mesmos três contatos aparecem no menu lateral e no rodapé. O que muda entre os dois é só
// o asset do ícone, que cada tela escolhe.
export const CONTATOS: Array<{ tipo: TipoContato; href: string; texto: string; externo: boolean }> = [
  { tipo: "whatsapp", href: "https://wa.me/5511968996977", texto: "11 9 6899 6977", externo: true },
  { tipo: "instagram", href: "https://instagram.com/somos_margem_", texto: "somos_margem_", externo: true },
  { tipo: "email", href: "mailto:vitor@somosmargem.com.br", texto: "vitor@somosmargem.com.br", externo: false },
];
