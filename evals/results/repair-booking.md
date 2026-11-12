# Roda — especificação de marcação em demonstração

**Entrega:** especificação de UX, conteúdo e direção visual, pronta para revisão e prototipagem. Idioma da interface: português de Portugal. Produto: experiência web com prioridade ao telemóvel. Não foi construído, renderizado, publicado ou ligado a um serviço de marcações.

## 1. Base e limites

**Requisitos fornecidos:** oficina de bicicletas chamada Roda; descrever um problema; consultar uma estimativa inicial; escolher uma hora disponível para entregar a bicicleta; rever antes de pedir a marcação. Parte das pessoas não conhece peças de bicicletas. Horário: terça-feira a sábado, 09:00–18:00. Reparação de furo: 12–20 €. Afinação de travões: 18–35 €. Problema desconhecido: diagnóstico, sem orçamento fixo. Disponibilidade fictícia identificada como demonstração; um horário pode deixar de estar disponível.

**Hipóteses de desenho, ainda sem investigação:** a pessoa chega com um sintoma, possivelmente no telemóvel e junto da bicicleta; prefere reconhecer o que acontece a identificar uma peça. Uma sequência curta ajuda a perceber a relação entre sintoma, estimativa e pedido. Para a demonstração, uma única bicicleta e um problema principal por pedido são suficientes; problemas adicionais podem ser descritos e impedem uma estimativa global automática.

**Por decidir antes de uma versão real:** morada e fuso da oficina, canais de contacto, eventual custo de diagnóstico, inclusão de impostos nas estimativas, política de cancelamento, capacidade e duração dos intervalos de entrega, tratamento dos dados e processo de confirmação. A interface não inventa respostas. Um pedido de entrega não é uma promessa de reparação concluída nesse horário.

**Limite da simulação:** não se enviam pedidos nem mensagens e não se recolhem dados reais. O aviso «Demonstração — horários fictícios. Nenhum pedido será enviado.» permanece visível em todas as etapas. Qualquer exemplo de contacto é fictício. As instruções sobre armazenamento e rede abaixo são comportamento a implementar num protótipo, não funcionalidades existentes.

## 2. Tarefa e objetos

Pessoa → relata um sintoma → compreende o alcance da estimativa → escolhe quando entregar → confere os dados → simula o pedido.

Objetos que a interface mantém separados:

- **Problema:** sintoma escolhido, descrição livre e indicação de outros problemas.
- **Estimativa:** intervalo e serviço a que se refere, ou «Por determinar após diagnóstico»; nunca um total de compra.
- **Entrega:** data e hora, com estado disponível, selecionado ou indisponível. Não é a duração da reparação.
- **Pedido:** resumo e estado de envio; não equivale a uma marcação confirmada.

Erro caro a prevenir: interpretar 12–20 € como preço garantido para qualquer perda de ar, ou considerar o horário escolhido uma confirmação definitiva.

## 3. Duas direções candidatas

### A — Ficha de oficina guiada · selecionada

**Ideia organizadora:** uma ficha que ganha conteúdo à medida que a pessoa explica o problema. Quatro etapas: «Problema», «Estimativa», «Entrega», «Rever». Cada etapa resolve uma decisão. A informação já dada reaparece numa faixa de resumo discreta; a pessoa não precisa de a recordar.

**Composição principal, telemóvel:** marca pequena e aviso de demonstração → «1 de 4 · Problema» → pergunta «O que acontece à bicicleta?» → três opções de sintomas em linhas largas → descrição → ação «Ver estimativa». As etapas seguintes substituem o corpo central; não acrescentam uma longa página abaixo.

**Expressão:** papel quente, texto escuro, verde profundo nas ações e seleção. Numeração pequena, linhas de separação e alinhamento constante lembram o registo de uma oficina. A identidade vem da ficha e da relação sintoma–serviço–estimativa, sem textura de papel, parafusos decorativos ou fotografias de banco de imagens.

**Adequação:** dá espaço ao vocabulário de sintomas e à ressalva do orçamento. As etapas tornam a revisão e a recuperação de uma vaga perdida explícitas. Usa elementos de formulário familiares.

