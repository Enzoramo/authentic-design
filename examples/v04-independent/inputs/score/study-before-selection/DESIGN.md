# Pódio — decisões e verificações

## Base e âmbito

- **Requisitos:** marcador em português; partida fictícia Clara × Ivo; set a 11 com vantagem de 2; partida à melhor de 3; acrescentar ponto de qualquer jogador; desfazer até reabrir um set; consultar sets anteriores; confirmar nova partida; conservar o resultado ao recarregar; desktop e telefone; ficheiros estáticos locais.
- **Factos observados:** apenas o brief e o snapshot authentic-design 0.4.0 foram consultados, incluindo UX e conteúdo, direção de arte e revisão/validação. Não existe pesquisa com utilizadores nem identidade fornecida.
- **Hipótese de uso:** o telefone fica junto à mesa e é tocado entre jogadas; em desktop, o placar também deve poder ser lido sem procurar valores pequenos. Esta hipótese orienta alvos grandes e estados explícitos; não é um resultado de pesquisa.
- **Erro relevante:** um toque atribuído ao jogador errado ou o ponto final indevido. A recuperação permanece junto às ações de ponto e atua sobre todo o histórico, inclusive após vitória da partida.

## Modelo da tarefa

Ponto → placar do set e total de sets → eventual fecho do set → próximo set ou vitória da partida. A ação Desfazer remove o último ponto e recompõe a partida. Nova partida pede confirmação porque apaga o registo local. Sets concluídos permanecem numa súmula. O estado inicial é 0–0, sem atribuir pontos fictícios silenciosamente.

## Estudo visual — seleção pendente

`direction-study.html` contém três espécimes com o mesmo conteúdo: Clara 8–6 Ivo no set 2; sets 1–0; set anterior 11–9; ações de ponto e desfazer.

1. **Duas metades:** a oposição dos jogadores gera campos contíguos, grande escala serifada e botões que ocupam cada metade. Azul-escuro estrutura a leitura; tonalidade clara diferencia áreas sem funcionar como único sinal de liderança.
2. **Marcador de bancada:** módulos de números condensados, nomes em caixa alta e anotações monoespaçadas. A superfície escura separa o ambiente dos valores claros e das ações. É uma associação visual proposta, não uma alegação histórica.
3. **Súmula viva:** linhas de registo, nomes serifados e números sem serifa; alinhamento nome/sets/pontos/ação. A ausência de blocos individuais mantém a folha contínua.

As três alternativas foram construídas antes de selecionar uma. A seleção só ocorrerá após inspeção de capturas neutras fornecidas pelo avaliador. Fontes são famílias de sistema com fallbacks locais; não há fontes, imagens nem serviços remotos.

## Estado da validação

Estudo escrito, ainda não renderizado. Não há alegações de conformidade global, originalidade comprovada ou eficácia com participantes.
