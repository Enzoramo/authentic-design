# Zênite — decisões e verificação

## Entrega

Protótipo estático em português. Abrir `index.html` diretamente em um navegador com JavaScript. Não há build, instalação, chamadas de rede, contas ou dependências externas.

- `index.html`: sessão, navegação e estrutura semântica.
- `styles.css`: identidade, estados e transformações responsivas.
- `core.js`: alvos, registros, filtros, contagens e serialização.
- `app.js`: interface, edição, resumo e armazenamento local.
- `direction-study.html`: estudo visual independente com duas alternativas comparáveis; seus controles são amostras, identificadas como tal.
- `verify.cjs`: verificações da lógica, executáveis com `node verify.cjs`.
- `DESIGN.md`: este registro.

A entrega foi feita exclusivamente neste diretório. Foram lidos apenas o pedido, o snapshot da skill authentic-design e suas referências de UX, direção de arte e validação. Nenhuma outra skill, projeto, memória ou resultado foi consultado. Não foi operado um navegador.

## Base e hipóteses

**Exigências fornecidas:** sessão fictícia em 14 de novembro, Pátio do clube; Lua / satélite / 19h10, Saturno / planeta / 20h00, M42 / nebulosa / 21h15 e Plêiades / aglomerado / 22h00. Filtros por tipo e estado; seleção; resultados visto/não visto, nota opcional; revisão e edição; resumo e persistência ao recarregar. Português, desktop e telefone.

**Decisões assumidas:** os quatro alvos formam um roteiro fixo. O usuário registra um resultado por alvo, podendo alterá-lo depois. O armazenamento pertence a este navegador, sem sincronização ou colaboração. O contexto provavelmente inclui o uso à noite e uma mão ocupada, mas não há pesquisa com observadores para confirmar isso. Não se afirma que a paleta preserve a visão noturna.

**Simulação explícita:** sessão e horários são demonstrativos, não previsões astronômicas. A interface não informa posição, visibilidade, condições do tempo ou recomendações de observação. Os desenhos SVG são representações gráficas originais e decorativas, não mapas ou imagens científicas.

## Tarefa → estrutura → expressão → decisões → compromisso → validação

A pessoa percorre os alvos de uma noite e registra o que conseguiu observar → sequência cronológica com um editor por alvo e uma revisão agrupada por resultado → caderno noturno com a hora na margem e o nome do objeto como título da página → trilho de horários monoespaçados, divisórias contínuas, títulos serifados, estados escritos e controles convencionais → a lista ocupa espaço vertical no telefone, portanto selecionar um alvo leva o foco e a rolagem ao editor → fluxo coberto por inspeção de código e testes da lógica; composição e interação real ainda precisam de renderização.

### Alternativas materializadas antes da implementação

O arquivo `direction-study.html` contém os mesmos dados de Lua, horário, estado, nota e ação em duas propostas:

1. **Caderno noturno, escolhido:** conteúdo em uma superfície contínua escura; horário em margem lateral; nome serifado; divisórias finas; anotação abaixo. O editor e a sequência formam páginas vizinhas, em vez de cartões independentes. A luminosidade reduzida é uma hipótese de adequação ao contexto noturno.
2. **Ficha de arquivo:** papel claro, cabeçalho compacto e pesado, nome cursivo grande, horário em etiqueta e estado como carimbo. A composição remete a uma ficha para consulta diurna. Foi preterida por concentrar mais contraste luminoso na superfície e menos continuidade entre roteiro e registro.

A comparação foi realizada sobre os espécimes de código, sem visualização em navegador. A seleção é uma decisão de projeto, não um resultado de pesquisa nem prova de originalidade. Neutralizar o amarelo e remover a marca ainda deixa no escolhido a relação entre margem cronológica, títulos serifados e divisórias contínuas. No estudo alternativo, persistem o cabeçalho de ficha, a etiqueta de horário e o carimbo. O resumo reutiliza títulos, divisórias e a mesma hierarquia de estados.

### Regras de identidade

- Fundo `#171e23`; página de registro `#1b242b`; seleção `#25323a`.
- Texto principal `#eee8db`, secundário `#adb8bf`; acento `#debe82` para seleção e ação principal.
- Visto `#a9c9b8` + ✓ + palavra; não visto `#e6ad99` + × + palavras; pendente `#bdc4c8` + ○ + palavra. Nenhum estado depende só da cor.
- Georgia para marca, alvos e títulos da sessão; fontes do sistema para controles; monoespaçada para horários, pequenos indicadores e contadores. Sem fontes externas.
- Campos e botões têm bordas próprias `#677984`; divisórias estruturais podem ser mais discretas. Cantos de 3 px deixam os controles reconhecíveis sem fragmentar o caderno em cartões.
- Desenhos de cada alvo compartilham um círculo de referência e marcas de eixo. São secundários ao nome, estado e ação; usam `aria-hidden`.
- Sem animação decorativa. Foco visível, formulário nativo e rolagem sem movimento animado.

## Fluxos implementados