**Custo e compromisso:** implementação simples com estado partilhado e navegação entre etapas; exige mais avanços que uma página única. Quem já conhece o serviço não vê toda a agenda à entrada. O resumo e «Voltar» preservam orientação.

### B — Quadro de reparações e agenda

**Ideia organizadora:** começar por comparar três linhas de reparação, como num quadro da oficina, e abrir a escolha dentro da própria linha. Sem passos numerados. Cada linha contém sintoma, serviço associado e intervalo; «Não sei qual é o problema» tem o mesmo peso das outras opções e nenhum número de preço.

**Composição principal, telemóvel:** marca e aviso → «Como podemos ajudar?» → quadro de três opções com preço à direita → a linha escolhida expande a descrição e a ressalva → agenda semanal imediatamente abaixo → resumo do pedido e revisão numa secção final. No computador, quadro e descrição à esquerda; agenda à direita; resumo atravessa a base.

**Copy característica:** «Pneu vazio ou a perder ar / Possível reparação de furo / 12–20 €»; «Travões a precisar de ajuste / Possível afinação / 18–35 €»; «Não sei identificar / Diagnóstico / Preço por determinar». As associações são possibilidades, não diagnósticos.

**Expressão:** tipografia mais densa, divisórias horizontais, valores alinhados e agenda em colunas. Preto e branco com um único acento. A comparação visual é o elemento de identidade; não há imagem central.

**Adequação:** torna as três possibilidades e a agenda visíveis numa mesma superfície. Favorece a pessoa que conhece o problema e quer comparar rapidamente opções.

**Custo e compromisso:** a expansão em linha, alteração de altura e sincronização com agenda exigem mais cuidado de foco e leitura. No telemóvel, o quadro pode induzir a escolha pelo preço e esconder a ressalva entre secções; é uma hipótese a testar, não uma observação de utilizadores.

### Escolha e comparação

A foi escolhida porque o desconhecimento de peças é uma restrição explícita, e o intervalo de preço necessita de contexto antes da escolha de entrega. A estimativa tem uma etapa própria, com saída clara para diagnóstico. B é viável, mas privilegia comparação e rapidez para quem já conhece a reparação.

| Critério | A — ficha guiada | B — quadro e agenda |
|---|---|---|
| Estrutura | Uma decisão por etapa, ramificação por sintoma | Comparação e expansão numa página |
| Conteúdo | Pergunta e explicação antes do número | Intervalos disponíveis à primeira leitura |
| Reconhecimento | Ficha de oficina construída ao longo do pedido | Quadro de reparações associado à agenda |
| Acessibilidade prevista | Ordem linear e foco no título de cada etapa | Expansões e reajuste de foco exigem atenção adicional |
| Custo relativo | Moderado, quatro vistas e estado comum | Moderado, maior sincronização de regiões |

**Registo de decisão:** relatar sem conhecer peças → sequência por sintomas → ficha de oficina → intervalo com alcance explícito, agenda de entrega, revisão editável → mais passos em troca de contexto → validar compreensão de preço e confirmação num protótipo futuro. Nenhuma das direções foi comparada com participantes.

## 4. Direção A: conteúdo e comportamento por etapa

### Estrutura comum

Topo: «Roda» e ligação «Pedir uma marcação» como título do fluxo, sem navegação de marketing. Abaixo, aviso persistente de demonstração. O progresso apresenta texto «1 de 4 · Problema», etc.; a etapa atual é identificada também semanticamente, sem depender da cor. Só as etapas concluídas admitem regresso direto.

«Voltar» mantém todos os valores. A ação principal é um botão normal no fluxo do documento, visível após os campos; não cobre conteúdo nem acompanha o teclado virtual. A etapa de revisão fornece ações «Alterar» específicas. Nenhuma seleção avança automaticamente.

### 1 de 4 · Problema

**Título:** «O que acontece à bicicleta?»

**Ajuda:** «Não precisa de saber o nome da peça. Escolha o que mais se aproxima.»

