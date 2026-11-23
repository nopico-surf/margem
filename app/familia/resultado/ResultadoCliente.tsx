"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EsqueletoFamilia } from "@/components/familia/EsqueletoFamilia";
import { chamarApi } from "@/lib/familia/auth-cliente";
import type { Resultado } from "@/lib/familia/resultado";
import type { ProfissionalCadastrado } from "@/lib/supabase";
import { track } from "@/lib/mixpanel";
import { ResultadoVisao } from "./ResultadoVisao";

type Dados = { apelido: string; resultado: Resultado };

// Página de resultado (briefing, seção 6): busca o diagnóstico da conta, montado no servidor com os
// blocos fixos, sem IA. O desenho fica em ResultadoVisao. O banner de oferta (briefing 01) só aparece
// pra quem ainda não tem o acesso liberado.
export function ResultadoCliente({ modulosPagos, profissionais }: { modulosPagos: string[]; profissionais: ProfissionalCadastrado[] }) {
  const router = useRouter();
  const [dados, setDados] = useState<Dados | null>(null);
  const [acessoLiberado, setAcessoLiberado] = useState(true);
  const [erro, setErro] = useState(false);

  async function carregar() {
    setErro(false);
    // Os dois ao mesmo tempo: o perfil não depende do diagnóstico.
    const [resposta, perfil] = await Promise.all([chamarApi("/api/familia/diagnostico"), chamarApi("/api/familia/perfil")]);
    if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
    if (resposta.status === 404) return router.replace("/familia/diagnostico");
    if (!resposta.ok) return setErro(true);
    const lido = (await resposta.json()) as Dados;
    // Sem saber se comprou, o banner não aparece: melhor faltar a oferta do que mostrar a quem já pagou.
    if (perfil?.ok) setAcessoLiberado(((await perfil.json()) as { acessoLiberado: boolean }).acessoLiberado);
    setDados(lido);
    track("resultado_visualizado", { safety_mode: lido.resultado.safetyMode });
  }

  useEffect(() => {
    void carregar();
    // Carrega uma vez.
  }, []);

  if (erro) {
    return (
      <section className="familia-secao">
        <p className="text-medium-regular" role="alert">
          Não foi possível carregar seu resultado agora. Tente novamente.
        </p>
        <Button tamanho="medium" larguraTotal onClick={() => void carregar()}>
          Carregar o resultado de novo
        </Button>
      </section>
    );
  }

  if (!dados) {
    return (
      <EsqueletoFamilia variante="resultado" />
    );
  }

  return (
    <ResultadoVisao
      resultado={dados.resultado}
      apelido={dados.apelido}
      modulosDaOferta={acessoLiberado ? null : modulosPagos}
      profissionais={profissionais}
    />
  );
}
