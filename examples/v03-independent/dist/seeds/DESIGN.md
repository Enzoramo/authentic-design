# Quintal

Protótipo estático de troca comunitária de sementes, em português. Todos os lotes, pessoas, reservas e pontos de retirada são fictícios. Não há pagamento, conta, mensagens ou pedidos de rede.

## Tarefa e evidência

**Requisitos fornecidos:** procurar um lote, filtrar por ponto de retirada, conferir quantidade e local, escolher envelopes, rever, confirmar, consultar e cancelar. As reservas devem sobreviver ao recarregamento; o cancelamento deve devolver disponibilidade. Os quatro lotes e os dois horários foram transcritos do brief.

**Hipótese de design:** a pessoa precisa comparar a espécie, o número de envelopes e a retirada antes de abrir uma reserva. Por isso, cada linha mantém esses dados juntos. Esta hipótese não resulta de pesquisa com participantes.

**Tarefa → estrutura → expressão → decisões → compromisso → validação:** reservar sementes do bairro → lista pesquisável com capacidade e retirada por lote, seguida de revisão → etiquetas de envelopes de sementes → nomes serifados, retratos botânicos pequenos, linhas de inventário e quantidades alinhadas → maior extensão vertical em telefone para preservar dados legíveis → lógica testada em Node e inspeção de código; validação visual reservada ao avaliador.

## Exploração e escolha

`direction-study.html` contém três estudos visuais sobre Tomate cereja, sempre com seis envelopes, doze sementes por envelope, Ana, a mesma retirada e um estado esgotado. É um artefacto de trabalho separado do produto, com amostras visuais de controlos.

1. **Etiquetas de semente, escolhida.** Tipografia serifada com nomes de plantas destacados; informação pequena e alinhada de partilha; número grande de envelopes; superfícies de papel e linhas contínuas. O conteúdo de cada lote tem a unidade de uma etiqueta, mas a organização continua a ser uma lista familiar.
2. **Quadro de distribuição.** Tipografia de inventário, datas separadas em blocos e alinhamentos mais duros. Favorece a logística, mas enfraquece a leitura das espécies e a associação com envelopes de sementes.
3. **Canteiro coletivo.** Composição centralizada, campo escuro e contorno arqueado. Torna a planta protagonista, mas consome espaço de comparação e torna as retiradas menos imediatas.

As diferenças examinadas incluem composição tipográfica, ritmo, relação entre superfície e conteúdo e alinhamento dos dados, não apenas a cor. Não foram consultados outros projetos nem se afirma originalidade perante trabalhos não vistos. Os estudos foram produzidos antes da interface completa. A seleção é uma decisão de projeto baseada no código dos estudos; não foi confirmada por renderização.

## Gramática implementada

O Quintal aproxima uma semente partilhada do respetivo envelope através de etiquetas horizontais, retratos botânicos e inventário visível. A interface de apoio usa controlos convencionais, texto direto e superfícies discretas.

- **Tipografia:** Georgia para espécie, títulos e números de disponibilidade; Arial/Helvetica para etiquetas, retirada e controlos. Sem fontes externas. A combinação de nome, origem e inventário é repetida na seleção e na reserva guardada.
- **Cor:** papel `#f6f3e9`, texto `#243e30`, texto secundário `#5d675c`, ação principal `#294b3a`, superfície de apoio `#e9eddf`, erro `#9b312a`. Estados incluem palavras, números e contornos além da cor.
- **Espaço:** conteúdo limitado a 1280 px, catálogo dominante e coluna lateral de 290 px. As linhas têm retrato, decisão e quantidade/ação. Não existe uma secção promocional antes da pesquisa.
- **Imagens:** quatro SVG locais desenhados para este protótipo. São ilustrações estilizadas, não material de identificação botânica. Têm `alt=""`, pois os nomes das plantas já estão adjacentes. Não há imagens remotas nem ativos em falta.
- **Telefone:** a partir de 780 px a coluna lateral passa para baixo; a partir de 500 px filtros e ações de diálogo empilham, e a disponibilidade passa para uma linha abaixo dos dados do lote. A navegação mantém os dois destinos. A composição foi escrita para 320 px e larguras superiores, mas nenhuma dimensão foi confirmada num navegador.
- **Movimento:** apenas transições breves de cor; desativadas com `prefers-reduced-motion`.

Ao neutralizar o verde e remover a marca, permanecem a relação entre retrato de planta e etiqueta, os nomes serifados e os números de inventário nas extremidades das linhas. Essa estrutura foi conservada nas reservas e nos diálogos. Trata-se de revisão de código e intenção visual, não de uma observação do resultado renderizado.

## Fluxo e recuperação