Grupo de seleção única com rótulo «Problema principal» e opções:

1. «O pneu está vazio ou perde ar»
2. «Os travões não estão a funcionar como deviam»
3. «Não sei identificar o problema»

Campo de texto, rótulo «Conte-nos o que nota». Ajuda: «Por exemplo: quando acontece, se há algum ruído e o que mudou.» Campo opcional nas duas primeiras opções; obrigatório na terceira. A marca «opcional» aparece no próprio rótulo quando aplicável. O exemplo não substitui o rótulo e não é texto previamente introduzido.

Checkbox: «Há outros problemas que também quero descrever». Ao marcar, a descrição torna-se obrigatória e a ajuda passa a «Descreva também os outros problemas. A estimativa de um serviço pode não cobrir tudo.» Não se somam intervalos automaticamente.

Ação: **«Ver estimativa»**.

Validação ao avançar: «Escolha o problema que mais se aproxima.»; «Descreva o que nota, mesmo que não saiba a causa.» A descrição aceita pontuação, acentos e até 1 000 caracteres; perto do limite apresenta «980 de 1 000 caracteres». Ao ultrapassar: «Reduza a descrição para 1 000 caracteres ou menos.» Não há mínimo de caracteres artificial além de texto não vazio quando obrigatório.

### 2 de 4 · Estimativa

**Título:** «Uma primeira ideia do preço»

A estimativa não é um grande preço de compra isolado: serviço e condição ficam no mesmo bloco.

| Escolha | Conteúdo principal exato |
|---|---|
| Pneu | «Possível reparação de furo» / **«12–20 €»** / «Estimativa inicial, se o problema se resolver com uma reparação de furo. A causa e o preço precisam de avaliação.» |
| Travões | «Possível afinação de travões» / **«18–35 €»** / «Estimativa inicial, se for necessária apenas uma afinação de travões. Outras reparações não estão incluídas neste intervalo.» |
| Não sei | «É preciso diagnosticar» / **«Preço por determinar»** / «Sem identificar a causa, não conseguimos apresentar um intervalo de preço.» |

Se existirem outros problemas, o intervalo conhecido permanece identificado como referente apenas àquele serviço e acrescenta-se: «Este intervalo não cobre os outros problemas descritos. O preço do conjunto fica por determinar após avaliação.» Para a opção desconhecida, mantém-se apenas o estado de diagnóstico; não se mostra 0 €, «grátis» nem um intervalo inventado.

Nota comum: «O horário que vai escolher é para entregar a bicicleta. O prazo de reparação ainda não está definido.»

No estado de diagnóstico, nota específica de demonstração: «O eventual custo do diagnóstico ainda não foi definido nesta demonstração.» Este ponto deve ser resolvido antes de um fluxo real aceitar pedidos; não é ocultado nem apresentado como gratuito.

Ações: **«Escolher hora de entrega»** e «Voltar ao problema». Não se exige um checkbox de aceitação apenas para conseguir avançar.

### 3 de 4 · Entrega

**Título:** «Quando pode entregar a bicicleta?»

Texto de apoio: «Terça-feira a sábado, das 09:00 às 18:00.»

Aviso junto à agenda: **«Disponibilidade de demonstração — não corresponde a vagas reais.»**

A agenda usa uma lista de dias com data completa, adequada a poucos dias de entrega. Evita uma grelha mensal com células minúsculas. Cada dia é um botão expansível, com nome, data e número de horários disponíveis; a abertura não seleciona a data nem a primeira hora. Só um horário selecionado constitui uma escolha. A semana e o ano estão visíveis: «17–21 de novembro de 2026».

| Dia fictício | Horários de demonstração |
|---|---|
| Terça-feira, 17 de novembro | 09:00; 11:30; 16:00 |
| Quarta-feira, 18 de novembro | 10:00; 14:30 |
| Quinta-feira, 19 de novembro | «Sem horários disponíveis» |
| Sexta-feira, 20 de novembro | 09:30; 15:00 |
| Sábado, 21 de novembro | 10:30; 12:00; 17:00 |

