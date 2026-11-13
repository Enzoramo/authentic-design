# Véspera — decisões e evidências

## Brief e fronteiras

- Requisitos fornecidos: encontro fictício de famílias; dez nomes; mesas 1 e 2 com quatro lugares, mesa 3 com três; todos inicialmente sem mesa. Pesquisar, atribuir, mover, retirar, rever, bloquear excesso de capacidade e persistir ao recarregar. Português, desktop e telefone, arquivos estáticos locais.
- Não há pesquisa com participantes, identidade preexistente ou dados externos. A relação entre cartões de lugar e agrupamento à mesa é uma hipótese de design derivada dos objetos do brief.
- O estudo e a interface usam fontes de sistema e desenho em CSS. Nenhum recurso remoto, conta, publicação ou integração.

## Tarefa → estrutura → expressão

Organizadora distribui pessoas → lista pesquisável e mapa das três mesas, com capacidade junto de cada decisão → cartões de nomes em torno de números centrais → nomes, vagas e destinos disponíveis permanecem explícitos → a metáfora espacial custa área, compensada por linhas compactas e uma lista separada → verificar a distribuição inicial, cheia, movimento recusado, retirada e recarga.

## Estudo e seleção

`direction-study.html` foi concluído antes da implementação visual. Os três espécimes usam os mesmos nomes, estado, controles e erro, e foram enviados para renderização neutra. As capturas recebidas foram inspecionadas com `view_image` antes da escolha:

- Desktop: viewport medido 1440 × 1000; captura de página inteira `../study-desktop.jpg`.
- Telefone: viewport medido 390 × 844; captura de página inteira `../study-mobile.jpg`.

A — Mapa anotado: sans com número na margem, grade de nomes, fronteiras lineares, fundo claro azulado. A grade compacta se mantém bem no telefone, mas a relação tipográfica e as linhas poderiam servir a muitos inventários.

B — Caderneta de receber: nome itálico, títulos e convidados em Georgia; linhas de leitura contínuas; superfície branca com acento ferrugem. Os nomes têm leitura confortável e o estado de erro é destacado. É a alternativa mais forte: prioriza a revisão escrita. Na captura móvel, a coluna de quatro nomes e os resumos das mesas ocupam mais altura que C; esta é uma diferença observada de composição, não prova de pior usabilidade.

**C — Lugares marcados, escolhida:** números no centro e cartões dispostos em pares laterais. A relação persiste sem a cor ou o nome da marca e permanece reconhecível a 390 px. A capacidade é legível e o erro fica junto ao controle. A superfície lilás agrupa a sala; cartões quase brancos destacam pessoas; a tinta ameixa mantém contraste; o acento mais escuro identifica ações. Arial/Helvetica: pesos fortes para nomes de mesa e totais, texto regular para pessoas e controles; o nome “Véspera” usa a mesma família, peso 800, sem ícone acrescentado.

**Contracaso:** o círculo central consome espaço e pode sugerir posição física exata. B permite percorrer nomes em uma coluna contínua e é uma escolha igualmente viável. C foi escolhida pela relação explícita entre grupo e mesa. Na implementação, o círculo representa a mesa; não se numeram assentos nem se promete posição exata. A navegação e a atribuição continuam feitas por botões e campos familiares.

**Revisão do conjunto habitual:** não se introduziu serif de exibição, fundo creme ou marca com ícone decorativo. O sistema escolhido não depende apenas de trocar uma cor: pares laterais, números centrais, cartões com base marcada e contagens compactas dão a estrutura. Isto é uma comparação entre os três candidatos, não uma afirmação de originalidade universal.

## Contrato de interação

- Lista pesquisável sem distinção de acentos; filtros Todos e Sem lugar.
- Um clique/toque num nome abre o editor com as três mesas, ocupação e vagas. Atribuição só acontece ao confirmar.
- A mesa cheia continua selecionável para explicar a recusa; uma falha preserva o mapa e a pessoa em sua origem.
- Retirar está disponível no editor de pessoa sentada. A revisão mostra todas as mesas e quem ficou sem lugar.
- Armazenamento local por navegador. Erros de leitura ou gravação recebem mensagens honestas; a sessão continua utilizável.
- Telefone: alternância entre convidados e mesas, com resumo sempre visível; editor modal próximo da borda inferior. Desktop: os dois painéis lado a lado.

## Verificações concluídas até a seleção

`node --test model.test.cjs`: 10 testes passaram. Cobrem dados iniciais, atribuir/mover/retirar, capacidade 4 e 3, recusa sem mutação, origem preservada, mesa atual cheia, distribuição dos dez, serialização/recarga, dados inválidos, busca com acentos e destinos inválidos. Isto verifica o modelo; não substitui interação em navegador.

A implementação final e sua inspeção serão registradas abaixo antes da submissão.

## Implementação e inspeção final

