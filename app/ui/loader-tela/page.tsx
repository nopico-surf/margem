import { notFound } from "next/navigation";
import { LoaderTela } from "@/components/ui/LoaderTela";

// Só dev: mostra o screen-loading como a pessoa vê na /bem-vindo, pra conferir tamanho e velocidade.
export default function GaleriaLoaderTela() {
  if (process.env.NODE_ENV === "production") notFound();
  return <LoaderTela />;
}