Domingo e segunda-feira não são opções da semana de funcionamento. A lista demonstra disponibilidade, não sugere que os restantes horários entre as 09:00 e as 18:00 estejam livres. Não promete duração de entrega ou reparação.

Os horários são controlos de seleção única. Seleção: contorno, marca de verificação e texto de estado, além da cor. Nome acessível completo, por exemplo «Terça-feira, 17 de novembro de 2026, às 11:30». A escolha é repetida como «Entrega escolhida: terça-feira, 17 de novembro, às 11:30».

Nesta demonstração, mostrar uma linha de contacto fixa para tornar a revisão concreta, **sem pedir dados reais:** «Contacto de exemplo: cliente@example.test». Não é um campo disfarçado. O canal real de contacto é uma decisão de produto pendente, não uma integração implícita.

Ações: **«Rever pedido»** e «Voltar à estimativa». Se nenhuma hora estiver selecionada: «Escolha uma hora de entrega para continuar.» O botão permite acionar a validação; não fica desativado sem explicação.

### 4 de 4 · Rever

**Título:** «Está tudo certo?»

Subtítulo: «Reveja o pedido antes de continuar.»

Resumo com pares rótulo–valor, em ordem de leitura:

- «Problema» → «O pneu está vazio ou perde ar»; ação «Alterar problema».
- «O que nota» → exemplo claramente identificado: «Exemplo: o pneu de trás perde ar de um dia para o outro.» Quando não preenchido: «Sem descrição adicional».
- «Estimativa inicial» → «12–20 €, se for uma reparação de furo»; para desconhecido: «Preço por determinar após diagnóstico». Para vários problemas, repetir a limitação do intervalo.
- «Entrega da bicicleta» → «Terça-feira, 17 de novembro de 2026, às 11:30»; ação «Alterar entrega».
- «Contacto de exemplo» → «cliente@example.test».

Nota imediatamente antes da ação: **«Este é um pedido de marcação. O horário e o preço ainda precisam de confirmação.»**

Ação de demonstração: **«Simular pedido de marcação»**. O texto de um eventual produto real seria «Pedir marcação», dependente do processo real de confirmação. Não usar «Confirmar marcação» nem «Pagar» nesta especificação.

Editar o problema preserva a descrição e a entrega, mas exige passar novamente pela estimativa antes de rever. O estado da entrega é revalidado ao voltar à revisão. Não se apaga uma seleção só porque o preço mudou. Editar a entrega volta à agenda com o dia anterior aberto.

### Resultado simulado

Só depois do resultado positivo da simulação:

**«Pedido simulado»**

«Nesta demonstração, o pedido não foi enviado e o horário não ficou reservado.»

Resumo da entrega e da estimativa mantém-se visível. Uma nota contextual pode explicar o estado previsto para um produto real: «Num serviço real, o pedido ficaria a aguardar confirmação da oficina.» Não se mostra um e-mail enviado, número de reserva real ou código de confirmação inventado.

Ação: «Rever simulação». Ligação secundária: «Começar de novo». Esta última mostra «Apagar os dados desta simulação e começar de novo?» com «Continuar simulação» e «Apagar e recomeçar», porque elimina a descrição introduzida.

## 5. Estados relevantes e recuperação

