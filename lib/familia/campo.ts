// Chips de sugestão (briefing 00d, padrão 2): o chip preenche o campo, e a pessoa edita. Depois de
// preencher, o foco vai pro campo, com o cursor no fim, e o campo entra na área visível.

export const TEXTO_SUGESTOES = "Sugestões. Toque para preencher, e depois mude as palavras do seu jeito.";
export const TEXTO_CAMPOS_CHEIOS = "Os dois campos já estão preenchidos. Apague um para usar esta sugestão.";

export function focarCampo(id: string) {
  // Espera o React aplicar o valor novo, pra o cursor cair depois do texto inteiro.
  requestAnimationFrame(() => {
    const campo = document.getElementById(id);
    if (!(campo instanceof HTMLInputElement)) return;
    campo.focus({ preventScroll: true });
    campo.setSelectionRange(campo.value.length, campo.value.length);
    campo.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}
