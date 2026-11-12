# Linha — decisão de design

**Tarefa → estrutura → expressão.** Um despachante compara quatro veículos, identifica atrasos e escolhe um reforço. A estrutura aproxima a lista operacional do percurso selecionado e da atribuição reversível. A expressão vem da sinalética de transporte: números de linha fortes, traçado contínuo, paragens numeradas e informação breve. É uma hipótese de design baseada no brief, sem investigação com utilizadores.

## Alternativas consideradas

1. **Painel geográfico central.** Facilitaria procurar veículos por zona, mas a localização é fictícia e a geografia não é necessária à decisão. Um mapa dominante sugeriria uma precisão inexistente.
2. **Quadro de incidentes por prioridade.** Colunas de atraso, ação e resolução tornam o fluxo evidente, mas quatro veículos não justificam esse espaço; mover uma ficha também poderia sugerir que o atraso foi resolvido.
3. **Mesa de controlo com lista e esquema — escolhida.** Preserva a comparação dos veículos e a relação entre linha, autocarro, passageiros e reforço. A seleção, a atribuição e a recuperação ficam no mesmo contexto.

## Regras aplicadas

Verde escuro organiza a interface; terracota identifica a linha inspecionada e os atrasos; texto e símbolos distinguem estados sem depender apenas da cor. A tipografia de sistema mantém boa leitura e os números operacionais usam monoespaçada. A área de acompanhamento tem densidade maior; o esquema oferece espaço para interpretar sequência e posição.

No telefone, a inspeção passa para baixo da lista, a seleção leva ao detalhe e o percurso transforma-se numa sequência vertical com etiquetas legíveis. Controlos nativos, foco visível, anúncios de estado e descrições SVG dão suporte ao teclado e à leitura assistida. O histórico secundário fica oculto abaixo de 900 px; o resultado atual e a ação de desfazer permanecem visíveis.

## Comportamento e limites

Todos/Com atraso, inspeção, escolha R01/R02, atribuição, indisponibilidade por reserva ocupada e desfazer usam estado local. Apenas linhas com atraso podem receber reforço neste exercício. Atribuir uma reserva não altera os minutos observados. As duas reservas podem ser atribuídas a linhas diferentes. Recarregar reinicia o cenário. As paragens intermédias são fictícias. Não há localização real, integração, despacho ou previsão de recuperação.

**Validação:** sintaxe JavaScript e integridade estrutural verificadas localmente; rácios de contraste principais calculados. A inspeção visual, reflow, teclado e interações no browser ficam a cargo do agente principal, conforme a restrição desta avaliação. Não foram feitos testes com participantes nem uma auditoria completa de acessibilidade.
