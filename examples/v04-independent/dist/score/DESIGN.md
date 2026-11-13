# Pódio — decisões e verificações

## Base e âmbito

- **Requisitos:** marcador em português; partida fictícia Clara × Ivo; set a 11 com vantagem de 2; partida à melhor de 3; acrescentar ponto de qualquer jogador; desfazer até reabrir um set; consultar sets anteriores; confirmar nova partida; conservar o resultado ao recarregar; desktop e telefone; ficheiros estáticos locais.
- **Factos observados:** apenas o brief e o snapshot authentic-design 0.4.0 foram consultados, incluindo UX e conteúdo, direção de arte e revisão/validação. Não existe pesquisa com utilizadores nem identidade fornecida.
- **Hipótese de uso:** o telefone fica junto à mesa e é tocado entre jogadas; em desktop, o placar também deve poder ser lido sem procurar valores pequenos. Esta hipótese orienta alvos grandes e estados explícitos; não é um resultado de pesquisa.
- **Erro relevante:** um toque atribuído ao jogador errado ou o ponto final indevido. A recuperação permanece junto às ações de ponto e atua sobre todo o histórico, inclusive após vitória da partida.

## Modelo da tarefa

Ponto → placar do set e total de sets → eventual fecho do set → próximo set ou vitória da partida. A ação Desfazer remove o último ponto e recompõe a partida. Nova partida pede confirmação porque apaga o registo local. Sets concluídos permanecem numa súmula. O estado inicial é 0–0, sem atribuir pontos fictícios silenciosamente.

## Estudo visual

`direction-study.html` contém três espécimes com o mesmo conteúdo: Clara 8–6 Ivo no set 2; sets 1–0; set anterior 11–9; ações de ponto e desfazer.

1. **Duas metades:** a oposição dos jogadores gera campos contíguos, grande escala serifada e botões que ocupam cada metade. Azul-escuro estrutura a leitura; tonalidade clara diferencia áreas sem funcionar como único sinal de liderança.
2. **Marcador de bancada:** módulos de números condensados, nomes em caixa alta e anotações monoespaçadas. A superfície escura separa o ambiente dos valores claros e das ações. É uma associação visual proposta, não uma alegação histórica.
3. **Súmula viva:** linhas de registo, nomes serifados e números sem serifa; alinhamento nome/sets/pontos/ação. A ausência de blocos individuais mantém a folha contínua.

As três alternativas foram construídas antes de selecionar uma. Fontes são famílias de sistema com fallbacks locais; não há fontes, imagens nem serviços remotos.

## Seleção após inspeção

Inspecionei com `view_image` as capturas neutras `study-desktop.jpg` (viewport medido 1440×1000, página inteira) e `study-mobile.jpg` (390×844, página inteira). A escolha é **B — Marcador de bancada**.

- **Relação de origem:** o registo entre jogadas pede leitura repetida de dois números opostos; os dois módulos contínuos tornam o resultado o objeto dominante, enquanto nomes e sets identificam a quem pertence cada número.
- **Tipografia:** no render, Impact produz 8 e 6 densos com grande área interior, visivelmente diferentes dos algarismos serifados leves de A e da tabela com números menores de C. Impact também compõe a palavra PÓDIO; Arial dá legibilidade às ações e nomes; Courier New distingue a anotação de sets da pontuação corrente. São escolhas explícitas de famílias locais, não fontes descarregadas ou simuladas.
- **Cor/superfície:** fundo carvão contínuo; dois módulos âmbar para os pontos; texto marfim; texto auxiliar cinza-claro; botões cinza delimitados. A cor não identifica o líder — texto e total de sets fazem isso. A versão final reduz o peso do botão Desfazer a um contorno âmbar para não competir com os números, mantendo posição e linguagem.
- **Marca:** PÓDIO em caixa alta e proporção condensada partilha a construção numérica, sem ícone acrescentado. A identificação “Ténis de mesa” explica o domínio. Não é um conjunto de logo, ornamento e slogan.
- **Alternativa mais forte:** A também preserva a comparação lateral no telefone e tem maior continuidade entre nome e placar. A sua composição serifada é viável, não falhou no teste. Escolhi B porque a relação módulo/número e a leitura compacta continuam reconhecíveis no estado reduzido, sem depender do nome do produto.
- **Contracaso:** B dá mais peso aos blocos que aos nomes e usa mais área que C. Os números condensados têm menos elegância de leitura editorial que A. C seria a escolha mais económica para consultar vários resultados, mas aqui a interação repetida é marcar pontos do set atual. Este é um juízo de design apoiado nas capturas, não prova de melhor usabilidade.
- **Teste sem marca/acento:** neutralizar o âmbar e ocultar PÓDIO deixa os pares de módulos condensados, nomes laterais no desktop/superiores no telefone, marcas de dois sets e ações emparelhadas. A gramática não depende apenas da cor ou de um logótipo. A composição dos candidatos A e C mantém-se distinta.

## Implementação

