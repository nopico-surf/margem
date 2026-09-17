"use client";

import { IconeDeAcao } from "@/components/icons";
import type { CardAction } from "@/components/conversa/types";

type ActionButtonProps = CardAction & { onClick?: () => void };

export function ActionButton({ label, icon, href, onClick }: ActionButtonProps) {
  const content = (
    <>
      {icon && <IconeDeAcao nome={icon} />}
      {label}
    </>
  );

  if (href) {
    return (
      <a className="figma-result-action" href={href} target="_blank" rel="noreferrer" onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button className="figma-result-action" type="button" onClick={onClick}>
      {content}
    </button>
  );
}
