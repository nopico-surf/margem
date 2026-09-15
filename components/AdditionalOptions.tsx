"use client";

const arrow = "https://www.figma.com/api/mcp/asset/3412482e-3f94-45fa-8ac1-29e172cecb2d.svg";

const options = [
  "Profissionais que podem ajudar",
  "Serviços publicos",
  "Espaços de apoio e escuta",
  "Passos reais, para fazer agora",
  "Para planejar",
];

type AdditionalOptionsProps = { state?: "default" | "loading" };

export function AdditionalOptions({ state = "default" }: AdditionalOptionsProps) {
  if (state === "loading") {
    return <section className="additional-options additional-options-loading" aria-label="Preparando opções"><div className="additional-skeleton title" />{[165, 165, 225, 247, 134].map((width) => <div className="additional-skeleton pill" style={{ width }} key={width} />)}</section>;
  }

  return <section className="additional-options" aria-labelledby="additional-options-title"><h2 id="additional-options-title">Além disso, você pode ver</h2><div className="additional-options-list">{options.map((option) => <button type="button" key={option}>{option}<img src={arrow} alt="" /></button>)}</div></section>;
}