- A abertura é 0–0. O quadro apresenta set atual, liderança no set e total de sets por pessoa. Cada nome tem duas marcas correspondentes aos dois sets necessários para vencer, acompanhadas por texto explícito.
- O telefone conserva os dois jogadores lado a lado, colocando os nomes por cima dos pontos. As ações são botões convencionais com nome do jogador e +1.
- O modelo conserva uma lista imutável de pontos. Ao desfazer, a partida é derivada de novo; isto reabre corretamente um set ou uma partida terminada. O set seguinte começa automaticamente em 0–0 e o set acabado vai para a súmula.
- O fecho da partida desativa os botões de ponto, conserva o último set e a súmula, mostra o vencedor e mantém Desfazer. O foco passa para Desfazer para não ficar num botão desativado.
- Nova partida usa `dialog` nativo, dá foco inicial a Continuar esta partida, permite Escape e restaura foco. A confirmação apaga o registo anterior e move o foco para Ponto Clara.
- `localStorage` guarda o histórico após cada ação, permitindo recuperar também o desfazer. Erros de leitura/escrita têm mensagem explícita; nenhum estado de armazenamento falhado recebe uma indicação falsa de gravação.
- Sem build, bibliotecas, contas, rede, imagem ou fonte externa. Abrir `index.html` num navegador moderno com JavaScript; armazenamento sujeito às permissões do navegador.

## Estado da validação

- **Modelo executado em Node:** 12 verificações passaram (`node score-model.test.cjs`). Cobrem início, ambos os jogadores, imutabilidade, fecho 11–0, 10–10/11–10/12–10, vantagens prolongadas até 30–32, desfazer o ponto final do set, desfazer atravessando set seguinte, vitória em dois sets e em três sets, rejeição de pontos após vitória, desfazer a vitória, serialização e dados inválidos.
- **Sintaxe:** `node --check app.js` passou.
- **Contraste calculado das cores declaradas:** marfim/carvão 16,27:1; cinza auxiliar/carvão 9,53:1; marfim/superfície de botão 12,36:1; carvão/âmbar 10,05:1; contorno/carvão 4,86:1; foco/carvão 12,62:1. Estes cálculos não constituem uma auditoria completa de acessibilidade.
- **Implementado por inspeção de código:** botões semânticos, nomes acessíveis, anúncio de alterações, foco visível, diálogo com título/descrição, retorno de foco, redução de movimento e tabelas com cabeçalhos. Não foi realizado um ensaio completo com teclado ou leitor de ecrã.
- **Interações operadas pelo serviço neutro e inspecionadas em capturas:** o serviço clicou nos botões reais, sem injetar armazenamento. As capturas `ui-desktop.jpg` (1440×1000) e `ui-mobile.jpg` (390×844) mostram o início em 0–0; `ui-tie-320.jpg` (320×740) mostra o empate 10–10 após 10 pontos de cada lado e a regra de vantagem; `ui-win-desktop.jpg` (1440×1000) mostra a vitória de Clara por 2–1, três sets anteriores e pontuação desativada; `ui-undo-mobile.jpg` (390×844) mostra o set 3 em 10–0, 1–1 em sets, após clicar Desfazer e recarregar.
- **Confirmação operada pelo serviço neutro:** `ui-reset-mobile.jpg` (390×844) mostra o diálogo e as duas opções integralmente. `ui-reset-cancelled.jpg` mostra que cancelar preservou o set 3 em 10–0; `ui-reset-confirmed.jpg` mostra o set 1 em 0–0 após confirmar e recarregar. Assim, a persistência e os dois ramos da confirmação têm evidência de execução no navegador, além dos testes de modelo.
- **Inspeção visual:** os dois jogadores, botões de ponto e Desfazer permanecem no viewport inicial de 390×844 e no estado 10–10 de 320×740. A súmula pode continuar abaixo da dobra quando a partida tem resultados, sem afastar as ações principais. A comparação lateral e os módulos numéricos do estudo B sobrevivem ao telefone e aos estados de empate e recuperação. Nenhum corte horizontal foi observado nas imagens fornecidas.
- **Ajuste durante a validação:** removi o símbolo ↗ do botão Nova partida, por sugerir navegação externa sem necessidade. As primeiras capturas ainda o mostram; a captura de desfazer e as posteriores já mostram o botão final apenas com texto. Não houve mudança de direção nem correção dirigida pelo avaliador.
- **Última inspeção:** `ui-desktop-final.jpg`, 1440×1000 com dimensões confirmadas no DOM, mostra a versão final em 0–0, com as ações e súmula vazia integralmente no viewport. `ui-win-mobile.jpg`, 390×844 também confirmado no DOM, mostra Clara vencedora por 2–0 após 22 cliques reais, botões de ponto desativados, Desfazer disponível, último set 11–0 e início da súmula. O restante da súmula fica acessível por deslocamento vertical. A leitura do vencedor combina texto, total de sets e marcas preenchidas, sem depender apenas do amarelo.
- **Limitações:** falhas reais de armazenamento, vários navegadores, zoom e leitor de ecrã não foram exercitados. Os ramos de erro existem no código e a rejeição de dados inválidos foi testada no modelo. O histórico é local ao dispositivo e não sincroniza entre pessoas/dispositivos, conforme o âmbito sem transmissão.
- Não há testes com participantes nem alegações de conformidade global, originalidade comprovada ou eficácia medida.

## Entrega final

- `index.html`: interface em português, utilizável sem build.
- `styles.css`: direção selecionada, estados e adaptações a desktop/telefone.
- `app.js`: registo de pontos, recuperação, confirmação, persistência e interface.
- `score-model.js`: regras e serialização sem dependências.
- `score-model.test.cjs`: 12 verificações executáveis com Node.
- `direction-study.html`: três propostas anteriores à escolha.
- `DESIGN.md`: este registo de decisões, verificações e limitações.

Trabalho concluído após a inspeção das capturas finais. Nenhuma publicação, instalação de serviço ou acesso a conta externa foi feito. O artefacto fica congelado nesta submissão.
