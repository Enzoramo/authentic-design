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

Comparação focada anexada: Avenir Next / Helvetica Neue na mesma composição A, com nome fornecido “Minuto” e alternativa em maiúsculas.

## Seleção depois das capturas

Capturas neutras inspecionadas com `view_image`: desktop, viewport real 1440 × 1000 e documento 1440 × 2986; telefone, viewport real 390 × 844 e documento 390 × 4481. O serviço informou as famílias CSS computadas, sem acesso à fonte de cada glifo. A presença no inventário e o desenho observado sustentam a escolha local, mas não provam a renderização em outros sistemas.

Escolha: **A, Margens de edição**. Os horários 00:00, 03:20, 08:15 e 14:10 formam uma coluna visual de maior escala que o restante da linha; os títulos permanecem legíveis e a margem direita contém a duração. O formulário lilás e sua linha lateral continuam identificáveis na captura estreita. A direção B oferece a separação mais forte entre sequência e correção e privilegia os títulos; C distingue a seleção com a maior área e sugere a continuidade dos intervalos. Ambas são viáveis, não foram eliminadas por supostos resultados de usabilidade.

Contracaso de A: o ritmo uniforme revela menos sobre as proporções de duração que C, e o formulário após a lista exige rolagem no telefone. A implementação responde com uma distribuição proporcional discreta acima da lista (sem funções de reprodução) e foco/rolagem para o formulário ao selecionar. A continua mais específica ao objetivo de conferir **pontos de entrada**; C seria a alternativa mais forte se a estimativa visual de proporções dominasse a tarefa. Isso é uma hipótese de design, não resultado medido.

Na comparação focada, Avenir Next deixa a linha “A primeira tentativa” mais aberta que Helvetica Neue e os números mantêm separação clara. O custo é ocupar mais largura. O nome “Minuto” conserva a forma fornecida; a maiúscula aumenta a presença horizontal sem esclarecer uma nova função. Nome em peso 600 e dados em peso normal, sem copiar a escala grande dos horários ou acrescentar símbolo. Arial é fallback explícito, sem redistribuir fontes.

Relacionamento de origem → sistema tipográfico → superfícies → nome: entradas separadas por intervalos → coluna de horários tabulares 28px / títulos 18px / durações 16px → papel claro, limites finos e campo lilás da edição, roxo para seleção e ação → Minuto em caixa normal e escala independente. Sem nome ou cor, o ritmo de horários grandes, títulos e duas margens de duração ainda organiza a sequência.

## Implementação e regras

- HTML/CSS/JavaScript locais, sem build, sem rede e sem dependências. `model.js` concentra regras; `app.js` usa DOM sem interpolar títulos em HTML.
- Campos são rascunhos separados da lista aplicada. Validação mantém o texto e aponta o campo; trocar de contexto pede descarte explícito quando necessário. Rascunhos também são persistidos.
- Primeiro início é somente leitura; exclusão indisponível com explicação. Mudanças reordenam e recalculam ambos os intervalos afetados.
- Exclusão usa dialog nativo com foco inicial em manter; a última alteração pode ser desfeita, inclusive após recarregar.
- Revisão mostra título, início, fim e duração. TXT usa exatamente `mm:ss Título`, uma linha por capítulo. Não há controles de áudio.
- `localStorage` guarda lista, rascunho e último estado; falhas de leitura/escrita geram aviso e não alegam persistência. Dados inválidos não são sobrescritos.
- Tokens: papel `#fbfafc`, texto `#302637`, secundário `#6a6072`, linhas `#ccc4d3`, seleção/ação `#54366e`, edição `#eeebf2`, erro `#963249`. A posição da barra e `aria-current` complementam a cor da seleção.
- Telefone: coluna única, foco no formulário ao selecionar, botão de retorno à lista, revisão modal com rolagem. Não há animação necessária.

## Verificação

Modelo executado com Node: intervalos iniciais, ordenação ao inserir/mover, limites e formato de horário, duplicação, título vazio, bloqueio do primeiro capítulo, exclusão, integridade de dados e conteúdo exato da exportação passaram. Sintaxe de `app.js` passou. A inspeção e as ações do produto implementado estão registradas abaixo.

