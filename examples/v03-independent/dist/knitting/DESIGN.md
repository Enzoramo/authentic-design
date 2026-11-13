# Malha — registo de design e verificação

Entrega independente de 13 de novembro de 2026. Protótipo estático em português, sem build, dependências, serviços ou pedidos de rede.

## O que abrir

- `index.html`: produto funcional; abrir diretamente num navegador moderno ou servir esta pasta por um servidor estático já disponível. O funcionamento de `localStorage` em URLs `file:` depende das permissões do navegador; o produto mostra uma falha de armazenamento quando a operação não é permitida.
- `direction-study.html`: estudo visual de três direções, separado do fluxo do produto. Os botões dessa folha são espécimes desativados e identificados como tal.
- `styles.css`, `core.js`, `app.js`: estilos, transições de estado e interface/persistência.
- `verify.cjs`: verificações de lógica e integração com um substituto mínimo do DOM.
- `verify-static.py`: verificações das referências HTML, recursos locais e contrastes especificados.
- `verification.txt`: saída das verificações finais.

## Brief, evidência e hipótese

**Requisitos observados:** acompanhar um trabalho de 48 carreiras; saber a carreira atual e as concluídas; consultar o ciclo de quatro; avançar sem contar duas vezes; desfazer; saltar; concluir e reiniciar com proteção; conservar progresso ao recarregar; desktop e telefone; português; padrão fictício.

**Hipóteses de design:** a pessoa consulta a aplicação entre carreiras, possivelmente no telefone, com a atenção dividida entre a peça e o ecrã. Um contador grande, uma instrução curta e um único avanço evidente podem ajudar esse uso. Não houve entrevistas nem testes com participantes; estas hipóteses não são resultados de pesquisa.

**Dados:** apenas o Cachecol do Miguel e o padrão do brief. A interface identifica a amostra como fictícia e explica que não é uma receita completa. Não foram inventadas métricas, testemunhos ou contas.

**Âmbito respeitado:** somente o pedido e o snapshot da skill authentic-design 0.3.0, com as referências de UX, direção de arte e revisão. Nenhum projeto, memória ou resultado de outros agentes foi consultado. Não foi usado navegador. Não há ativos externos, publicação, instalação de serviços ou contas.

## Tarefa → estrutura → expressão → decisões → compromisso → verificação

**Tarefa:** retomar a carreira certa e terminar apenas uma carreira por ação.

**Estrutura:** nome do trabalho → carreira em curso e instrução → conclusão de uma carreira → desfazer/saltar → total concluído e régua → gestão do projeto. A sequência de quatro ocupa uma área ao lado no desktop e segue o contador no telefone. Não há uma página de apresentação antes da ferramenta.

**Expressão escolhida: régua e marcador.** O grande numeral serifado e a instrução têm pesos próximos; a régua contém doze blocos de quatro marcas, espelhando a repetição real do padrão; o painel de sequência usa quatro linhas e um marcador textual “Agora”. Superfícies claras e verde escuro sustentam o contraste. Mesmo sem nome ou cor, permanecem o numeral largo, a comparação com a instrução e os intervalos repetidos de quatro.

**Estudo prévio:** `direction-study.html` foi criado antes da interface principal e compara o mesmo título, carreira 7, instrução do passo 3, ação e seis carreiras concluídas. As alternativas foram um instrumento de contagem com numerais monoespaçados e um caderno pautado com composição inclinada. O primeiro concentra demasiado a identidade no contador; o segundo acrescenta linhas que competem com a leitura. A direção escolhida liga posição, ciclo e trabalho completo. O estudo inclui também uma composição estreita de conclusão; não foi renderizado.

**Compromissos:** não se apresenta uma lista de 48 números, pois a principal decisão é a carreira presente; a régua dá contexto e o salto permite correções precisas. O padrão é sempre consultável, mas fica abaixo do contador no telefone. O bloqueio de 1,4 segundos atrasa avanços deliberadamente rápidos e protege contra toques seguidos. Não há gestos escondidos nem alteração por clique na régua.

**Validação disponível:** testes determinísticos, integração com DOM substituto e inspeção de código. Sem renderização, nenhuma qualidade de composição, viewport real ou comportamento nativo foi declarada verificada.

## Estado e recuperação

