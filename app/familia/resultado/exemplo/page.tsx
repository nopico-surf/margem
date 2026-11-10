import { notFound } from "next/navigation";
import { ExemploCliente } from "./ExemploCliente";

// SÓ DESENVOLVIMENTO: o resultado montado com as respostas do diagnóstico guardadas no aparelho, sem
// login. Em produção não existe.
export default function ResultadoExemploPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ExemploCliente />;
}
