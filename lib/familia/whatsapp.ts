// Celular brasileiro com DDD, pra tela de dados do programa para familiares. Funções puras: a tela usa
// pra mascarar e conferir, o servidor usa pra conferir de novo e guardar. Só confere o formato: não
// diz se o número é da pessoa nem se tem WhatsApp.

const DDDS_VALIDOS = new Set([
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "21", "22", "24", "27", "28",
  "31", "32", "33", "34", "35", "37", "38",
  "41", "42", "43", "44", "45", "46", "47", "48", "49",
  "51", "53", "54", "55",
  "61", "62", "63", "64", "65", "66", "67", "68", "69",
  "71", "73", "74", "75", "77", "79",
  "81", "82", "83", "84", "85", "86", "87", "88", "89",
  "91", "92", "93", "94", "95", "96", "97", "98", "99",
]);

// Só os dígitos, sem o 55 do país (quem cola "+55 11 91234-5678" fica com os 11 do celular).
function digitosNacionais(texto: string) {
  const digitos = texto.replace(/\D/g, "");
  const semPais = digitos.length > 11 && digitos.startsWith("55") ? digitos.slice(2) : digitos;
  return semPais.slice(0, 11);
}

// (11) 91234-5678, montado enquanto a pessoa digita.
export function mascararWhatsapp(texto: string) {
  const d = digitosNacionais(texto);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Devolve o número pronto pra guardar (+5511912345678) ou null se não for um celular válido.
export function normalizarWhatsapp(texto: unknown) {
  if (typeof texto !== "string") return null;
  const d = digitosNacionais(texto);
  if (d.length !== 11 || d[2] !== "9" || !DDDS_VALIDOS.has(d.slice(0, 2))) return null;
  return `+55${d}`;
}
