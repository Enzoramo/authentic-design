# Revela — decisões e verificação

## Base observada
- Pedido: ferramenta local em português para acompanhar quatro filmes fictícios, pesquisar e filtrar, abrir pedidos, rever e avançar uma etapa, desfazer a última mudança e editar notas; etapas e notas persistem ao recarregar.
- Factos dos pedidos: R-104 Marina / 35 mm / 36 poses / recebido; R-105 Tiago / 120 / 12 poses / em revelação; R-106 Sol / 35 mm / 24 poses / digitalizando; R-107 André / 120 / 12 poses / pronto.
- Não existem imagens, laboratório conectado, cobranças ou mensagens. Não há investigação com utilizadores.
- Hipótese de uso: a pessoa responsável consulta a fila em desktop e regista alterações em telefone. O código é a identificação inequívoca; nome, formato e poses ajudam a confirmar o filme antes de mudar o estado.

## Modelo de tarefa
Fila com pesquisa e filtro → abrir uma ficha → consultar etapa e nota → pedir avanço → rever código, pessoa, etapa atual e próxima → confirmar → estado atualizado e recuperação por desfazer. Pronto é terminal. Notas são editáveis com guardar explícito. A última alteração guardada (etapa ou nota) pode ser desfeita; o rótulo identifica o efeito.

## Estudo, ainda sem seleção
`direction-study.html` apresenta o mesmo conteúdo e os mesmos controlos nas três direções.
- A / Ficha de bancada: fonte condensada no código, ficha de tom pêssego separada da fila neutra, campos e registos monoespaçados. Fonte do conceito: o código do pedido acompanha o filme ao longo do trabalho. É uma interpretação do brief, não uma afirmação sobre práticas reais do laboratório.
- B / Mesa de processo: superfície escura contínua, nomes grandes em sans e sequência segmentada com estado legível. Fonte: progressão de quatro etapas; a intensidade da superfície mostra o avanço.
- C / Livro de entradas: nomes em serif, códigos tabulares e regras de registo; estrutura de consulta e comparação sem bloco decorativo separado. Fonte: o conjunto pequeno de pedidos com campos constantes.

Os três usam fontes de sistema explicitamente declaradas e nenhum recurso remoto. O estudo não faz parte do fluxo de produto. Seleção pendente de capturas neutras.

## Seleção após renderização
Capturas neutras inspecionadas com `view_image`: `../study-desktop.jpg` (viewport medido 1440 × 1000, captura da página inteira) e `../study-mobile.jpg` (390 × 844, página inteira).

**Escolhida A — Ficha de bancada.** Na captura, R-105 domina a ficha antes do nome; a ficha separa claramente o pedido aberto da lista. No telefone, esta relação continua reconhecível, enquanto a alternativa C torna o nome a maior identificação e B dá mais peso ao nome e estado do que ao código. A tipografia condensada está efetivamente presente no render, com o monoespaçado reservado aos campos curtos. A cor pêssego ocupa o objeto de trabalho; o papel neutro ocupa a fila. O nome REVELA é texto no mesmo sistema condensado dos códigos, sem símbolo ou assinatura suplementar.

**Contraponto:** B torna a etapa atual mais evidente por a apresentar num título próprio. A amostra A usa rótulos do percurso demasiado pequenos no telefone; a versão implementada introduz uma linha explícita “Etapa atual” e rótulos maiores. C oferece maior distinção entre nomes pelo ritmo serifado. Escolher A custa algum espaço à lista para manter a identificação do filme dominante. Não se afirma que estas observações substituem testes com pessoas.

**Teste de identidade:** ao retirar o nome e neutralizar o pêssego, permanecem o código condensado de grande escala, os campos monoespaçados enquadrados, a ficha com borda lateral de etiqueta e a sequência curta numerada. O formulário de revisão repete código + campos e a mesma hierarquia. Não foi consultado histórico de outros projetos.