1. Pesquisa por espécie, insensível a acentos e maiúsculas, combinada com um seletor nativo de ponto de retirada. Estado vazio oferece limpeza da pesquisa e filtros.
2. Um lote disponível abre um diálogo nativo. A quantidade é um campo numérico editável com botões de diminuir e aumentar. Mostra o número total de sementes e a retirada.
3. **Rever reserva** valida número inteiro, mínimo e disponibilidade atual. A revisão lista espécie, envelopes, total, pessoa e retirada. **Alterar quantidade** permite voltar sem reservar.
4. **Confirmar reserva** volta a ler o estado persistido, valida novamente e só mostra sucesso depois de guardar. O catálogo e o resumo refletem o novo stock. Esgotados não oferecem ação de reserva.
5. **As minhas reservas** mostra os envelopes e a retirada de cada reserva. O cancelamento explica a reposição e pede uma confirmação. A alteração só é aplicada quando a persistência tem sucesso.

O estado usa `localStorage`, na chave `quintal.reservas.v1`. Um esquema validado recusa dados corrompidos, IDs inválidos, duplicações e reservas agregadas acima da capacidade. A quantidade inicial permanece imutável; a disponibilidade é sempre derivada das reservas.

Eventos `storage` atualizam outras janelas. Quando disponível, Web Locks serializa as mutações entre janelas da mesma origem. Sem essa API, cada ação ainda relê e valida o estado imediatamente antes de guardar; não se promete proteção transacional de acessos simultâneos em ambientes que não suportem locks.

Falhas de leitura ou gravação são visíveis; o protótipo não anuncia sucesso se não conseguir persistir. O armazenamento é específico deste navegador e da origem da página. Limpar os dados do navegador elimina as reservas.

## Verificações executadas

Comando repetível: `node checks.cjs`, dentro deste diretório. **11 grupos de verificações passaram:**

- Correspondência exata de lotes, quantidades, pessoas e horários com o brief.
- Reserva reduz disponibilidade sem mutar o estado anterior.
- Recusa de stock excedido, zero, negativo, fração e valor não numérico.
- Várias reservas respeitam o total agregado; lote esgotado recusa reserva.
- Cancelamento devolve exatamente os envelopes reservados.
- Guardar, ler novamente e cancelar preserva a contabilidade.
- Pesquisa ignora acentos/maiúsculas e combina com o ponto de retirada.
- Estado persistido corrompido, desconhecido, duplicado ou excedido é rejeitado.
- Falha de armazenamento propaga erro em vez de sucesso.
- Todos os recursos esperados existem localmente; HTML tem idioma e viewport.
- Contraste dos sete principais pares de texto é ≥ 4,5:1, calculado pelas luminâncias sRGB. Valores entre 4,96:1 e 10,47:1.

`node --check app.js` e `node --check model.js` passaram. Uma inspeção adicional com a biblioteca padrão do Python confirmou 24 IDs HTML únicos, associação dos rótulos estáticos, existência dos recursos referidos, XML bem formado nos quatro SVG e delimitadores equilibrados no CSS.

O código inclui navegação semântica, rótulos explícitos, foco visível, ligação para saltar ao conteúdo, estados de erro/sucesso anunciáveis, diálogo nativo, Escape e devolução de foco. Esses comportamentos foram inspecionados no código, sem ensaio de teclado ou leitor de ecrã.

## Limitações e entrega

Conforme o pedido, **não foi operado um navegador**. Layout, composição no primeiro viewport, reflow real a 320 px, zoom, foco, toque, armazenamento no navegador e o fluxo completo da interface continuam por verificar pelo avaliador. Testes da lógica e inspeção de código não estabelecem qualidade visual, usabilidade ou conformidade integral de acessibilidade. Não houve pesquisa com participantes.

Abrir `index.html` num navegador moderno, ou servi-lo com qualquer servidor estático local; não existe etapa de build. A disponibilidade de `localStorage` para ficheiros `file://` depende do navegador. Recomenda-se uma origem estática estável para repetir os testes de recarregamento.

Artefactos:

- `index.html`: produto e estrutura acessível.
- `styles.css`: identidade, estados e regras responsivas.
- `model.js`: dados, pesquisa, disponibilidade e persistência.
- `app.js`: interface, revisão, confirmação e cancelamento.
- `assets/tomate.svg`, `assets/manjericao.svg`, `assets/girassol.svg`, `assets/coentro.svg`: ilustrações locais.
- `direction-study.html`: exploração visual, fora do fluxo do produto.
- `checks.cjs`: verificações executáveis de código.
- `DESIGN.md`: decisões, evidência e limitações.

Entrega encerrada em 13 de novembro de 2026. Não há dependências instaladas, contas externas, publicações ou serviços iniciados.