| Estado / condição | Copy e comportamento especificado |
|---|---|
| Entrada sem dados | Apresentar as três opções sem escolha inicial. Não adivinhar o problema nem pré-selecionar uma vaga. |
| Estimativa em atualização | O preço deriva da escolha local; não adicionar espera artificial. A alteração é anunciada uma vez como «Estimativa atualizada». |
| Agenda a carregar | «A carregar horários de demonstração…»; manter o resumo e a descrição. Não mostrar antigas vagas como selecionáveis durante uma atualização. |
| Dia sem horários | «Não há horários disponíveis neste dia.» e «Escolher outro dia». O dia permanece legível, sem parecer erro técnico. |
| Semana vazia | «Não há horários disponíveis nesta semana de demonstração.» e «Ver a semana seguinte». Só habilitar esta ação quando existirem dados fictícios para essa semana; sem dados adicionais, usar «Voltar à estimativa» e declarar o limite da demonstração. |
| Falha a obter agenda | «Não foi possível carregar os horários. Os dados do problema continuam aqui.» e «Tentar novamente». Não confundir falha com falta de vagas. |
| Horário perdido antes do pedido | «Este horário deixou de estar disponível. Escolha outra hora; a descrição e a estimativa foram mantidas.» Identificar «17 de novembro, 11:30 — indisponível». Remover essa hora da seleção ativa, não a substituir automaticamente. «Escolher outra hora» regressa à agenda, com foco no aviso e alternativas visíveis. |
| Pedido em processamento | Ação muda para «A simular pedido…» e fica indisponível para novos envios. O resumo continua legível; o resultado não é anunciado antes de existir. |
| Pedido recusado por vaga perdida | Não chegar ao resultado positivo. Mostrar o mesmo estado de conflito, preservar o problema e permitir escolher outra hora e rever novamente. |
| Falha conhecida sem envio | «Não foi possível concluir a simulação. Os seus dados foram mantidos.» e «Tentar novamente». |
| Resultado desconhecido após interrupção | «Ainda não conseguimos saber se o pedido foi concluído.» No protótipo, simular uma consulta de estado antes de permitir novo envio. Num produto real, exigir identificação e deduplicação do pedido; nunca apresentar uma repetição cega como recuperação segura. |
| Sair ou recarregar | A proposta mantém dados apenas durante a sessão da página. «Recarregar ou fechar esta página apaga a simulação.» Não prometer recuperação entre sessões ou notificações. |

**Cenário de conflito reproduzível para o futuro protótipo:** um painel separado, claramente chamado «Controlos da demonstração», permite escolher «Manter disponibilidade» ou «Tornar a hora escolhida indisponível ao enviar». O primeiro é o padrão. O segundo altera apenas a hora ativa e retorna o estado de conflito ao simular o pedido. Não utilizar aleatoriedade que dificulte a revisão. Estas opções de teste não integram o fluxo de produção.

**Transições essenciais:** problema válido → estimativa → hora escolhida → revisão → processamento → resultado positivo ou recuperação. O processamento tem uma única tentativa ativa. Voltar e alterar preservam o que continua válido. A disponibilidade é consultada novamente antes de aceitar o pedido; uma indicação antiga de disponibilidade não basta.

## 6. Sistema visual da direção selecionada

### Cores e uso

| Papel | Valor | Aplicação |
|---|---|---|
| Fundo de página | `#F6F3EA` | Papel quente uniforme, sem textura |
| Superfície de campos | `#FFFFFF` | Campos e opções, diferenciados por contorno |
| Texto principal | `#24332D` | Títulos, perguntas, dados do pedido |
| Texto secundário | `#526159` | Ajuda, metadados; não usar opacidade para o atenuar |
| Ação e foco | `#174A3E` | Botão principal e anel de foco |
| Texto sobre ação | `#FFFFFF` | Rótulos dos botões verdes |
| Seleção de fundo | `#E3EEE6` | Fundo da opção marcada, com texto `#174A3E` |
| Contorno dos controlos | `#69796F` | Limite perceptível de campo e opção |
| Erro | `#A12D27` | Texto e ícone de erro; sempre com instrução escrita |

Pares calculados: texto/fundo 11,93:1; secundário/fundo 5,89:1; branco/ação 10,07:1; erro/fundo 6,48:1; foco/fundo 9,08:1; contorno/branco 4,60:1; texto de seleção/fundo de seleção 8,46:1. Estes cálculos cobrem só os pares especificados, não uma auditoria de acessibilidade de uma interface renderizada.

**Estado do botão:** normal verde com texto branco; hover acrescenta sublinhado ao rótulo, sem depender de alteração de cor; pressionado mantém o contraste e acrescenta uma linha interna; foco usa anel verde de 3 px com separação de 3 px. A separação clara torna o anel visível também no botão verde. Durante processamento, manter texto contrastado e explicação, sem reduzir todo o botão a baixa opacidade.

