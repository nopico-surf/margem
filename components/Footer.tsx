"use client";

import { track } from "@/lib/mixpanel";

const assets = {
  whatsapp: "https://www.figma.com/api/mcp/asset/1d86dc12-b466-4be2-8e7e-8f9132b09968.svg",
  instagram: "https://www.figma.com/api/mcp/asset/05f074d7-e188-46b6-b6dd-cb6026e6b5e1.svg",
  email: "https://www.figma.com/api/mcp/asset/8f8bc447-8191-4fff-86a5-dbffa0763774.svg",
};

export function Footer() {
  function trackContact(tipoContato: "whatsapp" | "instagram" | "email") {
    track("contato_site_clicado", { origem: "rodape", tipo_contato: tipoContato });
  }

  return (
    <footer className="app-footer">
      <p className="app-footer-title">Contatos</p>
      <div className="app-footer-list">
        <a className="app-footer-item" href="https://wa.me/5511968996977" target="_blank" rel="noreferrer" onClick={() => trackContact("whatsapp")}><img src={assets.whatsapp} alt="" /><span>11 9 6899 6977</span></a>
        <a className="app-footer-item" href="https://instagram.com/somos_margem_" target="_blank" rel="noreferrer" onClick={() => trackContact("instagram")}><img src={assets.instagram} alt="" /><span>somos_margem_</span></a>
        <a className="app-footer-item" href="mailto:vitor@somosmargem.com.br" onClick={() => trackContact("email")}><img src={assets.email} alt="" /><span>vitor@somosmargem.com.br</span></a>
      </div>
    </footer>
  );
}
