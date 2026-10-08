// Os cards mostram a foto do profissional em 96x96, mas o `foto_url` aponta para a original de
// 1200x1200, que a página interna precisa. Para fotos nossas em /assets, devolve a versão de 192x192
// gerada por scripts/fotos-pequenas.mjs. Qualquer outra URL (fallback, externa) passa igual.
// Foto nova sem a versão pequena gerada cai no fallback do Avatar: rodar o script ao cadastrar.
export function fotoPequena(url: string) {
  return /^\/assets\/professional-.+\.(webp|jpe?g|png)$/i.test(url) ? url.replace(/\.[^.]+$/, "-192.webp") : url;
}