## Implementação
- Sem build, pacotes, pedidos de rede, imagens ou fontes externas. `index.html` referencia `styles.css`, `model.js` e `app.js` locais. As fontes de sistema têm fallbacks declarados.
- Desktop: fila e ficha em paralelo. Telefone: a fila dá lugar à ficha ao abrir um pedido, com voltar explícito e recuperação de foco. A ficha inicial de desktop é R-104, o primeiro pedido recebido.
- Pesquisa ignora maiúsculas e acentos; combina com filtro de etapa. Sem resultados oferece reposição de pesquisa e filtro.
- Avançar abre revisão com identificação e etapas. Cancelar não altera dados. Pronto é terminal e mostra conclusão sem controlo de avanço.
- Nota com limite de 2000 caracteres, guardar e cancelar. Navegação durante edição modificada pede continuar ou descartar. Dados livres são inseridos com `textContent` ou `value`.
- Etapas, notas e a última alteração persistem em `localStorage` sob `revela-lab-v1`. Desfazer recupera a última etapa ou nota e remove essa entrada de recuperação. A próxima mudança substitui a anterior; não existe histórico ilimitado.
- Falha de escrita não altera o estado nem anuncia sucesso. Falha de leitura mostra aviso e os dados iniciais. A persistência depende do armazenamento disponível no navegador e do mesmo endereço de origem.
- Diálogos nativos com Escape, cancelar e foco de retorno. O navegador impede sair silenciosamente com uma edição de nota pendente quando suporta `beforeunload`.
- Dados fictícios e persistência local estão declarados na interface, sem explicações do processo de design no produto.

## Verificação já executada
- `node --check app.js`: sintaxe válida.
- `node model.test.cjs`: passou pesquisa por código/nome sem acentos, filtro combinado, avanço completo, recusa em pronto, revisão obsoleta, notas e limite, recarga, desfazer de etapa e nota, escrita bloqueada sem mutação e dados corrompidos.
- Contraste calculado por luminância sRGB: texto principal/papel 11,56:1; texto/ficha 8,03:1; secundário/papel 5,48:1; secundário/linha selecionada 4,53:1; botão 13,15:1; nota vazia/ficha 4,86:1 após correção da medição inicial de 4,42:1. As medições são do script de verificação; não constituem uma auditoria WCAG completa.
- Verificação estática adicional: 49 IDs únicos, 3 recursos locais existentes e todos os 27 seletores literais do script resolvidos.
- Serviço neutro executou cancelar/confirmar avanço de R-105, recarregar, desfazer, editar nota e recarregar; pesquisar `andre`; combinar `R-104` com `Pronto`; limpar filtros; abrir pedido pronto. As imagens mostram a nota modificada retida, mensagem de reversão e o terminal sem avanço. Não operei navegador diretamente.
- Inspecionadas com `view_image`: `../ui-desktop.jpg` a 1440 × 1000; `../ui-mobile.jpg`, `../ui-detail-mobile.jpg` e `../ui-review-mobile.jpg` a 390 × 844; `../ui-detail-320.jpg` e `../ui-ready-320.jpg` a 320 × 740; `../ui-search-reset.jpg`.
- Desktop: lista, estado, ficha e ação estão no viewport observado. A direção selecionada preserva tipografia condensada, campos monoespaçados, borda de etiqueta e superfície do pedido. Telefone 390: ficha e diálogo mantêm identificação, revisão e ações visíveis. Terminal apresenta conclusão e nota, sem avançar. Nota longa de teste quebra linhas sem escapar da ficha.
- Problema observado em 320: proximidade excessiva entre “Digitalizando” e “Pronto” nas quatro colunas. Correção feita: percurso em 2 × 2 abaixo de 370 px, com números reais de sequência 01–04 e rótulos de 12 px. Recaptura `../ui-detail-320-final.jpg` inspecionada: viewport 320 × 740, largura medida do documento 320. Os quatro rótulos agora estão separados, em ordem numerada, e a ação principal permanece visível. O serviço neutro informou lista vazia de erros de consola e nenhuma falha nas ações solicitadas.


## Entrega final e limites
- Artefacto de produto: `index.html`, `styles.css`, `app.js`, `model.js`.
- Artefactos de processo: `direction-study.html`, `DESIGN.md`; teste executável `model.test.cjs`.
- Pode ser servido por qualquer servidor estático, sem build. O armazenamento fica associado ao navegador e à origem usada para abrir a demonstração.
- Implementado e observado: lista e estados, pesquisa/filtro e reposição, abertura, revisão cancelada e confirmada, persistência ao recarregar, desfazer, nota e terminal pronto. A lógica de falhas de armazenamento também foi testada diretamente em Node.
- Limites: demonstração local com quatro pedidos fictícios; sem ligação a laboratório, fotos, cobranças ou mensagens. Sem sincronização entre dispositivos ou garantia de preservação se o armazenamento do navegador for apagado. Não houve pesquisa com participantes, auditoria completa de acessibilidade, teste manual completo por teclado ou validação em vários motores de navegador.
- A seleção decorreu apenas depois de inspecionar o estudo renderizado. A única correção após as primeiras capturas da interface foi a disposição do percurso em 320 px; foi recapturada e verificada. Nenhuma edição será feita depois da submissão final.