A direção C foi mantida: superfície lilás contínua, números centrais, cartões claros em pares e base marcada nos lugares ocupados. As três mesas estão simultaneamente visíveis na abertura desktop; o painel de convidados não exige procurar uma ação dentro do mapa. No telefone, as abas trocam a prioridade entre nomes e mesas, mantendo as contagens acima.

Capturas finais inspecionadas com `view_image`, produzidas pelo serviço neutro sem edição dos arquivos:

| Captura | Viewport medido | Evidência observada |
| --- | --- | --- |
| `../ui-desktop.jpg` | 1440 × 1000 | Estado inicial: dez sem lugar, onze lugares livres; três mesas e dez nomes na abertura. |
| `../ui-mobile.jpg` | 390 × 844 | Abertura móvel com pesquisa, filtros e primeiras ações visíveis; lista continua verticalmente. |
| `../ui-assigned-mobile.jpg` | 390 × 844 | Ana na mesa 1, total atualizado para 1/10 e confirmação da atribuição. |
| `../ui-capacity-mobile.jpg` | 390 × 844 | Erro após tentar mover Elisa para mesa 1 cheia; origem mesa 2 explícita, opções e recuperação visíveis. |
| `../ui-review-desktop.jpg` | 1440 × 1000 | Revisão com Ana, Beto, Caio e Dora na mesa 1, Elisa na mesa 2, mesa 3 vazia e cinco pessoas sem lugar. |
| `../ui-map-320.jpg` | 320 × 800 | Mapa após recarga: quatro nomes na mesa 1 e Elisa na mesa 2. Sem overflow horizontal medido pelo serviço; a mesa 3 continua abaixo do viewport. |

O serviço informou ter criado as atribuições usando botões/radios da interface, tentado a transferência inválida, cancelado, aberto a revisão e recarregado; não usou injeção de armazenamento. Eu não operei um navegador. A combinação das capturas permite observar os resultados dessas ações; não estabelece uma auditoria de interação completa.

Uma correção de acabamento após a inspeção: remover o “+” dos lugares vazios para evitar a sugestão de um botão onde existe apenas informação. A 320 px esse sinal já não aparecia. Não houve mudança de lógica ou direcionamento estético pelo avaliador.

### Verificação técnica

- `node --check app.js`: passou.
- `node --test model.test.cjs`: 10 testes, 10 passaram.
- 46 IDs únicos; 40 referências diretas do JavaScript resolvidas; todos os arquivos referenciados presentes; nenhum recurso remoto declarado.
- Contraste calculado com luminância relativa sRGB: texto principal/lilás **11,28:1**; texto secundário/lilás **4,85:1**; texto de lugar livre/superfície **5,14:1**; branco/botão **8,42:1**; erro/fundo **7,24:1**; bordas de controle/branco **3,83:1** e bordas/lilás **3,20:1**. O denominador grande do total mede **3,48:1**. Dois pares inicialmente fracos foram corrigidos antes das capturas finais.
- Inspeção do código: formulários e botões semânticos; campos com nome acessível; dialog nativo com título, Escape, fechar e cancelar; retorno de foco; estados de erro e confirmação anunciáveis; foco visível; sem ação dependente de arrastar; alvos principais de 44 px ou mais; sem animação necessária e com respeito à preferência de movimento reduzido.

### Limites da evidência

Não houve pesquisa com participantes nem auditoria completa por leitor de tela, zoom ou múltiplos navegadores. A busca com acentos e a distribuição completa foram testadas no modelo, mas não capturadas em interação final pelo serviço. O serviço também executou uma mudança válida e retiradas antes da recaptura; só o resultado agregado foi capturado, não cada passo. Falha de armazenamento e sincronização entre janelas estão implementadas, sem teste de navegador nesta rodada. A persistência é local ao navegador e endereço; não há sincronização entre dispositivos.

### Artefatos

`index.html`, `styles.css`, `app.js` e `model.js` formam a aplicação estática. `direction-study.html` preserva a exploração; `model.test.cjs` contém verificações reproduzíveis; `README.md` informa abertura e limites; este documento registra as decisões. As capturas de avaliação estão na pasta pai e não são recursos da interface.


### Fecho da inspeção

A recaptura `../ui-desktop-final.jpg`, viewport medido **1440 × 1000** e largura de documento **1440**, foi inspecionada com `view_image`. Os onze lugares vazios já não têm sinal “+”; as três mesas, seus limites e os dez nomes continuam visíveis. Para chegar a esse estado, o serviço informou ter movido Elisa da mesa 2 para a 3, retirado Elisa e os quatro convidados da mesa 1 pelos controles, e recarregado. A imagem final mostra **0/10 à mesa, 10 sem lugar e 11 livres**, confirmando o resultado persistido dessa sequência.

Aplicação pronta para submissão. Não ficam correções conhecidas pendentes; os limites de validação permanecem os indicados acima. Nenhuma edição será feita após a entrega final desta rodada.
