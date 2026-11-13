# Palavra — decisão e validação

## Tarefa e evidência

O pedido define um principiante lusófono, seis expressões francesas, três escolhas por pergunta e uma pontuação fiel à primeira tentativa. Não foram fornecidos estudos, marca ou dados de aprendizagem. Produto e estado são uma demonstração fictícia, identificada no rodapé. O progresso só existe na memória desta página.

Orientação utilizada: exclusivamente a cópia congelada de authentic-design v0.2.0 e as referências `ux-and-content.md`, `art-direction.md` e `review-and-validation.md`. Não foram consultadas outras experiências, memórias ou projetos.

## Direções consideradas

- **Folha de exercícios:** seis perguntas simultâneas. Facilita comparação, mas aumenta a quantidade de decisões e torna a correção menos localizada.
- **Baralho de cartões:** um cartão que vira para revelar a tradução. A metáfora é adequada ao vocabulário, mas a transformação esconde a escolha original e complica o registo de erros.
- **Par francês–português, escolhido:** expressão num lado, escolhas e correção no outro; seis segmentos mostram a sequência real. O resultado reúne traduções e primeiras respostas erradas.

## Decisão aplicada

Praticar uma expressão → separar origem, escolha e correção → composição bilingue → painel azul para a expressão, painel branco para a ação. A tipografia grande dá espaço à palavra francesa sem introduzir uma página de apresentação. A mesma divisão transforma-se em resultado inicial / revisão no fim. Não há fotografia necessária ou recursos em falta; toda a expressão visual usa texto e CSS locais.

Abaixo de 760 px, os painéis ficam empilhados e a expressão ocupa uma faixa mais curta. O tipo de sistema, controlos de rádio nativos e botões de pelo menos 54 px favorecem reconhecimento e utilização por toque. Corretas e erradas também recebem símbolos e texto. Cores principais: tinta `#192037`, fundo `#f0f2f8`, ação `#273bc9`, correção positiva `#176547` e erro `#96372f`.

A resposta pode mudar até ser verificada. Depois fica bloqueada, a tradução correta é explícita e o avanço exige uma ação. A revisão só contém os erros da sessão original; mantém as escolhas originais e não substitui a pontuação. Uma sessão perfeita apresenta as seis traduções e não oferece uma revisão vazia. Nova sessão limpa o estado e baralha expressões e escolhas.

Tradeoff: não há persistência entre recarregamentos. A revisão reutiliza todos os erros iniciais, mesmo depois de acertados; a interface distingue o resultado dessa revisão da pontuação inicial.

## Verificação efetuada

- `node --check app.js` e `node --check practice.js`: sintaxe válida.
- `node checks.cjs`: sete verificações do modelo passaram. Incluem conteúdo exato, ausência de seleção, bloqueio após verificar, 6/6, 0/6, 3/6 com duas revisões e reposição de estado.
- Referências HTML locais e relativas verificadas; nenhuma dependência remota.
- Contraste calculado: texto/fundo 14,40:1; secundário/fundo 5,54:1; branco/azul 8,22:1; contexto/azul 6,65:1; correto/fundo 6,41:1; erro/fundo 6,61:1.
- Inspeção estática de estrutura semântica, foco programático, indicadores não dependentes de cor, breakpoints e redução de movimento.

**Limites:** por instrução, não foi aberto um navegador, iniciado um servidor ou instalado qualquer pacote. Não foram observados renderização, dimensões reais do viewport, reflow a 320 px, zoom, teclado, leitor de ecrã ou interação DOM. Os testes exercitam a lógica de estado; não comprovam a experiência visual ou conformidade de acessibilidade. O suporte a computador e telemóvel está implementado em CSS e aguarda essa inspeção. Não houve testes com utilizadores.

## Entrega

`index.html`, `styles.css`, `practice.js`, `app.js`; `checks.cjs` permite repetir as verificações locais. Servir esta pasta em qualquer subdiretório e abrir `index.html`. Sem instalação ou compilação.