### Tipografia, composição e densidade

- Fonte de sistema: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Sem fontes externas, licenças adicionais ou imagens por obter.
- Marca «Roda»: 24/28 px, peso 750 se disponível; fallback 700. A marca é tipográfica nesta proposta, não um logótipo existente.
- Título de etapa: 28/34 px no telemóvel, 36/42 px no computador, peso 700.
- Corpo e campos: 16/24 px. Ajuda e progresso: 14/20 px. Valores de estimativa: 32/38 px, peso 700, sempre junto ao contexto. Horas com algarismos tabulares onde disponíveis.
- Escala de espaço: 4, 8, 12, 16, 24, 32, 48 px. Relação próxima entre rótulo, campo e erro; 24–32 px entre grupos.
- Campos e opções com raio de 8 px; botão principal com o mesmo raio. Sem sombras, gradientes, textura ou moldura de recibo serrilhada.
- Linhas de separação estruturam o resumo. As opções são linhas de formulário, não cartões promocionais. Cada uma pode ocupar várias linhas sem altura fixa.
- Alvos de toque com altura mínima de desenho de 48 px, espaços de 8 px entre escolhas; texto continua a poder crescer. Não se afirma que este número, isoladamente, garante conformidade.
- O único sinal recorrente de identidade é a sequência da ficha e o alinhamento entre o sintoma e a estimativa. Sem fotografias ou ilustrações: nenhum ativo foi produzido ou insinuado.

### Esquema de composição, sem escala

Telemóvel — etapa de problema:

```text
Roda
Demonstração — horários fictícios…
────────────────────────────────
1 de 4 · Problema
O que acontece à bicicleta?
Não precisa de saber o nome…

Problema principal
( ) O pneu está vazio ou perde ar
( ) Os travões não estão…
( ) Não sei identificar o problema

Conte-nos o que nota (opcional)
[ descrição em várias linhas     ]
[ ] Há outros problemas…

[        Ver estimativa         ]
```

Computador — etapa de entrega:

```text
Roda                      Demonstração — horários fictícios…
───────────────────────────────────────────────────────────
3 de 4 · Entrega                   A sua ficha
Quando pode entregar              Problema
 a bicicleta?                     O pneu está vazio…
Ter.–sáb., 09:00–18:00             Estimativa inicial
                                  12–20 €, se for um furo
[ Terça-feira, 17 de novembro ∨ ]  [Alterar problema]
  ( )09:00 (●)11:30 ( )16:00
[ Quarta-feira, 18 de novembro > ]
[ restantes dias                 ]
Entrega escolhida: terça-feira…
[Rever pedido]  Voltar à estimativa
```

Os esquemas documentam hierarquia, não demonstram renderização nem dimensões finais.

## 7. Comportamento responsivo, teclado e leitura

| Largura prevista | Transformação |
|---|---|
| 320–599 px | Coluna única, margens de 16 px; todas as opções em linhas largas; horários fluem para duas colunas ou uma quando necessário. O resumo das etapas concluídas aparece depois do título numa secção «A sua ficha» expansível, sem esconder a decisão atual. Na revisão, todo o resumo está aberto. |
| 600–959 px | Coluna de conteúdo até 640 px, centrada, margens de 24 px. Horários em até três colunas. A largura extra melhora leitura; não introduz nova navegação. |
| A partir de 960 px | Contentor até 1 120 px com formulário de 640 px, separação de 48 px e resumo lateral de até 320 px. O resumo é secundário e não repete a ação principal. A ordem no documento mantém título, formulário, resumo; o posicionamento visual não altera o fluxo de leitura dos controlos. |

O modo de duas colunas desaparece quando o zoom reduz a largura CSS disponível. Não há scroll horizontal necessário a 320 px por desenho; esta intenção requer verificação no futuro protótipo. Não cortar datas, rótulos ou descrição. Não fixar a altura das linhas. O teclado virtual não oculta uma ação flutuante porque não existe uma.

