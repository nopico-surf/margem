// Avisa o Bing (e os outros buscadores do IndexNow) que páginas do site mudaram, pra eles lerem de
// novo sem esperar a próxima visita do robô. O ChatGPT busca muito no índice do Bing, então um guia
// novo aparece lá mais rápido.
//
// Uso, sempre depois do deploy (o buscador confere a chave no site no ar):
//   node scripts/indexnow.mjs                    avisa todas as páginas do sitemap
//   node scripts/indexnow.mjs https://www.somosmargem.com.br/blog/terapia-barata
//                                                avisa só essas (uma ou mais URLs)
//
// Passar sempre a URL completa: no Git Bash do Windows, um argumento começando com "/" vira caminho
// de pasta (C:/Program Files/Git/blog/...) e o IndexNow recusa com 422.
//
// A chave não é segredo: ela fica pública em /public/<chave>.txt, é assim que o protocolo prova que
// o site é nosso. Trocar a chave = trocar o nome e o conteúdo desse arquivo e a constante abaixo.

const SITE = "https://www.somosmargem.com.br";
const CHAVE = "a17d6cfcfdc9ce5e13ea1b7babb8ea07";

async function urlsDoSitemap() {
  const resposta = await fetch(`${SITE}/sitemap.xml`);
  if (!resposta.ok) throw new Error(`sitemap respondeu ${resposta.status}`);
  const xml = await resposta.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url.trim());
}

const caminhos = process.argv.slice(2);
const urls = caminhos.length > 0 ? caminhos.map((caminho) => new URL(caminho, SITE).href) : await urlsDoSitemap();

const resposta = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: CHAVE,
    keyLocation: `${SITE}/${CHAVE}.txt`,
    urlList: urls,
  }),
});

// 200 e 202: recebido. 403: a chave não está no ar (o deploy ainda não subiu?). 422: alguma URL não
// é do domínio. 429: aviso demais em pouco tempo.
const SIGNIFICADO = {
  200: "recebido",
  202: "recebido, a chave ainda vai ser conferida",
  400: "pedido mal formado",
  403: "a chave não foi encontrada no site no ar",
  422: "alguma URL não é do domínio",
  429: "aviso demais em pouco tempo, tentar mais tarde",
};

console.log(`${urls.length} página(s) enviadas: ${resposta.status} (${SIGNIFICADO[resposta.status] ?? "resposta inesperada"})`);
if (resposta.status >= 300) process.exitCode = 1;
