import { LoaderTela } from "@/components/ui/LoaderTela";

// Só aparece enquanto o servidor monta a /bem-vindo (o texto do botão vem do experimento, por pessoa).
export default function CarregandoBemVindo() {
  return <LoaderTela />;
}