Contrastes calculados a partir dos tokens sRGB: texto/papel 13,84:1; secundário/papel 5,72:1; secundário/edição 5,04:1; branco/ação 9,86:1; erro/edição 6,25:1; foco/papel 4,61:1. A primeira borda de campo tinha 2,63:1 contra branco e foi escurecida para `#8f7d99`. As medições não constituem auditoria completa de acessibilidade.


### Produto renderizado e exercitado

O serviço neutro forneceu capturas e evidências, sem orientação estética. As nove imagens (estudo e produto) foram copiadas para `evidence/` e inspecionadas com `view_image`.

- Desktop real **1440 × 900**: abertura e revisão. Lista, objeto atual, formulário e botão Salvar ficam no espaço de trabalho inicial; a distribuição temporal não simula reprodução. A revisão organiza começo, fim e duração sem perder a expressão tipográfica da sequência.
- Telefone real **390 × 844**: abertura, erro de duplicação e revisão. Lista vira coluna única; formulário selecionado é trazido à vista. Mensagem e edição 08:15 permanecem visíveis, com campos e ações sem sobreposição. A revisão contém os cinco capítulos e o botão Baixar.
- Telefone real **320 × 740**: lista alterada e erro de formato. Títulos longos quebram em linhas; ações do formulário permanecem legíveis. O erro “2:70” foi mantido no campo e explicado. A página usa rolagem vertical.
- Nos três tamanhos, a largura do documento foi igual à largura do viewport, conforme medição do serviço.
- Ações observadas pelo serviço: 08:15 duplicado, 18:40 fora do limite e 2:70 com formato inválido foram rejeitados sem perder a edição; 04:00 / “A tentativa seguinte” foi salvo; 02:00 / “Uma pergunta” foi inserido com ordem e intervalos corretos; 00:00 permaneceu somente leitura e não excluível; cancelar exclusão manteve o item, confirmar removeu, desfazer e recarregar restauraram os cinco capítulos. Não houve erros de console reportados.
- HTML: IDs únicos, CSS e scripts locais presentes. Não há chamadas a serviços externos. Conteúdo dinâmico usa textContent.

### Limites da evidência

O clique em Baixar .txt produziu a mensagem “Download solicitado: como-nasce-uma-ideia-capitulos.txt”. O evento de download não foi capturado pelo avaliador e a página interna de downloads foi bloqueada pela política do navegador; não houve contorno. Portanto, o arquivo baixado **não foi lido** no teste de navegador. O gerador de texto foi testado localmente com conteúdo exato, e a implementação usa Blob UTF-8 + atributo download.

Não houve teste com participantes, auditoria completa de acessibilidade, matriz de navegadores ou confirmação de fontes por glifo. A persistência depende de armazenamento local permitido; falhas possuem aviso explícito.

### Artefatos e uso

Abra `index.html` em um navegador. Não há build nem instalação. `styles.css`, `model.js` e `app.js` ficam ao lado do HTML. `direction-study.html` é material de decisão, fora do produto. Para repetir as regras de negócio: `node model.test.cjs`.


### Teclado e recuperação de rascunho

O serviço observou que Cancelar, com rascunho inválido, abriu a confirmação de descarte; descartar explicitamente manteve a lista. Enter em Excluir abriu com foco em Manter capítulo, Tab foi para Excluir; no segundo Tab, o activeElement foi BODY (o destino fora do controle não foi determinado). Escape devolveu o foco ao acionador Excluir. Na revisão, Enter abriu e Escape devolveu foco a Revisar e exportar.

Foi acrescentado um ciclo explícito de Tab e Shift+Tab entre primeiro e último controles dos dois dialogs, mantendo o comportamento nativo de fechamento e fundo inerte. Sintaxe revalidada. A repetição do serviço confirmou: exclusão abriu em Manter; Tab → Excluir; Tab → Manter; Shift+Tab → Excluir; Escape → acionador Excluir. Revisão: Shift+Tab de Fechar → Baixar .txt; Tab → Fechar; Escape → Revisar e exportar. Não houve mudança de dados nessa verificação.


## Estado final

Implementação e verificações concluídas. O download em disco continua como limitação explícita acima; o conteúdo do gerador foi verificado. Esta é a submissão final independente; nenhuma edição posterior à submissão foi realizada.
