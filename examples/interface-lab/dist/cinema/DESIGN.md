# Margem — programa de cinema

## Tarefa e estrutura
O visitante escolhe um dos três dias, compara os filmes e horários, seleciona um lugar, revê a sessão e simula a reserva. O preço está junto do calendário. Os filmes são agrupados por dia e ordenados pela primeira sessão. Horários esgotados continuam visíveis, sem permitir reserva.

## Alternativas e revisão baseada em evidência
Foram consideradas uma grelha semanal, uma parede de cartazes e um programa de sala. A grelha prejudicava o reflow móvel; a parede tornava os horários secundários. A primeira implementação do programa usava uma composição editorial de papel e serifas.

A revisão visual do agente principal identificou duas falhas concretas: semelhança com outra interface avaliada e um slogan que empurrava a programação para baixo. A versão atual substitui essa abertura por um cabeçalho vermelho curto e um programa compacto. A identidade nasce dos títulos reais em tipografia de cartaz, dos horários explícitos e da estrutura de calendário, sem slogans, números ornamentais ou setas decorativas.

## Regras visuais e comportamento
Impact, com alternativas Arial Narrow e sans-serif, define marca e títulos. Arial apresenta decisões e apoio, a partir de 12 px; a maioria da informação prática usa 14–16 px. Preto, branco, cinzento neutro e vermelho formam uma paleta funcional. Três SVG originais representam ondas, som e chuva; não são fotografias nem fotogramas.

No desktop, os cartazes são compactos e os horários permanecem ao lado dos títulos. No telemóvel, os horários ocupam a largura disponível abaixo do filme. A reserva mantém seis lugares por fila, seleção única, resumo e confirmação. Diálogo nativo, Escape, clique exterior, botão de fecho e retorno do foco preservam convenções. O estado selecionado tem indicação acessível e confirmação textual no resumo.

## Evidência e limites
Programação, géneros, durações, idioma fornecido e preço preservam o enunciado. Não foram inventadas sinopses, classificações ou pessoas. A ocupação inicial é fictícia. As reservas simuladas afetam apenas a sessão corrente da página; não há servidor, persistência, pagamento ou bilhete real.

Os contrastes calculados são 16,44:1 para preto sobre a página, 6,84:1 para apoio cinzento, 6,11:1 para vermelho sobre a página e 6,67:1 para branco sobre vermelho; o menor par restante é 6,08:1. A verificação local cobre sintaxe JavaScript, dados, HTML, SVG e referências locais. O agente autor não usou navegador. Visibilidade no primeiro viewport, reflow e interações reais precisam da revisão do agente principal; estes cálculos não provam conformidade integral.

## Verificação posterior do agente principal

Em 12 de novembro de 2026, o agente principal inspecionou a versão renderizada no Chrome, executou a tarefa principal e os estados de recuperação em desktop e em 390/320 px. Consulte o relatório da rodada para os passos observados e limites. Esta verificação é posterior às verificações de fonte descritas acima.
