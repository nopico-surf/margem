# Mochila do Rolê: brief completo pro Claude Design (versão final)

Modelo: **Claude Opus 5.5**. Esforço: **alto**.

Este arquivo **substitui o brief anterior**. Se algo aqui contradiz o que já está no canvas, vale este arquivo.

## O que fazer (passo a passo)

1. Abra o projeto que você já começou no Claude Design. Cole este arquivo inteiro no próximo pedido.
2. Peça pra ele **comparar o canvas atual com este brief**, listar o que diverge e **corrigir primeiro**, antes de desenhar o que falta.
3. Rodada 2: telas que faltam (lista abaixo).
4. Rodada 3: quadro de componentes com os nomes exatos (lista abaixo).
5. Exportar: Compartilhar, Exportar, Enviar para, **Claude Code**. Baixe também o .zip em HTML como cópia de segurança. O Claude Design não exporta pro Figma.

---

## Pedido pro Claude Design (cole a partir daqui)

Desenhe a interface de um minijogo web mobile chamado **Mochila do Rolê**, da Margem, uma plataforma brasileira de redução de danos ligada a álcool e outras drogas. A pessoa escolhe um rolê (festa, show, bloco ou virada de ano), coloca itens numa mochila de 9 espaços (grade 3x3), não cabe tudo, e no fim recebe um rótulo pra mochila, um checklist de cuidados, contatos de apoio e um card pra compartilhar no Instagram e WhatsApp.

Estética: **pixel art de 16 bits**, divertida, sem parecer infantil. O jogo vive dentro do site da Margem, então botões, cards de contato e checklist devem parecer do mesmo produto.

Viewport: celular 390 x 844. Card de Stories 1080 x 1920 (250 px livres em cima e embaixo). Card de feed 1080 x 1350.

### Mudanças em relação ao brief anterior (corrigir no canvas)