Usar `form`, títulos hierárquicos, `fieldset`/`legend`, `label`, `input type="radio"`, `textarea` e botões semânticos. Os dias são botões de expansão com estado anunciado; os horários usam navegação de grupo de rádio familiar. Foco visível em todos os controlos; o texto «Alterar problema» deve ser distinto de «Alterar entrega» também fora do contexto visual.

Ao avançar de etapa, mover o foco para o novo título e atualizar o título da página. Ao falhar a validação, mostrar um resumo de erros com ligações aos campos e colocar o foco nesse resumo. Erros locais são associados ao campo. Um conflito de vaga tem aviso explícito e anúncio adequado; não repetir a mesma mensagem através de vários avisos ao mesmo tempo. Ao regressar de uma edição, o foco volta ao título da revisão.

Nada depende de hover, cor, arrastar ou conhecer ícones. Não há movimento necessário. Se se acrescentar uma breve transição entre etapas, limitar a uma mudança de opacidade até 120 ms e eliminá-la quando a preferência de movimento reduzido estiver ativa. O protótipo deve funcionar igualmente sem animação.

## 8. Verificação feita e revisão ainda necessária

### Verificação realmente realizada nesta entrega

1. Leitura da skill `authentic-design` e das referências sobre UX/conteúdo, direção de arte e validação. Não foram consultados projetos privados, outras avaliações ou ativos externos.
2. Revisão textual dos requisitos contra esta especificação: estão presentes sintoma, estimativa, entrega, revisão, pedido simulado, abertura terça–sábado, dois intervalos fornecidos, diagnóstico sem preço fixo e conflito de disponibilidade com preservação de dados.
3. Cálculo programático de contraste dos sete pares enumerados, com luminância relativa sRGB. Os resultados constam da tabela de cores; isso não verifica outras combinações nem renderização.
4. Verificação programática de calendário: 17–21 de novembro de 2026 corresponde a terça-feira–sábado. Todos os horários de demonstração apresentados estão dentro de 09:00–18:00. São dados fictícios, não vagas observadas.
5. Inspeção editorial das alternativas: A muda de etapa para orientar uma decisão de cada vez; B compara e expande numa superfície contínua. Diferem na organização, navegação e exposição do preço, além da aparência.
6. Provas críticas sobre a especificação: a substituição por outro serviço exigiria rever sintomas e relação com diagnóstico; a silhueta das duas alternativas é distinta no esquema; efeitos removíveis foram eliminados; os controlos de escolha e regresso permanecem convencionais; as hipóteses foram separadas dos requisitos.

### Critérios para o futuro protótipo — não executados

- Percorrer «pneu» até ao resultado simulado; verificar 12–20 €, alcance do serviço e ausência de reserva real.
- Percorrer «travões» e confirmar 18–35 €; escolher «Não sei» e confirmar que nenhum preço numérico é apresentado.
- Introduzir outro problema e verificar que não surge uma soma ou estimativa global fictícia.
- Voltar, alterar dados e rever; verificar preservação da descrição, atualização da estimativa e revalidação da hora.
- Ativar o conflito, tentar pedir e recuperar noutra hora; garantir que não aparece sucesso e que o conteúdo não desaparece.
- Simular agenda vazia, falha de carregamento, validação e interrupção do pedido; distinguir falta de vagas de erro e resultado desconhecido.
- Inspecionar 320, 390, 768 e 1 280 px, texto aumentado e descrições longas; operar por teclado e leitor de ecrã; verificar contraste real, foco e ordem de leitura.
- Com participantes, observar se alguém sem vocabulário de peças consegue descrever o problema e explicar, por palavras próprias, o que o intervalo cobre, o que significa a hora de entrega e se o pedido está confirmado. Nenhuma observação desse tipo foi feita nesta entrega.

**Limitações materiais:** há uma especificação, não um protótipo. Não há prova visual, teste de interação, auditoria de conformidade, teste com participantes ou integração de agenda. O contacto é apenas um exemplo; a oficina terá de definir o canal real e as condições de diagnóstico antes de aceitar pedidos reais. Não se afirma melhoria de conversão, originalidade universal ou sucesso de utilização.
