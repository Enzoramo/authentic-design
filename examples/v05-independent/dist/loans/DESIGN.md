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
Estado inicial do estudo: aguardava capturas antes da seleção. O resultado final está documentado abaixo.

## Seleção após renderização
Capturas recebidas e inspecionadas com `view_image`: estudo desktop, viewport **1440 × 1000**, documento 1440 × 2144; telefone, viewport **390 × 844**, documento 390 × 3750. Não houve orientação estética do serviço.

**Escolha: B, etiquetas de balcão.** Nas imagens, o código ocupa uma coluna estável e o nome fica imediatamente acima da situação. Os intervalos entre fichas separam os objetos sem separar o estado do seu nome. A ficha maior repete a borda da seleção, portanto a relação catálogo/objeto não depende de um ícone. No telefone, as áreas de código mantêm largura e os nomes continuam reconhecíveis. Esta é uma hipótese de adequação visual, não uma melhoria medida com pessoas.

- **Tipo:** Trebuchet MS para nome, conteúdo e controlos; DIN Alternate para códigos. A distinção de função vem do desenho compacto e da coluna fixa dos códigos, não de uma segunda tipografia ostensiva nos títulos. O `Revez` fornecido mantém caixa normal e recebe peso forte e espaçamento curto para ser reconhecido na linha compacta de cabeçalho; não herda as capitais dos códigos.
- **Comparação focada:** mantendo cor e geometria, o segundo espécime (stack Optima) apresenta contraste de traço mais marcado no nome e em “Caixa de som”. O primeiro mantém peso e abertura mais próximos entre nome de produto, nome de objeto e dados. Escolheu-se esta continuidade, aceitando uma expressão menos literária. As imagens provam a aparência observada, **não a origem da fonte por glifo**: o serviço não expõe essa origem. Inventário local e stacks foram verificados; portabilidade para outros sistemas usa Arial/sans-serif. Nenhuma fonte proprietária é distribuída.
- **Superfícies e cor:** o fundo terracota pálido agrupa o espaço de trabalho, as fichas claras contêm os registos e o tom escuro quente é texto. A terracota escura marca seleção e ação. Verde é apenas disponibilidade; atraso também usa texto explícito. A paleta é uma decisão visual assumida; não decorre de uma associação obrigatória com bibliotecas.
- **Contracaso:** B dedica mais área e contraste aos códigos que A, cuja continuidade de linhas produz um catálogo mais compacto. A é uma alternativa funcional e clara, não um espécime descartado por problema inventado. C dá mais peso visual à ação com o painel escuro, mas o painel e o canto arredondado têm uma relação menos direta com a identificação dos objetos. B foi escolhida pela correspondência consistente entre cada etiqueta e a ficha em consulta; paga-se com mais espaço entre linhas e menos continuidade horizontal.
- **Identidade sem nome/acento:** permanecem coluna de código em superfície própria, fichas retangulares separadas, alinhamento nome/estado, ficha de detalhe com topo delimitado e histórico abaixo de divisória. Não é apenas uma cor aplicada a cartões genéricos de marketing.

## Implementação
`index.html`, `styles.css`, `model.js` e `app.js`: ficheiros estáticos, sem build, bibliotecas remotas ou pedidos de rede. `localStorage` conserva dados e um snapshot da última operação. A escrita acontece antes de publicar sucesso na interface; falha de armazenamento mantém o registo anterior. Um estado guardado inválido ativa consulta sem sobrescrever os dados. Nome e data são validados no formulário e no modelo. A revisão não altera estado; confirmar é o único ponto de gravação.

Desktop apresenta catálogo e ficha lado a lado. No telefone, abrir um objeto mostra a ficha com “Voltar aos objetos”, em vez de empilhar toda a lista antes da ação. O mesmo identificador acompanha ficha, revisão e histórico. Diálogo nativo mantém interação modal, Escape cancela e o foco regressa ao contexto. Elementos de formulário têm labels, mensagens associadas e foco visível; estados incluem texto. Fontes e espaçamento usam fallbacks locais, sem imagens fictícias nem recursos ausentes.

## Verificações locais executadas
- `node --test model.test.cjs`: **8 testes passaram**: dados iniciais e atraso; pesquisa sem acentos/código/filtro; validação de nome e data real; mutação somente após empréstimo; bloqueio de indisponíveis; devolução, serialização e desfazer; desfazer apenas a última operação; recusa de dados persistidos inválidos.
- `node --check app.js`: sintaxe válida.
- Contraste calculado nos pares implementados: texto principal/ficha 13,94:1; secundário/ficha 6,67:1; secundário/fundo 5,13:1; branco/ação 6,15:1; disponível 6,09:1; atraso 6,61:1; foco/fundo 5,12:1. Estes são cálculos de cor, não uma auditoria completa de acessibilidade.
- Capturas e ações de navegador foram posteriormente executadas pelo serviço neutro; resultados abaixo.

