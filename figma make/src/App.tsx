import { useEffect } from "react";
import ResultadosTemplate from "@/imports/ResultadosTemplate/index";

export default function App() {
  useEffect(() => {
    const SVG_PATH = "M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM7.71 13.29C7.32 13.68 6.69 13.68 6.3 13.29L2.71 9.7C2.32 9.31 2.32 8.68 2.71 8.29C3.1 7.9 3.73 7.9 4.12 8.29L7 11.17L13.88 4.29C14.27 3.9 14.9 3.9 15.29 4.29C15.68 4.68 15.68 5.31 15.29 5.7L7.71 13.29V13.29Z";
    const CHECKED_HTML = `<div class="absolute inset-0 overflow-clip" data-name="check_box"><svg class="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32"><g id="Vector"></g></svg><div class="absolute inset-[12.5%]" data-name="Vector"><svg class="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18"><path d="${SVG_PATH}" fill="#055C40"></path></svg></div></div>`;
    const UNCHECKED_HTML = `<div class="absolute border border-[#171b18] border-solid left-[3px] rounded-[3px] size-[18px] top-[3px]"></div>`;

    // Find groups via JS .includes() — avoids CSS selector bracket issues
    const groups = Array.from(document.querySelectorAll<HTMLElement>('[aria-hidden]'))
      .filter(el => el.className.includes('border-[0.5px]'))
      .map(el => el.parentElement)
      .filter((el): el is HTMLElement => el !== null);

    groups.forEach(group => {
      group.setAttribute('data-checkbox-group', 'true');
      group.style.cursor = 'pointer';
    });

    // Event delegation on document — more reliable than per-element listeners
    const handleClick = (e: MouseEvent) => {
      let node = e.target as HTMLElement | null;
      while (node && node !== document.body) {
        if (node.dataset.checkboxGroup === 'true') {
          const isChecked = node.dataset.checked === 'true';
          const box = Array.from(node.querySelectorAll<HTMLElement>('div'))
            .find(d => d.className.includes('size-[24px]'));
          if (box) {
            node.dataset.checked = isChecked ? 'false' : 'true';
            box.innerHTML = isChecked ? UNCHECKED_HTML : CHECKED_HTML;
          }
          break;
        }
        node = node.parentElement;
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    let active: HTMLElement | null = null;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent) => {
      const el = (e.currentTarget as HTMLElement);
      active = el;
      startX = e.pageX - el.getBoundingClientRect().left;
      scrollLeft = el.scrollLeft;
    };
    const onUp = () => { active = null; };
    const onMove = (e: MouseEvent) => {
      if (!active) return;
      e.preventDefault();
      const x = e.pageX - active.getBoundingClientRect().left;
      active.scrollLeft = scrollLeft - (x - startX) * 1.2;
    };

    const groups = Array.from(
      document.querySelectorAll<HTMLElement>('[data-name="button group"]')
    );
    groups.forEach(el => el.addEventListener("mousedown", onDown));
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);

    return () => {
      groups.forEach(el => el.removeEventListener("mousedown", onDown));
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useEffect(() => {
    const anchors: [string, string][] = [
      ["Profissionais que podem ajudar", '[data-name="Card profissionais"]'],
      ["Serviços publicos",              '[data-name="cards-serviços publicos"]'],
      ["Espaços de apoio e escuta",      '[data-name="cards-instituições-completo"]'],
      ["Passos reais, para fazer agora", '[data-name="passos-reais"]'],
      ["Para planejar",                  '[data-name="proximos-passos"]'],
    ];

    const cleanups: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>('[data-name="button"]').forEach(btn => {
      const text = btn.querySelector("p")?.textContent?.trim();
      const match = anchors.find(([label]) => label === text);
      if (!match) return;

      const target = document.querySelector<HTMLElement>(match[1]);
      if (!target) return;

      const handler = () => target.scrollIntoView({ behavior: "smooth", block: "start" });
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });

    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <div className="w-full min-h-screen">
      <ResultadosTemplate />
    </div>
  );
}