- `completed` guarda o número concluído, de 0 a 48. Enquanto `completed < 48`, a carreira em curso é sempre `completed + 1`. Ao concluir tudo, não existe carreira em curso. Não há duas contagens independentes que possam divergir.
- O ciclo usa `((carreira - 1) % 4) + 1`. O texto “passo de 4” e “repetição de 12” distingue o passo da carreira absoluta.
- O avanço regista uma carreira e bloqueia novos avanços durante 1.400 ms. O instante é persistido e verificado na lógica, além do estado desativado do botão. Repetições de Enter/Espaço por tecla mantida são ignoradas nos botões.
- Desfazer restaura o estado anterior. Avanço, salto, conclusão e reinício entram no mesmo histórico, conservado após recarregar. O limite é 80 alterações, suficiente para desfazer as 48 carreiras e ajustes comuns; não é um histórico ilimitado.
- “Ir para uma carreira” explica que as anteriores ficarão concluídas, mostra uma prévia antes de confirmar e valida um inteiro de 1 a 48. Ao recuar, explica que as seguintes voltam a ficar por trabalhar.
- A conclusão da última carreira abre confirmação. A ação secundária “Concluir projeto…” também permite concluir cedo, mas explicita quantas carreiras ainda faltam marcar e pede confirmação de que todas foram terminadas.
- Reiniciar exige confirmação explícita com o total que será zerado. O foco inicial fica em Cancelar nas ações de conclusão/reinício. Ambas podem ser desfeitas.
- Cancelar e Escape fecham o diálogo sem alterar o estado; o foco regressa ao controlo que o abriu, ou à ação principal quando esse controlo deixou de estar disponível.
- O estado, histórico e revisão ficam em `localStorage`, chave `malha.cachecol-miguel.v1`. Não há sincronização de conta ou envio de dados. Remover dados do navegador pode apagar o progresso.
- Há deteção de alterações noutra janela e uma verificação antes de mutações; confirmações abertas com uma revisão antiga são canceladas. Isto não constitui sincronização transacional entre separadores com ações exatamente simultâneas.
- Se a gravação falhar, o produto mantém a sessão em memória, informa que a alteração não ficou guardada e não exibe sucesso de gravação no botão. Dados inválidos são sinalizados, sem substituição automática até à próxima alteração da pessoa.

## Regras visuais e acessibilidade implementadas

- Tipografia: Georgia/Times para identidade, título, numeral e títulos curtos; fontes de sistema para instruções e controlos. Não requer downloads de fontes.
- Cores: papel `#f7f4ec`, texto `#283e35`, verde de ação `#294d3c`, painel `#e8eddf`, texto secundário `#5d6a5d`, erro `#833e2f`. O texto secundário foi escurecido após um cálculo inicial insuficiente sobre o painel.
- Ritmo: a sequência de quatro linhas e os doze grupos da régua carregam a identidade. Os símbolos de pontos são ilustrações vetoriais/tipográficas decorativas, não uma notação de tricô normativa.
- Breakpoints em 1.000, 760 e 380 CSS px; uma coluna em telefone; numerais e espaços diminuem sem ocultar o comando principal. Em 320 CSS px a estrutura foi revista no código, mas não medida num viewport.
- Controlos semânticos, rótulos explícitos, foco visível, link para saltar, `<dialog>` nativo, estado anunciado com `aria-live`, seleção do passo com `aria-current`, erro associado ao campo e mensagem de falha de armazenamento. Cores são acompanhadas de texto/contorno.
- Sem animação contínua; transições breves respeitam `prefers-reduced-motion`. Zoom não é desativado. Áreas principais de toque têm 44–60 px de altura; gestão secundária e fechar têm 40 px; o resumo de detalhes tem 30 px.
- Os pares de texto principais calculados variam de 4,65:1 a 10,44:1. A cor de foco sobre o papel tem 5,16:1. Isto não é uma auditoria completa de acessibilidade.

## Verificações executadas

Comandos, a partir desta pasta:

```sh
node --check app.js
node --check core.js
node verify.cjs
python3 verify-static.py
```

Resultado: sintaxe JavaScript válida; **12 grupos de verificações aprovados**, incluindo a sequência completa, rejeição de toque repetido, conclusão final com confirmação, saltos válidos/inválidos, desfazer toda a peça, serialização, recarga simulada, cancelamento, reinício e falha de armazenamento. A integração executou o `app.js` real num DOM mínimo de teste; não executou um navegador.

A análise estática confirmou IDs únicos, referências ARIA e labels válidas, existência dos recursos locais, correspondência dos seletores JavaScript e sete pares de contraste. O ficheiro `verification.txt` contém os resultados finais.

## Limitações e próxima avaliação

Não houve renderização, capturas, inspeção de dimensões reais, interação num navegador, leitura com tecnologia assistiva ou pesquisa com participantes. A contenção de foco do diálogo nativo, Escape, toques físicos, comportamento em `file:`, tamanho real dos controlos, reflow, zoom e legibilidade visual precisam da avaliação de navegador prevista no pedido. O DOM substituto não comprova esses comportamentos.

Roteiro para o avaliador: abrir em desktop e a 320/390 CSS px; concluir uma carreira com toque duplo; desfazer e recarregar; saltar para 7 e verificar o passo 3; tentar 0/49/fracionário; saltar para 48 e cancelar/concluir; reiniciar e desfazer; rever a sequência e testar teclado. Abrir a direção escolhida ao lado do produto permite comparar a gramática visual sem assumir que a implementação já foi validada visualmente.

A entrega foi fechada após as verificações. Não haverá edição depois da submissão.
