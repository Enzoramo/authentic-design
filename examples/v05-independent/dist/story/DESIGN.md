# Vereda

## Escopo e evidência

Requisitos fornecidos: narrativa exata em português, sete passagens, escolhas determinísticas, voltar uma passagem, percurso percorrido, retomada no recarregamento, tamanho do texto persistente e reinício com confirmação nos finais. HTML/CSS/JS locais, sem build, conta, integração ou envio de dados. Nenhuma pesquisa com leitores foi fornecida; as decisões de composição são hipóteses de design.

Hipótese de uso: uma pessoa lê sozinha no computador ou telefone; precisa distinguir a passagem atual das escolhas e rever uma decisão sem perder contexto. O custo relevante é perder o percurso por engano. A confirmação só aparece ao reiniciar, não a cada escolha.

## Modelo da tarefa

Entrar ou retomar → ler passagem atual → escolher → nova passagem. Voltar remove a última passagem do percurso ativo. Percurso lista somente as passagens já percorridas, sem revelar caminhos futuros, e permite consultar o texto sem alterar o ponto guardado; “Retomar leitura” fecha a consulta. Ajustes de texto não mudam o percurso. Finais oferecem voltar ou reiniciar; cancelar o reinício mantém a leitura intacta.

## Estudo antes da implementação

`direction-study.html` contém três espécimes comparáveis com texto real, duas escolhas, estado de salvamento e acesso ao percurso:

- A, Margem de leitura: a passagem ocupa a coluna ampla; uma linha lateral conserva o rastro percorrido. Charter na prosa, Optima no nome; cinza muito claro com tinta ameixa. A relação vem do mapa e da leitura, sem reproduzir um mapa geográfico ou revelar finais.
- B, Fita contínua: uma passagem é uma unidade visível de uma sequência, com número real de posição; prosa sans, campo escuro e escolhas lado a lado no computador. Derivada das fitas e do ato de continuar uma escuta, sem simular controles de áudio.
- C, Registro vivo: alinhamento monoespaçado e linhas de entrada fazem a narrativa parecer um registro que ganha escolhas. Derivada do catálogo e das histórias conservadas. Nome sans independente do texto.

Fontes instaladas inspecionadas: Optima, Avenir, Avenir Next Condensed, Charter, Iowan Old Style, Georgia, Courier e Helvetica Neue, entre outras. Nenhum arquivo proprietário foi copiado. O produto usará fontes locais por nome com fallbacks explícitos; o ambiente final pode mudar o desenho das letras.

A comparação adicional mantém geometria e paleta constantes para avaliar Optima/Charter e Iowan Old Style, com o nome fornecido “Vereda” e alternativa em capitais. **Estado no momento desse checkpoint:** a seleção aguardava as capturas neutras; nenhuma direção havia sido aceita. A decisão posterior está registrada abaixo.

## Seleção após renderização

Inspecionei `study-desktop.jpg` (viewport medido 1440×1000, documento 1440×2763), `study-mobile.jpg` (390×844, documento 390×3395) e `study-revision-1-desktop.jpg` devolvidos pelo serviço neutro. A primeira captura revelou que o botão Percurso de B não herdava a cor clara. Corrigi esse defeito e inspecionei a revisão antes de selecionar. O defeito não é argumento contra B.

**Selecionada A, Margem de leitura.** Tarefa de acompanhar e regressar → coluna de prosa com decisões abaixo, percurso lateral que cresce → marcas abertas nas escolhas e marcas preenchidas no ponto atual → linha de percurso, medida de leitura, controles discretos → o custo é perder a presença lateral do percurso no telefone → verificação final móvel e painel de consulta descritos abaixo.

Evidência visual: A apresenta a passagem, as duas escolhas empilhadas e o ponto atual em três ritmos relacionados. B oferece um contraste forte e uma posição de passagem mais saliente; é a alternativa mais forte. C torna muito explícito o caráter de registro, com espaço uniforme entre letras. As três são viáveis. Escolhi A pela relação entre a linha lateral de continuidade e as escolhas abertas, presente mesmo removendo nome e acento. Não afirmo vantagem de usabilidade medida.

**Contra-argumento:** a margem de A ocupa área para pouca informação no início e desaparece no telefone. B orienta a posição com um número visível sem depender da coluna lateral e mantém sua assinatura sans escura em ambas as larguras. Aceito o custo de A: no telefone, “Percurso” permanece disponível no cabeçalho; o painel permite reler sem mudar a passagem atual. Não acrescentei uma coluna comprimida ou numeração decorativa ao texto.

**Tipografia e nome:** a comparação focada manteve composição e cor. O espécime Optima/Charter separa o nome e a prosa; Iowan no nome e na prosa torna-os mais semelhantes. Escolhi o primeiro como hipótese de uma identificação discreta, sem transformar “Vereda” em mais um título de passagem. Mantive a grafia fornecida: o V inicial distingue o nome, enquanto capitais espaçadas alongam uma palavra curta sem acrescentar função. Não há símbolo ou slogan. As capturas mostram o desenho resultante, mas a API de renderização só expôs stacks CSS, não a origem por glifo; não declaro confirmação técnica da fonte efetiva.

**Cores:** fundo cinza-lilás de baixa saturação, tinta escura, metadados em cinza-violeta e pontos/foco em ameixa. O fundo não imita papel antigo; o acento liga somente decisão e localização. A identidade depende também da coluna, linha contínua e relação entre prosa serifada e controles sans. O conjunto não foi comparado a projetos externos, que estavam fora do escopo.

