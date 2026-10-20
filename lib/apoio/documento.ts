// Confere o CPF ou CNPJ antes de mandar pro Asaas, pra um número digitado errado não virar cliente.
// Aceita o CNPJ alfanumérico (emitido a partir de julho de 2026): as 12 primeiras posições podem ter
// letras, os dois dígitos verificadores continuam numéricos, e cada caractere vale o código ASCII - 48.

function valor(caractere: string) {
  return caractere.charCodeAt(0) - 48;
}

function digitoVerificador(base: string, pesos: number[]) {
  const soma = [...base].reduce((total, caractere, indice) => total + valor(caractere) * pesos[indice], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function cpfValido(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const primeiro = digitoVerificador(cpf.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundo = digitoVerificador(cpf.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cpf.endsWith(`${primeiro}${segundo}`);
}

function cnpjValido(cnpj: string) {
  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || /^(.)\1{13}$/.test(cnpj)) return false;
  const primeiro = digitoVerificador(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundo = digitoVerificador(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cnpj.endsWith(`${primeiro}${segundo}`);
}

// Devolve o documento sem pontuação (como o Asaas espera) ou null se não for CPF nem CNPJ válido.
export function normalizarCpfCnpj(entrada: unknown): string | null {
  if (typeof entrada !== "string") return null;
  const documento = entrada.toUpperCase().replace(/[.\-/\s]/g, "");
  if (documento.length === 11) return cpfValido(documento) ? documento : null;
  if (documento.length === 14) return cnpjValido(documento) ? documento : null;
  return null;
}
