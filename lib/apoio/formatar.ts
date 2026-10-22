// Preço em centavos para a tela, no formato brasileiro sem o "R$" (que cada tela escreve com o tamanho
// dela): 1999 vira "19,99", 123456 vira "1.234,56". Conta só com inteiros, nunca com float.
export function formatarCentavos(centavos: number) {
  const reais = Math.floor(centavos / 100).toLocaleString("pt-BR");
  return `${reais},${String(centavos % 100).padStart(2, "0")}`;
}