1. **Não existe mais "Precisa de ajuda agora?"**. Remover o link fixo de todas as telas e **remover o painel de ajuda**. Os contatos de apoio aparecem **só na tela de Resultado**.
2. **Vermelho de emergência** (#b42318) passa a ser usado só nos cards de contato de emergência (SAMU 192) no Resultado. Em mais nenhum lugar.
3. **Confirmação do nível "Tudo"**: botões "Mostrar tudo" e "Voltar pro básico" (antes estava "Mostrar o canudo").
4. **Aviso do card** muda com a quantidade: "2 itens da sua mochila não aparecem no card." / "1 item da sua mochila não aparece no card." / quando nenhum item está escondido, o aviso **não aparece**.
5. **Itens da Virada de ano**: calçado confortável de reserva, casaquinho e uvas da virada precisam existir como sprites.
6. **Nome na prateleira**: "Seda ou piteira própria" aparece como **"Seda"** na prateleira (espaço curto) e com o nome completo na revelação e no texto pra leitor de tela.
7. **Rótulo de exemplo**: o rótulo "Mochila de quem pensa na volta" só aparece quando a mochila tem dinheiro da volta, telefone e carregador. Nos mockups, use a mochila de exemplo abaixo.

8. **Ações do checklist, protótipo clicável (corrigir):**
   - Acima dos dois botões, um rótulo **"Checklist:"** (Inter 14 SemiBold) pra deixar claro que os botões se referem ao checklist.
   - Botões: **"Salvar como imagem"** e **"Copiar pro grupo"** (não só "Baixar" e "Copiar"). Pro leitor de tela: "Salvar checklist como imagem" e "Copiar checklist pro grupo".
   - **Cada botão responde só à sua própria ação.** Clicar em Salvar mostra o toast "Checklist salvo como imagem." Clicar em Copiar mostra o toast "Checklist copiado. É só colar no grupo." Hoje, ao clicar em Salvar nada aparece e a mensagem de "copiado" fica fixa embaixo: está errado.
   - A mensagem **não fica fixa** na tela. Aparece como `Aviso/Toast de confirmação`, some em 4 segundos e não existe antes de clicar.
   - Mesma regra pros outros botões: "Compartilhar card" e "Baixar imagem" mostram "Imagem baixada e link copiado."; "Copiar link do desafio" mostra "Link copiado." Cada mensagem só aparece depois da ação correspondente.

### Cores (usar só estas)

| Papel | Token | Hex |
| --- | --- | --- |
| Fundo | neutral-50 | #f4f6f4 |
| Superfície | neutral-0 | #ffffff |
| Espaço vazio da grade, divisórias | neutral-100 | #e9ecea |
| Texto principal / secundário | alpha-88 / alpha-64 sobre base #171b18 | #171b18 |
| Acento (mochila, botão principal, rótulo) | brand-primary-700 | #067550 |
| Luz e sombra dos verdes | brand-primary-300 / brand-primary-900 | #7ce5b0 / #03422c |
| Destaque (item selecionado, brilho, combinados marcados) | brand-secondary-300 | #cdff66 |
| Texto sobre o verde-limão | brand-secondary-950 | #1a3005 |
| Emergência (só cards de contato de emergência no Resultado) | status-error-600 | #b42318 |

Sprites: cor base + no máximo 1 luz e 1 sombra, contorno de 1 px em #171b18. Texto sobre #cdff66 sempre em #1a3005. Contraste AA em todo texto. Verde-limão em área grande só se passar no contraste.

### Fontes

- Título do jogo e rótulo da mochila: **Pixelify Sans** 600 ou 700.
- Contador ("5 de 9 espaços"): **Press Start 2P**, só números e palavras curtas.
- Títulos de tela: **Urbanist** SemiBold.
- Texto corrido, botões, checklist, contatos: **Inter**.

### Componentes que já existem no site (reaproveitar, não redesenhar)

Botão (primário, secundário, terciário), grupo de botões / seletor, botão de ícone, checkbox, checklist, cards de contato (CVV, SAMU, CAPS AD, UBS), card de fundo, badge, título + subtítulo. Raio 8 em cards pequenos, 16 em cards grandes, botões pill.

### Componentes novos (usar estes nomes exatos)

1. `Mochila/Grade 3x3` (aberta e fechada, espaços vazios visíveis)
2. `Item/Prateleira` · `Item/Na mochila` · `Item/Selecionado` · `Item/Foco` · `Item/Não cabe` (tremidinha + mensagem). Itens de 2 espaços são retângulos 2x1.
3. `Item/Revelação` (sprite + nome + frase)
4. `Cenário/Cartão` (com variante de selo "Só até 5 de jan")
5. `Combinado/Linha` (checkbox + texto)
6. `Resultado/Rótulo` (rótulo em Pixelify Sans + frase curta em Inter abaixo)
7. `Resultado/Ficou de fora`
8. `Resultado/Contato` (variante emergência em vermelho, variante comum)
9. `Desafio/Bloco de comparação`
10. `Card/Prévia` (Stories e Feed) com `Card/Seletor de nível` e `Card/Seletor de formato`
11. `Card/Aviso de itens escondidos`

### Sprites (26 itens + mochila)

Comuns (14): garrafa d'água (2 espaços), telefone anotado no papel, dinheiro da volta, lanche, carregador portátil (2 espaços), camisinha, documento, chiclete ou bala, canudo individual, seda ou piteira própria, soro fisiológico, fone de ouvido, protetor labial, lenço umedecido.

Por cenário (12):
- Festa: remédio de uso diário, caixa de som (2 espaços), maquiagem
- Show: protetor auricular, pochete, leque
- Bloco: protetor solar, boné, glitter
- Virada: calçado confortável de reserva, casaquinho, uvas da virada

Mochila aberta e mochila fechada. O card da Virada tem fundo de fogos de artifício em pixel art, nas cores da escala.

**Proibido:** copo, garrafa de bebida, cigarro, pó, comprimido solto, seringa ou qualquer substância. Canudo, seda e soro são desenhados sozinhos, como objeto limpo, sem nada em volta que sugira uso. Remédio de uso diário é uma caixinha fechada, sem comprimido à mostra.

### Mochila de exemplo (usar em todos os mockups)

Rolê: Festa na casa de alguém. Itens (7, ocupando os 9 espaços): Garrafa d'água (2), Telefone anotado (1), Dinheiro da volta (1), Carregador portátil (2), Camisinha (1), Canudo individual (1), Fone de ouvido (1).
Rótulo: **Mochila de quem pensa na volta**.
Item que ficou de fora: Lanche.

### Telas (desenhar todas, 390 x 844)

1. **Início** (normal e vindo de desafio)
2. **Escolha do cenário** (4 cartões; Virada com selo)
3. **Montagem** (vazia, no meio, cheia 9 de 9, item que não cabe, botão "Fechar a mochila" desativado com a mensagem de mochila vazia)
4. **Revelação** (rola na própria tela, um item após o outro)
5. **Tem coisa que não ocupa espaço** (combinados com checkbox, um estado com marcados)
6. **Resultado** (rótulo, ficou de fora, checklist, contatos, ações)
7. **Resultado com comparação do desafio**
8. **Compartilhar card** (prévia + seletor de nível + formato), nos 3 níveis
9. **Confirmação do nível "Tudo o que eu levei"**
10. **Desafiar um amigo**

(Não existe mais a tela "Painel de ajuda".)

**Cards compartilháveis**, com a mochila de exemplo:
- Stories 1080 x 1920 nas 3 versões de privacidade
- Feed 1080 x 1350 nas 3 versões de privacidade
- Extremos em Stories: mochila com 2 itens e mochila com 9 itens (1 espaço cada)
- Card da Virada com fundo de fogos

### Regra de privacidade do card (muito importante)

O card nunca mostra item sensível por padrão. Seletor com 3 opções:

- **Só o básico** (padrão): só itens de nível Nenhum. Mostra: água, telefone, dinheiro, carregador, fone. Esconde 2 itens.
- **Básico e cuidado íntimo**: inclui camisinha e remédio. Esconde 1 item (o canudo).
- **Tudo o que eu levei**: inclui canudo, seda e soro. Não esconde nada.

Item escondido some do card **sem deixar espaço vazio**: a mochila do card é redesenhada só com o que aparece. Quem vê o post não pode deduzir que tinha algo ali. O aviso "N itens da sua mochila não aparecem no card." aparece **só na tela de compartilhar**, nunca dentro da imagem do card.

### Textos (usar exatamente, sem inventar outros)

**Início**
- Título: Mochila do Rolê
- Convite: Antes de sair, uma pergunta: o que vai na sua mochila?
- Apoio: Não tem certo nem errado. Tem a sua escolha e umas ideias de cuidado no fim.
- Botão: Começar a montar
- Botões de som: Ligar som / Desligar som
- Vindo de desafio: Alguém montou uma mochila pra uma festa (ou: pra um show / pra um bloco / pra virar o ano) e quer ver a sua. · Você não vê a mochila dessa pessoa até terminar a sua. · Botão: Montar minha mochila

**Escolha do cenário**: Pra onde você vai?
- Festa na casa de alguém: A volta é de madrugada
- Show ou festival: Muita gente e horas em pé
- Bloco de rua: Sol, rua cheia e volta sem hora
- Virada de ano: Meia-noite, multidão e volta difícil · selo: Só até 5 de jan

**Frase de abertura de cada cenário (topo da Montagem)**
- Festa: Sexta à noite, festa na casa de um amigo. A volta é de madrugada.
- Show: Show grande, muita gente, horas em pé. O palco fica longe da saída.
- Bloco: Dia de sol, rua cheia, você vai a pé e não sabe que horas volta.
- Virada: Virada de ano. Multidão na rua ou festa cheia, o sinal cai à meia-noite e a volta é difícil.

**Montagem**
- Contador: 5 de 9 espaços
- Não cabe: Isso não cabe mais. Tire alguma coisa pra abrir espaço.
- Cheia: Mochila cheia. Dá pra fechar ou trocar alguma coisa.
- Botão: Fechar a mochila
- Mochila vazia: Coloque pelo menos um item pra fechar.

**Revelação**: Olha o que foi na sua mochila · Botão: Continuar

Frases por item (nome, depois frase):
- Garrafa d'água: O álcool desidrata. Água aos goles ao longo do rolê ajuda o corpo, sem precisar forçar muito de uma vez.
- Telefone de alguém anotado no papel: Se o celular morrer ou sumir, você ainda tem com quem contar.
- Dinheiro da volta separado: Volta garantida é menos chance de pegar carona com quem bebeu.
- Lanche: Comer antes e durante faz o álcool agir mais devagar.
- Carregador portátil: Celular com bateria é como você chama alguém, pede um carro ou acha seu grupo.
- Camisinha: Decisões mudam ao longo da noite. Ter à mão é cuidado com você e com quem está junto. Na UBS é de graça.
- Documento: Ajuda na entrada e, se precisar, no atendimento num serviço de saúde.
- Chiclete ou bala: Boca seca e mandíbula tensa acontecem, e passam longe de ser gostoso. Chiclete ou bala ajuda nas duas coisas.
- Canudo individual: Canudo é de uma pessoa só. Dividir pode passar hepatite C e outras infecções, mesmo sem sangue aparente.
- Seda ou piteira própria: Seda e piteira são de uma pessoa só. Dividir passa gripe, herpes e outras infecções de boca.
- Soro fisiológico: Lavar o nariz com soro depois ajuda a mucosa a se recuperar. Também serve pra lavar o olho e limpar um machucado.
- Fone de ouvido: A trilha sonora da ida e da volta.
- Protetor labial: Lábio rachado estraga qualquer foto.
- Lenço umedecido: Serve pra tudo: mão, rosto, aquela mancha na roupa.
- Remédio de uso diário: Se você toma algum remédio todo dia, ele vai junto. Vale perguntar pro seu médico se ele combina com álcool.
- Caixa de som: A festa agradece.
- Maquiagem: Pro retoque no banheiro, claro.
- Protetor auricular: Horas de som alto cansam o ouvido. Aquele zumbido no dia seguinte é o aviso.
- Pochete: Mãos livres e suas coisas perto do corpo.
- Leque: Calor e multidão juntos. E ainda dá pra dançar com ele.
- Protetor solar: Sol forte por horas, junto com álcool, cansa e desidrata ainda mais.
- Boné: Estilo e sombra no mesmo item.
- Glitter: Bloco sem glitter nem conta. Se der, prefira o biodegradável.
- Calçado confortável de reserva: Horas em pé e chão de festa cansam. Um calçado confortável de reserva ajuda a voltar com calma.
- Casaquinho: A madrugada esfria. Um agasalho na mochila e você segue firme até o amanhecer.
- Uvas da virada: Cada uva é um desejo pro ano novo. Dá pra pedir saúde também.

**Tem coisa que não ocupa espaço** (combinados)
- Título: Tem coisa que não ocupa espaço
- Apoio: Uns combinados antes de sair também vão junto. Marque os que você vai fazer.
- Botões: Ver minha mochila / Seguir sem marcar
- Festa: Combinar com quem você volta. · Avisar alguém que horas pretende chegar. · Saber o endereço exato da festa. · Não deixar o copo sozinho nem aceitar copo aberto de quem você não conhece.
- Show: Combinar um ponto de encontro se o grupo se perder. · Saber onde fica o posto médico. · Combinar um horário de checar se tá todo mundo bem. · Não deixar o copo sozinho nem aceitar copo aberto de quem você não conhece.
- Bloco: Combinar um ponto de encontro. · Deixar o celular no bolso da frente. · Saber onde tem banheiro e sombra no caminho.
- Virada: Combinar um ponto de encontro, porque o sinal costuma cair na hora da virada. · Combinar a volta antes da meia-noite, quando o transporte lota e encarece. · Combinar de ficar de olho um no outro durante a festa.

**Resultado**
- Título: Sua mochila saiu assim:
- Rótulo (exemplo): Mochila de quem pensa na volta
- Frase curta do rótulo (exemplo): Você é o redutor de danos que resolve a volta antes de sair de casa.
- Ficou de fora: Uma coisa que ficou de fora: · frase do item (exemplo, Lanche): Faltou comida. Comer antes de sair já ajuda bastante.
- Checklist, título: Pra levar no bolso do rolê:
- Checklist, linhas fixas no fim: Misturar álcool com outras substâncias, inclusive remédios, aumenta os riscos. · Se alguém não acorda, respira com dificuldade ou fica muito confuso, ligue 192, deite a pessoa de lado e fique junto.
- Rótulo acima dos botões: Checklist:
- Botões do checklist: Salvar como imagem / Copiar pro grupo
- Toast após salvar: Checklist salvo como imagem.
- Toast após copiar: Checklist copiado. É só colar no grupo.
- Contatos, título: Se precisar, dá pra contar com:
- Cards de contato: SAMU 192 (emergência, vermelho) · CVV 188 · Disque Social 121 · CAPS AD · UBS · A Margem
- Botões dos contatos: Ligar pro SAMU 192 · Ligar pro CVV 188 · Ligar pro Disque Social 121 · Ver CAPS AD perto de você · Ver UBS perto de você · Conversar com a Margem
- Ações no fim: Compartilhar minha mochila / Desafiar um amigo / Montar outra mochila

**Rótulos da mochila**

São 7 rótulos. O sistema testa na ordem da tabela e **o primeiro que se aplica vence**, então um rótulo específico sempre ganha de um genérico. Cada rótulo vem com uma frase curta que começa sempre com "Você é o redutor de danos que".

| # | Combinação exata | Rótulo | Frase curta |
| --- | --- | --- | --- |
| 1 | Só na Virada de ano: calçado confortável de reserva na mochila **e** o combinado "Combinar a volta antes da meia-noite" marcado | Mochila de quem vira o ano bem | Você é o redutor de danos que entra no ano novo sabendo como volta pra casa. |
| 2 | Dinheiro da volta **e** telefone anotado **e** carregador portátil, os três na mochila | Mochila de quem pensa na volta | Você é o redutor de danos que resolve a volta antes de sair de casa. |
| 3 | Garrafa d'água **e** lanche | Mochila de quem cuida do corpo | Você é o redutor de danos que lembra que o corpo também foi pro rolê. |
| 4 | Telefone anotado **e** 2 ou mais combinados marcados na tela bônus | Mochila de quem cuida do grupo | Você é o redutor de danos que combina as coisas antes, pra ninguém se perder depois. |
| 5 | 2 ou mais itens do tipo Rolê (fone, protetor labial, lenço, caixa de som, maquiagem, pochete, leque, boné, glitter, casaquinho, uvas) | Mochila de quem veio pra festa | Você é o redutor de danos que não abre mão da parte boa da noite. |
| 6 | Até 4 itens na mochila | Mochila leve | Você é o redutor de danos que leva pouco e resolve no caminho. |
| 7 | Qualquer outro caso | Mochila pronta pro rolê | Você é o redutor de danos que monta a mochila do próprio jeito. |

Onde a frase aparece: no Resultado, logo abaixo do rótulo, em Inter 16 SemiBold, na cor #1a3005 (texto sobre o verde-limão). No card compartilhável, abaixo do rótulo, em corpo menor que o rótulo.

Linha opcional abaixo da frase, no Resultado (não vai no card): "Redução de danos é isso: escolhas pequenas que deixam o rolê menos arriscado."

**Regra importante**: nenhum rótulo pode ser disparado por item de nível Baixo ou Médio (camisinha, remédio de uso diário, canudo, seda, soro). O rótulo aparece dentro do card compartilhado, então um rótulo ligado a esses itens entregaria no post justamente o que a pessoa escolheu esconder. Os 7 rótulos acima respeitam essa regra.

**Comparação do desafio**
- Vocês levaram 4 coisas iguais.
- As mochilas saíram bem diferentes. Cada rolê tem seu jeito. (quando 0 iguais)
- Só você levou: carregador portátil.
- Só a outra mochila levou: lanche.
- Botão: Devolver o desafio
- Sem vencedor, sem placar.

**Compartilhar card**
- Título: É assim que seu card vai aparecer
- Formato: Stories / Feed
- Seção: O que aparece no card
- Opção 1: Só o básico · Itens íntimos ficam fora da imagem.
- Opção 2: Básico e cuidado íntimo · Inclui camisinha e remédio.
- Opção 3: Tudo o que eu levei · Inclui canudo, seda e soro.
- Aviso: 2 itens da sua mochila não aparecem no card. / 1 item da sua mochila não aparece no card. / (nenhum escondido: sem aviso)
- Botões: Compartilhar card / Baixar imagem
- Após baixar: Imagem baixada e link copiado.
- Erro: Não deu pra gerar a imagem agora. · Botões: Tentar de novo / Copiar link

**Confirmação do nível "Tudo"**
- Quem vir seu post vai ver tudo o que você levou, inclusive os itens mais pessoais. Quer mostrar mesmo assim?
- Botões: Mostrar tudo / Voltar pro básico

**Texto dentro do card (imagem)**
- Minha mochila pro rolê
- Rótulo (ex: Mochila de quem pensa na volta)
- Frase curta (ex: Você é o redutor de danos que resolve a volta antes de sair de casa.)
- Destino: Festa na casa de alguém
- Monte a sua: [endereço do jogo]. O endereço ainda não foi definido, deixe uma **área reservada** com esse texto, sem inventar domínio.

**Desafiar um amigo**
- Título: Quem você quer desafiar?
- Seu amigo monta a mochila pro mesmo rolê, sem ver a sua. No fim, vocês comparam.
- O desafio usa o mesmo nível do card. Itens escondidos ficam escondidos.
- Botões: Mandar desafio no WhatsApp / Copiar link do desafio · após copiar: Link copiado.
- Prévia do link: Monta sua mochila pro rolê · Alguém já montou a dela. Vê quantas coisas vocês levam igual.

**Regras de texto**: nunca usar travessão em nenhum texto da interface. Botões e CTAs no infinitivo.

### Mensagens de aviso e retorno (como aparecem)

Os textos já estão nas seções acima. Aqui está **onde e como** cada um aparece. Desenhe todos num quadro chamado "Mensagens de retorno", com estes nomes de componente:

1. `Aviso/Toast de confirmação`: faixa verde escura (brand-primary-900, texto branco) com ícone de check, aparece no pé da tela por 4 segundos e some sozinha. Usada em: "Imagem baixada e link copiado.", "Checklist copiado. É só colar no grupo.", "Link copiado.". Precisa ser lida por leitor de tela (aria-live polite).
2. `Aviso/Erro com ação`: caixa com borda de 2 px em #171b18 e fundo branco, texto + dois botões (primário "Tentar de novo", secundário "Copiar link"). Usada em: "Não deu pra gerar a imagem agora." Sem vermelho: erro de geração de imagem não é emergência.
3. `Aviso/Inline`: texto pequeno (Inter 14, alpha-64) **dentro** da tela, junto do elemento que explica. Usado em: "Isso não cabe mais. Tire alguma coisa pra abrir espaço." (embaixo do contador, junto com a tremidinha do item), "Mochila cheia. Dá pra fechar ou trocar alguma coisa.", "Coloque pelo menos um item pra fechar." (logo abaixo do botão "Fechar a mochila" desativado, **sem ser cortado**) e "N itens da sua mochila não aparecem no card." (embaixo da prévia, só na tela de compartilhar).
4. `Aviso/Confirmação` (tela 9): a pergunta do nível "Tudo" em modal, com "Mostrar tudo" e "Voltar pro básico".
5. `Botão de som`: dois estados, ligado (botão diz "Desligar som") e desligado (botão diz "Ligar som"). Legenda de apoio fica fora do desenho, não aparece na interface.

Regra: aviso nunca em vermelho, nunca com "!" nem tom de bronca. Só o contato SAMU 192 usa vermelho.

### Acessibilidade

Áreas de toque de 44 px no mínimo. Nada depende de arrastar. Cor nunca sozinha: item selecionado tem cor + ícone de check. Mostre o estado de foco de teclado. Texto alternativo do card gerado a partir dos itens que aparecem nele.

### Resposta às suas dúvidas anteriores

- Nome "Seda": prateleira usa "Seda", revelação e leitor de tela usam "Seda ou piteira própria".
- Linha da opção 2: "Inclui camisinha e remédio." confirmada.
- Divergências do canvas: tudo listado em "Mudanças em relação ao brief anterior".
- Textos faltantes: todos estão acima. Só o endereço do jogo no card segue como área reservada.
