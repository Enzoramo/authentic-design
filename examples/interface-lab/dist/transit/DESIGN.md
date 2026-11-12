# Linha — decisão de design

**Tarefa → estrutura → expressão.** O despachante compara quatro veículos, inspeciona a linha selecionada e atribui um reforço reversível. Lista, esquema e ação partilham o mesmo espaço operacional. A sinalética de transporte informa os identificadores azuis, o percurso contínuo e as paragens. São hipóteses de design baseadas no brief, sem investigação com utilizadores.

## Alternativas consideradas

1. **Mapa central.** Favorece procura geográfica, mas sugeriria precisão inexistente neste cenário fictício.
2. **Quadro por estado do incidente.** Evidencia progressão, mas usa demasiado espaço para quatro veículos; mover uma ficha poderia sugerir que o atraso foi resolvido.
3. **Lista e inspeção adjacentes — escolhida.** Preserva comparação, contexto e recuperação, deixando o reforço junto dos dados necessários à decisão.

## Prioridade e revisão

A inspeção do agente principal encontrou excesso de altura no cabeçalho da primeira versão e a atribuição abaixo do primeiro ecrã. A revisão reúne título e resumo numa barra compacta, retira texto motivacional e passos numerados, junta autocarro, atraso e passageiros ao cabeçalho selecionado e elimina a métrica redundante de paragens. O SVG desktop tem altura de 220 px; escolhas de reserva e botão partilham uma faixa. O primeiro ecrã foi dimensionado para conter a ação em 1470 × 835, sujeito à nova verificação do agente principal.

Superfícies neutras frias separam grupos. Azul identifica linhas e ações; âmbar sinaliza atraso; verde assinala pontualidade ou uma atribuição concluída. Texto e símbolos distinguem os estados. Dados essenciais têm 12–16 px na interface e as etiquetas SVG usam 14–15 px antes da escala. A tipografia de sistema e os números monoespaçados apoiam leitura e comparação.

No telefone, o percurso torna-se vertical. A seleção leva ao detalhe com o identificador visível e um botão «Voltar aos veículos», que devolve foco à seleção atual. Resultado e desfazer continuam na mesma inspeção. Controlos nativos, foco visível, anúncios e descrições SVG apoiam teclado e leitura assistida.

## Comportamento, evidência e limites

Dados originais, filtros, atribuição R01/R02, exclusividade das reservas e desfazer preservados. Apenas linhas atrasadas aceitam reforço. O atraso observado não desaparece após atribuição. Recarregar reinicia o cenário. Paragens intermédias, posições e registo são fictícios; não existe despacho ou integração real.

Verificados localmente: sintaxe JavaScript, integridade de assets, dados originais e contrastes principais. A renderização, reflow, teclado e comportamento final serão novamente verificados pelo agente principal. Não houve testes com participantes nem auditoria completa de acessibilidade.

## Verificação posterior do agente principal

Em 12 de novembro de 2026, o agente principal inspecionou a versão renderizada no Chrome, executou a tarefa principal e os estados de recuperação em desktop e em 390/320 px. Consulte o relatório da rodada para os passos observados e limites. Esta verificação é posterior às verificações de fonte descritas acima.
