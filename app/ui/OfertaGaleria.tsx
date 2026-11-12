import { OfertaPrograma } from "@/components/familia/OfertaPrograma";

// Banner de oferta do programa para familiares (briefing 01), nas quatro variações do canvas "Banner
// de oferta". Os botões são o Button (hover, pressed, focus e carregando são os dele).

function Estado({ nome, children }: { nome: string; children: React.ReactNode }) {
  return (
    <div className="galeria-estado">
      <div className="galeria-palco">{children}</div>
      <span className="label-xx-small galeria-nome">{nome}</span>
    </div>
  );
}

// modulos: os títulos reais dos módulos 1 a 8, lidos do content/familia pela página da galeria.
export function OfertaProgramaGaleria({ modulos }: { modulos: string[] }) {
  return (
    <div className="galeria-estados">
      <Estado nome="lp (antes da FAQ)">
        <OfertaPrograma variante="lp" />
      </Estado>
      <Estado nome="resultado (módulos 1 a 8 trancados)">
        <OfertaPrograma variante="resultado" apelido="Lu" modulos={modulos} />
      </Estado>
      <Estado nome="resultado em modo de segurança">
        <OfertaPrograma variante="resultado" apelido="Lu" modulos={modulos} seguranca />
      </Estado>
      <Estado nome="treino (fim do treino grátis)">
        <OfertaPrograma variante="treino" apelido="Lu" />
      </Estado>
      <Estado nome="bloqueado (módulo sem compra)">
        <OfertaPrograma variante="bloqueado" apelido="Lu" />
      </Estado>
    </div>
  );
}
