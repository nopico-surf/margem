---
name: imagem-blog-margem
description: Gera a imagem de um guia do blog da Margem no Google Flow (projeto "blog", com as instruções do agente já salvas), baixa, converte pra /public/blog/<slug>.webp, gera o recorte do card e liga a imagem em lib/guias.ts. Use sempre que pedirem imagem, foto, banner ou capa de guia do blog, ou quando um guia novo for escrito e ainda estiver com `imagem: false`.
---

# Imagem de guia do blog no Google Flow

As imagens do blog saem de um projeto específico do Google Flow. As instruções de estilo já estão salvas no agente desse projeto: não reescrever estilo no pedido, só descrever a cena e mandar seguir as instruções do agente.

Projeto: https://flow.google.com/project/f61255c7-6c18-4dae-8400-5b2925f64f5f

## 1. Descrever a cena

Pensar uma cena que represente o tema do guia sem expor ninguém num momento de uso ou de sofrimento. O que já foi usado: mãos e objetos sobre a mesa (substâncias), roda de conversa (CAPS AD), mão em sinal de pare (como parar). Evitar seringa, sangue, pessoa caída, rosto em close de alguém que usa e qualquer texto escrito na imagem.

## 2. Gerar no Flow

Usar o Claude in Chrome (`mcp__claude-in-chrome__*`), onde a conta Google do Vitor está sempre logada. Abrir uma aba nova no projeto.

1. Clicar no campo "O que você quer criar?" (barra de baixo, com o modo **Agente** selecionado).
2. Digitar, nesta forma:
   `Siga as instruções do agente. Imagem para o guia do blog sobre <tema>: <cena>. Formato 16:9.`
3. Clicar na seta de enviar. O agente gera duas imagens no topo da grade, com porcentagem de progresso (cerca de 1 minuto). Enquanto isso dá pra adiantar outra parte do trabalho.
4. Olhar as duas com um screenshot e escolher a que melhor representa o tema. Se nenhuma servir (texto na imagem, mãos deformadas, cena que fere o tom), pedir uma nova descrevendo o que mudar. Se a segunda tentativa também falhar, parar e mostrar as opções pro Vitor.

Cada geração gasta crédito do plano do Vitor: não gerar variações à toa.

## 3. Baixar

1. Clicar na imagem escolhida pra abrir o editor.
2. Clicar no ícone de download (seta pra baixo, no topo à direita) e escolher **2K** (aprimorada). O Flow aumenta a resolução e o download começa sozinho em alguns segundos.
3. O arquivo cai em `~/Downloads` com o nome da cena em inglês e `_2K.jpg` no fim (ex.: `People_conversing_in_health_center_bef4fb39_2K.jpg`, 2752x1536). Achar com `ls -t ~/Downloads | head`.
4. Fechar a aba criada.

## 4. Converter pra imagem do topo

O banner é 2:1, 2000x1000, webp. Do 16:9 de 2752x1536, recortar a altura pra 1376 tirando mais do teto que do chão (ponto de partida: `top: 100`), e conferir se nada importante foi cortado:

```bash
node -e "require('sharp')(process.argv[1]).extract({left:0,top:100,width:2752,height:1376}).resize(2000,1000).webp({quality:80}).toFile('public/blog/<slug>.webp').then(console.log)" "$USERPROFILE/Downloads/<arquivo>_2K.jpg"
```

Abrir o resultado com Read e olhar. Se o arquivo com esse nome já existia, limpar `.next/dev/cache/images` antes de conferir no dev server.

## 5. Recorte do card

Seguir a regra do CLAUDE.md (seção 7, "Imagem do blog tem duas versões"): adicionar a linha do guia em `RECORTES` de `scripts/cards-blog.mjs`, com `sujeito` sendo o x onde o grupo central começa e termina na imagem de 2000px. `topo + largura * 605 / 1300` não pode passar de 1000. Rodar `node scripts/cards-blog.mjs`, conferir que a margem esquerda e a direita impressas são iguais e olhar o `<slug>-card.webp`.

## 6. Ligar no guia

Em `lib/guias.ts`, no guia do slug: `imagem: true`, `imagemCard: true` e `imagemAlt` descrevendo o que aparece na imagem, de forma concreta, sem travessão e sem dizer que é uma imagem gerada. A imagem vira também a de Open Graph. Não mexer em `atualizadoEm` só por trocar imagem.

## 7. Conferir

Subir o `margem-dev` (preview_start), abrir `/blog/<slug>` e `/blog` e confirmar que o banner e o card carregam. Commit e push seguem a regra de sempre (plano aprovado, direto na main).
