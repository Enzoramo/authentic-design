# Barro — decisões

## Tarefa e factos

Escolher uma taça comparando diâmetro, capacidade, preço e disponibilidade; adicionar ao saco, alterar quantidades e remover. O brief fornece três tamanhos, o grés feito à roda e o vidrado aveia. Grande está indisponível. A marca e o comércio são fictícios. Não há investigação com utilizadores nem afirmações de desempenho comercial.

## Alternativas consideradas

1. **Bancada de peças:** fotografia dominante à esquerda e ficha com tamanhos alinhados à direita. Mantém a família visível e reúne a decisão num só lugar. Exige uma fotografia clara e dá menos espaço a histórias da oficina.
2. **Catálogo comparativo:** três colunas de tamanhos com métricas e compra individual. Facilita comparar, mas cria três produtos visualmente repetidos para uma só forma; precisaria de fotografias individuais que não existem.
3. **Percurso pela oficina:** apresentação editorial do processo, seguida da seleção. Explicaria o trabalho manual, mas atrasaria a escolha e exigiria conteúdo documental ausente.

## Direção selecionada

Bancada de peças. A fotografia apresenta a matéria e os três tamanhos; a lista de seleção permite comparar todas as métricas sem trocar de ecrã. A linha indisponível continua legível, com texto explícito e controlo desativado. Média é o ponto de partida, como hipótese conveniente, não como recomendação ou suposto bestseller.

Fundo de papel quente, texto castanho escuro, serif para o nome da peça e sans para decisões. Linhas contínuas organizam opções e dados; não há grelhas de benefícios, promoções ou testemunhos. O ponto terracota da marca e a linguagem breve dão caráter sem competir com o produto. Fontes locais evitam pedidos externos.

Em mobile, fotografia, descrição e seleção formam uma coluna; a nota material redundante desaparece. O saco é um diálogo nativo lateral, de largura integral nos ecrãs pequenos. Adicionar abre o resultado, com preço por unidade, quantidades e total. Fecho, Escape e clique no fundo devolvem o foco. O estado é guardado localmente quando possível; dados inválidos são ignorados. Não há checkout.

## Limites e validação

A fotografia gerada foi fornecida em `assets/bowls.png` e inspecionada; é apresentada inteira em proporção 3:2. Não representa uma peça fabricada ou comprova escala exata. A comparação utiliza as medidas escritas. O limite de 99 unidades por tamanho é uma restrição técnica da demonstração.

Verificado: `node --check app.js`, parsing HTML, unicidade dos 16 IDs, referências de rótulos e presença de todos os recursos locais. Contrastes calculados: texto principal 12,14:1; secundário 5,27:1; secundário na seleção 4,75:1; terracota 7,44:1. A inspeção da interface, interações no navegador, reflow, teclado e foco serão feitas pelo agente principal. Estes checks não demonstram conformidade de acessibilidade ou usabilidade.

## Revisão e verificação posterior

A revisão retirou numeração ornamental, rótulos repetidos e texto poético sem informação, deu nome concreto à peça (Taça Aveia), aumentou a legibilidade de capacidade/preço e os controlos de quantidade para 44 px. A identidade material, a fotografia e a comparação de tamanhos foram preservadas. O agente principal verificou seleção, indisponibilidade, soma de tamanhos, quantidades, remoção, estado vazio, persistência, Escape e retorno do foco no Chrome; inspecionou desktop e 390/320 px. Sem compra real, participantes ou auditoria integral de acessibilidade.