## Implementação

- `index.html`, `styles.css`, `story.js`, `persistence.js`, `app.js`; todos os recursos locais, sem build, importações externas ou comunicação de rede.
- Sete passagens com os textos e destinos fornecidos. A posição mostra o índice no percurso real, não uma percentagem fictícia da história.
- Escolher acrescenta uma passagem; voltar remove a última. A navegação move o foco para o título da passagem.
- Percurso é um diálogo nativo com uma lista ordenada de passagens expansíveis e a escolha feita entre elas. Consultar não altera o progresso. Retomar fecha e devolve foco ao ponto de leitura.
- Reinício somente nos finais, com consequência explícita e Cancelar como foco inicial. Reiniciar preserva o tamanho do texto.
- Tamanhos Padrão, Grande e Maior: 100%, 115%, 130%. Aplicados à prosa, escolhas e trechos no painel; salvos junto do percurso.
- Progresso e posição vertical salvos no `localStorage`. Recarregar restaura a passagem, tamanho e rolagem. A disponibilidade depende do navegador; falhas de armazenamento aparecem na interface, sem promessa de salvamento.
- Estado armazenado é validado pelo grafo; entradas inválidas são descartadas ou truncadas para um prefixo válido. JSON ilegível inicia uma leitura nova com aviso.
- Um breakpoint transforma o cabeçalho em duas linhas e remove a coluna lateral sem eliminar o acesso ao percurso. Sem animação de leitura; transições curtas de hover respeitam redução de movimento.

## Verificações de código concluídas

Executado `node verify.js`: oito percursos completos, retorno em todas as transições, serialização/normalização, rejeição de escolha inválida, preferência preservada no reinício, armazenamento válido, corrompido e bloqueado. `node --check app.js` passou. Parser HTML confirmou IDs únicos, referências ARIA/labels existentes e recursos locais presentes.

Contrastes calculados com luminância sRGB: prosa 12,29:1; metadados 5,84:1; acento/foco 6,36:1; botão principal 12,29:1; prosa no painel 13,05:1; mensagem de falha 7,23:1. Controles principais têm mínimo de 44 CSS px; escolhas têm 62 px. Esses cálculos e inspeção de código não são auditoria completa de acessibilidade.

## Verificação visual e interativa do produto

Capturas e ações neutras fornecidas pelo serviço do avaliador e registradas abaixo. Nenhum navegador foi operado diretamente por este agente.

### Resultados observados — primeira verificação do produto

O serviço neutro executou e relatou: Início → Armário → Tomás → Vozes; Cancelar preservou Vozes e as quatro passagens. Selecionar Maior e recarregar retomou Vozes com Maior. O painel listou as quatro passagens; Retomar voltou à leitura. Voltar levou a Tomás; Reservatório → Partilha terminou com cinco passagens. Confirmar reinício restaurou Início, uma passagem e Maior. Início → Armário → Reservatório → Guardiã terminou com quatro passagens. Logs de erro vazios.

Inspecionei `ui-desktop-initial.jpg` (1440×1000), `ui-mobile-initial.jpg`, `ui-mobile-confirm.jpg`, `ui-mobile-route.jpg` (390×844) e `ui-320-largest.jpg` (viewport 320×740, captura da página inteira). A largura medida do documento foi igual à do viewport em todos esses tamanhos. No telefone inicial, a passagem e as duas escolhas aparecem antes do fim da tela. A 320 px com Maior, a leitura exige rolagem vertical, como esperado, sem cortar escolhas. O painel de percurso conserva a linha e os pontos do espécime selecionado; a passagem atual permanece indicada por texto e preenchimento do ponto. A confirmação mostra a consequência completa e ambos os controles sem cortes.

Nenhuma alteração estética foi necessária após essas capturas. A última rodada solicitada concentrou-se em teclado, retomada vertical e um final no desktop; os resultados seguem abaixo.


### Verificação final e encerramento

O serviço relatou: Percurso aberto com Enter; Escape fechou o diálogo e devolveu o foco ao acionador “Consultar percurso: 4 passagens”. Em Guardiã, Enter abriu a confirmação com foco inicial em Cancelar; Escape manteve Guardiã e as quatro passagens. A 320×740, tamanho Maior e texto inicial, `scrollY` foi 279 antes e 279 depois do recarregamento; a altura do documento era 1019 px. A passagem Início e a preferência Maior foram mantidas.

Inspecionei `ui-desktop-ending.jpg` (1440×900). O final Guardiã conserva a coluna de prosa, o percurso lateral com quatro pontos e o destaque do ponto atual; o novo controle de reinício ocupa a área antes destinada às escolhas. A identidade selecionada permanece no segundo estado, inclusive com o texto em Maior. Sem cortes ou sobreposição observados.

**Limitações:** a retomada é local ao navegador/endereço; não há sincronização entre dispositivos. A origem efetiva das fontes por glifo não foi exposta, e o aspecto pode variar com as fontes do sistema. Não houve pesquisa com participantes, teste com leitor de tela, auditoria completa WCAG nem validação em todos os navegadores; não são alegados. Falhas de armazenamento foram verificadas em contexto JavaScript simulado, não bloqueando o armazenamento no navegador do avaliador.

**Submissão final:** interface, estudo, documentação e verificação local concluídos. Nenhuma alteração de produto após os resultados visuais/interativos; nenhum bloqueio conhecido dentro do escopo. Parar de editar após esta submissão.
