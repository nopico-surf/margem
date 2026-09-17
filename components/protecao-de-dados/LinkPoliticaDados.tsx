"use client";

export function LinkPoliticaDados({ onClick }: { onClick: () => void }) {
  return (
    <button className="privacy-link" type="button" onClick={onClick}>
      Ver como a gente cuida dos seus dados
    </button>
  );
}
