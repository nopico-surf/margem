import { notFound } from "next/navigation";
import { Pixelify_Sans, Press_Start_2P } from "next/font/google";
import { GaleriaMochila } from "./GaleriaMochila";
import "../../mochila/mochila.css";

const pixelify = Pixelify_Sans({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-pixelify" });
const pressStart = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-press-start" });

// Só dev: os componentes novos da Mochila do Rolê com os estados, antes de entrarem na tela.
// Fica numa página à parte da /ui pra não misturar com a galeria principal.
export default function GaleriaMochilaPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className={`${pixelify.variable} ${pressStart.variable}`}>
      <GaleriaMochila />
    </div>
  );
}
