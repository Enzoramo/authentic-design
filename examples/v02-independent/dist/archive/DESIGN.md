# Vozes do Bairro — decisão de design

## Base e objetivo

Fonte de instruções de design: authentic-design v0.2.0 congelada, incluindo `ux-and-content.md`, `art-direction.md` e `review-and-validation.md`. Foram usados apenas o pedido fornecido, essas instruções e os seis registos do pedido. Não houve consulta de outros ensaios, memórias, referências visuais ou investigação com participantes.

**Tarefa → estrutura → expressão → decisões → compromisso → validação:** encontrar uma história e guardar uma leitura → índice pesquisável, temas, ficha integral e coleção → catálogo de vozes com espaço para as palavras → títulos e pessoas antes dos metadados, excertos no índice, transcrição em corpo maior → sem imagens contextuais, a escolha depende da leitura; a ficha exige uma abertura → modelo e fonte verificados, apresentação e interação no navegador ainda não verificadas.

## Direções consideradas

1. **Linha temporal:** agrupar pelo ano do registo e apresentar histórias em sequência. Torna as datas centrais, embora o pedido priorize encontrar um assunto; a data do registo também não estabelece a data dos acontecimentos narrados. Não escolhida.
2. **Prateleiras temáticas:** três grupos de histórias com grandes excertos e uma coleção lateral permanente. Facilita a exploração inicial, mas repete cabeçalhos e divide a atenção da pesquisa. Não escolhida.
3. **Índice de leitura:** temas na margem, pesquisa sobre uma lista contínua de títulos, pessoas e excertos, com uma ficha individual. Escolhida por juntar a exploração e a procura explícita, conservar o contexto dos resultados e acomodar seis textos sem fotografias inventadas.

Estas foram alternativas conceptuais, não três protótipos renderizados. A hipótese é que excertos e nomes ajudam a escolher uma história; não é uma conclusão de pesquisa.

## Decisões executadas

- A navegação separa **Arquivo** e **A minha coleção**, com contagens reais. A mudança de vista repõe a pesquisa e o tema para não esconder inadvertidamente leituras guardadas.
- Pesquisa em títulos, pessoas, transcrições, temas, identificadores e datas; termos combinados por interseção, sem distinção de maiúsculas ou acentos. Tema e pesquisa são combináveis. O estado sem resultados mostra as restrições e oferece limpeza; a coleção vazia conduz ao arquivo.
- Os identificadores VB-01 a VB-06 são os identificadores reais do conjunto fornecido. Datas são identificadas como datas do registo na ficha. Os excertos abreviados usam `[…]`; a ficha apresenta cada transcrição integral sem alterações.
- Fundo azul acinzentado, tinta azul escura, azul de ação e amarelo para a ação guardada. Texto, ícone preenchido, `aria-pressed` e contagem acompanham a mudança de estado; a cor não a comunica sozinha.
- Arial/Helvetica para navegação, nomes e títulos; Georgia para as palavras transcritas. Apenas fontes do sistema. Tipografia, índice e texto dão caráter ao arquivo sem retratos, localizações ou documentos históricos fictícios. O pequeno símbolo de citação do cabeçalho é SVG original embutido.
- No desktop, orientação e temas ocupam a margem esquerda. Até 760 px, tornam-se introdução compacta e controlos de tema em linhas; os registos ficam numa coluna. A ficha usa `dialog` nativo e ocupa o ecrã do telefone. Breakpoint adicional aos 370 px. A dimensão real desses estados ainda não foi observada.
- Botões sem dependência de hover, ligação para saltar para o conteúdo, etiquetas de pesquisa, foco visível, fecho explícito, Escape nativo e devolução de foco. O diálogo bloqueia a rolagem do fundo; a notificação entra no diálogo quando ele está aberto.
- Coleção em `localStorage`, chave `vozes-do-bairro:collection:v1`, com validação dos IDs e sincronização entre separadores. Uma falha de armazenamento informa que as alterações duram só nesta página. Não há conta, servidor, análise de utilização, rede ou áudio.
- Conteúdo fictício identificado no rodapé e na ficha. Não são apresentados controlos de reprodução. O movimento de entrada é curto e só existe quando não se pede movimento reduzido.

## Entrega

- `index.html`: estrutura semântica e ficha de leitura.
- `styles.css`: tokens, apresentação e transformações responsivas.
- `archive-model.mjs`: seis registos, pesquisa, coleção e datas.
- `app.mjs`: interação, diálogo e armazenamento local.
- `DESIGN.md`: este registo.

Os caminhos são relativos; o protótipo destina-se a uma pasta servida por HTTP, incluindo subpastas. Não depende de instalações ou recursos remotos. O `REQUEST.md` fornecido foi preservado.

## Verificação realizada e limites

- `node --check app.mjs` e `node --check archive-model.mjs`: sem erros de sintaxe.
- 26 asserções Node: seis IDs únicos, temas, pesquisa por pessoa e transcrição, acentos, múltiplos termos, combinação de tema e pesquisa, ausência de resultados, coleção vazia e filtrada, adicionar/remover, serialização e restauro, descarte de IDs desconhecidos, rejeição de armazenamento malformado e formato de data em pt-PT. Datas e extensão de todas as transcrições também verificadas.
- Comparação automática dos seis registos com o pedido, campo a campo, sem diferenças.
- Inspeção por parser HTML: 30 IDs únicos; referências ARIA, etiquetas e referências DOM do JavaScript resolvidas; três ligações locais relativas existentes. Chavetas CSS equilibradas e breakpoints presentes. Isto não equivale a validação CSS completa.
- Oito pares de texto/fundo medidos: 4,82:1 a 11,80:1, todos acima de 4,5:1. Não foi feita uma auditoria de todos os estados nem dos contrastes não textuais.
- **Não foi aberto navegador, iniciado servidor, capturada imagem, instalado pacote ou usado agente adicional.** Não foram verificados visualmente tamanhos de ecrã, reflow, zoom, teclado, leitor de ecrã, foco nativo do diálogo, comportamento touch, persistência após um recarregamento real ou sincronização entre separadores. A serialização foi testada em memória; a utilização do `localStorage` foi inspecionada no código.
- Não se afirma conformidade integral de acessibilidade, qualidade visual comprovada ou eficácia com utilizadores. Uma próxima validação externa deve percorrer pesquisa → ficha → guardar → coleção → recarregar → remover; testar pesquisa sem resultados e verificar a ficha e o foco num telefone e num desktop.
