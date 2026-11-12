# Briefing 01b: a oferta muda, sem módulo 1 grátis e 14 dias para pedir o dinheiro de volta

Pré-requisito: briefings 00 e 01. Substitui as partes do 01 que falam em módulo 1 grátis e em 7 dias.

## 1. O que muda

- **O módulo 1 deixa de ser grátis.** Tudo que vem depois do resultado é pago.
- **O prazo para desistir passa de 7 para 14 dias**, contados da liberação do acesso.
- **Em lugar nenhum se escreve "cancelar".** O pagamento é Pix, à vista. Não existe assinatura para cancelar: o dinheiro já saiu da conta da pessoa, e o que ela pede é a devolução.

**Continua grátis, para qualquer pessoa, com ou sem compra:** o diagnóstico, o resultado inteiro com o roteiro e as frases, a página de segurança, o plano de segurança, os telefones de emergência e **um treino de conversa**.

## 2. O treino grátis existe no servidor e não tem porta

Hoje a rota do simulador já libera um treino para quem não comprou: `route.ts`, linha 119, recusa só cenário que não é `gratis`, e a linha 121 deixa passar até o limite de `SIMULADOR_GRATIS`. O cenário `primeira-conversa` está marcado `gratis: true`.

Só que a tela do simulador mora em `/familia/programa/simulador/...`, dentro da área do painel, e o único caminho até lá é o módulo 1. O resultado leva para "Começar o módulo 1 (grátis)". Ou seja: o treino grátis está escrito no código e ninguém consegue chegar nele.

Com o módulo 1 virando pago, isso deixa de ser um detalhe: **o treino passa a ser a única coisa que mostra o que o programa faz.** Ler a descrição de um programa não convence ninguém. Conversar com o personagem e receber o retorno, sim.

**Criar a porta, na tela de resultado:**
- Abaixo do roteiro, botão secundário: **"Treinar o meu roteiro"** (briefing 00, item 7).
- Linha de apoio acima dele: "Dá para treinar esta conversa antes, de graça, sem compromisso."
- A tela do simulador precisa abrir para quem não comprou. Hoje a proteção é a rota do painel, então mover a verificação: a página do simulador aceita quem não comprou, e quem decide é a rota da API, que já sabe fazer isso.
- Quando o treino grátis acabar, aparece a mensagem `limite_gratis` que já existe, e logo abaixo o banner de oferta (briefing 01, variação b).

## 3. Os 14 dias, onde aparecem e com que texto

Nunca com contador regressivo. Contador é pressão, e pressão com alguém nesse estado é o contrário do que a Margem é.

| Onde | Texto |
|---|---|
| LP, logo abaixo do preço | "Você tem 14 dias para pedir o dinheiro de volta. Num toque, sem precisar explicar por quê." |
| Banner de oferta | "14 dias para pedir o dinheiro de volta." |
| Ao lado do botão de pagar, no checkout | "Se não for para você, peça o dinheiro de volta em até 14 dias. Num toque, sem precisar explicar por quê." |
| Confirmação depois do Pix | "Seu acesso está liberado. Até {{data}} você pode pedir o dinheiro de volta, num toque, sem precisar explicar por quê." |
| Painel, enquanto o prazo corre | Linha de apoio no rodapé: "Você tem até {{data}} para pedir o dinheiro de volta." |
| FAQ | A resposta atual sobre os 7 dias passa a falar em 14 e deixa de usar "cancelar". |

`{{data}}` é a data do fim do prazo, escrita por extenso curto, como "25 de novembro".

**O que o texto não pode dizer:** que os primeiros 7 dias são cortesia. Os 7 primeiros são o artigo 49 do Código de Defesa do Consumidor, que vale para qualquer compra pela internet. Os 14 são o dobro da lei, e é isso que vale destacar, sem comparar com o mínimo legal na tela.

## 4. O pedido de devolução

Uma tela, curta, em "Configurações do programa", visível só enquanto o prazo corre:
- Título: **Pedir o dinheiro de volta**
- Texto: "Você tem até {{data}}. Não precisa explicar o motivo. Se quiser contar o que não funcionou, ajuda a melhorar o programa, mas é opcional."
- Campo opcional de texto, até 500 caracteres.
- Botão: **"Pedir o dinheiro de volta"**
- Confirmação: "Pedido recebido. O valor volta pelo mesmo Pix em até {{prazo}}." Sem o prazo definido, a frase termina em "O valor volta pelo mesmo Pix."

Guardar em `familia_pedidos_devolucao`, no mesmo formato de `familia_pedidos_gratuidade`: `user_id`, `texto` opcional, data. O texto nunca vai para log nem para o Mixpanel. A devolução no Asaas é feita à mão pelo fundador.

Depois do pedido, o acesso continua até a devolução ser feita. Nada é bloqueado na hora.

## 5. Mudanças no código

**`lib/familia/oferta.ts`**
- `DIAS_PARA_DESISTIR = 14`.
- Acrescentar, no padrão que o arquivo já usa para pendências:
  ```ts
  // [PENDÊNCIA DO FUNDADOR] Em quanto tempo a devolução cai, ex.: "2 dias úteis". Nulo: a frase
  // "O valor volta pelo mesmo Pix em até..." aparece sem o prazo.
  export const PRAZO_DEVOLUCAO: string | null = null;
  ```
- `PRAZO_GRATUIDADE` e o pedido de acesso gratuito **continuam**. O pedido fica no rodapé do checkout, pequeno. Ele não custa nada enquanto ninguém pede, porque é manual, e é o que impede o programa de ter uma porta só.

**`app/familia/resultado/ResultadoVisao.tsx`**
- Sai "Começar o módulo 1 (grátis)".
- Entra o botão principal da oferta (briefing 01, variação b) e, abaixo do roteiro, o "Treinar o meu roteiro" do item 2.

**Liberação dos módulos:** o módulo 1 passa a exigir compra, como os outros. O `dataDoModulo` não muda: o módulo 1 abre na compra, e o 2 chega 7 dias depois do 1 concluído.

**`podeDesistir`** já lê a constante, então passa a valer 14 sozinho.

## 6. O que não pode ficar atrás do muro

Ao tirar a camada gratuita é fácil murar sem querer. Precisam continuar abertos, sem login e sem compra: o diagnóstico, o resultado, a página de segurança, o plano de segurança e os telefones de emergência. Se alguma dessas telas pedir compra depois da mudança, é erro.

## 7. Critério de aceite

- Quem não comprou abre o resultado inteiro e consegue fazer um treino de conversa, até o fim, com retorno.
- No segundo treino aparece a mensagem de limite e o banner de oferta.
- Nenhuma tela diz "cancelar" nem "assinatura".
- O texto dos 14 dias aparece nos cinco lugares da tabela, e em nenhum deles tem contador regressivo.
- A tela de pedir o dinheiro de volta só aparece dentro do prazo, e some depois.
- Pedir a devolução não bloqueia o acesso na hora.
- O pedido de acesso gratuito continua existindo no rodapé do checkout.
- Diagnóstico, resultado, segurança, plano de segurança e telefones abrem sem compra.
- Sem travessão, sem gênero marcado na pessoa, sem palavra proibida.
