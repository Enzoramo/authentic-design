# Revez — decisões e verificação

## Base e âmbito
- Requisitos observados: catálogo fictício com cinco objetos; pesquisa e filtro; detalhe e histórico; empréstimo revisto e cancelável; devolução confirmada; desfazer última operação; persistência local; data fixa 13/11/2026; português; desktop e telefone.
- Hipótese de uso: uma pessoa da biblioteca procura o código no balcão e precisa confirmar pessoa/data antes de alterar a disponibilidade. Não há investigação com participantes.
- Estrutura: catálogo pesquisável → ficha do objeto → empréstimo (dados, revisão, confirmação) ou devolução (revisão, confirmação). Cancelar nunca grava. Histórico fica na ficha; desfazer reverte a última mutação, incluindo histórico.
- Erros relevantes: emprestar um objeto indisponível; confundir objeto/código; aceitar data anterior à demonstração; guardar silenciosamente sem persistência.

## Exploração visual, antes da escolha
`direction-study.html` compara o mesmo conteúdo e controlos em três expressões:
- A, caderno: colunas e linhas contínuas, títulos serifados, anotação azul sobre fundo claro; favorece leitura transversal e associação ao registo escrito.
- B, etiquetas: código numa área persistente, nome e estado juntos, fichas claras sobre superfície terracota pálida; diferencia o identificador físico da situação transitória. Relação com etiquetas é hipótese gráfica, não relato histórico.
- C, circulação contínua: estado por faixa, texto sem serifa e detalhe escuro; mantém continuidade entre catálogo e ponto de ação.

Inventário local inspecionado: Trebuchet MS, DIN Alternate, Optima, Palatino, Baskerville, Avenir Next, Arial e Georgia estão instaladas no host. Não há cópias de fontes nem pedidos remotos; famílias de fallback explícitas. B contém comparação focada Trebuchet/Optima mantendo geometria, conteúdo e cores, com Revez na grafia fornecida. Nenhuma direção escolhida antes das capturas.

## Verificação
Pendente: capturas neutras do estudo, escolha fundamentada, implementação e exercício do produto.
