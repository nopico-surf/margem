// Espera a imagem chegar (ou falhar) antes de trocar o skeleton pelo conteúdo, pra foto não pipocar
// depois do card. Nunca espera mais que 2s: uma foto lenta não prende a tela inteira no skeleton.
export function carregarImagem(url: string) {
  return new Promise<void>((resolve) => {
    let concluida = false;
    const concluir = () => {
      if (concluida) return;
      concluida = true;
      window.clearTimeout(timeout);
      resolve();
    };
    const timeout = window.setTimeout(concluir, 2000);
    const imagem = new Image();
    imagem.onload = imagem.onerror = concluir;
    imagem.src = url;
  });
}
