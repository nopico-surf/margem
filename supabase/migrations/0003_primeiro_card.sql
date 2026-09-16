-- Margem v0 — seed do primeiro card: "Quero mudar o uso"

insert into respostas (origem, chave_busca, acolhimento, orientacao, pilula_espiritual, checklist_agora, checklist_proximo, perguntas_aprofundamento, revisado_por_clinica) values
(
  'escrita_manual',
  'quero mudar uso',
  'Dar esse primeiro passo e dizer com todas as letras que você quer mudar o seu uso de drogas tem uma força imensa. Muitas vezes a gente passa meses ou até anos pensando nisso em silêncio, acumulando dúvidas e receios antes de conseguir expressar essa vontade. Quero começar te acolhendo com muito respeito, sem nenhum tipo de sermão ou julgamento moral. Você tomou uma atitude valiosa ao abrir espaço para essa conversa, e o mais importante é saber que você não precisa carregar essa jornada em total solidão.',
  'Quando o consumo começa a incomodar a ponto de você querer uma mudança, é porque o corpo e a mente já estão emitindo sinais claros de desgaste. Fisicamente, o organismo vai acumulando um cansaço difícil de recuperar, noites de sono mal dormidas e variações constantes na energia diária. No lado emocional, essa rotina costuma trazer uma carga pesada de ansiedade, culpa e aquela sensação incômoda de estar perdendo o controle sobre as próprias escolhas e sobre o próprio tempo. Reconhecer esses riscos não serve para colocar medo em você, mas sim para validar que o seu incômodo é real e que a sua saúde merece um cuidado mais atento.

A gente vive em uma sociedade que cobra produtividade o tempo todo, onde o ritmo acelerado da rotina e as pressões diárias pesam nas costas de quase todo mundo, enquanto sobram pouquíssimos espaços seguros para simplesmente descansar, desabafar ou ser acolhido. Diante de tudo isso, o consumo de qualquer substância raramente é um problema isolado que surge do nada. Na maioria das vezes, a droga entra como uma resposta rápida para anestesiar algo que dói, para suportar um cansaço que parece não ter fim, para silenciar pensamentos difíceis ou para preencher um vazio. Ela funciona como um alívio eficiente no momento imediato, só que essa anestesia dura pouco tempo e, quando o efeito passa, aquilo que estava por baixo volta ainda mais pesado. Por isso, a conversa mais rica não é apenas sobre como parar de qualquer jeito, mas sim sobre o que o consumo tem tentado resolver na sua vida.

Ao longo do tempo, a sua mente aprendeu esse caminho rápido para obter alívio e prazer. Ela decorou esse atalho e se acostumou a buscar essa saída fácil nos momentos de aperto. A boa notícia é que a nossa cabeça tem uma capacidade maravilhosa de reaprender. Da mesma forma que ela decorou esse caminho, ela pode ser treinada para encontrar satisfação, calma e segurança em outras fontes. Isso não acontece de uma hora para outra, mas sim com pequenos passos, repetição diária e muita paciência com o próprio tempo.

Como você ainda não detalhou qual tipo de mudança tem em mente, saiba que existem vários caminhos possíveis e que nenhum deles deve ser imposto de fora para dentro. Algumas pessoas preferem parar de vez e construir uma rotina totalmente sem a substância. Outras preferem focar na redução de danos, aprendendo a diminuir as doses, espaçar os dias de uso e adotar práticas para proteger a saúde e evitar prejuízos maiores. Há também quem comece pela redução de danos para recuperar o equilíbrio e, mais adiante, decida se quer parar totalmente ou manter um uso mais seguro e controlado. Todas essas possibilidades são legítimas e pertencem a você.',
  'Olhe para você com mais generosidade e menos cobrança. Você é muito maior do que qualquer substância que já tenha consumido e o seu valor como pessoa continua inteiro. Reencontrar a paz passa por perdoar tropeços do passado, aceitar a sua humanidade e se reconectar com aquilo que realmente traz sentido e serenidade para o seu coração.',
  '["Fazer um registro simples de observação: anote ou apenas repare nos momentos em que a vontade de consumir aparece, prestando atenção no que você estava sentindo, fazendo ou pensando logo antes desse impulso.", "Cuidar das necessidades básicas do corpo: garanta que você beba água com frequência ao longo do dia, faça refeições nutritivas mesmo sem muito apetite e busque um momento de descanso em local seguro.", "Testar uma pequena pausa: se a vontade de consumir surgir, experimente esperar vinte minutos antes de tomar qualquer atitude, respirando com calma e percebendo como essa onda de urgência tende a diminuir."]'::jsonb,
  '["Mapear os seus principais gatilhos: identifique quais pessoas, horários, lugares ou sentimentos mais despertam a vontade de usar e comece a planejar alternativas simples para lidar com essas situações.", "Experimentar novas fontes de alívio: introduza aos poucos pequenas atividades que tragam relaxamento nos horários em que você costumava consumir, ensinando a sua cabeça a desacelerar por outros caminhos.", "Buscar apoio de profissionais e pessoas de confiança: procure serviços de saúde ou pessoas queridas que trabalhem com acolhimento e redução de danos, onde você possa conversar com total transparência e sem medo de sermões."]'::jsonb,
  '[
    {
      "pergunta": "Que tipo de mudança no consumo parece mais atraente ou possível para você hoje?",
      "opcoes": ["Gostaria de parar totalmente de usar", "Gostaria de diminuir a quantidade ou a frequência aos poucos", "Gostaria de aprender a me proteger melhor e evitar prejuízos maiores", "Ainda não sei qual caminho escolher e me sinto em dúvida", "Prefiro não dizer"]
    },
    {
      "pergunta": "Olhando para a sua rotina, o que a substância mais parece aliviar quando você recorre a ela?",
      "opcoes": ["O cansaço diário e a necessidade de relaxar ou desligar a cabeça", "A ansiedade, angústia ou pensamentos acelerados e difíceis", "Sentimentos de solidão, tristeza ou vazio interno", "Prefiro não dizer"]
    },
    {
      "pergunta": "Como está o apoio de pessoas ao seu redor neste momento?",
      "opcoes": ["Tenho familiares ou amigos de confiança com quem posso me abrir", "Tenho pessoas por perto, mas sinto receio ou vergonha de falar sobre isso", "Sinto que estou enfrentando tudo isso em total solidão", "Prefiro não dizer"]
    }
  ]'::jsonb,
  true
) returning id as resposta_id \G

-- Agora insere o card que aponta pra essa resposta
insert into cards_predefinidos (titulo, resposta_id, ordem)
select 'Quero mudar o uso', id, 1 from respostas where chave_busca = 'quero mudar uso' limit 1;
