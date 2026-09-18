"use client";

import { IconeSetaResultado } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/mixpanel";

// Rola até a seção com uma animação própria, porque o scroll nativo não tem controle de duração.
export function SectionJump({ label, targetId }: { label: string; targetId: string }) {
  function scrollToSection() {
    track("atalho_secao_clicado", { secao: label });
    const target = document.getElementById(targetId);
    if (!target) return;
    const start = window.scrollY;
    const destination = target.getBoundingClientRect().top + start - 16;
    const distance = destination - start;
    const duration = 720;
    const startedAt = performance.now();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      window.scrollTo(0, destination);
      return;
    }

    function animate(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2;
      window.scrollTo(0, start + distance * eased);
      if (progress < 1) window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);
  }

  return (
    <Button variante="secondary" redondo onClick={scrollToSection}>
      {label}
      <IconeSetaResultado />
    </Button>
  );
}