## Limites
Demonstração local com dados fictícios e data fixa. Os dados pertencem a este navegador/origem e podem ser apagados ao limpar o armazenamento; não há servidor, sincronização ou contas. Histórico inicial representa apenas os empréstimos fornecidos, sem inventar datas de início. A origem efetiva de cada fonte não foi identificada pelo serviço. Não houve teste com participantes nem alegação de conformidade global de acessibilidade.


## Validação visual e de interação concluída
As imagens foram produzidas pelo serviço neutro e todas foram inspecionadas com `view_image`. O avaliador não fez alterações nem orientou a escolha estética. Cópias locais em `evidence/`.

| Evidência | Dimensões reais | Observação |
| --- | --- | --- |
| `ui-desktop-initial.jpg` | 1440 × 900 | Pesquisa, filtros, situação dos objetos, ficha e ação principal na abertura; último objeto continua junto ao limite inferior. Código e nome mantêm a relação do estudo B. |
| `ui-mobile-initial.jpg` | 390 × 844 | Catálogo utiliza largura disponível, filtros quebram em duas linhas, nome e situação permanecem juntos. |
| `ui-mobile-detail.jpg` | 390 × 844 | Ficha C04, Rui, prazo, atraso, ação e histórico visíveis. A seleção substitui o catálogo nesta largura. |
| `ui-mobile-return.jpg` | 390 × 844 | Confirmação explicita objeto, pessoa, prazo e disponibilidade resultante. |
| `ui-mobile-error.jpg` | 390 × 844 | Ana preservada; data anterior gera erro junto ao campo, com foco visível. |
| `ui-mobile-review.jpg` | 390 × 844 | Revisão de F01/Ana/13-11; cancelar e confirmar visíveis. |
| `ui-320-list.jpg`, `ui-320-form.jpg` | 320 × 740 | Lista sem deslocamento horizontal; formulário mantém campos e ações no diálogo. Botões passam a coluna. |
| `ui-320-revised-undo.jpg` | 320 × 740 | Captura após reload da revisão final, com status de operação desfeita. |

O serviço verificou por interação:
- Vazio exige nome/data; 12/11/2026 é rejeitado; nome permanece.
- Cancelar na revisão mantém F01 disponível e sem histórico.
- Confirmar F01 para Ana em 13/11/2026 e recarregar mantém empréstimo e histórico. Desfazer retorna ao estado original.
- Devolver C04 e recarregar mantém disponibilidade. Desfazer restaura Rui, prazo 10/11/2026, histórico anterior e atraso de três dias.
- Pesquisa `maquina` e `P02`, ausência de resultado e recuperação, filtro dos dois disponíveis e manutenção de E05 funcionam; E05 não permite empréstimo.
- Escape fecha o formulário e devolve foco a “Registar empréstimo”.
- Largura do documento igual ao viewport nas larguras verificadas; nenhum erro nos logs do navegador.

Ajustes autônomos de implementação, sem orientação do avaliador: link de salto para o conteúdo visível; redação de sucesso/desfazer; foco de desfazer na linha do objeto quando o catálogo está visível no telefone. O serviço recarregou a revisão final e repetiu C04 → devolver → recarregar → desfazer a 320 × 740: estado restaurado, status correto e foco efetivo no botão “Abrir Caixa de som, C04. Com Rui · em atraso há 3 dias”. Nenhuma mudança visual foi necessária após as capturas do produto.

## Entrega final
- Abrir `index.html` num navegador com JavaScript e armazenamento local permitidos; também funciona servido por um servidor estático. Não há build.
- Produto: `index.html`, `styles.css`, `app.js`, `model.js`.
- Decisões: `DESIGN.md`; exploração: `direction-study.html`.
- Verificação reproduzível do modelo: `node --test model.test.cjs`.
- Evidência: `evidence/`, com estudos e capturas finais.
- Requisitos funcionais pedidos implementados e exercitados nos caminhos descritos. Limitações de demonstração local, portabilidade tipográfica e ausência de investigação com participantes permanecem conforme descritas acima.

Submissão final: ficheiros estabilizados após esta atualização de documentação; sem edições posteriores.
