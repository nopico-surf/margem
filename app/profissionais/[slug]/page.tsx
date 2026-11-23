import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfissionalDetalhe } from "./ProfissionalDetalhe";
import { buscarProfissionalPorSlug, buscarTodosProfissionaisAtivos, type ProfissionalCadastrado } from "@/lib/supabase";
import { anoAtualCacheado } from "@/lib/ano-atual";
import { slugsDosProfissionais } from "@/lib/slug-profissional";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

const URL_DO_SITE = "https://www.somosmargem.com.br";

const ESPECIALIDADE: Record<string, string> = {
  psicologo: "Psicologia",
  psiquiatra: "Psiquiatria",
  assistente_social: "Assistência Social",
};

// Mesmos rótulos do `registroLabel` que a tela usa. Aqui separado porque aquele mora em componente
// de cliente e esta página é servidor.
const REGISTRO: Record<ProfissionalCadastrado["especialidade"], string> = {
  psicologo: "CRP",
  psiquiatra: "CRM",
  assistente_social: "CRESS",
};

function resumo(texto: string | null) {
  if (!texto) return undefined;
  return texto.length > 155 ? `${texto.slice(0, 152).trimEnd()}...` : texto;
}

export async function generateStaticParams() {
  const profissionais = await buscarTodosProfissionaisAtivos();
  const slugs = slugsDosProfissionais(profissionais).map(({ slug }) => ({ slug }));
  // Cache Components recusa lista vazia no build. Se o Supabase falhou, o slug de um perfil já
  // publicado cai fora do prerender e a página volta a ser gerada na requisição.
  return slugs.length > 0 ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profissional = await buscarProfissionalPorSlug(slug);
  if (!profissional) return {};

  const especialidade = profissional.especialidade_rotulo ?? ESPECIALIDADE[profissional.especialidade];
  const titulo = `${profissional.nome}, ${especialidade} | Margem`;
  const descricao = resumo(profissional.bio) ?? `${especialidade} parceira da Margem.`;

  // SVG não serve de preview em WhatsApp e afins: sem foto de verdade, fica a imagem padrão.
  const temFoto = profissional.foto_url && !profissional.foto_url.toLowerCase().endsWith(".svg");
  const imagem = temFoto ? { url: profissional.foto_url!, alt: profissional.nome } : OG_IMAGE_PADRAO;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/profissionais/${slug}` },
    openGraph: { type: "profile", title: titulo, description: descricao, images: [imagem], siteName: OG_SITE_NAME },
  };
}

export default async function ProfissionalPage({ params }: Props) {
  const { slug } = await params;
  const profissional = await buscarProfissionalPorSlug(slug);
  if (!profissional) notFound();

  // Os mesmos dados que a tela mostra, no formato que as máquinas leem (o blog já faz isso). Nada
  // aqui é novo: nome, especialidade, registro, bio, foto, temas e formações saem do cadastro.
  const especialidade = profissional.especialidade_rotulo ?? ESPECIALIDADE[profissional.especialidade];
  const foto = profissional.foto_url;
  const instituicoes = (profissional.formacoes ?? [])
    .map(({ instituicao }) => instituicao)
    .filter((instituicao): instituicao is string => Boolean(instituicao));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profissional.nome,
    jobTitle: especialidade,
    url: `${URL_DO_SITE}/profissionais/${slug}`,
    ...(profissional.bio ? { description: profissional.bio } : {}),
    ...(foto ? { image: foto.startsWith("/") ? `${URL_DO_SITE}${foto}` : foto } : {}),
    ...(profissional.registro_profissional
      ? {
          identifier: {
            "@type": "PropertyValue",
            name: REGISTRO[profissional.especialidade],
            value: profissional.registro_profissional,
          },
        }
      : {}),
    ...(profissional.tags.length > 0 ? { knowsAbout: profissional.tags } : {}),
    ...(instituicoes.length > 0
      ? { alumniOf: instituicoes.map((nome) => ({ "@type": "EducationalOrganization", name: nome })) }
      : {}),
    affiliation: { "@type": "Organization", name: "Margem", url: URL_DO_SITE },
  };

  // A rota e o ano vêm daqui, e não de usePathname e `new Date()` dentro do componente de cliente:
  // com Cache Components eles saem do prerender e a página fica só com o loading.tsx, sem o texto
  // do perfil no HTML (o robô de IA, que não roda JavaScript, não vê nada).
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProfissionalDetalhe
        profissional={profissional}
        rota={`/profissionais/${slug}`}
        anoAtual={await anoAtualCacheado()}
      />
    </>
  );
}
