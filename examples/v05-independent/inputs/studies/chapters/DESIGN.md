# Minuto — registro de design

## Evidência, requisitos e hipóteses

- Fonte: pedido do ensaio e skill authentic-design v0.5.0 congelada. Não foram consultados projetos, memória ou referências externas.
- Requisitos: editor estático em português; episódio fictício fixo de 18:40; capítulos ordenados, horários únicos em mm:ss, primeiro fixo em 00:00; selecionar, renomear, adicionar, excluir com confirmação, desfazer, persistir e exportar TXT.
- Hipótese de uso: a pessoa alterna entre corrigir um ponto de entrada e conferir o intervalo até o próximo capítulo. Não há pesquisa com participantes.
- Consequência de erro: deslocar um ponto muda também a duração do capítulo anterior. A edição precisa ficar separada do estado salvo, com validação que conserve os campos digitados.

## Estrutura da tarefa

Seleção na lista ordenada → formulário do capítulo → salvar com validação → revisar sequência e intervalos → baixar texto. O primeiro item explica sua posição fixa. Adição usa o mesmo formulário. Exclusão exige confirmação identificando capítulo e horário; desfazer restaura a última alteração aplicada. Rascunhos inválidos não alteram a lista.

## Estudo, antes da seleção

`direction-study.html` compara o mesmo episódio, quatro capítulos, ação e erro de horário duplicado:

- A, Margens de edição: horários em coluna estável, títulos alinhados, duração na margem oposta e formulário com limite lateral. A associação editorial é hipótese, não referência histórica. Fonte Avenir Next, com numerais tabulares.
- B, Caderno de cortes: títulos Georgia, horários Menlo, sequência escura e folha clara de correção dentro de uma moldura contínua.
- C, Blocos de tempo: módulos contíguos de alturas variáveis; Trebuchet MS com título e dados em peso forte, seleção pêssego sobre verde claro.

Inventário local consultado: Avenir Next, Helvetica Neue, Georgia, Menlo e Trebuchet MS estão em `/System/Library/Fonts` ou Supplemental. Fontes são usadas apenas por nome, sem copiar arquivos. Não há fontes remotas.

Comparação focada anexada: Avenir Next / Helvetica Neue na mesma composição A, com nome fornecido “Minuto” e alternativa em maiúsculas. Seleção pendente de capturas neutras; interface completa ainda não implementada.