1. **Entrar:** os quatro alvos começam pendentes, Lua selecionada. Dados armazenados, se válidos, restauram os registros existentes.
2. **Filtrar:** tipo e estado se combinam; contador mostra os resultados. Se o alvo atual não corresponde, o primeiro resultado é selecionado. Sem resultados, há explicação e “Limpar filtros”.
3. **Registrar:** escolher Visto ou Não visto, escrever até 600 caracteres opcionais e salvar. O resultado aparece na lista, no detalhe, no progresso e no resumo. O resultado é obrigatório, a nota não.
4. **Revisar:** registro salvo aparece em modo de leitura. “Editar registro” restaura resultado e nota; salvar substitui o registro. “Cancelar edição” mantém o registro anterior. Mudanças não salvas geram confirmação antes de abandonar o formulário.
5. **Recuperar:** “Voltar a pendente” pede confirmação que explicita a remoção do resultado e da nota. Outro alvo não é alterado.
6. **Prosseguir:** após salvar, abrir o próximo pendente, ou revisar o resumo quando todos têm registro.
7. **Consultar resumo:** contagens e grupos separados para vistos, não vistos e pendentes, com notas e acesso ao registro de cada alvo.
8. **Persistir:** chave versionada `zenite.session.14-novembro.v1` em `localStorage`. O estado é salvo a cada resultado/edição/retorno a pendente. Sucesso persistente só é comunicado após a escrita. Se armazenamento falha, o caderno continua em memória com aviso de perda ao recarregar. Dados existentes inválidos são protegidos contra sobrescrita; novos registros ficam temporários nessa aba.

Salvar um resultado pode retirar o alvo do filtro atual. Nesse caso, o detalhe continua visível para confirmar e editar o que acabou de acontecer, com mensagem explícita e “Mostrar todos”. Isso evita que o resultado desapareça junto com a confirmação.

## Responsividade e acessibilidade implementadas

- Desktop: roteiro e editor lado a lado, marca compacta e contexto da sessão acima da área de trabalho.
- Até 800 px: lista acima do editor; alvos em duas colunas. Até 520 px: lista novamente em uma coluna com nomes, tipos, horários e estados. Seleção pelo usuário desloca foco ao título e rola o editor para a área visível em telas estreitas.
- Larguras flexíveis, quebras de texto e notas longas com `overflow-wrap`. Sem alturas fixas na página ou bloqueio de zoom.
- Controles nativos com labels; seleção por `aria-pressed`; navegação por `aria-current`; mensagens por região `aria-live`; foco visível; link para pular ao conteúdo. Os indicadores gráficos são redundantes com texto.
- Seletores têm altura mínima de 40 px, resultado ≥47 px, botão principal ≥44 px. Isso é uma decisão de dimensão, não uma alegação de conformidade universal.
- Não há modal personalizado nem armadilha de foco. Confirmações de descarte usam o diálogo nativo do navegador.

## Verificações realmente executadas

**JavaScript:** `node --check app.js` e `node --check core.js` passaram.

**20 verificações de lógica:** dados exigidos; quatro pendentes iniciais; salvar visto; nota aparada; contagens separadas; filtro por tipo; filtro por estado; combinação vazia; pendentes; edição sem alterar outros alvos; round-trip de serialização; armazenamento vazio; rejeição de JSON corrompido, versão desconhecida e estado inválido; rejeição de alvo inválido; resultado obrigatório; nota vazia; limite de 600 caracteres; retorno a pendente; preservação de Unicode e texto literal. Todos passaram. O teste de round-trip verifica o formato salvo, não a API de armazenamento de um navegador real.

**Estrutura estática:** HTML analisado com `HTMLParser` para IDs duplicados, referências locais existentes, labels explícitos e ausência de URLs remotas. Blocos CSS balanceados e zoom não bloqueado. Nenhum erro nessas verificações limitadas. Isso não equivale a um validador HTML/CSS completo.

**Contraste calculado por luminância relativa, sem renderização:**

| Combinação | Razão |
|---|---:|
| Texto principal / fundo | 13,80:1 |
| Texto principal / superfície | 12,90:1 |
| Texto secundário / superfície | 7,79:1 |
| Texto secundário / seleção | 6,51:1 |
| Visto / superfície | 8,80:1 |
| Não visto / superfície | 8,10:1 |
| Pendente / seleção | 7,45:1 |
| Texto / botão principal | 8,87:1 |
| Placeholder / campo | 6,87:1 |

As bordas dos controles foram calculadas acima de 3:1 sobre os três fundos em que aparecem. Bordas estruturais decorativas não são usadas como único identificador de controle. As medições verificam pares de cores, não legibilidade visual, tamanho percebido ou conformidade completa.

**Inspeção de código:** texto de notas é escapado antes da inserção em HTML; o resumo usa os mesmos estados e fonte de dados; não existem botões prometendo integrações ou exportações ausentes. Foram conferidos os caminhos para edição, filtro vazio e falha de armazenamento.

## Limitações e próximo passo de avaliação

Não houve navegador, screenshot, medição de viewport real, teste de toque, teclado, leitor de tela, API de `localStorage` real ou estudo com participantes. Portanto não se afirma que o layout foi visualmente aprovado, que a persistência foi exercitada no browser ou que há conformidade WCAG completa.

O avaliador pode abrir `index.html` e testar, por exemplo, em 1440 × 900, 390 × 844 e 320 × 740; esses são tamanhos sugeridos, não medições já realizadas. Caminho principal: registrar Lua como vista com nota; Saturno como não visto; filtrar pendentes; editar Lua pelo resumo; recarregar; confirmar registros e contagens. Conferir também cancelamento de edição, filtro sem resultado, nota longa, foco após seleção no telefone e indisponibilidade do armazenamento.

O protótipo não adiciona alvos, não recalcula horários, não oferece previsão, contas, sincronização ou exportação. A persistência depende do navegador e de suas permissões; limpar dados do site remove os registros. SVGs foram escritos para este protótipo e não dependem de ativos externos.

Entrega encerrada após estas verificações. Nenhuma alteração posterior à submissão está prevista.
